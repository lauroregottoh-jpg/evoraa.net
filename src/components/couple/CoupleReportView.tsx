"use client"

import * as React from "react"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  Download,
  HeartHandshake,
  LayoutList,
  Maximize2,
  Minimize2,
  PanelLeft,
  Presentation,
  Printer,
  X,
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

type ViewMode = "deck" | "scroll" | "present"

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

function chapterSnippet(ch: Chapter, doc: CoupleReportDocument): string {
  if (ch.kind === "section") {
    const first =
      ch.section.paragraphs[0] ||
      ch.section.blocks?.find((b) => b.type === "paragraph" || b.type === "callout")
    if (typeof first === "string") return first.slice(0, 90)
    if (first && "text" in first) return first.text.slice(0, 90)
    return ch.subtitle || "Chapitre du bilan"
  }
  if (ch.kind === "exercises") {
    return `${doc.exercises.length} exercice${doc.exercises.length > 1 ? "s" : ""} sélectionné${doc.exercises.length > 1 ? "s" : ""}`
  }
  return `${doc.actionPlan.length} étape${doc.actionPlan.length > 1 ? "s" : ""}`
}

function chapterToHtml(ch: Chapter, doc: CoupleReportDocument): string {
  const parts: string[] = [
    `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"/><title>${ch.title} — ${doc.names.nameA} & ${doc.names.nameB}</title>`,
    `<style>body{font-family:Georgia,serif;max-width:720px;margin:2rem auto;padding:0 1.25rem;color:#1C1412;line-height:1.7;background:#FBF9F6}h1{font-size:1.6rem;color:#5C1F28}.meta{color:#666;font-size:13px}h2{font-size:1.2rem;color:#5C1F28;margin-top:1.5rem}ul,ol{padding-left:1.3rem}.fill{border:1px dashed #B8954A88;padding:1rem;min-height:4rem;margin:1rem 0;border-radius:12px}.callout{border:1px solid #B8954A66;background:#B8954A12;padding:1rem;border-radius:12px;margin:1rem 0}</style></head><body>`,
    `<p class="meta">${doc.brand} · Carte ${ch.page}</p>`,
    `<h1>${ch.title}</h1>`,
  ]
  if (ch.kind === "section" && ch.subtitle) {
    parts.push(`<p class="meta"><em>${ch.subtitle}</em></p>`)
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
    }
  } else if (ch.kind === "exercises") {
    for (const ex of doc.exercises) {
      parts.push(`<h2>${ex.title}</h2>`)
      parts.push(`<p><strong>Objectif</strong> — ${ex.objective}</p>`)
      parts.push(`<p>${ex.why}</p>`)
      parts.push(`<ol>${ex.steps.map((s) => `<li>${s}</li>`).join("")}</ol>`)
      for (const p of ex.fillPrompts || []) {
        parts.push(`<div class="fill"><strong>${p}</strong><br/><br/><br/></div>`)
      }
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
  a.download = `keliaa-couple-carte-${String(ch.page).padStart(2, "0")}-${ch.id}.html`
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
      <div className="space-y-8">
        <p className="text-base leading-relaxed text-[#1C1412]/85">
          Exercices choisis pour vos priorités — pas une liste générique. Téléchargez
          cette carte pour écrire à la main.
        </p>
        {doc.exercises.map((ex) => (
          <div
            key={ex.id}
            className="rounded-2xl border border-[#1C1412]/10 bg-[#FBF9F6] p-5 sm:p-6 space-y-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-serif text-xl sm:text-2xl font-bold">
                {ex.title}
              </h3>
              {ex.premiumPlus ? (
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C1F28] bg-[#5C1F28]/10 px-2 py-0.5 rounded-full">
                  Premium Plus
                </span>
              ) : null}
            </div>
            <p className="text-base leading-relaxed">
              <span className="font-semibold text-[#5C1F28]">Objectif — </span>
              {ex.objective}
            </p>
            <p className="text-base leading-relaxed text-[#1C1412]/80">{ex.why}</p>
            <p className="text-sm text-[#8A6A2E]">Durée : {ex.duration}</p>
            <div>
              <p className="font-serif text-lg font-bold text-[#5C1F28]">Consignes</p>
              <ol className="mt-2 list-decimal pl-5 space-y-2 text-base leading-relaxed">
                {ex.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
            {(ex.fillPrompts?.length ? ex.fillPrompts : ["Écrire ici…"]).map(
              (prompt) => (
                <div
                  key={prompt}
                  className="rounded-xl border border-dashed border-[#B8954A]/50 bg-white p-4"
                >
                  <p className="text-sm font-semibold text-[#5C1F28]">{prompt}</p>
                  <div className="mt-3 space-y-3">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="h-8 border-b border-[#1C1412]/20" />
                    ))}
                  </div>
                </div>
              )
            )}
            {ex.rolePlay ? (
              <div className="rounded-xl border border-[#5C1F28]/15 bg-white p-4 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#B8954A]">
                  Jeu de rôle
                </p>
                <p className="font-serif text-lg font-bold">{ex.rolePlay.title}</p>
                <p className="text-sm leading-relaxed">{ex.rolePlay.scene}</p>
                <div className="grid gap-2 sm:grid-cols-2 text-sm">
                  <div className="rounded-lg bg-[#5C1F28]/08 p-3">
                    <p className="font-bold text-[#5C1F28]">{doc.names.nameA}</p>
                    <p className="mt-1">{ex.rolePlay.roleA}</p>
                  </div>
                  <div className="rounded-lg bg-[#B8954A]/15 p-3">
                    <p className="font-bold text-[#8A6A2E]">{doc.names.nameB}</p>
                    <p className="mt-1">{ex.rolePlay.roleB}</p>
                  </div>
                </div>
              </div>
            ) : null}
            <p className="text-sm italic text-[#5C1F28]">{ex.takeaway}</p>
          </div>
        ))}
        <Link
          href="/couple/exercices"
          className="inline-flex text-sm font-semibold text-[#5C1F28] underline underline-offset-2"
        >
          Ouvrir aussi le cahier dédié →
        </Link>
      </div>
    )
  }
  return (
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
    </ol>
  )
}

