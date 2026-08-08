"use client"

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
  /** Masquer le bloc exercices/plan dans le rapport (liens vers cahiers). */
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

function estimatePages(doc: CoupleReportDocument): number {
  const sections = [...doc.sections, ...doc.premiumPlusExtras]
  let words = 0
  for (const s of sections) {
    words += s.paragraphs.join(" ").split(/\s+/).length
    words += (s.bullets || []).join(" ").split(/\s+/).length
    for (const b of s.blocks || []) {
      if (b.type === "paragraph" || b.type === "h2" || b.type === "callout") {
        words += b.text.split(/\s+/).length
      }
      if (b.type === "ol" || b.type === "ul") {
        words += b.items.join(" ").split(/\s+/).length
      }
    }
  }
  for (const ex of doc.exercises) {
    words += `${ex.title} ${ex.objective} ${ex.why} ${ex.steps.join(" ")} ${ex.questions.join(" ")}`.split(
      /\s+/
    ).length
  }
  words += doc.actionPlan.length * 40
  const pages = Math.round(words / 280)
  const target = isPremiumPlusOffer(doc.offerId) ? 50 : 30
  return Math.max(pages, Math.round(target * 0.55))
}

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

/**
 * Rapport Couple — lecture type dossier / slides (crème · bordeaux · or).
 */
