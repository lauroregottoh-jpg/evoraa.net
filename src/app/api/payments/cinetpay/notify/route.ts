import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

/**
 * CinetPay payment notification webhook.
 * Docs: POST with transaction_id, cpm_trans_status / status, etc.
 */
export async function POST(request: NextRequest) {
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
      body[key] = value
    })
  }

  const transactionId = String(
    body.transaction_id ||
      body.cpm_trans_id ||
      body.cpm_trans_id ||
      body.metadata ||
      ""
  )
  const status = String(
    body.status || body.cpm_trans_status || body.cpm_result || ""
  ).toLowerCase()

  const paymentId = String(body.metadata || body.payment_id || "")

  const admin = createClient(supabaseUrl, serviceKey)

  // Prefer lookup by transaction reference
  let query = admin.from("payments").select("id, status, subscription_id, metadata")
  if (transactionId) {
    query = query.eq("transaction_reference", transactionId)
  } else if (paymentId) {
    query = query.eq("id", paymentId)
  } else {
    return NextResponse.json({ error: "transaction_id manquant" }, { status: 400 })
  }

  const { data: payment } = await query.maybeSingle()
  if (!payment) {
    return NextResponse.json({ error: "Paiement introuvable" }, { status: 404 })
  }

  const success =
    status === "accepted" ||
    status === "success" ||
    status === "00" ||
    status === "completed" ||
    body.code === "00"

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

  if (payment.status === "completed") {
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
