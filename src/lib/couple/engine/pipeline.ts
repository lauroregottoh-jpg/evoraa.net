/**
 * Pipeline moteur KELYA Couple™ — docs 41 / 86 / 133 / 181 / Bibliothèque.
 */

import { scoreCouplePair, type AnswerMap, type CoupleScoringResult } from "@/lib/couple/scoring"
import type { CoupleOfferId } from "@/lib/couple/offers"
import { classifyDimensions } from "@/lib/couple/engine/classify"
import { buildCoupleMap } from "@/lib/couple/engine/coupleMap"
import { prioritizeDimensions } from "@/lib/couple/engine/prioritize"
import { buildInternalSynthesis } from "@/lib/couple/engine/synthesis"
import { selectResources } from "@/lib/couple/engine/resources/select"
import { composeCoupleReport } from "@/lib/couple/engine/compose"
import { qualityGate } from "@/lib/couple/engine/qualityGate"
import type { CoupleContext, EngineResult } from "@/lib/couple/engine/types"
import type { CoupleReportDocument, CoupleReportNames } from "@/lib/couple/report"

export function runCoupleEngine(args: {
  offerId: CoupleOfferId
  names: CoupleReportNames
  scoring: CoupleScoringResult
  context?: CoupleContext
}): { doc: CoupleReportDocument; engine: EngineResult; gate: ReturnType<typeof qualityGate> } {
  const cards = classifyDimensions(args.scoring.dimensions)
  const coupleMap = buildCoupleMap({
    scoring: args.scoring,
    names: args.names,
    cards,
    context: args.context,
  })
  const priorities = prioritizeDimensions(cards, args.names)
  const synthesis = buildInternalSynthesis({
    cards,
    priorities,
    coupleMap,
  })
  const selectedResources = selectResources({
    offerId: args.offerId,
    synthesis,
    coupleMap,
    names: args.names,
    priorities,
  })

  const engine: EngineResult = {
    coupleMap,
    cards,
    synthesis,
    selectedResources,
    qualityNotes: [],
  }

  const doc = composeCoupleReport({
    offerId: args.offerId,
    names: args.names,
    scoring: args.scoring,
    engine,
  })

  const gate = qualityGate(doc, engine)
  engine.qualityNotes = gate.notes

  return { doc, engine, gate }
}

/** Entrée pratique depuis réponses brutes. */
export function runCoupleEngineFromAnswers(args: {
  offerId: CoupleOfferId
  names: CoupleReportNames
  answersA: AnswerMap
  answersB: AnswerMap
  context?: CoupleContext
}) {
  const scoring = scoreCouplePair(args.answersA, args.answersB)
  return runCoupleEngine({
    offerId: args.offerId,
    names: args.names,
    scoring,
    context: args.context,
  })
}
