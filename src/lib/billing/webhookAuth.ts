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
 * CinetPay : secret header si présent ; sinon mode api_check_only
 * (activation toujours conditionnée au Payment Check API).
 */
export function verifyCinetPayWebhookAuth(input: {
  webhookToken: string
  presentedHeader: string
}):
  | { ok: true; mode: "header" | "api_check_only" }
  | { ok: false; error: string } {
  if (!input.webhookToken) {
    return { ok: true, mode: "api_check_only" }
  }
  if (!input.presentedHeader) {
    return { ok: true, mode: "api_check_only" }
  }
  if (!safeEqualString(input.presentedHeader, input.webhookToken)) {
    return { ok: false, error: "Secret webhook invalide" }
  }
  return { ok: true, mode: "header" }
}
