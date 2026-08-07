/** Parcours Alliance — expérience guidée (pas une liste de features). */

export const ALLIANCE_WELCOME_KEY = "KELIAA_alliance_welcome_seen"
export const ALLIANCE_CELEBRATIONS_KEY = "KELIAA_alliance_celebrations"

export type AlliancePrivilegeId =
  | "badge"
  | "coffre"
  | "bilan"
  | "eva"
  | "matching"
  | "priorite"

export const ALLIANCE_PRIVILEGES: {
  id: AlliancePrivilegeId
  title: string
  body: string
}[] = [
  {
    id: "badge",
    title: "Badge Alliance",
    body: "Votre engagement est visible — priorisé avec respect.",
  },
  {
    id: "coffre",
    title: "Coffre Premium",
    body: "Guides, journaux et ressources pour préparer votre mariage.",
  },
  {
    id: "bilan",
    title: "Bilan relationnel",
    body: "Lecture claire de vos 5 piliers et axes de croissance.",
  },
  {
    id: "eva",
    title: "Eva",
    body: "Une alliée pour discerner, jour après jour.",
  },
  {
    id: "matching",
    title: "Matching enrichi",
    body: "Plus de suggestions, plus d’espace pour des échanges sérieux.",
  },
  {
    id: "priorite",
    title: "Priorité soft",
    body: "Une visibilité plus juste auprès des profils alignés.",
  },
]

export type AllianceMissionId =
  | "bilan"
  | "coffre"
  | "eva"
  | "profil"

export const ALLIANCE_FIRST_MISSIONS: {
  id: AllianceMissionId
  title: string
  href: string
  field: keyof AllianceMissionFlags
}[] = [
  {
    id: "bilan",
    title: "Découvrir mon bilan",
    href: "/rapport",
    field: "bilanSeen",
  },
  {
    id: "coffre",
    title: "Débloquer mes 3 premiers PDF",
    href: "/coffre-premium",
    field: "coffreStarted",
  },
  {
    id: "eva",
    title: "Poser une première question à Eva",
    href: "/help",
    field: "evaAsked",
  },
  {
    id: "profil",
    title: "Compléter mon profil à 100 %",
    href: "/profile",
    field: "profileComplete",
  },
]

export type AllianceMissionFlags = {
  bilanSeen: boolean
  coffreStarted: boolean
  evaAsked: boolean
  profileComplete: boolean
}

export type AllianceLevelId = 1 | 2 | 3

export const ALLIANCE_LEVELS: {
  id: AllianceLevelId
  title: string
  subtitle: string
  minProgress: number
}[] = [
  {
    id: 1,
    title: "Explorateur",
    subtitle: "Vous entrez dans Alliance — se connaître d’abord.",
    minProgress: 0,
  },
  {
    id: 2,
    title: "Prêt pour rencontrer",
    subtitle: "Bilan, Coffre et profil : vous avancez avec lucidité.",
    minProgress: 50,
  },
  {
    id: 3,
    title: "Prêt pour le mariage",
    subtitle: "Discernement, profondeur, projet de vie.",
    minProgress: 85,
  },
]

export type AllianceJourneyStage = {
  id: string
  title: string
  items: { label: string; href: string; doneKey: keyof AllianceMissionFlags | "tests" | "match" }[]
}

export const ALLIANCE_STAGES: AllianceJourneyStage[] = [
  {
    id: "connaitre",
    title: "Étape 1 — Me connaître",
    items: [
      { label: "Découvrir mon bilan relationnel", href: "/rapport", doneKey: "bilanSeen" },
      { label: "Comprendre mes cinq piliers", href: "/assessments", doneKey: "tests" },
      { label: "Identifier mes priorités de croissance", href: "/rapport", doneKey: "bilanSeen" },
    ],
  },
  {
    id: "preparer",
    title: "Étape 2 — Me préparer",
    items: [
      { label: "Lire mes premiers guides Premium", href: "/coffre-premium", doneKey: "coffreStarted" },
      { label: "Poser mes premières questions à Eva", href: "/help", doneKey: "evaAsked" },
      { label: "Compléter mon profil en profondeur", href: "/profile", doneKey: "profileComplete" },
    ],
  },
  {
    id: "rencontrer",
    title: "Étape 3 — Rencontrer avec discernement",
    items: [
      { label: "Explorer mes compatibilités", href: "/compatibility", doneKey: "match" },
      { label: "Engager des conversations de qualité", href: "/messages", doneKey: "match" },
    ],
  },
  {
    id: "construire",
    title: "Étape 4 — Construire une relation solide",
    items: [
      { label: "Continuer via l’Académie", href: "/academie-mariage", doneKey: "bilanSeen" },
      { label: "Utiliser le Coffre Premium", href: "/coffre-premium", doneKey: "coffreStarted" },
      { label: "Envisager un coaching", href: "/coaching", doneKey: "evaAsked" },
    ],
  },
]

export type AllianceAchievementId =
  | "bilan"
  | "profil"
  | "eva"
  | "pdf"
  | "conversation"
  | "compat85"

export const ALLIANCE_ACHIEVEMENTS: {
  id: AllianceAchievementId
  title: string
  field: keyof AllianceAchievementFlags
}[] = [
  { id: "bilan", title: "Premier bilan consulté", field: "bilan" },
  { id: "profil", title: "Profil complété", field: "profil" },
  { id: "eva", title: "Première question à Eva", field: "eva" },
  { id: "pdf", title: "Premier PDF débloqué", field: "pdf" },
  { id: "conversation", title: "Première conversation sérieuse", field: "conversation" },
  { id: "compat85", title: "Compatibilité ≥ 85 %", field: "compat85" },
]

export type AllianceAchievementFlags = {
  bilan: boolean
  profil: boolean
  eva: boolean
  pdf: boolean
  conversation: boolean
  compat85: boolean
}

export function resolveAllianceLevel(progressPercent: number): AllianceLevelId {
  if (progressPercent >= 85) return 3
  if (progressPercent >= 50) return 2
  return 1
}

export function computeMissionProgress(flags: AllianceMissionFlags): {
  done: number
  total: number
  percent: number
} {
  const values = Object.values(flags)
  const done = values.filter(Boolean).length
  const total = values.length
  return { done, total, percent: Math.round((done / total) * 100) }
}
