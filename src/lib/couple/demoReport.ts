/**
 * Rapports démo KELYA COUPLE™ — couple fictif Daniel & Naomi (inspiré EX-05).
 * Permet de prévisualiser Essentiel et Premium Plus sans paiement.
 */

import { COUPLE_QUESTIONS } from "@/lib/couple/questionBank"
import type { CoupleOfferId } from "@/lib/couple/offers"
import {
  buildCoupleReport,
  type CoupleReportDocument,
} from "@/lib/couple/report"
import {
  scoreCouplePair,
  type AnswerMap,
  type CoupleScoringResult,
} from "@/lib/couple/scoring"

export const DEMO_COUPLE_NAMES = {
  nameA: "Daniel",
  nameB: "Naomi",
} as const

export const DEMO_COUPLE_META = {
  label: "Exemple — Daniel & Naomi",
  status: "Fiancés · relation 6 ans · mariage envisagé",
  note: "Données fictives générées par le moteur de décision KELIAA Couple™ (priorités ≤3, ressources catalogue, charte rédaction). Aucun couple réel.",
} as const

/** Profil Likert moyen par dimension (1–5) — écarts sur finances / projet / carrière. */
const PROFILE_A: Record<string, number> = {
  vision_couple: 4,
  valeurs: 5,
  mariage: 4,
  communication: 4,
  conflits: 4,
  emotions: 4,
  affection: 4,
  intimite: 4,
  finances: 5,
  famille: 4,
  roles: 4,
  decision: 4,
  projet_vie: 3,
  carriere: 5,
  enfants: 3,
  autonomie: 4,
  spiritualite: 4,
  limites: 5,
}

const PROFILE_B: Record<string, number> = {
  vision_couple: 4,
  valeurs: 5,
  mariage: 5,
  communication: 4,
  conflits: 4,
  emotions: 4,
  affection: 5,
  intimite: 4,
  finances: 3,
  famille: 4,
  roles: 4,
  decision: 4,
  projet_vie: 5,
  carriere: 3,
  enfants: 5,
  autonomie: 4,
  spiritualite: 4,
  limites: 5,
}

function answersFromProfile(profile: Record<string, number>): AnswerMap {
  const out: AnswerMap = {}
  for (const q of COUPLE_QUESTIONS) {
    const base = profile[q.dimension] ?? 4
    // Légère variation entre items pour éviter un plat total
    const jitter = q.id.endsWith("002") ? -0 : q.id.endsWith("003") ? 0 : 0
    out[q.id] = Math.min(5, Math.max(1, base + jitter))
  }
  return out
}

export function getDemoCoupleScoring(): CoupleScoringResult {
  return scoreCouplePair(
    answersFromProfile(PROFILE_A),
    answersFromProfile(PROFILE_B)
  )
}

export function buildDemoCoupleReport(
  offerId: CoupleOfferId
): CoupleReportDocument {
  return buildCoupleReport({
    offerId,
    names: { ...DEMO_COUPLE_NAMES },
    scoring: getDemoCoupleScoring(),
    context: "fiançailles",
  })
}

export function isCoupleDemoOfferParam(
  value: string | null | undefined
): CoupleOfferId {
  if (value === "couple_premium_plus" || value === "premium_plus" || value === "pp") {
    return "couple_premium_plus"
  }
  return "couple_essential"
}
