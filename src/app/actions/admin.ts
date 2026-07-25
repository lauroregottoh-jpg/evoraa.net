"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Non authentifié." as string, supabase: null, user: null }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle()

  if (profile?.role !== "admin" && profile?.role !== "moderator") {
    return { error: "Accès admin requis." as string, supabase: null, user: null }
  }

  return { error: undefined as string | undefined, supabase, user }
}

export type AdminRetention = {
  newMembers30d: number
  profilesComplete70: number
  assessmentsDoneAll: number
  activeFreeEstimate: number
  activeAlliance: number
  activeLegacyPremium: number
  expiredSubs30d: number
  cancelledSubs30d: number
  conversations30d: number
  conversionPaidPct: number
}

export async function getAdminDashboardData() {
  const gate = await requireAdmin()
  if (gate.error || !gate.supabase) {
    return {
      error: gate.error || "Erreur",
      users: [],
      reports: [],
      payments: [],
      photos: [],
      subscriptions: [],
      stats: null,
      retention: null,
    }
  }
  const supabase = gate.supabase

  const since30 = new Date()
  since30.setDate(since30.getDate() - 30)
  const since30Iso = since30.toISOString()

  const { data: profiles } = await supabase
    .from("profiles")
    .select(
      "id, user_id, first_name, last_name, city, completion_percentage, role, moderation_status, onboarding_status, is_verified, identity_verified, created_at, avatar_url, psychometric_results"
    )
    .order("created_at", { ascending: false })
    .limit(150)

  const { data: reports } = await supabase
    .from("reports")
    .select("id, reporter_id, reported_user_id, reason, status, created_at")
    .order("created_at", { ascending: false })
    .limit(50)

  const { data: payments } = await supabase
    .from("payments")
    .select(
      "id, amount, currency, status, provider, transaction_reference, created_at, subscription_id, user_id"
    )
    .order("created_at", { ascending: false })
    .limit(100)

  const { data: photos } = await supabase
    .from("user_photos")
    .select("id, profile_id, photo_url, status, is_primary, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(50)

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("id, user_id, plan, status, starts_at, ends_at, created_at")
    .order("created_at", { ascending: false })
    .limit(100)

  const { count: usersCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })

  const { count: activeSubs } = await supabase
    .from("subscriptions")
    .select("id", { count: "exact", head: true })
    .eq("status", "active")

  const { count: openReports } = await supabase
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending")

  const { count: pendingPhotosCount } = await supabase
    .from("user_photos")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending")

  const { count: newMembers30d } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .gte("created_at", since30Iso)

  const { count: profilesComplete70 } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .gte("completion_percentage", 70)

  const { count: activeAlliance } = await supabase
    .from("subscriptions")
    .select("id", { count: "exact", head: true })
    .eq("status", "active")
    .eq("plan", "premium_plus")

  const { count: activeLegacyPremium } = await supabase
    .from("subscriptions")
    .select("id", { count: "exact", head: true })
    .eq("status", "active")
    .eq("plan", "premium")

  const { count: expiredSubs30d } = await supabase
    .from("subscriptions")
    .select("id", { count: "exact", head: true })
    .eq("status", "expired")
    .gte("ends_at", since30Iso)

  const { count: cancelledSubs30d } = await supabase
    .from("subscriptions")
    .select("id", { count: "exact", head: true })
    .eq("status", "cancelled")
    .gte("created_at", since30Iso)

  const { count: conversations30d } = await supabase
    .from("conversations")
    .select("id", { count: "exact", head: true })
    .gte("created_at", since30Iso)

  // Revenue: sum completed from loaded payments + broader query
  const { data: allCompleted } = await supabase
    .from("payments")
    .select("amount")
    .eq("status", "completed")
    .limit(500)

  const revenue = (allCompleted ?? []).reduce((sum, p) => sum + Number(p.amount || 0), 0)

  const totalUsers = usersCount ?? 0
  const paidActive = (activeAlliance ?? 0) + (activeLegacyPremium ?? 0)
  const conversionPaidPct =
    totalUsers > 0 ? Math.round((paidActive / totalUsers) * 1000) / 10 : 0

  let assessmentsDoneAll = 0
  for (const p of profiles ?? []) {
    const psy = p.psychometric_results
    if (!psy || typeof psy !== "object") continue
    const o = psy as Record<string, unknown>
    if (o.personality != null && o.spiritual != null && o.relationship != null) {
      assessmentsDoneAll += 1
    }
  }

  const users = (profiles ?? []).map((p) => ({
    id: p.id,
    userId: p.user_id as string,
    name: [p.first_name, p.last_name].filter(Boolean).join(" ") || "Sans nom",
    city: p.city || "—",
    completion: p.completion_percentage ?? 0,
    role: (p.role as "admin" | "moderator" | "member") || "member",
    status: (p.moderation_status as string) || "pending",
    onboarding: p.onboarding_status as string | null,
    verified: Boolean(p.is_verified || p.identity_verified),
    hasAvatar: Boolean(p.avatar_url),
    createdAt: p.created_at as string | null,
  }))

  const retention: AdminRetention = {
    newMembers30d: newMembers30d ?? 0,
    profilesComplete70: profilesComplete70 ?? 0,
    assessmentsDoneAll,
    activeFreeEstimate: Math.max(0, totalUsers - paidActive),
    activeAlliance: activeAlliance ?? 0,
    activeLegacyPremium: activeLegacyPremium ?? 0,
    expiredSubs30d: expiredSubs30d ?? 0,
    cancelledSubs30d: cancelledSubs30d ?? 0,
    conversations30d: conversations30d ?? 0,
    conversionPaidPct,
  }

  return {
    users,
    reports: reports ?? [],
    payments: payments ?? [],
    photos: photos ?? [],
    subscriptions: (subscriptions ?? []).map((s) => ({
      id: s.id as string,
      userId: s.user_id as string,
      plan: s.plan as string,
      status: s.status as string,
      startsAt: s.starts_at as string | null,
      endsAt: s.ends_at as string | null,
      createdAt: s.created_at as string | null,
    })),
    stats: {
      users: totalUsers,
      activeSubscriptions: activeSubs ?? 0,
      openReports: openReports ?? 0,
      pendingPhotos: pendingPhotosCount ?? 0,
      revenueXof: revenue,
    },
    retention,
  }
}

