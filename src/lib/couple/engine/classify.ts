/**
 * Classification des dimensions — doc 181 (carte de lecture).
 */

import type { DimensionPairScore } from "@/lib/couple/scoring"
import {
  HIGH_IMPACT_DIMENSIONS,
  type AttentionLevel,
  type ContentPriority,
  type ConvergenceLevel,
  type DifferenceClass,
  type DimensionReadingCard,
  type DimensionType,
  type GapLevel,
  type ImpactLevel,
} from "@/lib/couple/engine/types"

export function gapLevelFromPts(gap: number): GapLevel {
  if (gap >= 35) return "important"
  if (gap >= 18) return "modere"
  return "faible"
}

export function convergenceLevelFromPct(c: number): ConvergenceLevel {
  if (c >= 85) return "forte"
  if (c >= 60) return "moderee"
  return "faible"
}

function impactFor(d: DimensionPairScore, gap: GapLevel): ImpactLevel {
  const highDomain = HIGH_IMPACT_DIMENSIONS.includes(d.dimension)
  if (gap === "important" && highDomain) return "important"
  if (gap === "important" || (gap === "modere" && highDomain)) return "modere"
  if (gap === "faible" && !highDomain) return "faible"
  return gap === "modere" ? "modere" : "faible"
}

function classifyType(
  d: DimensionPairScore,
  gap: GapLevel,
  conv: ConvergenceLevel,
  impact: ImpactLevel
): DimensionType {
  const avg = (d.scoreA + d.scoreB) / 2
  if (d.status === "vigilance" || (gap === "important" && impact === "important")) {
    return impact === "important" ? "priorite" : "vigilance"
  }
  if (conv === "forte" && avg >= 55 && gap === "faible") return "force"
  if (gap === "modere" && avg >= 45) return "complementarite"
  if (gap === "modere" || gap === "important") return "clarification"
  if (conv === "forte") return "force"
  return "clarification"
}

function attentionFor(type: DimensionType): AttentionLevel {
  switch (type) {
    case "force":
      return "a_preserver"
    case "complementarite":
      return "a_explorer"
    case "clarification":
      return "a_clarifier"
    case "vigilance":
    case "priorite":
      return "a_travailler"
  }
}

function contentPriorityFor(
  type: DimensionType,
  impact: ImpactLevel
): ContentPriority {
  if (type === "priorite" || (type === "vigilance" && impact === "important"))
    return "A"
  if (type === "vigilance" || type === "clarification") return "B"
  if (type === "complementarite") return "C"
  if (type === "force") return "D"
  return "E"
}

function differenceClassFor(
  type: DimensionType,
  gap: GapLevel
): DifferenceClass {
  if (type === "priorite") return "priorite_travail"
  if (type === "vigilance" || gap === "important") return "significative"
  if (gap === "modere" || type === "clarification") return "a_clarifier"
  return "legere"
}

export function classifyDimensions(
  dimensions: DimensionPairScore[]
): DimensionReadingCard[] {
  return dimensions.map((d) => {
    const gapLevel = gapLevelFromPts(d.gap)
    const convergenceLevel = convergenceLevelFromPct(d.convergence)
    const impact = impactFor(d, gapLevel)
    const type = classifyType(d, gapLevel, convergenceLevel, impact)
    return {
      dimension: d.dimension,
      label: d.label,
      scoreA: d.scoreA,
      scoreB: d.scoreB,
      gap: d.gap,
      convergence: d.convergence,
      gapLevel,
      convergenceLevel,
      impact,
      type,
      attention: attentionFor(type),
      contentPriority: contentPriorityFor(type, impact),
      differenceClass: differenceClassFor(type, gapLevel),
      pair: d,
    }
  })
}
