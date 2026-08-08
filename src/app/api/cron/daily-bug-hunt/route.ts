import { NextRequest, NextResponse } from "next/server"
import { verifyCronSecret } from "@/lib/security/cronAuth"
import { runDailyBugHunt } from "@/lib/ops/dailyBugHunt"
import { captureError } from "@/lib/observability/report"

/**
 * Chasse bugs quotidienne — auto-fix allowlist ops uniquement.
 * Fenêtre creuse (04:00 UTC) pour ne pas impacter l’UX.
 */
export async function GET(request: NextRequest) {
  const denied = verifyCronSecret(request)
  if (denied) return denied

  try {
    const report = await runDailyBugHunt()
    return NextResponse.json({
      ok: report.ok,
      fixed: report.fixed,
      needsHuman: report.needsHuman,
      findings: report.findings.length,
      report,
    })
  } catch (e) {
    captureError(e, { cron: "daily-bug-hunt" })
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "bug_hunt_failed" },
      { status: 500 }
    )
  }
}
