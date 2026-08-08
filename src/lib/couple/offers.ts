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
  /** Prix catalogue (production). */
  amountXof: number
  currency: "XOF"
  description: string
  features: string[]
  includesEssential: boolean
  popular?: boolean
}

export const COUPLE_OFFERS: Record<CoupleOfferId, CoupleOffer> = {
  couple_essential: {
    id: "couple_essential",
    name: "Essentiel",
    marketingName: "Bilan Essentiel",
    amountXof: 30_000,
    currency: "XOF",
    description:
      "Un bilan relationnel complet pour votre couple — questionnaires, analyse croisée, rapport, exercices et plan d’action.",
    features: [
      "2 participants inclus",
      "Questionnaires individuels confidentiels",
      "Rapport de couple rédigé",
      "Forces, convergences, différences, priorités",
      "Exercices et plan d’action",
      "Téléchargement du dossier",
    ],
    includesEssential: true,
  },
  couple_premium_plus: {
    id: "couple_premium_plus",
    name: "Premium Plus",
    marketingName: "Bilan Premium Plus",
    amountXof: 50_000,
    currency: "XOF",
    description:
      "Tout l’Essentiel, enrichi : analyses approfondies, scénarios, protocoles, charte relationnelle et plan étendu.",
    features: [
      "Tout le Bilan Essentiel",
      "Analyses de dynamiques approfondies",
      "Scénarios relationnels rédigés",
      "Protocoles de travail",
      "Charte relationnelle",
      "Exercices supplémentaires",
      "Plan d’action étendu",
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
    list_price: offer.amountXof,
    demo_pricing: isCoupleDemoPricing(),
    currency: offer.currency,
    features: offer.features,
    features_version: "1.0.0",
    content_version: "1.0.0",
  }
}
