"use client"

import * as React from "react"
import Link from "next/link"
import { CouplePageFrame } from "@/components/couple/CouplePageFrame"
import { CoupleShell } from "@/components/couple/CoupleShell"
import { getCoupleReportAction } from "@/app/actions/couple"
import type { CoupleReportDocument } from "@/lib/couple/report"

function buildPrintableHtml(doc: CoupleReportDocument): string {
  const sections = [...doc.sections, ...doc.premiumPlusExtras]
    .map(
      (s) =>
        `<h2>${s.title}</h2>${s.paragraphs.map((p) => `<p>${p}</p>`).join("")}${
          s.bullets
            ? `<ul>${s.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>`
            : ""
        }`
    )
    .join("")
  const exercises = doc.exercises
    .map(
      (ex) =>
        `<h2>${ex.title}</h2><p><strong>Objectif :</strong> ${ex.objective}</p><p><strong>Pourquoi :</strong> ${ex.why}</p><p><strong>Durée :</strong> ${ex.duration}</p><ol>${ex.steps.map((st) => `<li>${st}</li>`).join("")}</ol>`
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
    body{font-family:Georgia,serif;max-width:720px;margin:40px auto;padding:0 16px;color:#1c1412;line-height:1.55}
    h1,h2,h3{font-weight:700} h1{font-size:28px} h2{font-size:20px;margin-top:28px}
    p,li{font-size:14px} .meta{color:#666;font-size:12px}
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
      <CoupleShell>
        <div className="max-w-lg space-y-4">
          <h1 className="font-serif text-3xl font-bold">Télécharger mon dossier</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Rapport, exercices et plan d’action en un fichier HTML imprimable /
            exportable en PDF via votre navigateur. L’export Google Drive n’est
            pas requis pour V1.
          </p>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="button"
            disabled={!doc}
            onClick={download}
            className="inline-flex h-11 items-center rounded-xl bg-primary text-primary-foreground px-5 text-sm font-semibold disabled:opacity-60"
          >
            Télécharger mon dossier
          </button>
          <p className="text-xs text-muted-foreground">
            L’accès interactif peut expirer ; le téléchargement local reste le
            filet de sécurité.{" "}
            <Link href="/couple/rapport" className="underline">
              Voir le rapport
            </Link>
          </p>
        </div>
      </CoupleShell>
    </CouplePageFrame>
  )
}
