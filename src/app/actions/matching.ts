"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { getUserEntitlements } from "@/lib/billing/entitlements"
import {
  FREE_DAILY_SUGGESTIONS,
  type MatchableProfile,
  type ScoredMatch,
} from "@/lib/matching/types"
import { ageFromProfile, parseIndicators, rankMatches } from "@/lib/matching/score"

function parsePsychometrics(value: unknown): MatchableProfile["psychometric_results"] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null
  const v = value as Record<string, unknown>
  return {
    personality: typeof v.personality === "number" ? v.personality : null,
    spiritual: typeof v.spiritual === "number" ? v.spiritual : null,
    relationship: typeof v.relationship === "number" ? v.relationship : null,
  }
}

const PROFILE_SELECT = `
  id,
  user_id,
  first_name,
  gender,
  birth_date,
  city,
  country,
  denomination,
  attendance_frequency,
  biography,
  testimony,
  matching_indicators,
  psychometric_results,
  completion_percentage,
  moderation_status,
  onboarding_status,
  privacy_settings,
  deleted_at,
  is_verified,
  avatar_url
`

function mapProfile(row: Record<string, unknown>): MatchableProfile {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    first_name: (row.first_name as string | null) ?? null,
    gender: (row.gender as string | null) ?? null,
    birth_date: (row.birth_date as string | null) ?? null,
    city: (row.city as string | null) ?? null,
    country: (row.country as string | null) ?? null,
    denomination: (row.denomination as string | null) ?? null,
    attendance_frequency: (row.attendance_frequency as string | null) ?? null,
    biography: (row.biography as string | null) ?? null,
    testimony: (row.testimony as string | null) ?? null,
    matching_indicators: parseIndicators(row.matching_indicators),
    psychometric_results: parsePsychometrics(row.psychometric_results),
    completion_percentage: (row.completion_percentage as number | null) ?? null,
    moderation_status: (row.moderation_status as string | null) ?? null,
    onboarding_status: (row.onboarding_status as string | null) ?? null,
    deleted_at: (row.deleted_at as string | null) ?? null,
    is_verified: (row.is_verified as boolean | null) ?? null,
    avatar_url: (row.avatar_url as string | null) ?? null,
  }
}

async function loadViewerProfile() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Vous devez être connecté." as const, viewer: null, supabase, user: null }
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("user_id", user.id)
    .maybeSingle()

  if (error || !data) {
    return {
      error: "Profil introuvable. Terminez d'abord votre onboarding." as const,
      viewer: null,
      supabase,
      user,
    }
  }

  return { error: null, viewer: mapProfile(data), supabase, user }
}

async function persistMatches(
  supabase: Awaited<ReturnType<typeof createClient>>,
  viewerUserId: string,
  matches: ScoredMatch[]
) {
  for (const match of matches) {
    const { data: existing } = await supabase
      .from("matches")
      .select("id")
      .eq("user_one", viewerUserId)
      .eq("user_two", match.profile.user_id)
      .maybeSingle()

    if (existing?.id) {
      await supabase
        .from("matches")
        .update({
          compatibility_score: match.score,
          status: "pending",
        })
        .eq("id", existing.id)
    } else {
      await supabase.from("matches").insert({
        user_one: viewerUserId,
        user_two: match.profile.user_id,
        compatibility_score: match.score,
        status: "pending",
      })
    }
  }
}

export type CompatibilityListItem = {
  id: string
  userId: string
  name: string
  age: number
  city: string
  community: string
  harmonyScore: number
  reasons: string[]
  photoUrl?: string
  isVerified: boolean
  level: ScoredMatch["level"]
}

