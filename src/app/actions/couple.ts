"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import {
  COUPLE_QUESTIONNAIRE_VERSION,
  COUPLE_REPORT_VERSION,
  COUPLE_SCORING_VERSION,
  COUPLE_CONTENT_VERSION,
  isCoupleFeatureEnabled,
} from "@/lib/couple/config"
import { hashInviteToken } from "@/lib/couple/codes"
import {
  fulfillCouplePurchase,
  refreshCoupleInvite,
} from "@/lib/couple/fulfill"
import {
  getCoupleChargeAmountXof,
  getCoupleOffer,
  isCoupleDemoPricing,
  snapshotCoupleOffer,
  type CoupleOfferId,
} from "@/lib/couple/offers"
import { buildCouplePrefillFromPsychometrics } from "@/lib/couple/prefill"
import { getCoupleQuestions } from "@/lib/couple/questionBank"
import { scoreCouplePair, type AnswerMap } from "@/lib/couple/scoring"
import { buildCoupleReport, qaCoupleReport } from "@/lib/couple/report"
import {
  parseBictorysPaymentMode,
  resolveBictorysPaymentMode,
} from "@/lib/billing/bictorys"
import { bictorysCreateCharge } from "@/lib/billing/bictorysClient"
import { logPaymentEvent } from "@/lib/billing/paymentAudit"
import { isDemoPaymentsEnv, resolveLiveProvider } from "@/lib/billing/provider"

function appBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000"
}

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, user }
}

