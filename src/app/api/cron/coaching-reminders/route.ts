import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { enqueueEmail } from "@/lib/email/outbox"
import { coachingSessionReminderEmailHtml } from "@/lib/email/templates"
import { resolveAppUrlSync } from "@/lib/auth/appUrl"
import { verifyCronSecret } from "@/lib/security/cronAuth"
import { getAuthEmailsBatch } from "@/lib/auth/authEmailsBatch"

/**
 * Cron — filet de sécurité rappels coaching (si délai outbox manqué).
 * Fenêtres : ~24 h et ~1 h avant scheduled_start.
 */
export async function GET(request: NextRequest) {
  const denied = verifyCronSecret(request)
  if (denied) return denied

  const supabase = createAdminClient()
  const now = Date.now()
  const in25h = new Date(now + 25 * 60 * 60 * 1000).toISOString()
  const sessionUrl = `${resolveAppUrlSync()}/coaching/session`

  const { data: bookings, error } = await supabase
    .from("coaching_bookings")
    .select(
      "id, user_id, scheduled_start, coaches(display_name), coaching_sessions(id, status)"
    )
    .eq("status", "SCHEDULED")
    .gte("scheduled_start", new Date().toISOString())
    .lte("scheduled_start", in25h)
    .limit(80)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const userIds = [...new Set((bookings || []).map((b) => b.user_id as string))]
  const emailByUser = await getAuthEmailsBatch(supabase, userIds)

  let queued = 0

  for (const b of bookings || []) {
    const start = new Date(b.scheduled_start as string).getTime()
    const hours = (start - now) / (60 * 60 * 1000)
    let urgency: "24h" | "1h" | null = null
    if (hours > 0.5 && hours <= 1.25) urgency = "1h"
    else if (hours > 20 && hours <= 25) urgency = "24h"
    if (!urgency) continue

    const sessions = b.coaching_sessions as
      | Array<{ id: string; status: string }>
      | { id: string; status: string }
      | null
    const sess = Array.isArray(sessions) ? sessions[0] : sessions
    if (!sess || ["COMPLETED", "CANCELLED"].includes(sess.status)) continue

    const auth = emailByUser.get(b.user_id as string)
    if (!auth?.email) continue

    const coachRel = b.coaches as
      | { display_name: string }
      | { display_name: string }[]
      | null
    const coach = Array.isArray(coachRel) ? coachRel[0] : coachRel
    const coachName = coach?.display_name || "votre coach"
    const whenLabel = new Date(b.scheduled_start as string).toLocaleString(
      "fr-FR",
      {
        weekday: "long",
        day: "2-digit",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      }
    )

    const subject =
      urgency === "1h"
        ? `KELIAA · Votre séance avec ${coachName} commence bientôt`
        : `KELIAA · Rappel séance demain avec ${coachName}`

    const since = new Date(now - 20 * 60 * 60 * 1000).toISOString()
    const { count } = await supabase
      .from("email_outbox")
      .select("id", { count: "exact", head: true })
      .eq("to_email", auth.email)
      .eq("subject", subject)
      .gte("created_at", since)

    if ((count ?? 0) > 0) continue

    const res = await enqueueEmail({
      to: auth.email,
      subject,
      html: coachingSessionReminderEmailHtml({
        firstName: auth.firstName || "",
        coachName,
        whenLabel,
        urgency,
        sessionUrl,
      }),
    })
    if ("queued" in res) queued += 1
  }

  return NextResponse.json({ ok: true, queued })
}
