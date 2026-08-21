/**
 * CoupleInsightProfile — couche intermédiaire avant génération
 * (PROTOCOLE D'INJECTION DYNAMIQUE §8–9).
 */

import { COUPLE_DIMENSION_META, type CoupleDimensionId } from "@/lib/couple/questionBank"
import type { CoupleScoringResult } from "@/lib/couple/scoring"
import type {
  CoupleContext,
  DimensionReadingCard,
  EngineResult,
  InternalSynthesis,
} from "@/lib/couple/engine/types"
import type { CoupleReportNames } from "@/lib/couple/report"

export type InsightDimRow = {
  dimension: CoupleDimensionId
  label: string
  scoreA: number
  scoreB: number
  gap: number
  convergence: number
  patternA: string
  patternB: string
  priority: "high" | "medium" | "low"
}

export type CoupleInsightProfile = {
  names: CoupleReportNames
  context?: CoupleContext
  globalScore: number
  forces: InsightDimRow[]
  attentions: InsightDimRow[]
  needsA: string[]
  needsB: string[]
  dynamicsSentence: string
  priorityLabels: string[]
  /** Traçabilité : dims qui alimentent le rapport */
  sourceDimensionIds: CoupleDimensionId[]
}

function patternFor(score: number, side: "high" | "low"): string {
  if (side === "high") {
    if (score >= 80) return "security_or_clarity_first"
    if (score >= 60) return "balanced_engagement"
    return "reserved_or_cautious"
  }
  if (score <= 40) return "progress_or_openness_first"
  if (score <= 60) return "mixed_pace"
  return "engaged"
}

function rowFromCard(c: DimensionReadingCard, priority: InsightDimRow["priority"]): InsightDimRow {
  const higherA = c.scoreA >= c.scoreB
  return {
    dimension: c.dimension,
    label: c.label || COUPLE_DIMENSION_META[c.dimension].label,
    scoreA: c.scoreA,
    scoreB: c.scoreB,
    gap: c.gap,
    convergence: c.convergence,
    patternA: patternFor(c.scoreA, higherA ? "high" : "low"),
    patternB: patternFor(c.scoreB, higherA ? "low" : "high"),
    priority,
  }
}

export function buildCoupleInsightProfile(args: {
  names: CoupleReportNames
  scoring: CoupleScoringResult
  engine: EngineResult
  context?: CoupleContext
}): CoupleInsightProfile {
  const { synthesis } = args.engine
  const forceCards = (
    synthesis.forces.length
      ? synthesis.forces
      : synthesis.convergences.length
        ? synthesis.convergences
        : [...args.engine.cards].sort((a, b) => b.convergence - a.convergence)
  ).slice(0, 3)

  const forces = forceCards.map((c) => rowFromCard(c, "low"))

  const attentionCards = (
    synthesis.priorities.length
      ? synthesis.priorities.map((p) => p.card)
      : synthesis.differences.length
        ? synthesis.differences
        : [...args.engine.cards].sort((a, b) => b.gap - a.gap)
  ).slice(0, 3)

  const attentions = attentionCards.map((c) => rowFromCard(c, "high"))

  const needsA: string[] = []
  const needsB: string[] = []
  for (const a of attentions) {
    if (a.scoreA > a.scoreB + 15) {
      needsA.push(`sécuriser / clarifier · ${a.label}`)
      needsB.push(`avancer / concrétiser · ${a.label}`)
    } else if (a.scoreB > a.scoreA + 15) {
      needsB.push(`sécuriser / clarifier · ${a.label}`)
      needsA.push(`avancer / concrétiser · ${a.label}`)
    } else {
      needsA.push(`aligner · ${a.label}`)
      needsB.push(`aligner · ${a.label}`)
    }
  }

  return {
    names: args.names,
    context: args.context,
    globalScore: args.scoring.globalScore,
    forces,
    attentions,
    needsA: [...new Set(needsA)].slice(0, 4),
    needsB: [...new Set(needsB)].slice(0, 4),
    dynamicsSentence: synthesis.dynamicsSentence,
    priorityLabels: attentions.map((a) => a.label.toLowerCase()),
    sourceDimensionIds: [
      ...forces.map((f) => f.dimension),
      ...attentions.map((a) => a.dimension),
    ],
  }
}

/** Formate une ligne de convergence type maître. */
export function formatConvergenceBullet(row: InsightDimRow): string {
  return `- **${row.label} : ${row.scoreA} % / ${row.scoreB} %**`
}

/** Formate une ligne d’attention type maître (avec prénoms). */
export function formatAttentionBullet(
  row: InsightDimRow,
  nameA: string,
  nameB: string
): string {
  return `- **${row.label} : ${nameA} ${row.scoreA} % / ${nameB} ${row.scoreB} %**`
}

export function listPriorityPhrase(labels: string[]): string {
  if (labels.length === 0) return "certains domaines sensibles"
  if (labels.length === 1) return `**${labels[0]}**`
  if (labels.length === 2) return `**${labels[0]}** et **${labels[1]}**`
  const head = labels.slice(0, -1).map((l) => `**${l}**`).join(", ")
  return `${head} et **${labels[labels.length - 1]}**`
}
