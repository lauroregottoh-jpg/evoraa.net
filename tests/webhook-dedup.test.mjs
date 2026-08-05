/**
 * Shape + pure helpers — webhook dedup D2.
 */
import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { buildWebhookExternalKey } from "../src/lib/billing/webhookDedup.ts"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

describe("webhookDedup", () => {
  it("prefer transaction id then payment id", () => {
    assert.equal(
      buildWebhookExternalKey({
        transactionId: "tx_1",
        paymentId: "pay_1",
      }),
      "tx_1"
    )
    assert.equal(
      buildWebhookExternalKey({
        transactionId: "",
        paymentId: "pay_1",
      }),
      "pay_1"
    )
  })

  it("module + routes wired", () => {
    const mod = readFileSync(
      join(root, "src/lib/billing/webhookDedup.ts"),
      "utf8"
    )
    assert.match(mod, /claimWebhookDelivery/)
    assert.match(mod, /markWebhookDeliveryProcessed/)
    assert.match(mod, /webhook_deliveries/)

    for (const name of ["bictorys", "moneroo"]) {
      const src = readFileSync(
        join(root, `src/app/api/payments/${name}/notify/route.ts`),
        "utf8"
      )
      assert.match(src, /claimWebhookDelivery/, name)
      assert.match(src, /markWebhookDeliveryProcessed/, name)
      assert.match(src, /deduped/, name)
    }

    const mig = readFileSync(
      join(
        root,
        "supabase/migrations/20240101000027_webhook_deliveries.sql"
      ),
      "utf8"
    )
    assert.match(mig, /webhook_deliveries/)
    assert.match(mig, /UNIQUE \(provider, external_id, event_type\)/)
  })
})
