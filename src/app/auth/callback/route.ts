import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { EmailOtpType } from "@supabase/supabase-js"
import { resolveSupabaseAnonKey, resolveSupabaseUrl } from "@/lib/config/supabase"
import { ensureOAuthProfile } from "@/lib/auth/ensureOAuthProfile"
import { CHARTER_COOKIE } from "@/lib/auth/charterCookie"

function publicOrigin(request: Request): string {
  const url = new URL(request.url)
  const host = request.headers.get("x-forwarded-host") || url.host
  const proto = request.headers.get("x-forwarded-proto") || "https"
  if (host.includes("localhost") || host.startsWith("127.")) {
    return url.origin
  }
  // Canonique www pour cookies PKCE / session
  const bare = host.split(":")[0]
  if (bare === "keliaa.org") {
    return "https://www.keliaa.org"
  }
  return `${proto}://${host}`.replace(/\/$/, "")
}

function redirectWithCookies(
  url: string,
  cookieJar: Array<{ name: string; value: string; options?: Record<string, unknown> }>,
  requestHost?: string | null
) {
  const response = NextResponse.redirect(url)
  const host = (requestHost || "").split(":")[0]
  const domain =
    host === "keliaa.org" || host.endsWith(".keliaa.org")
      ? ".keliaa.org"
      : undefined
  for (const c of cookieJar) {
    const opts = {
      path: "/",
      sameSite: "lax" as const,
      secure:
        process.env.VERCEL_ENV === "production" ||
        process.env.NODE_ENV === "production",
      ...(domain ? { domain } : {}),
      ...(c.options || {}),
    }
    response.cookies.set(c.name, c.value, opts as never)
  }
  return response
}

/**
 * Callback Auth Supabase (confirmation email, reset, magic link).
 * Important : les cookies de session doivent être écrits sur la réponse
 * de redirection — sinon l’email confirme le compte mais l’espace membre
 * reste inaccessible.
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const { searchParams } = requestUrl
  const origin = publicOrigin(request)
  const code = searchParams.get("code")
  const token_hash = searchParams.get("token_hash")
  const typeRaw = searchParams.get("type")
  const type = (typeRaw as EmailOtpType | null) || null
  const nextParam = searchParams.get("next") || "/onboarding"
  const errorDescription = searchParams.get("error_description") || searchParams.get("error")

  // Hash tokens (#access_token) cannot be read here — hand off to client page.
  if (searchParams.get("hash_handoff") === "1" || errorDescription) {
    if (errorDescription) {
      return NextResponse.redirect(
        `${origin}/login?error=auth_callback&msg=${encodeURIComponent(errorDescription)}`
      )
    }
  }

  const cookieStore = await cookies()
  const pendingCookies: Array<{
    name: string
    value: string
    options?: Record<string, unknown>
  }> = []
  const requestHost =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    ""

  const hostBare = requestHost.split(":")[0]
  const authCookieDomain =
    hostBare === "keliaa.org" || hostBare.endsWith(".keliaa.org")
      ? ".keliaa.org"
      : undefined

  const supabase = createServerClient(
    resolveSupabaseUrl(),
    resolveSupabaseAnonKey(),
    {
      cookieOptions: {
        path: "/",
        sameSite: "lax",
        ...(authCookieDomain ? { domain: authCookieDomain } : {}),
      },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options)
            } catch {
              /* ignore in edge cases */
            }
            pendingCookies.push({
              name,
              value,
              options: options as Record<string, unknown>,
            })
          })
        },
      },
    }
  )

  let sessionOk = false
  let authError: string | null = null

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    sessionOk = !error
    if (error) {
      authError = error.message
      console.error("[auth/callback] exchangeCode", error.message)
    }
  } else if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    sessionOk = !error
    if (error) {
      authError = error.message
      console.error("[auth/callback] verifyOtp", error.message)
    }
  } else {
    // Already signed in (cookies present) — just route the member.
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) sessionOk = true
  }

  if (sessionOk) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    let next = nextParam.startsWith("/") ? nextParam : "/onboarding"

    if (user) {
      const cookieStoreAfter = await cookies()
      const charterAccepted =
        cookieStoreAfter.get(CHARTER_COOKIE)?.value === "1" ||
        user.user_metadata?.charter_accepted === true

      const isOAuth =
        Array.isArray(user.app_metadata?.providers) &&
        (user.app_metadata.providers as string[]).includes("google")

      try {
        if (isOAuth || charterAccepted) {
          await ensureOAuthProfile({
            user,
            charterAccepted: Boolean(charterAccepted),
            supabase,
          })
        } else {
          await supabase
            .from("profiles")
            .update({
              email_verified: true,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", user.id)
        }
      } catch {
        /* non-blocking */
      }

      if (next !== "/reset-password" && !next.startsWith("/reset-password")) {
        const { data: profile } = await supabase
          .from("profiles")
          .select(
            "completion_percentage, onboarding_status, first_name, last_name, gender, birth_date, city, church_attended"
          )
          .eq("user_id", user.id)
          .maybeSingle()

        const { profileNeedsOnboarding } = await import(
          "@/lib/auth/onboardingGate"
        )
        next = profileNeedsOnboarding(profile) ? "/onboarding" : "/dashboard"
      }

      // Clear one-shot charter cookie
      pendingCookies.push({
        name: CHARTER_COOKIE,
        value: "",
        options: { path: "/", maxAge: 0 },
      })
    }

    return redirectWithCookies(`${origin}${next}`, pendingCookies, requestHost)
  }

  // Session manquante (souvent PKCE www/apex) → message clair + inscription email OK
  const isPkce =
    !!authError &&
    /code verifier|pkce|flow state/i.test(authError)
  const loginMsg = encodeURIComponent(
    isPkce
      ? "Connexion Google interrompue (navigateur / site www). Réessayez depuis https://www.keliaa.org/register, ou créez votre compte par e-mail."
      : authError
        ? `Lien invalide ou expiré. Connectez-vous avec votre e-mail et mot de passe, ou réessayez Google depuis www.keliaa.org.`
        : "Email traité. Connectez-vous avec votre e-mail et mot de passe pour ouvrir votre espace membre."
  )

  return redirectWithCookies(
    `${origin}/login?error=auth_callback&msg=${loginMsg}&confirmed=1`,
    pendingCookies,
    requestHost
  )
}
