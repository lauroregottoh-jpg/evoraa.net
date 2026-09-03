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
  variant = "global",
}: {
  firstName?: string | null
  living: LivingPersonalizedReport
  isAlliance: boolean
  demoLabel?: string
  /** global = page complète section par section */
  variant?: "global" | "accordion"
}) {
  const name = firstName?.trim() || "Membre"
  const { base, chapters } = living

  const ordered = React.useMemo(() => {
    const rest = chapters.filter((c) => c.id !== "couverture")
    // Sur la page globale : ordre officiel des pages (1→18)
    if (variant === "global") {
      return [...rest].sort((a, b) => a.page - b.page)
    }
    return [...rest].sort((a, b) => {
      if (a.unlocked === b.unlocked) return a.page - b.page
      return a.unlocked ? -1 : 1
    })
  }, [chapters, variant])

  const unlockedCount = ordered.filter((c) => c.unlocked).length
  const lockedCount = ordered.length - unlockedCount
  const firstUnlockedId = ordered.find((c) => c.unlocked)?.id ?? null
  const [openId, setOpenId] = React.useState<string | null>(
    variant === "global" ? null : firstUnlockedId
  )
  const [expandAll, setExpandAll] = React.useState(variant === "global")

  React.useEffect(() => {
    if (variant === "global") {
      setExpandAll(true)
      setOpenId(null)
    } else {
      setOpenId(firstUnlockedId)
      setExpandAll(false)
    }
  }, [firstUnlockedId, variant])

  const isOpen = (id: string) => expandAll || openId === id
  const hasAnyTest = living.testsCompleted > 0

  return (
    <article className="space-y-5 max-w-3xl mx-auto">
      <header className="relative overflow-hidden rounded-[1.75rem] border border-[#B8954A]/40 bg-gradient-to-br from-[#A07070] via-[#2A1810] to-[#A07070] p-6 sm:p-8 text-[#F2EBE0] shadow-elevated">
        <div
          aria-hidden
          className="alliance-gold-sweep pointer-events-none absolute inset-0 opacity-40"
        />
        <p className="relative z-10 text-[10px] font-bold uppercase tracking-[0.22em] text-[#D4AF72]">
          KELIAA · Rapport complet
        </p>
        <h1 className="relative z-10 mt-3 font-serif text-3xl sm:text-4xl font-bold leading-tight">
          {isAlliance
            ? `${name}, votre lecture Alliance™`
            : `${name}, aperçu de votre rapport`}
        </h1>
        <p className="relative z-10 mt-2 text-sm text-white/75 leading-relaxed max-w-xl">
          Section par section. Chaque test complété enrichit automatiquement
          votre rapport — les parties verrouillées restent visibles avec un lien
          pour les débloquer.
        </p>

        <div className="relative z-10 mt-5 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-white/60">
            <span>Complétude du rapport</span>
            <span className="font-bold text-[#D4AF72]">
              {living.completenessPercent}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#B8954A] to-[#D4AF72] transition-all duration-700"
              style={{ width: `${Math.min(100, living.completenessPercent)}%` }}
            />
          </div>
        </div>

        <div className="relative z-10 mt-5 flex flex-wrap items-end gap-4">
          {living.globalIndex != null ? (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/50">
                Indice global
              </p>
              <p className="font-serif text-2xl font-bold">{living.globalIndex}</p>
            </div>
          ) : null}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/50">
              Parties ouvertes
            </p>
            <p className="font-serif text-2xl font-bold text-[#D4AF72]">
              {unlockedCount}
              <span className="text-base text-white/45 font-normal">
                /{ordered.length}
              </span>
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/50">
              Évaluations
            </p>
            <p className="font-serif text-2xl font-bold">
              {living.testsCompleted}
              <span className="text-base text-white/45 font-normal">
                /{living.essentialsTotal}
              </span>
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-4 flex flex-wrap gap-2">
          {isAlliance ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#B8954A]/50 bg-[#B8954A]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#D4AF72]">
              <Crown className="h-3 w-3" /> {base.offerLabel}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
              <Lock className="h-3 w-3" /> Aperçu Découverte
            </span>
          )}
          {demoLabel ? (
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold">
              {demoLabel}
            </span>
          ) : null}
        </div>
      </header>

      {!hasAnyTest ? (
        <div className="rounded-2xl border border-accent/30 bg-accent/10 p-5 space-y-3">
          <p className="font-serif text-xl font-bold">Commencez par un test</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Votre rapport se construit au fur et à mesure. Complétez au moins un
            questionnaire Matching pour ouvrir vos premières analyses.
          </p>
          <Link
            href="/assessments"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground"
          >
            Aller aux tests <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {unlockedCount} ouverte{unlockedCount > 1 ? "s" : ""} · {lockedCount}{" "}
          à débloquer
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/assessments"
            className="text-xs font-semibold text-primary underline underline-offset-2"
          >
            Continuer les tests
          </Link>
          <button
            type="button"
            onClick={() => setExpandAll((v) => !v)}
            className="text-xs font-bold text-accent underline underline-offset-2"
          >
            {expandAll ? "Replier tout" : "Tout déplier"}
          </button>
        </div>
      </div>

      {living.nextUnlock ? (
        <div className="rounded-2xl border border-[#B8954A]/35 bg-gradient-to-r from-[#B8954A]/15 via-white to-primary/[0.04] px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm">
            <Sparkles className="inline h-4 w-4 text-accent mr-1.5" />
            Prochaine clé : <strong>{living.nextUnlock.title}</strong> → enrichit
            « {living.nextUnlock.chapterTitle} »
          </p>
          <Link
            href={living.nextUnlock.href}
            className="inline-flex h-9 items-center gap-1 rounded-xl bg-[#B8954A] px-3 text-xs font-bold text-[#A07070]"
          >
            Faire le test <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : null}

      <div className="space-y-2.5">
        {ordered.map((chapter) => {
          const open = isOpen(chapter.id)
          const isPortrait = chapter.id === "portrait"
          return (
            <section
              key={chapter.id}
              className={cn(
                "rounded-2xl border overflow-hidden transition-colors",
                chapter.unlocked
                  ? "border-[#B8954A]/35 bg-card shadow-sm"
                  : "border-dashed border-border/80 bg-secondary/25"
              )}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenId((cur) =>
                    cur === chapter.id && !expandAll ? null : chapter.id
                  )
                }
                className="w-full flex items-start justify-between gap-3 p-4 sm:p-5 text-left"
              >
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      chapter.unlocked ? "text-accent" : "text-muted-foreground"
                    )}
                  >
                    Page {chapter.page}
                    {chapter.unlocked ? " · Débloqué" : " · Encore bloqué"}
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
                    <ClipboardList className="h-4 w-4 text-accent" />
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
                      <p className="text-sm font-medium text-foreground">
                        Pour débloquer vos résultats, cliquez ici :
                      </p>
                      {chapter.unlockHref ? (
                        <Link
                          href={isAlliance ? chapter.unlockHref : "/premium"}
                          className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
                        >
                          {isAlliance
                            ? "Faire le test pour ouvrir"
                            : "Débloquer avec Alliance"}
                        </Link>
                      ) : null}
                    </div>
                  ) : isPortrait ? (
                    <div className="space-y-4">
                      {chapter.body ? (
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                          {chapter.body}
                        </p>
                      ) : null}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          href={
                            variant === "global" ? "/rapport" : "/rapport/global"
                          }
                          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#B8954A] px-4 text-sm font-bold text-[#A07070]"
                        >
                          {variant === "global"
                            ? "Retour au hub Rapport"
                            : "Découvrir votre rapport complet"}
                        </Link>
                        <Link
                          href={
                            isAlliance
                              ? chapter.unlockHref ||
                                living.nextUnlock?.href ||
                                "/assessments"
                              : "/premium"
                          }
                          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 text-sm font-semibold"
                        >
                          Finaliser le test
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <>
                      {chapter.body ? (
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                          {chapter.body}
                        </p>
                      ) : null}
                      {chapter.insightCards?.length ? (
                        <div className="space-y-3">
                          {chapter.insightCards.map((card) => (
                            <div
                              key={card.id}
                              className={cn(
                                "rounded-xl border p-4 space-y-2.5",
                                card.kind === "force"
                                  ? "border-[#B8954A]/35 bg-[#B8954A]/[0.06]"
                                  : "border-primary/20 bg-primary/[0.03]"
                              )}
                            >
                              <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                                {card.kind === "force"
                                  ? "Force"
                                  : "Axe de progression"}
                              </p>
                              <h3 className="font-serif text-lg font-bold leading-snug">
                                {card.title}
                              </h3>
                              <p className="text-sm text-foreground/90 leading-relaxed">
                                {card.description}
                              </p>
                              <div className="space-y-1.5 text-sm text-muted-foreground leading-relaxed">
                                <p>
                                  <span className="font-semibold text-foreground/80">
                                    Pourquoi c’est important —
                                  </span>{" "}
                                  {card.why}
                                </p>
                                <p>
                                  <span className="font-semibold text-foreground/80">
                                    {card.kind === "force"
                                      ? "Impact dans le futur mariage —"
                                      : "Si on n’y travaille pas —"}
                                  </span>{" "}
                                  {card.impact}
                                </p>
                                <p className="rounded-lg bg-white/80 border border-border/60 px-3 py-2 text-foreground/90">
                                  <span className="font-semibold">
                                    Conseil pratique —
                                  </span>{" "}
                                  {card.tip}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                      {chapter.sections?.length ? (
                        <div className="space-y-3">
                          {chapter.sections.map((s) => (
                            <div
                              key={s.heading}
                              className="rounded-xl border border-border/70 bg-white/70 p-3.5 space-y-1"
                            >
                              <p className="text-sm font-semibold">{s.heading}</p>
                              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                {s.body}
                              </p>
                            </div>
                          ))}
                        </div>
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
                      {chapter.unlockActions?.length ? (
                        <div className="flex flex-col gap-2 pt-1">
                          <p className="text-sm font-medium">
                            Pour enrichir encore votre rapport :
                          </p>
                          {chapter.unlockActions.map((a) => (
                            <Link
                              key={a.href + a.label}
                              href={a.href}
                              className="inline-flex h-10 items-center justify-between rounded-xl border border-[#B8954A]/30 bg-[#B8954A]/10 px-4 text-sm font-semibold text-[#7A5F28]"
                            >
                              {a.label}
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          ))}
                        </div>
                      ) : null}
                      {chapter.tips?.length ? (
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                            Recommandations officielles
                          </p>
                          {chapter.tips.map((t) => (
                            <div
                              key={t.id ?? t.title}
                              className="rounded-xl border border-accent/20 bg-accent/[0.04] p-3 space-y-1"
                            >
                              <p className="text-sm font-semibold">{t.title}</p>
                              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                                {t.advice}
                              </p>
                              {t.why ? (
                                <p className="text-xs italic text-muted-foreground/80">
                                  {t.why}
                                </p>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : !chapter.insightCards?.length &&
                        !chapter.sections?.length &&
                        !chapter.bullets?.length &&
                        chapter.id !== "evolution" ? (
                        <p className="text-xs text-muted-foreground">
                          Analyse ouverte — poursuivez vos tests pour enrichir
                          encore cette partie.
                        </p>
                      ) : null}
                      {chapter.unlockHref && chapter.id !== "portrait" ? (
                        <Link
                          href={chapter.unlockHref}
                          className="inline-flex text-xs font-semibold text-primary underline underline-offset-2"
                        >
                          Revoir / compléter le test lié →
                        </Link>
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
