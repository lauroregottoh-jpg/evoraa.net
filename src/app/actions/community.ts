"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { getUserEntitlements } from "@/lib/billing/entitlements"
import { startConversationFromProfile } from "@/app/actions/messaging"

export type CommunityMemberCard = {
  profileId: string
  userId: string
  firstName: string
  age: number
  city: string | null
  denomination: string | null
  avatarUrl: string | null
  gender: string | null
  isVerified: boolean
  badge: "alliance" | "boost" | "decouverte" | null
  likedByMe: boolean
  likesMe: boolean
  mutual: boolean
  sameGender: boolean
}

function calcAge(birth: string | null): number {
  if (!birth) return 0
  const d = new Date(birth)
  if (Number.isNaN(d.getTime())) return 0
  const t = new Date()
  let age = t.getFullYear() - d.getFullYear()
  const m = t.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && t.getDate() < d.getDate())) age--
  return age > 0 && age < 120 ? age : 0
}

function privacyFlag(
  privacy: unknown,
  key: string
): boolean {
  if (!privacy || typeof privacy !== "object") return false
  return Boolean((privacy as Record<string, unknown>)[key])
}

async function getViewerContext() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié." as const }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, user_id, gender, privacy_settings")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!profile?.id) return { error: "Profil introuvable." as const }

  const entitlements = await getUserEntitlements(user.id)
  const sameSexFriendship =
    entitlements.isPaid &&
    privacyFlag(profile.privacy_settings, "same_sex_friendship")

  return {
    error: null as null,
    supabase,
    user,
    profileId: profile.id as string,
    gender: (profile.gender as string | null) || null,
    isPaid: entitlements.isPaid,
    sameSexFriendship,
  }
}

/** Liste des membres visibles dans la Communauté KELIAA. */
export async function listCommunityMembers(limit = 48): Promise<{
  error?: string
  members: CommunityMemberCard[]
  sameSexFriendship: boolean
  isPaid: boolean
}> {
  const ctx = await getViewerContext()
  if (ctx.error || !("supabase" in ctx)) {
    return { error: ctx.error || "Erreur", members: [], sameSexFriendship: false, isPaid: false }
  }

  const { data: rows, error } = await ctx.supabase
    .from("profiles")
    .select(
      "id, user_id, first_name, last_name, gender, birth_date, city, denomination, avatar_url, is_verified, identity_verified, privacy_settings, completion_percentage, moderation_status, deleted_at, created_at"
    )
    .is("deleted_at", null)
    .neq("user_id", ctx.user.id)
    .neq("moderation_status", "rejected")
    .order("created_at", { ascending: false })
    .limit(Math.min(Math.max(limit * 2, 40), 120))

  if (error) {
    return {
      error: error.message,
      members: [],
      sameSexFriendship: ctx.sameSexFriendship,
      isPaid: ctx.isPaid,
    }
  }

  const { isHiddenOperatorProfile } = await import(
    "@/lib/community/hiddenProfiles"
  )

  const profiles = (rows || []).filter((p) => {
    if (privacyFlag(p.privacy_settings, "retreat_mode")) return false
    if (
      isHiddenOperatorProfile(
        p.first_name as string | null,
        p.last_name as string | null
      )
    ) {
      return false
    }
    // Nouveaux inscrits visibles dès qu’ils ont un prénom
    const name = String(p.first_name || "").trim()
    if (!name) return false
    return true
  })

  const userIds = profiles.map((p) => p.user_id as string).filter(Boolean)
  const profileIds = profiles.map((p) => p.id as string)

  const paidSet = new Set<string>()
  const trialSet = new Set<string>()
  if (userIds.length) {
    const { data: subs } = await ctx.supabase
      .from("subscriptions")
      .select("user_id, plan, status, ends_at")
      .in("user_id", userIds)
      .in("status", ["active", "trialing", "trial"])

    const now = Date.now()
    for (const s of subs || []) {
      const uid = s.user_id as string
      const plan = String(s.plan || "")
      if (plan === "premium_plus" || plan === "premium") {
        paidSet.add(uid)
        const ends = s.ends_at ? new Date(s.ends_at as string).getTime() : 0
        if (
          s.status === "trialing" ||
          s.status === "trial" ||
          (ends > 0 && ends - now < 14 * 86400_000 && ends > now)
        ) {
          // Marquer Boost si période courte / trial
          if (s.status === "trialing" || s.status === "trial") {
            trialSet.add(uid)
          }
        }
      }
    }
  }

  const likedByMe = new Set<string>()
  const likesMe = new Set<string>()
  if (profileIds.length) {
    const [{ data: mine }, { data: theirs }] = await Promise.all([
      ctx.supabase
        .from("profile_favorites")
        .select("target_profile_id")
        .eq("owner_profile_id", ctx.profileId)
        .in("target_profile_id", profileIds),
      ctx.supabase
        .from("profile_favorites")
        .select("owner_profile_id")
        .eq("target_profile_id", ctx.profileId)
        .in("owner_profile_id", profileIds),
    ])
    for (const r of mine || []) likedByMe.add(r.target_profile_id as string)
    for (const r of theirs || []) likesMe.add(r.owner_profile_id as string)
  }

  const members: CommunityMemberCard[] = profiles.map((p) => {
    const uid = p.user_id as string
    const sameGender =
      Boolean(ctx.gender) &&
      Boolean(p.gender) &&
      String(ctx.gender).toLowerCase() === String(p.gender).toLowerCase()
    const liked = likedByMe.has(p.id)
    const likedBack = likesMe.has(p.id)
    let badge: CommunityMemberCard["badge"] = "decouverte"
    if (trialSet.has(uid)) badge = "boost"
    else if (paidSet.has(uid)) badge = "alliance"
    return {
      profileId: p.id as string,
      userId: uid,
      firstName: (p.first_name as string) || "Membre",
      age: calcAge(p.birth_date as string | null),
      city: (p.city as string) || null,
      denomination: (p.denomination as string) || null,
      avatarUrl: (p.avatar_url as string) || null,
      gender: (p.gender as string) || null,
      isVerified: Boolean(p.is_verified || p.identity_verified),
      badge,
      likedByMe: liked,
      likesMe: likedBack,
      mutual: liked && likedBack,
      sameGender,
    }
  })

  // Alliance / Boost en avant, puis les plus récents
  members.sort((a, b) => {
    const rank = (x: CommunityMemberCard) =>
      x.badge === "alliance" ? 0 : x.badge === "boost" ? 1 : 2
    return rank(a) - rank(b)
  })

  return {
    members: members.slice(0, limit),
    sameSexFriendship: ctx.sameSexFriendship,
    isPaid: ctx.isPaid,
  }
}

