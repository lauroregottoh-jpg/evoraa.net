/**
 * D5 — admin audit list + rate-limit shape.
 */
import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

describe("admin audit D5", () => {
  it("audit module exports list + log", () => {
    const src = readFileSync(join(root, "src/lib/admin/audit.ts"), "utf8")
    assert.match(src, /logAdminAction/)
    assert.match(src, /listAdminAuditLog/)
    assert.match(src, /admin_audit_log/)
  })

  it("requireAdmin enforces per-userId rate limit", () => {
    const src = readFileSync(join(root, "src/app/actions/admin.ts"), "utf8")
    assert.match(src, /RL\.adminUserId/)
    assert.match(src, /adminListAuditLog/)
    assert.match(src, /action: "moderation_status"/)
    assert.match(src, /action: "create_member"/)
    assert.match(src, /action: "resolve_report"/)
  })

  it("rateLimit preset adminUserId = 100/min", () => {
    const src = readFileSync(join(root, "src/lib/security/rateLimit.ts"), "utf8")
    assert.match(src, /adminUserId/)
    assert.match(src, /limit:\s*100/)
  })

  it("console mounts AdminOpsAuditPanel", () => {
    const src = readFileSync(
      join(root, "src/components/admin/AdminConsole.tsx"),
      "utf8"
    )
    assert.match(src, /AdminOpsAuditPanel/)
  })
})
