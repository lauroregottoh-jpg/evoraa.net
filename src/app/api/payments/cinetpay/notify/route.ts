import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import { logPaymentEvent } from "@/lib/billing/paymentAudit"
import { verifyCinetPayWebhookAuth } from "@/lib/billing/webhookAuth"
import { captureError } from "@/lib/observability/report"
import { assertPaymentsNotPaused } from "@/lib/platform/killSwitches"

async function verifyTransactionWithCinetPay(transactionId: string) {
  const apikey = process.env.CINETPAY_API_KEY
  const siteId = process.env.CINETPAY_SITE_ID
  if (!apikey || !siteId) return { verified: false, reason: "clés CinetPay absentes" }

  try {
    const res = await fetch("https://api-checkout.cinetpay.com/v2/payment/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apikey,
        site_id: siteId,
        transaction_id: transactionId,
      }),
    })
    const payload = await res.json()
    const status = String(payload?.data?.status || payload?.message || "").toLowerCase()
    const code = String(payload?.code || "")
    const accepted =
      code === "00" ||
      status === "accepted" ||
      status === "success" ||
      status === "completed"
    return { verified: accepted, payload }
  } catch (e) {
    return {
      verified: false,
      reason: e instanceof Error ? e.message : "check_failed",
    }
  }
}

/**
 * CinetPay notify — même barème Bictorys :
 * check API obligatoire + activate_pending_payment atomique + audit events.
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

  if (!serviceKey || !supabaseUrl) {
    captureError("cinetpay_webhook_service_role_missing")
    return NextResponse.json(
      { error: "Service role non configuré" },
      { status: 500 }
    )
  }

  let body: Record<string, unknown> = {}
  const contentType = request.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    body = await request.json()
  } else {
    const form = await request.formData()
    form.forEach((value, key) => {
      body[key] = String(value)
    })
  }

  const webhookToken =
    process.env.CINETPAY_WEBHOOK_TOKEN?.trim() ||
    process.env.CINETPAY_SECRET_KEY?.trim() ||
    ""
  const auth = verifyCinetPayWebhookAuth({
    webhookToken,
    presentedHeader: request.headers.get("x-cinetpay-secret") || "",
  })
  if (!auth.ok) {
    captureError(auth.error, { source: "cinetpay_webhook_auth" })
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }

  const transactionId = String(body.transaction_id || body.cpm_trans_id || "")

  if (!transactionId) {
    return NextResponse.json(
      { error: "transaction_id manquant (vérification CinetPay obligatoire)" },
      { status: 400 }
    )
  }

  const check = await verifyTransactionWithCinetPay(transactionId)
  if (!check.verified) {
    await logPaymentEvent({
      provider: "cinetpay",
      eventType: "webhook_ignored",
      status: "unverified",
      message: transactionId,
      payload: { body, check },
    })
    return NextResponse.json(
      { error: "Transaction non confirmée auprès de CinetPay", detail: check },
      { status: 400 }
    )
  }

  const admin = createClient(supabaseUrl, serviceKey)
  const { data: payment } = await admin
    .from("payments")
    .select("id, status, subscription_id, metadata")
    .eq("transaction_reference", transactionId)
    .maybeSingle()

  if (!payment) {
    captureError("cinetpay_payment_not_found", { transactionId })
    return NextResponse.json({ error: "Paiement introuvable" }, { status: 404 })
  }

  await logPaymentEvent({
    paymentId: payment.id,
    provider: "cinetpay",
    eventType: "webhook_received",
    status: auth.mode,
    payload: body,
  })

  if (payment.status === "completed") {
    await logPaymentEvent({
      paymentId: payment.id,
      provider: "cinetpay",
      eventType: "webhook_ignored",
      status: "completed",
      message: "Paiement déjà activé",
    })
    return NextResponse.json({ ok: true, activated: true, already: true })
  }

  const { data: subscription } = await admin
    .from("subscriptions")
    .select("id, user_id")
    .eq("id", payment.subscription_id)
    .maybeSingle()

  if (!subscription) {
    return NextResponse.json({ error: "Abonnement introuvable" }, { status: 404 })
  }

  const { error: activateError } = await admin.rpc("activate_pending_payment" as never, {
    p_payment_id: payment.id,
    p_transaction_ref: transactionId,
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
      source: "cinetpay_activate_pending_payment",
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
        provider: "cinetpay",
        auth_mode: auth.mode,
      },
    })
    .eq("id", payment.id)

  await logPaymentEvent({
    paymentId: payment.id,
    provider: "cinetpay",
    eventType: "payment_completed",
    status: "completed",
    message: transactionId,
  })

  return NextResponse.json({ ok: true, activated: true })
}
