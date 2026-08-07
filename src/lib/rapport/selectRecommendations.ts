/**
 * Sélection officielle des recommandations du DOSSIER RAPPORT.
 * Règles : docs/DOSSIER RAPPORT.md §3 (max 5 Essentiel / 10 Premium, pas de doublons).
 */

import type { AssessmentSlug } from "@/lib/assessments/questionBank"
import { DIMENSION_LABELS } from "@/lib/assessments/growth"
import type { ProfileReportTip, ReportTier } from "@/lib/matching/report/types"
import {
  REPORT_PILLAR_ORDER,
  REPORT_PILLARS,
  resolveReportPillar,
  scoreBand,
  SCORE_BAND_LABELS,
  type ReportPillarId,
} from "@/lib/rapport/pillars"
import {
  OFFICIAL_RECOMMENDATIONS,
  RECOS_BY_PILLAR,
  type OfficialRecommendation,
} from "@/lib/rapport/recommendations.catalog"

const LOW_SCORE = 68

/** Domaines dossier ↔ dimensions code (scoring relationnel) */
const DOMAIN_KEYWORDS: Record<string, string[]> = {
  communication: [
    "communication",
    "écoute",
    "ecoute",
    "besoin",
    "exprimer",
    "discussion",
    "conversation",
  ],
  conflict: ["conflit", "désaccord", "desaccord", "dispute", "pause", "pardon"],
  emotional: [
    "émotion",
    "emotion",
    "affect",
    "ressenti",
    "colère",
    "colere",
    "frustration",
  ],
  partnership: ["partenariat", "décision", "decision", "ensemble", "confiance"],
  responsibility: ["fiabilité", "fiabilite", "engagement", "promesse", "crédibilité"],
}

const ACADEMY_BY_PILLAR: Record<ReportPillarId, string> = {
  relationnel: "/academie-mariage/dialogue",
  spirituel: "/academie-mariage/foi",
  projets_de_vie: "/academie-mariage/projet",
  valeurs: "/academie-mariage/finances",
  humain: "/academie-mariage/emotions",
}

type WeakDim = {
  slug: AssessmentSlug
  dimension: string
  score: number
  pillar: ReportPillarId
}

function collectWeakDims(
  dimensions: Partial<Record<AssessmentSlug, Record<string, number>>> | null | undefined
): WeakDim[] {
  if (!dimensions) return []
  const out: WeakDim[] = []
  for (const [slug, dims] of Object.entries(dimensions)) {
    if (!dims) continue
    for (const [dimension, score] of Object.entries(dims)) {
      if (typeof score !== "number" || score >= LOW_SCORE) continue
      out.push({
        slug: slug as AssessmentSlug,
        dimension,
        score,
        pillar: resolveReportPillar(slug as AssessmentSlug, dimension),
      })
    }
  }
  return out.sort((a, b) => a.score - b.score)
}

function scoreRecoForDim(reco: OfficialRecommendation, dim: WeakDim): number {
  let s = 0
  const hay = `${reco.domain} ${reco.title} ${reco.whenToUse} ${reco.advice}`.toLowerCase()
  const keys = DOMAIN_KEYWORDS[dim.dimension] ?? [
    dim.dimension.replace(/_/g, " "),
    (DIMENSION_LABELS[dim.dimension] ?? "").toLowerCase(),
  ]
  for (const k of keys) {
    if (k && hay.includes(k.toLowerCase())) s += 3
  }
  if (reco.priority?.toLowerCase().includes("très")) s += 2
  else if (reco.priority?.toLowerCase().includes("élev")) s += 1
  if (reco.source.startsWith("dossier_rel")) s += 1
  if (reco.source === "dossier_rel_A") s += 0.5
  return s
}

function pickForPillar(
  pillar: ReportPillarId,
  dims: WeakDim[],
  usedIds: Set<string>,
  usedTitles: Set<string>,
  max: number
): OfficialRecommendation[] {
  const bank = RECOS_BY_PILLAR[pillar] ?? []
  if (!bank.length || max <= 0) return []

  const pillarDims = dims.filter((d) => d.pillar === pillar)
  const scored = bank
    .filter((r) => !usedIds.has(r.id))
    .map((r) => {
      let best = pillarDims.length
        ? Math.max(...pillarDims.map((d) => scoreRecoForDim(r, d)), 0)
        : 0
      if (best === 0 && pillarDims[0]) {
        best = (pillarDims[0].score + r.id.charCodeAt(r.id.length - 1)) % 3
      }
      return { r, best }
    })
    .sort((a, b) => b.best - a.best || a.r.id.localeCompare(b.r.id))

  const picked: OfficialRecommendation[] = []
  for (const { r } of scored) {
    if (picked.length >= max) break
    const titleKey = r.title.toLowerCase().slice(0, 48)
    if (usedTitles.has(titleKey)) continue
    usedIds.add(r.id)
    usedTitles.add(titleKey)
    picked.push(r)
  }
  return picked
}

