/**
 * Unit tests — auth webhooks Bictorys / Moneroo.
 */
import assert from "node:assert/strict"
import { createHmac } from "node:crypto"
import { describe, it } from "node:test"
import {
  safeEqualString,
  verifyBictorysWebhookAuth,
  verifyMonerooWebhookAuth,
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

describe("webhookAuth — Moneroo", () => {
  const secret = "moneroo-whsec-test"
  const rawBody = JSON.stringify({ event: "payment.success", data: { id: "pay_1" } })

  it("accepte signature HMAC body", () => {
    const sig = createHmac("sha256", secret).update(rawBody).digest("hex")
    const r = verifyMonerooWebhookAuth({
      webhookSecret: secret,
      signatureHeader: sig,
      rawBody,
    })
    assert.equal(r.ok, true)
  })

  it("accepte préfixe sha256=", () => {
    const sig = createHmac("sha256", secret).update(rawBody).digest("hex")
    const r = verifyMonerooWebhookAuth({
      webhookSecret: secret,
      signatureHeader: `sha256=${sig}`,
      rawBody,
    })
    assert.equal(r.ok, true)
  })

  it("refuse signature incorrecte", () => {
    const r = verifyMonerooWebhookAuth({
      webhookSecret: secret,
      signatureHeader: "deadbeef",
      rawBody,
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
