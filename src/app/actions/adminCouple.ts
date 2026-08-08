"use server"

import { createAdminClient } from "@/utils/supabase/admin"
import { createClient } from "@/utils/supabase/server"
import { canAccessOpsConsole, resolveAuthEmail } from "@/lib/admin/consolePath"
import { COUPLE_OFFERS, type CoupleOfferId } from "@/lib/couple/offers"

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

export type AdminCoupleParticipant = {
  userId: string
  seat: number
  displayName: string | null
  questionnaireStatus: string
  firstName: string | null
}

export type AdminCoupleRow = {
  id: string
  publicCode: string
  status: string
  offerId: string
  createdAt: string | null
  accessExpiresAt: string | null
  purchaserUserId: string
  purchaserName: string | null
  participantCount: number
  participants: AdminCoupleParticipant[]
  inviteStatus: string | null
  reportStatus: string | null
  globalScore: number | null
}

export type AdminCouplePurchase = {
  id: string
  offerId: string
  amountXof: number
  status: string
  purchaserUserId: string
  purchaserName: string | null
  completedAt: string | null
  createdAt: string | null
}

export type AdminCoupleAccessRow = {
  coupleId: string
  offerId: string
  publicCode: string
  interactiveAccess: boolean
  accessExpiresAt: string | null
  downloadAllowed: boolean
  coupleStatus: string
}

export type AdminCoupleReportRow = {
  id: string
  coupleId: string
  publicCode: string
  offerId: string
  status: string
  qaPassed: boolean
  generationDate: string | null
  createdAt: string | null
}

export type AdminCoupleFunnelEvent = {
  id: string
  coupleId: string | null
  userId: string | null
  event: string
  createdAt: string | null
}

export type AdminCoupleOpsData = {
  kpis: {
    purchasesCompleted: number
    purchasesPending: number
    revenueCompletedXof: number
    couplesTotal: number
    couplesActive: number
    bothCompleted: number
    reportsReady: number
    reportsFailed: number
    accessExpiring30d: number
    seatsFilled: number
    invitesActive: number
  }
  byOffer: Record<
    CoupleOfferId,
    {
      purchasesCompleted: number
      revenueXof: number
      couples: number
      reportsReady: number
    }
  >
  couples: AdminCoupleRow[]
  purchases: AdminCouplePurchase[]
  reports: AdminCoupleReportRow[]
  access: AdminCoupleAccessRow[]
  funnel: AdminCoupleFunnelEvent[]
}

const EMPTY: AdminCoupleOpsData = {
  kpis: {
    purchasesCompleted: 0,
    purchasesPending: 0,
    revenueCompletedXof: 0,
    couplesTotal: 0,
    couplesActive: 0,
    bothCompleted: 0,
    reportsReady: 0,
    reportsFailed: 0,
    accessExpiring30d: 0,
    seatsFilled: 0,
    invitesActive: 0,
  },
  byOffer: {
    couple_essential: {
      purchasesCompleted: 0,
      revenueXof: 0,
      couples: 0,
      reportsReady: 0,
    },
    couple_premium_plus: {
      purchasesCompleted: 0,
      revenueXof: 0,
      couples: 0,
      reportsReady: 0,
    },
  },
  couples: [],
  purchases: [],
  reports: [],
  access: [],
  funnel: [],
}

function profileName(
  map: Map<string, { first_name: string | null; last_name: string | null }>,
  userId: string
) {
  const p = map.get(userId)
  if (!p) return null
  const n = [p.first_name, p.last_name].filter(Boolean).join(" ").trim()
  return n || p.first_name || null
}

export async function getAdminCoupleOpsData(): Promise<
  { error: string; data?: undefined } | { error?: undefined; data: AdminCoupleOpsData }
