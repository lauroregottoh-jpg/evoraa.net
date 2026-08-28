import { randomBytes } from "crypto"

export const ADMIN_PAYMENT_LINK_PRODUCT = "admin_link" as const

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
