"use client"

import * as React from "react"
import Link from "next/link"
import { CouplePageFrame } from "@/components/couple/CouplePageFrame"
import { CoupleShell } from "@/components/couple/CoupleShell"
import { CoupleDeadlineBanner } from "@/components/couple/CoupleDeadlineBanner"
import { CoupleRequirePaid } from "@/components/couple/CoupleRequirePaid"
import { getCoupleReportAction } from "@/app/actions/couple"
import type { CoupleReportDocument } from "@/lib/couple/report"
import type { CoupleReportBlock } from "@/lib/couple/reportBlocks"
import { sectionBlocksFromLegacy } from "@/lib/couple/reportBlocks"

function renderBlocks(blocks: CoupleReportBlock[]): string {
  return blocks
    .map((b) => {
      if (b.type === "h2") return `<h3>${b.text}</h3>`
      if (b.type === "paragraph") return `<p>${b.text}</p>`
      if (b.type === "ol")
        return `<ol>${b.items.map((i) => `<li>${i}</li>`).join("")}</ol>`
      if (b.type === "ul")
        return `<ul>${b.items.map((i) => `<li>${i}</li>`).join("")}</ul>`
      if (b.type === "callout")
        return `<div class="callout">${b.text}</div>`
      if (b.type === "scoreChart")
        return `<p><strong>${b.label}</strong> — ${b.nameA} ${b.scoreA}% · ${b.nameB} ${b.scoreB}% · convergence ${b.convergence}%</p>`
      if (b.type === "fillBlank")
        return `<div class="fill"><strong>${b.prompt}</strong><br/><br/><br/></div>`
      if (b.type === "rolePlay")
        return `<div class="callout"><strong>${b.title}</strong><br/>${b.scene}<br/>A: ${b.roleA}<br/>B: ${b.roleB}</div>`
      if (b.type === "cycleFlow")
        return `<div class="callout"><strong>${b.title}</strong><ol>${b.steps.map((s) => `<li>${s}</li>`).join("")}</ol></div>`
      if (b.type === "visualCards")
        return `<div class="callout"><strong>${b.title}</strong>${b.cards.map((c) => `<p><strong>${c.label}</strong> — ${c.body}</p>`).join("")}</div>`
      return ""
    })
    .join("")
}

function buildPrintableHtml(doc: CoupleReportDocument): string {
  const sections = [...doc.sections, ...doc.premiumPlusExtras]
    .map((s) => {
      const blocks =
        s.blocks?.length
          ? s.blocks
          : sectionBlocksFromLegacy({
              paragraphs: s.paragraphs,
              bullets: s.bullets,
            })
      return `<h2>${s.title}</h2>${
        s.subtitle ? `<p class="sub">${s.subtitle}</p>` : ""
      }${renderBlocks(blocks)}`
    })
    .join("")
  const exercises = doc.exercises
    .map(
      (ex) =>
        `<h2>${ex.title}</h2><p><strong>Objectif :</strong> ${ex.objective}</p><p><strong>Pourquoi :</strong> ${ex.why}</p><p><strong>Durée :</strong> ${ex.duration}</p><ol>${ex.steps.map((st) => `<li>${st}</li>`).join("")}</ol>${(ex.fillPrompts || []).map((p) => `<div class="fill"><strong>${p}</strong><br/><br/><br/></div>`).join("")}`
    )
    .join("")
  const plan = doc.actionPlan
    .map(
      (a) =>
        `<h3>Étape ${a.order} — ${a.what}</h3><p>${a.how}</p><p><em>${a.when}</em></p>`
    )
    .join("")

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"/><title>${doc.brand} — Dossier</title>
  <style>
    body{font-family:Georgia,serif;max-width:720px;margin:40px auto;padding:0 16px;color:#1c1412;line-height:1.7;background:#F2EBE0;font-size:16px}
    h1,h2,h3{font-weight:700} h1{font-size:28px} h2{font-size:22px;margin-top:32px;color:#7F5557;border-top:1px solid #B8954A44;padding-top:1rem}
    h3{font-size:18px;color:#7F5557} .sub{font-style:italic;color:#8A6A2E}
    p,li{font-size:16px} .meta{color:#666;font-size:13px}
    .callout{border:1px solid #B8954A66;background:#B8954A14;padding:1rem;border-radius:12px;margin:1rem 0}
    .fill{border:1px dashed #B8954A88;padding:1rem;min-height:4.5rem;margin:1rem 0;border-radius:12px;background:#fff}
  </style></head><body>
  <h1>${doc.brand}</h1>
  <p class="meta">${doc.names.nameA} & ${doc.names.nameB} · Score ${doc.globalScore} % · ${doc.versions.offer}</p>
  ${sections}
  <h1>Exercices</h1>${exercises}
  <h1>Plan d'action</h1>${plan}
  <p class="meta">questionnaire ${doc.versions.questionnaire_version} · scoring ${doc.versions.scoring_version} · report ${doc.versions.report_version} · ${doc.versions.generation_date}</p>
  </body></html>`
}

export default function CoupleTelechargerPage() {
  const [doc, setDoc] = React.useState<CoupleReportDocument | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    void getCoupleReportAction().then((res) => {
      if (res.error) setError(res.error)
      else setDoc(res.report as CoupleReportDocument)
    })
  }, [])

  const download = () => {
    if (!doc) return
    const html = buildPrintableHtml(doc)
    const blob = new Blob([html], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `KELYA_COUPLE_${doc.names.nameA}_${doc.names.nameB}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <CouplePageFrame>
      <CoupleShell activeHref="/couple/telecharger">
        <CoupleRequirePaid
          title="Téléchargements verrouillés"
          body="Chapitres, exercices et plan se téléchargent séparément après le paiement du bilan."
          previewTitle="Centre de téléchargements"
          previewDescription="Exporter pièce par pièce — sans tout mélanger."
        >
          <div className="max-w-lg space-y-4">
            <h1 className="font-serif text-3xl font-bold">
              Télécharger mon dossier
            </h1>
            <CoupleDeadlineBanner variant="info" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Rapport structuré (sous-titres, listes, graphiques), exercices et
              plan d’action en HTML imprimable / PDF navigateur.
            </p>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={!doc}
                onClick={download}
                className="inline-flex h-11 items-center rounded-xl bg-primary text-primary-foreground px-5 text-sm font-semibold disabled:opacity-60"
              >
                Télécharger le dossier complet
              </button>
              <Link
                href="/couple/exercices"
                className="inline-flex h-11 items-center rounded-xl border px-5 text-sm font-semibold"
              >
                Cahier exercices
              </Link>
              <Link
                href="/couple/dossier"
                className="inline-flex h-11 items-center rounded-xl border px-5 text-sm font-semibold"
              >
                Aperçu dossier
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              L’accès interactif peut expirer ; le téléchargement local reste le
              filet de sécurité.{" "}
              <Link href="/couple/rapport" className="underline">
                Voir le rapport
              </Link>
            </p>
          </div>
        </CoupleRequirePaid>
      </CoupleShell>
    </CouplePageFrame>
  )
}
