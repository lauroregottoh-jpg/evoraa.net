import { createHmac, timingSafeEqual } from "crypto"
import type { NextRequest } from "next/server"

/**
 * Auth webhooks paiements — functions pures testables (CI).
 */

export function safeEqualString(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ba.length !== bb.length) return false
  return timingSafeEqual(ba, bb)
}

/** Bictorys: header x-secret-key OU HMAC x-webhook-signature + timestamp. */
export function verifyBictorysWebhookAuth(input: {
  secret: string
  staticTokenHeader: string
  signatureHeader: string
  timestampHeader: string
  rawBody: string
  /** Max skew pour anti-replay (ms). 0 = désactivé. */
  maxSkewMs?: number
  nowMs?: number
}): { ok: true } | { ok: false; error: string } {
  const secret = input.secret
  if (!secret) return { ok: false, error: "BICTORYS_WEBHOOK_SECRET manquant" }

  if (input.staticTokenHeader) {
    if (safeEqualString(input.staticTokenHeader, secret)) return { ok: true }
    return { ok: false, error: "Secret webhook invalide" }
  }

  const sig = input.signatureHeader
  const ts = input.timestampHeader
  if (!sig || !ts) return { ok: false, error: "Signature webhook manquante" }

  const maxSkew = input.maxSkewMs ?? 5 * 60 * 1000
  if (maxSkew > 0) {
    const tsNum = Number(ts)
    const now = input.nowMs ?? Date.now()
    // Accept seconds or ms
    const tsMs = tsNum < 1e12 ? tsNum * 1000 : tsNum
    if (!Number.isFinite(tsMs) || Math.abs(now - tsMs) > maxSkew) {
      return { ok: false, error: "Timestamp webhook expiré" }
    }
  }

  const expected = createHmac("sha256", secret)
    .update(`${ts}.${input.rawBody}`)
    .digest("hex")
  if (!safeEqualString(sig, expected)) {
    return { ok: false, error: "Signature webhook invalide" }
  }
  return { ok: true }
}

export function readBictorysAuthFromRequest(
  request: NextRequest,
  rawBody: string,
  secret: string | undefined
) {
  return verifyBictorysWebhookAuth({
    secret: secret || "",
    staticTokenHeader: request.headers.get("x-secret-key") || "",
    signatureHeader: request.headers.get("x-webhook-signature") || "",
    timestampHeader: request.headers.get("x-webhook-timestamp") || "",
    rawBody,
  })
}

/**
 * Moneroo : HMAC-SHA256 hex du raw body avec MONEROO_WEBHOOK_SECRET.
 * Header : X-Moneroo-Signature
 */
export function verifyMonerooWebhookAuth(input: {
  webhookSecret: string
  signatureHeader: string
  rawBody: string
}): { ok: true } | { ok: false; error: string } {
  if (!input.webhookSecret) {
    return { ok: false, error: "MONEROO_WEBHOOK_SECRET manquant" }
  }
  if (!input.signatureHeader) {
    return { ok: false, error: "Signature Moneroo manquante" }
  }
  const expected = createHmac("sha256", input.webhookSecret)
    .update(input.rawBody)
    .digest("hex")
  const presented = input.signatureHeader.replace(/^sha256=/i, "").trim()
  if (!safeEqualString(presented, expected)) {
    return { ok: false, error: "Signature Moneroo invalide" }
  }
  return { ok: true }
}
