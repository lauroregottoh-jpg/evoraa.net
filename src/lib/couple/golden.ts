/**
 * Golden fixtures — couples de référence pour non-régression du moteur.
 * Les scores exacts évolueront avec la banque ; les bandes d’interprétation restent stables.
 */
export const GOLDEN_COUPLES = [
  {
    id: "EX-convergent",
    label: "Couple très convergent",
    expectedBand: "high",
    minScore: 80,
  },
  {
    id: "EX-mixed",
    label: "Couple mixte",
    expectedBand: "mid",
    minScore: 40,
    maxScore: 79,
  },
  {
    id: "EX-divergent",
    label: "Couple divergent",
    expectedBand: "low",
    maxScore: 45,
  },
]
