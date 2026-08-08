/**
 * EVA guardrails — tripwire source (sans import @/ path alias).
 */
import assert from "node:assert/strict"
import { readFileSync, existsSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, it } from "node:test"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const engine = join(root, "src/lib/eva/engine.ts")

describe("EVA guardrails shape", () => {
  it("engine présent avec crise + interdits + fallback local", () => {
    assert.ok(existsSync(engine))
    const src = readFileSync(engine, "utf8")
    assert.match(src, /CRISIS_PATTERNS/)
    assert.match(src, /suicid/)
    assert.match(src, /source:\s*"crisis"/)
    assert.match(src, /FORBIDDEN/)
    assert.match(src, /bitcoin/)
    assert.match(src, /contact@keliaa\.org/)
    assert.match(src, /callOpenAI/)
    assert.match(src, /knowledgeHits/)
    assert.match(src, /secours locaux/)
  })

  it("askEvaAction + quotas branchés", () => {
    const action = readFileSync(join(root, "src/app/actions/eva.ts"), "utf8")
    assert.match(action, /export async function askEvaAction/)
    assert.match(action, /RL\.eva/)
    assert.match(action, /runEvaEngine/)
    assert.match(action, /EVA_COUNTER_KEY/)
  })

  it("docs eva runtime présents", () => {
    for (const f of [
      "docs/eva/10_system_prompt.md",
      "docs/eva/09_guardrails.md",
      "docs/eva/06_faq.md",
    ]) {
      assert.ok(existsSync(join(root, f)), f)
    }
  })
})
