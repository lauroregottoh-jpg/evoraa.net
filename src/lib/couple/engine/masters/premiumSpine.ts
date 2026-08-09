/**
 * Spine Premium — architecture du document maître KELIAA COUPLE™.md
 * (structure commune ; contenu variable via harmonize).
 */

export type PremiumSpineSlot =
  | "accueil"
  | "lire"
  | "regard"
  | "profil-a"
  | "profil-b"
  | "croisement"
  | "communication"
  | "desaccords"
  | "forces"
  | "diff-1"
  | "diff-2"
  | "diff-3"
  | "dynamique-phrase"
  | "plan"
  | "suivi"
  | "carte-relationnelle"
  | "conclusion"

export type PremiumSpineItem = {
  id: PremiumSpineSlot
  title: string
  /** Sous-titre éditorial (italique) — peut être remplacé à l’assemblage. */
  defaultSubtitle: string
}

/** Ordre des cartes Premium (Essentiel = ce spine). */
export const PREMIUM_SPINE: PremiumSpineItem[] = [
  {
    id: "accueil",
    title: "Bienvenue dans votre bilan",
    defaultSubtitle: "Votre histoire compte, mais votre avenir mérite aussi d’être clarifié",
  },
  {
    id: "lire",
    title: "Comment lire votre rapport",
    defaultSubtitle: "Prenez le temps de vous découvrir autrement",
  },
  {
    id: "regard",
    title: "Votre couple en un regard",
    defaultSubtitle: "Une base commune solide, avec des différences qui méritent d’être comprises",
  },
  {
    id: "profil-a",
    title: "Le profil de {A}",
    defaultSubtitle: "Ce que le bilan révèle de vous dans le couple",
  },
  {
    id: "profil-b",
    title: "Le profil de {B}",
    defaultSubtitle: "Ce que le bilan révèle de vous dans le couple",
  },
  {
    id: "croisement",
    title: "Ce qui se passe lorsque vos deux profils se rencontrent",
    defaultSubtitle: "Votre dynamique centrale",
  },
  {
    id: "communication",
    title: "Votre manière de communiquer",
    defaultSubtitle: "Quand deux personnes parlent, elles ne cherchent pas toujours la même chose",
  },
  {
    id: "desaccords",
    title: "Lorsque vous n’êtes pas d’accord",
    defaultSubtitle:
      "Ce qui compte n’est pas seulement la manière dont vous aimez vous accorder, mais la manière dont vous traversez vos désaccords",
  },
  {
    id: "forces",
    title: "Vos forces",
    defaultSubtitle: "Ce qui vous porte déjà",
  },
  {
    id: "diff-1",
    title: "Votre première grande différence",
    defaultSubtitle: "À développer selon vos résultats",
  },
  {
    id: "diff-2",
    title: "Votre deuxième grande différence",
    defaultSubtitle: "À développer selon vos résultats",
  },
  {
    id: "diff-3",
    title: "Votre troisième grande différence",
    defaultSubtitle: "À développer selon vos résultats",
  },
  {
    id: "dynamique-phrase",
    title: "Votre dynamique en une phrase",
    defaultSubtitle: "Le fil rouge de votre bilan",
  },
  {
    id: "plan",
    title: "Votre plan d’action Premium",
    defaultSubtitle: "Ensemble · Individuel · À discuter · À observer",
  },
  {
    id: "suivi",
    title: "Votre outil de suivi",
    defaultSubtitle: "Garder le fil sans vous surcharger",
  },
  {
    id: "carte-relationnelle",
    title: "Votre carte relationnelle",
    defaultSubtitle: "Synthèse finale de votre bilan Premium",
  },
  {
    id: "conclusion",
    title: "Conclusion de votre bilan Premium",
    defaultSubtitle: "Voir · Choisir · Agir",
  },
]

export function fillNames(template: string, names: { nameA: string; nameB: string }) {
  return template.replaceAll("{A}", names.nameA).replaceAll("{B}", names.nameB)
}
