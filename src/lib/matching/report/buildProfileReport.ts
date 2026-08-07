/**
 * Mon bilan relationnel — templates locaux depuis DOSSIER RAPPORT (pas de LLM).
 * Docs : docs/rapport/ + docs/DOSSIER RAPPORT.md
 *
 * Alliance → Rapport Essentiel (5 000 FCFA)
 * Souverain (futur) → Rapport Premium (10 000 FCFA)
 * Découverte → aperçu (2–3 axes)
 */

import type { AssessmentSlug } from "@/lib/assessments/questionBank"
import type {
  ProfileReport,
  ReportOfferLabel,
  ReportPillarSection,
  ReportTier,
} from "@/lib/matching/report/types"
import {
  pickConclusion,
  pickEncouragement,
  pickIntroduction,
  pickScorePhrase,
} from "@/lib/rapport/formulations"
import {
  REPORT_PILLAR_ORDER,
  REPORT_PILLARS,
  scoreBand,
  SCORE_BAND_LABELS,
  type ReportPillarId,
  type ScoreBandId,
} from "@/lib/rapport/pillars"
import {
  computePillarScores,
  rankedPillars,
} from "@/lib/rapport/pillarScores"
import { selectOfficialRecommendations } from "@/lib/rapport/selectRecommendations"

type Psychometric = {
  personality?: number | null
  spiritual?: number | null
  relationship?: number | null
  couple_life?: number | null
  finances?: number | null
  dimensions?: Partial<Record<AssessmentSlug, Record<string, number>>> | null
  pillars_completed?: number | null
} | null

function offerLabel(tier: ReportTier): ReportOfferLabel {
  if (tier === "sovereign") return "Rapport Premium"
  if (tier === "alliance") return "Rapport Personnalisé"
  return "Aperçu"
}

function bandPhraseKey(band: ScoreBandId): "force" | "mid" | "low" {
  if (band === "force_majeure" || band === "bon_equilibre") return "force"
  if (band === "en_developpement") return "mid"
  return "low"
}

function recoCountForBand(band: ScoreBandId, tier: ReportTier): number {
  // DOSSIER §3 règle 7 + Essentiel vs Premium
  const base =
    band === "axe_prioritaire"
      ? 5
      : band === "en_developpement"
        ? 4
        : band === "bon_equilibre"
          ? 2
          : 1
  if (tier === "discovery") return Math.min(1, base)
  if (tier === "alliance") return Math.min(base, 3)
  return Math.min(base, 4)
}

function buildPillarSection(input: {
  id: ReportPillarId
  score: number | null
  tips: ReturnType<typeof selectOfficialRecommendations>
  seedKey: string
  tier: ReportTier
}): ReportPillarSection {
  const meta = REPORT_PILLARS[input.id]
  const band =
    input.score != null ? scoreBand(input.score) : undefined
  const bandLabel = band ? SCORE_BAND_LABELS[band] : undefined
  const phraseBand = band ? bandPhraseKey(band) : "mid"
  const revelation = pickScorePhrase(phraseBand, `${input.seedKey}:${input.id}`)

  const strengths: string[] = []
  const vigilances: string[] = []
  if (band === "force_majeure" || band === "bon_equilibre") {
    strengths.push(
      "Les réponses suggèrent des ressources solides dans cette dimension."
    )
    if (band === "bon_equilibre") {
      vigilances.push(
        "Des améliorations restent possibles pour consolider ce point fort."
      )
    } else {
      strengths.push(
        "Cette dimension peut servir d’appui dans vos relations et votre discernement."
      )
    }
  } else if (band === "en_developpement") {
    strengths.push(
      "Des bases intéressantes sont déjà présentes et méritent d’être renforcées."
    )
    vigilances.push(
      "Certaines habitudes restent encore instables dans ce domaine."
    )
  } else if (band === "axe_prioritaire") {
    vigilances.push(
      "Cette dimension apparaît comme une fragilité actuelle — sans être une limite définitive."
    )
    strengths.push(
      "Vous pouvez progresser ici avec des actions simples et régulières."
    )
  } else {
    strengths.push(
      "Complétez les questionnaires liés pour affiner cette lecture."
    )
  }

  const maxRecos = band
    ? recoCountForBand(band, input.tier)
    : input.tier === "discovery"
      ? 1
      : 2
  const recommendations = input.tips
    .filter((t) => t.reportPillarId === input.id)
    .slice(0, maxRecos)

  return {
    id: input.id,
    label: meta.label,
    shortLabel: meta.shortLabel,
    score: input.score,
    scoreBand: band,
    scoreBandLabel: bandLabel,
    summary:
      input.score != null
        ? `Score observé : ${input.score}/100${bandLabel ? ` — ${bandLabel}` : ""}.`
        : "Score non disponible pour l’instant.",
    revelation,
    strengths,
    vigilances,
    recommendations,
    encouragement: pickEncouragement(`${input.seedKey}:${input.id}:e`),
  }
}

