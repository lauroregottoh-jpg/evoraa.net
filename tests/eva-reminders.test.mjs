/**
 * Unit tests — rappels Eva (priorité + titres stables pour dédup cron).
 */
import assert from "node:assert/strict"
import { readFileSync, existsSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, it } from "node:test"
import {
  buildEvaReminders,
  pickPrimaryEvaReminder,
  evaReminderTitle,
} from "../src/lib/eva/reminders.ts"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

describe("Eva reminders", () => {
  it("priorise champs manquants puis tests puis photo", () => {
    const list = buildEvaReminders({
      firstName: "Awa",
      missingFields: ["Photo", "Ville"],
      hasAvatar: false,
      pillarsCompleted: 2,
      moderationStatus: "pending",
    })
    const primary = pickPrimaryEvaReminder(list)
    assert.equal(primary?.kind, "missing_fields")
    assert.match(primary?.title || "", /^Eva ·/)
    assert.match(primary?.body || "", /Awa/)
  })

  it("rappelle les tests si fiche OK sans photo seule", () => {
    const list = buildEvaReminders({
      firstName: "Jean",
      missingFields: [],
      hasAvatar: true,
      pillarsCompleted: 3,
      moderationStatus: "approved",
    })
    const primary = pickPrimaryEvaReminder(list)
    assert.equal(primary?.kind, "missing_tests")
    assert.equal(primary?.title, evaReminderTitle("missing_tests"))
  })

  it("cron profile-reminders utilise la voix Eva", () => {
    const p = join(root, "src/app/api/cron/profile-reminders/route.ts")
    assert.ok(existsSync(p))
    const src = readFileSync(p, "utf8")
    assert.match(src, /buildEvaReminders/)
    assert.match(src, /pickPrimaryEvaReminder/)
    assert.match(src, /voice: \"eva\"/)
  })
})
