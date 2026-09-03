"use client"

/**
 * Rapport Couple — format A4 (Directive §17), corps ≥ 14 pt.
 * Trame = document maître Premium / Premium Plus (pas un diaporama).
 */

import * as React from "react"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  Download,
  HeartHandshake,
  Printer,
} from "lucide-react"
import type { CoupleReportDocument, CoupleReportSection } from "@/lib/couple/report"
import { sectionBlocksFromLegacy } from "@/lib/couple/reportBlocks"
import { isPremiumPlusOffer } from "@/lib/couple/offers"
import { CoupleReportBlocks } from "@/components/couple/CoupleReportBlocks"
import { cn } from "@/utils/cn"

type Props = {
  doc: CoupleReportDocument
  demoLabel?: string
  className?: string
  analysisOnly?: boolean
}

type Chapter =
  | {
      kind: "section"
      id: string
      page: number
      title: string
      subtitle?: string
      section: CoupleReportSection
    }
  | { kind: "exercises"; id: string; page: number; title: string }
  | { kind: "plan"; id: string; page: number; title: string }

const A4_PRINT_CSS = `
@page { size: A4 portrait; margin: 18mm 16mm; }
body{font-family:Georgia,"Times New Roman",serif;color:#2B2421;line-height:1.65;font-size:14pt;background:#fff}
h1{font-size:22pt;color:#641F2B;line-height:1.25;margin:0 0 .4em}
h2{font-size:16pt;color:#641F2B;margin:1.1em 0 .45em}
h3{font-size:14pt;color:#641F2B;margin:1em 0 .35em}
.meta{color:#555;font-size:12pt}
.sub{color:#8A6A2E;font-style:italic;font-size:14pt}
p,li{font-size:14pt;line-height:1.65}
ul,ol{padding-left:1.35rem}
.callout{border:1px solid #D7B86666;background:#D7B86612;padding:12pt;border-radius:8px;margin:12pt 0;font-size:14pt}
.fill{border:1px dashed #D7B86688;padding:12pt;margin:12pt 0;min-height:48pt;border-radius:8px;font-size:14pt}
.page-break{page-break-before:always}
`

function blocksFor(section: CoupleReportSection) {
  if (section.blocks?.length) return section.blocks
  return sectionBlocksFromLegacy({
    paragraphs: section.paragraphs,
    bullets: section.bullets,
    subtitleBlocks: section.subtitle
      ? [{ type: "h2", text: section.subtitle }]
      : undefined,
  })
}

function chapterToHtml(ch: Chapter, doc: CoupleReportDocument): string {
  const parts: string[] = [
    `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"/><title>${ch.title} — ${doc.names.nameA} & ${doc.names.nameB}</title>`,
    `<style>${A4_PRINT_CSS}</style></head><body>`,
    `<p class="meta">${doc.brand} · Page ${ch.page}</p>`,
    `<h1>${ch.title}</h1>`,
  ]
  if (ch.kind === "section" && ch.subtitle) {
    parts.push(`<p class="sub">${ch.subtitle}</p>`)
  }
  if (ch.kind === "section") {
    for (const b of blocksFor(ch.section)) {
      if (b.type === "h2") parts.push(`<h2>${b.text}</h2>`)
      else if (b.type === "paragraph") parts.push(`<p>${b.text}</p>`)
      else if (b.type === "ol")
        parts.push(`<ol>${b.items.map((x) => `<li>${x}</li>`).join("")}</ol>`)
      else if (b.type === "ul")
        parts.push(`<ul>${b.items.map((x) => `<li>${x}</li>`).join("")}</ul>`)
      else if (b.type === "callout")
        parts.push(`<div class="callout">${b.text}</div>`)
      else if (b.type === "scoreChart")
        parts.push(
          `<p><strong>${b.label}</strong> — ${b.nameA} ${b.scoreA}% · ${b.nameB} ${b.scoreB}%</p>`
        )
      else if (b.type === "fillBlank")
        parts.push(`<div class="fill"><strong>${b.prompt}</strong><br/><br/><br/></div>`)
      else if (b.type === "rolePlay")
        parts.push(
          `<div class="callout"><strong>${b.title}</strong><br/>${b.scene}<br/>A: ${b.roleA}<br/>B: ${b.roleB}</div>`
        )
      else if (b.type === "cycleFlow")
        parts.push(
          `<div class="callout"><strong>${b.title}</strong><ol>${b.steps.map((s) => `<li>${s}</li>`).join("")}</ol></div>`
        )
      else if (b.type === "visualCards")
        parts.push(
          `<div class="callout"><strong>${b.title}</strong>${b.cards.map((c) => `<p><strong>${c.label}</strong> — ${c.body}</p>`).join("")}</div>`
        )
    }
  } else if (ch.kind === "exercises") {
    for (const ex of doc.exercises) {
      parts.push(`<h2>${ex.title}</h2>`)
      parts.push(`<p><strong>Objectif</strong> — ${ex.objective}</p>`)
      parts.push(`<p>${ex.why}</p>`)
      parts.push(`<ol>${ex.steps.map((s) => `<li>${s}</li>`).join("")}</ol>`)
    }
  } else {
    for (const s of doc.actionPlan) {
      parts.push(
        `<h2>Étape ${s.order} — ${s.what}</h2><p>${s.how}</p><p><em>${s.when}</em></p>`
      )
    }
  }
  parts.push(`</body></html>`)
  return parts.join("\n")
}

