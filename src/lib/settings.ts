export type SettingsData = {
  retreatMode: boolean
  maxDistance: number
  ageMin: number
  ageMax: number
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
