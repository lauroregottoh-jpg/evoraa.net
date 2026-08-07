/**
 * Catalogue des évaluations — RAPPORT PERSONNALISE/OFFRE ALLIANCE/03_ASSESSMENTS.md
 * Les slugs techniques existants restent en base ; ce catalogue guide UX + déblocage chapitres.
 */

import type { AssessmentSlug } from "@/lib/assessments/questionBank"

export type AssessmentTier = "essential" | "complementary" | "premium_plus"

export type PersonalizedAssessmentId =
  | "personnalite"
  | "communication"
  | "conflits"
  | "intelligence_emotionnelle"
  | "valeurs"
  | "vision_mariage"
  | "projet_de_vie"
  | "spiritualite"
  | "finances"
  | "famille"
  | "langages_amour"
  | "besoins_emotionnels"
  | "gestion_stress"
  | "dependance_affective"
  | "attachement"

export type PersonalizedAssessment = {
  id: PersonalizedAssessmentId
  tier: AssessmentTier
  order: number
  title: string
  subtitle: string
  durationMin: number
  unlocks: string[]
  benefits: string[]
  /** Questionnaire existant qui alimente cette évaluation (V1) */
  sourceSlug?: AssessmentSlug
  /** Dimensions code qui contribuent (optionnel) */
  sourceDimensions?: string[]
}

export const PERSONALIZED_ASSESSMENTS: PersonalizedAssessment[] = [
  {
    id: "personnalite",
    tier: "essential",
    order: 1,
    title: "Personnalité relationnelle",
    subtitle: "Comment vous fonctionnez dans une relation",
    durationMin: 8,
    unlocks: ["portrait", "forces", "vigilances", "plan"],
    benefits: ["Portrait relationnel", "Forces", "Axes de progression"],
    sourceSlug: "personality",
  },
  {
    id: "communication",
    tier: "essential",
    order: 2,
    title: "Communication",
    subtitle: "Écoute, expression, clarté des échanges",
    durationMin: 7,
    unlocks: ["communication"],
    benefits: ["Chapitre Communication", "Conseils", "Exercices"],
    sourceSlug: "relationship",
    sourceDimensions: ["communication", "partnership"],
  },
  {
    id: "conflits",
    tier: "essential",
    order: 3,
    title: "Gestion des conflits",
    subtitle: "Vos réactions face aux désaccords",
    durationMin: 7,
    unlocks: ["conflits"],
    benefits: ["Analyse des conflits", "Conseils de réparation"],
    sourceSlug: "relationship",
    sourceDimensions: ["conflict"],
  },
  {
    id: "intelligence_emotionnelle",
    tier: "essential",
    order: 4,
    title: "Intelligence émotionnelle",
    subtitle: "Identifier, réguler et exprimer vos émotions",
    durationMin: 8,
    unlocks: ["intelligence_emotionnelle", "portrait"],
    benefits: ["Chapitre IE", "Portrait enrichi"],
    sourceSlug: "personality",
    sourceDimensions: ["emotional_stability", "emotional"],
  },
  {
    id: "valeurs",
    tier: "essential",
    order: 5,
    title: "Valeurs fondamentales",
    subtitle: "Les convictions qui guident vos décisions",
    durationMin: 6,
    unlocks: ["valeurs"],
    benefits: ["Chapitre Valeurs", "Compatibilité des valeurs"],
    sourceSlug: "finances",
    sourceDimensions: ["stewardship", "marriage_vision"],
  },
  {
    id: "vision_mariage",
    tier: "essential",
    order: 6,
    title: "Vision du mariage",
    subtitle: "Votre représentation personnelle du couple",
    durationMin: 6,
    unlocks: ["vision_mariage"],
    benefits: ["Vision du mariage", "Priorités de couple"],
    sourceSlug: "couple_life",
    sourceDimensions: ["vision", "roles"],
  },
  {
    id: "projet_de_vie",
    tier: "essential",
    order: 7,
    title: "Projet de vie",
    subtitle: "Objectifs à long terme et aspirations",
    durationMin: 6,
    unlocks: ["projet_de_vie"],
    benefits: ["Projet de vie", "Priorités"],
    sourceSlug: "couple_life",
    sourceDimensions: ["family", "planning"],
  },
  {
    id: "spiritualite",
    tier: "essential",
    order: 8,
    title: "Spiritualité",
    subtitle: "La place de la foi dans votre future relation",
    durationMin: 7,
    unlocks: ["spiritualite"],
    benefits: ["Chapitre Spiritualité", "Modules spirituels"],
    sourceSlug: "spiritual",
  },
  {
    id: "finances",
    tier: "essential",
    order: 9,
    title: "Gestion financière",
    subtitle: "Votre relation à l’argent et aux décisions budgétaires",
    durationMin: 6,
    unlocks: ["finances"],
    benefits: ["Chapitre Finances", "Conseils concrets"],
    sourceSlug: "finances",
    sourceDimensions: ["management", "planning"],
  },
  {
    id: "famille",
    tier: "essential",
    order: 10,
    title: "Famille et parentalité",
    subtitle: "Vision familiale, éducation, transmission",
    durationMin: 6,
    unlocks: ["famille", "projet_de_vie"],
    benefits: ["Chapitre Famille", "Projet de vie enrichi"],
    sourceSlug: "couple_life",
    sourceDimensions: ["family"],
  },
  {
    id: "langages_amour",
    tier: "premium_plus",
    order: 22,
    title: "Langages de l’amour",
    subtitle: "Premium+ à venir — comment vous donnez et recevez l’affection",
    durationMin: 5,
    unlocks: ["communication", "portrait"],
    benefits: ["Analyse affection", "Conseils couple"],
  },
  {
    id: "besoins_emotionnels",
    tier: "premium_plus",
    order: 23,
    title: "Besoins émotionnels",
    subtitle: "Premium+ à venir — sécurité émotionnelle",
    durationMin: 5,
    unlocks: ["intelligence_emotionnelle", "vigilances"],
    benefits: ["Besoins clarifiés", "Vigilances enrichies"],
  },
  {
    id: "gestion_stress",
    tier: "premium_plus",
    order: 24,
    title: "Gestion du stress",
    subtitle: "Premium+ à venir — réactions sous pression",
    durationMin: 5,
    unlocks: ["conflits", "plan"],
    benefits: ["Conseils stress", "Plan adapté"],
  },
  {
    id: "dependance_affective",
    tier: "premium_plus",
    order: 20,
    title: "Dépendance affective",
    subtitle: "Premium+ à venir — analyse approfondie",
    durationMin: 10,
    unlocks: ["vigilances", "plan"],
    benefits: ["Analyse Premium+", "Parcours guidé"],
  },
  {
    id: "attachement",
    tier: "premium_plus",
    order: 21,
    title: "Style d’attachement approfondi",
    subtitle: "Premium+ à venir — sécurité relationnelle",
    durationMin: 10,
    unlocks: ["portrait", "vigilances"],
    benefits: ["Portrait Premium+", "Sécurité affective"],
  },
]

export const ESSENTIAL_ASSESSMENTS = PERSONALIZED_ASSESSMENTS.filter(
  (a) => a.tier === "essential"
)

export function assessmentById(
  id: PersonalizedAssessmentId
): PersonalizedAssessment | undefined {
  return PERSONALIZED_ASSESSMENTS.find((a) => a.id === id)
}
