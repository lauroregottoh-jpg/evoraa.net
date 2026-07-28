import { createClient } from "@supabase/supabase-js"
import { createHmac, timingSafeEqual } from "crypto"
import { NextRequest, NextResponse } from "next/server"

function verifyTokenOrSignature(request: NextRequest, rawBody: string) {
  const secret = process.env.BICTORYS_WEBHOOK_SECRET
  if (!secret) return { ok: false as const, error: "BICTORYS_WEBHOOK_SECRET manquant" }

  const staticToken =
    request.headers.get("x-secret-key") || request.nextUrl.searchParams.get("token") || ""
  if (staticToken) {
    const a = Buffer.from(staticToken)
    const b = Buffer.from(secret)
    if (a.length === b.length && timingSafeEqual(a, b)) return { ok: true as const }
  }

  const sig = request.headers.get("x-webhook-signature") || ""
  const ts = request.headers.get("x-webhook-timestamp") || ""
  if (!sig || !ts) return { ok: false as const, error: "Signature webhook manquante" }

  const expected = createHmac("sha256", secret).update(`${ts}.${rawBody}`).digest("hex")
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false as const, error: "Signature webhook invalide" }
  }
  return { ok: true as const }
}

function mapStatus(statusLike: string) {
  const s = statusLike.toLowerCase()
  if (s.includes("succeed") || s === "completed" || s === "success") return "completed" as const
  if (s.includes("fail") || s.includes("cancel") || s === "rejected") return "failed" as const
  return "pending" as const
}

export async function POST(request: NextRequest) {
  if (process.env.PAYMENTS_DEMO_MODE === "true") {
    return NextResponse.json({ error: "Webhook refusé : PAYMENTS_DEMO_MODE=true" }, { status: 403 })
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!serviceKey || !supabaseUrl) {
    return NextResponse.json({ error: "Service role non configuré" }, { status: 500 })
  }

  const raw = await request.text()
  const auth = verifyTokenOrSignature(request, raw)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 })

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
  if (!payment) return NextResponse.json({ error: "Paiement introuvable" }, { status: 404 })
  if (payment.status === "completed") {
    return NextResponse.json({ ok: true, activated: true, already: true })
  }

  const mapped = mapStatus(statusRaw)
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
    await admin.from("subscriptions").update({ status: "failed" }).eq("id", payment.subscription_id)
    return NextResponse.json({ ok: true, activated: false })
  }

  if (mapped === "pending") {
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
      transaction_reference: transactionId || null,
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
