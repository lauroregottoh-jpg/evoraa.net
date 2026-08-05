/**
 * Unit tests — auth webhooks Bictorys / CinetPay (lot B).
 */
import assert from "node:assert/strict"
import { createHmac } from "node:crypto"
import { describe, it } from "node:test"
import {
  safeEqualString,
  verifyBictorysWebhookAuth,
  verifyCinetPayWebhookAuth,
} from "../src/lib/billing/webhookAuth.ts"

describe("webhookAuth — Bictorys", () => {
  const secret = "test-webhook-secret-32chars-min!!"

  it("accepte x-secret-key égal au secret", () => {
    const r = verifyBictorysWebhookAuth({
      secret,
      staticTokenHeader: secret,
      signatureHeader: "",
      timestampHeader: "",
      rawBody: "{}",
    })
    assert.equal(r.ok, true)
  })

  it("refuse x-secret-key incorrect (pas de fallback HMAC)", () => {
    const r = verifyBictorysWebhookAuth({
      secret,
      staticTokenHeader: "wrong",
      signatureHeader: "anything",
      timestampHeader: "1",
      rawBody: "{}",
    })
    assert.equal(r.ok, false)
  })

  it("accepte HMAC timestamp.body", () => {
    const rawBody = JSON.stringify({ status: "succeeded" })
    const ts = String(Math.floor(Date.now() / 1000))
    const sig = createHmac("sha256", secret).update(`${ts}.${rawBody}`).digest("hex")
    const r = verifyBictorysWebhookAuth({
      secret,
      staticTokenHeader: "",
      signatureHeader: sig,
      timestampHeader: ts,
      rawBody,
    })
    assert.equal(r.ok, true)
  })

  it("refuse timestamp hors fenêtre anti-replay", () => {
    const rawBody = "{}"
    const ts = String(Math.floor(Date.now() / 1000) - 3600)
    const sig = createHmac("sha256", secret).update(`${ts}.${rawBody}`).digest("hex")
    const r = verifyBictorysWebhookAuth({
      secret,
      staticTokenHeader: "",
      signatureHeader: sig,
      timestampHeader: ts,
      rawBody,
      maxSkewMs: 60_000,
    })
    assert.equal(r.ok, false)
  })
})

describe("webhookAuth — CinetPay", () => {
  it("api_check_only si pas de token configuré", () => {
    const r = verifyCinetPayWebhookAuth({ webhookToken: "", presentedHeader: "" })
    assert.equal(r.ok, true)
    if (r.ok) assert.equal(r.mode, "api_check_only")
  })

  it("header OK si secret match", () => {
    const r = verifyCinetPayWebhookAuth({
      webhookToken: "tok",
      presentedHeader: "tok",
    })
    assert.equal(r.ok, true)
    if (r.ok) assert.equal(r.mode, "header")
  })

  it("refuse header incorrect", () => {
    const r = verifyCinetPayWebhookAuth({
      webhookToken: "tok",
      presentedHeader: "bad",
    })
    assert.equal(r.ok, false)
  })
})

describe("safeEqualString", () => {
  it("compare en temps constant (lengths égales)", () => {
    assert.equal(safeEqualString("abc", "abc"), true)
    assert.equal(safeEqualString("abc", "abd"), false)
    assert.equal(safeEqualString("a", "ab"), false)
  })
})
