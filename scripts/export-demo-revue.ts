/**
 * Export Daniel & Naomi demo report to Markdown for editorial review.
 * Run: npx tsx scripts/export-demo-revue.ts
 */
import { mkdirSync, writeFileSync } from "fs"
import { join } from "path"
import {
  buildDemoCoupleReport,
  DEMO_COUPLE_META,
} from "../src/lib/couple/demoReport"
import { sectionBlocksFromLegacy } from "../src/lib/couple/reportBlocks"
import type { CoupleReportBlock } from "../src/lib/couple/reportBlocks"
import type { CoupleReportSection } from "../src/lib/couple/report"
import type { CoupleOfferId } from "../src/lib/couple/offers"

function esc(s: string): string {
  return String(s || "").replace(/\r/g, "")
}

function blocksToMd(blocks: CoupleReportBlock[]): string {
  const lines: string[] = []
  for (const b of blocks || []) {
    if (b.type === "h2") lines.push("", `## ${esc(b.text)}`, "")
    else if (b.type === "paragraph") lines.push(esc(b.text), "")
    else if (b.type === "ol") {
      b.items.forEach((it, i) => lines.push(`${i + 1}. ${esc(it)}`))
      lines.push("")
    } else if (b.type === "ul") {
      b.items.forEach((it) => lines.push(`- ${esc(it)}`))
      lines.push("")
    } else if (b.type === "callout") lines.push(`> ${esc(b.text)}`, "")
    else if (b.type === "scoreChart")
      lines.push(
        `**${esc(b.label)}** — ${b.nameA} **${b.scoreA}%** · ${b.nameB} **${b.scoreB}%** · convergence ${b.convergence}%`,
        ""
      )
    else if (b.type === "fillBlank")
      lines.push(`*À remplir :* ${esc(b.prompt)}`, "", "____", "")
    else if (b.type === "rolePlay") {
      lines.push(
        `### ${esc(b.title)}`,
        "",
        esc(b.scene),
        "",
        `- **A :** ${esc(b.roleA)}`,
        `- **B :** ${esc(b.roleB)}`,
        ""
      )
    }
  }
  return lines.join("\n")
}

function sectionToMd(s: CoupleReportSection, page: number): string {
  const blocks =
    s.blocks?.length
      ? s.blocks
      : sectionBlocksFromLegacy({
          paragraphs: s.paragraphs,
          bullets: s.bullets,
          subtitleBlocks: s.subtitle
            ? [{ type: "h2", text: s.subtitle }]
            : undefined,
        })
  const out = ["", "---", "", `# Carte ${page} — ${esc(s.title)}`]
  if (s.subtitle) out.push("", `_${esc(s.subtitle)}_`)
  out.push("", blocksToMd(blocks))
  return out.join("\n")
}

function exportOffer(offer: CoupleOfferId, filename: string) {
  const doc = buildDemoCoupleReport(offer)
  const label =
    offer === "couple_premium_plus" ? "Premium Plus" : "Essentiel"
  const lines: string[] = []
  lines.push(`# Revue contenu — Daniel & Naomi (${label})`)
  lines.push("")
  lines.push(
    "> **À corriger** — dump brut du moteur actuel pour revue rédaction / mise en forme (charte doc 41)."
  )
  lines.push("")
  lines.push(`- Couple : **${doc.names.nameA} & ${doc.names.nameB}**`)
  lines.push(`- ${DEMO_COUPLE_META.status}`)
  lines.push(
    `- Score global : **${doc.globalScore}%** — ${doc.scoreInterpretation.title}`
  )
  lines.push(`- Offre : \`${doc.offerId}\``)
  lines.push(
    `- Versions : contenu ${doc.versions.content_version} · rapport ${doc.versions.report_version}`
  )
  lines.push(`- Généré : ${doc.versions.generation_date}`)
  lines.push("")
  lines.push("## Méta démo")
  lines.push("")
  lines.push(DEMO_COUPLE_META.note)
  if (doc.safetyNotice) {
    lines.push("", "## Avis sécurité", "", doc.safetyNotice)
  }

  let page = 0
  for (const s of doc.sections) {
    page++
    lines.push(sectionToMd(s, page))
  }
  for (const s of doc.premiumPlusExtras) {
    page++
    lines.push(sectionToMd(s, page))
  }

  page++
  lines.push("", "---", "", `# Carte ${page} — Exercices à vivre ensemble`, "")
  for (const ex of doc.exercises) {
    lines.push(
      `## ${esc(ex.title)}${ex.premiumPlus ? " *(Premium Plus)*" : ""}`,
      ""
    )
    lines.push(`**Objectif —** ${esc(ex.objective)}`, "")
    lines.push(esc(ex.why), "")
    lines.push(`_Durée : ${esc(ex.duration)}_`, "")
    lines.push("### Consignes", "")
    ex.steps.forEach((st, i) => lines.push(`${i + 1}. ${esc(st)}`))
    lines.push("")
    if (ex.questions?.length) {
      lines.push("### Questions", "")
      ex.questions.forEach((q, i) => lines.push(`${i + 1}. ${esc(q)}`))
      lines.push("")
    }
    if (ex.fillPrompts?.length) {
      lines.push("### Zones à remplir", "")
      ex.fillPrompts.forEach((p) => {
        lines.push(`*${esc(p)}*`, "", "____", "")
      })
    }
    if (ex.rolePlay) {
      lines.push(
        `### Jeu de rôle — ${esc(ex.rolePlay.title)}`,
        "",
        esc(ex.rolePlay.scene),
        "",
        `- **${doc.names.nameA} :** ${esc(ex.rolePlay.roleA)}`,
        `- **${doc.names.nameB} :** ${esc(ex.rolePlay.roleB)}`,
        ""
      )
    }
    lines.push(`_${esc(ex.takeaway)}_`, "")
  }

  page++
  lines.push("", "---", "", `# Carte ${page} — Plan d’action`, "")
  for (const step of doc.actionPlan) {
    lines.push(`## Étape ${step.order} — ${esc(step.what)}`, "")
    lines.push(`**Comment —** ${esc(step.how)}`, "")
    lines.push(`**Quand —** ${esc(step.when)}`, "")
    lines.push(`**But —** ${esc(step.goal)}`, "")
    lines.push(`_Signal : ${esc(step.progressSignal)}_`, "")
  }

  lines.push("", "---", "", "# Annexes QA", "")
  lines.push(
    `- engineNotes : ${
      doc.engineNotes?.length ? doc.engineNotes.join(" | ") : "(aucune)"
    }`
  )

  const outDir = join(process.cwd(), "docs", "couple-revue-demo-daniel-naomi")
  mkdirSync(outDir, { recursive: true })
  const path = join(outDir, filename)
  writeFileSync(path, lines.join("\n"), "utf8")
  console.log("wrote", path, "cards≈", page)
}

exportOffer("couple_essential", "01-rapport-essentiel.md")
exportOffer("couple_premium_plus", "02-rapport-premium-plus.md")
