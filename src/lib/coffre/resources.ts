/**
 * Catalogue Le Coffre Premium — ajouter une ressource ici suffit.
 * PDFs source : docs/COFFRE PREMIUM/
 *
 * Champs :
 * - domain : domaine de vie (navigation principale)
 * - category : type de fichier (journal, guide, prière…)
 * - unlockOrder : ordre d’affichage / priorité de suggestion
 * - premiumOnly : toujours true pour le coffre exclusif
 * - fileName : nom exact du fichier dans docs/COFFRE PREMIUM/
 */

/** Domaines de vie — ce sur quoi la personne clique. */
export type CoffreDomain =
  | "preparation-mariage"
  | "vie-couple"
  | "identite-guerison"
  | "education-enfants"
  | "foyer-famille"

/** Type de fichier / format de la ressource. */
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
  /** Domaine de vie (navigation principale) */
  domain: CoffreDomain
  /** Type de fichier (pastille sur la carte) */
  category: CoffreCategory
  /** Couverture optionnelle (chemin public). Sinon couverture générée. */
  coverImage?: string
  /** Nom exact du PDF dans docs/COFFRE PREMIUM/ */
  fileName: string
  unlockOrder: number
  premiumOnly: boolean
  /** Accroche conversion (visible même verrouillé) */
  teaser?: string
}

export const COFFRE_DOMAIN_META: Record<
  CoffreDomain,
  {
    label: string
    blurb: string
    tone: string
    ink: string
    order: number
  }
