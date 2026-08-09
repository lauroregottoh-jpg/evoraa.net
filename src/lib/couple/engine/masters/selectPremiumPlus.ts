/**
 * Sélection modules Premium Plus — alignés priorités + dynamique.
 */

import type { CoupleDimensionId } from "@/lib/couple/questionBank"
import type { EngineResult } from "@/lib/couple/engine/types"
import type { HarmonizedPlan } from "@/lib/couple/engine/masters/harmonize"
import {
  PREMIUM_PLUS_MODULES,
  type PpModule,
} from "@/lib/couple/engine/masters/premiumPlusModules"

function scoreModule(
  mod: PpModule,
  priorityDims: CoupleDimensionId[],
  tags: HarmonizedPlan["differenceChapters"]
): number {
  let s = 0
  for (const d of priorityDims) {
    if (mod.domains.includes(d)) s += 10
  }
  if (mod.tags.includes("securite_avance")) s += 6
  if (
    priorityDims.some((d) =>
      ["communication", "conflits", "emotions"].includes(d)
    ) &&
    mod.tags.includes("communication")
  )
    s += 5
  if (
    priorityDims.includes("finances") &&
    mod.tags.includes("finances")
  )
    s += 8
  if (
    priorityDims.some((d) =>
      ["famille", "limites", "roles"].includes(d)
    ) &&
    mod.tags.includes("frontieres")
  )
    s += 7
  if (
    priorityDims.some((d) =>
      ["affection", "intimite"].includes(d)
    ) &&
    mod.tags.includes("connexion")
  )
    s += 7
  if (tags.length >= 2 && mod.id === "pp-dynamique-profonde") s += 12
  return s
}

export function selectPremiumPlusModules(args: {
  engine: EngineResult
  plan: HarmonizedPlan
  max?: number
}): PpModule[] {
  const max = args.max ?? 5
  const priorityDims = args.engine.synthesis.priorities.map(
    (p) => p.card.dimension
  )
  const ranked = [...PREMIUM_PLUS_MODULES]
    .map((m) => ({
      m,
      s: scoreModule(m, priorityDims, args.plan.differenceChapters),
    }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)

  const picked: PpModule[] = []
  const seen = new Set<string>()
  for (const { m } of ranked) {
    if (picked.length >= max) break
    if (seen.has(m.id)) continue
    seen.add(m.id)
    picked.push(m)
  }

  // Toujours au moins dynamique + 1 exercice si priorités existent
  if (
    args.plan.differenceChapters.length > 0 &&
    !picked.find((p) => p.id === "pp-dynamique-profonde")
  ) {
    const dyn = PREMIUM_PLUS_MODULES.find((p) => p.id === "pp-dynamique-profonde")
    if (dyn) picked.unshift(dyn)
  }
  if (
    !picked.find((p) => p.id === "pp-conditions-pret") &&
    priorityDims.some((d) =>
      ["finances", "projet_vie", "mariage", "carriere"].includes(d)
    )
  ) {
    const c = PREMIUM_PLUS_MODULES.find((p) => p.id === "pp-conditions-pret")
    if (c) picked.push(c)
  }

  return picked.slice(0, max)
}
