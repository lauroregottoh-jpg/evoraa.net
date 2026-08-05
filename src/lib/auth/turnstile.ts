/**
 * Cloudflare Turnstile — optionnel.
 * Si NEXT_PUBLIC_TURNSTILE_SITE_KEY + TURNSTILE_SECRET_KEY absents → skip (ne bloque pas).
 */

export function turnstileConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() &&
      process.env.TURNSTILE_SECRET_KEY?.trim()
  )
}

export async function verifyTurnstileToken(
  token: string | null | undefined,
  ip?: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!turnstileConfigured()) return { ok: true }
  if (!token || token.length < 10) {
    return {
      ok: false,
      error: "Vérification anti-robot requise. Rechargez la page et réessayez.",
    }
  }

  try {
    const body = new URLSearchParams()
    body.set("secret", process.env.TURNSTILE_SECRET_KEY!.trim())
    body.set("response", token)
    if (ip && ip !== "unknown") body.set("remoteip", ip)

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        signal: AbortSignal.timeout(4000),
      }
    )
    const data = (await res.json()) as { success?: boolean }
    if (!data.success) {
      return {
        ok: false,
        error: "Vérification anti-robot échouée. Réessayez.",
      }
    }
    return { ok: true }
  } catch {
    // Fail-open : panne Turnstile ne doit pas couper les inscriptions
    return { ok: true }
  }
}
