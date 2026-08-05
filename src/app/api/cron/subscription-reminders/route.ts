import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { sendEmailWithRetry } from "@/lib/email/outbox"
import { subscriptionReminderEmailHtml } from "@/lib/email/templates"
import { resolveAppUrlSync } from "@/lib/auth/appUrl"
import { verifyCronSecret } from "@/lib/security/cronAuth"
import { getAuthEmailsBatch } from "@/lib/auth/authEmailsBatch"

/**
 * Vercel Cron — rappels J-7 / J-3 / J-1 avant expiration Alliance.
 * D9: filtre candidats + batch emails (pas de N× getUserById).
 */
export async function GET(request: NextRequest) {
  const denied = verifyCronSecret(request)
  if (denied) return denied

  const supabase = createAdminClient()
  const now = Date.now()
  const inSevenDays = new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString()
  const dedupeSince = new Date(now - 36 * 60 * 60 * 1000).toISOString()

  const { data: subs, error } = await supabase
    .from("subscriptions")
    .select("id, user_id, plan, ends_at, status")
    .eq("status", "active")
    .not("ends_at", "is", null)
    .lte("ends_at", inSevenDays)
    .gte("ends_at", new Date().toISOString())
    .limit(300)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  type Candidate = {
    userId: string
    daysLeft: 7 | 3 | 1
    endsAt: Date
    title: string
    body: string
  }

  const candidates: Candidate[] = []
  for (const sub of subs ?? []) {
    const endsAt = new Date(sub.ends_at as string)
    const daysLeft = Math.ceil((endsAt.getTime() - now) / (1000 * 60 * 60 * 24))
    if (daysLeft !== 7 && daysLeft !== 3 && daysLeft !== 1) continue
    const title = `Alliance expire dans ${daysLeft} jour(s)`
    candidates.push({
      userId: sub.user_id as string,
      daysLeft,
      endsAt,
      title,
      body: `Votre abonnement Alliance se termine le ${endsAt.toLocaleDateString("fr-FR")}. Renouvelez depuis /billing pour continuer sans interruption.`,
    })
  }

  if (candidates.length === 0) {
    return NextResponse.json({
      ok: true,
      checked: subs?.length ?? 0,
      notified: 0,
      emailed: 0,
    })
  }

  const userIds = [...new Set(candidates.map((c) => c.userId))]
  const titles = [...new Set(candidates.map((c) => c.title))]

  const { data: existingNotifs } = await supabase
    .from("notifications")
    .select("user_id, title")
    .in("user_id", userIds)
    .in("title", titles)
    .gte("created_at", dedupeSince)

  const already = new Set(
    (existingNotifs ?? []).map(
      (n) => `${n.user_id as string}::${n.title as string}`
    )
  )

  const toSend = candidates.filter(
    (c) => !already.has(`${c.userId}::${c.title}`)
  )

  const { data: profileNames } = await supabase
    .from("profiles")
    .select("user_id, first_name")
    .in("user_id", [...new Set(toSend.map((c) => c.userId))])

  const nameByUser = new Map(
    (profileNames ?? []).map((p) => [
      p.user_id as string,
      (p.first_name as string) || "",
    ])
  )

  let emailByUser = await getAuthEmailsBatch(
    supabase,
    toSend.map((c) => c.userId)
  )

  // Fallback ponctuel si RPC absente (≤ 20 getUserById max)
  if (emailByUser.size === 0 && toSend.length > 0) {
    const fallbackIds = [...new Set(toSend.map((c) => c.userId))].slice(0, 20)
    for (const id of fallbackIds) {
      try {
        const { data } = await supabase.auth.admin.getUserById(id)
        const email = data.user?.email
        if (email) {
          emailByUser.set(id, {
            userId: id,
            email,
            firstName:
              (data.user?.user_metadata?.first_name as string | undefined) ||
              "",
          })
        }
      } catch {
        /* skip */
      }
    }
  }

  let notified = 0
  let emailed = 0
  const appUrl = resolveAppUrlSync()

  const notifRows = toSend.map((c) => ({
    user_id: c.userId,
    title: c.title,
    body: c.body,
    is_read: false,
  }))

  if (notifRows.length > 0) {
    const { error: nErr } = await supabase.from("notifications").insert(notifRows)
    if (!nErr) notified = notifRows.length
  }

  for (const c of toSend) {
    const auth = emailByUser.get(c.userId)
    const email = auth?.email
    if (!email) continue
    const firstName = nameByUser.get(c.userId) || auth.firstName || ""
    const mail = await sendEmailWithRetry({
      to: email,
      subject: `KELIAA — ${c.title}`,
      html: subscriptionReminderEmailHtml({
        firstName,
        appUrl,
        endsAtLabel: c.endsAt.toLocaleDateString("fr-FR"),
      }),
    })
    if (("success" in mail && mail.success) || ("queued" in mail && mail.queued)) {
      emailed++
    }
  }

  return NextResponse.json({
    ok: true,
    checked: subs?.length ?? 0,
    candidates: candidates.length,
    notified,
    emailed,
  })
}
