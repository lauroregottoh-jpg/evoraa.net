/**
 * D9 — subscription reminders cron batch emails.
 */
import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

describe("D9 subscription reminders batch", () => {
  it("cron uses getAuthEmailsBatch and bulk notifications", () => {
    const src = readFileSync(
      join(root, "src/app/api/cron/subscription-reminders/route.ts"),
      "utf8"
    )
    assert.match(src, /getAuthEmailsBatch/)
    assert.match(src, /\.from\("notifications"\)\.insert\(notifRows\)/)
    assert.match(src, /\.limit\(300\)/)
    assert.doesNotMatch(src, /getUserById\(\s*\n?\s*sub\.user_id/)
  })

  it("migration 00028 defines batch RPC", () => {
    const src = readFileSync(
      join(root, "supabase/migrations/20240101000028_auth_email_batch.sql"),
      "utf8"
    )
    assert.match(src, /get_auth_users_email_batch/)
    assert.match(src, /GRANT EXECUTE.*service_role/s)
  })
})
