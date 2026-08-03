export type MarriageTimeline =
  | "3_months"
  | "6_months"
  | "1_year"
  | "2_years"
  | "open"

export type DesireChildrenPref = "with" | "without" | "open"

export type SettingsData = {
  retreatMode: boolean
  maxDistance: number
  ageMin: number
  ageMax: number
  /** Horizon projet de mariage recherché */
  marriageTimeline: MarriageTimeline
  /** Partenaire avec / sans enfants (déjà présents) */
  desireChildren: DesireChildrenPref
}

export function parseAgeRange(range: string): { ageMin: number; ageMax: number } {
  const [min, max] = range.split("-").map((n) => Number.parseInt(n, 10))
  return {
    ageMin: Number.isFinite(min) ? min : 22,
    ageMax: Number.isFinite(max) ? max : 36,
  }
}

export function ageRangeLabel(ageMin: number, ageMax: number): string {
  const candidates = ["22-30", "26-36", "30-42", "38-55"]
  const exact = `${ageMin}-${ageMax}`
  if (candidates.includes(exact)) return exact
  if (ageMin <= 22 && ageMax <= 30) return "22-30"
  if (ageMin <= 26 && ageMax <= 36) return "26-36"
  if (ageMin <= 30 && ageMax <= 42) return "30-42"
  return "38-55"
}

export const MARRIAGE_TIMELINE_OPTIONS: Array<{
  id: MarriageTimeline
  label: string
}> = [
  { id: "3_months", label: "Dans les 3 mois" },
  { id: "6_months", label: "Dans les 6 mois" },
  { id: "1_year", label: "Dans l’année" },
  { id: "2_years", label: "Dans les 2 ans" },
  { id: "open", label: "Sans échéance précise" },
]

export const DESIRE_CHILDREN_OPTIONS: Array<{
  id: DesireChildrenPref
  label: string
}> = [
  { id: "without", label: "Sans enfants déjà présents" },
  { id: "with", label: "Ouvert(e) à un partenaire avec enfants" },
  { id: "open", label: "Pas de préférence" },
]

export function parseMarriageTimeline(v: string | null | undefined): MarriageTimeline {
  const ids = MARRIAGE_TIMELINE_OPTIONS.map((o) => o.id)
  return ids.includes(v as MarriageTimeline) ? (v as MarriageTimeline) : "open"
}

export function parseDesireChildren(v: string | null | undefined): DesireChildrenPref {
  const ids = DESIRE_CHILDREN_OPTIONS.map((o) => o.id)
  return ids.includes(v as DesireChildrenPref) ? (v as DesireChildrenPref) : "open"
}
