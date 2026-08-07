/**
 * Structure officielle 18 pages — RAPPORT PERSONNALISE/.../02_REPORT_STRUCTURE.md
 * + contrat UI 20_REPORT_UI_SPEC.md
 */

import type { PersonalizedAssessmentId } from "@/lib/rapport/personalized/assessments.catalog"

export type ReportChapterId =
  | "couverture"
  | "resume"
  | "portrait"
  | "forces"
  | "vigilances"
  | "communication"
  | "conflits"
  | "intelligence_emotionnelle"
  | "valeurs"
  | "vision_mariage"
  | "projet_de_vie"
  | "finances"
  | "spiritualite"
  | "synthese"
  | "plan"
  | "ressources"
  | "evolution"
  | "conclusion"

export type ReportChapterDef = {
  id: ReportChapterId
  page: number
  title: string
  /** Toujours visible même vide */
  alwaysVisible: boolean
  /** Évaluations qui débloquent le contenu (vide = toujours générable) */
  unlockedBy: PersonalizedAssessmentId[]
  teaser: string
}

export const REPORT_CHAPTERS: ReportChapterDef[] = [
  {
    id: "couverture",
    page: 1,
    title: "Couverture",
    alwaysVisible: true,
    unlockedBy: [],
    teaser: "Votre Rapport Personnalisé Alliance™",
  },
  {
    id: "resume",
    page: 2,
    title: "Résumé exécutif",
    alwaysVisible: true,
    unlockedBy: [],
    teaser: "Vision globale de votre préparation relationnelle",
  },
  {
    id: "portrait",
    page: 3,
    title: "Votre portrait relationnel",
    alwaysVisible: true,
    unlockedBy: ["personnalite", "intelligence_emotionnelle"],
    teaser: "Qui êtes-vous dans une relation ?",
  },
  {
    id: "forces",
    page: 4,
    title: "Vos principales forces",
    alwaysVisible: true,
    unlockedBy: ["personnalite"],
    teaser: "Ressources naturelles à cultiver",
  },
  {
    id: "vigilances",
    page: 5,
    title: "Vos points de vigilance",
    alwaysVisible: true,
    unlockedBy: ["personnalite", "communication", "conflits"],
    teaser: "Domaines qui méritent un travail particulier",
  },
  {
    id: "communication",
    page: 6,
    title: "Communication",
    alwaysVisible: true,
    unlockedBy: ["communication"],
    teaser: "Votre fonctionnement dans les échanges",
  },
  {
    id: "conflits",
    page: 7,
    title: "Gestion des conflits",
    alwaysVisible: true,
    unlockedBy: ["conflits"],
    teaser: "Vos réactions face aux tensions",
  },
  {
    id: "intelligence_emotionnelle",
    page: 8,
    title: "Intelligence émotionnelle",
    alwaysVisible: true,
    unlockedBy: ["intelligence_emotionnelle"],
    teaser: "Identifier, réguler et exprimer vos émotions",
  },
  {
    id: "valeurs",
    page: 9,
    title: "Valeurs fondamentales",
    alwaysVisible: true,
    unlockedBy: ["valeurs"],
    teaser: "Les convictions qui guident vos décisions",
  },
  {
    id: "vision_mariage",
    page: 10,
    title: "Vision du mariage",
    alwaysVisible: true,
    unlockedBy: ["vision_mariage"],
    teaser: "Votre représentation personnelle du couple",
  },
  {
    id: "projet_de_vie",
    page: 11,
    title: "Projet de vie",
    alwaysVisible: true,
    unlockedBy: ["projet_de_vie"],
    teaser: "Aspirations à long terme",
  },
  {
    id: "finances",
    page: 12,
    title: "Gestion des finances",
    alwaysVisible: true,
    unlockedBy: ["finances"],
    teaser: "Votre relation à l’argent",
  },
  {
    id: "spiritualite",
    page: 13,
    title: "Spiritualité",
    alwaysVisible: true,
    unlockedBy: ["spiritualite"],
    teaser: "La place de Dieu dans votre future relation",
  },
  {
    id: "synthese",
    page: 14,
    title: "Synthèse des compétences",
    alwaysVisible: true,
    unlockedBy: [],
    teaser: "Vue d’ensemble de vos indicateurs",
  },
  {
    id: "plan",
    page: 15,
    title: "Plan de progression personnalisé",
    alwaysVisible: true,
    unlockedBy: [],
    teaser: "Transformer les analyses en actions (max 5 priorités)",
  },
  {
    id: "ressources",
    page: 16,
    title: "Ressources Alliance",
    alwaysVisible: true,
    unlockedBy: [],
    teaser: "Modules, exercices et contenus adaptés",
  },
  {
    id: "evolution",
    page: 17,
    title: "Évolution de votre rapport",
    alwaysVisible: true,
    unlockedBy: [],
    teaser: "Tests complétés et prochaines analyses à débloquer",
  },
  {
    id: "conclusion",
    page: 18,
    title: "Conclusion",
    alwaysVisible: true,
    unlockedBy: [],
    teaser: "Encouragement et prochaines étapes",
  },
]
