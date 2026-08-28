import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import { logPaymentEvent } from "@/lib/billing/paymentAudit"
import { readBictorysAuthFromRequest } from "@/lib/billing/webhookAuth"
import {
  buildWebhookExternalKey,
  claimWebhookDelivery,
  markWebhookDeliveryProcessed,
} from "@/lib/billing/webhookDedup"
import { captureError } from "@/lib/observability/report"
import { resolveAppUrlSync } from "@/lib/auth/appUrl"
import { sendEmailWithRetry } from "@/lib/email/outbox"
import { allianceActivatedEmailHtml } from "@/lib/email/templates"
import { assertPaymentsNotPaused } from "@/lib/platform/killSwitches"

function mapStatus(statusLike: string) {
  const s = statusLike.toLowerCase()
  if (s.includes("succeed") || s === "completed" || s === "success") return "completed" as const
  if (s.includes("fail") || s.includes("cancel") || s === "rejected") return "failed" as const
  return "pending" as const
}

async function notifyAllianceActivated(
  admin: {
    auth: {
      admin: {
        getUserById: (
          id: string
        ) => Promise<{ data: { user: { email?: string; user_metadata?: Record<string, unknown> } | null } }>
      }
    }
  },
  userId: string
) {
  try {
    const { data: authUser } = await admin.auth.admin.getUserById(userId)
    const user = authUser?.user
    const email = user?.email
    if (!email || !user) return
    const firstName =
      (user.user_metadata?.first_name as string | undefined) || ""
    const appUrl = resolveAppUrlSync() || "https://www.keliaa.org"
    const endsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    await sendEmailWithRetry({
      to: email,
      subject: "KELIAA — Votre Alliance est active",
      html: allianceActivatedEmailHtml({
        firstName,
        appUrl,
        endsAtLabel: endsAt.toLocaleDateString("fr-FR"),
      }),
    })
  } catch (e) {
    captureError(e, { source: "bictorys_notify_email" })
  }
}

