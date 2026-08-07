/**
 * Agrège les scores par pilier dossier (DOSSIER RAPPORT + 00_remap.md).
 */

import type { AssessmentSlug } from "@/lib/assessments/questionBank"
import {
  REPORT_PILLAR_ORDER,
  resolveReportPillar,
  type ReportPillarId,
} from "@/lib/rapport/pillars"

type Psychometric = {
  personality?: number | null
  spiritual?: number | null
  relationship?: number | null
  couple_life?: number | null
  finances?: number | null
  dimensions?: Partial<Record<AssessmentSlug, Record<string, number>>> | null
} | null

const SLUG_PRIMARY: Record<ReportPillarId, AssessmentSlug> = {
  relationnel: "relationship",
  spirituel: "spiritual",
  projets_de_vie: "couple_life",
  valeurs: "finances",
  humain: "personality",
}

export type PillarScoreMap = Record<ReportPillarId, number | null>

/** Moyenne des dimensions mappées au pilier ; sinon score du slug principal. */
export function computePillarScores(psychometric: Psychometric): PillarScoreMap {
  const buckets: Record<ReportPillarId, number[]> = {
    relationnel: [],
    spirituel: [],
    projets_de_vie: [],
    valeurs: [],
    humain: [],
  }

  const dimensions = psychometric?.dimensions
  if (dimensions) {
    for (const [slug, dims] of Object.entries(dimensions)) {
      if (!dims) continue
      for (const [dimension, score] of Object.entries(dims)) {
        if (typeof score !== "number") continue
        const pillar = resolveReportPillar(slug as AssessmentSlug, dimension)
        buckets[pillar].push(score)
      }
    }
  }

  const out = {} as PillarScoreMap
  for (const pillar of REPORT_PILLAR_ORDER) {
    const list = buckets[pillar]
    if (list.length > 0) {
      out[pillar] = Math.round(list.reduce((a, b) => a + b, 0) / list.length)
      continue
    }
    const slug = SLUG_PRIMARY[pillar]
    const fallback = psychometric?.[slug]
    out[pillar] = typeof fallback === "number" ? Math.round(fallback) : null
  }
  return out
}

export function rankedPillars(
  scores: PillarScoreMap
): { id: ReportPillarId; score: number }[] {
  return REPORT_PILLAR_ORDER.map((id) => ({ id, score: scores[id] }))
    .filter((p): p is { id: ReportPillarId; score: number } => p.score != null)
    .sort((a, b) => b.score - a.score)
}
