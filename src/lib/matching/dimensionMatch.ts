import type { DomainScore, MatchableProfile } from "./types"
import {
  EXCELLENT_SCORE_MIN_PILLARS,
  HIGH_SCORE_MIN_PILLARS,
  MIN_RECOMMENDED_SCORE,
} from "./types"
import { scoreDimensionPair } from "./dimensionModes"
import {
  evaluateInteractionRules,
  totalInteractionPenalty,
  type InteractionInsight,
} from "./interactionRules"

const PILLARS = [
  "personality",
  "spiritual",
  "relationship",
  "couple_life",
  "finances",
] as const

export type PillarKey = (typeof PILLARS)[number]

const DOMAIN_LABELS: Record<PillarKey, string> = {
  personality: "Personnalité",
  spiritual: "Foi & valeurs",
  relationship: "Communication",
  couple_life: "Foyer",
  finances: "Finances",
}

export type DimensionMatchStats = {
  matched: number
  compared: number
  sharedPillars: number
  /** 0–1 : proportion de dimensions « alignées » (rétrocompatible) */
  matchRatio: number
  /** Score psycho 0–100 après règles d'interaction */
  score: number
  domainScores: DomainScore[]
  insights: InteractionInsight[]
}

function domainStatus(score: number): DomainScore["status"] {
  if (score >= 78) return "strong"
  if (score >= 60) return "watch"
  return "risk"
}

function average(nums: number[]): number {
  if (!nums.length) return 0
  return nums.reduce((s, n) => s + n, 0) / nums.length
}

/**
 * Matching dimensionnel :
 * - modes align / floor / complement (plus seulement « écart faible »)
 * - scores par domaine (pilier)
 * - pénalités issues des règles d'interaction
 */
export function computeDimensionMatchScore(
  a: MatchableProfile["psychometric_results"],
  b: MatchableProfile["psychometric_results"]
): DimensionMatchStats | null {
  if (!a || !b) return null

  let matched = 0
  let compared = 0
  let sharedPillars = 0
  let pillarBonus = 0
  const domainScores: DomainScore[] = []
  const dimPairScores: number[] = []

  for (const key of PILLARS) {
    const av = a[key]
    const bv = b[key]
    if (av == null || bv == null) continue
    sharedPillars += 1

    const aDims = a.dimensions?.[key]
    const bDims = b.dimensions?.[key]
    const pillarDimScores: number[] = []

    if (aDims && bDims) {
      const keys = Object.keys(aDims).filter((k) => typeof bDims[k] === "number")
      for (const dk of keys) {
        compared += 1
        const pairScore = scoreDimensionPair(
          dk,
          Number(aDims[dk]),
          Number(bDims[dk])
        )
        pillarDimScores.push(pairScore)
        dimPairScores.push(pairScore)
        // Rétrocompat ratio « match » : score dimension ≥ 70 ≈ aligné
        if (pairScore >= 70) matched += 1
        else if (pairScore >= 55) matched += 0.45
      }
    } else {
      compared += 1
      const gap = Math.abs(Number(av) - Number(bv))
      const floor = Math.min(Number(av), Number(bv))
      const pairScore = Math.round(
        Math.max(0, Math.min(100, floor * 0.55 + (100 - gap) * 0.45))
      )
      pillarDimScores.push(pairScore)
      dimPairScores.push(pairScore)
      if (pairScore >= 70) matched += 1
      else if (pairScore >= 55) matched += 0.45
    }

    const pillarCompat =
      pillarDimScores.length > 0
        ? Math.round(average(pillarDimScores))
        : Math.round(
            Math.max(
              0,
              Math.min(100, 100 - Math.abs(Number(av) - Number(bv)))
            )
          )

    domainScores.push({
      id: key,
      label: DOMAIN_LABELS[key],
      score: pillarCompat,
      status: domainStatus(pillarCompat),
    })

    if (Math.abs(Number(av) - Number(bv)) <= 8) pillarBonus += 1
  }

  if (compared === 0 && sharedPillars === 0) return null
  if (dimPairScores.length === 0 && domainScores.length === 0) return null

  const matchRatio = compared > 0 ? matched / compared : 0
  let score = Math.round(
    dimPairScores.length > 0
      ? average(dimPairScores)
      : average(domainScores.map((d) => d.score))
  )
  score = Math.min(100, score + Math.min(4, pillarBonus))

  const insights = evaluateInteractionRules(a, b)
  const penalty = totalInteractionPenalty(insights)
  score = Math.max(0, score - penalty)

  // Domaines « risk » abaissent légèrement le score global si pas déjà pénalisé fort
  const riskDomains = domainScores.filter((d) => d.status === "risk").length
  if (riskDomains >= 2 && penalty < 8) {
    score = Math.max(0, score - riskDomains * 2)
  }

  return {
    matched: Math.round(matched * 10) / 10,
    compared,
    sharedPillars,
    matchRatio,
    score: Math.round(score),
    domainScores,
    insights,
  }
}

export function applyMatchConfidenceCaps(
  rawScore: number,
  sharedPillars: number,
  matchRatio: number
): number {
  let score = rawScore
  if (sharedPillars < 3) score = Math.min(score, 78)
  else if (sharedPillars < HIGH_SCORE_MIN_PILLARS) score = Math.min(score, 89)
  if (score >= 95 && sharedPillars < EXCELLENT_SCORE_MIN_PILLARS) {
    score = Math.min(score, 94)
  }
  if (score >= 97 && matchRatio < 0.92) {
    score = Math.min(score, 96)
  }
  if (score >= MIN_RECOMMENDED_SCORE) return score
  return score
}
