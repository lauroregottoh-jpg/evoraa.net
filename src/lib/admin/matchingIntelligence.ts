import type { NamedCount } from "@/lib/admin/analytics"

export const PILLAR_KEYS = [
  "personality",
  "spiritual",
  "relationship",
  "couple_life",
  "finances",
] as const

export type PillarKey = (typeof PILLAR_KEYS)[number]

export const PILLAR_LABELS: Record<PillarKey, string> = {
  personality: "Personnalité",
  spiritual: "Foi & valeurs",
  relationship: "Communication",
  couple_life: "Foyer",
  finances: "Finances",
}

export const DIMENSION_LABELS: Record<string, string> = {
  emotional_stability: "Stabilité émotionnelle",
  communication: "Communication",
  openness: "Ouverture",
  responsibility: "Fiabilité",
  faith_importance: "Place de la foi",
  practices: "Pratiques spirituelles",
  marriage_vision: "Vision du mariage",
  community: "Vie d'église",
  conflict: "Gestion des conflits",
  emotional: "Expression affective",
  partnership: "Partenariat",
  vision: "Rythme à deux",
  family: "Familles élargies",
  intimacy: "Pureté & limites",
  roles: "Rôles au foyer",
  transparency: "Transparence financière",
  stewardship: "Intendance",
  management: "Gestion budget",
  planning: "Planification",
}

export type PsychoPillars = Partial<Record<PillarKey, number | null>>

export type MatchingMemberIntel = {
  id: string
  userId: string
  name: string
  city: string
  country: string
  gender: string
  age: number | null
  denomination: string
  completion: number
  status: string
  pillarsCompleted: number
  pillars: PsychoPillars
  weakDimensions: string[]
  profileType: string
  spiritualPractice: string | null
  communicationStyle: string | null
  marriageVisionSnippet: string | null
}

export type MatchingIntelligence = {
  assessmentsDoneAll: number
  assessmentsPartial: number
  assessmentsNone: number
  avgPillars: NamedCount[]
  pillarCompletionDist: NamedCount[]
  weakThemes: NamedCount[]
  profileTypes: NamedCount[]
  practiceDist: NamedCount[]
  communicationDist: NamedCount[]
  scoreBuckets: NamedCount[]
  matchesByDay: NamedCount[]
  avgMatchScore: number | null
  highScoreMatches: number
  members: MatchingMemberIntel[]
}

type RawProfile = {
  id: string
  user_id: string
  first_name: string | null
  last_name: string | null
  city: string | null
  country: string | null
  gender: string | null
  birth_date: string | null
  denomination: string | null
  completion_percentage: number | null
  moderation_status: string | null
  psychometric_results: unknown
  matching_indicators: unknown
}

type RawMatch = {
  compatibility_score: number | null
  created_at: string | null
}

function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null
}

function parsePillars(psy: unknown): {
  pillars: PsychoPillars
  dimensions: Record<string, number>
  completed: number
} {
  const pillars: PsychoPillars = {}
  const dimensions: Record<string, number> = {}
  let completed = 0
  if (!psy || typeof psy !== "object" || Array.isArray(psy)) {
    return { pillars, dimensions, completed }
  }
  const o = psy as Record<string, unknown>
  for (const key of PILLAR_KEYS) {
    const v = num(o[key])
    pillars[key] = v
    if (v != null) completed += 1
  }
  const dimsRaw = o.dimensions
  if (dimsRaw && typeof dimsRaw === "object" && !Array.isArray(dimsRaw)) {
    for (const pillar of Object.values(dimsRaw as Record<string, unknown>)) {
      if (!pillar || typeof pillar !== "object" || Array.isArray(pillar)) continue
      for (const [dk, dv] of Object.entries(pillar as Record<string, unknown>)) {
        const n = num(dv)
        if (n != null) dimensions[dk] = n
      }
    }
  }
  return { pillars, dimensions, completed }
}

function parseIndicators(raw: unknown): {
  spiritual_practice: string | null
  communication_style: string | null
  marriage_vision: string | null
} {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {
      spiritual_practice: null,
      communication_style: null,
      marriage_vision: null,
    }
  }
  const o = raw as Record<string, unknown>
  return {
    spiritual_practice:
      typeof o.spiritual_practice === "string" ? o.spiritual_practice : null,
    communication_style:
      typeof o.communication_style === "string" ? o.communication_style : null,
    marriage_vision:
      typeof o.marriage_vision === "string" ? o.marriage_vision : null,
  }
}

