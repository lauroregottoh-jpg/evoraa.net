"use server"

import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { revalidatePath } from "next/cache"

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Non authentifié." as string, supabase: null, user: null, role: null as string | null }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle()

  if (profile?.role !== "admin" && profile?.role !== "moderator") {
    return { error: "Accès admin requis." as string, supabase: null, user: null, role: null }
  }

  return {
    error: undefined as string | undefined,
    supabase,
    user,
    role: (profile?.role as string) || null,
  }
}

async function requireFullAdmin() {
  const gate = await requireAdmin()
  if (gate.error || !gate.supabase) return gate
  if (gate.role !== "admin") {
    return { ...gate, error: "Réservé aux administrateurs (pas modérateurs)." }
  }
  return gate
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
  menCount: number
  womenCount: number
  renewalsDue7d: number
  matches30d: number
  views30d: number
  favoritesTotal: number
  pendingProfiles: number
}

export type AdminOpsFlags = {
  paymentsDemoMode: boolean
  hasCinetPay: boolean
  hasResend: boolean
  hasCronSecret: boolean
  hasServiceRole: boolean
  appUrl: string
}

export type PlatformSettingRow = {
  key: string
  value: unknown
  description: string | null
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
      conversations: [],
      settings: [] as PlatformSettingRow[],
      stats: null,
      retention: null,
      ops: null as AdminOpsFlags | null,
      viewerRole: null as string | null,
    }
  }
  const supabase = gate.supabase

  const since30 = new Date()
  since30.setDate(since30.getDate() - 30)
  const since30Iso = since30.toISOString()

  const in7 = new Date()
  in7.setDate(in7.getDate() + 7)
  const in7Iso = in7.toISOString()
  const nowIso = new Date().toISOString()

  const { data: profiles } = await supabase
    .from("profiles")
    .select(
      "id, user_id, first_name, last_name, city, gender, completion_percentage, role, moderation_status, onboarding_status, is_verified, identity_verified, created_at, avatar_url, psychometric_results"
    )
    .order("created_at", { ascending: false })
    .limit(200)

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

  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, match_id, created_at")
    .order("created_at", { ascending: false })
    .limit(40)

  const { data: settings } = await supabase
    .from("platform_settings")
    .select("key, value, description")
    .order("key")

  const { count: usersCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })

  const { count: menCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("gender", "M")

  const { count: womenCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("gender", "F")

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

  const { count: matches30d } = await supabase
    .from("matches")
    .select("id", { count: "exact", head: true })
    .gte("created_at", since30Iso)

  const { count: renewalsDue7d } = await supabase
    .from("subscriptions")
    .select("id", { count: "exact", head: true })
    .eq("status", "active")
    .gte("ends_at", nowIso)
    .lte("ends_at", in7Iso)

  const { count: views30d } = await supabase
    .from("profile_views")
    .select("viewer_profile_id", { count: "exact", head: true })
    .gte("viewed_at", since30Iso)

  const { count: favoritesTotal } = await supabase
    .from("profile_favorites")
    .select("id", { count: "exact", head: true })

  const { count: pendingProfiles } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("moderation_status", "pending")

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
    if (
      o.personality != null &&
      o.spiritual != null &&
      o.relationship != null &&
      o.couple_life != null &&
      o.finances != null
    ) {
      assessmentsDoneAll += 1
    }
  }

  const users = (profiles ?? []).map((p) => ({
    id: p.id,
    userId: p.user_id as string,
    name: [p.first_name, p.last_name].filter(Boolean).join(" ") || "Sans nom",
    city: p.city || "—",
    gender: (p.gender as string) || "—",
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
    menCount: menCount ?? 0,
    womenCount: womenCount ?? 0,
    renewalsDue7d: renewalsDue7d ?? 0,
    matches30d: matches30d ?? 0,
    views30d: views30d ?? 0,
    favoritesTotal: favoritesTotal ?? 0,
    pendingProfiles: pendingProfiles ?? 0,
  }

  const demoRaw = process.env.PAYMENTS_DEMO_MODE
  const ops: AdminOpsFlags = {
    paymentsDemoMode:
      demoRaw === "true" ||
      (demoRaw !== "false" && !process.env.CINETPAY_API_KEY),
    hasCinetPay: Boolean(process.env.CINETPAY_API_KEY && process.env.CINETPAY_SITE_ID),
    hasResend: Boolean(process.env.RESEND_API_KEY),
    hasCronSecret: Boolean(process.env.CRON_SECRET),
    hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "",
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
    conversations: (conversations ?? []).map((c) => ({
      id: c.id as string,
      matchId: c.match_id as string,
      createdAt: c.created_at as string | null,
    })),
    settings: (settings ?? []).map((s) => ({
      key: s.key as string,
      value: s.value,
      description: (s.description as string) || null,
    })),
    stats: {
      users: totalUsers,
      activeSubscriptions: activeSubs ?? 0,
      openReports: openReports ?? 0,
      pendingPhotos: pendingPhotosCount ?? 0,
      revenueXof: revenue,
    },
    retention,
    ops,
    viewerRole: gate.role,
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

export async function adminSetRole(
  profileId: string,
  role: "admin" | "moderator" | "member"
) {
  const gate = await requireFullAdmin()
  if (gate.error || !gate.supabase || !gate.user) {
    return { error: gate.error || "Accès refusé." }
  }

  const { data: target } = await gate.supabase
    .from("profiles")
    .select("user_id")
    .eq("id", profileId)
    .maybeSingle()

  if (target?.user_id === gate.user.id && role !== "admin") {
    return { error: "Vous ne pouvez pas retirer votre propre rôle admin." }
  }

  const { error } = await gate.supabase
    .from("profiles")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", profileId)

  if (error) return { error: error.message }
  revalidatePath("/admin")
  return { success: true }
}

export async function adminGrantAlliance(userId: string, days = 30) {
  const gate = await requireFullAdmin()
  if (gate.error || !gate.supabase) return { error: gate.error || "Accès refusé." }

  const now = new Date()
  const ends = new Date(now)
  ends.setDate(ends.getDate() + days)

  const { data: existing } = await gate.supabase
    .from("subscriptions")
    .select("id, ends_at")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (existing?.id) {
    const currentEnd = existing.ends_at ? new Date(existing.ends_at) : now
    const base = currentEnd > now ? currentEnd : now
    const newEnd = new Date(base)
    newEnd.setDate(newEnd.getDate() + days)
    const { error } = await gate.supabase
      .from("subscriptions")
      .update({
        plan: "premium_plus",
        ends_at: newEnd.toISOString(),
      })
      .eq("id", existing.id)
    if (error) return { error: error.message }
  } else {
    const { error } = await gate.supabase.from("subscriptions").insert({
      user_id: userId,
      plan: "premium_plus",
      status: "active",
      starts_at: now.toISOString(),
      ends_at: ends.toISOString(),
    })
    if (error) return { error: error.message }
  }

  revalidatePath("/admin")
  revalidatePath("/billing")
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

export async function adminUpdatePlatformSetting(key: string, value: unknown) {
  const gate = await requireFullAdmin()
  if (gate.error || !gate.supabase || !gate.user) {
    return { error: gate.error || "Accès refusé." }
  }

  const allowed = new Set([
    "maintenance_mode",
    "min_compatibility_threshold",
    "default_photo_blur",
    "require_charter",
    "soft_launch_notes",
  ])
  if (!allowed.has(key)) return { error: "Clé non autorisée." }

  const { error } = await gate.supabase.from("platform_settings").upsert({
    key,
    value: value as never,
    updated_at: new Date().toISOString(),
    updated_by: gate.user.id,
  })

  if (error) return { error: error.message }
  revalidatePath("/admin")
  return { success: true }
}

/** Diagnostic service-role (sans exposer la clé). */
export async function adminPingServiceRole() {
  const gate = await requireFullAdmin()
  if (gate.error) return { error: gate.error, ok: false }
  try {
    const admin = createAdminClient()
    const { count, error } = await admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
    if (error) return { error: error.message, ok: false }
    return { ok: true, profiles: count ?? 0 }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur", ok: false }
  }
}
