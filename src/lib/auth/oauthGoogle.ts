import { CHARTER_COOKIE } from "@/lib/auth/charterCookie"

export { CHARTER_COOKIE }

export function markCharterAcceptedClient() {
  if (typeof document === "undefined") return
  const domain =
    typeof window !== "undefined" &&
    (window.location.hostname === "keliaa.org" ||
      window.location.hostname.endsWith(".keliaa.org"))
      ? "; domain=.keliaa.org"
      : ""
  document.cookie = `${CHARTER_COOKIE}=1; path=/; max-age=7200; SameSite=Lax${domain}`
}

export function clearCharterCookieClient() {
  if (typeof document === "undefined") return
  document.cookie = `${CHARTER_COOKIE}=; path=/; max-age=0; SameSite=Lax`
  document.cookie = `${CHARTER_COOKIE}=; path=/; max-age=0; SameSite=Lax; domain=.keliaa.org`
}

/**
 * Canonique www avant Google — le code_verifier PKCE doit être écrit
 * sur le même host que le retour OAuth.
 */
export function ensureWwwBeforeOAuth(): boolean {
  if (typeof window === "undefined") return false
  if (window.location.hostname !== "keliaa.org") return false
  const dest = `https://www.keliaa.org${window.location.pathname}${window.location.search}`
  window.location.replace(dest)
  return true
}

/**
 * Starts Google OAuth (browser).
 * Échange côté serveur (/auth/callback) + cookies domaine .keliaa.org.
 */
export async function startGoogleOAuth(options?: {
  next?: string
  charterAccepted?: boolean
  /** true sur /register — pas sur /login */
  registrationIntent?: boolean
}): Promise<{ error?: string }> {
  try {
    if (ensureWwwBeforeOAuth()) {
      return {}
    }

    if (options?.registrationIntent || options?.charterAccepted) {
      const { assertRegistrationOpenAction } = await import(
        "@/app/actions/platformGate"
      )
      const gate = await assertRegistrationOpenAction()
      if (gate.error) return { error: gate.error }
    }

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
          "Google n’est pas disponible pour le moment. Utilisez l’inscription par e-mail.",
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
