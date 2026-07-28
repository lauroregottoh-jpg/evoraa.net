/** Graphiques admin légers (CSS) — pas de dépendance chart. */

export type NamedCount = { name: string; count: number }

export function aggregateTop(
  values: Array<string | null | undefined>,
  limit = 8
): NamedCount[] {
  const map = new Map<string, number>()
  for (const raw of values) {
    const key = (raw || "Non renseigné").trim() || "Non renseigné"
    map.set(key, (map.get(key) || 0) + 1)
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function ageBucket(birthDate: string | null | undefined): string {
  if (!birthDate) return "Âge inconnu"
  const y = new Date(birthDate).getFullYear()
  if (!Number.isFinite(y)) return "Âge inconnu"
  const age = new Date().getFullYear() - y
  if (age < 25) return "18–24"
  if (age < 30) return "25–29"
  if (age < 35) return "30–34"
  if (age < 40) return "35–39"
  if (age < 50) return "40–49"
  return "50+"
}

export function signupsByDay(
  createdAts: Array<string | null | undefined>,
  days = 14
): NamedCount[] {
  const out: NamedCount[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    out.push({ name: key.slice(5), count: 0 })
  }
  const index = new Map(out.map((o, i) => [o.name, i]))
  for (const iso of createdAts) {
    if (!iso) continue
    const key = iso.slice(5, 10)
    const i = index.get(key)
    if (i != null) out[i].count += 1
  }
  return out
}

export function matchingRate(matches: number, users: number): number {
  if (users <= 0) return 0
  return Math.round((matches / users) * 1000) / 10
}
