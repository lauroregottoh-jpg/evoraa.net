/**
 * Rappels automatiques portés par Eva (in-app notifications).
 * Fail-safe : titres stables pour dédup ; pas d’e-mail (0 Resend).
 */

export type EvaReminderKind =
  | "missing_fields"
  | "missing_photo"
  | "missing_tests"
  | "pending_review"

export type EvaReminder = {
  kind: EvaReminderKind
  /** Titre stable — utilisé pour anti-doublon 3 jours */
  title: string
  body: string
  /** Lien suggéré (stocké uniquement dans le body / UI membre) */
  href: string
}

const TITLE_PREFIX = "Eva ·"

export function evaReminderTitle(kind: EvaReminderKind): string {
  switch (kind) {
    case "missing_fields":
      return `${TITLE_PREFIX} Complétez votre fiche`
    case "missing_photo":
      return `${TITLE_PREFIX} Ajoutez votre photo`
    case "missing_tests":
      return `${TITLE_PREFIX} Finissez vos questionnaires`
    case "pending_review":
      return `${TITLE_PREFIX} Votre profil est en revue`
  }
}

export function buildEvaReminders(input: {
  firstName?: string | null
  missingFields: string[]
  hasAvatar: boolean
  pillarsCompleted: number
  pillarsTotal?: number
  moderationStatus?: string | null
}): EvaReminder[] {
  const name = (input.firstName || "").trim()
  const hello = name ? `${name}, ` : ""
  const total = input.pillarsTotal ?? 5
  const out: EvaReminder[] = []

  if (input.missingFields.length > 0) {
    out.push({
      kind: "missing_fields",
      title: evaReminderTitle("missing_fields"),
      href: "/profile",
      body: `${hello}il manque encore : ${input.missingFields.join(", ")}. Plus votre fiche est claire, plus le matching peut vous proposer des parcours sérieux. → /profile`,
    })
  } else if (!input.hasAvatar) {
    out.push({
      kind: "missing_photo",
      title: evaReminderTitle("missing_photo"),
      href: "/profile",
      body: `${hello}sans photo nette, vous restez difficile à découvrir. Ajoutez un portrait clair et respectueux — ça change tout. → /profile`,
    })
  }

  if (input.pillarsCompleted < total) {
    out.push({
      kind: "missing_tests",
      title: evaReminderTitle("missing_tests"),
      href: "/assessments",
      body: `${hello}vous en êtes à ${input.pillarsCompleted}/${total} questionnaires. Sans les 5, le Matching ne peut pas bien vous lire. Reprenez quand vous voulez — je suis là. → /assessments`,
    })
  }

  if (
    input.moderationStatus === "pending" &&
    input.missingFields.length === 0 &&
    input.hasAvatar
  ) {
    out.push({
      kind: "pending_review",
      title: evaReminderTitle("pending_review"),
      href: "/dashboard",
      body: `${hello}votre profil est bien reçu et en revue par l’équipe. Patience : on revient vers vous. En attendant, vous pouvez peaufiner vos questionnaires.`,
    })
  }

  return out
}

/** Heuristique : un seul rappel “prioritaire” par passage cron (évite spam). */
export function pickPrimaryEvaReminder(reminders: EvaReminder[]): EvaReminder | null {
  const order: EvaReminderKind[] = [
    "missing_fields",
    "missing_tests",
    "missing_photo",
    "pending_review",
  ]
  for (const kind of order) {
    const hit = reminders.find((r) => r.kind === kind)
    if (hit) return hit
  }
  return null
}
