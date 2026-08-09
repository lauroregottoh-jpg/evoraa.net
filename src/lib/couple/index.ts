export {
  COUPLE_BRAND,
  COUPLE_TAGLINE,
  COUPLE_PROMISE,
  COUPLE_ACCESS_DAYS,
  isCoupleFeatureEnabled,
} from "@/lib/couple/config"
export { COUPLE_OFFERS, getCoupleOffer, isPremiumPlusOffer } from "@/lib/couple/offers"
export { getCoupleQuestions, COUPLE_DIMENSION_META } from "@/lib/couple/questionBank"
export { scoreCouplePair, interpretGlobalScore } from "@/lib/couple/scoring"
export { buildCoupleReport, qaCoupleReport } from "@/lib/couple/report"
export { runCoupleEngine, runCoupleEngineFromAnswers } from "@/lib/couple/engine"
export {
  buildDemoCoupleReport,
  DEMO_COUPLE_META,
  DEMO_COUPLE_NAMES,
} from "@/lib/couple/demoReport"
export { GOLDEN_COUPLES } from "@/lib/couple/golden"
