/**
 * Accès anticipé coaching — cadenas pour les autres membres
 * (même logique d’aperçu verrouillé que le Rapport / Couple).
 */

import { isOpsAdminEmail } from "@/lib/admin/consolePath"

/** Sarah GANDE — coach de test. */
export const COACHING_BETA_EMAILS = [
  "loreline.solis@gmail.com",
] as const

export function isCoachingBetaEmail(
  email: string | null | undefined
): boolean {
  if (!email) return false
  const e = email.trim().toLowerCase()
  if (isOpsAdminEmail(e)) return true
  return (COACHING_BETA_EMAILS as readonly string[]).includes(e)
}

export function canUseCoachingLive(input: {
  email?: string | null
  role?: string | null
}): boolean {
  if (isCoachingBetaEmail(input.email)) return true
  const role = String(input.role || "")
    .trim()
    .toLowerCase()
  return role === "admin" || role === "coach"
}
