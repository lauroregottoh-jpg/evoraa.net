/**
 * Golden fixtures — couples de référence pour non-régression du moteur.
 * Les scores exacts évolueront avec la banque ; les bandes d’interprétation restent stables.
 * Attentes moteur v1.4 : priorités ≤3, sections doc 86, ressources catalogue pinnées.
 */
export const GOLDEN_COUPLES = [
  {
    id: "EX-convergent",
    label: "Couple très convergent",
    expectedBand: "high",
    minScore: 80,
    maxPriorities: 3,
    expectSectionIds: [
      "accueil",
      "intro",
      "regard",
      "score",
      "profil-a",
      "profil-b",
      "croisement",
      "convergences",
      "ecarts",
      "vigilance",
      "priorites",
      "ressources",
      "conclusion",
    ],
  },
  {
    id: "EX-mixed",
    label: "Couple mixte",
    expectedBand: "mid",
    minScore: 40,
    maxScore: 79,
    maxPriorities: 3,
  },
  {
    id: "EX-divergent",
    label: "Couple divergent",
    expectedBand: "low",
    maxScore: 45,
    maxPriorities: 3,
  },
] as const
