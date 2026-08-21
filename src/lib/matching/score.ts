import type { MatchableProfile, MatchingIndicators, DomainScore } from "./types"
import {
  MIN_DEMANDE_SCORE,
  MIN_MATCH_COMPLETION,
  MIN_RECOMMENDED_SCORE,
  type ScoredMatch,
} from "./types"
import {
  applyMatchConfidenceCaps,
  computeDimensionMatchScore,
} from "./dimensionMatch"
import {
  completedAssessmentSlugs,
  missingAssessmentSlugs,
} from "./testCoverage"

function normalizeGender(value: string | null | undefined): "M" | "F" | null {
  if (!value) return null
  const v = value.trim().toLowerCase()
  if (["m", "male", "homme", "h", "man"].includes(v)) return "M"
  if (["f", "female", "femme", "w", "woman"].includes(v)) return "F"
  return null
}

export function ageFromProfile(profile: MatchableProfile): number | null {
  if (profile.birth_date) {
    const birth = new Date(profile.birth_date)
    if (!Number.isNaN(birth.getTime())) {
      const now = new Date()
      let age = now.getFullYear() - birth.getFullYear()
      const m = now.getMonth() - birth.getMonth()
      if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age -= 1
      return age
    }
  }
  const declared = profile.matching_indicators?.age_declared
  return typeof declared === "number" && declared >= 18 ? declared : null
}

