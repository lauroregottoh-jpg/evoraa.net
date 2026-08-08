#!/usr/bin/env node
/**
 * Chasse bugs locale / CI — shape + smoke, sans toucher la prod.
 * Usage: node scripts/daily-bug-hunt.mjs
 * Avec probe live: LIVE_SMOKE=1 node scripts/daily-bug-hunt.mjs
 */
import { spawnSync } from "node:child_process"
import { existsSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

function mustExist(rel) {
  const p = join(root, rel)
  if (!existsSync(p)) {
    console.error(`[FAIL] missing ${rel}`)
    process.exitCode = 1
    return false
  }
  console.log(`[OK] ${rel}`)
  return true
}

console.log("=== KELIAA daily bug hunt (local/CI) ===")

const files = [
  "src/app/api/cron/capacity-check/route.ts",
  "src/app/api/cron/daily-bug-hunt/route.ts",
  "src/lib/ops/capacityCheck.ts",
  "src/lib/ops/dailyBugHunt.ts",
  "public/manifest.webmanifest",
  "public/sw.js",
  "docs/OPS_CAPACITY_ALERTS.md",
  "docs/OPS_DAILY_BUG_HUNT.md",
]

let ok = true
for (const f of files) {
  if (!mustExist(f)) ok = false
}

const smoke = spawnSync(
  process.execPath,
  ["--experimental-strip-types", "--test", "tests/**/*.test.mjs"],
  { cwd: root, stdio: "inherit", shell: true }
)
if (smoke.status !== 0) {
  ok = false
  console.error("[FAIL] test:smoke")
} else {
  console.log("[OK] test:smoke")
}

if (process.env.LIVE_SMOKE === "1") {
  console.log("[info] LIVE_SMOKE=1 — live checks inclus dans test:smoke")
}

if (!ok) {
  console.error("=== FAIL — revoir avant deploy ===")
  process.exit(1)
}
console.log("=== OK — allowlist ops only; auth/payments untouched ===")
