import { NextRequest, NextResponse } from "next/server"
import { verifyCronSecret } from "@/lib/security/cronAuth"
import { runDailyOpsDigest } from "@/lib/ops/dailyOpsDigest"
import { captureError } from "@/lib/observability/report"

/**
 * Rapport ops fin de journée (20:00 UTC ≈ soirée Afrique de l’Ouest).
 * Email → CONTACT_INBOX_EMAIL / OPS_ALERT_EMAIL.
 */
export async function GET(request: NextRequest) {
  const denied = verifyCronSecret(request)
  if (denied) return denied

  try {
    const result = await runDailyOpsDigest()
    return NextResponse.json({
      ok: result.ok,
      emailed: result.emailed,
      dayKey: result.digest.dayKey,
      totals: result.digest.totals,
    })
  } catch (e) {
    captureError(e, { cron: "daily-ops-digest" })
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "digest_failed" },
      { status: 500 }
    )
  }
}
