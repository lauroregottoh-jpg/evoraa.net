/**
 * Mon bilan relationnel — templates locaux (pas de LLM).
 * Docs : docs/matching/
 */

import { ASSESSMENTS, type AssessmentSlug } from "@/lib/assessments/questionBank"
import {
  buildGrowthAxes,
  DIMENSION_LABELS,
  type GrowthAxis,
} from "@/lib/assessments/growth"
import type { DomainHighlight, ProfileReport, ReportTier } from "@/lib/matching/report/types"

const PILLAR_ORDER: AssessmentSlug[] = [
  "personality",
  "spiritual",
  "relationship",
  "couple_life",
  "finances",
]

const STRONG_THRESHOLD = 72

type Psychometric = {
  personality?: number | null
  spiritual?: number | null
  relationship?: number | null
  couple_life?: number | null
  finances?: number | null
  dimensions?: Partial<Record<AssessmentSlug, Record<string, number>>> | null
  pillars_completed?: number | null
} | null

function pillarScore(psych: Psychometric, slug: AssessmentSlug): number | null {
  if (!psych) return null
  const v = psych[slug]
  return typeof v === "number" ? v : null
}

function dimEntries(
  psych: Psychometric,
  slug: AssessmentSlug
): Array<{ id: string; score: number }> {
  const dims = psych?.dimensions?.[slug]
  if (!dims) return []
  return Object.entries(dims)
    .filter(([, s]) => typeof s === "number")
    .map(([id, score]) => ({ id, score: score as number }))
    .sort((a, b) => b.score - a.score)
}

function tipForAxis(axis: GrowthAxis | undefined): { title: string; advice: string; href: string } | null {
  if (!axis) return null
  return { title: axis.title, advice: axis.advice, href: axis.academyHref }
}

export function buildProfileReport(input: {
  firstName?: string | null
  psychometric: Psychometric
  isAlliance: boolean
}): ProfileReport {
  const name = (input.firstName || "").trim()
  const hello = name ? `${name}, ` : ""
  const axes = buildGrowthAxes(input.psychometric)
  const completedPillars = PILLAR_ORDER.filter((s) => pillarScore(input.psychometric, s) != null)
  const tier: ReportTier = input.isAlliance ? "alliance" : "discovery"

  const lightTips = axes.slice(0, input.isAlliance ? 6 : 3).map((a) => ({
    title: a.title,
    advice: a.advice,
    href: a.academyHref,
  }))

  if (!input.isAlliance) {
    return {
      tier,
      lightTips,
      highlights: [],
      ctaUpgrade: {
        label: "Débloquer Mon bilan relationnel (Alliance)",
        href: "/premium",
      },
    }
  }

  const strongDims: string[] = []
  for (const slug of completedPillars) {
    for (const d of dimEntries(input.psychometric, slug)) {
      if (d.score >= STRONG_THRESHOLD) {
        strongDims.push(DIMENSION_LABELS[d.id] ?? d.id.replace(/_/g, " "))
      }
    }
  }
  // Use top scores even if below threshold if none strong
  if (strongDims.length === 0) {
    for (const slug of completedPillars) {
      const top = dimEntries(input.psychometric, slug)[0]
      if (top) strongDims.push(DIMENSION_LABELS[top.id] ?? top.id.replace(/_/g, " "))
    }
  }

  const force1 = strongDims[0] || "votre engagement dans les questionnaires"
  const force2 = strongDims[1] || "votre sérieux relationnel"
  const weak1 = axes[0]?.dimensionLabel || "la communication"
  const weak2 = axes[1]?.dimensionLabel || "quelques points de discernement"

  const summary = `${hello}votre bilan en bref : une base solide sur ${force1} et ${force2}. Les questionnaires mettent surtout en lumière ${weak1}${axes[1] ? ` et ${weak2}` : ""} — des leviers concrets pour des échanges plus sereins.`

  const highlights: DomainHighlight[] = PILLAR_ORDER.map((slug) => {
    const pillarName = ASSESSMENTS[slug]?.name ?? slug
    const score = pillarScore(input.psychometric, slug)
    if (score == null) {
      return {
        pillar: slug,
        pillarName,
        incomplete: true,
        improvement: `Complétez le questionnaire « ${pillarName} » pour débloquer ce domaine.`,
      }
    }
    const dims = dimEntries(input.psychometric, slug)
    const best = dims[0]
    const worst = [...dims].sort((a, b) => a.score - b.score)[0]
    const axis = axes.find((a) => a.pillar === slug) || axes.find((a) => a.dimension === worst?.id)
    const tip = tipForAxis(axis)

    return {
      pillar: slug,
      pillarName,
      strength: best
        ? `Déjà solide (pilier ${Math.round(score)}%) — en particulier sur ${DIMENSION_LABELS[best.id] ?? best.id.replace(/_/g, " ")}.`
        : `Pilier à ${Math.round(score)}%.`,
      improvement: tip
        ? `${tip.title} : ${tip.advice}`
        : "Continuez à peaufiner ce domaine — la constance bâtit la confiance.",
      academyHref: tip?.href || "/academie-mariage",
    }
  })

  return {
    tier,
    summary,
    highlights,
    lightTips,
  }
}
