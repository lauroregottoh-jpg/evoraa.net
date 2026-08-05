/**
 * Rapport de croissance — Mon bilan relationnel.
 * Kit docs : docs/matching/
 */

export type ReportTier = "discovery" | "alliance" | "sovereign"

export type DomainHighlight = {
  pillar: string
  pillarName: string
  strength?: string
  improvement?: string
  academyHref?: string
  incomplete?: boolean
}

export type ProfileReport = {
  tier: ReportTier
  summary?: string
  highlights: DomainHighlight[]
  lightTips: Array<{ title: string; advice: string; href?: string }>
  ctaUpgrade?: { label: string; href: string }
}
