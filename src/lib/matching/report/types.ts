/**
 * Mon bilan relationnel — types.
 * Kit docs : docs/rapport/ (+ DOSSIER RAPPORT.md)
 */

import type { ReportPillarId, ScoreBandId } from "@/lib/rapport/pillars"

export type ReportTier = "discovery" | "alliance" | "sovereign"

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
  /** Pilier dossier (DOSSIER RAPPORT) */
  reportPillarId?: ReportPillarId
  pillarName?: string
  dimensionLabel?: string
  score?: number
  scoreBand?: ScoreBandId
  scoreBandLabel?: string
}

export type ProfileReport = {
  tier: ReportTier
  summary?: string
  highlights: DomainHighlight[]
  lightTips: ProfileReportTip[]
  ctaUpgrade?: { label: string; href: string }
}
