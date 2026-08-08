/**
 * Prix démo KELYA COUPLE — 17 FCFA pour tester tout le parcours.
 * Activé si COUPLE_DEMO_PRICING=true, ou si paiements démo / hors prod stricte.
 */

import { isDemoPaymentsEnv } from "@/lib/billing/provider"
import type { CoupleOffer } from "@/lib/couple/offers"

/** Montant unique de test demandé pour Essentiel et Premium Plus. */
export const COUPLE_DEMO_AMOUNT_XOF = 17

export function isCoupleDemoPricing(): boolean {
  if (process.env.COUPLE_DEMO_PRICING === "true") return true
  if (process.env.COUPLE_DEMO_PRICING === "false") return false
  return isDemoPaymentsEnv()
}

export function resolveCoupleAmountXof(offer: CoupleOffer): number {
  return isCoupleDemoPricing() ? COUPLE_DEMO_AMOUNT_XOF : offer.amountXof
}
