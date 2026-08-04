import { NextRequest, NextResponse } from "next/server"
import { processEmailOutbox } from "@/lib/email/outbox"
import { captureError } from "@/lib/observability/report"

function authorizeCron(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const auth = request.headers.get("authorization")
  return auth === `Bearer ${secret}`
}

/** Flush Resend outbox every few minutes (retry failed / deferred mail). */
export async function GET(request: NextRequest) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

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