/** Typologie simple pour campagnes / profilage. */
export function classifyProfileType(
  pillars: PsychoPillars,
  completed: number
): string {
  if (completed === 0) return "Sans questionnaire"
  if (completed < 3) return "Profil partiel"
  const spiritual = pillars.spiritual ?? 0
  const relationship = pillars.relationship ?? 0
  const finances = pillars.finances ?? 0
  const couple = pillars.couple_life ?? 0
  const personality = pillars.personality ?? 0

  if (spiritual >= 75 && relationship >= 70) return "Foi + relation solides"
  if (spiritual >= 75 && finances < 55) return "Foi forte / finances à travailler"
  if (relationship < 55 && personality < 55) return "Maturité relationnelle fragile"
  if (couple >= 75 && spiritual >= 70) return "Prêt projet foyer"
  if (finances >= 75 && relationship >= 70) return "Stable foyer & argent"
  if (spiritual < 50) return "Foi à clarifier"
  if (completed === 5) return "Profil complet standard"
  return "En discernement"
}

function aggregateMap(map: Map<string, number>, limit = 10): NamedCount[] {
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

function ageFromBirth(birth: string | null): number | null {
  if (!birth) return null
  const y = new Date(birth).getFullYear()
  if (!Number.isFinite(y)) return null
  return new Date().getFullYear() - y
}

export function buildMatchingIntelligence(
  profiles: RawProfile[],
  matches: RawMatch[]
): MatchingIntelligence {
  const pillarSums: Record<PillarKey, { sum: number; n: number }> = {
    personality: { sum: 0, n: 0 },
    spiritual: { sum: 0, n: 0 },
    relationship: { sum: 0, n: 0 },
    couple_life: { sum: 0, n: 0 },
    finances: { sum: 0, n: 0 },
  }
  const completionBuckets = new Map<string, number>()
  const weakThemeCounts = new Map<string, number>()
  const typeCounts = new Map<string, number>()
  const practiceCounts = new Map<string, number>()
  const commCounts = new Map<string, number>()

  let assessmentsDoneAll = 0
  let assessmentsPartial = 0
  let assessmentsNone = 0

  const members: MatchingMemberIntel[] = []

  for (const p of profiles) {
    const { pillars, dimensions, completed } = parsePillars(p.psychometric_results)
    const ind = parseIndicators(p.matching_indicators)

    if (completed === 5) assessmentsDoneAll += 1
    else if (completed === 0) assessmentsNone += 1
    else assessmentsPartial += 1

    completionBuckets.set(
      `${completed}/5`,
      (completionBuckets.get(`${completed}/5`) || 0) + 1
    )

    for (const key of PILLAR_KEYS) {
      const v = pillars[key]
      if (v != null) {
        pillarSums[key].sum += v
        pillarSums[key].n += 1
      }
    }

    const weakDimensions: string[] = []
    for (const [dk, dv] of Object.entries(dimensions)) {
      if (dv < 60) {
        const label = DIMENSION_LABELS[dk] ?? dk
        weakDimensions.push(dk)
        weakThemeCounts.set(label, (weakThemeCounts.get(label) || 0) + 1)
      }
    }

    const profileType = classifyProfileType(pillars, completed)
    typeCounts.set(profileType, (typeCounts.get(profileType) || 0) + 1)

    if (ind.spiritual_practice) {
      practiceCounts.set(
        ind.spiritual_practice,
        (practiceCounts.get(ind.spiritual_practice) || 0) + 1
      )
    }
    if (ind.communication_style) {
      commCounts.set(
        ind.communication_style,
        (commCounts.get(ind.communication_style) || 0) + 1
      )
    }

    members.push({
      id: p.id,
      userId: p.user_id,
      name: [p.first_name, p.last_name].filter(Boolean).join(" ") || "Sans nom",
      city: p.city || "?",
      country: p.country || "?",
      gender: p.gender || "?",
      age: ageFromBirth(p.birth_date),
      denomination: p.denomination || "",
      completion: p.completion_percentage ?? 0,
      status: p.moderation_status || "pending",
      pillarsCompleted: completed,
      pillars,
      weakDimensions,
      profileType,
      spiritualPractice: ind.spiritual_practice,
      communicationStyle: ind.communication_style,
      marriageVisionSnippet: ind.marriage_vision
        ? ind.marriage_vision.slice(0, 120)
        : null,
    })
  }

  const avgPillars: NamedCount[] = PILLAR_KEYS.map((key) => ({
    name: PILLAR_LABELS[key],
    count:
      pillarSums[key].n > 0
        ? Math.round(pillarSums[key].sum / pillarSums[key].n)
        : 0,
  }))

  // Score buckets for matches
  const scoreBucketsMap = new Map<string, number>([
    ["<62", 0],
    ["62–74", 0],
    ["75–84", 0],
    ["85–94", 0],
    ["95–100", 0],
  ])
  let scoreSum = 0
  let scoreN = 0
  let highScoreMatches = 0
  for (const m of matches) {
    const s = m.compatibility_score
    if (s == null || !Number.isFinite(Number(s))) continue
    const score = Number(s)
    scoreSum += score
    scoreN += 1
    if (score >= 85) highScoreMatches += 1
    if (score < 62) scoreBucketsMap.set("<62", (scoreBucketsMap.get("<62") || 0) + 1)
    else if (score < 75)
      scoreBucketsMap.set("62–74", (scoreBucketsMap.get("62–74") || 0) + 1)
    else if (score < 85)
      scoreBucketsMap.set("75–84", (scoreBucketsMap.get("75–84") || 0) + 1)
    else if (score < 95)
      scoreBucketsMap.set("85–94", (scoreBucketsMap.get("85–94") || 0) + 1)
    else scoreBucketsMap.set("95–100", (scoreBucketsMap.get("95–100") || 0) + 1)
  }

  const matchesByDay = matchSignupsByDay(matches, 14)

  return {
    assessmentsDoneAll,
    assessmentsPartial,
    assessmentsNone,
    avgPillars,
    pillarCompletionDist: ["0/5", "1/5", "2/5", "3/5", "4/5", "5/5"].map(
      (name) => ({ name, count: completionBuckets.get(name) || 0 })
    ),
    weakThemes: aggregateMap(weakThemeCounts, 10),
    profileTypes: aggregateMap(typeCounts, 10),
    practiceDist: aggregateMap(practiceCounts, 8),
    communicationDist: aggregateMap(commCounts, 8),
    scoreBuckets: [...scoreBucketsMap.entries()].map(([name, count]) => ({
      name,
      count,
    })),
    matchesByDay,
    avgMatchScore: scoreN > 0 ? Math.round((scoreSum / scoreN) * 10) / 10 : null,
    highScoreMatches,
    members,
  }
}

function matchSignupsByDay(matches: RawMatch[], days = 14): NamedCount[] {
  const out: NamedCount[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    out.push({ name: d.toISOString().slice(5, 10), count: 0 })
  }
  const index = new Map(out.map((o, i) => [o.name, i]))
  for (const m of matches) {
    if (!m.created_at) continue
    const key = m.created_at.slice(5, 10)
    const i = index.get(key)
    if (i != null) out[i].count += 1
  }
  return out
}

export type CampaignSegmentFilter = {
  name: string
  gender?: string
  profileType?: string
  minPillarsCompleted?: number
  maxPillarsCompleted?: number
  weakDimension?: string
  pillarBelow?: { pillar: PillarKey; max: number }
  pillarAbove?: { pillar: PillarKey; min: number }
  city?: string
  country?: string
  denominationIncludes?: string
  minAge?: number
  maxAge?: number
  spiritualPractice?: string
  communicationStyle?: string
}

export function filterSegmentMembers(
  members: MatchingMemberIntel[],
  filter: CampaignSegmentFilter
): MatchingMemberIntel[] {
  return members.filter((m) => {
    if (filter.gender && filter.gender !== "all") {
      const g = m.gender.toLowerCase()
      const want = filter.gender.toLowerCase()
      if (want === "m" || want === "homme") {
        if (!["m", "male", "homme", "h", "man"].includes(g)) return false
      } else if (want === "f" || want === "femme") {
        if (!["f", "female", "femme", "w", "woman"].includes(g)) return false
      }
    }
    if (filter.profileType && m.profileType !== filter.profileType) return false
    if (
      filter.minPillarsCompleted != null &&
      m.pillarsCompleted < filter.minPillarsCompleted
    )
      return false
    if (
      filter.maxPillarsCompleted != null &&
      m.pillarsCompleted > filter.maxPillarsCompleted
    )
      return false
    if (filter.weakDimension && !m.weakDimensions.includes(filter.weakDimension))
      return false
    if (filter.pillarBelow) {
      const v = m.pillars[filter.pillarBelow.pillar]
      if (v == null || v > filter.pillarBelow.max) return false
    }
    if (filter.pillarAbove) {
      const v = m.pillars[filter.pillarAbove.pillar]
      if (v == null || v < filter.pillarAbove.min) return false
    }
    if (filter.city && !m.city.toLowerCase().includes(filter.city.toLowerCase()))
      return false
    if (
      filter.country &&
      !m.country.toLowerCase().includes(filter.country.toLowerCase())
    )
      return false
    if (
      filter.denominationIncludes &&
      !m.denomination
        .toLowerCase()
        .includes(filter.denominationIncludes.toLowerCase())
    )
      return false
    if (filter.minAge != null && (m.age == null || m.age < filter.minAge))
      return false
    if (filter.maxAge != null && (m.age == null || m.age > filter.maxAge))
      return false
    if (
      filter.spiritualPractice &&
      m.spiritualPractice !== filter.spiritualPractice
    )
      return false
    if (
      filter.communicationStyle &&
      m.communicationStyle !== filter.communicationStyle
    )
      return false
    return true
  })
}