function downloadChapter(ch: Chapter, doc: CoupleReportDocument) {
  const blob = new Blob([chapterToHtml(ch, doc)], {
    type: "text/html;charset=utf-8",
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `keliaa-couple-a4-p${String(ch.page).padStart(2, "0")}-${ch.id}.html`
  a.click()
  URL.revokeObjectURL(url)
}

function ChapterBody({
  ch,
  doc,
}: {
  ch: Chapter
  doc: CoupleReportDocument
}) {
  if (ch.kind === "section") {
    return <CoupleReportBlocks blocks={blocksFor(ch.section)} />
  }
  if (ch.kind === "exercises") {
    return (
      <div className="space-y-8 text-[14pt] leading-[1.65]">
        {doc.exercises.map((ex) => (
          <div key={ex.id} className="space-y-3 border-t border-[#2B2421]/10 pt-6">
            <h3 className="font-serif text-[18pt] font-bold text-[#641F2B]">
              {ex.title}
            </h3>
            <p>
              <span className="font-semibold">Objectif — </span>
              {ex.objective}
            </p>
            <p>{ex.why}</p>
            <ol className="list-decimal pl-6 space-y-2">
              {ex.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            {(ex.fillPrompts || []).map((prompt) => (
              <div
                key={prompt}
                className="rounded-xl border border-dashed border-[#D7B866]/50 p-4"
              >
                <p className="font-semibold text-[#641F2B]">{prompt}</p>
                <div className="mt-3 space-y-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-8 border-b border-[#2B2421]/20" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }
  return (
    <ol className="space-y-5 text-[14pt] leading-[1.65]">
      {doc.actionPlan.map((step) => (
        <li key={step.order} className="border-t border-[#2B2421]/10 pt-4">
          <p className="text-[12pt] font-bold uppercase tracking-wider text-[#D7B866]">
            Étape {step.order}
          </p>
          <p className="font-serif text-[18pt] font-bold mt-1">{step.what}</p>
          <p className="mt-2">
            <span className="font-semibold">Comment — </span>
            {step.how}
          </p>
          <p>
            <span className="font-semibold">Quand — </span>
            {step.when}
          </p>
        </li>
      ))}
    </ol>
  )
}

function A4Page({
  ch,
  doc,
  className,
}: {
  ch: Chapter
  doc: CoupleReportDocument
  className?: string
}) {
  return (
    <section
      id={`ch-${ch.id}`}
      className={cn(
        "report-a4 mx-auto w-full max-w-[210mm] bg-white text-[#2B2421] shadow-md border border-[#2B2421]/10",
        "px-[16mm] py-[14mm] sm:px-[18mm] sm:py-[16mm]",
        "scroll-mt-24",
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div className="min-w-0">
          <p className="text-[12pt] font-bold uppercase tracking-[0.14em] text-[#D7B866]">
            Page {ch.page}
            {ch.id.startsWith("pp-") ? " · Premium Plus" : ""}
          </p>
          <h2 className="mt-2 font-serif text-[22pt] font-bold leading-tight text-[#641F2B]">
            {ch.title}
          </h2>
          {ch.kind === "section" && ch.subtitle ? (
            <p className="mt-2 font-serif text-[14pt] italic text-[#8A6A2E]">
              {ch.subtitle}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => downloadChapter(ch, doc)}
          className="print:hidden inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-[#2B2421]/15 bg-[#FCFAF6] px-3 text-[12pt] font-semibold"
        >
          <Download className="h-4 w-4" /> Télécharger
        </button>
      </div>
      <ChapterBody ch={ch} doc={doc} />
    </section>
  )
}

export function CoupleReportView({
  doc,
  demoLabel,
  className,
  analysisOnly = false,
}: Props) {
  const isPP = isPremiumPlusOffer(doc.offerId)
  const [index, setIndex] = React.useState(0)
  const [focusOne, setFocusOne] = React.useState(false)

  const chapters = React.useMemo((): Chapter[] => {
    const base = doc.sections.map((s, i) => ({
      kind: "section" as const,
      id: s.id,
      page: i + 1,
      title: s.title,
      subtitle: s.subtitle,
      section: s,
    }))
    let page = base.length
    const extras = doc.premiumPlusExtras.map((s) => {
      page += 1
      return {
        kind: "section" as const,
        id: s.id,
        page,
        title: s.title,
        subtitle: s.subtitle,
        section: s,
      }
    })
    if (analysisOnly) return [...base, ...extras]
    return [
      ...base,
      ...extras,
      {
        kind: "exercises" as const,
        id: "exercices",
        page: page + 1,
        title: "Exercices à vivre ensemble",
      },
      {
        kind: "plan" as const,
        id: "plan-action",
        page: page + 2,
        title: "Plan d’action",
      },
    ]
  }, [doc, analysisOnly])

  const current = chapters[Math.min(index, chapters.length - 1)]!

  React.useEffect(() => {
    setIndex(0)
  }, [doc.offerId, doc.names.nameA, doc.names.nameB])

  const dateLabel = new Date(doc.versions.generation_date).toLocaleDateString(
    "fr-FR",
    { day: "numeric", month: "long", year: "numeric" }
  )

  const go = (dir: -1 | 1) => {
    setIndex((i) => Math.max(0, Math.min(chapters.length - 1, i + dir)))
  }

  const handleDownloadAll = () => {
    const htmlParts: string[] = [
      `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"/><title>${doc.brand} — ${doc.names.nameA} & ${doc.names.nameB}</title>`,
      `<style>${A4_PRINT_CSS}</style></head><body>`,
      `<p class="meta">${doc.brand}</p>`,
      `<h1>Bilan de couple — ${doc.names.nameA} & ${doc.names.nameB}</h1>`,
      `<p class="meta">Score ${doc.globalScore}% · ${dateLabel} · ${isPP ? "Premium Plus" : "Premium"} · ${chapters.length} pages A4</p>`,
    ]
    for (const ch of chapters) {
      htmlParts.push(`<div class="page-break"></div>`)
      if (ch.kind === "section") {
        htmlParts.push(`<h1>${ch.title}</h1>`)
        if (ch.subtitle) htmlParts.push(`<p class="sub">${ch.subtitle}</p>`)
        for (const b of blocksFor(ch.section)) {
          if (b.type === "h2") htmlParts.push(`<h2>${b.text}</h2>`)
          else if (b.type === "paragraph") htmlParts.push(`<p>${b.text}</p>`)
          else if (b.type === "ol")
            htmlParts.push(`<ol>${b.items.map((x) => `<li>${x}</li>`).join("")}</ol>`)
          else if (b.type === "ul")
            htmlParts.push(`<ul>${b.items.map((x) => `<li>${x}</li>`).join("")}</ul>`)
          else if (b.type === "callout")
            htmlParts.push(`<div class="callout">${b.text}</div>`)
          else if (b.type === "scoreChart")
            htmlParts.push(
              `<p><strong>${b.label}</strong> — ${b.nameA} ${b.scoreA}% · ${b.nameB} ${b.scoreB}%</p>`
            )
          else if (b.type === "fillBlank")
            htmlParts.push(`<div class="fill"><strong>${b.prompt}</strong><br/><br/><br/></div>`)
          else if (b.type === "cycleFlow")
            htmlParts.push(
              `<div class="callout"><strong>${b.title}</strong><ol>${b.steps.map((s) => `<li>${s}</li>`).join("")}</ol></div>`
            )
          else if (b.type === "visualCards")
            htmlParts.push(
              `<div class="callout"><strong>${b.title}</strong>${b.cards.map((c) => `<p><strong>${c.label}</strong> — ${c.body}</p>`).join("")}</div>`
            )
        }
      } else if (ch.kind === "exercises") {
        htmlParts.push(`<h1>${ch.title}</h1>`)
        for (const ex of doc.exercises) {
          htmlParts.push(
            `<h2>${ex.title}</h2><p><strong>Objectif</strong> — ${ex.objective}</p><ol>${ex.steps.map((s) => `<li>${s}</li>`).join("")}</ol>`
          )
        }
      } else {
        htmlParts.push(`<h1>${ch.title}</h1>`)
        for (const s of doc.actionPlan) {
          htmlParts.push(
            `<p><strong>Étape ${s.order} — ${s.what}</strong><br/>${s.how}<br/>Quand : ${s.when}</p>`
          )
        }
      }
    }
    htmlParts.push(`</body></html>`)
    const blob = new Blob([htmlParts.join("\n")], {
      type: "text/html;charset=utf-8",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `keliaa-couple-a4-${doc.names.nameA}-${doc.names.nameB}-${isPP ? "premium-plus" : "premium"}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <article
      className={cn(
        "mx-auto w-full max-w-[240mm] pb-20 text-[#2B2421] print:max-w-none",
        className
      )}
      style={
        {
          ["--report-body" as string]: "14pt",
        } as React.CSSProperties
      }
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page { size: A4 portrait; margin: 16mm; }
              .report-a4 {
                box-shadow: none !important;
                border: none !important;
                max-width: none !important;
                page-break-after: always;
              }
            }
          `,
        }}
      />

      <div className="flex flex-wrap gap-2 print:hidden mb-5">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#2B2421]/15 bg-white px-4 text-[14pt] font-semibold"
        >
          <Printer className="h-4 w-4" /> Imprimer A4
        </button>
        <button
          type="button"
          onClick={handleDownloadAll}
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#2B2421]/15 bg-white px-4 text-[14pt] font-semibold"
        >
          <Download className="h-4 w-4" /> Télécharger A4
        </button>
        <button
          type="button"
          onClick={() => setFocusOne((v) => !v)}
          className={cn(
            "inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-[14pt] font-semibold",
            focusOne
              ? "border-[#641F2B] bg-[#641F2B] text-white"
              : "border-[#2B2421]/15 bg-white"
          )}
        >
          {focusOne ? "Voir toutes les pages" : "Une page à la fois"}
        </button>
      </div>

      <header className="relative overflow-hidden rounded-[1.25rem] border border-[#D7B866]/35 bg-gradient-to-br from-[#641F2B] via-[#451923] to-[#2B2421] p-6 sm:p-8 text-[#FCFAF6] mb-6 print:hidden">
        <p className="inline-flex items-center gap-1.5 text-[12pt] font-bold uppercase tracking-[0.18em] text-[#E8D49A]">
          <HeartHandshake className="h-4 w-4" />
          {doc.brand}
        </p>
        <h1 className="mt-3 font-serif text-[24pt] sm:text-[28pt] font-bold leading-tight">
          Bilan de compatibilité & dynamique du couple
        </h1>
        <p className="mt-2 font-serif text-[18pt] text-[#E8D49A]">
          {doc.names.nameA} & {doc.names.nameB}
        </p>
        <p className="mt-1 text-[12pt] text-white/70">{dateLabel}</p>
        <div className="mt-5 flex flex-wrap items-end gap-6">
          <div>
            <p className="text-[12pt] uppercase tracking-wider text-white/50">
              Score global
            </p>
            <p className="font-serif text-[36pt] font-bold text-[#E8D49A] leading-none">
              {doc.globalScore}
              <span className="text-[14pt] text-white/50 font-normal"> %</span>
            </p>
          </div>
          <div>
            <p className="text-[12pt] uppercase tracking-wider text-white/50">
              Format
            </p>
            <p className="font-serif text-[18pt] font-bold">
              A4 · {chapters.length} pages
            </p>
          </div>
          <div className="max-w-sm">
            <p className="text-[12pt] uppercase tracking-wider text-white/50">
              Lecture
            </p>
            <p className="font-serif text-[16pt] font-bold leading-snug">
              {doc.scoreInterpretation.title}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {isPP ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#D7B866]/50 bg-[#D7B866]/20 px-3 py-1 text-[11pt] font-bold uppercase tracking-wider text-[#E8D49A]">
              <Crown className="h-3.5 w-3.5" /> Premium Plus · Premium + Points
            </span>
          ) : (
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11pt] font-bold uppercase tracking-wider">
              Bilan Premium
            </span>
          )}
          {demoLabel ? (
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11pt] font-semibold">
              {demoLabel}
            </span>
          ) : null}
        </div>
      </header>

      {doc.safetyNotice ? (
        <div className="mb-5 rounded-2xl border border-[#641F2B]/30 bg-[#FFFDF9] px-5 py-4 text-[14pt] leading-[1.65]">
          {doc.safetyNotice}
        </div>
      ) : null}

      <nav className="mb-6 rounded-2xl border border-[#2B2421]/10 bg-[#FFFDF9]/90 p-4 print:hidden">
        <p className="text-[12pt] font-bold uppercase tracking-[0.14em] text-[#D7B866] mb-2">
          Sommaire · {chapters.length} pages A4
        </p>
        <ol className="columns-1 sm:columns-2 gap-x-8 text-[14pt] space-y-1.5">
          {chapters.map((ch, i) => (
            <li key={ch.id} className="break-inside-avoid">
              <button
                type="button"
                className="text-left text-[#641F2B] hover:underline"
                onClick={() => {
                  setIndex(i)
                  if (!focusOne) {
                    document
                      .getElementById(`ch-${ch.id}`)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                }}
              >
                {ch.page}. {ch.title}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {focusOne ? (
        <div className="space-y-4 print:hidden">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[12pt] text-[#2B2421]/55">
              Page {current.page} / {chapters.length}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                disabled={index === 0}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border disabled:opacity-40"
                aria-label="Précédent"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                disabled={index >= chapters.length - 1}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border disabled:opacity-40"
                aria-label="Suivant"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <A4Page ch={current} doc={doc} />
        </div>
      ) : (
        <div className="space-y-8 print:hidden">
          {chapters.map((ch) => (
            <A4Page key={ch.id} ch={ch} doc={doc} />
          ))}
        </div>
      )}

      <div className="hidden print:block space-y-0">
        {chapters.map((ch) => (
          <A4Page key={`print-${ch.id}`} ch={ch} doc={doc} />
        ))}
      </div>

      <footer className="pt-8 border-t border-[#2B2421]/10 space-y-2 text-[12pt] text-[#2B2421]/50">
        <p>
          Versions — questionnaire {doc.versions.questionnaire_version} · scoring{" "}
          {doc.versions.scoring_version} · contenu {doc.versions.content_version}{" "}
          · rapport {doc.versions.report_version} · offre {doc.versions.offer}
        </p>
        <p>
          Ce bilan n’est pas un diagnostic clinique ni un verdict d’avenir.{" "}
          <Link href="/couple" className="font-semibold text-[#641F2B]">
            Retour à KELYA Couple →
          </Link>
        </p>
      </footer>
    </article>
  )
}
