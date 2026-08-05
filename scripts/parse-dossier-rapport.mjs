/**
 * Parse docs/DOSSIER RAPPORT.md → src/lib/rapport/recommendations.catalog.ts
 * Run: node scripts/parse-dossier-rapport.mjs
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const srcPath = path.join(root, "docs", "DOSSIER RAPPORT.md")
const outPath = path.join(root, "src", "lib", "rapport", "recommendations.catalog.ts")

const md = fs.readFileSync(srcPath, "utf8")

/** @typedef {{ id: string, pillar: string, domain: string, title: string, whenToUse: string, advice: string, why: string, premium: string, priority?: string, source: string }} Reco */

/** @type {Reco[]} */
const coded = []

function clean(s) {
  return (s || "")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function fieldAfter(block, heading) {
  const re = new RegExp(
    `##\\s*${heading}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|\\n---|$|#\\s*=+|$)`,
    "i"
  )
  const m = block.match(re)
  return m ? clean(m[1]) : ""
}

// --- Format A: REL001–REL028 (## Domaine / Titre / …) ---
{
  const parts = md.split(/(?=#\s*RECOMMANDATION\s+REL\d+)/i)
  for (const part of parts) {
    const idMatch = part.match(/#\s*RECOMMANDATION\s+(REL\d+)/i)
    if (!idMatch) continue
    const id = idMatch[1].toUpperCase()
    const num = Number(id.replace("REL", ""))
    if (num >= 41) continue // handled in format B

    const domain = fieldAfter(part, "Domaine")
    const title = fieldAfter(part, "Titre")
    const whenToUse = fieldAfter(part, "Quand utiliser")
    const advice = fieldAfter(part, "Conseil")
    const why = fieldAfter(part, "Pourquoi")
    const premium = fieldAfter(part, "Version Premium")
    if (!title || !advice) continue

    coded.push({
      id,
      pillar: "relationnel",
      domain: domain || "Général",
      title,
      whenToUse,
      advice,
      why,
      premium,
      source: "dossier_rel_A",
    })
  }
}

// --- Format B: REL041–REL054 ---
{
  const parts = md.split(/(?=#\s*RECOMMANDATION\s+REL(?:0*4[1-9]|0*5[0-4]))/i)
  for (const part of parts) {
    const idMatch =
      part.match(/ID\s*:\s*(REL\d+)/i) ||
      part.match(/#\s*RECOMMANDATION\s+(REL\d+)/i)
    if (!idMatch) continue
    const id = idMatch[1].toUpperCase()
    const num = Number(id.replace("REL", ""))
    if (num < 41 || num > 54) continue

    const domain =
      clean(
        (part.match(/Sous-catégorie\s*:\s*\n([^\n]+)/i) || [])[1] ||
          (part.match(/Sous-catégorie\s*:\s*([^\n]+)/i) || [])[1] ||
          ""
      ) || "Général"

    const title =
      clean((part.match(/Objectif principal\s*:\s*\n([\s\S]*?)(?=\nCompétence|\nConseil)/i) || [])[1]) ||
      clean((part.match(/Compétence développée\s*:\s*\n([^\n]+)/i) || [])[1]) ||
      id

    const whenToUse = clean(
      (part.match(/Utiliser lorsque\s*:\s*\n([\s\S]*?)(?=\nObjectif|\nCompétence|\nConseil)/i) ||
        [])[1] || ""
    )
    const advice = clean(
      (part.match(/Conseil\s*:\s*\n([\s\S]*?)(?=\nPourquoi|\nImpact|\nTemps|\nNiveau|\nExtension|$)/i) ||
        [])[1] || ""
    )
    const why = clean(
      (part.match(
        /Pourquoi(?: cette recommandation)?\s*\??\s*:?\s*\n([\s\S]*?)(?=\nImpact|\nTemps|\nNiveau|\nExtension|\n---|$)/i
      ) || [])[1] || ""
    )
    const premium = clean(
      (part.match(/Extension Premium\s*:\s*\n([\s\S]*?)(?=\n---|\n#\s|$)/i) || [])[1] || ""
    )
    const priority = clean(
      (part.match(/Priorité\s*:\s*\n([^\n]+)/i) || part.match(/Priorité\s*:\s*([^\n]+)/i) || [])[1] ||
        ""
    )

    if (!advice) continue

    coded.push({
      id,
      pillar: "relationnel",
      domain,
      title: title.split("\n")[0].trim(),
      whenToUse,
      advice,
      why,
      premium,
      priority,
      source: "dossier_rel_B",
    })
  }
}

// Deduplicate by id (prefer format A if both somehow)
const byId = new Map()
for (const r of coded) {
  if (!byId.has(r.id)) byId.set(r.id, r)
}
const uniqueCoded = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id))

/** Short bullet banks for non-REL pillars (§3 listes « Recommandations disponibles ») */
function extractBulletBlock(headingAliases) {
  for (const h of headingAliases) {
    // Don't cross another `# ` heading before ### Recommandations
    // (earlier sections reuse the same titles for « Axes d'amélioration »).
    const re = new RegExp(
      `#\\s*${h}\\s*\\n(?:(?!\\n#\\s)[\\s\\S])*?###\\s*Recommandations disponibles\\s*\\n([\\s\\S]*?)(?=\\n---\\s*\\n|\\n#\\s)`,
      "i"
    )
    const m = md.match(re)
    if (m) {
      return m[1]
        .split("\n")
        .map((l) => l.replace(/^\s*-\s*/, "").trim())
        .filter((l) => l.length > 8)
    }
  }
  return []
}

const shortBanks = {
  spirituel: extractBulletBlock(["PROFIL SPIRITUEL"]),
  projets_de_vie: extractBulletBlock(["PROJETS DE VIE"]),
  valeurs: extractBulletBlock(["SYSTÈME DE VALEURS", "VALEURS"]),
  humain: extractBulletBlock(["PROFIL HUMAIN"]),
}

/** @type {Reco[]} */
const shortCoded = []
const pillarPrefix = {
  spirituel: "SPI",
  projets_de_vie: "PRJ",
  valeurs: "VAL",
  humain: "HUM",
}

for (const [pillar, bullets] of Object.entries(shortBanks)) {
  const prefix = pillarPrefix[pillar]
  bullets.forEach((advice, i) => {
    const n = String(i + 1).padStart(3, "0")
    shortCoded.push({
      id: `${prefix}${n}`,
      pillar,
      domain: "Général",
      title: advice.replace(/\.$/, ""),
      whenToUse: `Utiliser lorsque le pilier « ${pillar} » est un axe de développement.`,
      advice: advice.endsWith(".") ? advice : `${advice}.`,
      why: "",
      premium: "",
      source: "dossier_short_list",
    })
  })
}

const all = [...uniqueCoded, ...shortCoded]

const ts = `/**
 * AUTO-GENERATED from docs/DOSSIER RAPPORT.md
 * Do not edit by hand — run: node scripts/parse-dossier-rapport.mjs
 * Generated: ${new Date().toISOString()}
 */

import type { ReportPillarId } from "@/lib/rapport/pillars"

export type OfficialRecommendation = {
  id: string
  pillar: ReportPillarId
  domain: string
  title: string
  whenToUse: string
  advice: string
  why: string
  premium: string
  priority?: string
  source: string
}

export const OFFICIAL_RECOMMENDATIONS: OfficialRecommendation[] = ${JSON.stringify(all, null, 2)} as OfficialRecommendation[]

export const RECOS_BY_PILLAR: Record<ReportPillarId, OfficialRecommendation[]> = {
  relationnel: OFFICIAL_RECOMMENDATIONS.filter((r) => r.pillar === "relationnel"),
  spirituel: OFFICIAL_RECOMMENDATIONS.filter((r) => r.pillar === "spirituel"),
  projets_de_vie: OFFICIAL_RECOMMENDATIONS.filter((r) => r.pillar === "projets_de_vie"),
  valeurs: OFFICIAL_RECOMMENDATIONS.filter((r) => r.pillar === "valeurs"),
  humain: OFFICIAL_RECOMMENDATIONS.filter((r) => r.pillar === "humain"),
}
`

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, ts, "utf8")

console.log(
  JSON.stringify(
    {
      codedRel: uniqueCoded.length,
      short: Object.fromEntries(
        Object.entries(shortBanks).map(([k, v]) => [k, v.length])
      ),
      total: all.length,
      out: path.relative(root, outPath),
    },
    null,
    2
  )
)
