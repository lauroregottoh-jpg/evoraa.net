/**
 * Coaching humain KELIAA — séances de 30 minutes.
 * Grille 1 → 12 : rabais modestes (−1k à −3k), pas de casse de prix.
 */

export type CoachingPackId =
  | "c1"
  | "c2"
  | "c3"
  | "c4"
  | "c6"
  | "c8"
  | "c12"

export type CoachingPack = {
  id: CoachingPackId
  sessions: number
  label: string
  /** Prix affiché / payé (XOF) */
  amountXof: number
  /** Prix « pleine liste » avant petit avantage */
  listXof: number
  hint: string
  popular?: boolean
}

const SESSION_UNIT = 15_000

function pack(
  id: CoachingPackId,
  sessions: number,
  discountXof: number,
  hint: string,
  popular?: boolean
): CoachingPack {
  const listXof = sessions * SESSION_UNIT
  const amountXof = listXof - discountXof
  return {
    id,
    sessions,
    label:
      sessions === 1
        ? "1 séance"
        : `${sessions} séances`,
    amountXof,
    listXof,
    hint,
    popular,
  }
}

/** Packs proposés (30 min / séance). */
export const COACHING_PACKS: CoachingPack[] = [
  pack("c1", 1, 0, "Une séance découverte de 30 min"),
  pack("c2", 2, 1_000, "Deux rendez-vous — avantage −1 000 FCFA"),
  pack("c3", 3, 2_000, "Suivi court — avantage −2 000 FCFA"),
  pack("c4", 4, 2_000, "Un mois environ (1/semaine) — −2 000 FCFA", true),
  pack("c6", 6, 3_000, "Suivi six semaines — −3 000 FCFA"),
  pack("c8", 8, 3_000, "Deux mois environ — −3 000 FCFA"),
  pack("c12", 12, 3_000, "Trois mois (≈1/semaine) — −3 000 FCFA"),
]

export function getCoachingPack(id: string | null | undefined): CoachingPack | null {
  return COACHING_PACKS.find((p) => p.id === id) ?? null
}

export const COACHING_SESSION_MINUTES = 30
