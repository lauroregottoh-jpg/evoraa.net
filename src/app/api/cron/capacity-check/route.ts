import { NextRequest, NextResponse } from "next/server"
import { verifyCronSecret } from "@/lib/security/cronAuth"
import { runCapacityCheck } from "@/lib/ops/capacityCheck"
import { captureError } from "@/lib/observability/report"

/** Contrôle capacité Free → alertes upgrade (quotidien). */
export async function GET(request: NextRequest) {
  const denied = verifyCronSecret(request)
  if (denied) return denied

  try {
    const snapshot = await runCapacityCheck()
    return NextResponse.json({ ok: true, worst: snapshot.worst, alerts: snapshot.alerts.length, snapshot })
  } catch (e) {
    captureError(e, { cron: "capacity-check" })
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "capacity_check_failed" },
      { status: 500 }
    )
  }
}
