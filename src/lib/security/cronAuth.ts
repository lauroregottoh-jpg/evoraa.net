/**
 * Auth Bearer pour routes cron / health — parity Evora (timing-safe).
 */
import { NextResponse, type NextRequest } from "next/server"
import { safeEqualString } from "@/lib/billing/webhookAuth"

/**
 * @returns `null` si OK, sinon une Response 401/500 à renvoyer.
 */
export function verifyCronSecret(req: NextRequest | Request): NextResponse | null {
  const secret = (process.env.CRON_SECRET ?? "").trim()
  if (!secret) {
    return NextResponse.json(
      {
        error: "CRON_NOT_CONFIGURED",
        message: "CRON_SECRET env var is required",
      },
      { status: 500 }
    )
  }

  const header = req.headers.get("authorization") || ""
  if (!header.startsWith("Bearer ")) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  const presented = header.slice("Bearer ".length).trim()
  if (!presented || !safeEqualString(presented, secret)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  return null
}

/** Health : accepte HEALTH_CHECK_SECRET ou CRON_SECRET (timing-safe). 404 si KO. */
export function verifyHealthSecret(req: Request): boolean {
  const secret =
    process.env.HEALTH_CHECK_SECRET?.trim() || process.env.CRON_SECRET?.trim()
  if (!secret) return false
  const header = req.headers.get("authorization") || ""
  if (!header.startsWith("Bearer ")) return false
  const presented = header.slice("Bearer ".length).trim()
  return Boolean(presented) && safeEqualString(presented, secret)
}
