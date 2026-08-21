import {
  COUPLE_DEMO_AMOUNT_XOF,
  isCoupleDemoPricing,
  resolveCoupleAmountXof,
} from "@/lib/couple/demoPricing"

export type CoupleOfferId = "couple_essential" | "couple_premium_plus"

export type CoupleOffer = {
  id: CoupleOfferId
  name: string
  marketingName: string
  /** Prix facturé (tarif de lancement). */
  amountXof: number
  /** Prix barré (ancrage promo). */
  compareAtXof?: number
  currency: "XOF"
  description: string
  features: string[]
  includesEssential: boolean
  popular?: boolean
}

export const COUPLE_OFFERS: Record<CoupleOfferId, CoupleOffer> = {
  couple_essential: {
    id: "couple_essential",
    name: "Premium",
    marketingName: "Bilan Premium",
    amountXof: 10_000,
    compareAtXof: 20_000,
    currency: "XOF",
    description:
      "Le bilan de référence KELIAA COUPLE™ — questionnaires, portraits, dynamique croisée, grandes différences, exercices et plan d’action (trame document maître Premium).",
    features: [
      "2 participants inclus",
      "Questionnaires individuels confidentiels",
      "Rapport Premium rédigé (format A4)",
      "Portraits, convergences, différences, priorités",
      "Exercices Premium et plan d’action",
      "Carte relationnelle et téléchargement",
    ],
    includesEssential: true,
  },
  couple_premium_plus: {
    id: "couple_premium_plus",
    name: "Premium Plus",
    marketingName: "Bilan Premium Plus",
    amountXof: 20_000,
    compareAtXof: 50_000,
    currency: "XOF",
    description:
      "100 % du Bilan Premium, plus les Points d’approfondissement Premium Plus (dynamique, décisions, communication, affection, argent, familles…).",
    features: [
      "Tout le Bilan Premium",
      "Points d’approfondissement Premium Plus",
      "Protocoles et exercices avancés",
      "Charte et scénarios relationnels",
      "Plan étendu et suivi",
    ],
    includesEssential: true,
    popular: true,
  },
}

export function getCoupleOffer(id: string): CoupleOffer | null {
  if (id === "couple_essential" || id === "couple_premium_plus") {
    return COUPLE_OFFERS[id]
  }
  return null
}

export function isPremiumPlusOffer(id: CoupleOfferId): boolean {
  return id === "couple_premium_plus"
}

/** Prix réellement facturé (17 FCFA en mode démo). */
export function getCoupleChargeAmountXof(offer: CoupleOffer): number {
  return resolveCoupleAmountXof(offer)
}

export { COUPLE_DEMO_AMOUNT_XOF, isCoupleDemoPricing }

/** Snapshot figé à l’achat. */
export function snapshotCoupleOffer(offer: CoupleOffer, chargedAmount?: number) {
  const price = chargedAmount ?? getCoupleChargeAmountXof(offer)
  return {
    offer_id: offer.id,
    plan_name: offer.marketingName,
    price_paid: price,
    list_price: offer.compareAtXof ?? offer.amountXof,
    launch_price: offer.amountXof,
    demo_pricing: isCoupleDemoPricing(),
    currency: offer.currency,
    features: offer.features,
    features_version: "1.1.0",
    content_version: "1.7.0",
  }
}
