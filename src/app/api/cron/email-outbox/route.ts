import { NextRequest, NextResponse } from "next/server"
import { processEmailOutbox } from "@/lib/email/outbox"
import { captureError } from "@/lib/observability/report"
import { verifyCronSecret } from "@/lib/security/cronAuth"

/** Flush Resend outbox every few minutes (retry failed / deferred mail). */
export async function GET(request: NextRequest) {
  const denied = verifyCronSecret(request)
  if (denied) return denied

  try {
    const result = await processEmailOutbox(30)
    if (result.error) {
      captureError(result.error, { cron: "email-outbox" })
      return NextResponse.json(result, { status: 500 })
    }
    return NextResponse.json({ ok: true, ...result })
  } catch (e) {
    captureError(e, { cron: "email-outbox" })
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "outbox_failed" },
      { status: 500 }
    )
  }
}
