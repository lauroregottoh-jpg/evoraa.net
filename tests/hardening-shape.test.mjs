/**
 * Shape tests — contrats Evoora-style (CI tripwire).
 * Empêche de retirer headers / smoke / env example / crons sans le faire exprès.
 */
import assert from "node:assert/strict"
import { readFileSync, existsSync, readdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, it } from "node:test"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

function read(rel) {
  const p = join(root, rel)
  assert.ok(existsSync(p), `fichier manquant : ${rel}`)
  return readFileSync(p, "utf8")
}

describe("CI shape — hardening P0/P1", () => {
  it("next.config expose les security headers", () => {
    const src = read("next.config.ts")
    assert.match(src, /Strict-Transport-Security/)
    assert.match(src, /X-Frame-Options/)
    assert.match(src, /X-Content-Type-Options/)
    assert.match(src, /Permissions-Policy/)
    assert.match(src, /async headers\(/)
  })

  it("instrumentation.ts enregistre env + onRequestError", () => {
    const src = read("src/instrumentation.ts")
    assert.match(src, /assertEnvSoft|getEnv/)
    assert.match(src, /onRequestError/)
  })

  it(".env.local.example documente les clés critiques", () => {
    const src = read(".env.local.example")
    assert.match(src, /NEXT_PUBLIC_SUPABASE_URL/)
    assert.match(src, /NEXT_PUBLIC_APP_URL/)
    assert.match(src, /BICTORYS_WEBHOOK_SECRET/)
    assert.match(src, /SENTRY_DSN/)
    assert.match(src, /CRON_SECRET/)
  })

  it("vercel.json a les crons ops", () => {
    const src = read("vercel.json")
    assert.match(src, /subscription-reminders/)
    assert.match(src, /email-outbox/)
    assert.match(src, /profile-reminders/)
  })

  it("migrations timestamps uniques (pas de collision 00022/00023)", () => {
    const dir = join(root, "supabase/migrations")
    const files = readdirSync(dir).filter((f) => f.endsWith(".sql"))
    const prefixes = files.map((f) => f.slice(0, 14))
    const dupes = prefixes.filter((p, i) => prefixes.indexOf(p) !== i)
    assert.deepEqual(dupes, [], `timestamps en double: ${dupes.join(", ")}`)
  })

  it("admin audit helper + migration présents", () => {
    const helper = read("src/lib/admin/audit.ts")
    assert.match(helper, /logAdminAction/)
    assert.ok(
      existsSync(join(root, "supabase/migrations/20240101000026_admin_audit_log.sql"))
    )
  })

  it("env zod module présent", () => {
    const src = read("src/lib/config/env.ts")
    assert.match(src, /getEnv/)
    assert.match(src, /z\.object/)
  })

  it("CODEOWNERS couvre auth", () => {
    const src = read(".github/CODEOWNERS")
    assert.match(src, /src\/app\/actions\/auth\.ts/)
  })
})
