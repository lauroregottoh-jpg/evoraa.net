"use client"

import * as React from "react"
import Link from "next/link"
import {
  ChevronDown,
  ClipboardList,
  Crown,
  Lock,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import type { LivingPersonalizedReport } from "@/lib/rapport/personalized/buildLivingReport"
import { cn } from "@/utils/cn"

/** Rapport vivant — chapitres en accordéon ; débloqués en priorité. */
export function PersonalizedReportView({
  firstName,
  living,
  isAlliance,
  demoLabel,
}: {
  firstName?: string | null
  living: LivingPersonalizedReport
  isAlliance: boolean
  demoLabel?: string
}) {
  const name = firstName?.trim() || "Membre"
  const { base, chapters } = living

  const ordered = React.useMemo(() => {
    const rest = chapters.filter((c) => c.id !== "couverture")
    return [...rest].sort((a, b) => {
      if (a.unlocked === b.unlocked) return a.page - b.page
      return a.unlocked ? -1 : 1
    })
  }, [chapters])

  const firstUnlockedId = ordered.find((c) => c.unlocked)?.id ?? null
  const [openId, setOpenId] = React.useState<string | null>(firstUnlockedId)
  const [expandAll, setExpandAll] = React.useState(false)

  React.useEffect(() => {
    setOpenId(firstUnlockedId)
    setExpandAll(false)
  }, [firstUnlockedId])

  const isOpen = (id: string) => expandAll || openId === id

  return (
    <article className="space-y-5 max-w-3xl mx-auto">
      <header className="relative overflow-hidden rounded-[1.75rem] border border-[#B8954A]/35 bg-gradient-to-br from-[#1C1412] via-[#2A1810] to-[#5C1F28] p-6 sm:p-8 text-[#F8F4EE] shadow-elevated">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F3D9A4]">
          KELIAA · Alliance
        </p>
        <h1 className="mt-3 font-serif text-3xl sm:text-4xl font-bold leading-tight">
          Votre Rapport Personnalisé Alliance™
        </h1>
        <p className="mt-2 text-sm text-white/75 leading-relaxed max-w-xl">
          Cliquez sur une partie pour l’ouvrir. Les analyses déjà débloquées
          apparaissent en premier.
        </p>
        <div className="mt-5 flex flex-wrap items-end gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/50">
              Membre
            </p>
            <p className="font-serif text-xl font-bold">{name}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/50">
              Complétude
            </p>
            <p className="font-serif text-xl font-bold text-[#F3D9A4]">
              {living.completenessPercent}%
            </p>
          </div>
          {living.globalIndex != null ? (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/50">
                Indice global
              </p>
              <p className="font-serif text-xl font-bold">{living.globalIndex}</p>
            </div>
          ) : null}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {isAlliance ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#B8954A]/50 bg-[#B8954A]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#F3D9A4]">
              <Crown className="h-3 w-3" /> {base.offerLabel}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
              <Lock className="h-3 w-3" /> Aperçu
            </span>
          )}
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold">
            {living.testsCompleted}/{living.essentialsTotal} évaluations
          </span>
          {demoLabel ? (
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold">
              {demoLabel}
            </span>
          ) : null}
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {ordered.filter((c) => c.unlocked).length} parties ouvertes ·{" "}
          {ordered.filter((c) => !c.unlocked).length} à débloquer
        </p>
        <button
          type="button"
          onClick={() => setExpandAll((v) => !v)}
          className="text-xs font-bold text-primary underline underline-offset-2"
        >
          {expandAll ? "Replier tout" : "Voir toute la vision"}
        </button>
      </div>

      {living.nextUnlock ? (
        <div className="rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm">
            <Sparkles className="inline h-4 w-4 text-accent mr-1.5" />
            Complétez <strong>{living.nextUnlock.title}</strong> pour enrichir «{" "}
            {living.nextUnlock.chapterTitle} ».
          </p>
          <Link
            href={living.nextUnlock.href}
            className="inline-flex h-9 items-center gap-1 rounded-xl bg-primary px-3 text-xs font-bold text-primary-foreground"
          >
            Faire le test <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : null}

      <div className="space-y-2.5">
        {ordered.map((chapter) => {
          const open = isOpen(chapter.id)
          return (
            <section
              key={chapter.id}
              className={cn(
                "rounded-2xl border overflow-hidden transition-colors",
                chapter.unlocked
                  ? "border-border bg-card"
                  : "border-dashed border-border/80 bg-secondary/25"
              )}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenId((cur) => (cur === chapter.id && !expandAll ? null : chapter.id))
                }
                className="w-full flex items-start justify-between gap-3 p-4 sm:p-5 text-left"
              >
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                    Page {chapter.page}
                    {chapter.unlocked ? " · Débloqué" : " · Verrouillé"}
                  </p>
                  <h2 className="font-serif text-lg sm:text-xl font-bold">
                    {chapter.title}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {chapter.teaser}
                  </p>
                </div>
                <span className="flex items-center gap-2 shrink-0 pt-1">
                  {!chapter.unlocked ? (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ClipboardList className="h-4 w-4 text-primary" />
                  )}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      open && "rotate-180"
                    )}
                  />
                </span>
              </button>

              {open ? (
                <div className="px-4 sm:px-5 pb-5 space-y-3 border-t border-border/60 pt-4">
                  {!chapter.unlocked ? (
                    <div className="rounded-xl border border-border/70 bg-white/70 p-4 space-y-3">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {chapter.unlockHint}
                      </p>
                      {chapter.unlockHref ? (
                        <Link
                          href={isAlliance ? chapter.unlockHref : "/premium"}
                          className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
                        >
                          {isAlliance
                            ? "Faire le test pour ouvrir"
                            : "Ouvrir avec Alliance"}
                        </Link>
                      ) : null}
                    </div>
                  ) : (
                    <>
                      {chapter.body ? (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {chapter.body}
                        </p>
                      ) : null}
                      {chapter.bullets?.length ? (
                        <ul className="space-y-1.5">
                          {chapter.bullets.map((b) => (
                            <li
                              key={b}
                              className="text-sm text-foreground/90 leading-relaxed"
                            >
                              · {b}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {chapter.tips?.length ? (
                        <div className="space-y-2">
                          {chapter.tips.map((t) => (
                            <div
                              key={t.id ?? t.title}
                              className="rounded-xl border border-border/70 p-3 space-y-1"
                            >
                              <p className="text-sm font-semibold">{t.title}</p>
                              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                                {t.advice}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              ) : null}
            </section>
          )
        })}
      </div>

      {!isAlliance && base.ctaUpgrade ? (
        <Link
          href={base.ctaUpgrade.href}
          className="flex items-center justify-center h-12 rounded-xl bg-primary text-primary-foreground text-sm font-bold"
        >
          {base.ctaUpgrade.label}
        </Link>
      ) : null}
    </article>
  )
}
