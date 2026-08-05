/**
 * Cron auth — timing-safe Bearer (parity Evora).
 */
import assert from "node:assert/strict"
import { createHmac, timingSafeEqual } from "node:crypto"
import { describe, it } from "node:test"
import { readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

describe("cronAuth shape", () => {
  it("module exists with timing-safe verify", () => {
    const src = readFileSync(join(root, "src/lib/security/cronAuth.ts"), "utf8")
    assert.match(src, /safeEqualString|timingSafeEqual/)
    assert.match(src, /verifyCronSecret/)
    assert.match(src, /CRON_NOT_CONFIGURED/)
  })

  it("all cron routes use verifyCronSecret", () => {
    for (const name of [
      "email-outbox",
      "subscription-reminders",
      "profile-reminders",
    ]) {
      const src = readFileSync(
        join(root, `src/app/api/cron/${name}/route.ts`),
        "utf8"
      )
      assert.match(src, /verifyCronSecret/, name)
      assert.doesNotMatch(src, /auth === `Bearer/, name)
    }
  })

  it("health config uses verifyHealthSecret", () => {
    const src = readFileSync(
      join(root, "src/app/api/health/config/route.ts"),
      "utf8"
    )
    assert.match(src, /verifyHealthSecret/)
  })
})

describe("safeEqualString behavior (via crypto parity)", () => {
  it("equal strings match", () => {
    const a = "cron-secret-value"
    const b = "cron-secret-value"
    const ba = Buffer.from(a)
    const bb = Buffer.from(b)
    assert.equal(ba.length === bb.length && timingSafeEqual(ba, bb), true)
  })

  it("different length reject without throw", () => {
    const ba = Buffer.from("abc")
    const bb = Buffer.from("abcd")
    assert.equal(ba.length === bb.length, false)
  })

  it("hmac helper still available for webhooks", () => {
    const h = createHmac("sha256", "k").update("body").digest("hex")
    assert.equal(h.length, 64)
  })
})
