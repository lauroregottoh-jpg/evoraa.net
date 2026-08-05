/**
 * Mon bilan relationnel — templates locaux depuis DOSSIER RAPPORT (pas de LLM).
 * Docs : docs/rapport/ + docs/DOSSIER RAPPORT.md
 */

import type { AssessmentSlug } from "@/lib/assessments/questionBank"
import type { ProfileReport, ReportTier } from "@/lib/matching/report/types"
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

export function buildProfileReport(input: {
  firstName?: string | null
  psychometric: Psychometric
  isAlliance: boolean
}): ProfileReport {
  const tier: ReportTier = input.isAlliance ? "alliance" : "discovery"

  const lightTips = selectOfficialRecommendations({
    dimensions: input.psychometric?.dimensions,
    tier,
  })

  if (!input.isAlliance) {
    return {
      tier,
      lightTips,
      highlights: [],
      ctaUpgrade: {
        label: "Débloquer tous vos axes d’amélioration (Alliance)",
        href: "/premium",
      },
    }
  }

  return {
    tier,
    highlights: [],
    lightTips,
  }
}
