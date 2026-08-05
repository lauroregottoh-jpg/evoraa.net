import { createBrowserClient } from "@supabase/ssr"
import { resolveSupabaseAnonKey, resolveSupabaseUrl } from "@/lib/config/supabase"

function cookieDomain(): string | undefined {
  if (typeof window === "undefined") return undefined
  const host = window.location.hostname
  if (host === "keliaa.org" || host.endsWith(".keliaa.org")) {
    return ".keliaa.org"
  }
  return undefined
}

export function createClient() {
  const domain = cookieDomain()
  return createBrowserClient(
    resolveSupabaseUrl(),
    resolveSupabaseAnonKey(),
    {
      cookieOptions: {
        path: "/",
        sameSite: "lax",
        ...(domain ? { domain } : {}),
      },
    }
  )
}
