"use server"

import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { revalidatePath } from "next/cache"
import {
  canAccessOpsConsole,
  canFullAdminOps,
  isOpsAdminEmail,
  OPS_CONSOLE_PATH,
  resolveAuthEmail,
  type StaffRole,
} from "@/lib/admin/consolePath"

function revalidateOps() {
  revalidatePath(OPS_CONSOLE_PATH)
}

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Non authentifie.." as string, supabase: null, user: null, role: null as string | null }
  }

  const email = resolveAuthEmail(user)

  // Lecture rôle via service role (bypass RLS / lecture floue middleware)
  let role: string | null = null
  try {
    const admin = createAdminClient()
    const { data: profile } = await admin
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle()
    role = (profile?.role as string) || null

    if (isOpsAdminEmail(email) && role !== "admin") {
      await admin.from("profiles").update({ role: "admin" }).eq("user_id", user.id)
      role = "admin"
    }
  } catch {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle()
    role = (profile?.role as string) || null
  }

  if (!canAccessOpsConsole({ role, email })) {
    return {
      error: `Acces staff requis. (compte: ${email || "inconnu"}, role: ${role || "aucun"}). Allez sur Paramètres → Console Admin, ou reconnectez-vous.` as string,
      supabase: null,
      user: null,
      role: null,
    }
  }

  return {
    error: undefined as string | undefined,
    supabase,
    user,
    role: isOpsAdminEmail(email) ? "admin" : role,
  }
}

