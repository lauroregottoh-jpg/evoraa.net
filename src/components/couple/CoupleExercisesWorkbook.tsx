"use client"

import * as React from "react"
import { Download, Printer } from "lucide-react"
import type { CoupleExercise, CoupleReportDocument } from "@/lib/couple/report"
import { isPremiumPlusOffer } from "@/lib/couple/offers"
import { cn } from "@/utils/cn"

function WriteLines({ lines = 3 }: { lines?: number }) {
  return (
    <div className="mt-3 space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-9 border-b border-[#1C1412]/25" />
      ))}
    </div>
  )
}

function ExerciseCard({
  ex,
  nameA,
  nameB,
}: {
  ex: CoupleExercise
  nameA: string
  nameB: string
}) {
  return (
    <article
      className={cn(
        "break-inside-avoid rounded-[1.75rem] border border-[#1C1412]/10 bg-white p-6 sm:p-9 shadow-sm space-y-5",
        ex.premiumPlus && "border-[#B8954A]/40"
      )}
    >
      <header className="space-y-2">
        {ex.premiumPlus ? (
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.18em] text-[#5C1F28] bg-[#5C1F28]/10 px-2.5 py-1 rounded-full">
            Premium Plus
          </span>
        ) : null}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1412] leading-tight">
          {ex.title}
        </h2>
        <p className="text-base sm:text-lg leading-relaxed text-[#1C1412]/85">
          <span className="font-semibold text-[#5C1F28]">Objectif — </span>
          {ex.objective}
        </p>
        <p className="text-base leading-relaxed text-[#1C1412]/75">{ex.why}</p>
        <p className="text-sm text-[#8A6A2E]">
          Durée : {ex.duration} · {ex.preparation}
        </p>
      </header>

      <div>
        <h3 className="font-serif text-xl font-bold text-[#5C1F28]">Consignes</h3>
        <ol className="mt-3 list-decimal pl-6 space-y-2.5 text-base sm:text-[17px] leading-relaxed">
          {ex.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>

      {ex.questions.length ? (
        <div>
          <h3 className="font-serif text-xl font-bold text-[#5C1F28]">Questions</h3>
          <ul className="mt-3 list-disc pl-6 space-y-2 text-base leading-relaxed">
            {ex.questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {(ex.fillPrompts?.length ? ex.fillPrompts : ["Écrire ici…"]).map(
        (prompt) => (
          <div
            key={prompt}
            className="rounded-2xl border border-dashed border-[#B8954A]/50 bg-[#FBF9F6] p-5"
          >
            <p className="text-base font-semibold text-[#5C1F28]">{prompt}</p>
            <WriteLines lines={3} />
          </div>
        )
      )}

      {ex.rolePlay ? (
        <div className="rounded-2xl border border-[#5C1F28]/20 bg-gradient-to-br from-[#F8F4EE] to-white p-5 sm:p-6 space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B8954A]">
            Jeu de rôle
          </p>
          <h3 className="font-serif text-xl font-bold">{ex.rolePlay.title}</h3>
          <p className="text-base leading-relaxed">{ex.rolePlay.scene}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-[#5C1F28]/10 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#5C1F28]">
                {nameA} — Rôle A
              </p>
              <p className="mt-2 text-base leading-relaxed">{ex.rolePlay.roleA}</p>
            </div>
            <div className="rounded-xl bg-[#B8954A]/15 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A6A2E]">
                {nameB} — Rôle B
              </p>
              <p className="mt-2 text-base leading-relaxed">{ex.rolePlay.roleB}</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="space-y-2 text-base leading-relaxed border-t border-[#1C1412]/10 pt-4">
        <p>
          <span className="font-semibold">Mise en commun — </span>
          {ex.share}
        </p>
        <p>
          <span className="font-semibold">Débrief — </span>
          {ex.debrief}
        </p>
        <p className="italic text-[#5C1F28]">
          <span className="font-semibold not-italic">À retenir — </span>
          {ex.takeaway}
        </p>
        <p>
          <span className="font-semibold">Prochaine action — </span>
          {ex.nextAction}
        </p>
      </div>
    </article>
  )
}

function buildExercisesHtml(doc: CoupleReportDocument): string {
  const isPP = isPremiumPlusOffer(doc.offerId)
  const parts = [
    `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"/><title>Cahier exercices — ${doc.names.nameA} & ${doc.names.nameB}</title>`,
    `<style>
      body{font-family:Georgia,serif;max-width:740px;margin:2rem auto;padding:0 1.25rem;color:#1C1412;line-height:1.7;background:#FBF9F6;font-size:16px}
      h1{font-size:1.9rem} h2{font-size:1.45rem;color:#5C1F28;margin-top:2.5rem;border-top:1px solid #ddd;padding-top:1.25rem}
      .meta{color:#666;font-size:14px}.fill{border:1px dashed #B8954A99;padding:1rem;min-height:5rem;margin:1rem 0;border-radius:12px;background:#fff}
      .role{display:grid;grid-template-columns:1fr 1fr;gap:1rem}.box{background:#F8F4EE;padding:1rem;border-radius:12px}
      @media print{.no-print{display:none}}
    </style></head><body>`,
    `<p class="meta">${doc.brand} · Cahier d’exercices</p>`,
    `<h1>${doc.names.nameA} & ${doc.names.nameB}</h1>`,
    `<p class="meta">${isPP ? "Premium Plus" : "Essentiel"} · zones à remplir · jeux de rôle</p>`,
  ]
  for (const ex of doc.exercises) {
    parts.push(`<h2>${ex.title}${ex.premiumPlus ? " (PP)" : ""}</h2>`)
    parts.push(`<p><strong>Objectif</strong> — ${ex.objective}</p>`)
    parts.push(`<p>${ex.why}</p>`)
    parts.push(`<ol>${ex.steps.map((s) => `<li>${s}</li>`).join("")}</ol>`)
    for (const p of ex.fillPrompts || ["Écrire ici…"]) {
      parts.push(`<div class="fill"><strong>${p}</strong><br/><br/><br/><br/></div>`)
    }
    if (ex.rolePlay) {
      parts.push(
        `<div class="role"><div class="box"><strong>${doc.names.nameA}</strong><br/>${ex.rolePlay.roleA}</div><div class="box"><strong>${doc.names.nameB}</strong><br/>${ex.rolePlay.roleB}</div></div>`
      )
    }
    parts.push(`<p><em>${ex.takeaway}</em></p>`)
  }
  if (isPP) {
    parts.push(
      `<h2>Fiches Premium Plus</h2><p>Charte · protocole · fiches pratiques — à imprimer en feuilles séparées depuis le dossier Premium Plus.</p>`
    )
  }
  parts.push(`</body></html>`)
  return parts.join("\n")
}

/** Cahier d’exercices ludique + export HTML. */
export function CoupleExercisesWorkbook({
  doc,
  className,
}: {
  doc: CoupleReportDocument
  className?: string
}) {
  const handleDownload = () => {
    const blob = new Blob([buildExercisesHtml(doc)], {
      type: "text/html;charset=utf-8",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `keliaa-couple-exercices-${doc.names.nameA}-${doc.names.nameB}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={cn("max-w-3xl mx-auto space-y-8 pb-16", className)}>
      <header className="space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8954A]">
          Cahier à vivre
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1412]">
          Exercices — {doc.names.nameA} & {doc.names.nameB}
        </h1>
        <p className="text-base sm:text-lg leading-relaxed text-[#1C1412]/75 max-w-xl">
          Grandes cartes, zones à remplir, jeux de rôle. Imprimez ou téléchargez
          pour écrire à la main.
        </p>
        <div className="flex flex-wrap gap-2 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#1C1412]/15 bg-white px-4 text-sm font-semibold"
          >
            <Printer className="h-4 w-4" /> Imprimer / PDF
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#5C1F28] px-4 text-sm font-semibold text-[#FBF9F6]"
          >
            <Download className="h-4 w-4" /> Télécharger le cahier
          </button>
        </div>
      </header>

      {doc.exercises.map((ex) => (
        <ExerciseCard
          key={ex.id}
          ex={ex}
          nameA={doc.names.nameA}
          nameB={doc.names.nameB}
        />
      ))}
    </div>
  )
}
