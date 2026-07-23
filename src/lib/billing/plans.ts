export type PlanId = "free" | "premium" | "premium_plus"

export type PlanLimits = {
  dailySuggestions: number
  messagesPerConversation: number
  conversationsPerMonth: number
}

export type PlanDefinition = {
  id: PlanId
  name: string
  amountXof: number
  periodLabel: string
  description: string
  features: string[]
  popular?: boolean
  limits: PlanLimits
}

export const PLANS: Record<PlanId, PlanDefinition> = {
  free: {
    id: "free",
    name: "Découverte",
    amountXof: 0,
    periodLabel: "",
    description: "Idéal pour explorer la plateforme.",
    features: [
      "3 suggestions de compatibilité / jour",
      "5 conversations / mois",
      "5 messages / conversation",
      "Questionnaire d'accueil & profil",
      "Bouclier de bienveillance",
    ],
    limits: {
      dailySuggestions: 3,
      messagesPerConversation: 5,
      conversationsPerMonth: 5,
    },
  },
  premium: {
    id: "premium",
    name: "Premium",
    amountXof: 2500,
    periodLabel: "/ mois",
    description: "L'expérience complète pour un discernement sérieux.",
    popular: true,
    features: [
      "10 suggestions / jour",
      "15 conversations / mois",
      "70 messages / conversation",
      "Badge Premium",
      "Renouvellement manuel (sans surprise)",
    ],
    limits: {
      dailySuggestions: 10,
      messagesPerConversation: 70,
      conversationsPerMonth: 15,
    },
  },
  premium_plus: {
    id: "premium_plus",
    name: "Premium+",
    amountXof: 5000,
    periodLabel: "/ mois",
    description: "L'expérience accélérée et illimitée.",
    features: [
      "20 suggestions / jour",
      "Conversations illimitées",
      "Messages illimités",
      "Visibilité prioritaire (badge Premium+)",
      "Renouvellement manuel",
    ],
    limits: {
      dailySuggestions: 20,
      messagesPerConversation: Number.MAX_SAFE_INTEGER,
      conversationsPerMonth: Number.MAX_SAFE_INTEGER,
    },
  },
}

export function isPaidPlan(planId: string): planId is Exclude<PlanId, "free"> {
  return planId === "premium" || planId === "premium_plus"
}

export function getPlan(planId: string | null | undefined): PlanDefinition {
  if (planId && planId in PLANS) return PLANS[planId as PlanId]
  return PLANS.free
}
