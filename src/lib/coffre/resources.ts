/**
 * Catalogue Le Coffre Premium — ajouter une ressource ici suffit.
 * PDFs source : docs/COFFRE PREMIUM/
 *
 * Champs :
 * - unlockOrder : ordre d’affichage / priorité de suggestion
 * - premiumOnly : toujours true pour le coffre exclusif
 * - fileName : nom exact du fichier dans docs/COFFRE PREMIUM/
 */

export type CoffreCategory =
  | "guide"
  | "journal"
  | "priere"
  | "exercice"
  | "affirmations"
  | "lettre"
  | "fiche"
  | "checklist"

export type CoffreResource = {
  id: string
  title: string
  description: string
  category: CoffreCategory
  /** Couverture optionnelle (chemin public). Sinon couverture générée. */
  coverImage?: string
  /** Nom exact du PDF dans docs/COFFRE PREMIUM/ */
  fileName: string
  unlockOrder: number
  premiumOnly: boolean
}

export const COFFRE_CATEGORY_META: Record<
  CoffreCategory,
  { label: string; tone: string; ink: string }
> = {
  guide: {
    label: "Guide",
    tone: "#5C1F28",
    ink: "#F8F4EE",
  },
  journal: {
    label: "Journal",
    tone: "#3D4A3A",
    ink: "#F3EFE8",
  },
  priere: {
    label: "Prière",
    tone: "#4A3F2A",
    ink: "#F8F4EE",
  },
  exercice: {
    label: "Exercice",
    tone: "#6B3A2A",
    ink: "#F8F4EE",
  },
  affirmations: {
    label: "Affirmations",
    tone: "#B8954A",
    ink: "#1C1412",
  },
  lettre: {
    label: "Lettre",
    tone: "#7A4050",
    ink: "#F8F4EE",
  },
  fiche: {
    label: "Fiche",
    tone: "#2F3D4A",
    ink: "#F3EFE8",
  },
  checklist: {
    label: "Check-list",
    tone: "#4A5540",
    ink: "#F8F4EE",
  },
}

/**
 * Bibliothèque active. Pour en ajouter une :
 * 1. Déposer le PDF dans docs/COFFRE PREMIUM/
 * 2. Ajouter une entrée ci-dessous (id unique + unlockOrder)
 */
export const COFFRE_RESOURCES: CoffreResource[] = [
  {
    id: "journal-preparation",
    title: "Mon journal de préparation au mariage",
    description:
      "Un espace guidé pour clarifier vos intentions, vos peurs et vos rêves avant l’alliance.",
    category: "journal",
    fileName: "MON JOURNAL DE PREPARATION AU MARIAGE - LAURORE GOTTOH.pdf",
    unlockOrder: 1,
    premiumOnly: true,
  },
  {
    id: "14-questions-conjoint",
    title: "14 questions sur le choix du conjoint",
    description:
      "Des questions profondes pour discerner avec lucidité, sans précipitation ni illusion.",
    category: "guide",
    fileName: "14 QUESTIONS SUR LE CHOIX DU CONJOINT - LAURORE GOTTOH.pdf",
    unlockOrder: 2,
    premiumOnly: true,
  },
  {
    id: "12-erreurs-mariage",
    title: "12 erreurs qui peuvent détruire ton futur mariage",
    description:
      "Les pièges fréquents à connaître tôt — pour construire sur des fondations solides.",
    category: "guide",
    fileName: "12 ERREURS QUI PEUVENT DETRUIRE TON FUTURE MARIAGE - LAURORE GOTTOH.pdf",
    unlockOrder: 3,
    premiumOnly: true,
  },
  {
    id: "160-points-priere",
    title: "160 points de prière pour ton futur (ou actuel) couple",
    description:
      "Un plan de prière concret pour couvrir votre relation, votre foyer et votre vocation.",
    category: "priere",
    fileName:
      "160 POINTS DE PRIÈRE POUR TON FUTUR - ACTUEL COUPLE - LAURORE GOTTOH.pdf",
    unlockOrder: 4,
    premiumOnly: true,
  },
  {
    id: "50-affirmations",
    title: "50 affirmations pour reprogrammer ton identité",
    description:
      "Des affirmations ancrées pour renforcer une identité saine avant (et dans) le couple.",
    category: "affirmations",
    fileName: "50-AFFIRMATIONS-POUR-REPROGRAMMER-TON-IDENTITE.pdf.pdf",
    unlockOrder: 5,
    premiumOnly: true,
  },
  {
    id: "7-jours-pardon",
    title: "7 jours pour valider si tu as vraiment pardonné",
    description:
      "Un parcours court et honnête pour mesurer la réalité de votre pardon — pas seulement l’intention.",
    category: "exercice",
    fileName: "7 JOURS POUR VALIDER SI TU AS VRAIMENT PARDONNÉ - LAURORE GOTTOH.pdf",
    unlockOrder: 6,
    premiumOnly: true,
  },
  {
    id: "exercice-amour-soi",
    title: "Exercice pour renforcer l’amour de soi",
    description:
      "Une pratique concrète pour vous aimer sainement — condition d’un amour durable à deux.",
    category: "exercice",
    fileName: "EXERCICE POUR RENFORCER L’AMOUR DE SOI.pdf.pdf",
    unlockOrder: 7,
    premiumOnly: true,
  },
  {
    id: "lettre-guerison",
    title: "Lettre de guérison",
    description:
      "Un écrit thérapeutique pour déposer blessures, colères et libérations avant d’avancer.",
    category: "lettre",
    fileName: "LETTRE DE GUERISON - LAURORE GOTTOH.pdf",
    unlockOrder: 8,
    premiumOnly: true,
  },
  {
    id: "passer-a-laction",
    title: "Passer à l’action malgré la procrastination",
    description:
      "Une fiche pratique de moins de 5 minutes pour sortir de l’immobilisme avec clarté.",
    category: "fiche",
    fileName:
      "Passer à l'action malgré la procrastination en moins de 5 minutes.pdf.pdf",
    unlockOrder: 9,
    premiumOnly: true,
  },
]

export function getCoffreResource(id: string): CoffreResource | undefined {
  return COFFRE_RESOURCES.find((r) => r.id === id)
}

export function getCoffreResourcesSorted(): CoffreResource[] {
  return [...COFFRE_RESOURCES].sort((a, b) => a.unlockOrder - b.unlockOrder)
}
