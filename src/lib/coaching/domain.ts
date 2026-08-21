/**
 * Domaine coaching — crédits, code coach, sessions (timer serveur).
 * 1 crédit = 30 min affichées · budget serveur = 40 min (+ prep 5 min avant live).
 * Produit positionné audio (pas visio). Transcription = ops only.
 */

export const COACHING_CREDIT_DISPLAY_MINUTES = 30
export const COACHING_CREDIT_ALLOCATED_SECONDS = 40 * 60
export const COACHING_PREP_SECONDS = 5 * 60

export type CoachingSessionStatus =
  | "WAITING"
  | "PREP"
  | "CONNECTING"
  | "ACTIVE"
  | "GRACE_PERIOD"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW_CLIENT"
  | "NO_SHOW_COACH"
  | "FAILED"

export function normalizeCoachCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "")
}

export function creditsFromPackSessions(
  sessions: number,
  minutesPerSession: 30 | 60
): number {
  // 1 crédit = 30 min ; une séance 60 min = 2 crédits
  return sessions * (minutesPerSession / 30)
}

export const COACHING_RATING_PROMPTS = {
  client: [
    {
      id: "clarity",
      label: "Le coach m’a aidé(e) à y voir plus clair",
    },
    {
      id: "listening",
      label: "Je me suis senti(e) écouté(e) et respecté(e)",
    },
    {
      id: "practical",
      label: "J’ai reçu des pistes concrètes à appliquer",
    },
    {
      id: "followup",
      label: "Je suis ouvert(e) à une prochaine séance / un suivi",
    },
  ],
  coach: [
    {
      id: "engagement",
      label: "Le client s’est engagé dans la séance",
    },
    {
      id: "openness",
      label: "Le client était ouvert à la réflexion",
    },
    {
      id: "followup",
      label: "Un suivi / prochaine étape me semble utile",
    },
  ],
} as const

/** Canevas rapport coach — 4 points de rédaction. */
export const COACHING_REPORT_FIELDS = [
  {
    id: "deroulement",
    label: "Déroulement de la séance",
    hint: "Comment ça s’est passé ? Climat, rythme, engagement.",
  },
  {
    id: "avancees",
    label: "Points abordés & avancées",
    hint: "Ce qui a été dit, prises de conscience, progrès.",
  },
  {
    id: "travail",
    label: "Ce sur quoi le client doit travailler",
    hint: "Axes prioritaires entre deux séances.",
  },
  {
    id: "recommandations",
    label: "Recommandations",
    hint: "Pistes concrètes, exercices, prochaine étape.",
  },
] as const

/** Durée minimale (ms) pour valider une séance complète = minutes affichées. */
export function requiredSessionDurationMs(displayedMinutes: number): number {
  const mins = Math.max(30, Math.round(Number(displayedMinutes) || 30))
  return mins * 60 * 1000
}