import { NextResponse } from "next/server"
import { KELIAA_SUPABASE_URL, resolveSupabaseUrl } from "@/lib/config/supabase"

/**
 * Diagnostic config — requires Authorization: Bearer CRON_SECRET (or HEALTH_CHECK_SECRET).
 * Returns 404 when unauthorized to avoid advertising the endpoint.
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
  })
}
