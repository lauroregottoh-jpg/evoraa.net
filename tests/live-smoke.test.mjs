/**
 * Smoke live optionnel — ne casse pas la CI si le réseau / prod est down.
 * ACTIVE avec : LIVE_SMOKE=1 npm run test:smoke
 */
import assert from "node:assert/strict"
import { describe, it } from "node:test"

const enabled = process.env.LIVE_SMOKE === "1"
const base = (process.env.LIVE_SMOKE_URL || "https://www.keliaa.org").replace(/\/$/, "")

describe("Live smoke (optionnel)", { skip: !enabled }, () => {
  it("GET / répond 200", async () => {
    const res = await fetch(`${base}/`, { redirect: "follow" })
    assert.equal(res.status, 200)
  })

  it("pages auth accessibles", async () => {
    for (const path of ["/login", "/register"]) {
      const res = await fetch(`${base}${path}`, { redirect: "follow" })
      assert.ok(res.status < 500, `${path} → ${res.status}`)
    }
  })

  it("manifest PWA servi", async () => {
    const res = await fetch(`${base}/manifest.webmanifest`)
    assert.ok(res.status < 500, `manifest → ${res.status}`)
    if (res.ok) {
      const body = await res.text()
      assert.match(body, /KELIAA|keliaa/i)
    }
  })

  it("health config répond (sans secrets)", async () => {
    const res = await fetch(`${base}/api/health/config`)
    assert.ok(res.status < 500, `health → ${res.status}`)
  })
})