> {
  const gate = await requireOps()
  if ("error" in gate && gate.error) return { error: gate.error }

  const admin = createAdminClient()
  const now = new Date()
  const in30 = new Date()
  in30.setDate(in30.getDate() + 30)

  const [
    purchasesRes,
    couplesRes,
    reportsRes,
    accessRes,
    participantsRes,
    invitesRes,
    scoresRes,
    funnelRes,
  ] = await Promise.all([
    admin
      .from("couple_purchases")
      .select(
        "id, offer_id, amount_xof, status, purchaser_user_id, completed_at, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(120),
    admin
      .from("couples")
      .select(
        "id, public_code, status, offer_id, created_at, access_expires_at, purchaser_user_id"
      )
      .order("created_at", { ascending: false })
      .limit(120),
    admin
      .from("couple_reports")
      .select(
        "id, couple_id, offer_id, status, qa_passed, generation_date, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(120),
    admin
      .from("couple_access")
      .select(
        "couple_id, interactive_access, access_expires_at, download_allowed"
      )
      .limit(200),
    admin
      .from("couple_participants")
      .select("couple_id, user_id, seat, display_name, questionnaire_status")
      .limit(500),
    admin
      .from("couple_invitations")
      .select("couple_id, status")
      .eq("status", "ACTIVE")
      .limit(300),
    admin.from("couple_scores").select("couple_id, global_score").limit(200),
    admin
      .from("couple_funnel_events")
      .select("id, couple_id, user_id, event, created_at")
      .order("created_at", { ascending: false })
      .limit(80),
  ])

  if (
    couplesRes.error &&
    /does not exist|schema cache/i.test(couplesRes.error.message)
  ) {
    return { data: EMPTY }
  }

  const purchases = purchasesRes.data || []
  const couples = couplesRes.data || []
  const reports = reportsRes.data || []
  const accessRows = accessRes.data || []
  const participants = participantsRes.data || []
  const invites = invitesRes.data || []
  const scores = scoresRes.data || []
  const funnel = funnelRes.data || []

  const userIds = new Set<string>()
  for (const p of purchases) userIds.add(p.purchaser_user_id)
  for (const c of couples) userIds.add(c.purchaser_user_id)
  for (const p of participants) userIds.add(p.user_id)

  const profileMap = new Map<
    string,
    { first_name: string | null; last_name: string | null }
  >()
  if (userIds.size) {
    const { data: profiles } = await admin
      .from("profiles")
      .select("user_id, first_name, last_name")
      .in("user_id", [...userIds])
    for (const p of profiles || []) {
      profileMap.set(p.user_id, {
        first_name: p.first_name,
        last_name: p.last_name,
      })
    }
  }

  const partsByCouple = new Map<string, AdminCoupleParticipant[]>()
  for (const p of participants) {
    const list = partsByCouple.get(p.couple_id) || []
    list.push({
      userId: p.user_id,
      seat: p.seat,
      displayName: p.display_name,
      questionnaireStatus: p.questionnaire_status,
      firstName: profileMap.get(p.user_id)?.first_name || null,
    })
    partsByCouple.set(p.couple_id, list)
  }

  const inviteByCouple = new Map<string, string>()
  for (const inv of invites) {
    if (!inviteByCouple.has(inv.couple_id)) {
      inviteByCouple.set(inv.couple_id, inv.status)
    }
  }

  const reportByCouple = new Map<string, (typeof reports)[0]>()
  for (const r of reports) {
    if (!reportByCouple.has(r.couple_id)) reportByCouple.set(r.couple_id, r)
  }

  const scoreByCouple = new Map<string, number>()
  for (const s of scores) {
    scoreByCouple.set(s.couple_id, Number(s.global_score))
  }

  const coupleById = new Map(couples.map((c) => [c.id, c]))

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

  const completedPurchases = purchases.filter((p) => p.status === "completed")
  const byOffer = {
    couple_essential: {
      purchasesCompleted: 0,
      revenueXof: 0,
      couples: 0,
      reportsReady: 0,
    },
    couple_premium_plus: {
      purchasesCompleted: 0,
      revenueXof: 0,
      couples: 0,
      reportsReady: 0,
    },
  }

  for (const p of completedPurchases) {
    const key = p.offer_id as CoupleOfferId
    if (key in byOffer) {
      byOffer[key].purchasesCompleted += 1
      byOffer[key].revenueXof += Number(p.amount_xof) || 0
    }
  }
  for (const c of couples) {
    const key = c.offer_id as CoupleOfferId
    if (key in byOffer) byOffer[key].couples += 1
  }
  for (const r of reports) {
    if (r.status === "READY") {
      const key = r.offer_id as CoupleOfferId
      if (key in byOffer) byOffer[key].reportsReady += 1
    }
  }

  const accessExpiring30d = accessRows.filter((a) => {
    if (!a.access_expires_at) return false
    const t = new Date(a.access_expires_at).getTime()
    return t >= now.getTime() && t <= in30.getTime()
  }).length

  const coupleRows: AdminCoupleRow[] = couples.map((c) => {
    const parts = partsByCouple.get(c.id) || []
    const rep = reportByCouple.get(c.id)
    return {
      id: c.id,
      publicCode: c.public_code,
      status: c.status,
      offerId: c.offer_id,
      createdAt: c.created_at,
      accessExpiresAt: c.access_expires_at,
      purchaserUserId: c.purchaser_user_id,
      purchaserName: profileName(profileMap, c.purchaser_user_id),
      participantCount: parts.length,
      participants: parts.sort((a, b) => a.seat - b.seat),
      inviteStatus: inviteByCouple.get(c.id) || null,
      reportStatus: rep?.status || null,
      globalScore: scoreByCouple.get(c.id) ?? null,
    }
  })

  return {
    data: {
      kpis: {
        purchasesCompleted: completedPurchases.length,
        purchasesPending: purchases.filter((p) => p.status === "pending").length,
        revenueCompletedXof: completedPurchases.reduce(
          (s, p) => s + (Number(p.amount_xof) || 0),
          0
        ),
        couplesTotal: couples.length,
        couplesActive: couples.filter((c) => activeStatuses.has(c.status)).length,
        bothCompleted: couples.filter((c) =>
          [
            "BOTH_COMPLETED",
            "ANALYSIS_RUNNING",
            "RESULTS_READY",
            "REPORT_READY",
          ].includes(c.status)
        ).length,
        reportsReady: reports.filter((r) => r.status === "READY").length,
        reportsFailed: reports.filter((r) => r.status === "FAILED").length,
        accessExpiring30d,
        seatsFilled: participants.length,
        invitesActive: invites.length,
      },
      byOffer,
      couples: coupleRows,
      purchases: purchases.map((p) => ({
        id: p.id,
        offerId: p.offer_id,
        amountXof: Number(p.amount_xof) || 0,
        status: p.status,
        purchaserUserId: p.purchaser_user_id,
        purchaserName: profileName(profileMap, p.purchaser_user_id),
        completedAt: p.completed_at,
        createdAt: p.created_at,
      })),
      reports: reports.map((r) => {
        const c = coupleById.get(r.couple_id)
        return {
          id: r.id,
          coupleId: r.couple_id,
          publicCode: c?.public_code || "—",
          offerId: r.offer_id,
          status: r.status,
          qaPassed: Boolean(r.qa_passed),
          generationDate: r.generation_date,
          createdAt: r.created_at,
        }
      }),
      access: accessRows.map((a) => {
        const c = coupleById.get(a.couple_id)
        return {
          coupleId: a.couple_id,
          offerId: c?.offer_id || "—",
          publicCode: c?.public_code || "—",
          interactiveAccess: Boolean(a.interactive_access),
          accessExpiresAt: a.access_expires_at,
          downloadAllowed: Boolean(a.download_allowed),
          coupleStatus: c?.status || "—",
        }
      }),
      funnel: funnel.map((f) => ({
        id: f.id,
        coupleId: f.couple_id,
        userId: f.user_id,
        event: f.event,
        createdAt: f.created_at,
      })),
    },
  }
}
