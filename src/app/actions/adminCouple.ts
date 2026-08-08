"use server"

import { createAdminClient } from "@/utils/supabase/admin"
import { createClient } from "@/utils/supabase/server"
import { canAccessOpsConsole, resolveAuthEmail } from "@/lib/admin/consolePath"

async function requireOps() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié." as const }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle()

  if (
    !canAccessOpsConsole({
      role: profile?.role,
      email: resolveAuthEmail(user),
    })
  ) {
    return { error: "Accès réservé." as const }
  }
  return { ok: true as const }
}

export type AdminCoupleOpsData = {
  kpis: {
    purchasesCompleted: number
    couplesTotal: number
    couplesActive: number
    bothCompleted: number
    reportsReady: number
    accessExpiring30d: number
  }
  couples: Array<{
    id: string
    status: string
    offerId: string
    createdAt: string | null
    participantCount: number
  }>
  purchases: Array<{
    id: string
    offerId: string
    amountXof: number
    status: string
    purchaserUserId: string
    completedAt: string | null
  }>
}

export async function getAdminCoupleOpsData(): Promise<
  { error: string; data?: undefined } | { error?: undefined; data: AdminCoupleOpsData }
> {
  const gate = await requireOps()
  if ("error" in gate && gate.error) return { error: gate.error }

  const admin = createAdminClient()
  const in30 = new Date()
  in30.setDate(in30.getDate() + 30)

  const [
    purchasesRes,
    couplesRes,
    reportsRes,
    accessRes,
    participantsRes,
  ] = await Promise.all([
    admin
      .from("couple_purchases")
      .select("id, offer_id, amount_xof, status, purchaser_user_id, completed_at, created_at")
      .order("created_at", { ascending: false })
      .limit(80),
    admin
      .from("couples")
      .select("id, status, offer_id, created_at")
      .order("created_at", { ascending: false })
      .limit(80),
    admin
      .from("couple_reports")
      .select("id, status")
      .eq("status", "READY")
      .limit(500),
    admin
      .from("couple_access")
      .select("id, ends_at, status")
      .lte("ends_at", in30.toISOString())
      .gte("ends_at", new Date().toISOString())
      .limit(200),
    admin.from("couple_participants").select("couple_id").limit(2000),
  ])

  // Tables may not exist yet on some envs — soft empty
  if (couplesRes.error && /does not exist|schema cache/i.test(couplesRes.error.message)) {
    return {
      data: {
        kpis: {
          purchasesCompleted: 0,
          couplesTotal: 0,
          couplesActive: 0,
          bothCompleted: 0,
          reportsReady: 0,
          accessExpiring30d: 0,
        },
        couples: [],
        purchases: [],
      },
    }
  }

  const purchases = purchasesRes.data || []
  const couples = couplesRes.data || []
  const countByCouple = new Map<string, number>()
  for (const p of participantsRes.data || []) {
    countByCouple.set(
      p.couple_id,
      (countByCouple.get(p.couple_id) || 0) + 1
    )
  }

  const activeStatuses = new Set([
    "CREATED",
    "INVITATION_PENDING",
    "PARTNER_JOINED",
    "QUESTIONNAIRES_IN_PROGRESS",
    "BOTH_COMPLETED",
    "ANALYSIS_RUNNING",
    "RESULTS_READY",
    "REPORT_READY",
  ])

  return {
    data: {
      kpis: {
        purchasesCompleted: purchases.filter((p) => p.status === "completed").length,
        couplesTotal: couples.length,
        couplesActive: couples.filter((c) => activeStatuses.has(c.status)).length,
        bothCompleted: couples.filter((c) =>
          ["BOTH_COMPLETED", "ANALYSIS_RUNNING", "RESULTS_READY", "REPORT_READY"].includes(
            c.status
          )
        ).length,
        reportsReady: (reportsRes.data || []).length,
        accessExpiring30d: (accessRes.data || []).length,
      },
      couples: couples.map((c) => ({
        id: c.id,
        status: c.status,
        offerId: c.offer_id,
        createdAt: c.created_at,
        participantCount: countByCouple.get(c.id) || 0,
      })),
      purchases: purchases.map((p) => ({
        id: p.id,
        offerId: p.offer_id,
        amountXof: Number(p.amount_xof) || 0,
        status: p.status,
        purchaserUserId: p.purchaser_user_id,
        completedAt: p.completed_at,
      })),
    },
  }
}
