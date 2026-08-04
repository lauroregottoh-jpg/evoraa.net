import { createAdminClient } from "@/utils/supabase/admin"
import { sendResendEmail } from "@/lib/email/send"
import { captureError } from "@/lib/observability/report"

export async function enqueueEmail(input: {
  to: string
  subject: string
  html: string
  replyTo?: string
  delaySeconds?: number
}): Promise<{ queued: true } | { error: string }> {
  try {
    const admin = createAdminClient()
    const sendAfter = new Date(
      Date.now() + Math.max(0, input.delaySeconds ?? 0) * 1000
    ).toISOString()
    const { error } = await admin.from("email_outbox").insert({
      to_email: input.to,
      subject: input.subject,
      html: input.html,
      reply_to: input.replyTo || null,
      status: "pending",
      send_after: sendAfter,
    })
    if (error) return { error: error.message }
    return { queued: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "queue_failed" }
  }
}

/** Try Resend immediately; on failure queue for retry. */
export async function sendEmailWithRetry(input: {
  to: string
  subject: string
  html: string
  replyTo?: string
}): Promise<{ success?: true; queued?: true; skipped?: true; error?: string }> {
  const result = await sendResendEmail(input)
  if ("success" in result && result.success) return { success: true }
  if ("skipped" in result && result.skipped) return { skipped: true }

  const queued = await enqueueEmail({
    ...input,
    delaySeconds: 60,
  })
  if ("queued" in queued) return { queued: true }
  captureError(result.error || queued.error || "email_send_failed", {
    to: input.to,
    subject: input.subject,
  })
  return { error: queued.error || "email_failed" }
}

export async function processEmailOutbox(limit = 25): Promise<{
  processed: number
  sent: number
  failed: number
  error?: string
}> {
  try {
    const admin = createAdminClient()
    const now = new Date().toISOString()
    const { data: rows, error } = await admin
      .from("email_outbox")
      .select("id, to_email, subject, html, reply_to, attempts")
      .eq("status", "pending")
      .lte("send_after", now)
      .order("created_at", { ascending: true })
      .limit(limit)

    if (error) return { processed: 0, sent: 0, failed: 0, error: error.message }

    let sent = 0
    let failed = 0
    for (const row of rows ?? []) {
      const result = await sendResendEmail({
        to: row.to_email,
        subject: row.subject,
        html: row.html,
        replyTo: row.reply_to || undefined,
      })
      const attempts = Number(row.attempts ?? 0) + 1
      if ("success" in result && result.success) {
        await admin
          .from("email_outbox")
          .update({
            status: "sent",
            attempts,
            updated_at: new Date().toISOString(),
            last_error: null,
          })
          .eq("id", row.id)
        sent += 1
      } else {
        const giveUp = attempts >= 5
        await admin
          .from("email_outbox")
          .update({
            status: giveUp ? "failed" : "pending",
            attempts,
            last_error:
              ("error" in result && result.error) ||
              ("reason" in result && result.reason) ||
              "send_failed",
            send_after: new Date(Date.now() + attempts * 2 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", row.id)
        failed += 1
      }
    }
    return { processed: (rows ?? []).length, sent, failed }
  } catch (e) {
    return {
      processed: 0,
      sent: 0,
      failed: 0,
      error: e instanceof Error ? e.message : "outbox_failed",
    }
  }
}
