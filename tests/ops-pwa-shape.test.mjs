/**
 * Shape — capacité + bug hunt + PWA.
 */
import assert from "node:assert/strict"
import { readFileSync, existsSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, it } from "node:test"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

describe("Ops capacity + bug hunt + PWA shape", () => {
  it("crons capacity-check et daily-bug-hunt déclarés", () => {
    const raw = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"))
    const paths = (raw.crons || []).map((c) => c.path)
    assert.ok(paths.includes("/api/cron/capacity-check"))
    assert.ok(paths.includes("/api/cron/daily-bug-hunt"))
  })

  it("modules ops présents", () => {
    for (const f of [
      "src/lib/ops/capacityThresholds.ts",
      "src/lib/ops/capacityCheck.ts",
      "src/lib/ops/dailyBugHunt.ts",
      "src/lib/ops/bugHuntTypes.ts",
      "src/components/admin/AdminOpsHealthBanner.tsx",
      "scripts/daily-bug-hunt.mjs",
      "docs/OPS_CAPACITY_ALERTS.md",
      "docs/OPS_DAILY_BUG_HUNT.md",
    ]) {
      assert.ok(existsSync(join(root, f)), f)
    }
  })

  it("PWA manifest + SW + register", () => {
    assert.ok(existsSync(join(root, "public/manifest.webmanifest")))
    assert.ok(existsSync(join(root, "public/sw.js")))
    const sw = readFileSync(join(root, "public/sw.js"), "utf8")
    assert.match(sw, /navigate/)
    assert.match(sw, /\/api\//)
    assert.ok(existsSync(join(root, "src/components/pwa/RegisterServiceWorker.tsx")))
    assert.ok(existsSync(join(root, "src/components/pwa/PwaInstallHint.tsx")))
    const layout = readFileSync(join(root, "src/app/layout.tsx"), "utf8")
    assert.match(layout, /manifest\.webmanifest/)
    assert.match(layout, /RegisterServiceWorker/)
  })

  it("migration D8 privacy profiles présente", () => {
    assert.ok(
      existsSync(
        join(root, "supabase/migrations/20240101000032_profiles_select_privacy.sql")
      )
    )
  })
})
