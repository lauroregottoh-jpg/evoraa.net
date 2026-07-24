"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { getActiveSubscription, getUserEntitlements } from "@/lib/billing/entitlements"
import { isPaidPlan, PLANS, type PlanId } from "@/lib/billing/plans"

function appBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000"
}

function isDemoPayments() {
  // Never allow demo activation in production builds
  if (process.env.NODE_ENV === "production" && process.env.PAYMENTS_DEMO_MODE !== "true") {
    return false
  }
  if (process.env.PAYMENTS_DEMO_MODE === "false") return false
  if (process.env.PAYMENTS_DEMO_MODE === "true") return true
  // Local default: demo if CinetPay keys missing
  return !process.env.CINETPAY_API_KEY || !process.env.CINETPAY_SITE_ID
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
  const transactionRef = `KELIAA-${user.id.slice(0, 8)}-${Date.now()}`

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
      provider: "cinetpay",
      transaction_reference: transactionRef,
      amount: plan.amountXof,
      currency: "XOF",
      status: "pending",
      metadata: {
        plan_id: plan.id,
        plan_name: plan.name,
        demo_mode: isDemoPayments(),
      },
    })
    .select("id")
    .single()

  if (payError || !payment) {
    return { error: payError?.message || "Impossible de créer le paiement." }
  }

  // Optional live CinetPay initiation
  if (!isDemoPayments()) {
    try {
      const secret = process.env.CINETPAY_SECRET_KEY
      const notifyUrl = secret
        ? `${appBaseUrl()}/api/payments/cinetpay/notify?token=${encodeURIComponent(secret)}`
        : `${appBaseUrl()}/api/payments/cinetpay/notify`
      const returnUrl = `${appBaseUrl()}/checkout/success?payment=${payment.id}`
      const cancelUrl = `${appBaseUrl()}/checkout/cancel?payment=${payment.id}`

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
              cinetpay: payload?.data ?? payload,
            },
          })
          .eq("id", payment.id)

        return { checkoutPath: paymentUrl }
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
