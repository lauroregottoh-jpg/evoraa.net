/**
 * KELYA COUPLE™ — configuration centralisée (pas de valeurs magiques éparpillées).
 */

export const COUPLE_BRAND = "KELYA COUPLE™" as const
export const COUPLE_TAGLINE =
  "Bilan de Compatibilité & Dynamique du Couple" as const
export const COUPLE_PROMISE =
  "Comprenez ce qui vous rapproche, ce qui vous différencie et ce que vous pouvez construire ensemble." as const

/** Accès interactif après achat (jours). Téléchargement local reste possible après expiration. */
export const COUPLE_ACCESS_DAYS = 365

/** Validité invitation (jours). */
export const COUPLE_INVITE_DAYS = 30

export const COUPLE_QUESTIONNAIRE_VERSION = "1.0.0"
export const COUPLE_SCORING_VERSION = "1.0.0"
export const COUPLE_CONTENT_VERSION = "1.0.0"
export const COUPLE_REPORT_VERSION = "1.0.0"

/** Feature flag — désactiver pour masquer le module en prod sans rollback. */
export function isCoupleFeatureEnabled(): boolean {
  const raw = process.env.COUPLE_FEATURE_ENABLED
  if (raw === "false" || raw === "0") return false
  return true
}

export type CoupleStatus =
  | "CREATED"
  | "INVITATION_PENDING"
  | "PARTNER_JOINED"
  | "QUESTIONNAIRES_IN_PROGRESS"
  | "BOTH_COMPLETED"
  | "ANALYSIS_RUNNING"
  | "RESULTS_READY"
  | "REPORT_READY"
  | "ACCESS_EXPIRING"
  | "ACCESS_EXPIRED"
  | "CANCELLED"

export type InviteStatus = "ACTIVE" | "USED" | "EXPIRED" | "REVOKED"

export type QuestionnaireParticipantStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"

export type ReportStatus = "PENDING" | "GENERATING" | "READY" | "FAILED"
