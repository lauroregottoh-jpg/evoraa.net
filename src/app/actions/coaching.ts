"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import {
  getCoachingPack,
  type CoachingDurationMinutes,
  type CoachingPackId,
} from "@/lib/billing/coachingOffers"
import {
  parseBictorysPaymentMode,
  resolveBictorysPaymentMode,
} from "@/lib/billing/bictorys"
import { bictorysCreateCharge } from "@/lib/billing/bictorysClient"
import { logPaymentEvent } from "@/lib/billing/paymentAudit"
import { isDemoPaymentsEnv, resolveLiveProvider } from "@/lib/billing/provider"
import { sendResendEmail } from "@/lib/email/send"

function appBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000"
}

type CoachingCheckoutBrief = {
  firstName: string
  lastName: string
  subject: string
  message?: string
  phone: string
  objectives: string[]
}

/** Démarre un paiement Bictorys pour un pack coaching (pas Alliance). */
export async function startCoachingCheckoutAction(input: {
  packId: string
  minutes?: number | null
  paymentMode?: string | null
  moduleId?: string | null
  moduleTitle?: string | null
  brief?: CoachingCheckoutBrief | null
}): Promise<{ error?: string; checkoutPath?: string; requiresAuth?: boolean }> {
  const minutes: CoachingDurationMinutes =
    input.minutes === 60 ? 60 : 30
  const pack = getCoachingPack(input.packId, minutes)
  if (!pack) return { error: "Pack coaching invalide." }

  const objectiveLimit = minutes === 30 ? 2 : 4
  const firstName = (input.brief?.firstName || "").trim().slice(0, 60)
  const lastName = (input.brief?.lastName || "").trim().slice(0, 60)
  const subject = (input.brief?.subject || "").trim().slice(0, 200)
  const message = (input.brief?.message || "").trim().slice(0, 2000)
  const phone = (input.brief?.phone || "").trim().slice(0, 40)
  const objectives = (input.brief?.objectives || [])
    .map((o) => o.trim().slice(0, 280))
    .filter(Boolean)
    .slice(0, objectiveLimit)

  if (!firstName || !lastName || !subject || !phone) {
    return { error: "Prénom, nom, objet et téléphone sont requis." }
  }
  if (objectives.length < objectiveLimit) {
    return {
      error: `Indiquez ${objectiveLimit} question(s) / objectif(s) pour cette durée.`,
    }
  }

  const { assertPaymentsNotPaused } = await import("@/lib/platform/killSwitches")
  const gatePay = await assertPaymentsNotPaused()
  if (!gatePay.ok) return { error: gatePay.error }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return {
      requiresAuth: true,
      error: "Connectez-vous pour réserver un coaching.",
      checkoutPath: `/login?next=${encodeURIComponent("/coaching")}`,
    }
  }

  const liveProvider = resolveLiveProvider()
  if (liveProvider !== "bictorys" || isDemoPaymentsEnv()) {
    return {
      error:
        "Le paiement coaching live nécessite Bictorys en production (PAYMENTS_DEMO_MODE=false).",
    }
  }

  const apiKey = process.env.BICTORYS_API_KEY
  if (!apiKey) return { error: "BICTORYS_API_KEY manquant." }

  const { data: profile } = await supabase
    .from("profiles")
    .select("country, city, first_name, last_name")
    .eq("user_id", user.id)
    .maybeSingle()

  const paymentMode = resolveBictorysPaymentMode(
    profile?.country as string | null,
    parseBictorysPaymentMode(input.paymentMode) ?? input.paymentMode
  )

  // Placeholder subscription row (plan=coaching) — jamais activée comme Alliance.
  const { data: subscription, error: subError } = await supabase
    .from("subscriptions")
    .insert({
      user_id: user.id,
      plan: "coaching",
      status: "pending",
      starts_at: null,
      ends_at: null,
    })
    .select("id")
    .single()

  if (subError || !subscription) {
    return { error: subError?.message || "Impossible de créer la commande coaching." }
  }

  const fullName = `${firstName} ${lastName}`.trim()
  const coachingBrief = {
    firstName,
    lastName,
    fullName,
    phone,
    subject,
    message: message || null,
    objectives,
    submittedAt: new Date().toISOString(),
    userId: user.id,
    email: user.email || null,
    prePayment: true,
  }

  const transactionRef = `COACH-${user.id.slice(0, 8)}-${Date.now()}`
  const { data: payment, error: payError } = await supabase
    .from("payments")
    .insert({
      subscription_id: subscription.id,
      provider: "bictorys",
      transaction_reference: transactionRef,
      amount: pack.amountXof,
      currency: "XOF",
      status: "pending",
      metadata: {
        product: "coaching",
        packId: pack.id as CoachingPackId,
        sessions: pack.sessions,
        sessionMinutes: pack.minutes,
        moduleId: input.moduleId || null,
        moduleTitle: input.moduleTitle || null,
        payment_mode: paymentMode,
        coaching_brief: coachingBrief,
      },
    })
    .select("id")
    .single()

  if (payError || !payment) {
    return { error: payError?.message || "Impossible de créer le paiement." }
  }

  const customerName =
    fullName ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    user.email ||
    "Membre KELIAA"

  const result = await bictorysCreateCharge({
    apiKey,
    paymentId: payment.id,
    amount: pack.amountXof,
    description: `KELIAA Coaching ${pack.label} (${pack.minutes} min)`,
    customerName,
    customerEmail: user.email || "membre@keliaa.org",
    customerCity: (profile?.city as string) || undefined,
    paymentMode,
    appBaseUrl: appBaseUrl(),
    successPath: `/coaching/form?payment=${payment.id}`,
    cancelPath: `/coaching?cancel=1&payment=${payment.id}`,
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
      metadata: {
        product: "coaching",
        packId: pack.id,
        sessions: pack.sessions,
        sessionMinutes: pack.minutes,
        moduleId: input.moduleId || null,
        moduleTitle: input.moduleTitle || null,
        payment_mode: paymentMode,
        coaching_brief: coachingBrief,
        bictorys: result.raw,
      },
    })
    .eq("id", payment.id)

  await sendResendEmail({
    to: process.env.COACHING_NOTIFY_EMAIL || "contact@keliaa.org",
    subject: `[Coaching] Nouvelle demande — ${fullName} · ${pack.sessions}×${pack.minutes} min`,
    html: `<p><strong>${fullName}</strong> (${user.email || "—"}) · ${phone}</p>
<p>Objet : ${subject}</p>
<p>Message : ${message || "—"}</p>
<p>Questions :</p>
<ul>${objectives.map((o) => `<li>${o}</li>`).join("")}</ul>
<p>Pack : ${pack.label} · ${pack.sessions}×${pack.minutes} min · ${pack.amountXof.toLocaleString("fr-FR")} XOF</p>
<p>Payment id : ${payment.id}</p>`,
  })

  await logPaymentEvent({
    paymentId: payment.id,
    provider: "bictorys",
    eventType: "charge_initiated",
    status: "pending",
    message: `Coaching ${pack.label} · ${pack.amountXof} XOF`,
    payload: { transactionId: result.txId },
  })

  return { checkoutPath: result.checkoutUrl }
}