function toTip(
  reco: OfficialRecommendation,
  dimHint: WeakDim | undefined
): ProfileReportTip {
  const score = dimHint?.score
  const band = score != null ? scoreBand(score) : undefined
  return {
    id: reco.id,
    title: reco.title.replace(/\.$/, ""),
    advice: reco.advice.replace(/\n{3,}/g, "\n\n").trim(),
    why: reco.why || undefined,
    premium: reco.premium || undefined,
    href: ACADEMY_BY_PILLAR[reco.pillar],
    reportPillarId: reco.pillar,
    pillarName: REPORT_PILLARS[reco.pillar].label,
    dimensionLabel: dimHint
      ? DIMENSION_LABELS[dimHint.dimension] ?? dimHint.dimension
      : reco.domain !== "Général"
        ? reco.domain
        : undefined,
    score,
    scoreBand: band,
    scoreBandLabel: band ? SCORE_BAND_LABELS[band] : undefined,
  }
}

export function selectOfficialRecommendations(input: {
  dimensions?: Partial<Record<AssessmentSlug, Record<string, number>>> | null
  tier: ReportTier
}): ProfileReportTip[] {
  const weak = collectWeakDims(input.dimensions)
  const allDims = collectAllDims(input.dimensions)
  const maxTotal = input.tier === "discovery" ? 3 : input.tier === "alliance" ? 8 : 12
  const maxPerPillar = input.tier === "discovery" ? 1 : input.tier === "alliance" ? 2 : 3

  const usedIds = new Set<string>()
  const usedTitles = new Set<string>()
  const tips: ProfileReportTip[] = []

  const dimsForPriority = weak.length ? weak : allDims
  if (dimsForPriority.length === 0) return []

  const pillarPriority = [...REPORT_PILLAR_ORDER].sort((a, b) => {
    const sa = dimsForPriority.find((w) => w.pillar === a)?.score ?? 999
    const sb = dimsForPriority.find((w) => w.pillar === b)?.score ?? 999
    return sa - sb
  })

  for (const pillar of pillarPriority) {
    if (tips.length >= maxTotal) break
    const dims = (weak.length ? weak : allDims).filter((w) => w.pillar === pillar)
    if (!dims.length && input.tier !== "discovery") {
      // Consolidation : au moins une reco si le pilier a des dimensions (même score élevé)
      const strong = allDims.filter((w) => w.pillar === pillar)
      if (!strong.length) continue
      const room = Math.min(1, maxTotal - tips.length)
      const picked = pickForPillar(pillar, strong, usedIds, usedTitles, room)
      for (const reco of picked) tips.push(toTip(reco, strong[0]))
      continue
    }
    if (!dims.length) continue
    const room = Math.min(maxPerPillar, maxTotal - tips.length)
    const picked = pickForPillar(pillar, dims, usedIds, usedTitles, room)
    for (const reco of picked) {
      tips.push(toTip(reco, dims[0]))
    }
  }

  if (tips.length < maxTotal && weak.length) {
    const remaining = OFFICIAL_RECOMMENDATIONS.filter((r) => !usedIds.has(r.id))
      .map((r) => ({
        r,
        best: Math.max(...weak.map((d) => scoreRecoForDim(r, d)), 0),
      }))
      .sort((a, b) => b.best - a.best)
    for (const { r } of remaining) {
      if (tips.length >= maxTotal) break
      const titleKey = r.title.toLowerCase().slice(0, 48)
      if (usedTitles.has(titleKey)) continue
      usedIds.add(r.id)
      usedTitles.add(titleKey)
      const hint = weak.find((w) => w.pillar === r.pillar) ?? weak[0]
      tips.push(toTip(r, hint))
    }
  }

  return tips
}

function collectAllDims(
  dimensions: Partial<Record<AssessmentSlug, Record<string, number>>> | null | undefined
): WeakDim[] {
  if (!dimensions) return []
  const out: WeakDim[] = []
  for (const [slug, dims] of Object.entries(dimensions)) {
    if (!dims) continue
    for (const [dimension, score] of Object.entries(dims)) {
      if (typeof score !== "number") continue
      out.push({
        slug: slug as AssessmentSlug,
        dimension,
        score,
        pillar: resolveReportPillar(slug as AssessmentSlug, dimension),
      })
    }
  }
  return out.sort((a, b) => a.score - b.score)
}
