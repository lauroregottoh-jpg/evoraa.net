import type { MatchableProfile } from "./types"
import {
  EXCELLENT_SCORE_MIN_PILLARS,
  HIGH_SCORE_MIN_PILLARS,
  MIN_RECOMMENDED_SCORE,
} from "./types"

const PILLARS = [
  "personality",
  "spiritual",
  "relationship",
  "couple_life",
  "finances",
] as const

/** Deux dimensions « matchent » si l'écart est faible. */
const DIMENSION_MATCH_THRESHOLD = 14

export type DimensionMatchStats = {
  matched: number
  compared: number
  sharedPillars: number
  /** 0–100 : proportion de dimensions alignées */
  matchRatio: number
  score: number
}

/**
 * Plus les dimensions (et donc les questions regroupées) s'alignent,
 * plus le score monte — jusqu'à 100 % si tout matche.
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

  for (const key of PILLARS) {
    const av = a[key]
    const bv = b[key]
    if (av == null || bv == null) continue
    sharedPillars += 1

    const aDims = a.dimensions?.[key]
    const bDims = b.dimensions?.[key]

    if (aDims && bDims) {
      const keys = Object.keys(aDims).filter((k) => typeof bDims[k] === "number")
      for (const dk of keys) {
        compared += 1
        const diff = Math.abs(Number(aDims[dk]) - Number(bDims[dk]))
        if (diff <= DIMENSION_MATCH_THRESHOLD) matched += 1
        else if (diff <= DIMENSION_MATCH_THRESHOLD + 10) matched += 0.4
      }
    } else {
      // Fallback : score global du pilier
      compared += 1
      const diff = Math.abs(Number(av) - Number(bv))
      if (diff <= 10) matched += 1
      else if (diff <= 20) matched += 0.45
    }

    // Petit bonus si le pilier entier est très proche
    if (Math.abs(Number(av) - Number(bv)) <= 8) pillarBonus += 1
  }

  if (compared === 0) return null

  const matchRatio = matched / compared
  // Score psychométrique : ratio de match (peut atteindre 100)
  let score = Math.round(matchRatio * 100)
  // Bonus léger si beaucoup de piliers sont proches (max +4)
  score = Math.min(100, score + Math.min(4, pillarBonus))

  return { matched: Math.round(matched * 10) / 10, compared, sharedPillars, matchRatio, score }
}

export function applyMatchConfidenceCaps(
  rawScore: number,
  sharedPillars: number,
  matchRatio: number
): number {
  let score = rawScore
  // Sans assez de questionnaires, on ne revendique pas 97 %+
  if (sharedPillars < 3) score = Math.min(score, 78)
  else if (sharedPillars < HIGH_SCORE_MIN_PILLARS) score = Math.min(score, 89)
  // 95–100 : les 5 piliers + très fort taux de dimensions alignées
  if (score >= 95 && sharedPillars < EXCELLENT_SCORE_MIN_PILLARS) {
    score = Math.min(score, 94)
  }
  if (score >= 97 && matchRatio < 0.92) {
    score = Math.min(score, 96)
  }
  if (score >= MIN_RECOMMENDED_SCORE) return score
  return score
}