function ChapterCard({
  ch,
  doc,
  className,
  showDownload = true,
}: {
  ch: Chapter
  doc: CoupleReportDocument
  className?: string
  showDownload?: boolean
}) {
  return (
    <section
      id={`ch-${ch.id}`}
      className={cn(
        "scroll-mt-24 rounded-[1.75rem] border border-[#1C1412]/10 bg-white/95 p-6 sm:p-9 shadow-sm",
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8954A]">
            Carte {ch.page}
            {ch.id.startsWith("pp-") ? " · Premium Plus" : ""}
          </p>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold leading-tight text-[#1C1412]">
            {ch.title}
          </h2>
          {ch.kind === "section" && ch.subtitle ? (
            <p className="mt-2 font-serif text-lg italic text-[#8A6A2E]">
              {ch.subtitle}
            </p>
          ) : null}
        </div>
        {showDownload ? (
          <button
            type="button"
            onClick={() => downloadChapter(ch, doc)}
            className="print:hidden inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-[#1C1412]/15 bg-white px-3 text-xs font-semibold hover:border-[#5C1F28]/40"
          >
            <Download className="h-3.5 w-3.5" /> Télécharger la carte
          </button>
        ) : null}
      </div>
      <div className="mt-6">
        <ChapterBody ch={ch} doc={doc} />
      </div>
    </section>
  )
}

function ThumbnailRail({
  chapters,
  doc,
  index,
  onSelect,
  onDownload,
  collapsed,
}: {
  chapters: Chapter[]
  doc: CoupleReportDocument
  index: number
  onSelect: (i: number) => void
  onDownload: (ch: Chapter) => void
  collapsed?: boolean
}) {
  const activeRef = React.useRef<HTMLButtonElement | null>(null)

  React.useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [index])

  if (collapsed) return null

  return (
    <aside className="print:hidden flex w-[11.5rem] shrink-0 flex-col border-r border-[#1C1412]/10 bg-[#F8F4EE]/90 lg:w-[13.5rem]">
      <div className="sticky top-0 z-10 border-b border-[#1C1412]/10 bg-[#F8F4EE] px-3 py-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B8954A]">
          Cartes
        </p>
        <p className="mt-0.5 font-serif text-sm font-bold text-[#1C1412]">
          {chapters.length} carte{chapters.length > 1 ? "s" : ""}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-[calc(100vh-8rem)]">
        {chapters.map((ch, i) => {
          const active = i === index
          return (
            <div
              key={ch.id}
              className={cn(
                "group relative rounded-xl border transition-all",
                active
                  ? "border-[#5C1F28] bg-white shadow-md ring-1 ring-[#5C1F28]/25"
                  : "border-[#1C1412]/10 bg-white/70 hover:border-[#5C1F28]/35"
              )}
            >
              <button
                type="button"
                ref={active ? activeRef : undefined}
                onClick={() => onSelect(i)}
                className="w-full text-left p-2.5"
              >
                <div
                  className={cn(
                    "mb-2 flex h-16 items-end rounded-lg px-2 py-1.5",
                    ch.id.startsWith("pp-")
                      ? "bg-gradient-to-br from-[#5C1F28]/90 to-[#3D1519]"
                      : "bg-gradient-to-br from-[#FBF9F6] to-[#EDE6DA]"
                  )}
                >
                  <span
                    className={cn(
                      "font-serif text-2xl font-bold leading-none",
                      ch.id.startsWith("pp-") ? "text-[#F3D9A4]" : "text-[#5C1F28]/40"
                    )}
                  >
                    {ch.page}
                  </span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#B8954A]">
                  Carte {ch.page}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs font-semibold leading-snug text-[#1C1412]">
                  {ch.title}
                </p>
                <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-[#1C1412]/50">
                  {chapterSnippet(ch, doc)}
                </p>
              </button>
              <button
                type="button"
                title="Télécharger cette carte"
                onClick={(e) => {
                  e.stopPropagation()
                  onDownload(ch)
                }}
                className="absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[#1C1412]/10 bg-white/95 text-[#5C1F28] opacity-0 shadow-sm transition-opacity group-hover:opacity-100 focus:opacity-100"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
          )
        })}
      </div>
    </aside>
  )
}

/**
 * Rapport Couple — navigation type diaporama (vignettes à gauche) + présentation.
 */
export function CoupleReportView({
  doc,
  demoLabel,
  className,
  analysisOnly = false,
}: Props) {
  const isPP = isPremiumPlusOffer(doc.offerId)
  const [mode, setMode] = React.useState<ViewMode>("deck")
  const [index, setIndex] = React.useState(0)
  const [railOpen, setRailOpen] = React.useState(true)

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
        id: "plan",
        page: page + 2,
        title: "Plan d’action",
      },
    ]
  }, [doc, analysisOnly])

  const current = chapters[Math.min(index, chapters.length - 1)]!

  React.useEffect(() => {
    setIndex(0)
  }, [doc.offerId, doc.names.nameA, doc.names.nameB])

  React.useEffect(() => {
    if (mode !== "present" && mode !== "deck") return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault()
        setIndex((i) => Math.min(chapters.length - 1, i + 1))
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault()
        setIndex((i) => Math.max(0, i - 1))
      } else if (e.key === "Escape" && mode === "present") {
        setMode("deck")
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [mode, chapters.length])

  const dateLabel = new Date(doc.versions.generation_date).toLocaleDateString(
    "fr-FR",
    { day: "numeric", month: "long", year: "numeric" }
  )

  const go = (dir: -1 | 1) => {
    setIndex((i) => Math.max(0, Math.min(chapters.length - 1, i + dir)))
  }

  const handlePrint = () => window.print()

  const handleDownloadAll = () => {
    const htmlParts: string[] = [
      `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"/><title>${doc.brand} — ${doc.names.nameA} & ${doc.names.nameB}</title>`,
      `<style>
        body{font-family:Georgia,"Times New Roman",serif;max-width:720px;margin:2rem auto;padding:0 1.25rem;color:#1C1412;line-height:1.7;font-size:16px;background:#FBF9F6}
        h1{font-size:1.85rem} h2{font-size:1.35rem;margin:2.25rem 0 .75rem;color:#5C1F28;border-top:1px solid #B8954A55;padding-top:1.25rem}
        h3{font-size:1.15rem;color:#5C1F28} .meta{color:#666;font-size:14px} .sub{color:#8A6A2E;font-style:italic}
        ul,ol{padding-left:1.35rem} .callout{border:1px solid #B8954A66;background:#B8954A12;padding:1rem;border-radius:12px;margin:1rem 0}
        .fill{border:1px dashed #B8954A88;padding:1rem;margin:1rem 0;min-height:4rem;border-radius:12px}
      </style></head><body>`,
      `<p class="meta">${doc.brand}</p>`,
      `<h1>Bilan de couple — ${doc.names.nameA} & ${doc.names.nameB}</h1>`,
      `<p class="meta">Score ${doc.globalScore}% · ${dateLabel} · ${isPP ? "Premium Plus" : "Essentiel"} · ${chapters.length} cartes</p>`,
    ]
    for (const ch of chapters) {
      if (ch.kind === "section") {
        htmlParts.push(`<h2>${ch.title}</h2>`)
        if (ch.subtitle) htmlParts.push(`<p class="sub">${ch.subtitle}</p>`)
        for (const b of blocksFor(ch.section)) {
          if (b.type === "h2") htmlParts.push(`<h3>${b.text}</h3>`)
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
          else if (b.type === "rolePlay")
            htmlParts.push(
              `<div class="callout"><strong>${b.title}</strong><br/>${b.scene}<br/>A: ${b.roleA}<br/>B: ${b.roleB}</div>`
            )
        }
      } else if (ch.kind === "exercises") {
        htmlParts.push(`<h2>${ch.title}</h2>`)
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

  const selectCard = (i: number) => {
    setIndex(i)
    if (mode === "scroll") {
      requestAnimationFrame(() => {
        document
          .getElementById(`ch-${chapters[i]?.id}`)
          ?.scrollIntoView({ behavior: "smooth", block: "start" })
      })
    }
  }

  /* ——— Vue présentée plein écran ——— */
  if (mode === "present") {
    return (
      <div className="fixed inset-0 z-50 flex bg-[#1C1412] text-[#FBF9F6] print:hidden">
        <ThumbnailRail
          chapters={chapters}
          doc={doc}
          index={index}
          onSelect={selectCard}
          onDownload={(ch) => downloadChapter(ch, doc)}
          collapsed={!railOpen}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRailOpen((v) => !v)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 hover:bg-white/10"
                aria-label="Vignettes"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
              <p className="text-sm text-white/70">
                Carte {current.page} / {chapters.length}
              </p>
            </div>
            <p className="hidden sm:block font-serif text-sm text-[#F3D9A4]">
              {doc.names.nameA} & {doc.names.nameB}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => downloadChapter(current, doc)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/15 px-3 text-xs font-semibold hover:bg-white/10"
              >
                <Download className="h-3.5 w-3.5" /> Carte
              </button>
              <button
                type="button"
                onClick={() => setMode("deck")}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white/15 px-3 text-xs font-semibold hover:bg-white/25"
              >
                <Minimize2 className="h-3.5 w-3.5" /> Quitter
              </button>
              <button
                type="button"
                onClick={() => setMode("deck")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 hover:bg-white/10"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex flex-1 items-stretch gap-3 overflow-hidden p-4 sm:p-6">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={index === 0}
              className="hidden sm:inline-flex h-12 w-12 shrink-0 self-center items-center justify-center rounded-full border border-white/20 disabled:opacity-30 hover:bg-white/10"
              aria-label="Précédent"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div className="mx-auto w-full max-w-3xl overflow-y-auto rounded-2xl bg-[#FBF9F6] text-[#1C1412] shadow-2xl">
              <ChapterCard ch={current} doc={doc} className="min-h-full border-0 shadow-none" />
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={index >= chapters.length - 1}
              className="hidden sm:inline-flex h-12 w-12 shrink-0 self-center items-center justify-center rounded-full border border-white/20 disabled:opacity-30 hover:bg-white/10"
              aria-label="Suivant"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3 sm:hidden">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={index === 0}
              className="inline-flex h-10 items-center gap-1 rounded-lg border border-white/20 px-3 text-sm disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" /> Préc.
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={index >= chapters.length - 1}
              className="inline-flex h-10 items-center gap-1 rounded-lg bg-[#5C1F28] px-3 text-sm font-semibold disabled:opacity-30"
            >
              Suiv. <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <article
      className={cn(
        "mx-auto w-full max-w-6xl pb-20 text-[#1C1412] print:max-w-none",
        className
      )}
    >
      <div className="flex flex-wrap gap-2 print:hidden mb-4">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#1C1412]/15 bg-white px-4 text-sm font-semibold"
        >
          <Printer className="h-4 w-4" /> Imprimer
        </button>
        <button
          type="button"
          onClick={handleDownloadAll}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#1C1412]/15 bg-white px-4 text-sm font-semibold"
        >
          <Download className="h-4 w-4" /> Tout télécharger
        </button>
        <div className="inline-flex rounded-xl border border-[#1C1412]/15 bg-white p-1">
          <button
            type="button"
            onClick={() => setMode("deck")}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-bold",
              mode === "deck" ? "bg-[#5C1F28] text-white" : "text-[#1C1412]/70"
            )}
          >
            <Maximize2 className="h-3.5 w-3.5" /> Cartes
          </button>
          <button
            type="button"
            onClick={() => setMode("scroll")}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-bold",
              mode === "scroll" ? "bg-[#5C1F28] text-white" : "text-[#1C1412]/70"
            )}
          >
            <LayoutList className="h-3.5 w-3.5" /> Défilement
          </button>
          <button
            type="button"
            onClick={() => setMode("present")}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-bold text-[#1C1412]/70 hover:bg-[#F8F4EE]"
          >
            <Presentation className="h-3.5 w-3.5" /> Présenter
          </button>
        </div>
        <button
          type="button"
          onClick={() => setRailOpen((v) => !v)}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#1C1412]/15 bg-white px-3 text-sm font-semibold lg:hidden"
        >
          <PanelLeft className="h-4 w-4" />
          {railOpen ? "Masquer" : "Vignettes"}
        </button>
        <Link
          href="/couple/exercices"
          className="inline-flex h-10 items-center rounded-xl border border-[#B8954A]/40 bg-[#B8954A]/10 px-4 text-sm font-semibold text-[#5C1F28]"
        >
          Cahier exercices
        </Link>
      </div>

      <header className="relative overflow-hidden rounded-[1.75rem] border border-[#B8954A]/35 bg-gradient-to-br from-[#5C1F28] via-[#3D1519] to-[#1C1412] p-6 sm:p-9 text-[#FBF9F6] shadow-lg print:shadow-none mb-4">
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
              Structure
            </p>
            <p className="font-serif text-2xl font-bold">
              {chapters.length} cartes
            </p>
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
              <Crown className="h-3 w-3" /> Premium Plus · Essentiel + modules
            </span>
          ) : (
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
              Bilan Essentiel
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
        <div className="mb-4 rounded-2xl border border-[#5C1F28]/30 bg-[#F8F4EE] px-5 py-4 text-sm leading-relaxed">
          {doc.safetyNotice}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[1.5rem] border border-[#1C1412]/10 bg-white/60 shadow-sm print:border-0 print:shadow-none">
        <div className="flex min-h-[32rem]">
          {(mode === "deck" || mode === "scroll") && railOpen ? (
            <ThumbnailRail
              chapters={chapters}
              doc={doc}
              index={index}
              onSelect={selectCard}
              onDownload={(ch) => downloadChapter(ch, doc)}
            />
          ) : null}

          <div className="min-w-0 flex-1">
            {mode === "deck" ? (
              <div className="space-y-4 p-4 sm:p-6 print:hidden">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-[#1C1412]/55">
                    Carte {current.page} / {chapters.length} — cliquez une vignette à
                    gauche pour naviguer
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => go(-1)}
                      disabled={index === 0}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border disabled:opacity-40"
                      aria-label="Précédent"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => go(1)}
                      disabled={index >= chapters.length - 1}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border disabled:opacity-40"
                      aria-label="Suivant"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <ChapterCard ch={current} doc={doc} className="min-h-[26rem]" />
                <div className="flex justify-between gap-3">
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
                    onClick={() => downloadChapter(current, doc)}
                    className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-[#B8954A]/40 bg-[#B8954A]/10 px-4 text-sm font-semibold text-[#5C1F28]"
                  >
                    <Download className="h-4 w-4" /> Télécharger cette carte
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
              </div>
            ) : (
              <div className="space-y-6 p-4 sm:p-6 print:hidden">
                {chapters.map((ch) => (
                  <ChapterCard key={ch.id} ch={ch} doc={doc} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Impression : toujours tout le dossier */}
      <div className="hidden print:block space-y-10 mt-6">
        {chapters.map((ch) => (
          <ChapterCard key={`print-${ch.id}`} ch={ch} doc={doc} showDownload={false} />
        ))}
      </div>

      <footer className="pt-6 border-t border-[#1C1412]/10 space-y-2 text-[11px] text-[#1C1412]/50">
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
