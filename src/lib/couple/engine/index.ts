/**
 * Point d’entrée public du moteur.
 */

export { runCoupleEngine, runCoupleEngineFromAnswers } from "@/lib/couple/engine/pipeline"
export { classifyDimensions } from "@/lib/couple/engine/classify"
export { buildCoupleMap } from "@/lib/couple/engine/coupleMap"
export { prioritizeDimensions } from "@/lib/couple/engine/prioritize"
export { buildInternalSynthesis } from "@/lib/couple/engine/synthesis"
export { selectResources } from "@/lib/couple/engine/resources/select"
export { qualityGate } from "@/lib/couple/engine/qualityGate"
export { RESOURCE_CATALOG, getResourceById } from "@/lib/couple/engine/resources/catalog"
export { harmonizeReport, selectPremiumPlusModules, PREMIUM_SPINE } from "@/lib/couple/engine/masters"
export type * from "@/lib/couple/engine/types"
