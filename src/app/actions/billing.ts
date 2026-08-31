"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { getActiveSubscription, getUserEntitlements } from "@/lib/billing/entitlements"
import { isPaidPlan, PLANS, type PlanId } from "@/lib/billing/plans"
import {
  getBictorysEnabledPaymentModes,
  parseBictorysPaymentMode,
  resolveBictorysPaymentMode,
  type BictorysPaymentMode,
} from "@/lib/billing/bictorys"
import { bictorysCreateCharge } from "@/lib/billing/bictorysClient"
import { logPaymentEvent } from "@/lib/billing/paymentAudit"
import { isDemoPaymentsEnv, resolveLiveProvider } from "@/lib/billing/provider"

function appBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000"
}

function isDemoPayments() {
  return isDemoPaymentsEnv()
}

export async function getCheckoutHints(): Promise<{
  provider: string
  demoMode: boolean
  suggestedMode: BictorysPaymentMode
  country: string | null
  showModePicker: boolean
  enabledPaymentModes: BictorysPaymentMode[]
} | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("country, city")
    .eq("user_id", user.id)
    .maybeSingle()

  const provider = resolveLiveProvider()
  const demoMode = isDemoPayments()
  const enabledPaymentModes =
    provider === "bictorys" ? getBictorysEnabledPaymentModes() : []
  const suggestedMode = resolveBictorysPaymentMode(profile?.country as string | null)

  return {
    provider,
    demoMode,
    suggestedMode,
    country: (profile?.country as string) || null,
    enabledPaymentModes,
    showModePicker: provider === "bictorys" && !demoMode && enabledPaymentModes.length > 1,
  }
}

export async function getBillingStatus() {
  const entitlements = await getUserEntitlements()
  return entitlements
}

export async function startCheckoutAction(
  planId: string,
  paymentModeInput?: string | null
): Promise<{
  error?: string
  checkoutPath?: string
  requiresAuth?: boolean
}> {
  if (!isPaidPlan(planId)) {
    return { error: "Offre invalide." }
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
      error: "Connectez-vous pour souscrire.",
      checkoutPath: `/login?next=${encodeURIComponent(`/checkout/${planId}`)}`,
    }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("country, city, first_name")
    .eq("user_id", user.id)
    .maybeSingle()

  const plan = PLANS[planId as Exclude<PlanId, "free">]
  const liveProvider = resolveLiveProvider()
  const transactionRef = `${liveProvider.toUpperCase()}-${user.id.slice(0, 8)}-${Date.now()}`
  const paymentMode =
    liveProvider === "bictorys"
      ? resolveBictorysPaymentMode(
          profile?.country as string | null,
          parseBictorysPaymentMode(paymentModeInput) ?? paymentModeInput
        )
      : null

  const existingSub = await getActiveSubscription(user.id)
  const isRenewal = Boolean(existingSub)

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
        payment_mode: paymentMode,
        user_country: profile?.country || null,
        is_renewal: isRenewal,
      },
    })
    .select("id")
    .single()

  if (payError || !payment) {
    return { error: payError?.message || "Impossible de créer le paiement." }
  }

  const successPath = `/checkout/success?payment=${payment.id}${
    isRenewal ? "&renew=1" : ""
  }`
  const successUrl = `${appBaseUrl()}${successPath}`

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
          customerName:
            (profile?.first_name as string) || user.user_metadata?.first_name || "Membre",
          customerEmail: user.email || "",
          customerCity: (profile?.city as string) || "Dakar",
          paymentMode: paymentMode || "mobile_money",
          appBaseUrl: appBaseUrl(),
          successPath,
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
              plan_id: plan.id,
              plan_name: plan.name,
              provider: "bictorys",
              payment_mode: result.paymentMode,
              user_country: profile?.country || null,
              is_renewal: isRenewal,
              bictorys: result.raw,
            },
          })
          .eq("id", payment.id)
        await logPaymentEvent({
          paymentId: payment.id,
          provider: "bictorys",
          eventType: "charge_initiated",
          status: "pending",
          message: `Mode ${result.paymentMode}`,
          payload: {
            transactionId: result.txId,
            paymentMode: result.paymentMode,
            country: profile?.country || null,
          },
        })
        return { checkoutPath: result.checkoutUrl }
      }

      if (liveProvider === "moneroo") {
        if (!process.env.MONEROO_SECRET_KEY) {
          return { error: "MONEROO_SECRET_KEY manquant." }
        }
        const { monerooInitializePayment } = await import(
          "@/lib/billing/monerooClient"
        )
        const result = await monerooInitializePayment({
          secretKey: process.env.MONEROO_SECRET_KEY,
          amountXof: plan.amountXof,
          description: `KELIAA ${plan.name} — 30 jours`,
          returnUrl: successUrl,
          customerEmail: user.email || "",
          customerFirstName:
            (profile?.first_name as string) ||
            user.user_metadata?.first_name ||
            "Membre",
          metadata: {
            keliaa_payment_id: payment.id,
            plan_id: plan.id,
          },
        })
        if (!result.ok) {
          await logPaymentEvent({
            paymentId: payment.id,
            provider: "moneroo",
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
              plan_id: plan.id,
              plan_name: plan.name,
              provider: "moneroo",
              user_country: profile?.country || null,
              is_renewal: isRenewal,
              moneroo: result.raw,
            },
          })
          .eq("id", payment.id)
        await logPaymentEvent({
          paymentId: payment.id,
          provider: "moneroo",
          eventType: "charge_initiated",
          status: "pending",
          message: result.txId,
          payload: { transactionId: result.txId },
        })
        return { checkoutPath: result.checkoutUrl }
      }

      return { error: "Provider de paiement non configuré (bictorys | moneroo)." }
    } catch (err) {
      await logPaymentEvent({
        paymentId: payment.id,
        provider: liveProvider,
        eventType: "charge_failed",
        status: "failed",
        message: (err as Error).message,
      })
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
      metadata: (payment.metadata as Record<string, unknown> | null) ?? null,
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

  // service_role only — client JWT must not call this RPC (free Alliance bypass).
  const admin = createAdminClient()
  const { error } = await admin.rpc("activate_pending_payment" as never, {
    p_payment_id: paymentId,
    p_transaction_ref:
      pending.payment.transactionReference || `DEMO-${Date.now()}`,
  } as never)

  if (error) {
    return { error: error.message }
  }

  const { maybeGrantLoyaltyAfterAlliancePayment } = await import(
    "@/lib/loyalty/afterPayment"
  )
  await maybeGrantLoyaltyAfterAlliancePayment({
    userId: user.id,
    paymentId,
    metadata: pending.payment.metadata,
  })

  await logPaymentEvent({
    paymentId,
    provider: "demo",
    eventType: "payment_completed",
    status: "completed",
    message: "Activation démo manuelle",
  })

  revalidatePath("/pricing")
  revalidatePath("/settings")
  revalidatePath("/messages")
  revalidatePath("/compatibility")
  revalidatePath("/checkout/success")
  revalidatePath("/premium")

  return { success: true }
}

export async function getMySubscriptionSummary() {
  const sub = await getActiveSubscription()
  const entitlements = await getUserEntitlements()
  return { subscription: sub, entitlements }
}
