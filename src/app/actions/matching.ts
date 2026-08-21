"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { getUserEntitlements } from "@/lib/billing/entitlements"
import {
  FREE_DAILY_SUGGESTIONS,
  MIN_MATCH_COMPLETION,
  type MatchableProfile,
  type ScoredMatch,
} from "@/lib/matching/types"
import { ageFromProfile, parseIndicators, rankMatches } from "@/lib/matching/score"

function parsePsychometrics(value: unknown): MatchableProfile["psychometric_results"] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null
  const v = value as Record<string, unknown>
  const dimsRaw =
    v.dimensions && typeof v.dimensions === "object" && !Array.isArray(v.dimensions)
      ? (v.dimensions as Record<string, Record<string, number>>)
      : null
  return {
    personality: typeof v.personality === "number" ? v.personality : null,
    spiritual: typeof v.spiritual === "number" ? v.spiritual : null,
    relationship: typeof v.relationship === "number" ? v.relationship : null,
    couple_life: typeof v.couple_life === "number" ? v.couple_life : null,
    finances: typeof v.finances === "number" ? v.finances : null,
    dimensions: dimsRaw,
    pillars_completed:
      typeof v.pillars_completed === "number" ? v.pillars_completed : null,
    updated_at: typeof v.updated_at === "string" ? v.updated_at : null,
  }
}

