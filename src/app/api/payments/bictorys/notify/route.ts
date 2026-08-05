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
  let query = admin.from("payments").select("id, status, subscription_id, metadata")
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

  if (deliveryId) await markWebhookDeliveryProcessed(admin, deliveryId)
  return NextResponse.json({ ok: true, activated: true })
}
