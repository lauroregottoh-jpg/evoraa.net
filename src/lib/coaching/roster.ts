/**
 * Roster officiel coaching V1 — uniquement Sara (F) et Antoine (H).
 */

export type CoachingRosterKey = "sara" | "antoine"
export type CoachingCoachGender = "female" | "male"

export type CoachingRosterEntry = {
  key: CoachingRosterKey
  displayName: string
  gender: CoachingCoachGender
  /** Code unique pour upsert / liaison. */
  coachCode: string
  /** Codes historiques éventuels. */
  legacyCodes: string[]
  /** Noms DB à rattacher. */
  nameMatchers: RegExp[]
}

export const COACHING_ROSTER: CoachingRosterEntry[] = [
  {
    key: "sara",
    displayName: "Sara",
    gender: "female",
    coachCode: "KE-SARA",
    legacyCodes: ["KE-4827", "LG-4827"],
    nameMatchers: [/^sara\b/i, /^sarah\b/i],
  },
  {
    key: "antoine",
    displayName: "Antoine",
    gender: "male",
    coachCode: "KE-ANTOINE",
    legacyCodes: [],
    nameMatchers: [/^antoine\b/i],
  },
]

export function rosterEntryForGender(
  gender: CoachingCoachGender
): CoachingRosterEntry {
  return gender === "female" ? COACHING_ROSTER[0]! : COACHING_ROSTER[1]!
}

export function matchRosterEntry(input: {
  displayName?: string | null
  coachCode?: string | null
  gender?: string | null
}): CoachingRosterEntry | null {
  const code = (input.coachCode || "").trim().toUpperCase()
  const name = (input.displayName || "").trim()
  for (const entry of COACHING_ROSTER) {
    if (code === entry.coachCode || entry.legacyCodes.includes(code)) {
      return entry
    }
    if (entry.nameMatchers.some((re) => re.test(name))) return entry
  }
  if (input.gender === "female") return COACHING_ROSTER[0]!
  if (input.gender === "male") return COACHING_ROSTER[1]!
  return null
}