export function CoupleReportView({
  doc,
  demoLabel,
  className,
  analysisOnly = false,
}: Props) {
  const isPP = isPremiumPlusOffer(doc.offerId)
  const pageEstimate = estimatePages(doc)

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
    const exercises: Chapter = {
      kind: "exercises",
      id: "exercices",
      page: page + 1,
      title: "Exercices à vivre ensemble",
    }
    const plan: Chapter = {
      kind: "plan",
      id: "plan",
      page: page + 2,
      title: "Plan d’action",
    }
    return [...base, ...extras, exercises, plan]
  }, [doc, analysisOnly])

  const [index, setIndex] = React.useState(0)
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

  const handlePrint = () => window.print()

  const handleDownload = () => {
    const htmlParts: string[] = [
      `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"/><title>${doc.brand} — ${doc.names.nameA} & ${doc.names.nameB}</title>`,
      `<style>
        body{font-family:Georgia,"Times New Roman",serif;max-width:720px;margin:2rem auto;padding:0 1.25rem;color:#1C1412;line-height:1.7;font-size:16px;background:#FBF9F6}
        h1{font-size:1.85rem;margin:0 0 .5rem} h2{font-size:1.35rem;margin:2.25rem 0 .75rem;color:#5C1F28;border-top:1px solid #B8954A55;padding-top:1.25rem}
        h3{font-size:1.15rem;color:#5C1F28;margin:1.25rem 0 .5rem}
        .meta{color:#666;font-size:14px} .sub{color:#8A6A2E;font-style:italic;margin-bottom:1rem}
        ul,ol{padding-left:1.35rem} li{margin:.35rem 0}
        .callout{border:1px solid #B8954A66;background:#B8954A12;padding:1rem 1.15rem;border-radius:12px;margin:1rem 0}
        .fill{border:1px dashed #B8954A88;padding:1rem;margin:1rem 0;min-height:4rem;border-radius:12px}
        .bar{height:10px;background:#1C141210;border-radius:999px;margin:.35rem 0 1rem}.bar>i{display:block;height:100%;border-radius:999px;background:#5C1F28}
      </style></head><body>`,
      `<p class="meta">${doc.brand}</p>`,
      `<h1>Bilan de couple — ${doc.names.nameA} & ${doc.names.nameB}</h1>`,
      `<p class="meta">Score ${doc.globalScore}% · ${dateLabel} · ${isPP ? "Premium Plus" : "Essentiel"} · ~${pageEstimate} pages</p>`,
    ]

    for (const ch of chapters) {
      if (ch.kind === "section") {
        htmlParts.push(`<h2>${ch.title}</h2>`)
        if (ch.subtitle) htmlParts.push(`<p class="sub">${ch.subtitle}</p>`)
        for (const b of blocksFor(ch.section)) {
          if (b.type === "h2") htmlParts.push(`<h3>${b.text}</h3>`)
          else if (b.type === "paragraph") htmlParts.push(`<p>${b.text}</p>`)
          else if (b.type === "ol")
            htmlParts.push(
              `<ol>${b.items.map((x) => `<li>${x}</li>`).join("")}</ol>`
            )
          else if (b.type === "ul")
            htmlParts.push(
              `<ul>${b.items.map((x) => `<li>${x}</li>`).join("")}</ul>`
            )
          else if (b.type === "callout")
            htmlParts.push(`<div class="callout">${b.text}</div>`)
          else if (b.type === "scoreChart")
            htmlParts.push(
              `<p><strong>${b.label}</strong> — ${b.nameA} ${b.scoreA}% · ${b.nameB} ${b.scoreB}% · convergence ${b.convergence}%</p>
               <div class="bar"><i style="width:${b.scoreA}%"></i></div>
               <div class="bar"><i style="width:${b.scoreB}%;background:#B8954A"></i></div>`
            )
          else if (b.type === "fillBlank")
            htmlParts.push(
              `<div class="fill"><strong>${b.prompt}</strong><br/><br/><br/></div>`
            )
          else if (b.type === "rolePlay")
            htmlParts.push(
              `<div class="callout"><strong>${b.title}</strong><br/>${b.scene}<br/>A: ${b.roleA}<br/>B: ${b.roleB}</div>`
            )
        }
      } else if (ch.kind === "exercises") {
        htmlParts.push(`<h2>${ch.title}</h2><p class="meta">Voir aussi le cahier Exercices.</p>`)
        for (const ex of doc.exercises) {
          htmlParts.push(
            `<h3>${ex.title}</h3><p><strong>Objectif</strong> — ${ex.objective}</p><ol>${ex.steps.map((s) => `<li>${s}</li>`).join("")}</ol>`
          )
        }
      } else {
        htmlParts.push(`<h2>${ch.title}</h2>`)
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
    a.download = `keliaa-couple-${doc.names.nameA}-${doc.names.nameB}-${isPP ? "premium-plus" : "essentiel"}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <article
      className={cn(
        "max-w-3xl mx-auto space-y-5 pb-20 text-[#1C1412] print:max-w-none",
        className
      )}
    >
      <div className="flex flex-wrap gap-2 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#1C1412]/15 bg-white px-4 text-sm font-semibold"
        >
          <Printer className="h-4 w-4" /> Imprimer
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#1C1412]/15 bg-white px-4 text-sm font-semibold"
        >
          <Download className="h-4 w-4" /> Télécharger
        </button>
        <Link
          href="/couple/exercices"
          className="inline-flex h-10 items-center rounded-xl border border-[#B8954A]/40 bg-[#B8954A]/10 px-4 text-sm font-semibold text-[#5C1F28]"
        >
          Cahier exercices
        </Link>
        <Link
          href="/couple/dossier"
          className="inline-flex h-10 items-center rounded-xl border border-[#1C1412]/15 bg-white px-4 text-sm font-semibold"
        >
          Dossier
        </Link>
      </div>

      <header className="relative overflow-hidden rounded-[1.75rem] border border-[#B8954A]/35 bg-gradient-to-br from-[#5C1F28] via-[#3D1519] to-[#1C1412] p-6 sm:p-9 text-[#FBF9F6] shadow-lg print:shadow-none">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30 print:hidden"
          style={{
            background:
              "radial-gradient(ellipse at 20% 0%, #B8954A55, transparent 55%), radial-gradient(ellipse at 90% 80%, #F8F4EE22, transparent 40%)",
          }}
        />
        <p className="relative z-10 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#F3D9A4]">
          <HeartHandshake className="h-3.5 w-3.5" />
          {doc.brand}
        </p>
        <h1 className="relative z-10 mt-3 font-serif text-3xl sm:text-4xl font-bold leading-tight">
          Bilan de compatibilité & dynamique du couple
        </h1>
        <p className="relative z-10 mt-2 font-serif text-xl sm:text-2xl text-[#F3D9A4]">
          {doc.names.nameA} & {doc.names.nameB}
        </p>
        <p className="relative z-10 mt-1 text-sm text-white/70">{dateLabel}</p>

        <div className="relative z-10 mt-6 flex flex-wrap items-end gap-5">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/50">
              Score global
            </p>
            <p className="font-serif text-4xl font-bold text-[#F3D9A4]">
              {doc.globalScore}
              <span className="text-lg text-white/50 font-normal"> %</span>
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/50">
              Volume estimé
            </p>
            <p className="font-serif text-2xl font-bold">~{pageEstimate} pages</p>
          </div>
          <div className="max-w-sm">
            <p className="text-[10px] uppercase tracking-wider text-white/50">
              Lecture
            </p>
            <p className="font-serif text-lg font-bold leading-snug">
              {doc.scoreInterpretation.title}
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-5 flex flex-wrap gap-2">
          {isPP ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#B8954A]/50 bg-[#B8954A]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#F3D9A4]">
              <Crown className="h-3 w-3" /> Premium Plus · cible ~50 pages
            </span>
          ) : (
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
              Bilan Essentiel · cible ~30 pages
            </span>
          )}
          {demoLabel ? (
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold">
              {demoLabel}
            </span>
          ) : null}
        </div>
      </header>

      {doc.safetyNotice ? (
        <div className="rounded-2xl border border-[#5C1F28]/30 bg-[#F8F4EE] px-5 py-4 text-sm leading-relaxed">
          {doc.safetyNotice}
        </div>
      ) : null}

      {/* Navigation slides */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <p className="text-xs text-[#1C1412]/55">
          Chapitre {current.page} / {chapters.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={index === 0}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#1C1412]/15 bg-white disabled:opacity-40"
            aria-label="Chapitre précédent"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={index >= chapters.length - 1}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#1C1412]/15 bg-white disabled:opacity-40"
            aria-label="Chapitre suivant"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1 print:hidden" role="tablist">
        {chapters.map((ch, i) => (
          <button
            key={ch.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            onClick={() => setIndex(i)}
            className={cn(
              "shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-semibold transition-colors",
              i === index
                ? "bg-[#5C1F28] text-[#FBF9F6]"
                : "bg-[#1C1412]/06 text-[#1C1412]/60 hover:bg-[#1C1412]/1"
            )}
            title={ch.title}
          >
            {ch.page}
          </button>
        ))}
      </div>

      {/* Slide chapitre */}
      <section
        key={current.id}
        className="animate-in fade-in duration-300 rounded-[1.75rem] border border-[#1C1412]/10 bg-white/95 p-6 sm:p-9 shadow-sm min-h-[28rem] print:shadow-none print:border-0 print:p-0"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8954A]">
          Chapitre {current.page}
          {current.id.startsWith("pp-") ? " · Premium Plus" : ""}
        </p>
        <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold leading-tight text-[#1C1412]">
          {current.title}
        </h2>
        {current.kind === "section" && current.subtitle ? (
          <p className="mt-2 font-serif text-lg italic text-[#8A6A2E]">
            {current.subtitle}
          </p>
        ) : null}

        <div className="mt-6">
          {current.kind === "section" ? (
            <CoupleReportBlocks blocks={blocksFor(current.section)} />
          ) : null}

          {current.kind === "exercises" ? (
            <div className="space-y-4">
              <p className="text-base leading-relaxed text-[#1C1412]/85">
                Les exercices sont conçus pour être vécus — pas seulement lus.
                Ouvrez le cahier dédié pour les cartes grandes, zones à remplir
                et jeux de rôle.
              </p>
              <Link
                href="/couple/exercices"
                className="inline-flex h-11 items-center rounded-xl bg-[#5C1F28] px-5 text-sm font-semibold text-[#FBF9F6]"
              >
                Ouvrir le cahier d’exercices →
              </Link>
              <ul className="mt-4 space-y-2 text-base">
                {doc.exercises.map((ex) => (
                  <li key={ex.id} className="flex gap-2">
                    <span className="text-[#B8954A]">•</span>
                    <span>
                      {ex.title}
                      {ex.premiumPlus ? " (Premium Plus)" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {current.kind === "plan" ? (
            <ol className="space-y-4">
              {doc.actionPlan.map((step) => (
                <li
                  key={step.order}
                  className="rounded-2xl border border-[#1C1412]/10 bg-[#F8F4EE] p-5"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#B8954A]">
                    Étape {step.order}
                  </p>
                  <p className="font-serif text-xl font-bold mt-1">{step.what}</p>
                  <p className="text-base mt-3 leading-relaxed">
                    <span className="font-semibold">Comment — </span>
                    {step.how}
                  </p>
                  <p className="text-base leading-relaxed">
                    <span className="font-semibold">Quand — </span>
                    {step.when}
                  </p>
                  <p className="text-sm mt-2 text-[#1C1412]/60">
                    Signal : {step.progressSignal}
                  </p>
                </li>
              ))}
              <Link
                href="/couple/plan"
                className="inline-flex text-sm font-semibold text-[#5C1F28] underline underline-offset-2"
              >
                Voir le plan dédié →
              </Link>
            </ol>
          ) : null}
        </div>
      </section>

      {/* Impression : tous les chapitres */}
      <div className="hidden print:block space-y-10">
        {chapters.map((ch) =>
          ch.kind === "section" ? (
            <section key={`print-${ch.id}`} className="break-inside-avoid">
              <h2 className="font-serif text-2xl font-bold">{ch.title}</h2>
              {ch.subtitle ? (
                <p className="italic text-[#8A6A2E] mb-3">{ch.subtitle}</p>
              ) : null}
              <CoupleReportBlocks blocks={blocksFor(ch.section)} />
            </section>
          ) : null
        )}
      </div>

      <div className="flex justify-between gap-3 print:hidden">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          className="inline-flex h-11 items-center gap-1 rounded-xl border px-4 text-sm font-semibold disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> Précédent
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={index >= chapters.length - 1}
          className="inline-flex h-11 items-center gap-1 rounded-xl bg-[#5C1F28] px-4 text-sm font-semibold text-[#FBF9F6] disabled:opacity-40"
        >
          Suivant <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <footer className="pt-4 border-t border-[#1C1412]/10 space-y-2 text-[11px] text-[#1C1412]/50">
        <p>
          Versions — questionnaire {doc.versions.questionnaire_version} · scoring{" "}
          {doc.versions.scoring_version} · contenu {doc.versions.content_version}{" "}
          · rapport {doc.versions.report_version} · offre {doc.versions.offer}
        </p>
        <p>
          Ce bilan n’est pas un diagnostic clinique ni un verdict d’avenir.{" "}
          <Link href="/couple" className="font-semibold text-[#5C1F28]">
            Retour à KELYA Couple →
          </Link>
        </p>
      </footer>
    </article>
  )
}
