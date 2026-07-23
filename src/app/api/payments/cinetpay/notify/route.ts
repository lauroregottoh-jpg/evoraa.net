import { createClient } from "@supabase/supabase-js"
import { createHmac, timingSafeEqual } from "crypto"
import { NextRequest, NextResponse } from "next/server"

function verifyCinetPayWebhook(request: NextRequest, body: Record<string, unknown>) {
  const secret = process.env.CINETPAY_SECRET_KEY
  if (!secret) {
    return { ok: false as const, error: "CINETPAY_SECRET_KEY manquant" }
  }

  // Shared secret via header or query (configure the same value in CinetPay notify URL)
  const token =
    request.headers.get("x-cinetpay-secret") ||
    request.nextUrl.searchParams.get("token") ||
    String(body.secret || body.token || "")

  if (!token) {
    return { ok: false as const, error: "Secret webhook manquant" }
  }

  const a = Buffer.from(token)
  const b = Buffer.from(secret)
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false as const, error: "Secret webhook invalide" }
  }

  return { ok: true as const }
}

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
 * CinetPay notify URL example:
 * https://votre-domaine.com/api/payments/cinetpay/notify?token=YOUR_CINETPAY_SECRET_KEY
 */
export async function POST(request: NextRequest) {
  if (process.env.PAYMENTS_DEMO_MODE === "true") {
    return NextResponse.json(
      { error: "Webhook refusé : PAYMENTS_DEMO_MODE=true" },
      { status: 403 }
    )
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!serviceKey || !supabaseUrl) {
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

  const auth = verifyCinetPayWebhook(request, body)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }

  const transactionId = String(body.transaction_id || body.cpm_trans_id || "")
  const paymentId = String(body.metadata || body.payment_id || "")

  if (!transactionId && !paymentId) {
    return NextResponse.json({ error: "transaction_id manquant" }, { status: 400 })
  }

  if (transactionId) {
    const check = await verifyTransactionWithCinetPay(transactionId)
    if (!check.verified) {
      return NextResponse.json(
        { error: "Transaction non confirmée auprès de CinetPay", detail: check },
        { status: 400 }
      )
    }
  }

  const admin = createClient(supabaseUrl, serviceKey)
  let query = admin.from("payments").select("id, status, subscription_id, metadata")
  if (transactionId) {
    query = query.eq("transaction_reference", transactionId)
  } else {
    query = query.eq("id", paymentId)
  }

  const { data: payment } = await query.maybeSingle()
  if (!payment) {
    return NextResponse.json({ error: "Paiement introuvable" }, { status: 404 })
  }

  if (payment.status === "completed") {
    return NextResponse.json({ ok: true, activated: true, already: true })
  }

  const status = String(
    body.status || body.cpm_trans_status || body.cpm_result || ""
  ).toLowerCase()
  const success =
    status === "accepted" ||
    status === "success" ||
    status === "00" ||
    status === "completed" ||
    body.code === "00" ||
    Boolean(transactionId)

  if (!success) {
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

    await admin
      .from("subscriptions")
      .update({ status: "failed" })
      .eq("id", payment.subscription_id)

    return NextResponse.json({ ok: true, activated: false })
  }

  const { data: subscription } = await admin
    .from("subscriptions")
    .select("id, user_id")
    .eq("id", payment.subscription_id)
    .maybeSingle()

  if (!subscription) {
    return NextResponse.json({ error: "Abonnement introuvable" }, { status: 404 })
  }

  await admin
    .from("subscriptions")
    .update({ status: "cancelled" })
    .eq("user_id", subscription.user_id)
    .eq("status", "active")
    .neq("id", subscription.id)

  await admin
    .from("payments")
    .update({
      status: "completed",
      metadata: {
        ...(typeof payment.metadata === "object" && payment.metadata
          ? (payment.metadata as object)
          : {}),
        webhook: body,
        activated_at: new Date().toISOString(),
        hmac_note: createHmac("sha256", process.env.CINETPAY_SECRET_KEY || "x")
          .update(String(payment.id))
          .digest("hex")
          .slice(0, 12),
      },
    })
    .eq("id", payment.id)

  await admin
    .from("subscriptions")
    .update({
      status: "active",
      starts_at: new Date().toISOString(),
      ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .eq("id", subscription.id)

  return NextResponse.json({ ok: true, activated: true })
}
