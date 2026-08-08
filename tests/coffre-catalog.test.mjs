/**
 * Shape — catalogue Coffre synchronisé avec docs/COFFRE PREMIUM.
 */
import assert from "node:assert/strict"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, it } from "node:test"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

function fold(s) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

describe("Coffre catalogue", () => {
  it("resources.ts liste au moins 15 entrées et catégorie famille", () => {
    const src = readFileSync(join(root, "src/lib/coffre/resources.ts"), "utf8")
    assert.match(src, /famille/)
    assert.match(src, /getCoffreStats/)
    const ids = [...src.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1])
    assert.ok(ids.length >= 15, `expected >=15 resources, got ${ids.length}`)
  })

  it("PDFs source présents pour les nouveaux titres clés", () => {
    const dir = join(root, "docs", "COFFRE PREMIUM")
    assert.ok(existsSync(dir), "docs/COFFRE PREMIUM manquant")
    const files = readdirSync(dir).map(fold)
    for (const needle of [
      "30 jours",
      "17 types",
      "50 proclamations",
      "journal de priere",
      "45 signes",
    ]) {
      const n = fold(needle)
      assert.ok(
        files.some((f) => f.includes(n)),
        `PDF manquant proche de: ${needle}`
      )
    }
  })
})
