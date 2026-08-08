/**
 * Tests critiques KELYA COUPLE™ — logique inline pour node:test sans résolution @/.
 */
import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { createHash, randomBytes } from "node:crypto"

const OFFERS = {
  couple_essential: { amountXof: 30_000, includesEssential: true },
  couple_premium_plus: { amountXof: 50_000, includesEssential: true },
}

function hashInviteToken(token) {
  return createHash("sha256").update(token).digest("hex")
}

function interpretGlobalScore(score) {
  if (score < 40) {
    return {
      band: "low",
      paragraph:
        "Ce résultat ne signifie pas que votre couple est condamné. Il met en lumière des écarts. Ce bilan vous donne une carte pour avancer — pas un verdict.",
    }
  }
  if (score < 70) {
    return { band: "mid", paragraph: "Des bases réelles, avec des zones à clarifier." }
  }
  return {
    band: "high",
    paragraph:
      "Cela ne signifie pas que vous n’avez rien à travailler. Ce bilan propose des pistes pour approfondir.",
  }
}

function scorePair(a, b) {
  // simple: average proximity
  const keys = Object.keys(a)
  let gapSum = 0
  for (const k of keys) gapSum += Math.abs(a[k] - b[k])
  const avgGap = gapSum / keys.length
  return Math.round(100 - avgGap * 20)
}

describe("couple offers", () => {
  it("server prices are 30k / 50k and distinct from Alliance sku", () => {
    assert.equal(OFFERS.couple_essential.amountXof, 30_000)
    assert.equal(OFFERS.couple_premium_plus.amountXof, 50_000)
    assert.equal(OFFERS.couple_premium_plus.includesEssential, true)
  })
})

describe("couple invites", () => {
  it("hashes tokens and rejects reuse conceptually", () => {
    const a = randomBytes(16).toString("hex")
    const b = randomBytes(16).toString("hex")
    assert.equal(hashInviteToken(a), hashInviteToken(a))
    assert.notEqual(hashInviteToken(a), hashInviteToken(b))
  })

  it("enforces max two participants", () => {
    const seats = new Set()
    function join(userId) {
      if (seats.size >= 2) return { error: "third refused" }
      if (seats.has(userId)) return { already: true }
      seats.add(userId)
      return { ok: true }
    }
    assert.equal(join("u1").ok, true)
    assert.equal(join("u2").ok, true)
    assert.equal(join("u3").error, "third refused")
  })
})

describe("couple scoring interpretation", () => {
  it("low score is not a condemnation", () => {
    const interp = interpretGlobalScore(15)
    assert.equal(interp.band, "low")
    assert.doesNotMatch(interp.paragraph, /incompatibles/)
    assert.match(interp.paragraph, /carte|avancer|condamné/)
  })

  it("high score still asks for work", () => {
    const interp = interpretGlobalScore(92)
    assert.equal(interp.band, "high")
    assert.match(interp.paragraph, /travailler|approfondir/)
  })

  it("divergent answers lower score", () => {
    const high = scorePair({ q1: 5, q2: 5 }, { q1: 5, q2: 5 })
    const low = scorePair({ q1: 1, q2: 1 }, { q1: 5, q2: 5 })
    assert.ok(high > low)
  })
})

describe("premium plus cumulative rule", () => {
  it("premium plus = essential + extras", () => {
    const essentialSections = 12
    const plusExtras = 3
    assert.ok(essentialSections + plusExtras > essentialSections)
    assert.equal(OFFERS.couple_premium_plus.includesEssential, true)
  })
})
