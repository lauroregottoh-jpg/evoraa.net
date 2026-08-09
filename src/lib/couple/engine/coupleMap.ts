/**
 * Carte couple interne — doc 133.
 */

import { DIMENSION_LIBRARY } from "@/lib/couple/interpretations"
import type { CoupleScoringResult } from "@/lib/couple/scoring"
import type {
  CoupleContext,
  CoupleMap,
  DimensionReadingCard,
  PartnerProfile,
  ProfileTag,
} from "@/lib/couple/engine/types"

function partnerProfile(
  seat: "A" | "B",
  name: string,
  scoring: CoupleScoringResult
): PartnerProfile {
  const scored = [...scoring.dimensions].sort((x, y) => {
    const sx = seat === "A" ? x.scoreA : x.scoreB
    const sy = seat === "A" ? y.scoreA : y.scoreB
    return sy - sx
  })
  const highs = scored.slice(0, 4)
  const lows = [...scored]
    .sort((x, y) => {
      const sx = seat === "A" ? x.scoreA : x.scoreB
      const sy = seat === "A" ? y.scoreA : y.scoreB
      return sx - sy
    })
    .slice(0, 3)

  const trends = highs.map((d) => {
    const lib = DIMENSION_LIBRARY[d.dimension]
    return `${d.label} : zone d’aise relative.`
  })
  const needs = lows.map((d) => {
    return `${d.label} : besoin de clarté ou de sécurité à nommer.`
  })
  const sensitivities = lows.map((d) => d.label)

  return {
    seat,
    name,
    highDimensions: highs.map((d) => d.dimension),
    lowDimensions: lows.map((d) => d.dimension),
    trends,
    needs,
    sensitivities,
  }
}

function buildProfileTags(cards: DimensionReadingCard[]): ProfileTag[] {
  const tags = new Set<ProfileTag>()
  for (const c of cards) {
    if (c.gapLevel === "faible") tags.add("ecart_faible")
    if (c.gapLevel === "modere") tags.add("ecart_modere")
    if (c.gapLevel === "important") tags.add("ecart_important")
    if (c.convergenceLevel === "forte") tags.add("forte_convergence")
    if (c.gapLevel === "important") tags.add("forte_difference")
    if (c.type === "clarification") tags.add("besoin_clarification")
    if (c.type === "priorite") tags.add("priorite_elevee")
    if (c.dimension === "conflits" && c.gapLevel !== "faible")
      tags.add("besoin_reconnexion")
    if (
      (c.dimension === "finances" || c.dimension === "projet_vie") &&
      c.gapLevel === "important"
    )
      tags.add("besoin_structure")
    if (c.dimension === "mariage" && c.gapLevel !== "faible")
      tags.add("preparation_mariage")
  }
  return [...tags]
}

export function buildCoupleMap(args: {
  scoring: CoupleScoringResult
  names: { nameA: string; nameB: string }
  cards: DimensionReadingCard[]
  context?: CoupleContext
}): CoupleMap {
  const context = args.context ?? "cheminement"
  const profileA = partnerProfile("A", args.names.nameA, args.scoring)
  const profileB = partnerProfile("B", args.names.nameB, args.scoring)

  const topGaps = [...args.cards]
    .filter((c) => c.gapLevel !== "faible")
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 2)

  const dynamicsSentence =
    topGaps.length === 0
      ? `${args.names.nameA} et ${args.names.nameB} créent une dynamique plutôt alignée : l’enjeu est d’entretenir volontairement ce qui fonctionne.`
      : topGaps.length === 1
        ? `Quand le sujet « ${topGaps[0]!.label} » revient, un motif se répète : l’un accélère ou sécurise, l’autre ralentit ou presse — à nommer sans procès.`
        : `Deux motifs reviennent souvent : « ${topGaps[0]!.label} » et « ${topGaps[1]!.label} ». Ce n’est pas « qui a tort » : c’est un système à deux à rendre visible.`

  return {
    context,
    profileA,
    profileB,
    dynamicsSentence,
    profileTags: buildProfileTags(args.cards),
  }
}
