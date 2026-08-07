/**
 * Mon bilan relationnel — types.
 * Source : docs/DOSSIER RAPPORT.md + docs/rapport/
 */

import type { ReportPillarId, ScoreBandId } from "@/lib/rapport/pillars"

export type ReportTier = "discovery" | "alliance" | "sovereign"

export type ReportOfferLabel =
  | "Aperçu"
  | "Rapport Personnalisé"
  | "Rapport Premium"

export type DomainHighlight = {
  pillar: string
  pillarName: string
  strength?: string
  improvement?: string
  academyHref?: string
  incomplete?: boolean
}

export type ProfileReportTip = {
  id?: string
  title: string
  advice: string
  why?: string
  href?: string
  /** Extension Premium (dossier) — affichée si tier sovereign */
  premium?: string
  reportPillarId?: ReportPillarId
  pillarName?: string
  dimensionLabel?: string
  score?: number
  scoreBand?: ScoreBandId
  scoreBandLabel?: string
}

export type ReportPillarSection = {
  id: ReportPillarId
  label: string
  shortLabel: string
  score: number | null
  scoreBand?: ScoreBandId
  scoreBandLabel?: string
  summary: string
  revelation: string
  strengths: string[]
  vigilances: string[]
  recommendations: ProfileReportTip[]
  encouragement: string
}

export type ReportOverviewItem = {
  id: ReportPillarId
  label: string
  score: number
}

export type ProfileReport = {
  tier: ReportTier
  offerLabel: ReportOfferLabel
  /** §5 structure Essentiel */
  introduction?: string
  overview?: {
    strengths: ReportOverviewItem[]
    priorities: ReportOverviewItem[]
    body: string
  }
  pillars?: ReportPillarSection[]
  conclusion?: string
  /** Compat cartes / aperçu — axes prioritaires aplatis */
  summary?: string
  highlights: DomainHighlight[]
  lightTips: ProfileReportTip[]
  ctaUpgrade?: { label: string; href: string }
}
