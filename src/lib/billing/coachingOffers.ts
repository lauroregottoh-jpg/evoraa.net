/**
 * Coaching humain KELIAA — séances 30 min ou 1 h.
 * Prix lancement : 30 min = 8 000 (ancrage 10 000) · 1 h = 15 000 (ancrage 20 000).
 */

export type CoachingDurationMinutes = 30 | 60

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
  amountXof: number
  listXof: number
  hint: string
  popular?: boolean
  minutes: CoachingDurationMinutes
}

export const COACHING_DURATIONS: Array<{
  minutes: CoachingDurationMinutes
  label: string
  unitXof: number
  listUnitXof: number
  blurb: string
}> = [
  {
    minutes: 30,
    label: "30 minutes",
    unitXof: 8_000,
    listUnitXof: 10_000,
    blurb: "Prix lancement — idéal pour un point précis.",
  },
  {
    minutes: 60,
    label: "1 heure",
    unitXof: 15_000,
    listUnitXof: 20_000,
    blurb: "Prix lancement — pour aller plus en profondeur.",
  },
]

function packFor(
  id: CoachingPackId,
  sessions: number,
  minutes: CoachingDurationMinutes,
  unitXof: number,
  listUnitXof: number,
  discountXof: number,
  hint: string,
  popular?: boolean
): CoachingPack {
  const listXof = sessions * listUnitXof
  const amountXof = Math.max(sessions * unitXof - discountXof, unitXof)
  return {
    id,
    sessions,
    minutes,
    label: sessions === 1 ? "1 séance" : `${sessions} séances`,
    amountXof,
    listXof,
    hint,
    popular,
  }
}

/** Génère la grille de packs pour une durée donnée. */
export function getCoachingPacks(minutes: CoachingDurationMinutes): CoachingPack[] {
  const dur = COACHING_DURATIONS.find((d) => d.minutes === minutes)
  const unit = dur?.unitXof ?? 8_000
  const listUnit = dur?.listUnitXof ?? 10_000
  const labelMin = minutes === 30 ? "30 min" : "1 h"
  const disc = (n: number) => Math.min(n, Math.floor(unit * 0.2))

  return [
    packFor("c1", 1, minutes, unit, listUnit, 0, `Une séance découverte (${labelMin})`),
    packFor("c2", 2, minutes, unit, listUnit, disc(500), `Deux rendez-vous — avantage pack`),
    packFor("c3", 3, minutes, unit, listUnit, disc(1_000), `Suivi court — avantage pack`),
    packFor(
      "c4",
      4,
      minutes,
      unit,
      listUnit,
      disc(1_500),
      `Un mois environ (1/semaine)`,
      true
    ),
    packFor("c6", 6, minutes, unit, listUnit, disc(2_000), `Suivi six semaines`),
    packFor("c8", 8, minutes, unit, listUnit, disc(2_000), `Deux mois environ`),
    packFor("c12", 12, minutes, unit, listUnit, disc(2_500), `Trois mois (≈1/semaine)`),
  ]
}

export const COACHING_PACKS: CoachingPack[] = getCoachingPacks(30)

export function getCoachingPack(
  id: string | null | undefined,
  minutes: CoachingDurationMinutes = 30
): CoachingPack | null {
  return getCoachingPacks(minutes).find((p) => p.id === id) ?? null
}

export const COACHING_SESSION_MINUTES = 30 as CoachingDurationMinutes
