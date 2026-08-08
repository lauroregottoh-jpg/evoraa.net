/**
 * Prefill Couple depuis dimensions Découverte / Alliance (logique inline).
 */
import { describe, it } from "node:test"
import assert from "node:assert/strict"

function scoreToLikert(score0to100) {
  const v = Math.round(1 + (Math.max(0, Math.min(100, score0to100)) / 100) * 4)
  return Math.max(1, Math.min(5, v))
}

function buildSuggestions(psychometric) {
  if (!psychometric || typeof psychometric !== "object") return []
  const dims = psychometric.dimensions
  if (!dims || typeof dims !== "object") return []
  const map = [
    ["communication", "relationship", "communication"],
    ["conflits", "relationship", "conflict"],
    ["finances", "finances", "management"],
    ["spiritualite", "spiritual", "faith_importance"],
  ]
  const out = []
  for (const [dim, pillar, key] of map) {
    const raw = dims[pillar]?.[key]
    if (typeof raw !== "number") continue
    out.push({ dimension: dim, value: scoreToLikert(raw), pillarScore: Math.round(raw) })
  }
  return out
}

describe("couple prefill from alliance/decouverte", () => {
  it("maps pillar scores to likert 1–5", () => {
    assert.equal(scoreToLikert(0), 1)
    assert.equal(scoreToLikert(100), 5)
    assert.equal(scoreToLikert(50), 3)
  })

  it("builds suggestions when dimensions exist", () => {
    const suggestions = buildSuggestions({
      dimensions: {
        relationship: { communication: 80, conflict: 55 },
        finances: { management: 45 },
        spiritual: { faith_importance: 85 },
      },
    })
    assert.equal(suggestions.length, 4)
    for (const s of suggestions) {
      assert.ok(s.value >= 1 && s.value <= 5)
    }
  })

  it("returns empty without psychometric dimensions", () => {
    assert.equal(buildSuggestions(null).length, 0)
    assert.equal(buildSuggestions({}).length, 0)
  })
})
