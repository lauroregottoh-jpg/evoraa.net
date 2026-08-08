/**
 * Coupon d’audit Couple — code non public (saisie manuelle uniquement).
 * Montant volontairement sous le plancher Bictorys → confirmation interne.
 */

export const COUPLE_AUDIT_AMOUNT_XOF = 10

/** Plancher API Bictorys (docs : minimum 100 XOF). */
export const BICTORYS_MIN_AMOUNT_XOF = 100

/** Code par défaut — surcharge possible via COUPLE_AUDIT_COUPON. */
const DEFAULT_AUDIT_COUPON = "KELIAA-CX-10"

export function normalizeCoupleCoupon(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, "")
}

export function resolveCoupleAuditCouponExpected(): string {
  const fromEnv = process.env.COUPLE_AUDIT_COUPON?.trim()
  return normalizeCoupleCoupon(fromEnv || DEFAULT_AUDIT_COUPON)
}

export function isCoupleAuditCoupon(code: string | null | undefined): boolean {
  if (!code?.trim()) return false
  return normalizeCoupleCoupon(code) === resolveCoupleAuditCouponExpected()
}

export type CoupleChargePlan = {
  amountXof: number
  /** Skip Bictorys — page de confirmation interne (micro-montant / coupon). */
  useInternalConfirm: boolean
  auditCouponApplied: boolean
  listPriceXof: number
}