export async function startCoupleCheckoutAction(input: {
  offerId: string
  paymentMode?: string | null
}): Promise<{
  error?: string
  checkoutPath?: string
  requiresAuth?: boolean
}> {
  if (!isCoupleFeatureEnabled()) {
    return { error: "KELYA COUPLE n’est pas disponible pour le moment." }
  }
  const offer = getCoupleOffer(input.offerId)
  if (!offer) return { error: "Offre invalide." }

  const { assertPaymentsNotPaused } = await import("@/lib/platform/killSwitches")
  const gatePay = await assertPaymentsNotPaused()
  if (!gatePay.ok) return { error: gatePay.error }

  const { supabase, user } = await requireUser()
  if (!user) {
    return {
      requiresAuth: true,
      error: "Connectez-vous pour acheter le bilan.",
      checkoutPath: `/login?next=${encodeURIComponent(`/couple/checkout/${offer.id}`)}`,
    }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("country, first_name, last_name")
    .eq("user_id", user.id)
    .maybeSingle()

  const paymentMode = resolveBictorysPaymentMode(
    profile?.country as string | null,
    parseBictorysPaymentMode(input.paymentMode) ?? input.paymentMode
  )

  const liveProvider = resolveLiveProvider()
  // Prix démo 17 FCFA ≠ confirmation gratuite : le faux paiement
  // ne s’active que si paiements démo / pas de Bictorys.
  const demo = isDemoPaymentsEnv() || liveProvider !== "bictorys"
  const chargeAmount = getCoupleChargeAmountXof(offer)
  const offerSnapshot = snapshotCoupleOffer(offer, chargeAmount)

  const { data: subscription, error: subError } = await supabase
    .from("subscriptions")
    .insert({
      user_id: user.id,
      plan: offer.id,
      status: "pending",
      starts_at: null,
      ends_at: null,
    })
    .select("id")
    .single()

  if (subError || !subscription) {
    return { error: "Impossible de préparer le paiement." }
  }

  const metadata = {
    product: "couple",
    offer_id: offer.id,
    plan_name: offer.marketingName,
    amount_xof: chargeAmount,
    list_price_xof: offer.amountXof,
    demo_pricing: isCoupleDemoPricing(),
    offer_snapshot: offerSnapshot,
    payment_mode: paymentMode,
    demo_mode: demo,
  }

  const { data: payment, error: payError } = await supabase
    .from("payments")
    .insert({
      user_id: user.id,
      subscription_id: subscription.id,
      amount: chargeAmount,
      currency: "XOF",
      status: "pending",
      transaction_reference: `couple-pending-${Date.now()}`,
      metadata,
    })
    .select("id")
    .single()

  if (payError || !payment) {
    return { error: "Impossible de créer le paiement." }
  }

  await supabase.from("couple_purchases").insert({
    purchaser_user_id: user.id,
    payment_id: payment.id,
    offer_id: offer.id,
    amount_xof: chargeAmount,
    currency: "XOF",
    status: "pending",
    offer_snapshot: offerSnapshot,
  })

  if (demo) {
    return { checkoutPath: `/couple/checkout/${offer.id}?paymentId=${payment.id}&demo=1` }
  }

  const apiKey = process.env.BICTORYS_API_KEY
  if (!apiKey) return { error: "BICTORYS_API_KEY manquant." }

  const customerName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    user.email ||
    "Membre KELIAA"

  const result = await bictorysCreateCharge({
    apiKey,
    paymentId: payment.id,
    amount: chargeAmount,
    description: `KELYA COUPLE — ${offer.marketingName}${isCoupleDemoPricing() ? " (démo)" : ""}`,
    customerName,
    customerEmail: user.email || "membre@keliaa.org",
    paymentMode,
    appBaseUrl: appBaseUrl(),
    successPath: `/couple/confirmation?paymentId=${payment.id}`,
    cancelPath: `/couple/offre`,
  })

  if (!result.ok) {
    await logPaymentEvent({
      paymentId: payment.id,
      provider: "bictorys",
      eventType: "charge_failed",
      status: "failed",
      message: result.error,
    })
    return { error: result.error }
  }

  await supabase
    .from("payments")
    .update({
      transaction_reference: result.txId,
      metadata: { ...metadata, bictorys: result.raw },
    })
    .eq("id", payment.id)

  await logPaymentEvent({
    paymentId: payment.id,
    provider: "bictorys",
    eventType: "charge_initiated",
    status: "pending",
    message: `couple:${offer.id}:${chargeAmount}`,
  })

  if (result.checkoutUrl) {
    return { checkoutPath: result.checkoutUrl }
  }
  return { checkoutPath: `/couple/confirmation?paymentId=${payment.id}` }
}

/** Confirmation démo (local / PAYMENTS_DEMO_MODE). */
export async function confirmCoupleDemoPaymentAction(paymentId: string): Promise<{
  error?: string
  coupleId?: string
  inviteToken?: string
}> {
  if (!isCoupleFeatureEnabled()) return { error: "Module indisponible." }
  if (!isDemoPaymentsEnv() && process.env.NODE_ENV === "production") {
    return { error: "Démo paiement désactivée." }
  }

  const { user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  const admin = createAdminClient()
  const { data: payment } = await admin
    .from("payments")
    .select("id, user_id, amount, status, metadata, subscription_id")
    .eq("id", paymentId)
    .maybeSingle()

  if (!payment || payment.user_id !== user.id) {
    return { error: "Paiement introuvable." }
  }

  const meta = (payment.metadata || {}) as Record<string, unknown>
  if (meta.product !== "couple") return { error: "Ce paiement n’est pas un bilan couple." }

  const offerId = String(meta.offer_id || "") as CoupleOfferId
  if (offerId !== "couple_essential" && offerId !== "couple_premium_plus") {
    return { error: "Offre invalide." }
  }

  if (payment.status !== "completed") {
    await admin
      .from("payments")
      .update({
        status: "completed",
        transaction_reference: `DEMO-COUPLE-${Date.now()}`,
        metadata: { ...meta, couple_paid_at: new Date().toISOString(), demo: true },
      })
      .eq("id", payment.id)
      .eq("status", "pending")

    await admin
      .from("subscriptions")
      .update({ status: "paid_couple", starts_at: new Date().toISOString(), ends_at: null })
      .eq("id", payment.subscription_id)

    await admin
      .from("couple_purchases")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("payment_id", payment.id)
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("first_name")
    .eq("user_id", user.id)
    .maybeSingle()

  const result = await fulfillCouplePurchase({
    admin,
    paymentId: payment.id,
    purchaserUserId: user.id,
    offerId,
    amountXof: Number(payment.amount) || getCoupleOffer(offerId)!.amountXof,
    displayName: (profile?.first_name as string) || null,
  })

  revalidatePath("/couple")
  return {
    coupleId: result.coupleId,
    inviteToken: result.inviteToken || undefined,
  }
}

export async function getMyCoupleStateAction() {
  const { user } = await requireUser()
  if (!user) return { error: "Non authentifié." as const }

  const admin = createAdminClient()

  const { data: membership } = await admin
    .from("couple_participants")
    .select("id, seat, display_name, questionnaire_status, couple_id")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!membership) return { couple: null }

  const { data: couple } = await admin
    .from("couples")
    .select(
      "id, public_code, status, offer_id, access_expires_at, purchaser_user_id, offer_snapshot"
    )
    .eq("id", membership.couple_id)
    .maybeSingle()

  if (!couple) return { couple: null }

  const { data: participants } = await admin
    .from("couple_participants")
    .select("id, seat, display_name, questionnaire_status, user_id")
    .eq("couple_id", couple.id)
    .order("seat")

  const { data: invite } = await admin
    .from("couple_invitations")
    .select("invite_code, status, expires_at")
    .eq("couple_id", couple.id)
    .eq("status", "ACTIVE")
    .maybeSingle()

  const { data: report } = await admin
    .from("couple_reports")
    .select("id, status, offer_id, generation_date")
    .eq("couple_id", couple.id)
    .eq("status", "READY")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: scores } = await admin
    .from("couple_scores")
    .select("global_score, dimension_scores, strengths, priorities, safety_flags")
    .eq("couple_id", couple.id)
    .maybeSingle()

  return {
    me: {
      participantId: membership.id,
      seat: membership.seat,
      questionnaireStatus: membership.questionnaire_status,
      displayName: membership.display_name,
    },
    couple,
    participants: participants || [],
    invite,
    report,
    scores,
  }
}

export async function regenerateCoupleInviteAction(coupleId: string) {
  const { user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  const admin = createAdminClient()
  const { data: member } = await admin
    .from("couple_participants")
    .select("id")
    .eq("couple_id", coupleId)
    .eq("user_id", user.id)
    .maybeSingle()
  if (!member) return { error: "Accès refusé." }

  const { data: couple } = await admin
    .from("couples")
    .select("id, status")
    .eq("id", coupleId)
    .maybeSingle()
  if (!couple) return { error: "Couple introuvable." }

  const { count } = await admin
    .from("couple_participants")
    .select("id", { count: "exact", head: true })
    .eq("couple_id", coupleId)
  if ((count || 0) >= 2) {
    return { error: "Les deux places sont déjà prises." }
  }

  const { inviteToken, inviteCode } = await refreshCoupleInvite({
    admin,
    coupleId,
    userId: user.id,
  })

  revalidatePath("/couple/espace")
  revalidatePath("/couple/inviter")
  return {
    inviteCode,
    inviteUrl: `${appBaseUrl()}/couple/join?token=${inviteToken}`,
  }
}

export async function joinCoupleWithTokenAction(token: string): Promise<{
  ok?: true
  coupleId?: string
  already?: boolean
  error?: string
  requiresAuth?: boolean
}> {
  const { user } = await requireUser()
  if (!user) {
    return {
      requiresAuth: true,
      error: "Connectez-vous pour rejoindre le bilan.",
    }
  }
  if (!token?.trim()) return { error: "Lien invalide." }

  const admin = createAdminClient()
  const tokenHash = hashInviteToken(token.trim())
  const { data: invite } = await admin
    .from("couple_invitations")
    .select("id, couple_id, status, expires_at")
    .eq("token_hash", tokenHash)
    .maybeSingle()

  if (!invite) return { error: "Invitation introuvable." }
  if (invite.status !== "ACTIVE") return { error: "Cette invitation n’est plus valide." }
  if (new Date(invite.expires_at) < new Date()) {
    await admin
      .from("couple_invitations")
      .update({ status: "EXPIRED" })
      .eq("id", invite.id)
    return { error: "Invitation expirée." }
  }

  return joinCoupleSeat(admin, invite.couple_id, invite.id, user.id)
}

export async function joinCoupleWithCodeAction(code: string): Promise<{
  ok?: true
  coupleId?: string
  already?: boolean
  error?: string
  requiresAuth?: boolean
}> {
  const { user } = await requireUser()
  if (!user) {
    return {
      requiresAuth: true,
      error: "Connectez-vous pour rejoindre le bilan.",
    }
  }
  const normalized = code.trim().toUpperCase()
  if (!normalized) return { error: "Code requis." }

  const admin = createAdminClient()
  const { data: invite } = await admin
    .from("couple_invitations")
    .select("id, couple_id, status, expires_at")
    .eq("invite_code", normalized)
    .eq("status", "ACTIVE")
    .maybeSingle()

  if (!invite) return { error: "Code invalide ou déjà utilisé." }
  if (new Date(invite.expires_at) < new Date()) {
    await admin
      .from("couple_invitations")
      .update({ status: "EXPIRED" })
      .eq("id", invite.id)
    return { error: "Code expiré." }
  }

  return joinCoupleSeat(admin, invite.couple_id, invite.id, user.id)
}

async function joinCoupleSeat(
  admin: ReturnType<typeof createAdminClient>,
  coupleId: string,
  inviteId: string,
  userId: string
) {
  const { data: existing } = await admin
    .from("couple_participants")
    .select("id")
    .eq("couple_id", coupleId)
    .eq("user_id", userId)
    .maybeSingle()
  if (existing) {
    return { ok: true as const, coupleId, already: true }
  }

  const { count } = await admin
    .from("couple_participants")
    .select("id", { count: "exact", head: true })
    .eq("couple_id", coupleId)

  if ((count || 0) >= 2) {
    return { error: "Ce bilan a déjà deux participants. Une troisième personne ne peut pas rejoindre." }
  }

  const { data: otherMembership } = await admin
    .from("couple_participants")
    .select("couple_id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle()

  // Soft rule: allow but we don't silently move — user joins this couple as seat 2
  void otherMembership

  const { data: profile } = await admin
    .from("profiles")
    .select("first_name")
    .eq("user_id", userId)
    .maybeSingle()

  const { error: insertErr } = await admin.from("couple_participants").insert({
    couple_id: coupleId,
    user_id: userId,
    seat: 2,
    display_name: (profile?.first_name as string) || null,
    questionnaire_status: "NOT_STARTED",
  })

  if (insertErr) {
    if (insertErr.message.includes("unique") || insertErr.code === "23505") {
      return { error: "Impossible de rejoindre : places déjà occupées." }
    }
    return { error: insertErr.message }
  }

  await admin
    .from("couple_invitations")
    .update({
      status: "USED",
      used_at: new Date().toISOString(),
      used_by: userId,
    })
    .eq("id", inviteId)

  await admin
    .from("couple_invitations")
    .update({ status: "REVOKED" })
    .eq("couple_id", coupleId)
    .eq("status", "ACTIVE")

  await admin
    .from("couples")
    .update({
      status: "PARTNER_JOINED",
      updated_at: new Date().toISOString(),
    })
    .eq("id", coupleId)

  await admin.from("couple_funnel_events").insert({
    couple_id: coupleId,
    user_id: userId,
    event: "PARTNER_JOIN",
    meta: {},
  })

  revalidatePath("/couple/espace")
  return { ok: true as const, coupleId }
}

export async function saveCoupleAnswersAction(input: {
  answers: Record<string, number>
  complete?: boolean
}) {
  const { user } = await requireUser()
  if (!user) return { error: "Non authentifié." }

  const state = await getMyCoupleStateAction()
  if (!("me" in state) || !state.me || !state.couple) {
    return { error: "Aucun bilan couple actif." }
  }

  const admin = createAdminClient()
  const participantId = state.me.participantId
  const coupleId = state.couple.id

  let { data: session } = await admin
    .from("couple_questionnaire_sessions")
    .select("id, status")
    .eq("couple_id", coupleId)
    .eq("participant_id", participantId)
    .maybeSingle()

  if (!session) {
    const { data: created, error } = await admin
      .from("couple_questionnaire_sessions")
      .insert({
        couple_id: coupleId,
        participant_id: participantId,
        questionnaire_version: COUPLE_QUESTIONNAIRE_VERSION,
        status: "IN_PROGRESS",
      })
      .select("id, status")
      .single()
    if (error || !created) return { error: error?.message || "Session impossible." }
    session = created
  }

  if (session.status === "COMPLETED") {
    return { error: "Questionnaire déjà terminé." }
  }

  const allowed = new Set(getCoupleQuestions().map((q) => q.id))
  const rows = Object.entries(input.answers)
    .filter(([qid, v]) => allowed.has(qid) && v >= 1 && v <= 5)
    .map(([question_id, value]) => ({
      session_id: session!.id,
      participant_id: participantId,
      question_id,
      value,
      updated_at: new Date().toISOString(),
    }))

  if (rows.length) {
    const { error } = await admin.from("couple_answers").upsert(rows, {
      onConflict: "session_id,question_id",
    })
    if (error) return { error: error.message }
  }

  await admin
    .from("couple_participants")
    .update({ questionnaire_status: "IN_PROGRESS" })
    .eq("id", participantId)

  await admin
    .from("couples")
    .update({
      status: "QUESTIONNAIRES_IN_PROGRESS",
      updated_at: new Date().toISOString(),
    })
    .eq("id", coupleId)
    .in("status", ["PARTNER_JOINED", "INVITATION_PENDING", "CREATED"])

  if (input.complete) {
    const required = getCoupleQuestions().length
    const { count } = await admin
      .from("couple_answers")
      .select("id", { count: "exact", head: true })
      .eq("session_id", session.id)
    if ((count || 0) < required) {
      return { error: "Questionnaire incomplet." }
    }

    await admin
      .from("couple_questionnaire_sessions")
      .update({ status: "COMPLETED", completed_at: new Date().toISOString() })
      .eq("id", session.id)

    await admin
      .from("couple_participants")
      .update({ questionnaire_status: "COMPLETED" })
      .eq("id", participantId)

    await admin.from("couple_funnel_events").insert({
      couple_id: coupleId,
      user_id: user.id,
      event: state.me.seat === 1 ? "QUESTIONNAIRE_A" : "QUESTIONNAIRE_B",
      meta: {},
    })

    // Check both completed → analysis
    const { data: parts } = await admin
      .from("couple_participants")
      .select("id, questionnaire_status")
      .eq("couple_id", coupleId)

    const bothDone =
      (parts || []).length === 2 &&
      (parts || []).every((p) => p.questionnaire_status === "COMPLETED")

    if (bothDone) {
      await runCoupleAnalysis(admin, coupleId)
    }
  }

  revalidatePath("/couple/espace")
  revalidatePath("/couple/questionnaire")
  return { ok: true as const }
}

async function runCoupleAnalysis(
  admin: ReturnType<typeof createAdminClient>,
  coupleId: string
) {
  await admin
    .from("couples")
    .update({
      status: "ANALYSIS_RUNNING",
      updated_at: new Date().toISOString(),
    })
    .eq("id", coupleId)

  const { data: couple } = await admin
    .from("couples")
    .select("offer_id")
    .eq("id", coupleId)
    .single()

  const { data: parts } = await admin
    .from("couple_participants")
    .select("id, seat, display_name, user_id")
    .eq("couple_id", coupleId)
    .order("seat")

  if (!parts || parts.length !== 2 || !couple) {
    await admin
      .from("couples")
      .update({ status: "BOTH_COMPLETED" })
      .eq("id", coupleId)
    return
  }

  const loadAnswers = async (participantId: string): Promise<AnswerMap> => {
    const { data: session } = await admin
      .from("couple_questionnaire_sessions")
      .select("id")
      .eq("participant_id", participantId)
      .eq("status", "COMPLETED")
      .maybeSingle()
    if (!session) return {}
    const { data: answers } = await admin
      .from("couple_answers")
      .select("question_id, value")
      .eq("session_id", session.id)
    const map: AnswerMap = {}
    for (const a of answers || []) map[a.question_id] = a.value
    return map
  }

  const answersA = await loadAnswers(parts[0]!.id)
  const answersB = await loadAnswers(parts[1]!.id)
  const scoring = scoreCouplePair(answersA, answersB)

  await admin.from("couple_scores").upsert(
    {
      couple_id: coupleId,
      scoring_version: COUPLE_SCORING_VERSION,
      global_score: scoring.globalScore,
      dimension_scores: scoring.dimensions,
      convergences: scoring.convergences,
      divergences: scoring.divergences,
      vigilance_zones: scoring.vigilanceZones,
      strengths: scoring.strengths,
      priorities: scoring.priorities,
      safety_flags: scoring.safetyFlags,
    },
    { onConflict: "couple_id" }
  )

  const names = {
    nameA: parts[0]!.display_name || "Partenaire 1",
    nameB: parts[1]!.display_name || "Partenaire 2",
  }

  const offerId = couple.offer_id as CoupleOfferId
  const doc = buildCoupleReport({ offerId, names, scoring })
  const qa = qaCoupleReport(doc)

  await admin.from("couple_reports").upsert(
    {
      couple_id: coupleId,
      offer_id: offerId,
      status: qa.ok ? "READY" : "FAILED",
      questionnaire_version: COUPLE_QUESTIONNAIRE_VERSION,
      scoring_version: COUPLE_SCORING_VERSION,
      content_version: COUPLE_CONTENT_VERSION,
      report_version: COUPLE_REPORT_VERSION,
      content_json: doc,
      qa_passed: qa.ok,
      qa_notes: qa.notes,
      generation_date: new Date().toISOString(),
    },
    { onConflict: "couple_id,report_version" }
  )

  await admin
    .from("couples")
    .update({
      status: qa.ok ? "REPORT_READY" : "RESULTS_READY",
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", coupleId)

  await admin.from("couple_funnel_events").insert([
    { couple_id: coupleId, event: "ANALYSIS", meta: {} },
    { couple_id: coupleId, event: "REPORT", meta: { qa_ok: qa.ok } },
  ])
}

export async function getCoupleReportAction() {
  const state = await getMyCoupleStateAction()
  if (!("couple" in state) || !state.couple) return { error: "Aucun couple." }

  const admin = createAdminClient()
  const { data: report } = await admin
    .from("couple_reports")
    .select("content_json, status, offer_id, generation_date, qa_passed")
    .eq("couple_id", state.couple.id)
    .eq("status", "READY")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!report) return { error: "Rapport pas encore disponible." }
  return { report: report.content_json, meta: report }
}

export async function loadMyCoupleAnswersAction() {
  const state = await getMyCoupleStateAction()
  if (!("me" in state) || !state.me) return { answers: {} as AnswerMap }

  const admin = createAdminClient()
  const { data: session } = await admin
    .from("couple_questionnaire_sessions")
    .select("id")
    .eq("participant_id", state.me.participantId)
    .maybeSingle()
  if (!session) return { answers: {} as AnswerMap }

  const { data } = await admin
    .from("couple_answers")
    .select("question_id, value")
    .eq("session_id", session.id)

  const answers: AnswerMap = {}
  for (const row of data || []) answers[row.question_id] = row.value
  return { answers }
}

/**
 * Suggestions depuis tests Découverte / Alliance déjà complétés.
 * À faire valider / modifier — jamais appliquées sans consentement.
 */
export async function getCouplePrefillSuggestionsAction() {
  const { supabase, user } = await requireUser()
  if (!user) return { suggestions: [], error: "Non authentifié." as const }

  const { data: profile } = await supabase
    .from("profiles")
    .select("psychometric_results")
    .eq("user_id", user.id)
    .maybeSingle()

  const suggestions = buildCouplePrefillFromPsychometrics(
    profile?.psychometric_results
  )

  return {
    suggestions,
    pillarsCompleted: Boolean(
      profile?.psychometric_results &&
        typeof profile.psychometric_results === "object" &&
        (profile.psychometric_results as { pillars_completed?: number })
          .pillars_completed
    ),
  }
}