const PROFILE_SELECT = `
  id,
  user_id,
  first_name,
  last_name,
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
  if (matches.length === 0) return

  const partnerIds = matches.map((m) => m.profile.user_id)
  const { data: existingRows } = await supabase
    .from("matches")
    .select("id, user_two")
    .eq("user_one", viewerUserId)
    .in("user_two", partnerIds)

  const existingByPartner = new Map(
    (existingRows ?? []).map((r) => [r.user_two as string, r.id as string])
  )

  const toInsert: Array<{
    user_one: string
    user_two: string
    compatibility_score: number
    status: string
  }> = []

  await Promise.all(
    matches.map(async (match) => {
      const existingId = existingByPartner.get(match.profile.user_id)
      if (existingId) {
        await supabase
          .from("matches")
          .update({
            compatibility_score: match.score,
            status: "pending",
          })
          .eq("id", existingId)
      } else {
        toInsert.push({
          user_one: viewerUserId,
          user_two: match.profile.user_id,
          compatibility_score: match.score,
          status: "pending",
        })
      }
    })
  )

  if (toInsert.length > 0) {
    await supabase.from("matches").insert(toInsert)
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
  domainScores: ScoredMatch["domainScores"]
  insights: ScoredMatch["insights"]
  photoUrl?: string
  isVerified: boolean
  level: ScoredMatch["level"]
  basis: ScoredMatch["basis"]
  viewerTestsCount: number
  partnerTestsCount: number
  missingOnPartner: ScoredMatch["missingOnPartner"]
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
    (viewer.completion_percentage ?? 0) < MIN_MATCH_COMPLETION ||
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

  const viewerGender = (viewer.gender || "").toUpperCase()
  const targetGender =
    viewerGender === "M" ? "F" : viewerGender === "F" ? "M" : null

  let poolQuery = loaded.supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .is("deleted_at", null)
    .neq("user_id", viewer.user_id)
    .neq("moderation_status", "rejected")
    .gte("completion_percentage", MIN_MATCH_COMPLETION)
    .order("completion_percentage", { ascending: false })
    .limit(120)

  if (targetGender) {
    poolQuery = poolQuery.eq("gender", targetGender)
  }

  const { data: rows, error } = await poolQuery

  if (error) {
    return { error: error.message, suggestions: [] }
  }

  const { isHiddenOperatorProfile } = await import(
    "@/lib/community/hiddenProfiles"
  )

  const candidates = (rows ?? [])
    .filter((row) => {
      const status = row.moderation_status as string | null
      // Soft launch : pending OK si profil assez complet ; rejected déjà exclu
      if (status === "rejected") return false
      if (
        isHiddenOperatorProfile(
          row.first_name as string | null,
          row.last_name as string | null
        )
      ) {
        return false
      }
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
      domainScores: match.domainScores,
      insights: match.insights,
      photoUrl: match.profile.avatar_url ?? undefined,
      isVerified: Boolean(match.profile.is_verified),
      level: match.level,
      basis: match.basis,
      viewerTestsCount: match.viewerTestsCount,
      partnerTestsCount: match.partnerTestsCount,
      missingOnPartner: match.missingOnPartner,
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
    domainScores: ScoredMatch["domainScores"]
    insights: ScoredMatch["insights"]
    answers: { question: string; answer: string }[]
    isVerified: boolean
    basis: ScoredMatch["basis"]
    viewerTestsCount: number
    partnerTestsCount: number
    missingOnPartner: ScoredMatch["missingOnPartner"]
    partnerUserId: string
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

  const { isHiddenOperatorProfile } = await import(
    "@/lib/community/hiddenProfiles"
  )
  if (
    isHiddenOperatorProfile(
      data.first_name as string | null,
      data.last_name as string | null
    )
  ) {
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
        "Ce profil n'atteint pas le seuil de compatibilité recommandé, ou ne passe pas les filtres de respect.",
    }
  }

  // Enregistre la visite (analytics + paywall visiteurs Alliance)
  const viewerProfileId = loaded.viewer.id
  if (viewerProfileId !== profileId) {
    await loaded.supabase.from("profile_views").upsert(
      {
        viewer_profile_id: viewerProfileId,
        viewed_profile_id: profileId,
        viewed_at: new Date().toISOString(),
      },
      { onConflict: "viewer_profile_id,viewed_profile_id" }
    )
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
      domainScores: scored.domainScores,
      insights: scored.insights,
      isVerified: Boolean(candidate.is_verified),
      basis: scored.basis,
      viewerTestsCount: scored.viewerTestsCount,
      partnerTestsCount: scored.partnerTestsCount,
      missingOnPartner: scored.missingOnPartner,
      partnerUserId: candidate.user_id,
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

/**
 * Calcule et enregistre les suggestions pour tous les profils éligibles (OPS).
 */
export async function runMatchingSweepAction(): Promise<{
  error?: string
  viewers?: number
  pairsWritten?: number
  notified?: number
}> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié." }

  const { canFullAdminOps, resolveAuthEmail } = await import(
    "@/lib/admin/consolePath"
  )
  const { createAdminClient } = await import("@/utils/supabase/admin")
  const admin = createAdminClient()
  const { data: roleRow } = await admin
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle()
  if (
    !canFullAdminOps({
      role: (roleRow?.role as string) || null,
      email: resolveAuthEmail(user),
    })
  ) {
    return { error: "Réservé aux administrateurs." }
  }

  const { isHiddenOperatorProfile } = await import(
    "@/lib/community/hiddenProfiles"
  )
  const { data: rows } = await admin
    .from("profiles")
    .select(PROFILE_SELECT)
    .is("deleted_at", null)
    .neq("moderation_status", "rejected")
    .gte("completion_percentage", MIN_MATCH_COMPLETION)
    .limit(200)

  const pool = (rows ?? [])
    .filter((row) => {
      const r = row as Record<string, unknown>
      if (
        isHiddenOperatorProfile(
          (r.first_name as string | null) ?? null,
          (r.last_name as string | null) ?? null
        )
      ) {
        return false
      }
      const status = r.onboarding_status as string | null
      return status !== "step1_account" && status !== "step2_profile"
    })
    .map((row) => mapProfile(row as Record<string, unknown>))

  let pairsWritten = 0
  let notified = 0
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.keliaa.org"

  for (const viewer of pool) {
    const others = pool.filter((p) => p.user_id !== viewer.user_id)
    const ranked = rankMatches(viewer, others, 8)
    if (ranked.length === 0) continue
    await persistMatchesAdmin(admin, viewer.user_id, ranked)
    pairsWritten += ranked.length

    const top = ranked[0]
    if (!top) continue
    const since = new Date()
    since.setDate(since.getDate() - 7)
    const { data: recent } = await admin
      .from("notifications")
      .select("id")
      .eq("user_id", viewer.user_id)
      .eq("title", "Une suggestion KELIAA vous attend")
      .gte("created_at", since.toISOString())
      .limit(1)
      .maybeSingle()
    if (recent?.id) continue

    const partnerName = top.profile.first_name || "un profil"
    await admin.from("notifications").insert({
      user_id: viewer.user_id,
      title: "Une suggestion KELIAA vous attend",
      body: `${partnerName} vous est proposé(e) à ${top.score}% d’harmonie. Ouvrez Compatibilités pour voir et écrire.`,
      is_read: false,
    })
    notified += 1

    try {
      const { data: authUser } = await admin.auth.admin.getUserById(
        viewer.user_id
      )
      const email = authUser.user?.email
      if (email) {
        const { sendEmailWithRetry } = await import("@/lib/email/outbox")
        const { suggestionMatchEmailHtml } = await import(
          "@/lib/email/templates"
        )
        await sendEmailWithRetry({
          to: email,
          subject: "KELIAA — une suggestion de compatibilité",
          html: suggestionMatchEmailHtml({
            firstName: viewer.first_name || "",
            appUrl,
            partnerFirstName: partnerName,
            score: top.score,
          }),
        })
      }
    } catch {
      /* best-effort */
    }
  }

  revalidatePath("/compatibility")
  revalidatePath("/ops-keliaa-hx7")
  return { viewers: pool.length, pairsWritten, notified }
}

async function persistMatchesAdmin(
  admin: ReturnType<typeof import("@/utils/supabase/admin").createAdminClient>,
  viewerUserId: string,
  matches: ScoredMatch[]
) {
  await persistMatches(admin as never, viewerUserId, matches)
}