export async function getCompatibilitySuggestions(limit?: number): Promise<{
  error?: string
  needsOnboarding?: boolean
  suggestions: CompatibilityListItem[]
}> {
  const loaded = await loadViewerProfile()
  if (loaded.error || !loaded.viewer || !loaded.user) {
    return { error: loaded.error ?? "Session invalide.", suggestions: [] }
  }

  const viewer = loaded.viewer
  if (
    (viewer.completion_percentage ?? 0) < 50 ||
    viewer.onboarding_status === "step1_account" ||
    viewer.onboarding_status === "step2_profile"
  ) {
    return {
      needsOnboarding: true,
      error: "Complétez votre questionnaire d'accueil pour recevoir des suggestions.",
      suggestions: [],
    }
  }

  const entitlements = await getUserEntitlements(viewer.user_id)
  const suggestionLimit =
    limit ?? entitlements.limits.dailySuggestions ?? FREE_DAILY_SUGGESTIONS

  const { data: rows, error } = await loaded.supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .is("deleted_at", null)
    .neq("user_id", viewer.user_id)
    .gte("completion_percentage", 50)
    .limit(80)

  if (error) {
    return { error: error.message, suggestions: [] }
  }

  const candidates = (rows ?? [])
    .filter((row) => {
      const privacy = row.privacy_settings
      if (!privacy || typeof privacy !== "object" || Array.isArray(privacy)) return true
      return !(privacy as Record<string, unknown>).retreat_mode
    })
    .map((row) => mapProfile(row))

  const { data: prefs } = await loaded.supabase
    .from("user_preferences")
    .select("age_min, age_max")
    .eq("user_id", viewer.id)
    .maybeSingle()

  const ageFiltered = candidates.filter((candidate) => {
    if (!prefs) return true
    const age = ageFromProfile(candidate)
    if (age == null) return true
    if (prefs.age_min != null && age < prefs.age_min) return false
    if (prefs.age_max != null && age > prefs.age_max) return false
    return true
  })

  const ranked = rankMatches(viewer, ageFiltered, suggestionLimit)

  await persistMatches(loaded.supabase, viewer.user_id, ranked)

  return {
    suggestions: ranked.map((match) => ({
      id: match.profile.id,
      userId: match.profile.user_id,
      name: match.profile.first_name || "Profil",
      age: ageFromProfile(match.profile) ?? 0,
      city: match.profile.city || "Ville non précisée",
      community: match.profile.denomination || "Communauté non précisée",
      harmonyScore: match.score,
      reasons: match.reasons,
      photoUrl: match.profile.avatar_url ?? undefined,
      isVerified: Boolean(match.profile.is_verified),
      level: match.level,
    })),
  }
}

export async function getCompatibilityDetail(profileId: string): Promise<{
  error?: string
  detail?: {
    id: string
    name: string
    age: number
    city: string
    community: string
    harmonyScore: number
    bio: string
    pillars: ScoredMatch["pillars"]
    answers: { question: string; answer: string }[]
    isVerified: boolean
  }
}> {
  const loaded = await loadViewerProfile()
  if (loaded.error || !loaded.viewer) {
    return { error: loaded.error ?? "Session invalide." }
  }

  const { data, error } = await loaded.supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("id", profileId)
    .maybeSingle()

  if (error || !data) {
    return { error: "Profil introuvable." }
  }

  const privacy = data.privacy_settings
  if (
    privacy &&
    typeof privacy === "object" &&
    !Array.isArray(privacy) &&
    (privacy as Record<string, unknown>).retreat_mode
  ) {
    return { error: "Ce profil est actuellement en mode retraite." }
  }

  const candidate = mapProfile(data)
  const scored = rankMatches(loaded.viewer, [candidate], 1)[0]

  if (!scored) {
    return {
      error:
        "Ce profil n'atteint pas le seuil de compatibilité recommandé, ou ne passe pas les filtres de dignité.",
    }
  }

  const ind = candidate.matching_indicators

  return {
    detail: {
      id: candidate.id,
      name: candidate.first_name || "Profil",
      age: ageFromProfile(candidate) ?? 0,
      city: candidate.city || "Ville non précisée",
      community: candidate.denomination || "Communauté non précisée",
      harmonyScore: scored.score,
      bio:
        candidate.biography ||
        candidate.testimony ||
        "Ce membre n'a pas encore rédigé de présentation longue.",
      pillars: scored.pillars,
      isVerified: Boolean(candidate.is_verified),
      answers: [
        {
          question: "La place de la foi dans mon quotidien",
          answer:
            ind?.spiritual_practice ||
            candidate.attendance_frequency ||
            "Non renseigné pour le moment.",
        },
        {
          question: "Ma vision du mariage",
          answer: ind?.marriage_vision || "Non renseignée pour le moment.",
        },
        {
          question: "Mon projet de famille & foyer",
          answer: ind?.family_project || "Non renseigné pour le moment.",
        },
      ],
    },
  }
}

export async function refreshCompatibilitySuggestions() {
  const result = await getCompatibilitySuggestions()
  revalidatePath("/compatibility")
  return result
}