function normalizeText(value: string | null | undefined): string {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function tokenize(value: string): Set<string> {
  return new Set(
    normalizeText(value)
      .split(" ")
      .filter((token) => token.length > 3)
  )
}

function jaccard(a: string | null | undefined, b: string | null | undefined): number {
  const ta = tokenize(a ?? "")
  const tb = tokenize(b ?? "")
  if (ta.size === 0 || tb.size === 0) return 0
  let intersection = 0
  ta.forEach((token) => {
    if (tb.has(token)) intersection += 1
  })
  const union = ta.size + tb.size - intersection
  return union === 0 ? 0 : intersection / union
}

function denominationScore(a: string | null, b: string | null): number {
  if (!a || !b) return 8
  const na = normalizeText(a)
  const nb = normalizeText(b)
  if (na === nb) return 25
  if (na.includes(nb) || nb.includes(na)) return 18
  const shared = jaccard(a, b)
  if (shared >= 0.3) return 14
  return 4
}

function locationScore(
  a: Pick<MatchableProfile, "city" | "country">,
  b: Pick<MatchableProfile, "city" | "country">
): number {
  const cityA = normalizeText(a.city)
  const cityB = normalizeText(b.city)
  if (cityA && cityB && (cityA === cityB || cityA.includes(cityB) || cityB.includes(cityA))) {
    return 20
  }
  const countryA = normalizeText(a.country)
  const countryB = normalizeText(b.country)
  if (countryA && countryB && countryA === countryB) return 12
  if (cityA || cityB) return 4
  return 6
}

function ageScore(ageA: number | null, ageB: number | null): number {
  if (ageA == null || ageB == null) return 7
  const diff = Math.abs(ageA - ageB)
  if (diff <= 3) return 15
  if (diff <= 6) return 11
  if (diff <= 10) return 6
  return 1
}

function attendanceScore(a: string | null, b: string | null): number {
  if (!a || !b) return 6
  if (a === b) return 15
  const close = new Set([
    "weekly|monthly",
    "monthly|weekly",
    "monthly|occasionally",
    "occasionally|monthly",
  ])
  if (close.has(`${a}|${b}`)) return 10
  return 3
}

function indicatorsScore(
  a: MatchingIndicators | null,
  b: MatchingIndicators | null
): { points: number; hits: string[] } {
  if (!a || !b) return { points: 8, hits: [] }
  let points = 0
  const hits: string[] = []

  if (a.spiritual_practice && b.spiritual_practice) {
    if (a.spiritual_practice === b.spiritual_practice) {
      points += 8
      hits.push("practice")
    } else {
      points += 2
    }
  } else {
    points += 3
  }

  if (a.communication_style && b.communication_style) {
    if (a.communication_style === b.communication_style) {
      points += 8
      hits.push("dialogue")
    } else {
      points += 2
    }
  } else {
    points += 3
  }

  const marriageOverlap = jaccard(a.marriage_vision, b.marriage_vision)
  const familyOverlap = jaccard(a.family_project, b.family_project)
  const textPoints = Math.round((marriageOverlap * 5 + familyOverlap * 4) * 10) / 10
  points += textPoints
  if (marriageOverlap >= 0.15) hits.push("marriage")
  if (familyOverlap >= 0.15) hits.push("family")

  return { points: Math.min(25, Math.round(points)), hits }
}

export function isEligibleCandidate(profile: MatchableProfile, viewerId: string): boolean {
  if (profile.user_id === viewerId) return false
  if (profile.deleted_at) return false
  if (profile.moderation_status === "rejected") return false
  if (profile.onboarding_status === "banned") return false
  if ((profile.completion_percentage ?? 0) < MIN_MATCH_COMPLETION) return false
  if (
    profile.onboarding_status === "step1_account" ||
    profile.onboarding_status === "step2_profile"
  ) {
    return false
  }
  return true
}

export function passesHardFilters(viewer: MatchableProfile, candidate: MatchableProfile): boolean {
  if (!isEligibleCandidate(candidate, viewer.user_id)) return false

  const gViewer = normalizeGender(viewer.gender)
  const gCandidate = normalizeGender(candidate.gender)
  if (gViewer && gCandidate && gViewer === gCandidate) {
    return false
  }

  const ageViewer = ageFromProfile(viewer)
  const ageCandidate = ageFromProfile(candidate)
  if (ageViewer != null && ageCandidate != null) {
    const diff = Math.abs(ageViewer - ageCandidate)
    if (diff > 15) return false
  }

  return true
}

function compatibilityLevel(score: number): ScoredMatch["level"] {
  if (score >= 90) return "excellent"
  if (score >= 75) return "high"
  if (score >= 60) return "moderate"
  return "low"
}

function buildReasons(
  viewer: MatchableProfile,
  candidate: MatchableProfile,
  hits: string[],
  scoreParts: { denomination: number; location: number; age: number }
): string[] {
  const reasons: string[] = []
  if (scoreParts.denomination >= 18) {
    reasons.push("Communauté de foi proche de la vôtre")
  }
  if (scoreParts.location >= 12) {
    reasons.push(
      scoreParts.location >= 20
        ? "Proximité géographique forte"
        : "Même pays / région de vie"
    )
  }
  if (scoreParts.age >= 11) {
    reasons.push("Écart d'âge compatible pour un projet de couple")
  }
  if (hits.includes("practice")) {
    reasons.push("Rythme spirituel aligné")
  }
  if (hits.includes("dialogue")) {
    reasons.push("Style de dialogue en cas de désaccord similaire")
  }
  if (hits.includes("marriage")) {
    reasons.push("Vision du mariage en résonance")
  }
  if (hits.includes("family")) {
    reasons.push("Projet de foyer compatible")
  }
  if (candidate.is_verified) {
    reasons.push("Profil vérifié par l'équipe")
  }

  if (reasons.length === 0) {
    reasons.push("Suggestion selon votre demande (profil d'accueil)")
  }

  return reasons.slice(0, 4)
}

function buildPillars(
  viewer: MatchableProfile,
  candidate: MatchableProfile,
  hits: string[],
  domainScores: ScoredMatch["domainScores"]
) {
  const cInd = candidate.matching_indicators
  const vInd = viewer.matching_indicators
  const domainLine = (id: DomainScore["id"], fallback: string) => {
    const d = domainScores.find((x) => x.id === id)
    if (!d) return fallback
    const tone =
      d.status === "strong"
        ? "Point fort"
        : d.status === "watch"
          ? "À approfondir"
          : "Vigilance"
    return `${tone} (${d.score}%) — ${fallback}`
  }

  return {
    spirituality: domainLine(
      "spiritual",
      hits.includes("practice")
        ? `Pratique spirituelle alignée (${cInd?.spiritual_practice ?? candidate.attendance_frequency ?? "non précisée"}). ${candidate.denomination ? `Communauté : ${candidate.denomination}.` : ""}`
        : `${candidate.denomination ? `Issu(e) de la communauté « ${candidate.denomination} ». ` : ""}La proximité de foi reste à approfondir dans le dialogue.`
    ),
    familyVision: domainLine(
      "couple_life",
      hits.includes("family") || hits.includes("marriage")
        ? `Vision du foyer proche de la vôtre${cInd?.family_project ? ` : « ${cInd.family_project.slice(0, 140)}${cInd.family_project.length > 140 ? "…" : ""} »` : "."}`
        : `Projet familial déclaré${cInd?.family_project ? ` : « ${cInd.family_project.slice(0, 140)}${cInd.family_project.length > 140 ? "…" : ""} »` : " encore à préciser ensemble."}`
    ),
    dialogue: domainLine(
      "relationship",
      hits.includes("dialogue")
        ? `Même approche du dialogue (${cInd?.communication_style ?? "non précisé"}), en harmonie avec votre style (${vInd?.communication_style ?? "non précisé"}).`
        : `Style de communication : ${cInd?.communication_style ?? "non précisé"}. Un échange respectueux permettra de vérifier l'alignement.`
    ),
  }
}

export function scorePair(viewer: MatchableProfile, candidate: MatchableProfile): ScoredMatch | null {
  if (!passesHardFilters(viewer, candidate)) return null

  const denomination = denominationScore(viewer.denomination, candidate.denomination)
  const location = locationScore(viewer, candidate)
  const age = ageScore(ageFromProfile(viewer), ageFromProfile(candidate))
  const attendance = attendanceScore(
    viewer.attendance_frequency,
    candidate.attendance_frequency
  )
  const indicators = indicatorsScore(
    viewer.matching_indicators,
    candidate.matching_indicators
  )

  const profileRaw = denomination + location + age + attendance + indicators.points
  const profileScore = Math.max(0, Math.min(100, Math.round(profileRaw)))

  const psych = computeDimensionMatchScore(
    viewer.psychometric_results,
    candidate.psychometric_results
  )

  let score: number
  const domainScores = psych?.domainScores ?? []
  const insights = (psych?.insights ?? []).map((i) => ({
    id: i.id,
    severity: i.severity,
    title: i.title,
    message: i.message,
  }))
  const basis: ScoredMatch["basis"] =
    psych != null && psych.sharedPillars > 0 ? "tests" : "demande"

  if (psych != null) {
    const psychWeight = Math.min(0.85, 0.4 + psych.sharedPillars * 0.09)
    const blended = Math.round(profileScore * (1 - psychWeight) + psych.score * psychWeight)
    score = applyMatchConfidenceCaps(blended, psych.sharedPillars, psych.matchRatio)
    if (!indicators.hits.includes("psych")) indicators.hits.push("psych")
  } else {
    score = Math.min(profileScore, 68)
  }

  const minScore = basis === "tests" ? MIN_RECOMMENDED_SCORE : MIN_DEMANDE_SCORE
  if (score < minScore) return null

  const reasons = buildReasons(viewer, candidate, indicators.hits, {
    denomination,
    location,
    age,
  })
  if (psych != null) {
    const strong = domainScores.filter((d) => d.status === "strong").length
    const watch = domainScores.filter((d) => d.status !== "strong").length
    if (strong > 0) {
      reasons.unshift(
        strong >= 3
          ? `${strong} domaines en résonance forte`
          : `${strong} domaine${strong > 1 ? "s" : ""} en résonance forte`
      )
    } else {
      const pct = Math.round(psych.matchRatio * 100)
      reasons.unshift(
        psych.sharedPillars >= 5
          ? `${pct}% des dimensions croisées favorables`
          : `${pct}% des dimensions croisées (${psych.sharedPillars}/5 questionnaires)`
      )
    }
    if (watch > 0 && insights.some((i) => i.severity === "risk" || i.severity === "watch")) {
      const top = insights[0]
      if (top && reasons.length < 4) {
        reasons.push(top.title)
      }
    }
  } else if (!reasons.some((r) => r.toLowerCase().includes("suggestion"))) {
    reasons.unshift("Suggestion selon votre demande — tests encore incomplets")
  }

  return {
    profile: candidate,
    score,
    reasons: reasons.slice(0, 4),
    pillars: buildPillars(viewer, candidate, indicators.hits, domainScores),
    domainScores,
    insights: insights.slice(0, 5),
    level: compatibilityLevel(score),
    basis,
    viewerTestsCount: completedAssessmentSlugs(viewer.psychometric_results).length,
    partnerTestsCount: completedAssessmentSlugs(candidate.psychometric_results).length,
    missingOnPartner: missingAssessmentSlugs(candidate.psychometric_results),
  }
}

export function rankMatches(
  viewer: MatchableProfile,
  candidates: MatchableProfile[],
  limit: number
): ScoredMatch[] {
  return candidates
    .map((candidate) => scorePair(viewer, candidate))
    .filter((match): match is ScoredMatch => match !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export function parseIndicators(value: unknown): MatchingIndicators | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null
  return value as MatchingIndicators
}