export async function POST(request: NextRequest) {
  if (process.env.PAYMENTS_DEMO_MODE === "true") {
    return NextResponse.json({ error: "Webhook refusé : PAYMENTS_DEMO_MODE=true" }, { status: 403 })
  }

  const paused = await assertPaymentsNotPaused()
  if (!paused.ok) {
    return NextResponse.json({ error: paused.error }, { status: 503 })
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!serviceKey || !supabaseUrl) {
    captureError("bictorys_webhook_service_role_missing")
    return NextResponse.json({ error: "Service role non configuré" }, { status: 500 })
  }

  const raw = await request.text()
  const auth = readBictorysAuthFromRequest(
    request,
    raw,
    process.env.BICTORYS_WEBHOOK_SECRET
  )
  if (!auth.ok) {
    captureError(auth.error, { source: "bictorys_webhook_auth" })
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }

  let body: Record<string, unknown> = {}
  try {
    body = JSON.parse(raw)
  } catch {
    const form = new URLSearchParams(raw)
    form.forEach((value, key) => {
      body[key] = value
    })
  }

  const paymentReference = String(body.paymentReference || body.payment_id || body.metadata || "")
  const transactionId = String(body.transactionId || body.chargeId || body.transaction_id || "")
  const statusRaw = String(body.status || body.event || "")

  if (!paymentReference && !transactionId) {
    return NextResponse.json({ error: "paymentReference manquant" }, { status: 400 })
  }

  const admin = createClient(supabaseUrl, serviceKey)
  let query = admin.from("payments").select("id, status, subscription_id, metadata, user_id, amount")
  if (paymentReference) query = query.eq("id", paymentReference)
  else query = query.eq("transaction_reference", transactionId)

  const { data: payment } = await query.maybeSingle()
  if (!payment) {
    captureError("bictorys_payment_not_found", { paymentReference, transactionId })
    return NextResponse.json({ error: "Paiement introuvable" }, { status: 404 })
  }

  const mapped = mapStatus(statusRaw)
  const externalId = buildWebhookExternalKey({
    transactionId,
    paymentId: payment.id,
  })
  const claim = await claimWebhookDelivery(admin, {
    provider: "bictorys",
    externalId,
    eventType: mapped,
    paymentId: payment.id,
  })
  if (claim.status === "deduped") {
    return NextResponse.json({
      ok: true,
      activated: mapped === "completed",
      deduped: true,
    })
  }
  if (claim.status === "error") {
    captureError(claim.message, { source: "bictorys_webhook_dedup" })
    // Fail-open: continue without durable claim (activate_pending_payment still race-safe)
  }
  const deliveryId =
    claim.status === "fresh" || claim.status === "retry" ? claim.id : null

  await logPaymentEvent({
    paymentId: payment.id,
    provider: "bictorys",
    eventType: "webhook_received",
    status: statusRaw,
    payload: body as Record<string, unknown>,
  })

  if (payment.status === "completed") {
    await logPaymentEvent({
      paymentId: payment.id,
      provider: "bictorys",
      eventType: "webhook_ignored",
      status: "completed",
      message: "Paiement déjà activé",
    })
    if (deliveryId) await markWebhookDeliveryProcessed(admin, deliveryId)
    return NextResponse.json({ ok: true, activated: true, already: true })
  }

  if (mapped === "failed") {
    await admin
      .from("payments")
      .update({
        status: "failed",
        metadata: {
          ...(typeof payment.metadata === "object" && payment.metadata
            ? (payment.metadata as object)
            : {}),
          webhook: body,
        },
      })
      .eq("id", payment.id)
      .eq("status", "pending")
    await admin.from("subscriptions").update({ status: "failed" }).eq("id", payment.subscription_id)
    await logPaymentEvent({
      paymentId: payment.id,
      provider: "bictorys",
      eventType: "payment_failed",
      status: "failed",
      message: statusRaw,
    })
    if (deliveryId) await markWebhookDeliveryProcessed(admin, deliveryId)
    return NextResponse.json({ ok: true, activated: false })
  }

  if (mapped === "pending") {
    await logPaymentEvent({
      paymentId: payment.id,
      provider: "bictorys",
      eventType: "webhook_ignored",
      status: "pending",
      message: "État non terminal",
    })
    if (deliveryId) await markWebhookDeliveryProcessed(admin, deliveryId)
    return NextResponse.json({ ok: true, activated: false, pending: true })
  }

  const paymentMeta =
    typeof payment.metadata === "object" && payment.metadata
      ? (payment.metadata as Record<string, unknown>)
      : {}

  // KELYA COUPLE : one-shot, sans activer Alliance.
  if (paymentMeta.product === "couple") {
    const offerId = String(paymentMeta.offer_id || "")
    if (offerId !== "couple_essential" && offerId !== "couple_premium_plus") {
      return NextResponse.json({ error: "Offre couple invalide" }, { status: 400 })
    }

    const { error: couplePayErr } = await admin
      .from("payments")
      .update({
        status: "completed",
        transaction_reference: transactionId || payment.id,
        metadata: {
          ...paymentMeta,
          webhook: body,
          provider: "bictorys",
          couple_paid_at: new Date().toISOString(),
        },
      })
      .eq("id", payment.id)
      .eq("status", "pending")

    if (couplePayErr) {
      const { data: refreshed } = await admin
        .from("payments")
        .select("status")
        .eq("id", payment.id)
        .maybeSingle()
      if (refreshed?.status === "completed") {
        if (deliveryId) await markWebhookDeliveryProcessed(admin, deliveryId)
        return NextResponse.json({ ok: true, activated: true, couple: true, already: true })
      }
      captureError(couplePayErr.message, { source: "bictorys_couple_complete" })
      return NextResponse.json({ error: "Activation couple impossible" }, { status: 500 })
    }

    await admin
      .from("subscriptions")
      .update({
        status: "paid_couple",
        starts_at: new Date().toISOString(),
        ends_at: null,
      })
      .eq("id", payment.subscription_id)

    await admin
      .from("couple_purchases")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("payment_id", payment.id)

    const { data: profile } = await admin
      .from("profiles")
      .select("first_name")
      .eq("user_id", payment.user_id)
      .maybeSingle()

    try {
      const { fulfillCouplePurchase } = await import("@/lib/couple/fulfill")
      const fulfilled = await fulfillCouplePurchase({
        admin,
        paymentId: payment.id,
        purchaserUserId: payment.user_id,
        offerId,
        amountXof: Number(payment.amount) || 0,
        displayName: (profile?.first_name as string) || null,
      })
      if (fulfilled.inviteCode) {
        const { data: authUser } = await admin.auth.admin.getUserById(
          payment.user_id
        )
        const email = authUser.user?.email
        if (email) {
          const { sendCoupleAccessEmail } = await import(
            "@/lib/couple/inviteEmail"
          )
          const {
            coupleAbsoluteUrl,
            couplePartnerJoinPath,
            coupleSpacePath,
            coupleAppBaseUrl,
          } = await import("@/lib/couple/inviteLinks")
          const base = coupleAppBaseUrl()
          await sendCoupleAccessEmail({
            to: email,
            firstName: (profile?.first_name as string) || "",
            spaceUrl: coupleAbsoluteUrl(coupleSpacePath(), base),
            partnerUrl: coupleAbsoluteUrl(
              couplePartnerJoinPath(fulfilled.inviteCode),
              base
            ),
            inviteCode: fulfilled.inviteCode,
          })
        }
      }
    } catch (err) {
      captureError(err instanceof Error ? err.message : "couple fulfill", {
        source: "bictorys_couple_fulfill",
        paymentId: payment.id,
      })
      return NextResponse.json({ error: "Création couple impossible" }, { status: 500 })
    }

    await logPaymentEvent({
      paymentId: payment.id,
      provider: "bictorys",
      eventType: "payment_completed",
      status: "completed",
      message: `couple:${offerId}`,
    })

    if (deliveryId) await markWebhookDeliveryProcessed(admin, deliveryId)
    return NextResponse.json({ ok: true, activated: true, couple: true })
  }

  // Coaching : marquer payé SANS activer Alliance (ne pas cancel d’autres abos).
  if (paymentMeta.product === "coaching") {
    const { error: coachPayErr } = await admin
      .from("payments")
      .update({
        status: "completed",
        transaction_reference: transactionId || payment.id,
        metadata: {
          ...paymentMeta,
          webhook: body,
          provider: "bictorys",
          coaching_paid_at: new Date().toISOString(),
        },
      })
      .eq("id", payment.id)
      .eq("status", "pending")

    if (coachPayErr) {
      const { data: refreshed } = await admin
        .from("payments")
        .select("status")
        .eq("id", payment.id)
        .maybeSingle()
      if (refreshed?.status === "completed") {
        if (deliveryId) await markWebhookDeliveryProcessed(admin, deliveryId)
        return NextResponse.json({
          ok: true,
          activated: true,
          coaching: true,
          already: true,
        })
      }
      captureError(coachPayErr.message, { source: "bictorys_coaching_complete" })
      return NextResponse.json({ error: "Activation coaching impossible" }, { status: 500 })
    }

    await admin
      .from("subscriptions")
      .update({
        status: "paid_coaching",
        starts_at: new Date().toISOString(),
        ends_at: null,
      })
      .eq("id", payment.subscription_id)

    // Crédits ledger : 1 crédit = 30 min ; séance 60 min = 2 crédits
    try {
      const sessions = Number(paymentMeta.sessions || paymentMeta.packSessions || 1)
      const minutes = Number(paymentMeta.minutes || 30) === 60 ? 60 : 30
      const credits = Math.max(1, sessions * (minutes / 30))
      await admin.from("coaching_credits_ledger").insert({
        user_id: payment.user_id,
        delta_credits: credits,
        reason: "purchase",
        ref_payment_id: payment.id,
        metadata: {
          packId: paymentMeta.packId,
          sessions,
          minutes,
        },
      })
    } catch (ledgerErr) {
      captureError(
        ledgerErr instanceof Error ? ledgerErr.message : "ledger",
        { source: "bictorys_coaching_credits" }
      )
    }

    await logPaymentEvent({
      paymentId: payment.id,
      provider: "bictorys",
      eventType: "payment_completed",
      status: "completed",
      message: `coaching:${String(paymentMeta.packId || "")}`,
    })

    if (deliveryId) await markWebhookDeliveryProcessed(admin, deliveryId)
    return NextResponse.json({ ok: true, activated: true, coaching: true })
  }

  // Lien de paiement admin (montant libre) — pas d'activation Alliance.
  if (paymentMeta.product === "admin_link") {
    const { fulfillAdminPaymentLink } = await import("@/lib/billing/fulfillAdminPaymentLink")
    const fulfilled = await fulfillAdminPaymentLink({
      admin,
      paymentId: payment.id,
      subscriptionId: payment.subscription_id,
      paymentMeta,
      transactionId: transactionId || payment.id,
      webhookBody: body,
      provider: "bictorys",
    })
    if (!fulfilled.ok) {
      captureError(fulfilled.error, { source: "bictorys_admin_link" })
      return NextResponse.json({ error: fulfilled.error }, { status: 500 })
    }
    if (deliveryId) await markWebhookDeliveryProcessed(admin, deliveryId)
    return NextResponse.json({ ok: true, activated: true, adminLink: true })
  }

  const { data: subscription } = await admin
    .from("subscriptions")
    .select("id, user_id")
    .eq("id", payment.subscription_id)
    .maybeSingle()
  if (!subscription) {
    return NextResponse.json({ error: "Abonnement introuvable" }, { status: 404 })
  }

  // Atomic activation (pending-only) — race-safe against duplicate webhooks.
  const { error: activateError } = await admin.rpc("activate_pending_payment" as never, {
    p_payment_id: payment.id,
    p_transaction_ref: transactionId || `bictorys-${payment.id}`,
  } as never)

  if (activateError) {
    // Already activated by a concurrent webhook → treat as success.
    const { data: refreshed } = await admin
      .from("payments")
      .select("status")
      .eq("id", payment.id)
      .maybeSingle()
    if (refreshed?.status === "completed") {
      if (deliveryId) await markWebhookDeliveryProcessed(admin, deliveryId)
      return NextResponse.json({ ok: true, activated: true, already: true })
    }
    captureError(activateError.message, {
      source: "bictorys_activate_pending_payment",
      paymentId: payment.id,
    })
    return NextResponse.json({ error: "Activation impossible" }, { status: 500 })
  }

  // Enrich metadata with webhook payload (best-effort, after atomic activate).
  await admin
    .from("payments")
    .update({
      metadata: {
        ...(typeof payment.metadata === "object" && payment.metadata
          ? (payment.metadata as object)
          : {}),
        webhook: body,
        provider: "bictorys",
      },
    })
    .eq("id", payment.id)

  await logPaymentEvent({
    paymentId: payment.id,
    provider: "bictorys",
    eventType: "payment_completed",
    status: "completed",
    message: transactionId || undefined,
  })

  // Best-effort email — await outbox enqueue (fast); never fail the webhook ACK on mail errors.
  await notifyAllianceActivated(admin, subscription.user_id)

  const { maybeGrantLoyaltyAfterAlliancePayment } = await import(
    "@/lib/loyalty/afterPayment"
  )
  await maybeGrantLoyaltyAfterAlliancePayment({
    userId: subscription.user_id,
    paymentId: payment.id,
    metadata: payment.metadata,
  })

  if (deliveryId) await markWebhookDeliveryProcessed(admin, deliveryId)
  return NextResponse.json({ ok: true, activated: true })
}
