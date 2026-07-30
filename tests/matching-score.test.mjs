import assert from "node:assert/strict"
import { describe, it } from "node:test"

function normalizeScore(raw, questionCount) {
  const min = questionCount * 1
  const max = questionCount * 5
  if (max === min) return 0
  return Math.round(((raw - min) / (max - min)) * 100)
}

function psychCompat(a, b) {
  const keys = ["personality", "spiritual", "relationship"]
  const parts = []
  for (const key of keys) {
    if (a[key] == null || b[key] == null) continue
    parts.push(100 - Math.abs(Number(a[key]) - Number(b[key])))
  }
  if (!parts.length) return null
  return Math.round(parts.reduce((s, v) => s + v, 0) / parts.length)
}

describe("KELIAA matching smoke", () => {
  it("normalizes likert raw scores to 0-100", () => {
    assert.equal(normalizeScore(12, 12), 0)
    assert.equal(normalizeScore(60, 12), 100)
    assert.equal(normalizeScore(36, 12), 50)
  })

  it("computes psychometric compatibility", () => {
    const score = psychCompat(
      { personality: 80, spiritual: 70, relationship: 90 },
      { personality: 70, spiritual: 70, relationship: 80 }
    )
    assert.equal(score, 93)
  })
})
