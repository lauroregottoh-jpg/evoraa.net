import { randomBytes } from "crypto"

export const ADMIN_PAYMENT_LINK_PRODUCT = "admin_link" as const

/** Paiement hors produits membre (coaching, prestations externes, etc.). */
export function isIndependentPaymentMetadata(metadata: unknown): boolean {
  if (!metadata || typeof metadata !== "object") return false
  return (metadata as { product?: string }).product === ADMIN_PAYMENT_LINK_PRODUCT
}

export function generatePaymentLinkSlug(): string {
  return randomBytes(8).toString("base64url").slice(0, 12).toLowerCase()
}

export function paymentLinkPublicPath(slug: string): string {
  return `/pay/l/${encodeURIComponent(slug)}`
}

export function paymentLinkAbsoluteUrl(slug: string, appBaseUrl: string): string {
  const base = appBaseUrl.replace(/\/$/, "")
  return `${base}${paymentLinkPublicPath(slug)}`
}

export type AdminPaymentLinkDurationType = "permanent" | "temporary"

/** Durées proposées pour un lien temporaire (heures). */
export const TEMPORARY_LINK_DURATION_HOURS = {
  h24: 24,
  d7: 24 * 7,
  d30: 24 * 30,
} as const

export type TemporaryLinkDurationKey = keyof typeof TEMPORARY_LINK_DURATION_HOURS

export function computePaymentLinkExpiresAt(
  durationType: AdminPaymentLinkDurationType,
  temporaryHours?: number | null
): string | null {
  if (durationType !== "temporary") return null
  const hours = temporaryHours ?? TEMPORARY_LINK_DURATION_HOURS.d7
  if (!Number.isFinite(hours) || hours < 1) return null
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
}

export function isAdminPaymentLinkExpired(input: {
  expiresAt: string | null | undefined
  status?: string | null
}): boolean {
  if (input.status === "expired") return true
  if (!input.expiresAt) return false
  return new Date(input.expiresAt).getTime() <= Date.now()
}

export function adminPaymentLinkDurationLabel(input: {
  durationType: AdminPaymentLinkDurationType
  expiresAt: string | null
}): string {
  if (input.durationType === "permanent") return "Permanent"
  if (!input.expiresAt) return "Temporaire"
  if (isAdminPaymentLinkExpired({ expiresAt: input.expiresAt })) return "Expiré"
  return `Expire le ${new Date(input.expiresAt).toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })}`
}
