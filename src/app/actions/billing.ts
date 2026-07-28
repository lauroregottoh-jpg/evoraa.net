"use server"

import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { getActiveSubscription, getUserEntitlements } from "@/lib/billing/entitlements"
import { isPaidPlan, PLANS, type PlanId } from "@/lib/billing/plans"

const execFileP = promisify(execFile)

function appBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000"
}

function resolveLiveProvider() {
  const env = (process.env.PAYMENT_PROVIDER || "").toLowerCase()
  if (env === "bictorys" || env === "cinetpay") return env
  if (process.env.BICTORYS_API_KEY) return "bictorys"
  return "cinetpay"
}

function isDemoPayments() {
  // Never allow demo activation in production builds
  if (process.env.NODE_ENV === "production" && process.env.PAYMENTS_DEMO_MODE !== "true") {
    return false
  }
  if (process.env.PAYMENTS_DEMO_MODE === "false") return false
  if (process.env.PAYMENTS_DEMO_MODE === "true") return true
  const hasCinetPay = Boolean(process.env.CINETPAY_API_KEY && process.env.CINETPAY_SITE_ID)
  const hasBictorys = Boolean(process.env.BICTORYS_API_KEY)
  // Local default: demo if no live provider credentials
  return !hasCinetPay && !hasBictorys
}

function bictorysApiUrl(apiKey: string) {
  return apiKey.startsWith("test_")
    ? "https://api.test.bictorys.com"
    : "https://api.bictorys.com"
}

function parseRawHttpResponse(raw: string): { status: number; body: string } {
  const sep = raw.indexOf("\r\n\r\n")
  const head = sep >= 0 ? raw.slice(0, sep) : raw
  const body = sep >= 0 ? raw.slice(sep + 4) : ""
  const statusLine = head.split(/\r?\n/)[0] ?? ""
  const m = statusLine.match(/^HTTP\/[\d.]+\s+(\d+)/)
  return { status: m ? Number(m[1]) : 0, body }
}

async function bictorysCreateCharge(args: {
  apiKey: string
  paymentId: string
  amount: number
  description: string
  customerName: string
  customerEmail: string
}) {
  const merchantCountry = process.env.BICTORYS_MERCHANT_COUNTRY || "SN"
  const mode =
    process.env.BICTORYS_PAYMENT_MODE === "card"
      ? "card"
      : ("mobile_money" as "mobile_money" | "card")
  const webhookSecret = process.env.BICTORYS_WEBHOOK_SECRET
  const notifyUrl = webhookSecret
    ? `${appBaseUrl()}/api/payments/bictorys/notify?token=${encodeURIComponent(webhookSecret)}`
    : `${appBaseUrl()}/api/payments/bictorys/notify`
  const returnUrl = `${appBaseUrl()}/checkout/success?payment=${args.paymentId}`
  const cancelUrl = `${appBaseUrl()}/checkout/cancel?payment=${args.paymentId}`

  if (returnUrl.includes("localhost") || cancelUrl.includes("localhost")) {
    return {
      ok: false as const,
      error:
        "Bictorys refuse localhost dans les URLs. Définissez NEXT_PUBLIC_APP_URL avec un domaine public.",
    }
  }

  const body = {
    amount: args.amount,
    currency: "XOF",
    country: merchantCountry,
    paymentReference: args.paymentId,
    successRedirectUrl: returnUrl,
    errorRedirectUrl: cancelUrl,
    ErrorRedirectUrl: cancelUrl,
    notifyUrl,
    customerObject: {
      name: args.customerName || "Customer",
      email: args.customerEmail,
      city: "Dakar",
      country: merchantCountry,
      locale: "fr-FR",
    },
  }

  const curlArgs = [
    "-i",
    "-X",
    "POST",
    "-H",
    `X-Api-Key: ${args.apiKey}`,
    "-H",
    "Content-Type: application/json",
    "-d",
    JSON.stringify(body),
    `${bictorysApiUrl(args.apiKey)}/pay/v1/charges`,
  ]
  const { stdout } = await execFileP("curl", curlArgs, {
    timeout: 15000,
    maxBuffer: 4 * 1024 * 1024,
  })
  const { status, body: responseBody } = parseRawHttpResponse(stdout)
  if (status < 200 || status >= 300) {
    return {
      ok: false as const,
      error: `Bictorys ${status}: ${responseBody.slice(0, 180)}`,
    }
  }
  const payload = JSON.parse(responseBody) as {
    transactionId?: string
    chargeId?: string
    link?: string
    redirectUrl?: string
    data?: { transactionId?: string; chargeId?: string; link?: string; redirectUrl?: string }
  }
  const d = payload.data ?? payload
  const txId = d.transactionId || d.chargeId
  let checkoutUrl = d.link || d.redirectUrl
  if (!txId || !checkoutUrl) {
    return { ok: false as const, error: "Réponse Bictorys incomplète." }
  }
  try {
    const u = new URL(checkoutUrl)
    if (!u.searchParams.has("payment_category")) {
      u.searchParams.set("payment_category", mode)
      checkoutUrl = u.toString()
    }
  } catch {
    // keep original URL
  }
  return { ok: true as const, txId, checkoutUrl, raw: payload }
}

export async function getBillingStatus() {
  const entitlements = await getUserEntitlements()
  return entitlements
}

