import { NextResponse } from "next/server"
import { KELIAA_SUPABASE_URL, resolveSupabaseUrl } from "@/lib/config/supabase"
import { resolveLiveProvider, isDemoPaymentsEnv } from "@/lib/billing/provider"

/**
 * Diagnostic config + readiness DB.
 * Auth : Authorization: Bearer CRON_SECRET | HEALTH_CHECK_SECRET
 * 404 si non autorisé (ne pas exposer l’endpoint).
 *
 * ?probe=1 → inclut ping Auth Supabase (readyz).
 */
export async function GET(request: Request) {
  const secret =
    process.env.HEALTH_CHECK_SECRET?.trim() || process.env.CRON_SECRET?.trim()
  const auth = request.headers.get("authorization") || ""
  if (!secret || auth !== `Bearer ${secret}`) {
    return new NextResponse(null, { status: 404 })
  }

  const configured = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  const resolved = resolveSupabaseUrl()
  const apiKey = process.env.BICTORYS_API_KEY || ""
  const url = new URL(request.url)
  const wantProbe = url.searchParams.get("probe") === "1"

  let ready: { ok: boolean; latencyMs?: number; error?: string } | null = null
  if (wantProbe) {
    const started = Date.now()
    try {
      const res = await fetch(`${resolved.replace(/\/$/, "")}/auth/v1/health`, {
        method: "GET",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
        },
        signal: AbortSignal.timeout(5000),
      })
      ready = {
        ok: res.ok,
        latencyMs: Date.now() - started,
        error: res.ok ? undefined : `status_${res.status}`,
      }
    } catch (e) {
      ready = {
        ok: false,
        latencyMs: Date.now() - started,
        error: e instanceof Error ? e.message : "probe_failed",
      }
    }
  }

  return NextResponse.json({
    ok: resolved.includes("supabase.co"),
    ready: ready ?? undefined,
    supabase: {
      configured: configured ? configured.replace(/\/$/, "") : null,
      resolved: resolved.replace(/\/$/, ""),
      expected: KELIAA_SUPABASE_URL,
      misconfigured: Boolean(configured && configured !== resolved),
    },
    app: {
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? null,
      VERCEL_URL: process.env.VERCEL_URL ?? null,
    },
    payments: {
      provider: resolveLiveProvider(),
      demoMode: isDemoPaymentsEnv(),
      hasBictorysApiKey: Boolean(apiKey),
      hasBictorysWebhookSecret: Boolean(process.env.BICTORYS_WEBHOOK_SECRET),
      bictorysSandbox: apiKey.startsWith("test_"),
      bictorysMerchantCountry: process.env.BICTORYS_MERCHANT_COUNTRY || "TG",
      hasCinetPay: Boolean(
        process.env.CINETPAY_API_KEY && process.env.CINETPAY_SITE_ID
      ),
      webhookUrlHint: `${(process.env.NEXT_PUBLIC_APP_URL || "https://www.keliaa.org").replace(/\/$/, "")}/api/payments/bictorys/notify`,
    },
    email: {
      hasResend: Boolean(process.env.RESEND_API_KEY),
      outboxFailed:
        wantProbe
          ? await (async () => {
              try {
                const { countFailedEmailOutbox } = await import(
                  "@/lib/email/outbox"
                )
                return await countFailedEmailOutbox()
              } catch {
                return null
              }
            })()
          : undefined,
    },
    killSwitches: wantProbe
      ? await (async () => {
          try {
            const { getKillSwitches } = await import(
              "@/lib/platform/killSwitches"
            )
            return await getKillSwitches()
          } catch {
            return null
          }
        })()
      : undefined,
    ops: {
      hasCronSecret: Boolean(process.env.CRON_SECRET),
      hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      hasSentry: Boolean(process.env.SENTRY_DSN),
    },
  })
}
