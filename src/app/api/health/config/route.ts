import { NextResponse } from "next/server"
import { KELIAA_SUPABASE_URL, resolveSupabaseUrl } from "@/lib/config/supabase"
import { resolveLiveProvider, isDemoPaymentsEnv } from "@/lib/billing/provider"

/**
 * Diagnostic config — requires Authorization: Bearer CRON_SECRET (or HEALTH_CHECK_SECRET).
 * Returns 404 when unauthorized to avoid advertising the endpoint.
 * Never exposes secret values — only presence / mode flags.
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

  return NextResponse.json({
    ok: resolved.includes("supabase.co"),
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
    },
    ops: {
      hasCronSecret: Boolean(process.env.CRON_SECRET),
      hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      hasSentry: Boolean(process.env.SENTRY_DSN),
    },
  })
}
