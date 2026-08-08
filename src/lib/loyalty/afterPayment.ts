import { grantAllianceLoyaltyForPayment } from "@/lib/loyalty/account"

/** Best-effort loyalty grant after Alliance payment activation. */
export async function maybeGrantLoyaltyAfterAlliancePayment(input: {
  userId: string | null | undefined
  paymentId: string
  metadata?: unknown
  alreadyActivated?: boolean
}) {
  if (!input.userId || !input.paymentId) return
  // Still grant on "already" only if not granted — grant is idempotent by payment_ref
  const meta =
    input.metadata && typeof input.metadata === "object"
      ? (input.metadata as Record<string, unknown>)
      : {}
  const isRenewal =
    Boolean(meta.is_renewal) ||
    meta.renew === true ||
    meta.renew === 1 ||
    meta.renew === "1"
  const months =
    typeof meta.months === "number" && meta.months > 0
      ? Math.floor(meta.months)
      : typeof meta.duration_months === "number" && meta.duration_months > 0
        ? Math.floor(meta.duration_months)
        : 1

  try {
    await grantAllianceLoyaltyForPayment({
      userId: input.userId,
      paymentId: input.paymentId,
      isRenewal,
      monthsPurchased: months,
    })
  } catch {
    /* never block payment ACK */
  }
}
