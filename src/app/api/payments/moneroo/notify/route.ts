import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import { logPaymentEvent } from "@/lib/billing/paymentAudit"
import { monerooVerifyPayment } from "@/lib/billing/monerooClient"
import { verifyMonerooWebhookAuth } from "@/lib/billing/webhookAuth"
import { captureError } from "@/lib/observability/report"
import { assertPaymentsNotPaused } from "@/lib/platform/killSwitches"

/**
 * Webhook Moneroo — ACK 200 rapide, activation après verify API + RPC atomique.
 * URL dashboard : https://www.keliaa.org/api/payments/moneroo/notify
 */
export async function POST(request: NextRequest) {
  if (process.env.PAYMENTS_DEMO_MODE === "true") {
    return NextResponse.json(
      { error: "Webhook refusé : PAYMENTS_DEMO_MODE=true" },
      { status: 403 }
    )
  }

  const paused = await assertPaymentsNotPaused()
  if (!paused.ok) {
    return NextResponse.json({ error: paused.error }, { status: 503 })
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const monerooSecret = process.env.MONEROO_SECRET_KEY?.trim()
  const webhookSecret = process.env.MONEROO_WEBHOOK_SECRET?.trim()

  if (!serviceKey || !supabaseUrl) {
    captureError("moneroo_webhook_service_role_missing")
    return NextResponse.json({ error: "Service role non configuré" }, { status: 500 })
  }
  if (!monerooSecret) {
    return NextResponse.json({ error: "MONEROO_SECRET_KEY manquant" }, { status: 500 })
  }

  const raw = await request.text()
  const auth = verifyMonerooWebhookAuth({
    webhookSecret: webhookSecret || "",
    signatureHeader: request.headers.get("x-moneroo-signature") || "",
    rawBody: raw,
  })
  if (!auth.ok) {
    captureError(auth.error, { source: "moneroo_webhook_auth" })
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }

  let body: Record<string, unknown> = {}
  try {
    body = JSON.parse(raw) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 })
  }

  const event = String(body.event || body.type || "")
  const data =
    body.data && typeof body.data === "object"
      ? (body.data as Record<string, unknown>)
      : body
  const monerooId = String(data.id || body.id || "")

  if (!monerooId) {
    return NextResponse.json({ error: "payment id manquant" }, { status: 400 })
  }

  // Non-terminal events → ACK without activation
  if (
    event.includes("initiated") ||
    event.includes("pending") ||
    (!event.includes("success") &&
      !event.includes("fail") &&
      !event.includes("cancel") &&
      event !== "")
  ) {
    if (!/success|fail|cancel/i.test(event) && event !== "") {
      await logPaymentEvent({
        provider: "moneroo",
        eventType: "webhook_ignored",
        status: event || "pending",
        message: monerooId,
        payload: body,
      })
      return NextResponse.json({ ok: true, activated: false, pending: true })
    }
  }

  const verified = await monerooVerifyPayment({
    secretKey: monerooSecret,
    paymentId: monerooId,
  })
  if (!verified.ok) {
    captureError(verified.error, { source: "moneroo_verify", monerooId })
    return NextResponse.json({ error: "Vérification Moneroo impossible" }, { status: 400 })
  }

  const admin = createClient(supabaseUrl, serviceKey)
  const metaPaymentId =
    typeof verified.metadata?.keliaa_payment_id === "string"
      ? verified.metadata.keliaa_payment_id
      : typeof data.metadata === "object" &&
          data.metadata &&
          typeof (data.metadata as { keliaa_payment_id?: string }).keliaa_payment_id ===
            "string"
        ? (data.metadata as { keliaa_payment_id: string }).keliaa_payment_id
        : null

  let paymentQuery = admin
    .from("payments")
    .select("id, status, subscription_id, metadata, amount")
  if (metaPaymentId) {
    paymentQuery = paymentQuery.eq("id", metaPaymentId)
  } else {
    paymentQuery = paymentQuery.eq("transaction_reference", monerooId)
  }

  const { data: payment } = await paymentQuery.maybeSingle()
  if (!payment) {
    captureError("moneroo_payment_not_found", { monerooId, metaPaymentId })
    return NextResponse.json({ error: "Paiement introuvable" }, { status: 404 })
  }

  await logPaymentEvent({
    paymentId: payment.id,
    provider: "moneroo",
    eventType: "webhook_received",
    status: verified.status,
    payload: body,
  })

  if (payment.status === "completed") {
    return NextResponse.json({ ok: true, activated: true, already: true })
  }

  if (verified.status === "failed" || verified.status === "cancelled") {
    await admin
      .from("payments")
      .update({
        status: "failed",
        metadata: {
          ...(typeof payment.metadata === "object" && payment.metadata
            ? (payment.metadata as object)
            : {}),
          webhook: body,
          moneroo_verify: verified.raw,
        },
      })
      .eq("id", payment.id)
      .eq("status", "pending")
    await admin.from("subscriptions").update({ status: "failed" }).eq("id", payment.subscription_id)
    await logPaymentEvent({
      paymentId: payment.id,
      provider: "moneroo",
      eventType: "payment_failed",
      status: verified.status,
    })
    return NextResponse.json({ ok: true, activated: false })
  }

  if (verified.status !== "success") {
    await logPaymentEvent({
      paymentId: payment.id,
      provider: "moneroo",
      eventType: "webhook_ignored",
      status: verified.status,
      message: "État non terminal",
    })
    return NextResponse.json({ ok: true, activated: false, pending: true })
  }

  // Optional amount check (XOF)
  const expected = Number(payment.amount ?? 0)
  if (expected > 0 && verified.amount > 0 && verified.amount < expected) {
    captureError("moneroo_amount_mismatch", {
      expected,
      got: verified.amount,
      paymentId: payment.id,
    })
    return NextResponse.json({ error: "Montant incohérent" }, { status: 400 })
  }

  const { error: activateError } = await admin.rpc("activate_pending_payment" as never, {
    p_payment_id: payment.id,
    p_transaction_ref: monerooId,
  } as never)

  if (activateError) {
    const { data: refreshed } = await admin
      .from("payments")
      .select("status")
      .eq("id", payment.id)
      .maybeSingle()
    if (refreshed?.status === "completed") {
      return NextResponse.json({ ok: true, activated: true, already: true })
    }
    captureError(activateError.message, {
      source: "moneroo_activate_pending_payment",
      paymentId: payment.id,
    })
    return NextResponse.json({ error: "Activation impossible" }, { status: 500 })
  }

  await admin
    .from("payments")
    .update({
      metadata: {
        ...(typeof payment.metadata === "object" && payment.metadata
          ? (payment.metadata as object)
          : {}),
        webhook: body,
        provider: "moneroo",
        moneroo_verify: verified.raw,
      },
    })
    .eq("id", payment.id)

  await logPaymentEvent({
    paymentId: payment.id,
    provider: "moneroo",
    eventType: "payment_completed",
    status: "completed",
    message: monerooId,
  })

  return NextResponse.json({ ok: true, activated: true })
}