> = {
  "preparation-mariage": {
    label: "Préparation au mariage",
    blurb: "Discerner, choisir et se préparer avant de s’engager.",
    tone: "#5C1F28",
    ink: "#F8F4EE",
    order: 1,
  },
  "vie-couple": {
    label: "Vie de couple",
    blurb: "Nourrir la relation, la prière à deux et le projet commun.",
    tone: "#7A4050",
    ink: "#F8F4EE",
    order: 2,
  },
  "identite-guerison": {
    label: "Identité & guérison",
    blurb: "Se reconstruire, pardonner et aimer depuis un cœur soigné.",
    tone: "#B8954A",
    ink: "#2B2421",
    order: 3,
  },
  "education-enfants": {
    label: "Éducation des enfants",
    blurb: "Estime, sécurité émotionnelle et paroles qui bâtissent.",
    tone: "#3D4A3A",
    ink: "#F3EFE8",
    order: 4,
  },
  "foyer-famille": {
    label: "Famille & foyer",
    blurb: "Préparer le climat du foyer et l’héritage familial.",
    tone: "#5A3A55",
    ink: "#F8F4EE",
    order: 5,
  },
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
    ink: "#2B2421",
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
 * 2. Ajouter une entrée ci-dessous (id unique + domain + category + unlockOrder)
 */
export const COFFRE_RESOURCES: CoffreResource[] = [
  {
    id: "journal-preparation",
    title: "Mon journal de préparation au mariage",
    description:
      "Un espace guidé pour clarifier vos intentions, vos peurs et vos rêves avant l’alliance.",
    teaser: "Ce que vous portez vraiment — écrit noir sur blanc.",
    domain: "preparation-mariage",
    category: "journal",
    coverImage: "/coffre-premium/covers/cover-journal.png",
    fileName: "MON JOURNAL DE PREPARATION AU MARIAGE - LAURORE GOTTOH.pdf",
    unlockOrder: 1,
    premiumOnly: true,
  },
  {
    id: "14-questions-conjoint",
    title: "14 questions sur le choix du conjoint",
    description:
      "Des questions profondes pour discerner avec lucidité, sans précipitation ni illusion.",
    teaser: "Les questions que peu osent se poser avant de s’engager.",
    domain: "preparation-mariage",
    category: "guide",
    coverImage: "/coffre-premium/covers/cover-guide.png",
    fileName: "14 QUESTIONS SUR LE CHOIX DU CONJOINT - LAURORE GOTTOH.pdf",
    unlockOrder: 2,
    premiumOnly: true,
  },
  {
    id: "12-erreurs-mariage",
    title: "12 erreurs qui peuvent détruire ton futur mariage",
    description:
      "Les pièges fréquents à connaître tôt — pour construire sur des fondations solides.",
    teaser: "Évitez les pièges avant qu’ils ne coûtent cher.",
    domain: "preparation-mariage",
    category: "guide",
    coverImage: "/coffre-premium/covers/cover-guide.png",
    fileName: "12 ERREURS QUI PEUVENT DETRUIRE TON FUTURE MARIAGE - LAURORE GOTTOH.pdf",
    unlockOrder: 3,
    premiumOnly: true,
  },
  {
    id: "journal-vision-conjoint",
    title: "Journal de prière — vision divine pour ton conjoint",
    description:
      "Recevoir, noter et prier la vision de Dieu pour la personne que vous épouserez.",
    teaser: "Prier avec une direction claire, pas dans le flou.",
    domain: "preparation-mariage",
    category: "journal",
    coverImage: "/coffre-premium/covers/cover-journal.png",
    fileName:
      "JOURNAL DE PRIERE POUR RECEVOIR LA VISION DIVINE POUR TON CONJOINT.pdf",
    unlockOrder: 4,
    premiumOnly: true,
  },
  {
    id: "160-points-priere",
    title: "160 points de prière pour ton futur (ou actuel) couple",
    description:
      "Un plan de prière concret pour couvrir votre relation, votre foyer et votre vocation.",
    teaser: "160 points concrets — plus de « je ne sais pas quoi prier ».",
    domain: "vie-couple",
    category: "priere",
    coverImage: "/coffre-premium/covers/cover-priere.png",
    fileName:
      "160 POINTS DE PRIÈRE POUR TON FUTUR - ACTUEL COUPLE - LAURORE GOTTOH.pdf",
    unlockOrder: 5,
    premiumOnly: true,
  },
  {
    id: "17-types-priere-couple",
    title: "17 types de prière pour ton couple",
    description:
      "Des formes de prière variées pour nourrir l’intimité spirituelle à deux.",
    teaser: "Ne priez plus toujours de la même façon.",
    domain: "vie-couple",
    category: "priere",
    coverImage: "/coffre-premium/covers/cover-priere.png",
    fileName: "17 TYPES DE PRIERE POUR TON COUPLE.pdf",
    unlockOrder: 6,
    premiumOnly: true,
  },
  {
    id: "50-affirmations",
    title: "50 affirmations pour reprogrammer ton identité",
    description:
      "Des affirmations ancrées pour renforcer une identité saine avant (et dans) le couple.",
    teaser: "Reprogrammer ce que vous croyez sur vous-même.",
    domain: "identite-guerison",
    category: "affirmations",
    coverImage: "/coffre-premium/covers/cover-affirmations.png",
    fileName: "50-AFFIRMATIONS-POUR-REPROGRAMMER-TON-IDENTITE.pdf.pdf",
    unlockOrder: 7,
    premiumOnly: true,
  },
  {
    id: "50-proclamations-sante",
    title: "50 proclamations pour la santé émotionnelle",
    description:
      "Des proclamations pour stabiliser le cœur, apaiser l’anxiété et fortifier l’âme.",
    teaser: "Parler santé émotionnelle à haute voix, chaque jour.",
    domain: "identite-guerison",
    category: "affirmations",
    coverImage: "/coffre-premium/covers/cover-affirmations.png",
    fileName: "50 PROCLAMATIONS POUR LA SANTE EMOTIONNELLE- LAURORE GOTTOH.pdf.pdf",
    unlockOrder: 8,
    premiumOnly: true,
  },
  {
    id: "7-jours-pardon",
    title: "7 jours pour valider si tu as vraiment pardonné",
    description:
      "Un parcours court et honnête pour mesurer la réalité de votre pardon — pas seulement l’intention.",
    teaser: "Le pardon réel se vérifie — pas seulement se déclare.",
    domain: "identite-guerison",
    category: "exercice",
    coverImage: "/coffre-premium/covers/cover-exercice.png",
    fileName: "7 JOURS POUR VALIDER SI TU AS VRAIMENT PARDONNÉ - LAURORE GOTTOH.pdf",
    unlockOrder: 9,
    premiumOnly: true,
  },
  {
    id: "30-jours-reconcilier",
    title: "30 jours pour te réconcilier avec toi-même",
    description:
      "Un mois guidé pour guérir le rapport à soi avant d’offrir un amour sain à quelqu’un d’autre.",
    teaser: "Alliance commence souvent par la réconciliation intérieure.",
    domain: "identite-guerison",
    category: "exercice",
    coverImage: "/coffre-premium/covers/cover-exercice.png",
    fileName: "30 JOURS POUR TE RECONCILIER AVEC TOI - MEME- LAURORE GOTTOH.pdf",
    unlockOrder: 10,
    premiumOnly: true,
  },
  {
    id: "exercice-amour-soi",
    title: "Exercice pour renforcer l’amour de soi",
    description:
      "Une pratique concrète pour vous aimer sainement — condition d’un amour durable à deux.",
    teaser: "S’aimer sans ego — pour aimer sans peur.",
    domain: "identite-guerison",
    category: "exercice",
    coverImage: "/coffre-premium/covers/cover-exercice.png",
    fileName: "EXERCICE POUR RENFORCER L’AMOUR DE SOI.pdf.pdf",
    unlockOrder: 11,
    premiumOnly: true,
  },
  {
    id: "lettre-guerison",
    title: "Lettre de guérison",
    description:
      "Un écrit thérapeutique pour déposer blessures, colères et libérations avant d’avancer.",
    teaser: "Écrire ce que le cœur n’ose pas encore dire.",
    domain: "identite-guerison",
    category: "lettre",
    coverImage: "/coffre-premium/covers/cover-lettre.png",
    fileName: "LETTRE DE GUERISON - LAURORE GOTTOH.pdf",
    unlockOrder: 12,
    premiumOnly: true,
  },
  {
    id: "passer-a-laction",
    title: "Passer à l’action malgré la procrastination",
    description:
      "Une fiche pratique de moins de 5 minutes pour sortir de l’immobilisme avec clarté.",
    teaser: "Moins de 5 minutes pour bouger vraiment.",
    domain: "identite-guerison",
    category: "fiche",
    coverImage: "/coffre-premium/covers/cover-fiche.png",
    fileName:
      "Passer à l'action malgré la procrastination en moins de 5 minutes.pdf.pdf",
    unlockOrder: 13,
    premiumOnly: true,
  },
  {
    id: "elever-enfant-stable",
    title: "Élever un enfant émotionnellement stable et confiant",
    description:
      "Les fondations d’un foyer qui prépare déjà l’enfant à devenir un adulte serein.",
    teaser: "Préparer le foyer — pas seulement le couple.",
    domain: "foyer-famille",
    category: "guide",
    coverImage: "/coffre-premium/covers/cover-guide.png",
    fileName:
      "Élever un enfant émotionnellement stable et confiant- LAURORE GOTTOH.pdf",
    unlockOrder: 14,
    premiumOnly: true,
  },
  {
    id: "45-signes-enfant-blesse",
    title: "45 signes d’un enfant émotionnellement blessé",
    description:
      "Reconnaître tôt les blessures invisibles pour accompagner avec sagesse et amour.",
    teaser: "Voir ce que l’enfant ne sait pas encore nommer.",
    domain: "education-enfants",
    category: "guide",
    coverImage: "/coffre-premium/covers/cover-guide.png",
    fileName: "45 SIGNES D'UN ENFANT ÉMOTIONNELLEMENT BLESSÉ - LAURORE GOTTOH.pdf",
    unlockOrder: 15,
    premiumOnly: true,
  },
  {
    id: "5-min-enfant-stable",
    title: "5 minutes par jour — enfant stable et sécurisé",
    description:
      "Un rituel court et réaliste pour construire sécurité émotionnelle au quotidien.",
    teaser: "5 minutes qui changent le climat du foyer.",
    domain: "foyer-famille",
    category: "fiche",
    coverImage: "/coffre-premium/covers/cover-fiche.png",
    fileName:
      "5 minutes par jour pour construire un enfant stable et émotionnellement sécurisé.pdf",
    unlockOrder: 16,
    premiumOnly: true,
  },
  {
    id: "50-phrases-enfant",
    title: "50 phrases à dire à ton enfant chaque jour",
    description:
      "Des paroles qui bâtissent estime de soi et confiance intérieure — jour après jour.",
    teaser: "Les bonnes paroles, chaque jour — pas une fois par an.",
    domain: "education-enfants",
    category: "affirmations",
    coverImage: "/coffre-premium/covers/cover-affirmations.png",
    fileName:
      "50 Phrases à dire à ton enfant chaque jour Pour construire son estime de soi et sa confiance intérieure.pdf",
    unlockOrder: 17,
    premiumOnly: true,
  },
  {
    id: "protocole-guerison-enfants",
    title: "Protocole de prière — guérison émotionnelle des enfants",
    description:
      "50 décrets puissants pour intercéder en faveur de la guérison émotionnelle des enfants.",
    teaser: "Intercéder concrètement pour les cœurs blessés.",
    domain: "education-enfants",
    category: "priere",
    coverImage: "/coffre-premium/covers/cover-priere.png",
    fileName:
      "Protocole de prière pour la guérison émotionnelle des enfants  (50 décrets puissants )- LAURORE GOTTOH.pdf.pdf",
    unlockOrder: 18,
    premiumOnly: true,
  },
]

export function getCoffreResource(id: string): CoffreResource | undefined {
  return COFFRE_RESOURCES.find((r) => r.id === id)
}

export function getCoffreResourcesSorted(): CoffreResource[] {
  return [...COFFRE_RESOURCES].sort((a, b) => a.unlockOrder - b.unlockOrder)
}

export type CoffreDomainGroup = {
  domain: CoffreDomain
  label: string
  blurb: string
  tone: string
  ink: string
  resources: CoffreResource[]
}

/** Ressources classées par domaine de vie. */
export function getCoffreResourcesByDomain(
  resources: CoffreResource[] = COFFRE_RESOURCES
): CoffreDomainGroup[] {
  const byDomain = new Map<CoffreDomain, CoffreResource[]>()
  for (const r of resources) {
    const list = byDomain.get(r.domain) ?? []
    list.push(r)
    byDomain.set(r.domain, list)
  }

  return [...byDomain.entries()]
    .map(([domain, items]) => {
      const meta = COFFRE_DOMAIN_META[domain]
      return {
        domain,
        label: meta.label,
        blurb: meta.blurb,
        tone: meta.tone,
        ink: meta.ink,
        resources: [...items].sort((a, b) => a.unlockOrder - b.unlockOrder),
      }
    })
    .sort(
      (a, b) =>
        COFFRE_DOMAIN_META[a.domain].order - COFFRE_DOMAIN_META[b.domain].order
    )
}

export function getCoffreStats() {
  const byDomain = new Map<CoffreDomain, number>()
  for (const r of COFFRE_RESOURCES) {
    byDomain.set(r.domain, (byDomain.get(r.domain) ?? 0) + 1)
  }
  return {
    total: COFFRE_RESOURCES.length,
    domains: byDomain.size,
  }
}
