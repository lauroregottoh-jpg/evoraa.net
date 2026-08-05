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
  return `${proto}://${host}`.replace(/\/$/, "")
}

function redirectWithCookies(
  url: string,
  cookieJar: Array<{ name: string; value: string; options?: Record<string, unknown> }>
) {
  const response = NextResponse.redirect(url)
  for (const c of cookieJar) {
    response.cookies.set(c.name, c.value, c.options as never)
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

  const supabase = createServerClient(
    resolveSupabaseUrl(),
    resolveSupabaseAnonKey(),
    {
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
            pendingCookies.push({ name, value, options: options as Record<string, unknown> })
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

    return redirectWithCookies(`${origin}${next}`, pendingCookies)
  }

  // Email confirmed on Supabase side but session cookie missing → login with clear message.
  const loginMsg = encodeURIComponent(
    authError
      ? `Lien invalide ou expiré (${authError}). Connectez-vous avec votre mot de passe : l’accès s’ouvre même sans le lien.`
      : "Email traité. Connectez-vous avec votre email et mot de passe pour ouvrir votre espace membre."
  )

  return redirectWithCookies(
    `${origin}/login?error=auth_callback&msg=${loginMsg}&confirmed=1`,
    pendingCookies
  )
}
