import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import { resolveSupabaseAnonKey, resolveSupabaseUrl } from "@/lib/config/supabase"

function cookieDomainFromHost(host: string | null): string | undefined {
  if (!host) return undefined
  const h = host.split(":")[0]
  if (h === "keliaa.org" || h.endsWith(".keliaa.org")) {
    return ".keliaa.org"
  }
  return undefined
}

export async function createClient() {
  const cookieStore = await cookies()
  // Sur Vercel, les headers host ne sont pas toujours dispo ici :
  // on force le domaine partagé en prod keliaa (hors localhost).
  const isProdKeliaa =
    process.env.NEXT_PUBLIC_SITE_URL?.includes("keliaa.org") ||
    process.env.VERCEL_ENV === "production"
  const cookieOptions = isProdKeliaa
    ? resolveAuthCookieDomain("www.keliaa.org")
    : resolveAuthCookieDomain(null)

  return createServerClient(
    resolveSupabaseUrl(),
    resolveSupabaseAnonKey(),
    {
      cookieOptions,
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, {
                ...options,
                ...cookieOptions,
              })
            )
          } catch {
            // Server Component — ignore
          }
        },
      },
    }
  )
}

/** Cookie domain partagé www / apex pour PKCE OAuth. */
export function resolveAuthCookieDomain(
  hostHeader: string | null
): CookieOptions {
  const domain = cookieDomainFromHost(hostHeader)
  return {
    path: "/",
    sameSite: "lax",
    ...(domain ? { domain } : {}),
  }
}
