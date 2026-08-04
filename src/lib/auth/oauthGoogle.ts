import { CHARTER_COOKIE } from "@/lib/auth/charterCookie"

export { CHARTER_COOKIE }

export function markCharterAcceptedClient() {
  if (typeof document === "undefined") return
  document.cookie = `${CHARTER_COOKIE}=1; path=/; max-age=7200; SameSite=Lax`
}

export function clearCharterCookieClient() {
  if (typeof document === "undefined") return
  document.cookie = `${CHARTER_COOKIE}=; path=/; max-age=0; SameSite=Lax`
}

/**
 * Starts Google OAuth (browser). Requires Google enabled in Supabase Auth providers.
 * Existing Google accounts sign in; new ones create a user + profile trigger.
 */
export async function startGoogleOAuth(options?: {
  next?: string
  /** Set true on registration path after charter. */
  charterAccepted?: boolean
}): Promise<{ error?: string }> {
  try {
    if (options?.charterAccepted) {
      markCharterAcceptedClient()
    }

    const { createClient } = await import("@/utils/supabase/client")
    const supabase = createClient()
    const origin = window.location.origin
    const next = options?.next?.startsWith("/") ? options.next : "/onboarding"
    const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "select_account",
        },
      },
    })

    if (error) {
      console.error("[oauth/google]", error.message)
      return {
        error:
          "Google n’est pas encore disponible. Utilisez l’inscription par e-mail, ou réessayez après configuration OAuth.",
      }
    }
    return {}
  } catch (e) {
    console.error("[oauth/google] fatal", e)
    return {
      error:
        "Impossible de démarrer Google. Réessayez, ou créez votre compte par e-mail.",
    }
  }
}
