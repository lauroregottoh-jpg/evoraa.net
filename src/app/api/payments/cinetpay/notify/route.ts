import { createClient } from "@supabase/supabase-js"
import { timingSafeEqual } from "crypto"
import { NextRequest, NextResponse } from "next/server"

function verifyCinetPayWebhook(request: NextRequest, body: Record<string, unknown>) {
  // Prefer dedicated webhook token (not the payment API secret).
  const webhookToken =
    process.env.CINETPAY_WEBHOOK_TOKEN?.trim() ||
    process.env.CINETPAY_SECRET_KEY?.trim() ||
    ""

  if (!webhookToken) {
    // No shared secret configured: allow notify through; activation still requires
    // live verification via CinetPay check API below.
    return { ok: true as const, mode: "api_check_only" as const }
  }

  // Header only — never query string or body.secret (logged / forgeable).
  const presented = request.headers.get("x-cinetpay-secret") || ""
  if (!presented) {
    // CinetPay dashboards often cannot set custom headers. If a token is configured
    // but not sent, fall through to API check only (still require transaction verify).
    return { ok: true as const, mode: "api_check_only" as const }
  }

  const a = Buffer.from(presented)
  const b = Buffer.from(webhookToken)
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false as const, error: "Secret webhook invalide" }
  }

  return { ok: true as const, mode: "header" as const }
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
 * CinetPay notify URL (sans secret dans l’URL) :
 * https://votre-domaine.com/api/payments/cinetpay/notify
 *
 * L’activation exige une confirmation live via l’API CinetPay check.
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

  if (!transactionId) {
    return NextResponse.json(
      { error: "transaction_id manquant (vérification CinetPay obligatoire)" },
      { status: 400 }
    )
  }

  const check = await verifyTransactionWithCinetPay(transactionId)
  if (!check.verified) {
    return NextResponse.json(
      { error: "Transaction non confirmée auprès de CinetPay", detail: check },
      { status: 400 }
    )
  }

  const admin = createClient(supabaseUrl, serviceKey)
  const query = admin
    .from("payments")
    .select("id, status, subscription_id, metadata")
    .eq("transaction_reference", transactionId)

  const { data: payment } = await query.maybeSingle()
  if (!payment) {
    return NextResponse.json({ error: "Paiement introuvable" }, { status: 404 })
  }

  if (payment.status === "completed") {
    return NextResponse.json({ ok: true, activated: true, already: true })
  }

  // Activation autorisée uniquement après verifyTransactionWithCinetPay (ci-dessus).
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
