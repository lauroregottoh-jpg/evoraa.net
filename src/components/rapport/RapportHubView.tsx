"use client"

import Link from "next/link"
import {
  ArrowRight,
  ClipboardList,
  Crown,
  Lock,
  Sparkles,
} from "lucide-react"
import type { LivingPersonalizedReport } from "@/lib/rapport/personalized/buildLivingReport"
import { ScoreRing } from "@/components/rapport/ReportVisuals"
import { cn } from "@/utils/cn"

/** Hub Rapport — aperçu premium + CTAs ; détail sur /rapport/global. */
export function RapportHubView({
  firstName,
  living,
  isAlliance,
}: {
  firstName?: string | null
  living: LivingPersonalizedReport
  isAlliance: boolean
}) {
  const name = firstName?.trim() || "Membre"
  const chapters = living.chapters.filter((c) => c.id !== "couverture")
  const unlockedCount = chapters.filter((c) => c.unlocked).length
  const portrait = living.chapters.find((c) => c.id === "portrait")
  const portraitTestHref =
    portrait?.unlockHref ||
    living.nextUnlock?.href ||
    "/assessments"

  return (
    <article className="space-y-5 max-w-3xl mx-auto">
      <header className="rapport-reveal relative overflow-hidden rounded-[1.75rem] border-2 border-[#B8954A]/45 bg-gradient-to-br from-[#2D1020] via-[#2A1810] to-[#2D1020] p-6 sm:p-8 text-[#F2EBE0] shadow-elevated">
        <div
          aria-hidden
          className="alliance-gold-sweep pointer-events-none absolute inset-0 opacity-40"
        />
        <div
          aria-hidden
          className="rapport-pattern pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
        />

        <div className="relative z-10 flex flex-col sm:flex-row gap-6 sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#D4AF72]">
              KELIAA · Rapport Personnalisé
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              <span className="rapport-gold-text">
                {isAlliance
                  ? `${name}, votre espace Rapport`
                  : `${name}, aperçu de votre rapport`}
              </span>
            </h1>
            <p className="mt-2 text-sm text-white/75 leading-relaxed max-w-xl">
              {living.documentMode === "complete"
                ? "Votre rapport est complet. Relisez-le comme un guide de préparation au mariage."
                : "Votre rapport évolue avec vous. Chaque test enrichit le document — les analyses en attente restent visibles avec la prochaine étape."}
            </p>
          </div>
          <div className="shrink-0 mx-auto sm:mx-0 rounded-2xl bg-white/95 p-3 shadow-lg">
            <ScoreRing
              value={living.completenessPercent}
              label="Complétude"
              size={112}
            />
          </div>
        </div>

        <div className="relative z-10 mt-5 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-white/60">
            <span>Progression du document</span>
            <span className="font-bold text-[#D4AF72]">
              {living.completenessPercent}%
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="rapport-bar-fill h-full rounded-full bg-gradient-to-r from-[#B8954A] to-[#D4AF72]"
              style={{ width: `${Math.min(100, living.completenessPercent)}%` }}
            />
          </div>
        </div>

        <div className="relative z-10 mt-5 flex flex-wrap gap-2">
          {isAlliance ? (
            <span className="rapport-cover-seal inline-flex items-center gap-1 rounded-full border border-[#B8954A]/50 bg-[#B8954A]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#D4AF72]">
              <Crown className="h-3 w-3" /> {living.base.offerLabel}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
              <Lock className="h-3 w-3" /> Aperçu Découverte
            </span>
          )}
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold">
            {unlockedCount}/{chapters.length} parties ouvertes
          </span>
          {living.globalIndex != null ? (
            <span className="rounded-full border border-[#B8954A]/40 bg-[#B8954A]/15 px-3 py-1 text-[10px] font-semibold text-[#D4AF72]">
              Indice {living.globalIndex}/100
            </span>
          ) : null}
        </div>

        <div className="relative z-10 mt-6 flex flex-wrap gap-2">
          <Link
            href="/rapport/global"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#B8954A] px-5 text-sm font-bold text-[#2D1020] hover:brightness-105 transition"
          >
            Découvrir le rapport global
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="/rapport/telecharger?dl=1"
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-[#B8954A]/50 bg-white/10 px-5 text-sm font-bold text-[#D4AF72]"
          >
            Télécharger
          </a>
        </div>
        <p className="relative z-10 mt-3 text-[11px] text-white/55 max-w-xl leading-relaxed">
          Mise à jour automatique après chaque test. Les parties vides ouvrent
          directement l’évaluation rattachée.
        </p>
      </header>

      <section className="rapport-reveal rapport-page-premium rounded-2xl border border-[#B8954A]/35 p-5 sm:p-6 space-y-4 shadow-sm">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
            Portrait relationnel
          </p>
          <h2 className="font-serif text-2xl font-bold">
            Qui êtes-vous dans une relation ?
          </h2>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            Deux chemins : lire votre rapport global, ou finaliser le test qui
            alimente ce portrait.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/rapport/global"
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#B8954A] px-4 text-sm font-bold text-[#2D1020]"
          >
            Découvrir votre rapport complet
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={isAlliance ? portraitTestHref : "/premium"}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 text-sm font-semibold"
          >
            {isAlliance ? "Finaliser le test" : "Débloquer avec Alliance"}
          </Link>
        </div>
      </section>

      {living.nextUnlock ? (
        <div className="rapport-reveal rounded-2xl border border-[#B8954A]/35 bg-gradient-to-r from-[#B8954A]/15 via-white to-primary/[0.04] px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm">
            <Sparkles className="inline h-4 w-4 text-accent mr-1.5" />
            Prochaine clé : <strong>{living.nextUnlock.title}</strong> → «{" "}
            {living.nextUnlock.chapterTitle} »
          </p>
          <Link
            href={living.nextUnlock.href}
            className="inline-flex h-9 items-center gap-1 rounded-xl bg-[#B8954A] px-3 text-xs font-bold text-[#2D1020]"
          >
            Faire le test <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : null}

      <section className="space-y-2.5">
        <h2 className="font-serif text-xl font-bold px-1">Parties du rapport</h2>
        {chapters.map((chapter, i) => (
          <div
            key={chapter.id}
            className={cn(
              "rapport-reveal rounded-2xl border p-4 sm:p-5",
              chapter.unlocked
                ? "rapport-page-premium border-[#B8954A]/30"
                : "border-dashed border-border/80 bg-secondary/25"
            )}
            style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
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
                <h3 className="font-serif text-lg font-bold">{chapter.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {chapter.teaser}
                </p>
              </div>
              {chapter.unlocked ? (
                <ClipboardList className="h-4 w-4 text-accent shrink-0 mt-1" />
              ) : (
                <Lock className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
              )}
            </div>

            {chapter.unlocked ? (
              <Link
                href="/rapport/global"
                className="mt-3 inline-flex text-sm font-semibold text-accent underline underline-offset-2"
              >
                Voir le détail dans le rapport complet →
              </Link>
            ) : (
              <div className="mt-3 rounded-xl border border-border/70 bg-white/80 p-3 space-y-2">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {chapter.unlockHint ||
                    "Cette partie n’est pas encore terminée."}
                </p>
                <p className="text-sm font-medium">
                  Pour débloquer vos résultats, cliquez ici :
                </p>
                <Link
                  href={
                    isAlliance
                      ? chapter.unlockHref || "/assessments"
                      : "/premium"
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
                >
                  {isAlliance
                    ? "Faire le test correspondant"
                    : "Débloquer avec Alliance"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        ))}
      </section>

      {!isAlliance && living.base.ctaUpgrade ? (
        <Link
          href={living.base.ctaUpgrade.href}
          className="flex items-center justify-center h-12 rounded-xl bg-primary text-primary-foreground text-sm font-bold"
        >
          {living.base.ctaUpgrade.label}
        </Link>
      ) : null}
    </article>
  )
}
