/**
 * Tripwire — chaque cron vercel.json a un route.ts, et réciproquement.
 */
import assert from "node:assert/strict"
import { readFileSync, existsSync, readdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, it } from "node:test"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

describe("vercel cron ↔ routes", () => {
  it("paths dans vercel.json existent sous api/cron", () => {
    const raw = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"))
    const crons = raw.crons || []
    assert.ok(Array.isArray(crons) && crons.length >= 1)
    for (const c of crons) {
      const path = String(c.path || "")
      assert.match(path, /^\/api\/cron\/[a-z0-9-]+$/)
      const slug = path.replace("/api/cron/", "")
      const route = join(root, "src/app/api/cron", slug, "route.ts")
      assert.ok(existsSync(route), `route manquante pour ${path}`)
      const src = readFileSync(route, "utf8")
      assert.match(src, /verifyCronSecret/, `${slug} doit utiliser verifyCronSecret`)
    }
  })

  it("chaque dossier api/cron est déclaré dans vercel.json", () => {
    const raw = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"))
    const declared = new Set(
      (raw.crons || []).map((c) =>
        String(c.path || "").replace("/api/cron/", "")
      )
    )
    const dir = join(root, "src/app/api/cron")
    const folders = readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
    for (const slug of folders) {
      assert.ok(
        declared.has(slug),
        `cron "${slug}" a un route.ts mais n’est pas dans vercel.json`
      )
    }
  })

  it("Sentry soft configs présents", () => {
    for (const f of [
      "sentry.client.config.ts",
      "sentry.server.config.ts",
      "sentry.edge.config.ts",
    ]) {
      assert.ok(existsSync(join(root, f)), f)
      const src = readFileSync(join(root, f), "utf8")
      assert.match(src, /Sentry\.init/)
      assert.match(src, /dsn/)
    }
  })

  it("FAQ compte page existe", () => {
    assert.ok(existsSync(join(root, "src/app/faq/page.tsx")))
    assert.ok(existsSync(join(root, "docs/INVARIANTS.md")))
  })
})
