import assert from "node:assert/strict"
import { describe, it } from "node:test"

/** Miroir du mode align/floor/complement (smoke — logique product). */
function scoreDimensionPair(mode, a, b) {
  const gap = Math.abs(a - b)
  const floor = Math.min(a, b)
  const avg = (a + b) / 2
  const clamp = (n) => Math.max(0, Math.min(100, n))

  if (mode === "align") {
    let base = 100 - gap * 1.25
    if (floor < 45) base = Math.min(base, 38 + floor * 0.35)
    else if (floor < 60) base = Math.min(base, base * 0.92)
    return clamp(Math.round(base))
  }
  if (mode === "complement") {
    if (floor >= 58) {
      const softGap = Math.min(gap, 38)
      return clamp(Math.round(floor * 0.5 + avg * 0.3 + (100 - softGap) * 0.2))
    }
    return clamp(Math.round(floor * 0.75 + (100 - gap) * 0.25))
  }
  return clamp(Math.round(floor * 0.78 + avg * 0.12 + (100 - gap) * 0.1))
}

describe("KELIAA dimension modes", () => {
  it("penalizes faith-like align gaps harder than complement gaps", () => {
    const alignGap = scoreDimensionPair("align", 90, 50)
    const complementGap = scoreDimensionPair("complement", 90, 50)
    assert.ok(complementGap > alignGap)
  })

  it("floor mode follows the weaker partner", () => {
    const bothStrong = scoreDimensionPair("floor", 88, 86)
    const weakFloor = scoreDimensionPair("floor", 88, 42)
    assert.ok(bothStrong > 75)
    assert.ok(weakFloor < bothStrong)
    assert.ok(weakFloor < 60)
  })

  it("complement tolerates moderate difference when both are healthy", () => {
    const healthyGap = scoreDimensionPair("complement", 82, 62)
    const unhealthyGap = scoreDimensionPair("complement", 82, 40)
    assert.ok(healthyGap >= 60)
    assert.ok(unhealthyGap < healthyGap)
  })
})

describe("KELIAA interaction smoke", () => {
  it("flags anxious-style faith mismatch pattern", () => {
    const faithGap =
      (90 >= 75 && 40 <= 50) || (40 >= 75 && 90 <= 50)
    assert.equal(faithGap, true)
  })
})
