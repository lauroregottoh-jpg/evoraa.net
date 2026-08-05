/**
 * CHEMIN CRITIQUE KELIAA — ne jamais bloquer inscription / connexion
 * pour une panne d’infra secondaire (rate-limit RPC, Resend, outbox…).
 *
 * ZONE GELÉE — voir docs/AUTH_FROZEN.md et .cursor/rules/auth-critical.mdc
 * Modification uniquement avec demande explicite « AUTH UNLOCK ».
 *
 * Règles :
 * 1. Rate-limit login/register : fail-open (jamais failClosed).
 * 2. Les erreurs email (Resend) ne doivent jamais faire échouer la création de compte.
 * 3. redirect() Next.js doit remonter au client (ne pas swallow dans catch).
 * 4. Soft confirm / createUser admin : si service role KO → fallback signUp natif.
 * 5. Google : redirect /auth/callback + cookies .keliaa.org + canonique www.
 */

/** Contrat figé — les tests smoke vérifient ces valeurs / implications dans le code. */
export const AUTH_CRITICAL = {
  /** Toujours true : une panne rate-limit ne doit pas couper l’auth. */
  rateLimitFailOpen: true,
  registerLimitPerHour: 40,
  loginLimitPer15Min: 40,
  /** Host canonique prod — PKCE / cookies. */
  canonicalHost: "www.keliaa.org",
  cookieDomain: ".keliaa.org",
  /** Retour OAuth Google (échange serveur). */
  oauthCallbackPath: "/auth/callback",
  /** Marqueur freeze — ne pas supprimer. */
  frozen: true,
  frozenDoc: "docs/AUTH_FROZEN.md",
} as const

/** Détecte l’exception interne de redirect() Next.js App Router. */
export function isNextRedirectError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false
  const e = error as { digest?: unknown; message?: unknown; name?: unknown }
  const digest = typeof e.digest === "string" ? e.digest : ""
  const message = typeof e.message === "string" ? e.message : ""
  if (digest.includes("NEXT_REDIRECT")) return true
  if (message.includes("NEXT_REDIRECT")) return true
  if (e.name === "RedirectError") return true
  return false
}
