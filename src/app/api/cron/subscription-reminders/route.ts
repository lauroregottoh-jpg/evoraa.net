import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { sendEmailWithRetry } from "@/lib/email/outbox"
import { subscriptionReminderEmailHtml } from "@/lib/email/templates"
import { resolveAppUrlSync } from "@/lib/auth/appUrl"

function authorizeCron(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const auth = request.headers.get("authorization")
  return auth === `Bearer ${secret}`
}

/**
 * Vercel Cron — rappels J-7 / J-3 / J-1 avant expiration Alliance.
 * Configure CRON_SECRET sur Vercel + vercel.json crons.
 */
export async function GET(request: NextRequest) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const supabase = createAdminClient()
  const now = Date.now()
  const inSevenDays = new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data: subs, error } = await supabase
    .from("subscriptions")
    .select("id, user_id, plan, ends_at, status")
    .eq("status", "active")
    .not("ends_at", "is", null)
    .lte("ends_at", inSevenDays)
    .gte("ends_at", new Date().toISOString())

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let notified = 0
  let emailed = 0

  for (const sub of subs ?? []) {
    const endsAt = new Date(sub.ends_at as string)
    const daysLeft = Math.ceil((endsAt.getTime() - now) / (1000 * 60 * 60 * 24))
    if (![7, 3, 1].includes(daysLeft)) continue

    const title = `Alliance expire dans ${daysLeft} jour(s)`
    const body = `Votre abonnement Alliance se termine le ${endsAt.toLocaleDateString("fr-FR")}. Renouvelez depuis /billing pour continuer sans interruption.`

    const { data: existing } = await supabase
      .from("notifications")
      .select("id")
      .eq("user_id", sub.user_id)
      .eq("title", title)
      .gte("created_at", new Date(now - 36 * 60 * 60 * 1000).toISOString())
      .limit(1)

    if (existing && existing.length > 0) continue

    await supabase.from("notifications").insert({
      user_id: sub.user_id,
      title,
      body,
      is_read: false,
    })
    notified++

    const { data: authUser } = await supabase.auth.admin.getUserById(
      sub.user_id as string
    )
    const user = authUser?.user
    const email = user?.email
    if (email && user) {
      const firstName =
        (user.user_metadata?.first_name as string | undefined) || ""
      const appUrl = resolveAppUrlSync()
      const endsAtLabel = endsAt.toLocaleDateString("fr-FR")
      const mail = await sendEmailWithRetry({
        to: email,
        subject: `KELIAA — ${title}`,
        html: subscriptionReminderEmailHtml({
          firstName,
          appUrl,
          endsAtLabel,
        }),
      })
      if (("success" in mail && mail.success) || ("queued" in mail && mail.queued)) {
        emailed++
      }
    }
  }

  return NextResponse.json({
    ok: true,
    checked: subs?.length ?? 0,
    notified,
    emailed,
  })
}