/** Like communauté (favori). Like mutuel → débloque les messages. */
export async function toggleCommunityLikeAction(targetProfileId: string): Promise<{
  error?: string
  liked?: boolean
  mutual?: boolean
  conversationId?: string
  blockedSameSex?: boolean
}> {
  const ctx = await getViewerContext()
  if (ctx.error || !("supabase" in ctx)) return { error: ctx.error }

  if (ctx.profileId === targetProfileId) {
    return { error: "Action impossible sur votre propre profil." }
  }

  const { data: target } = await ctx.supabase
    .from("profiles")
    .select("id, user_id, gender, privacy_settings, first_name, last_name")
    .eq("id", targetProfileId)
    .maybeSingle()

  if (!target) return { error: "Profil introuvable." }

  const { isHiddenOperatorProfile } = await import(
    "@/lib/community/hiddenProfiles"
  )
  if (
    isHiddenOperatorProfile(
      target.first_name as string | null,
      target.last_name as string | null
    )
  ) {
    return { error: "Profil introuvable." }
  }

  const sameGender =
    Boolean(ctx.gender) &&
    Boolean(target.gender) &&
    String(ctx.gender).toLowerCase() === String(target.gender).toLowerCase()

  if (sameGender && !ctx.sameSexFriendship) {
    return {
      error:
        "Pour liker un profil du même sexe (amitié), activez l’option dans Paramètres Alliance.",
      blockedSameSex: true,
    }
  }

  const { data: existing } = await ctx.supabase
    .from("profile_favorites")
    .select("id")
    .eq("owner_profile_id", ctx.profileId)
    .eq("target_profile_id", targetProfileId)
    .maybeSingle()

  if (existing?.id) {
    await ctx.supabase.from("profile_favorites").delete().eq("id", existing.id)
    revalidatePath("/communaute")
    revalidatePath("/dashboard")
    revalidatePath("/messages")
    return { liked: false, mutual: false }
  }

  const { error } = await ctx.supabase.from("profile_favorites").insert({
    owner_profile_id: ctx.profileId,
    target_profile_id: targetProfileId,
  })
  if (error) return { error: error.message }

  const { data: reciprocal } = await ctx.supabase
    .from("profile_favorites")
    .select("id")
    .eq("owner_profile_id", targetProfileId)
    .eq("target_profile_id", ctx.profileId)
    .maybeSingle()

  const mutual = Boolean(reciprocal?.id)
  let conversationId: string | undefined

  if (mutual) {
    // Côté partenaire : amitié même sexe aussi requise si applicable
    const partnerAllows =
      !sameGender ||
      privacyFlag(target.privacy_settings, "same_sex_friendship")
    if (partnerAllows || !sameGender) {
      const started = await startConversationFromProfile(targetProfileId)
      if (started.conversationId) conversationId = started.conversationId
    }
  }

  revalidatePath("/communaute")
  revalidatePath("/dashboard")
  revalidatePath("/messages")
  return { liked: true, mutual, conversationId }
}
