/**
 * Synthèse interne — spine de toute la prose (doc 181).
 */

import type { CoupleMap, DimensionReadingCard, InternalSynthesis, PrioritySpec } from "@/lib/couple/engine/types"

export function buildInternalSynthesis(args: {
  cards: DimensionReadingCard[]
  priorities: PrioritySpec[]
  coupleMap: CoupleMap
}): InternalSynthesis {
  const forces = args.cards
    .filter((c) => c.type === "force")
    .sort((a, b) => b.convergence - a.convergence)
    .slice(0, 3)

  const convergences = args.cards
    .filter((c) => c.convergenceLevel === "forte" || c.type === "force")
    .sort((a, b) => b.convergence - a.convergence)
    .slice(0, 3)

  const differences = args.cards
    .filter(
      (c) =>
        c.type === "clarification" ||
        c.type === "complementarite" ||
        c.type === "vigilance" ||
        c.type === "priorite"
    )
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 3)

  const vigilances = args.cards
    .filter((c) => c.type === "vigilance" || c.type === "priorite")
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 3)

  const contentPriorities = [
    ...new Set(args.priorities.map((p) => p.card.contentPriority)),
  ]

  return {
    forces: forces.length ? forces : convergences.slice(0, 3),
    convergences,
    differences,
    vigilances,
    priorities: args.priorities,
    dynamicsSentence: args.coupleMap.dynamicsSentence,
    contentPriorities,
  }
}