export async function adminUpdateModerationStatus(
  profileId: string,
  status: "approved" | "rejected" | "pending"
) {
  const gate = await requireAdmin()
  if (gate.error || !gate.supabase) return { error: gate.error || "Accès refusé." }

  const { error } = await gate.supabase
    .from("profiles")
    .update({ moderation_status: status })
    .eq("id", profileId)

  if (error) return { error: error.message }
  revalidatePath("/admin")
  return { success: true }
}

export async function adminSetVerified(profileId: string, verified: boolean) {
  const gate = await requireAdmin()
  if (gate.error || !gate.supabase) return { error: gate.error || "Accès refusé." }

  const { error } = await gate.supabase
    .from("profiles")
    .update({
      is_verified: verified,
      identity_verified: verified,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profileId)

  if (error) return { error: error.message }
  revalidatePath("/admin")
  return { success: true }
}

export async function adminResolveReport(
  reportId: string,
  status: "resolved" | "dismissed" | "pending"
) {
  const gate = await requireAdmin()
  if (gate.error || !gate.supabase) return { error: gate.error || "Accès refusé." }

  const { error } = await gate.supabase
    .from("reports")
    .update({ status })
    .eq("id", reportId)

  if (error) return { error: error.message }
  revalidatePath("/admin")
  return { success: true }
}

export async function adminModeratePhoto(photoId: string, status: "approved" | "rejected") {
  const gate = await requireAdmin()
  if (gate.error || !gate.supabase) return { error: gate.error || "Accès refusé." }

  const { data: photo, error: fetchError } = await gate.supabase
    .from("user_photos")
    .select("id, profile_id, photo_url, is_primary")
    .eq("id", photoId)
    .maybeSingle()

  if (fetchError || !photo) return { error: fetchError?.message || "Photo introuvable" }

  const { error } = await gate.supabase
    .from("user_photos")
    .update({ status })
    .eq("id", photoId)

  if (error) return { error: error.message }

  if (status === "approved" && photo.is_primary) {
    await gate.supabase
      .from("profiles")
      .update({
        avatar_url: photo.photo_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", photo.profile_id)
  }

  revalidatePath("/admin")
  revalidatePath("/profile")
  return { success: true }
}
