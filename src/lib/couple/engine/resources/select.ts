/**
 * Sélection de ressources — pertinence > personnalisation > progression > quantité.
 */

import { isPremiumPlusOffer, type CoupleOfferId } from "@/lib/couple/offers"
import {
  RESOURCE_CATALOG,
  dimensionToDomain,
} from "@/lib/couple/engine/resources/catalog"
import { adaptResource } from "@/lib/couple/engine/resources/adapt"
import type {
  CatalogResource,
  InternalSynthesis,
  PrioritySpec,
  SelectedResource,
} from "@/lib/couple/engine/types"
import type { CoupleMap } from "@/lib/couple/engine/types"

function scoreResource(
  r: CatalogResource,
  synthesis: InternalSynthesis,
  map: CoupleMap,
  offerId: CoupleOfferId
): number {
  const isPP = isPremiumPlusOffer(offerId)
  if (r.minOffer === "premium_plus" && !isPP) return -1

  let s = 0
  const priorityDomains = new Set(
    synthesis.priorities.map((p) => dimensionToDomain(p.card.dimension))
  )
  if (priorityDomains.has(r.domain)) s += 40
  for (const d of r.domains) {
    if (priorityDomains.has(d)) s += 15
  }
  for (const t of r.tags) {
    if (map.profileTags.includes(t)) s += 10
  }
  if (r.format === "exercice") s += 5
  if (r.format === "carte") s += 3
  if (isPP && r.premiumPlus) s += 8
  if (!isPP && r.premiumPlus) return -1
  return s
}

function pickNonRedundant(
  scored: { r: CatalogResource; score: number }[],
  max: number
): CatalogResource[] {
  const out: CatalogResource[] = []
  const usedDomains = new Set<string>()
  const usedIds = new Set<string>()

  for (const { r, score } of scored) {
    if (score < 0) continue
    if (out.length >= max) break
    if (usedIds.has(r.id)) continue
    if (r.incompatibleWith.some((id) => usedIds.has(id))) continue
    // éviter 3 exercices identiques même domaine d’affilée
    const domainCount = out.filter((x) => x.domain === r.domain).length
    if (domainCount >= 2 && r.format === "exercice") continue
    out.push(r)
    usedIds.add(r.id)
    usedDomains.add(r.domain)
  }
  return out
}

export function selectResources(args: {
  offerId: CoupleOfferId
  synthesis: InternalSynthesis
  coupleMap: CoupleMap
  names: { nameA: string; nameB: string }
  priorities: PrioritySpec[]
}): SelectedResource[] {
  const isPP = isPremiumPlusOffer(args.offerId)
  const scored = RESOURCE_CATALOG.map((r) => ({
    r,
    score: scoreResource(r, args.synthesis, args.coupleMap, args.offerId),
  })).sort((a, b) => b.score - a.score)

  const mainMax = isPP ? 7 : 5
  const picked = pickNonRedundant(scored, mainMax)

  // Garantir au moins une ressource par priorité
  for (const p of args.priorities) {
    const domain = dimensionToDomain(p.card.dimension)
    if (picked.some((r) => r.domain === domain || r.domains.includes(domain)))
      continue
    const fallback = RESOURCE_CATALOG.find(
      (r) =>
        (r.domain === domain || r.domains.includes(domain)) &&
        (r.minOffer === "essential" || isPP)
    )
    if (fallback && !picked.find((x) => x.id === fallback.id)) {
      picked.push(fallback)
    }
  }

  // Cartes : 3–6
  const cards = scored
    .filter((x) => x.r.format === "carte" && x.score >= 0)
    .map((x) => x.r)
    .filter((r) => !picked.find((p) => p.id === r.id))
    .slice(0, isPP ? 6 : 4)
  for (const c of cards) {
    if (picked.length >= (isPP ? 12 : 8)) break
    picked.push(c)
  }

  // PP : ajouter un protocole si priorités fortes
  if (isPP && !picked.some((r) => r.format === "protocole")) {
    const proto = RESOURCE_CATALOG.find((r) => r.format === "protocole")
    if (proto) picked.push(proto)
  }

  // Attacher ids aux priorités
  for (const p of args.priorities) {
    const domain = dimensionToDomain(p.card.dimension)
    p.resourceIds = picked
      .filter((r) => r.domain === domain || r.domains.includes(domain))
      .slice(0, 2)
      .map((r) => r.id)
  }

  return picked.map((r) =>
    adaptResource(r, {
      names: args.names,
      priorities: args.priorities,
      dynamicsSentence: args.coupleMap.dynamicsSentence,
    })
  )
}
