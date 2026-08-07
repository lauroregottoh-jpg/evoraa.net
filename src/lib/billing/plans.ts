export type PlanId = "free" | "premium" | "premium_plus"

export type PlanLimits = {
  dailySuggestions: number
  /** Nouvelles conversations initiées / mois */
  conversationsPerMonth: number
  messagesPerConversation: number
  /** Questions EVA / jour (coach local) */
  evaQuestionsPerDay: number
}

export type PlanDefinition = {
  id: PlanId
  name: string
  amountXof: number
  /** Prix barré (ancrage lancement), optionnel */
  compareAtXof?: number
  periodLabel: string
  description: string
  features: string[]
  popular?: boolean
  /** Affiché sur la page Tarifs publique */
  public: boolean
  limits: PlanLimits
}

/**
 * Grille validée soft launch : Free + Alliance (premium_plus).
 * `premium` (2 500) reste en code pour d'éventuels abonnés legacy — non public.
 */
export const PLANS: Record<PlanId, PlanDefinition> = {
  free: {
    id: "free",
    name: "Découverte",
    amountXof: 0,
    periodLabel: "Pour toujours",
    description: "Gratuit pour commencer. Assez pour goûter — pas pour tout vivre.",
    public: true,
    features: [
      "Création de profil & questionnaires",
      "3 suggestions de compatibilité / jour",
      "5 nouvelles conversations / mois",
      "5 messages envoyés / conversation",
      "EVA : 3 questions / jour",
      "Inspiration (conseil du jour)",
      "Bouclier de bienveillance",
    ],
    limits: {
      dailySuggestions: 3,
      conversationsPerMonth: 5,
      messagesPerConversation: 5,
      evaQuestionsPerDay: 3,
    },
  },
  premium: {
    id: "premium",
    name: "Essentiel (legacy)",
    amountXof: 2500,
    periodLabel: "/ mois",
    description: "Ancien plan — non proposé aux nouveaux inscrits.",
    public: false,
    features: [
      "10 suggestions / jour",
      "15 conversations / mois",
      "70 messages / conversation",
    ],
    limits: {
      dailySuggestions: 10,
      conversationsPerMonth: 15,
      messagesPerConversation: 70,
      evaQuestionsPerDay: 10,
    },
  },
  premium_plus: {
    id: "premium_plus",
    name: "Alliance",
    amountXof: 5000,
    compareAtXof: 6000,
    periodLabel: "/ mois",
    description:
      "Alliance : rapport personnalisé, axes d’amélioration + Matching enrichi.",
    popular: true,
    public: true,
    features: [
      "Rapport personnalisé complet (5 piliers)",
      "Axes d’amélioration priorisés + Académie",
      "Le Coffre Premium (3 ressources au choix, puis +2 / mois)",
      "15 suggestions de compatibilité / jour (vs 3)",
      "25 nouvelles conversations sérieuses / mois (vs 5)",
      "100 messages / conversation (vs 5)",
      "EVA : 20 questions / jour (vs 3)",
      "Score de compatibilité détaillé",
      "Badge Alliance",
      "Priorité soft dans les suggestions",
      "Support prioritaire (WhatsApp VIP + ticket prioritaire)",
      "Paiement Mobile Money ou carte — renouvellement manuel (sans prélèvement surprise)",
    ],
    limits: {
      dailySuggestions: 15,
      conversationsPerMonth: 25,
      messagesPerConversation: 100,
      evaQuestionsPerDay: 20,
    },
  },
}

/** Plans affichés sur /pricing */
export const PUBLIC_PLAN_ORDER: PlanId[] = ["free", "premium_plus"]

export function isPaidPlan(planId: string): planId is Exclude<PlanId, "free"> {
  return planId === "premium" || planId === "premium_plus"
}

export function getPlan(planId: string | null | undefined): PlanDefinition {
  if (planId && planId in PLANS) return PLANS[planId as PlanId]
  return PLANS.free
}

/** Plan payant recommandé (Alliance) */
export function getHeroPaidPlan(): PlanDefinition {
  return PLANS.premium_plus
}
