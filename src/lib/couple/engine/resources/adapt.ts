/**
 * Adaptation de surface — méthode inchangée (doc 133 / Bibliothèque).
 */

import type { CatalogResource, PrioritySpec, SelectedResource } from "@/lib/couple/engine/types"
import { dimensionToDomain } from "@/lib/couple/engine/resources/catalog"

export function adaptResource(
  resource: CatalogResource,
  ctx: {
    names: { nameA: string; nameB: string }
    priorities: PrioritySpec[]
    dynamicsSentence: string
  }
): SelectedResource {
  const related = ctx.priorities.find((p) => {
    const d = dimensionToDomain(p.card.dimension)
    return resource.domain === d || resource.domains.includes(d)
  })

  const adaptedWhy = related
    ? `Pour ${ctx.names.nameA} & ${ctx.names.nameB}, sur « ${related.card.label} » : ${resource.why}`
    : resource.why

  const adaptedQuestions =
    related && related.card.pair
      ? [...resource.questions, `Lien avec « ${related.card.label} » : qu’est-ce qui diffère vraiment pour nous ?`]
      : resource.questions

  return {
    resource,
    versionPinned: resource.version,
    adaptedWhy,
    adaptedSteps: resource.steps,
    adaptedQuestions,
  }
}
