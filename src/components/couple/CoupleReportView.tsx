"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronDown, Crown, HeartHandshake } from "lucide-react"
import type { CoupleReportDocument } from "@/lib/couple/report"
import { isPremiumPlusOffer } from "@/lib/couple/offers"
import { cn } from "@/utils/cn"

type Props = {
  doc: CoupleReportDocument
  demoLabel?: string
  className?: string
}

/**
 * Rapport Couple premium — palette carnet (crème / bordeaux / or),
 * même esprit que le rapport Alliance, identité visuelle landing Couple.
 */
export function CoupleReportView({ doc, demoLabel, className }: Props) {
  const isPP = isPremiumPlusOffer(doc.offerId)
  const chapters = React.useMemo(() => {
    const base = doc.sections.map((s, i) => ({
      kind: "section" as const,
      id: s.id,
      page: i + 1,
      title: s.title,
      paragraphs: s.paragraphs,
      bullets: s.bullets,
    }))
    let page = base.length
    const extras = doc.premiumPlusExtras.map((s) => {
      page += 1
      return {
        kind: "section" as const,
        id: s.id,
        page,
        title: s.title,
        paragraphs: s.paragraphs,
        bullets: s.bullets,
      }
    })
    const exercises = {
      kind: "exercises" as const,
      id: "exercices",
      page: page + 1,
      title: "Exercices à vivre ensemble",
    }
    const plan = {
      kind: "plan" as const,
      id: "plan",
      page: page + 2,
      title: "Plan d’action",
    }
    return [...base, ...extras, exercises, plan]
  }, [doc])

  const [expandAll, setExpandAll] = React.useState(true)
  const [openId, setOpenId] = React.useState<string | null>(null)
  const isOpen = (id: string) => expandAll || openId === id

  const dateLabel = new Date(doc.versions.generation_date).toLocaleDateString(
    "fr-FR",
    { day: "numeric", month: "long", year: "numeric" }
  )

  return (
    <article
      className={cn(
        "max-w-3xl mx-auto space-y-5 pb-16 text-[#1C1412]",
        className
      )}
    >
      {/* Couverture */}
      <header className="relative overflow-hidden rounded-[1.75rem] border border-[#B8954A]/35 bg-gradient-to-br from-[#5C1F28] via-[#3D1519] to-[#1C1412] p-6 sm:p-9 text-[#FBF9F6] shadow-lg">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
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
              <Crown className="h-3 w-3" /> Premium Plus
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
        <p className="relative z-10 mt-4 text-sm text-white/75 leading-relaxed max-w-xl">
          {doc.tagline}
        </p>
      </header>

      {doc.safetyNotice ? (
        <div className="rounded-2xl border border-[#5C1F28]/30 bg-[#F8F4EE] px-5 py-4 text-sm leading-relaxed">
          {doc.safetyNotice}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <p className="text-xs text-[#1C1412]/55">
          {chapters.length} chapitres · indicateur de dynamique, pas un verdict
        </p>
        <button
          type="button"
          onClick={() => setExpandAll((v) => !v)}
          className="text-xs font-bold text-[#5C1F28] underline underline-offset-2"
        >
          {expandAll ? "Replier tout" : "Tout déplier"}
        </button>
      </div>

      <div className="space-y-2.5">
        {chapters.map((ch) => {
          const open = isOpen(ch.id)
          return (
            <section
              key={ch.id}
              className="rounded-2xl border border-[#1C1412]/10 bg-white overflow-hidden shadow-sm"
            >
              <button
                type="button"
                onClick={() =>
                  setOpenId((cur) =>
                    cur === ch.id && !expandAll ? null : ch.id
                  )
                }
                className="w-full flex items-start justify-between gap-3 p-4 sm:p-5 text-left"
              >
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8954A]">
                    Chapitre {ch.page}
                    {ch.id.startsWith("pp-") ? " · Premium Plus" : ""}
                  </p>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1C1412]">
                    {ch.title}
                  </h2>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-[#1C1412]/40 shrink-0 mt-1 transition-transform",
                    open && "rotate-180"
                  )}
                />
              </button>

              {open ? (
                <div className="px-4 sm:px-5 pb-5 space-y-3 border-t border-[#1C1412]/8 pt-4">
                  {ch.kind === "section" ? (
                    <>
                      {ch.paragraphs.map((p, i) => (
                        <p
                          key={i}
                          className="text-sm sm:text-[15px] leading-relaxed text-[#1C1412]/90"
                        >
                          {p}
                        </p>
                      ))}
                      {ch.bullets?.length ? (
                        <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#1C1412]/90">
                          {ch.bullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      ) : null}
                    </>
                  ) : null}

                  {ch.kind === "exercises" ? (
                    <div className="space-y-4">
                      {doc.exercises.map((ex) => (
                        <div
                          key={ex.id}
                          className="rounded-xl border border-[#B8954A]/25 bg-[#FBF9F6] p-4 space-y-2"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-serif text-lg font-bold">
                              {ex.title}
                            </h3>
                            {ex.premiumPlus ? (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C1F28] bg-[#5C1F28]/10 px-2 py-0.5 rounded-full">
                                Premium Plus
                              </span>
                            ) : null}
                          </div>
                          <p className="text-sm text-[#1C1412]/80">
                            <span className="font-semibold">Objectif — </span>
                            {ex.objective}
                          </p>
                          <p className="text-sm text-[#1C1412]/80">
                            <span className="font-semibold">Pourquoi — </span>
                            {ex.why}
                          </p>
                          <p className="text-xs text-[#1C1412]/55">
                            Durée : {ex.duration} · Préparation : {ex.preparation}
                          </p>
                          <ol className="list-decimal pl-5 space-y-1 text-sm">
                            {ex.steps.map((s) => (
                              <li key={s}>{s}</li>
                            ))}
                          </ol>
                          {ex.questions.length ? (
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-[#B8954A] mb-1">
                                Questions
                              </p>
                              <ul className="list-disc pl-5 space-y-1 text-sm">
                                {ex.questions.map((q) => (
                                  <li key={q}>{q}</li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                          <p className="text-sm italic text-[#5C1F28]">
                            {ex.takeaway}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {ch.kind === "plan" ? (
                    <ol className="space-y-3">
                      {doc.actionPlan.map((step) => (
                        <li
                          key={step.order}
                          className="rounded-xl border border-[#1C1412]/10 bg-[#F8F4EE] p-4"
                        >
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#B8954A]">
                            Étape {step.order}
                          </p>
                          <p className="font-serif text-lg font-bold mt-0.5">
                            {step.what}
                          </p>
                          <p className="text-sm mt-2 text-[#1C1412]/85">
                            <span className="font-semibold">Comment — </span>
                            {step.how}
                          </p>
                          <p className="text-sm text-[#1C1412]/85">
                            <span className="font-semibold">Quand — </span>
                            {step.when}
                          </p>
                          <p className="text-sm text-[#1C1412]/85">
                            <span className="font-semibold">But — </span>
                            {step.goal}
                          </p>
                          <p className="text-xs mt-1 text-[#1C1412]/55">
                            Signal de progrès : {step.progressSignal}
                          </p>
                        </li>
                      ))}
                    </ol>
                  ) : null}
                </div>
              ) : null}
            </section>
          )
        })}
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
