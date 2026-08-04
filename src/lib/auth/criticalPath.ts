/**
 * CHEMIN CRITIQUE KELIAA — ne jamais bloquer inscription / connexion
 * pour une panne d’infra secondaire (rate-limit RPC, Resend, outbox…).
 *
 * Règles :
 * 1. Rate-limit login/register : fail-open (jamais failClosed).
 * 2. Les erreurs email (Resend) ne doivent jamais faire échouer la création de compte.
 * 3. redirect() Next.js doit remonter au client (ne pas swallow dans catch).
 * 4. Soft confirm / createUser admin : si service role KO → fallback signUp natif.
 */

export const AUTH_CRITICAL = {
  /** Toujours true : une panne rate-limit ne doit pas couper l’auth. */
  rateLimitFailOpen: true,
  registerLimitPerHour: 40,
  loginLimitPer15Min: 40,
} as const

/** Détecte l’exception interne de redirect() Next.js App Router. */
export function isNextRedirectError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false
  const digest = (error as { digest?: unknown }).digest
  return typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")
}
