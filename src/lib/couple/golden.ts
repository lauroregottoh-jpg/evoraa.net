/**
 * Golden fixtures — couples de référence pour non-régression du moteur.
 * Attentes moteur v1.5 : spine Premium maître, priorités ≤3, modules PP sélectionnés.
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
      "lire",
      "regard",
      "profil-a",
      "profil-b",
      "croisement",
      "communication",
      "desaccords",
      "forces",
      "dynamique-phrase",
      "plan",
      "suivi",
      "carte-relationnelle",
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
    note: "Le contenu (priorités / dynamique) doit différer de la démo Daniel & Naomi.",
  },
  {
    id: "EX-divergent",
    label: "Couple divergent",
    expectedBand: "low",
    maxScore: 45,
    maxPriorities: 3,
  },
] as const
