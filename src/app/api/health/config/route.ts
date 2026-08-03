import { NextResponse } from "next/server"
import { KELIAA_SUPABASE_URL, resolveSupabaseUrl } from "@/lib/config/supabase"

/** Diagnostic public — aide à repérer une mauvaise config Vercel. */
export async function GET() {
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
      hint: "Utilisez https://evoraa-net.vercel.app (pas git-main-laurore)",
    },
  })
}