export async function submitCoachingBriefAction(input: {
  paymentId: string
  fullName: string
  phone: string
  city?: string
  preferredSlots: string
  topic: string
  notes?: string
}): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Connectez-vous." }

  const fullName = input.fullName.trim().slice(0, 120)
  const phone = input.phone.trim().slice(0, 40)
  const preferredSlots = input.preferredSlots.trim().slice(0, 500)
  const topic = input.topic.trim().slice(0, 500)
  const notes = (input.notes || "").trim().slice(0, 2000)
  const city = (input.city || "").trim().slice(0, 80)

  if (!fullName || !phone || !preferredSlots || !topic) {
    return { error: "Nom, téléphone, disponibilités et sujet sont requis." }
  }

  const admin = createAdminClient()
  const { data: payment } = await admin
    .from("payments")
    .select("id, status, amount, metadata, subscription_id")
    .eq("id", input.paymentId)
    .maybeSingle()

  if (!payment) return { error: "Paiement introuvable." }

  const { data: sub } = await admin
    .from("subscriptions")
    .select("user_id, plan")
    .eq("id", payment.subscription_id)
    .maybeSingle()

  if (!sub || sub.user_id !== user.id) return { error: "Accès refusé." }
  if (sub.plan !== "coaching") return { error: "Ce paiement n’est pas un coaching." }

  const meta =
    typeof payment.metadata === "object" && payment.metadata
      ? (payment.metadata as Record<string, unknown>)
      : {}

  if (meta.product !== "coaching") return { error: "Paiement non coaching." }

  const brief = {
    fullName,
    phone,
    city: city || null,
    preferredSlots,
    topic,
    notes: notes || null,
    submittedAt: new Date().toISOString(),
    userId: user.id,
    email: user.email || null,
  }

  await admin
    .from("payments")
    .update({
      metadata: { ...meta, coaching_brief: brief },
    })
    .eq("id", payment.id)

  const packId = String(meta.packId || "")
  const sessions = Number(meta.sessions || 0)
  const amount = Number(payment.amount)

  await sendResendEmail({
    to: process.env.COACHING_NOTIFY_EMAIL || "contact@keliaa.org",
    subject: `[Coaching] Brief — ${fullName} · ${sessions || "?"}×30 min`,
    html: `<p><strong>${fullName}</strong> (${user.email || "—"}) · ${phone}</p>
<p>Ville : ${city || "—"}</p>
<p>Pack : ${packId} · ${sessions} séance(s) · ${amount.toLocaleString("fr-FR")} XOF · statut paiement : ${payment.status}</p>
<p>Sujet : ${topic}</p>
<p>Disponibilités : ${preferredSlots}</p>
<p>Notes : ${notes || "—"}</p>
<p>Payment id : ${payment.id}</p>`,
  })

  revalidatePath("/coaching")
  revalidatePath("/coaching/form")
  return { success: true }
}

export async function getCoachingPaymentForForm(paymentId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Connectez-vous.", payment: null }

  const admin = createAdminClient()
  const { data: payment } = await admin
    .from("payments")
    .select("id, status, amount, currency, metadata, subscription_id")
    .eq("id", paymentId)
    .maybeSingle()

  if (!payment) return { error: "Paiement introuvable.", payment: null }

  const { data: sub } = await admin
    .from("subscriptions")
    .select("user_id, plan")
    .eq("id", payment.subscription_id)
    .maybeSingle()

  if (!sub || sub.user_id !== user.id || sub.plan !== "coaching") {
    return { error: "Accès refusé.", payment: null }
  }

  const meta =
    typeof payment.metadata === "object" && payment.metadata
      ? (payment.metadata as Record<string, unknown>)
      : {}

  return {
    error: undefined as string | undefined,
    payment: {
      id: payment.id,
      status: payment.status as string,
      amount: Number(payment.amount),
      currency: payment.currency as string,
      packId: String(meta.packId || ""),
      sessions: Number(meta.sessions || 0),
      briefSubmitted: Boolean(meta.coaching_brief),
      moduleTitle:
        typeof meta.moduleTitle === "string" ? meta.moduleTitle : null,
    },
  }
}
