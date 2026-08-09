/**
 * Priorisation — max 3 priorités (docs 181 / 133).
 */

import { interpretDimension } from "@/lib/couple/interpretations"
import type {
  DimensionReadingCard,
  PrioritySpec,
} from "@/lib/couple/engine/types"

function priorityScore(c: DimensionReadingCard): number {
  let s = c.gap
  if (c.impact === "important") s += 25
  else if (c.impact === "modere") s += 12
  if (c.type === "priorite") s += 20
  else if (c.type === "vigilance") s += 12
  if (c.contentPriority === "A") s += 15
  else if (c.contentPriority === "B") s += 8
  return s
}

export function prioritizeDimensions(
  cards: DimensionReadingCard[],
  names: { nameA: string; nameB: string }
): PrioritySpec[] {
  const candidates = cards
    .filter(
      (c) =>
        c.type === "priorite" ||
        c.type === "vigilance" ||
        c.type === "clarification" ||
        c.gapLevel === "important" ||
        c.gapLevel === "modere"
    )
    .sort((a, b) => priorityScore(b) - priorityScore(a))

  const top = candidates.slice(0, 3)
  return top.map((card, i) => {
    const ix = interpretDimension(card.pair, names)
    return {
      card,
      rank: (i + 1) as 1 | 2 | 3,
      why: ix.meaning,
      firstAction:
        ix.actions[0] ??
        "Clarifier ce sujet à deux, 20 minutes, une seule décision.",
      resourceIds: [],
    }
  })
}
