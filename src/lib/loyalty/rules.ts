/**
 * Barème officiel Programme Fidélité Alliance.
 * @see docs/PROGRAMME_FIDELITE_ALLIANCE.md
 */

export type LoyaltyReward = {
  bonusMessages: number
  boosts: number
  isMilestone: boolean
  vipSession: boolean
}

/** Récompense pour le mois consécutif N (1-indexé). */
export function rewardForConsecutiveMonth(month: number): LoyaltyReward {
  if (month <= 0) {
    return { bonusMessages: 0, boosts: 0, isMilestone: false, vipSession: false }
  }
  const isMilestone = month % 3 === 0
  return {
    bonusMessages: isMilestone ? 30 : 15,
    boosts: isMilestone ? 1 : 0,
    isMilestone,
    vipSession: month === 12 || (month > 12 && month % 12 === 0),
  }
}

/** Prochaine récompense après `currentMonths` déjà crédités. */
export function nextRewardPreview(currentMonths: number): LoyaltyReward & {
  nextMonth: number
} {
  const nextMonth = currentMonths + 1
  return { nextMonth, ...rewardForConsecutiveMonth(nextMonth) }
}

export const FIDELITY_CARDS = [
  {
    id: "welcome",
    label: "Bienvenue",
    tone: "cream",
    description: "Votre première carte KELIAA.",
  },
  {
    id: "active",
    label: "Membre actif",
    tone: "gold",
    description: "Présence régulière sur la plateforme.",
  },
  {
    id: "engaged",
    label: "Membre engagé",
    tone: "burgundy",
    description: "Profil et parcours avancés.",
  },
  {
    id: "faithful",
    label: "Membre fidèle",
    tone: "deep",
    description: "Ancienneté et constance.",
  },
  {
    id: "ambassador",
    label: "Ambassadeur KELIAA",
    tone: "alliance",
    description: "Cercle des membres les plus investis.",
  },
] as const

export type FidelityCardId = (typeof FIDELITY_CARDS)[number]["id"]

export function fidelityCardById(id: string) {
  return FIDELITY_CARDS.find((c) => c.id === id) ?? FIDELITY_CARDS[0]
}

/**
 * Progression carte (auto) — Découverte + Alliance.
 * Ne remplace pas le barème Alliance messages/boosts.
 */
export function resolveFidelityCardId(input: {
  monthsOnPlatform: number
  consecutiveAllianceMonths: number
  completionPercentage: number
  assessmentsDone: number
}): FidelityCardId {
  const {
    monthsOnPlatform,
    consecutiveAllianceMonths,
    completionPercentage,
    assessmentsDone,
  } = input

  if (consecutiveAllianceMonths >= 12 || monthsOnPlatform >= 12) {
    return "ambassador"
  }
  if (consecutiveAllianceMonths >= 3 || monthsOnPlatform >= 6) {
    return "faithful"
  }
  if (
    monthsOnPlatform >= 3 ||
    (completionPercentage >= 70 && assessmentsDone >= 3)
  ) {
    return "engaged"
  }
  if (monthsOnPlatform >= 1 || completionPercentage >= 40) {
    return "active"
  }
  return "welcome"
}