async function requireFullAdmin() {
  const gate = await requireAdmin()
  if (gate.error || !gate.supabase) return gate
  const email = resolveAuthEmail(gate.user)
  if (!canFullAdminOps({ role: gate.role, email })) {
    return { ...gate, error: "Reserve a l'administrateur principal." }
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

export type AdminBreakdowns = {
  byCity: Array<{ name: string; count: number }>
  byCountry: Array<{ name: string; count: number }>
  byAge: Array<{ name: string; count: number }>
  byDenomination: Array<{ name: string; count: number }>
  signups14d: Array<{ name: string; count: number }>
  matchingRatePct: number
  avgTrust: number
  sanctioned: number
  pendingRecos: number
}

export type AdminOpsFlags = {
  paymentsDemoMode: boolean
  hasCinetPay: boolean
  hasBictorys: boolean
  paymentProvider: string
  bictorysSandbox: boolean
  hasResend: boolean
  hasCronSecret: boolean
  hasServiceRole: boolean
  appUrl: string
  hasStripe: boolean
  hasOpenAI: boolean
  hasYoutube: boolean
}

export type PlatformSettingRow = {
  key: string
  value: unknown
  description: string | null
}

export async function getOpsEntryAction(): Promise<{
  show: boolean
  href: string
  label: string
}> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { show: false, href: OPS_CONSOLE_PATH, label: "" }

  const email = resolveAuthEmail(user)
  let role: string | null = null
  try {
    const admin = createAdminClient()
    const { data: profile } = await admin
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle()
    role = (profile?.role as string) || null
    if (isOpsAdminEmail(email) && role !== "admin") {
      await admin.from("profiles").update({ role: "admin" }).eq("user_id", user.id)
      role = "admin"
    }
  } catch {
    /* ignore */
  }

  if (!canAccessOpsConsole({ role, email })) {
    return { show: false, href: OPS_CONSOLE_PATH, label: "" }
  }

  return {
    show: true,
    href: OPS_CONSOLE_PATH,
    label: "Ouvrir la console Admin",
  }
}

export async function getAdminDashboardData() {
  const gate = await requireAdmin()
  if (gate.error || !gate.supabase) {
    return {
      error: gate.error || "Erreur",
      users: [],
      reports: [],
      payments: [],
      paymentEvents: [] as Array<{
        id: string
        paymentId: string | null
        provider: string | null
        eventType: string
        status: string | null
        message: string | null
        createdAt: string | null
      }>,
      photos: [],
      subscriptions: [],
      conversations: [],
      settings: [] as PlatformSettingRow[],
      stats: null,
      retention: null,
      ops: null as AdminOpsFlags | null,
      breakdowns: null as AdminBreakdowns | null,
      matchingIntelligence: null as import("@/lib/admin/matchingIntelligence").MatchingIntelligence | null,
      matches: [] as Array<{
        id: string
        score: number | null
        status: string | null
        createdAt: string | null
        userOne: string
        userTwo: string
      }>,
      recommendations: [] as Array<{
        id: string
        profileId: string
        recommenderName: string
        recommenderRole: string | null
        churchName: string | null
        status: string
        message: string | null
        createdAt: string | null
      }>,
      moderationEvents: [] as Array<{
        id: string
        profileId: string | null
        kind: string
        reason: string | null
        createdAt: string | null
      }>,
      feedbackItems: [] as import("@/app/actions/feedback").FeedbackRow[],
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
      "id, user_id, first_name, last_name, city, country, gender, birth_date, denomination, church_attended, pastor_name, pastor_contact, completion_percentage, role, moderation_status, onboarding_status, is_verified, identity_verified, created_at, avatar_url, trust_score, warning_count, sanction_status, sanction_until"
    )
    .order("created_at", { ascending: false })
    .limit(200)

  const { data: matchingSample } = await supabase
    .from("profiles")
    .select(
      "id, user_id, first_name, last_name, city, country, gender, birth_date, denomination, completion_percentage, moderation_status, psychometric_results, matching_indicators"
    )
    .is("deleted_at", null)
    .neq("moderation_status", "rejected")
    .gte("completion_percentage", 40)
    .order("completion_percentage", { ascending: false })
    .limit(150)

  const { data: reports } = await supabase
    .from("reports")
    .select("id, reporter_id, reported_user_id, reason, status, created_at")
    .order("created_at", { ascending: false })
    .limit(50)

  const { data: payments } = await supabase
    .from("payments")
    .select(
      "id, amount, currency, status, provider, transaction_reference, created_at, subscription_id, metadata"
    )
    .order("created_at", { ascending: false })
    .limit(100)

  const payEventRes = await supabase
    .from("payment_events")
    .select("id, payment_id, provider, event_type, status, message, created_at")
    .order("created_at", { ascending: false })
    .limit(80)
  const paymentEventRows = payEventRes.error ? [] : payEventRes.data

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

  const { data: matchRows } = await supabase
    .from("matches")
    .select("id, user_one, user_two, compatibility_score, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200)

  const recoRes = await supabase
    .from("church_recommendations")
    .select(
      "id, profile_id, recommender_name, recommender_role, church_name, status, message, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(40)
  const recoRows = recoRes.error ? [] : recoRes.data

  const modRes = await supabase
    .from("moderation_events")
    .select("id, profile_id, kind, reason, created_at")
    .order("created_at", { ascending: false })
    .limit(40)
  const modEventRows = modRes.error ? [] : modRes.data

  const feedbackRes = await supabase
    .from("user_feedback")
    .select(
      "id, user_id, name, email, category, message, page_path, status, admin_note, created_at, updated_at"
    )
    .order("created_at", { ascending: false })
    .limit(200)
  const feedbackItems = (feedbackRes.error ? [] : feedbackRes.data ?? []).map((f) => ({
    id: f.id as string,
    user_id: (f.user_id as string) || null,
    name: (f.name as string) || null,
    email: (f.email as string) || null,
    category: (f.category as string) || "other",
    message: (f.message as string) || "",
    page_path: (f.page_path as string) || null,
    status: (f.status as string) || "new",
    admin_note: (f.admin_note as string) || null,
    created_at: (f.created_at as string) || new Date().toISOString(),
    updated_at: (f.updated_at as string) || null,
  }))

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

  const { data: revenueSum, error: revenueErr } = await supabase.rpc(
    "sum_completed_payments" as never
  )
  if (revenueErr) {
    console.error("[admin] revenue sum", revenueErr.message)
  }
  const revenue = Number(revenueSum ?? 0)

  const totalUsers = usersCount ?? 0
  const paidActive = (activeAlliance ?? 0) + (activeLegacyPremium ?? 0)
  const conversionPaidPct =
    totalUsers > 0 ? Math.round((paidActive / totalUsers) * 1000) / 10 : 0

  let assessmentsDoneAll = 0
  for (const p of matchingSample ?? []) {
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

  const users = (profiles ?? []).map((p) => {
    let age: number | null = null
    if (p.birth_date) {
      const y = new Date(p.birth_date as string).getFullYear()
      if (Number.isFinite(y)) age = new Date().getFullYear() - y
    }
    return {
      id: p.id,
      userId: p.user_id as string,
      name: [p.first_name, p.last_name].filter(Boolean).join(" ") || "Sans nom",
      city: p.city || "?",
      country: (p.country as string) || "?",
      gender: (p.gender as string) || "?",
      age,
      denomination: (p.denomination as string) || "",
      church: (p.church_attended as string) || "",
      pastorName: (p.pastor_name as string) || "",
      completion: p.completion_percentage ?? 0,
      role: (p.role as "admin" | "moderator" | "member") || "member",
      status: (p.moderation_status as string) || "pending",
      onboarding: p.onboarding_status as string | null,
      verified: Boolean(p.is_verified || p.identity_verified),
      hasAvatar: Boolean(p.avatar_url),
      createdAt: p.created_at as string | null,
      trustScore: Number(p.trust_score ?? 50),
      warningCount: Number(p.warning_count ?? 0),
      sanctionStatus: (p.sanction_status as string) || "none",
    }
  })

  const { aggregateTop, ageBucket, signupsByDay, matchingRate } = await import(
    "@/lib/admin/analytics"
  )

  const breakdowns: AdminBreakdowns = {
    byCity: aggregateTop(
      (profiles ?? []).map((p) => p.city as string | null),
      10
    ),
    byCountry: aggregateTop(
      (profiles ?? []).map((p) => (p.country as string) || "Non renseigne"),
      8
    ),
    byAge: aggregateTop(
      (profiles ?? []).map((p) => ageBucket(p.birth_date as string | null)),
      8
    ),
    byDenomination: aggregateTop(
      (profiles ?? []).map((p) => p.denomination as string | null),
      8
    ),
    signups14d: signupsByDay(
      (profiles ?? []).map((p) => p.created_at as string | null),
      14
    ),
    matchingRatePct: matchingRate(matches30d ?? 0, totalUsers),
    avgTrust:
      users.length > 0
        ? Math.round(users.reduce((s, u) => s + u.trustScore, 0) / users.length)
        : 50,
    sanctioned: users.filter((u) => u.sanctionStatus && u.sanctionStatus !== "none")
      .length,
    pendingRecos: (recoRows ?? []).filter((r) => r.status === "pending").length,
  }

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
  const hasBictorys = Boolean(process.env.BICTORYS_API_KEY)
  const hasCinetPay = Boolean(process.env.CINETPAY_API_KEY && process.env.CINETPAY_SITE_ID)
  const paymentProvider = hasBictorys
    ? "bictorys"
    : hasCinetPay
      ? "cinetpay"
      : process.env.PAYMENT_PROVIDER || "demo"
  const ops: AdminOpsFlags = {
    paymentsDemoMode:
      demoRaw === "true" ||
      (demoRaw !== "false" && !hasCinetPay && !hasBictorys),
    hasCinetPay,
    hasBictorys,
    paymentProvider,
    bictorysSandbox: process.env.BICTORYS_API_KEY?.startsWith("test_") ?? false,
    hasResend: Boolean(process.env.RESEND_API_KEY),
    hasCronSecret: Boolean(process.env.CRON_SECRET),
    hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "",
    hasStripe: Boolean(process.env.STRIPE_SECRET_KEY),
    hasOpenAI: Boolean(process.env.OPENAI_API_KEY),
    hasYoutube: Boolean(process.env.YOUTUBE_API_KEY),
  }

  const { buildMatchingIntelligence } = await import(
    "@/lib/admin/matchingIntelligence"
  )
  const matchingIntelligence = buildMatchingIntelligence(
    (matchingSample ?? []).map((p) => ({
      id: p.id as string,
      user_id: p.user_id as string,
      first_name: (p.first_name as string) || null,
      last_name: (p.last_name as string) || null,
      city: (p.city as string) || null,
      country: (p.country as string) || null,
      gender: (p.gender as string) || null,
      birth_date: (p.birth_date as string) || null,
      denomination: (p.denomination as string) || null,
      completion_percentage: (p.completion_percentage as number) || null,
      moderation_status: (p.moderation_status as string) || null,
      psychometric_results: p.psychometric_results,
      matching_indicators: (p as { matching_indicators?: unknown }).matching_indicators,
    })),
    (matchRows ?? []).map((m) => ({
      compatibility_score:
        m.compatibility_score != null ? Number(m.compatibility_score) : null,
      created_at: (m.created_at as string) || null,
    }))
  )

  return {
    users,
    reports: reports ?? [],
    payments: (payments ?? []).map((p) => ({
      id: p.id as string,
      amount: Number(p.amount),
      currency: p.currency as string,
      status: (p.status as string) || null,
      provider: (p.provider as string) || null,
      transaction_reference: (p.transaction_reference as string) || null,
      created_at: (p.created_at as string) || null,
      metadata: p.metadata,
    })),
    paymentEvents: (paymentEventRows ?? []).map((e) => ({
      id: e.id as string,
      paymentId: (e.payment_id as string) || null,
      provider: (e.provider as string) || null,
      eventType: e.event_type as string,
      status: (e.status as string) || null,
      message: (e.message as string) || null,
      createdAt: (e.created_at as string) || null,
    })),
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
    matches: (matchRows ?? []).map((m) => ({
      id: m.id as string,
      score: m.compatibility_score != null ? Number(m.compatibility_score) : null,
      status: (m.status as string) || null,
      createdAt: m.created_at as string | null,
      userOne: m.user_one as string,
      userTwo: m.user_two as string,
    })),
    recommendations: (recoRows ?? []).map((r) => ({
      id: r.id as string,
      profileId: r.profile_id as string,
      recommenderName: r.recommender_name as string,
      recommenderRole: (r.recommender_role as string) || null,
      churchName: (r.church_name as string) || null,
      status: r.status as string,
      message: (r.message as string) || null,
      createdAt: r.created_at as string | null,
    })),
    moderationEvents: (modEventRows ?? []).map((e) => ({
      id: e.id as string,
      profileId: (e.profile_id as string) || null,
      kind: e.kind as string,
      reason: (e.reason as string) || null,
      createdAt: e.created_at as string | null,
    })),
    feedbackItems,
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
    breakdowns,
    matchingIntelligence,
    ops,
    viewerRole: gate.role,
  }
}

export async function adminUpdateModerationStatus(
  profileId: string,
  status: "approved" | "rejected" | "pending",
  reasonCode?: string,
  feedbackNote?: string
) {
  const gate = await requireAdmin()
  if (gate.error || !gate.supabase) return { error: gate.error || "Acces refuse." }

  const { labelForReason, PROFILE_REJECT_REASONS } = await import(
    "@/lib/admin/moderationCatalog"
  )
  const reasonLabel = reasonCode
    ? labelForReason(PROFILE_REJECT_REASONS, reasonCode)
    : null

  const patch: Record<string, unknown> = {
    moderation_status: status,
    updated_at: new Date().toISOString(),
  }
  if (status === "rejected" && reasonLabel) {
    patch.moderation_rejection_reason = reasonLabel
  }
  if (status === "approved") {
    patch.moderation_rejection_reason = null
  }

  const { error } = await gate.supabase.from("profiles").update(patch).eq("id", profileId)

  if (error) {
    // Colonnes optionnelles absentes sur certains schémas → fallback simple
    const { error: e2 } = await gate.supabase
      .from("profiles")
      .update({ moderation_status: status })
      .eq("id", profileId)
    if (e2) return { error: e2.message }
  }

  try {
    await gate.supabase.from("moderation_events").insert({
      profile_id: profileId,
      kind: status === "approved" ? "profile_approved" : status === "rejected" ? "profile_rejected" : "profile_pending",
      reason: reasonLabel || feedbackNote || null,
      created_by: gate.user?.id || null,
    })
  } catch {
    /* table optionnelle */
  }

  revalidateOps()
  return { success: true }
}

/** Feedback ops → notification membre (best-effort). */
export async function adminSendMemberFeedback(input: {
  profileId: string
  userId: string
  message: string
}) {
  const gate = await requireAdmin()
  if (gate.error || !gate.supabase) return { error: gate.error || "Acces refuse." }

  const message = input.message.trim().slice(0, 2000)
  if (!message) return { error: "Message vide." }

  const { error } = await gate.supabase.from("notifications").insert({
    user_id: input.userId,
    title: "Message de l’équipe KELIAA",
    body: message,
    is_read: false,
  })

  if (error) {
    // Fallback: event de modération seulement
    try {
      await gate.supabase.from("moderation_events").insert({
        profile_id: input.profileId,
        kind: "ops_feedback",
        reason: message,
        created_by: gate.user?.id || null,
      })
    } catch {
      return { error: error.message }
    }
  }

  revalidateOps()
  return { success: true }
}

export async function adminSetVerified(profileId: string, verified: boolean) {
  const gate = await requireAdmin()
  if (gate.error || !gate.supabase) return { error: gate.error || "Acces refuse." }

  const { error } = await gate.supabase
    .from("profiles")
    .update({
      is_verified: verified,
      identity_verified: verified,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profileId)

  if (error) return { error: error.message }
  revalidateOps()
  return { success: true }
}

export async function adminSetRole(
  profileId: string,
  role: StaffRole
) {
  const gate = await requireFullAdmin()
  if (gate.error || !gate.supabase || !gate.user) {
    return { error: gate.error || "Acces refuse." }
  }

  const { data: target } = await gate.supabase
    .from("profiles")
    .select("user_id")
    .eq("id", profileId)
    .maybeSingle()

  if (target?.user_id === gate.user.id && role !== "admin") {
    return { error: "Vous ne pouvez pas retirer votre propre role admin." }
  }

  const { error } = await gate.supabase
    .from("profiles")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", profileId)

  if (error) return { error: error.message }
  revalidateOps()
  return { success: true }
}

/** Nomme un membre staff par email (admin principal uniquement). */
export async function adminAssignStaffByEmail(input: {
  email: string
  role: Exclude<StaffRole, "member">
}) {
  const gate = await requireFullAdmin()
  if (gate.error || !gate.supabase) {
    return { error: gate.error || "Acces refuse." }
  }

  const email = input.email.trim().toLowerCase()
  if (!email || !email.includes("@")) {
    return { error: "Email invalide." }
  }

  try {
    createAdminClient()
  } catch {
    return { error: "Service role indisponible." }
  }

  const { findAuthUserIdByEmail } = await import("@/lib/auth/findUserByEmail")
  const found = await findAuthUserIdByEmail(email)
  if (found.error && !found.id) return { error: found.error }
  if (!found.id) {
    return { error: "Aucun compte avec cet email. La personne doit d'abord s'inscrire." }
  }

  const { data: profile, error: pe } = await gate.supabase
    .from("profiles")
    .select("id, role, first_name")
    .eq("user_id", found.id)
    .maybeSingle()

  if (pe) return { error: pe.message }
  if (!profile) return { error: "Profil introuvable pour cet utilisateur." }

  const { error } = await gate.supabase
    .from("profiles")
    .update({ role: input.role, updated_at: new Date().toISOString() })
    .eq("id", profile.id)

  if (error) return { error: error.message }
  revalidateOps()
  return {
    success: true,
    profileId: profile.id,
    name: profile.first_name,
    role: input.role,
  }
}

export async function adminListStaff() {
  const gate = await requireFullAdmin()
  if (gate.error || !gate.supabase) {
    return { error: gate.error || "Acces refuse.", staff: [] as Array<{
      id: string
      userId: string
      firstName: string
      role: string
    }> }
  }

  const { data, error } = await gate.supabase
    .from("profiles")
    .select("id, user_id, first_name, role")
    .in("role", ["admin", "moderator", "editor", "coach"])
    .order("role")

  if (error) return { error: error.message, staff: [] }

  return {
    staff: (data || []).map((p) => ({
      id: p.id as string,
      userId: p.user_id as string,
      firstName: (p.first_name as string) || "—",
      role: (p.role as string) || "member",
    })),
  }
}

export async function adminGrantAlliance(userId: string, days = 30) {
  const gate = await requireFullAdmin()
  if (gate.error || !gate.supabase) return { error: gate.error || "Acces refuse." }

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

  revalidateOps()
  revalidatePath("/billing")
  return { success: true }
}

export async function adminResolveReport(
  reportId: string,
  status: "resolved" | "dismissed" | "pending"
) {
  const gate = await requireAdmin()
  if (gate.error || !gate.supabase) return { error: gate.error || "Acces refuse." }

  const { error } = await gate.supabase
    .from("reports")
    .update({ status })
    .eq("id", reportId)

  if (error) return { error: error.message }
  revalidateOps()
  return { success: true }
}

export async function adminModeratePhoto(
  photoId: string,
  status: "approved" | "rejected",
  reason?: string
) {
  const gate = await requireAdmin()
  if (gate.error || !gate.supabase) return { error: gate.error || "Acces refuse." }

  const { data: photo, error: fetchError } = await gate.supabase
    .from("user_photos")
    .select("id, profile_id, photo_url, is_primary")
    .eq("id", photoId)
    .maybeSingle()

  if (fetchError || !photo) return { error: fetchError?.message || "Photo introuvable" }

  const { error } = await gate.supabase
    .from("user_photos")
    .update({
      status,
      rejection_reason: status === "rejected" ? reason || null : null,
    })
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

  if (status === "rejected" && reason) {
    await gate.supabase.from("moderation_events").insert({
      profile_id: photo.profile_id,
      kind: "photo_reject",
      reason,
      created_by: gate.user?.id || null,
    })
  }

  revalidateOps()
  revalidatePath("/profile")
  return { success: true }
}

export async function adminUpdatePlatformSetting(key: string, value: unknown) {
  const gate = await requireFullAdmin()
  if (gate.error || !gate.supabase || !gate.user) {
    return { error: gate.error || "Acces refuse." }
  }

  const allowed = new Set([
    "maintenance_mode",
    "min_compatibility_threshold",
    "default_photo_blur",
    "require_charter",
    "soft_launch_notes",
    "app_texts",
    "ads",
    "auto_moderation",
    "academy_overrides",
    "photo_rules",
    "sanction_rules",
    "eva_config",
    "youtube_config",
    "integrations",
    "campaign_segments",
  ])
  if (!allowed.has(key)) return { error: "Cle non autorisee." }

  const { error } = await gate.supabase.from("platform_settings").upsert({
    key,
    value: value as never,
    updated_at: new Date().toISOString(),
    updated_by: gate.user.id,
  })

  if (error) return { error: error.message }
  revalidateOps()
  revalidatePath("/dashboard")
  revalidatePath("/academie-mariage")
  return { success: true }
}

export type SavedCampaignSegment = {
  id: string
  name: string
  createdAt: string
  filter: import("@/lib/admin/matchingIntelligence").CampaignSegmentFilter
  memberCount: number
  draftTitle: string
  draftBody: string
}

/** Enregistre / met à jour les segments campagne (full admin). */
export async function adminSaveCampaignSegments(segments: SavedCampaignSegment[]) {
  return adminUpdatePlatformSetting("campaign_segments", segments)
}

/** Envoie une notification in-app aux userIds ciblés (campagne matching). */
export async function adminBroadcastSegmentNotification(input: {
  userIds: string[]
  title: string
  body: string
}) {
  const gate = await requireFullAdmin()
  if (gate.error || !gate.supabase) return { error: gate.error || "Acces refuse." }

  const title = input.title.trim().slice(0, 120)
  const body = input.body.trim().slice(0, 800)
  const ids = [...new Set(input.userIds.filter(Boolean))].slice(0, 200)

  if (!title || !body) return { error: "Titre et message requis." }
  if (ids.length === 0) return { error: "Aucun destinataire dans le segment." }

  const rows = ids.map((userId) => ({
    user_id: userId,
    title,
    body,
    is_read: false,
  }))

  const { error } = await gate.supabase.from("notifications").insert(rows)
  if (error) return { error: error.message }

  revalidateOps()
  return { success: true, sent: ids.length }
}

/** Diagnostic service-role (sans exposer la cle). */
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

export async function adminCreateMember(input: {
  email: string
  password: string
  firstName: string
  lastName?: string
  gender?: "M" | "F"
  city?: string
  approve?: boolean
}) {
  const gate = await requireFullAdmin()
  if (gate.error) return { error: gate.error }

  const email = input.email.trim().toLowerCase()
  const password = input.password
  const firstName = input.firstName.trim()
  if (!email || !password || password.length < 8 || !firstName) {
    return { error: "Email, prenom et mot de passe (>= 8) requis." }
  }

  try {
    const admin = createAdminClient()
    const { data: created, error: authErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { first_name: firstName, last_name: input.lastName || "" },
    })
    if (authErr || !created.user) {
      return { error: authErr?.message || "Creation compte impossible." }
    }

    const userId = created.user.id
    // Wait briefly for trigger profile, then upsert fields
    await new Promise((r) => setTimeout(r, 400))
    const { data: existing } = await admin
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle()

    const patch = {
      first_name: firstName,
      last_name: input.lastName?.trim() || null,
      gender: input.gender || null,
      city: input.city?.trim() || null,
      moderation_status: input.approve ? "approved" : "pending",
      onboarding_status: "registered",
      updated_at: new Date().toISOString(),
    }

    if (existing?.id) {
      const { error } = await admin.from("profiles").update(patch).eq("id", existing.id)
      if (error) return { error: error.message, userId }
    } else {
      const { error } = await admin.from("profiles").insert({
        user_id: userId,
        ...patch,
      })
      if (error) return { error: error.message, userId }
    }

    revalidateOps()
    return { success: true, userId }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur creation membre." }
  }
}

/**
 * Discernement automatique (regles) - analyse les profils pending et approuve
 * ceux qui passent les seuils. Pas un LLM facture (V2 possible plus tard).
 */
export async function adminRunAutoModeration() {
  const gate = await requireAdmin()
  if (gate.error || !gate.supabase) return { error: gate.error || "Acces refuse." }

  const {
    parseAutoMod,
    evaluateProfileAuto,
  } = await import("@/lib/admin/cms")

  const { data: setting } = await gate.supabase
    .from("platform_settings")
    .select("value")
    .eq("key", "auto_moderation")
    .maybeSingle()

  const cfg = parseAutoMod(setting?.value)
  if (!cfg.enabled) {
    return { error: "Auto-moderation desactivee. Activez-la dans Parametres." }
  }

  const { data: pending } = await gate.supabase
    .from("profiles")
    .select("id, first_name, avatar_url, completion_percentage, moderation_status")
    .eq("moderation_status", "pending")
    .limit(100)

  let approved = 0
  let reviewed = 0
  const details: Array<{ id: string; recommend: string; score: number }> = []

  for (const p of pending || []) {
    const ev = evaluateProfileAuto(
      {
        completion: Number(p.completion_percentage || 0),
        hasAvatar: Boolean(p.avatar_url),
        hasName: Boolean(p.first_name),
      },
      cfg
    )
    details.push({ id: p.id, recommend: ev.recommend, score: ev.score })
    if (ev.recommend === "approve") {
      const { error } = await gate.supabase
        .from("profiles")
        .update({
          moderation_status: "approved",
          updated_at: new Date().toISOString(),
        })
        .eq("id", p.id)
      if (!error) approved += 1
    } else {
      reviewed += 1
    }
  }

  if (cfg.autoApprovePhotosIfPrimary) {
    const { data: photos } = await gate.supabase
      .from("user_photos")
      .select("id, profile_id, photo_url, is_primary, status")
      .eq("status", "pending")
      .eq("is_primary", true)
      .limit(50)

    for (const ph of photos || []) {
      await gate.supabase
        .from("user_photos")
        .update({ status: "approved" })
        .eq("id", ph.id)
      if (ph.photo_url) {
        await gate.supabase
          .from("profiles")
          .update({
            avatar_url: ph.photo_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", ph.profile_id)
      }
    }
  }

  revalidateOps()
  return {
    success: true,
    approved,
    reviewed,
    scanned: (pending || []).length,
    details,
  }
}

export async function adminPreviewAutoModeration() {
  const gate = await requireAdmin()
  if (gate.error || !gate.supabase) {
    return { error: gate.error || "Acces refuse.", items: [] as Array<{
      id: string
      name: string
      score: number
      recommend: string
      reasons: string[]
    }> }
  }

  const { parseAutoMod, evaluateProfileAuto } = await import("@/lib/admin/cms")
  const { data: setting } = await gate.supabase
    .from("platform_settings")
    .select("value")
    .eq("key", "auto_moderation")
    .maybeSingle()
  const cfg = parseAutoMod(setting?.value)

  const { data: pending } = await gate.supabase
    .from("profiles")
    .select("id, first_name, last_name, avatar_url, completion_percentage")
    .eq("moderation_status", "pending")
    .limit(40)

  const items = (pending || []).map((p) => {
    const ev = evaluateProfileAuto(
      {
        completion: Number(p.completion_percentage || 0),
        hasAvatar: Boolean(p.avatar_url),
        hasName: Boolean(p.first_name),
      },
      cfg
    )
    return {
      id: p.id,
      name: [p.first_name, p.last_name].filter(Boolean).join(" ") || "Sans nom",
      score: ev.score,
      recommend: ev.recommend,
      reasons: ev.reasons,
    }
  })

  return { items, cfg }
}

export async function adminAnalyzePendingPhotos() {
  const gate = await requireAdmin()
  if (gate.error || !gate.supabase) return { error: gate.error || "Acces refuse.", results: [] as Array<{ id: string; decision: string; message: string; reasons: string[] }> }

  const { parsePhotoRules, evaluatePhotoRules } = await import("@/lib/admin/opsRules")
  const { data: setting } = await gate.supabase
    .from("platform_settings")
    .select("value")
    .eq("key", "photo_rules")
    .maybeSingle()
  const rules = parsePhotoRules(setting?.value)

  const { data: photos } = await gate.supabase
    .from("user_photos")
    .select("id, photo_url, status")
    .eq("status", "pending")
    .limit(40)

  const results = (photos || []).map((ph) => {
    const url = String(ph.photo_url || "")
    const fileName = url.split("/").pop() || url
    const verdict = evaluatePhotoRules({ fileName, mime: "image/jpeg", bytes: 200000 }, rules)
    return {
      id: ph.id as string,
      decision: verdict.decision,
      message: verdict.message,
      reasons: verdict.reasons,
    }
  })

  return { results, rules }
}

export async function adminApplyPhotoVerdict(photoId: string) {
  const gate = await requireAdmin()
  if (gate.error || !gate.supabase) return { error: gate.error || "Acces refuse." }

  const { parsePhotoRules, evaluatePhotoRules } = await import("@/lib/admin/opsRules")
  const { data: setting } = await gate.supabase
    .from("platform_settings")
    .select("value")
    .eq("key", "photo_rules")
    .maybeSingle()
  const rules = parsePhotoRules(setting?.value)

  const { data: photo } = await gate.supabase
    .from("user_photos")
    .select("id, photo_url, profile_id, is_primary, status")
    .eq("id", photoId)
    .maybeSingle()
  if (!photo) return { error: "Photo introuvable" }

  const fileName = String(photo.photo_url || "").split("/").pop() || ""
  const verdict = evaluatePhotoRules({ fileName, mime: "image/jpeg", bytes: 200000 }, rules)

  if (verdict.decision === "approve") {
    return adminModeratePhoto(photoId, "approved", verdict.message)
  }
  if (verdict.decision === "reject") {
    return adminModeratePhoto(photoId, "rejected", verdict.message)
  }
  return { success: true, decision: "retry" as const, message: verdict.message, reasons: verdict.reasons }
}

export async function adminApplySanction(
  profileId: string,
  action: "warn" | "suspend" | "block" | "clear"
) {
  const gate = await requireAdmin()
  if (gate.error || !gate.supabase || !gate.user) {
    return { error: gate.error || "Acces refuse." }
  }

  const { parseSanctionRules, nextSanctionStatus } = await import("@/lib/admin/opsRules")
  const { data: setting } = await gate.supabase
    .from("platform_settings")
    .select("value")
    .eq("key", "sanction_rules")
    .maybeSingle()
  const rules = parseSanctionRules(setting?.value)

  const { data: profile } = await gate.supabase
    .from("profiles")
    .select("id, warning_count, trust_score, sanction_status")
    .eq("id", profileId)
    .maybeSingle()
  if (!profile) return { error: "Profil introuvable" }

  let warningCount = Number(profile.warning_count || 0)
  let trust = Number(profile.trust_score ?? 50)
  let sanctionStatus = (profile.sanction_status as string) || "none"
  let sanctionUntil: string | null = null
  let kind = action

  if (action === "clear") {
    warningCount = 0
    sanctionStatus = "none"
    sanctionUntil = null
    trust = Math.min(100, trust + 5)
    kind = "clear"
  } else if (action === "warn") {
    warningCount += 1
    trust = Math.max(0, trust - rules.trustPenaltyWarn)
    sanctionStatus = nextSanctionStatus(warningCount, rules)
    if (sanctionStatus === "suspended") {
      const until = new Date()
      until.setDate(until.getDate() + rules.suspendDays)
      sanctionUntil = until.toISOString()
    }
    if (sanctionStatus === "blocked") {
      await gate.supabase
        .from("profiles")
        .update({ moderation_status: "rejected" })
        .eq("id", profileId)
    }
  } else if (action === "suspend") {
    warningCount = Math.max(warningCount, 2)
    sanctionStatus = "suspended"
    const until = new Date()
    until.setDate(until.getDate() + rules.suspendDays)
    sanctionUntil = until.toISOString()
    trust = Math.max(0, trust - rules.trustPenaltyWarn)
  } else if (action === "block") {
    warningCount = Math.max(warningCount, rules.autoBlockAfterWarns)
    sanctionStatus = "blocked"
    trust = Math.max(0, trust - rules.trustPenaltyWarn * 2)
    await gate.supabase
      .from("profiles")
      .update({ moderation_status: "rejected" })
      .eq("id", profileId)
  }

  const { error } = await gate.supabase
    .from("profiles")
    .update({
      warning_count: warningCount,
      trust_score: trust,
      sanction_status: sanctionStatus,
      sanction_until: sanctionUntil,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profileId)
  if (error) return { error: error.message }

  await gate.supabase.from("moderation_events").insert({
    profile_id: profileId,
    kind,
    reason: `Sanction ${action} -> ${sanctionStatus}`,
    created_by: gate.user.id,
  })

  revalidateOps()
  return { success: true, sanctionStatus, warningCount, trust }
}

export async function adminReviewChurchRecommendation(
  recoId: string,
  status: "verified" | "rejected"
) {
  const gate = await requireAdmin()
  if (gate.error || !gate.supabase || !gate.user) {
    return { error: gate.error || "Acces refuse." }
  }

  const { data: reco } = await gate.supabase
    .from("church_recommendations")
    .select("id, profile_id, status")
    .eq("id", recoId)
    .maybeSingle()
  if (!reco) return { error: "Recommandation introuvable" }

  const { error } = await gate.supabase
    .from("church_recommendations")
    .update({
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: gate.user.id,
    })
    .eq("id", recoId)
  if (error) return { error: error.message }

  if (status === "verified" && reco.profile_id) {
    const { parseSanctionRules } = await import("@/lib/admin/opsRules")
    const { data: setting } = await gate.supabase
      .from("platform_settings")
      .select("value")
      .eq("key", "sanction_rules")
      .maybeSingle()
    const rules = parseSanctionRules(setting?.value)
    const { data: profile } = await gate.supabase
      .from("profiles")
      .select("trust_score")
      .eq("id", reco.profile_id)
      .maybeSingle()
    const trust = Math.min(
      100,
      Number(profile?.trust_score ?? 50) + rules.trustBonusReco
    )
    await gate.supabase
      .from("profiles")
      .update({
        trust_score: trust,
        is_verified: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", reco.profile_id)
  }

  revalidateOps()
  return { success: true }
}

export async function adminScanRecentMessages() {
  const gate = await requireAdmin()
  if (gate.error || !gate.supabase) {
    return { error: gate.error || "Acces refuse.", flags: [] as Array<{ id: string; hits: string[]; preview: string }> }
  }

  const { parseSanctionRules, scanTextForBanned } = await import("@/lib/admin/opsRules")
  const { data: setting } = await gate.supabase
    .from("platform_settings")
    .select("value")
    .eq("key", "sanction_rules")
    .maybeSingle()
  const rules = parseSanctionRules(setting?.value)

  const { data: messages } = await gate.supabase
    .from("messages")
    .select("id, content, sender_id, created_at")
    .order("created_at", { ascending: false })
    .limit(80)

  const flags = (messages || [])
    .map((m) => {
      const scan = scanTextForBanned(String(m.content || ""), rules.bannedWords)
      return {
        id: m.id as string,
        hits: scan.hits,
        preview: String(m.content || "").slice(0, 120),
        flagged: scan.flagged,
        senderId: m.sender_id as string,
      }
    })
    .filter((m) => m.flagged)

  return { flags, scanned: (messages || []).length }
}

export async function adminBictorysProbe() {
  const gate = await requireFullAdmin()
  if (gate.error) return { error: gate.error }

  const apiKey = process.env.BICTORYS_API_KEY
  if (!apiKey) return { error: "BICTORYS_API_KEY manquant." }

  const { probeBictorysKey } = await import("@/lib/billing/bictorysClient")
  const { logPaymentEvent } = await import("@/lib/billing/paymentAudit")
  const result = await probeBictorysKey(apiKey)

  await logPaymentEvent({
    provider: "bictorys",
    eventType: "sandbox_probe",
    status: result.ok ? "ok" : "failed",
    message: result.ok ? `HTTP ${result.status}` : result.error,
  })

  if (!result.ok) return { error: result.error }
  return {
    success: true,
    sandbox: result.sandbox,
    httpStatus: result.status,
  }
}

export async function adminBictorysSandboxCharge(input: {
  amount?: number
  paymentMode?: string
}) {
  const gate = await requireFullAdmin()
  if (gate.error || !gate.user) return { error: gate.error || "Acces refuse." }

  const apiKey = process.env.BICTORYS_API_KEY
  if (!apiKey) return { error: "BICTORYS_API_KEY manquant." }

  const amount = Math.max(100, Math.min(input.amount || 500, 500_000))
  const { resolveBictorysPaymentMode, parseBictorysPaymentMode } = await import(
    "@/lib/billing/bictorys"
  )
  const paymentMode = resolveBictorysPaymentMode(
    null,
    parseBictorysPaymentMode(input.paymentMode) ?? input.paymentMode
  )

  const admin = createAdminClient()
  const { data: subscription, error: subError } = await admin
    .from("subscriptions")
    .insert({
      user_id: gate.user.id,
      plan: "premium_plus",
      status: "pending",
      starts_at: null,
      ends_at: null,
    })
    .select("id")
    .single()

  if (subError || !subscription) {
    return { error: subError?.message || "Impossible de creer l'abonnement test." }
  }

  const { data: payment, error: payError } = await admin
    .from("payments")
    .insert({
      subscription_id: subscription.id,
      provider: "bictorys",
      transaction_reference: `SANDBOX-${Date.now()}`,
      amount,
      currency: "XOF",
      status: "pending",
      metadata: {
        sandbox_test: true,
        payment_mode: paymentMode,
        initiated_by: gate.user.id,
      },
    })
    .select("id")
    .single()

  if (payError || !payment) {
    return { error: payError?.message || "Impossible de creer le paiement test." }
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "")
  if (!appUrl || appUrl.includes("localhost")) {
    return {
      error:
        "NEXT_PUBLIC_APP_URL requis (domaine public, pas localhost) pour tester Bictorys.",
    }
  }

  const { bictorysCreateCharge } = await import("@/lib/billing/bictorysClient")
  const { logPaymentEvent } = await import("@/lib/billing/paymentAudit")
  const result = await bictorysCreateCharge({
    apiKey,
    paymentId: payment.id,
    amount,
    description: `KELIAA sandbox test - ${amount} XOF`,
    customerName: "Admin Sandbox",
    customerEmail: gate.user.email || "sandbox@KELIAA.app",
    paymentMode,
    appBaseUrl: appUrl,
  })

  if (!result.ok) {
    await logPaymentEvent({
      paymentId: payment.id,
      provider: "bictorys",
      eventType: "sandbox_test",
      status: "failed",
      message: result.error,
    })
    return { error: result.error }
  }

  await admin
    .from("payments")
    .update({
      transaction_reference: result.txId,
      metadata: {
        sandbox_test: true,
        payment_mode: paymentMode,
        bictorys: result.raw,
      },
    })
    .eq("id", payment.id)

  await logPaymentEvent({
    paymentId: payment.id,
    provider: "bictorys",
    eventType: "sandbox_test",
    status: "pending",
    message: `Charge ${amount} XOF (${paymentMode})`,
    payload: { transactionId: result.txId, checkoutUrl: result.checkoutUrl },
  })

  revalidateOps()
  return {
    success: true,
    paymentId: payment.id,
    checkoutUrl: result.checkoutUrl,
    transactionId: result.txId,
    paymentMode,
  }
}