export async function startCheckoutAction(planId: string): Promise<{
  error?: string
  checkoutPath?: string
  requiresAuth?: boolean
}> {
  if (!isPaidPlan(planId)) {
    return { error: "Offre invalide." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      requiresAuth: true,
      error: "Connectez-vous pour souscrire.",
      checkoutPath: `/login?next=${encodeURIComponent(`/checkout/${planId}`)}`,
    }
  }

  const plan = PLANS[planId as Exclude<PlanId, "free">]
  const liveProvider = resolveLiveProvider()
  const transactionRef = `${liveProvider.toUpperCase()}-${user.id.slice(0, 8)}-${Date.now()}`

  const { data: subscription, error: subError } = await supabase
    .from("subscriptions")
    .insert({
      user_id: user.id,
      plan: plan.id,
      status: "pending",
      starts_at: null,
      ends_at: null,
    })
    .select("id")
    .single()

  if (subError || !subscription) {
    return { error: subError?.message || "Impossible de créer l'abonnement." }
  }

  const { data: payment, error: payError } = await supabase
    .from("payments")
    .insert({
      subscription_id: subscription.id,
      provider: liveProvider,
      transaction_reference: transactionRef,
      amount: plan.amountXof,
      currency: "XOF",
      status: "pending",
      metadata: {
        plan_id: plan.id,
        plan_name: plan.name,
        provider: liveProvider,
        demo_mode: isDemoPayments(),
      },
    })
    .select("id")
    .single()

  if (payError || !payment) {
    return { error: payError?.message || "Impossible de créer le paiement." }
  }

  // Optional live provider initiation
  if (!isDemoPayments()) {
    try {
      if (liveProvider === "bictorys") {
        if (!process.env.BICTORYS_API_KEY) {
          return { error: "BICTORYS_API_KEY manquant." }
        }
        const result = await bictorysCreateCharge({
          apiKey: process.env.BICTORYS_API_KEY,
          paymentId: payment.id,
          amount: plan.amountXof,
          description: `KELIAA ${plan.name} — 30 jours`,
          customerName: user.user_metadata?.first_name || "Membre",
          customerEmail: user.email || "",
        })
        if (!result.ok) return { error: result.error }
        await supabase
          .from("payments")
          .update({
            transaction_reference: result.txId,
            metadata: {
              plan_id: plan.id,
              plan_name: plan.name,
              provider: "bictorys",
              bictorys: result.raw,
            },
          })
          .eq("id", payment.id)
        return { checkoutPath: result.checkoutUrl }
      } else {
        const secret = process.env.CINETPAY_SECRET_KEY
        const notifyUrl = secret
          ? `${appBaseUrl()}/api/payments/cinetpay/notify?token=${encodeURIComponent(secret)}`
          : `${appBaseUrl()}/api/payments/cinetpay/notify`
        const returnUrl = `${appBaseUrl()}/checkout/success?payment=${payment.id}`
        const response = await fetch("https://api-checkout.cinetpay.com/v2/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            apikey: process.env.CINETPAY_API_KEY,
            site_id: process.env.CINETPAY_SITE_ID,
            transaction_id: transactionRef,
            amount: plan.amountXof,
            currency: "XOF",
            description: `KELIAA ${plan.name} — 30 jours`,
            notify_url: notifyUrl,
            return_url: returnUrl,
            channels: "ALL",
            metadata: payment.id,
          }),
        })
        const payload = await response.json()
        const paymentUrl = payload?.data?.payment_url as string | undefined
        if (paymentUrl) {
          await supabase
            .from("payments")
            .update({
              metadata: {
                plan_id: plan.id,
                plan_name: plan.name,
                provider: "cinetpay",
                cinetpay: payload?.data ?? payload,
              },
            })
            .eq("id", payment.id)

          return { checkoutPath: paymentUrl }
        }
      }
    } catch {
      // fall through to demo checkout page
    }
  }

  return { checkoutPath: `/checkout/pay?payment=${payment.id}` }
}

export async function getPendingPayment(paymentId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié." as const }

  const { data: payment } = await supabase
    .from("payments")
    .select("id, amount, currency, status, transaction_reference, metadata, subscription_id")
    .eq("id", paymentId)
    .maybeSingle()

  if (!payment) return { error: "Paiement introuvable." as const }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id, plan, status, user_id")
    .eq("id", payment.subscription_id)
    .maybeSingle()

  if (!subscription || subscription.user_id !== user.id) {
    return { error: "Accès refusé." as const }
  }

  return {
    payment: {
      id: payment.id,
      amount: Number(payment.amount),
      currency: payment.currency,
      status: payment.status,
      transactionReference: payment.transaction_reference,
      planId: subscription.plan as PlanId,
      planName: PLANS[subscription.plan as PlanId]?.name ?? subscription.plan,
      subscriptionStatus: subscription.status,
    },
  }
}

export async function confirmDemoPaymentAction(paymentId: string): Promise<{
  error?: string
  success?: boolean
}> {
  if (process.env.NODE_ENV === "production" && process.env.PAYMENTS_DEMO_MODE !== "true") {
    return { error: "Le mode démo paiement est désactivé en production." }
  }
  if (!isDemoPayments()) {
    return { error: "Le mode démo paiement est désactivé." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié." }

  const pending = await getPendingPayment(paymentId)
  if (pending.error || !pending.payment) return { error: pending.error || "Paiement invalide." }
  if (pending.payment.status === "completed") return { success: true }

  const { error } = await supabase.rpc(
    "activate_pending_payment" as never,
    {
      p_payment_id: paymentId,
      p_transaction_ref: pending.payment.transactionReference || `DEMO-${Date.now()}`,
    } as never
  )

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/pricing")
  revalidatePath("/settings")
  revalidatePath("/messages")
  revalidatePath("/compatibility")
  revalidatePath("/checkout/success")

  return { success: true }
}

export async function getMySubscriptionSummary() {
  const sub = await getActiveSubscription()
  const entitlements = await getUserEntitlements()
  return { subscription: sub, entitlements }
}
