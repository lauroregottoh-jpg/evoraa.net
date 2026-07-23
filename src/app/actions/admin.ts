"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié." as const, supabase, user: null }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle()

  if (profile?.role !== "admin" && profile?.role !== "moderator") {
    return { error: "Accès admin requis." as const, supabase, user: null }
  }

  return { error: null, supabase, user }
}

export async function getAdminDashboardData() {
  const gate = await requireAdmin()
  if (gate.error || !gate.supabase) {
    return { error: gate.error || "Erreur", users: [], reports: [], payments: [], photos: [], stats: null }
  }
  const supabase = gate.supabase

  const { data: profiles } = await supabase
    .from("profiles")
    .select(
      "id, user_id, first_name, last_name, city, completion_percentage, role, moderation_status, onboarding_status, is_verified, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(100)

  const { data: reports } = await supabase
    .from("reports")
    .select("id, reporter_id, reported_user_id, reason, status, created_at")
    .order("created_at", { ascending: false })
    .limit(50)

  const { data: payments } = await supabase
    .from("payments")
    .select("id, amount, currency, status, provider, transaction_reference, created_at, subscription_id")
    .order("created_at", { ascending: false })
    .limit(50)

  const { data: photos } = await supabase
    .from("user_photos")
    .select("id, profile_id, photo_url, status, is_primary, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(50)

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

  const completedPayments =
    payments?.filter((p) => p.status === "completed") ?? []
  const revenue = completedPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0)

  const users = (profiles ?? []).map((p) => ({
    id: p.id,
    userId: p.user_id,
    name: [p.first_name, p.last_name].filter(Boolean).join(" ") || "Sans nom",
    city: p.city || "—",
    completion: p.completion_percentage ?? 0,
    role: (p.role as "admin" | "moderator" | "member") || "member",
    status: (p.moderation_status as string) || "pending",
    onboarding: p.onboarding_status,
    verified: Boolean(p.is_verified),
  }))

  return {
    users,
    reports: reports ?? [],
    payments: payments ?? [],
    photos: photos ?? [],
    stats: {
      users: usersCount ?? 0,
      activeSubscriptions: activeSubs ?? 0,
      openReports: openReports ?? 0,
      pendingPhotos: photos?.length ?? 0,
      revenueXof: revenue,
    },
  }
}

export async function adminUpdateModerationStatus(profileId: string, status: "approved" | "rejected" | "pending") {
  const gate = await requireAdmin()
  if (gate.error || !gate.supabase) return { error: gate.error }

  const { error } = await gate.supabase
    .from("profiles")
    .update({ moderation_status: status })
    .eq("id", profileId)

  if (error) return { error: error.message }
  revalidatePath("/admin")
  return { success: true }
}

export async function adminResolveReport(reportId: string, status: "resolved" | "dismissed" | "pending") {
  const gate = await requireAdmin()
  if (gate.error || !gate.supabase) return { error: gate.error }

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
  if (gate.error || !gate.supabase) return { error: gate.error }

  const { error } = await gate.supabase
    .from("user_photos")
    .update({ status })
    .eq("id", photoId)

  if (error) return { error: error.message }
  revalidatePath("/admin")
  return { success: true }
}
