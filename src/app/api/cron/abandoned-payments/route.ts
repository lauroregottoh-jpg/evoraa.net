import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { sendEmailWithRetry } from "@/lib/email/outbox"
import { abandonedPaymentEmailHtml } from "@/lib/email/templates"
import { resolveAppUrlSync } from "@/lib/auth/appUrl"
import { verifyCronSecret } from "@/lib/security/cronAuth"
import { getAuthEmailsBatch } from "@/lib/auth/authEmailsBatch"

/**
 * Relance les membres qui ont initié un paiement Alliance sans le terminer.
 * Fenêtre : pending depuis 1h–72h.
 */
export async function GET(request: NextRequest) {
  const denied = verifyCronSecret(request)
  if (denied) return denied

  const supabase = createAdminClient()
  const now = Date.now()
  const olderThan = new Date(now - 60 * 60 * 1000).toISOString()
  const newerThan = new Date(now - 72 * 60 * 60 * 1000).toISOString()
  const dedupeSince = new Date(now - 48 * 60 * 60 * 1000).toISOString()
  const notifTitle = "Paiement Alliance non terminé"

  const { data: payments, error } = await supabase
    .from("payments")
    .select("id, amount, status, created_at, subscription_id")
    .eq("status", "pending")
    .lte("created_at", olderThan)
    .gte("created_at", newerThan)
    .limit(200)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const subIds = [...new Set((payments ?? []).map((p) => p.subscription_id as string))]
  if (subIds.length === 0) {
    return NextResponse.json({ ok: true, checked: 0, notified: 0 })
  }

  const { data: subs } = await supabase
    .from("subscriptions")
    .select("id, user_id, plan, status")
    .in("id", subIds)

  const subById = new Map((subs ?? []).map((s) => [s.id as string, s]))

  type Row = { paymentId: string; userId: string; amount: number }
  const candidates: Row[] = []
  for (const p of payments ?? []) {
    const sub = subById.get(p.subscription_id as string)
    if (!sub?.user_id) continue
    if (sub.status === "active") continue
    candidates.push({
      paymentId: p.id as string,
      userId: sub.user_id as string,
      amount: Number(p.amount) || 0,
    })
  }

  if (candidates.length === 0) {
    return NextResponse.json({
      ok: true,
      checked: payments?.length ?? 0,
      notified: 0,
    })
  }

  const userIds = [...new Set(candidates.map((c) => c.userId))]
  const { data: existing } = await supabase
    .from("notifications")
    .select("user_id")
    .eq("title", notifTitle)
    .in("user_id", userIds)
    .gte("created_at", dedupeSince)

  const already = new Set((existing ?? []).map((n) => n.user_id as string))
  const toSend = candidates.filter((c) => !already.has(c.userId))

  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, first_name")
    .in(
      "user_id",
      [...new Set(toSend.map((c) => c.userId))]
    )

  const nameByUser = new Map(
    (profiles ?? []).map((p) => [p.user_id as string, (p.first_name as string) || ""])
  )
  const emailByUser = await getAuthEmailsBatch(
    supabase,
    [...new Set(toSend.map((c) => c.userId))]
  )
  const appUrl = resolveAppUrlSync()

  let notified = 0
  let emailed = 0

  for (const c of toSend) {
    await supabase.from("notifications").insert({
      user_id: c.userId,
      title: notifTitle,
      body: `Vous avez commencé un paiement Alliance (${c.amount.toLocaleString("fr-FR")} FCFA) sans le finaliser. Reprenez quand vous voulez — votre place vous attend.`,
      is_read: false,
    })
    notified++

    const row = emailByUser.get(c.userId)
    if (row?.email) {
      const html = abandonedPaymentEmailHtml({
        firstName: nameByUser.get(c.userId) || row.firstName || "",
        appUrl,
        amountLabel: `${c.amount.toLocaleString("fr-FR")} FCFA`,
      })
      const r = await sendEmailWithRetry({
        to: row.email,
        subject: "Votre paiement Alliance n’est pas terminé",
        html,
      })
      if (!r.error) emailed++
    }
  }

  return NextResponse.json({
    ok: true,
    checked: payments?.length ?? 0,
    notified,
    emailed,
  })
}
