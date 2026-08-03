/**
 * Chemin secret du panneau opérationnel.
 * Ne pas le publier dans la nav marketing.
 */
export const OPS_CONSOLE_PATH = "/ops-keliaa-hx7" as const

/** Ancien chemin public — doit rester fermé (404). */
export const LEGACY_ADMIN_PATH = "/admin" as const

/**
 * Emails toujours traités comme admin.
 * Surcharge : OPS_ADMIN_EMAILS=a@x.com,b@y.com
 */
const DEFAULT_OPS_ADMIN_EMAILS = ["lauroregottoh@gmail.com"]

export function getOpsAdminEmails(): string[] {
  const fromEnv = (process.env.OPS_ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
  return [...new Set([...DEFAULT_OPS_ADMIN_EMAILS, ...fromEnv])]
}

export function isOpsAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return getOpsAdminEmails().includes(email.trim().toLowerCase())
}

/** Extrait l'email même si `user.email` est vide en Edge. */
export function resolveAuthEmail(user: {
  email?: string | null
  user_metadata?: Record<string, unknown> | null
  identities?: Array<{ identity_data?: Record<string, unknown> | null }> | null
} | null | undefined): string | null {
  if (!user) return null
  const metaEmail = user.user_metadata?.email
  const identityEmail = user.identities?.[0]?.identity_data?.email
  const raw =
    user.email ||
    (typeof metaEmail === "string" ? metaEmail : null) ||
    (typeof identityEmail === "string" ? identityEmail : null) ||
    ""
  const email = raw.trim().toLowerCase()
  return email || null
}

export const STAFF_ROLES = [
  "admin",
  "moderator",
  "editor",
  "coach",
  "member",
] as const

export type StaffRole = (typeof STAFF_ROLES)[number]

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  admin: "Administrateur principal",
  moderator: "Modérateur",
  editor: "Éditeur / publications",
  coach: "Coach",
  member: "Membre",
}

export const STAFF_ROLE_DESCRIPTION: Record<StaffRole, string> = {
  admin: "Accès complet au panneau, équipe, paiements, paramètres.",
  moderator: "Photos, signalements, sanctions, validation de profils.",
  editor: "Contenus, marketing, Académie (édition), notes CMS.",
  coach: "Vue coaching / orientation membres (lecture + notes).",
  member: "Aucun accès au panneau.",
}

export function isStaffRole(role: string | null | undefined): boolean {
  const r = String(role || "")
    .trim()
    .toLowerCase()
  return r === "admin" || r === "moderator" || r === "editor" || r === "coach"
}

export function isFullAdmin(role: string | null | undefined): boolean {
  return (
    String(role || "")
      .trim()
      .toLowerCase() === "admin"
  )
}

export function canAccessOpsConsole(input: {
  role?: string | null
  email?: string | null
}): boolean {
  if (isOpsAdminEmail(input.email)) return true
  return isStaffRole(input.role)
}

export function canFullAdminOps(input: {
  role?: string | null
  email?: string | null
}): boolean {
  if (isOpsAdminEmail(input.email)) return true
  return isFullAdmin(input.role)
}

/** next= interne sûr après login. */
export function sanitizeNextPath(next: string | null | undefined): string | null {
  if (!next) return null
  const n = next.trim()
  if (!n.startsWith("/") || n.startsWith("//") || n.includes("://")) return null
  if (n.length > 200) return null
  return n
}