export function buildProfileReport(input: {
  firstName?: string | null
  psychometric: Psychometric
  isAlliance: boolean
  /** Préparé pour Rapport Premium (10 000) — non vendu tant que non branché */
  isSovereign?: boolean
}): ProfileReport {
  const tier: ReportTier = input.isSovereign
    ? "sovereign"
    : input.isAlliance
      ? "alliance"
      : "discovery"

  const seedKey = `${input.firstName || "membre"}:${tier}`
  const pillarScores = computePillarScores(input.psychometric)
  const ranked = rankedPillars(pillarScores)

  const lightTips = selectOfficialRecommendations({
    dimensions: input.psychometric?.dimensions,
    tier,
  })

  if (tier === "discovery") {
    return {
      tier,
      offerLabel: offerLabel(tier),
      introduction: pickIntroduction(seedKey),
      lightTips,
      highlights: [],
      ctaUpgrade: {
        label: "Débloquer mon Rapport Personnalisé (Alliance)",
        href: "/premium",
      },
    }
  }

  const strengths = ranked.slice(0, 2).map((p) => ({
    id: p.id,
    label: REPORT_PILLARS[p.id].label,
    score: p.score,
  }))
  const priorities = [...ranked]
    .sort((a, b) => a.score - b.score)
    .slice(0, 2)
    .map((p) => ({
      id: p.id,
      label: REPORT_PILLARS[p.id].label,
      score: p.score,
    }))

  const overviewBody =
    strengths.length && priorities.length
      ? `Les résultats mettent surtout en avant ${strengths
          .map((s) => REPORT_PILLARS[s.id].shortLabel.toLowerCase())
          .join(" et ")}. Les axes prioritaires concernent ${priorities
          .map((p) => REPORT_PILLARS[p.id].shortLabel.toLowerCase())
          .join(" et ")}.`
      : "Continuez vos questionnaires pour affiner la présentation générale de votre profil."

  // Prefer short human labels (not "Compatibilité humaine")
  const strengthsLabeled = strengths.map((s) => ({
    ...s,
    label: REPORT_PILLARS[s.id].shortLabel,
  }))
  const prioritiesLabeled = priorities.map((p) => ({
    ...p,
    label: REPORT_PILLARS[p.id].shortLabel,
  }))

  const pillars = REPORT_PILLAR_ORDER.map((id) =>
    buildPillarSection({
      id,
      score: pillarScores[id],
      tips: lightTips,
      seedKey,
      tier,
    })
  )

  const highlights = pillars.map((p) => ({
    pillar: p.id,
    pillarName: p.label,
    strength: p.strengths[0],
    improvement: p.vigilances[0] || p.recommendations[0]?.title,
  }))

  return {
    tier,
    offerLabel: offerLabel(tier),
    introduction: pickIntroduction(seedKey),
    overview: {
      strengths: strengthsLabeled,
      priorities: prioritiesLabeled,
      body: overviewBody,
    },
    pillars,
    conclusion: pickConclusion(seedKey),
    summary: overviewBody,
    highlights,
    lightTips,
  }
}
