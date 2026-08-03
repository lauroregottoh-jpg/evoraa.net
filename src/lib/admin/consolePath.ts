/**
 * Chemin secret du panneau opérationnel.
 * Ne pas le publier dans la nav membre / marketing.
 */
export const OPS_CONSOLE_PATH = "/ops-keliaa-hx7" as const

/** Ancien chemin public — doit rester fermé (404). */
export const LEGACY_ADMIN_PATH = "/admin" as const

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
  return role === "admin" || role === "moderator" || role === "editor" || role === "coach"
}

export function isFullAdmin(role: string | null | undefined): boolean {
  return role === "admin"
}
