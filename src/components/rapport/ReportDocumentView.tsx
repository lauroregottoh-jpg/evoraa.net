"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight,
  Crown,
  Download,
  Lock,
  Printer,
  Sparkles,
} from "lucide-react"
import type { LivingPersonalizedReport } from "@/lib/rapport/personalized/buildLivingReport"
import type { InsightCard } from "@/lib/rapport/personalized/insightCards"
import {
  ChapterProgressDots,
  ForceBars,
  MonthTimeline,
  OrnamentFrame,
  PrepStars,
  ScoreRing,
} from "@/components/rapport/ReportVisuals"
import { cn } from "@/utils/cn"

/**
 * Document Rapport Personnalisé — Alliance premium.
 * Cadres, anneaux, barres, timeline et animations d’entrée.
 */
export function ReportDocumentView({
  firstName,
  living,
  isAlliance,
}: {
  firstName?: string | null
  living: LivingPersonalizedReport
  isAlliance: boolean
}) {
  const name = firstName?.trim() || "Membre"
  const dateLabel = new Date(living.generatedAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const complete = living.documentMode === "complete"

  const byId = (id: string) => living.chapters.find((c) => c.id === id)
  const resume = byId("resume")
  const portrait = byId("portrait")
  const forces = byId("forces")
  const vigilances = byId("vigilances")
  const plan = byId("plan")
  const ressources = byId("ressources")
  const evolution = byId("evolution")
  const conclusion = byId("conclusion")
  const synthese = byId("synthese")

  const detailChapters = living.chapters.filter((c) =>
    [
      "communication",
      "conflits",
      "intelligence_emotionnelle",
      "valeurs",
      "vision_mariage",
      "projet_de_vie",
      "finances",
      "spiritualite",
    ].includes(c.id)
  )

  const forceCards =
    forces?.insightCards?.filter((c) => c.kind === "force") ?? []
  const axeCards =
    vigilances?.insightCards?.filter((c) => c.kind === "vigilance") ?? []
  const planCards =
    plan?.insightCards?.filter((c) => c.kind === "vigilance") ?? []

  let page = 1

  return (
    <article className="max-w-3xl mx-auto space-y-8 pb-12 print:max-w-none">
      <div className="flex flex-wrap items-center justify-end gap-2 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#B8954A] px-4 text-xs font-bold text-[#A07070] shadow-sm hover:brightness-105 transition"
        >
          <Printer className="h-3.5 w-3.5" />
          Imprimer
        </button>
        <a
          href="/rapport/telecharger?dl=1"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#B8954A]/45 bg-white px-4 text-xs font-bold text-[#7A5F28] hover:bg-[#B8954A]/5 transition"
        >
          <Download className="h-3.5 w-3.5" />
          Télécharger
        </a>
      </div>

      {/* ——— COUVERTURE PREMIUM ——— */}
      <OrnamentFrame>
        <section className="rapport-reveal relative overflow-hidden rounded-[1.75rem] border-2 border-[#B8954A]/55 bg-gradient-to-br from-[#A07070] via-[#2A1810] to-[#A07070] text-[#F2EBE0] p-8 sm:p-12 shadow-elevated print:border print:shadow-none">
          <div
            aria-hidden
            className="alliance-gold-sweep pointer-events-none absolute inset-0 opacity-50 print:hidden"
          />
          <div
            aria-hidden
            className="rapport-pattern pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
          />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
            <div className="space-y-3 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#D4AF72]">
                KELIAA ALLIANCE™
              </p>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
                <span className="rapport-gold-text">
                  {complete
                    ? "Rapport Personnalisé Alliance™"
                    : "Rapport Personnalisé"}
                </span>
              </h1>
              <p className="text-base text-[#D4AF72]/90">
                Préparation au Mariage
              </p>
              <div className="pt-1">
                {isAlliance ? (
                  <span className="rapport-cover-seal inline-flex items-center gap-1.5 rounded-full border border-[#B8954A]/50 bg-[#B8954A]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#D4AF72]">
                    <Crown className="h-3 w-3" /> {living.base.offerLabel}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                    <Lock className="h-3 w-3" /> Aperçu
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-4 sm:gap-5 shrink-0 justify-center sm:justify-end">
              <div className="rounded-2xl bg-white/95 p-3 shadow-lg">
                <ScoreRing
                  value={living.completenessPercent}
                  label="Complétude"
                  size={118}
                  delayMs={80}
                />
              </div>
              {living.globalIndex != null ? (
                <div className="rounded-2xl bg-white/95 p-3 shadow-lg">
                  <ScoreRing
                    value={living.globalIndex}
                    label={complete ? "Préparation" : "Indice"}
                    size={118}
                    delayMs={180}
                  />
                </div>
              ) : null}
            </div>
          </div>

          <div className="relative z-10 mt-8 rounded-2xl border border-white/15 bg-black/25 backdrop-blur-sm p-5 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#D4AF72]">
              {living.confidentialLabel}
            </p>
            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
              <MetaRow label="Nom" value={name} />
              <MetaRow label="Date de génération" value={dateLabel} />
              <MetaRow label="Version" value={living.versionLabel} />
              <MetaRow
                label="Évaluations réalisées"
                value={`${living.testsCompleted} / ${living.essentialsTotal}`}
              />
            </dl>
            <div className="pt-2">
              <div className="flex justify-between text-[10px] text-white/50 mb-1.5">
                <span>Progression du document</span>
                <span className="text-[#D4AF72] font-bold">
                  {living.completenessPercent}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="rapport-bar-fill h-full rounded-full bg-gradient-to-r from-[#8A6A2E] via-[#B8954A] to-[#D4AF72]"
                  style={{ width: `${living.completenessPercent}%` }}
                />
              </div>
            </div>
          </div>

          <p className="relative z-10 mt-4 text-xs text-white/55 leading-relaxed max-w-xl">
            Ce document se met à jour automatiquement après chaque évaluation
            Alliance. Les parties non remplies renvoient directement au test
            rattaché.
          </p>
        </section>
      </OrnamentFrame>

      <DocPage
        number={++page}
        title="Bienvenue dans votre Rapport Personnalisé Alliance™"
      >
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
          {living.welcomeBody}
        </p>
      </DocPage>

      {!complete && living.statusBlock ? (
        <DocPage number={++page} title="Où en êtes-vous aujourd’hui ?">
          <div className="grid sm:grid-cols-[140px_1fr] gap-6 items-start mb-5">
            <div className="mx-auto sm:mx-0 rounded-2xl border border-[#B8954A]/25 bg-white p-2 shadow-sm">
              <ScoreRing
                value={living.completenessPercent}
                label="En cours"
                size={120}
              />
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
              {living.statusBlock.intro}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <VisualPanel title="Déjà dans votre rapport">
              <ul className="space-y-2">
                {living.statusBlock.included.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm text-foreground/85"
                  >
                    <span className="text-[#B8954A] font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </VisualPanel>
            <VisualPanel title="À approfondir" tone="muted">
              <ul className="space-y-2">
                {living.statusBlock.remaining.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm text-muted-foreground"
                  >
                    <span className="text-[#B8954A]/60">○</span>
                    {item}
                  </li>
                ))}
              </ul>
            </VisualPanel>
          </div>
        </DocPage>
      ) : null}

      {complete && living.glance ? (
        <DocPage number={++page} title="Votre portrait en un regard">
          <div className="grid sm:grid-cols-[1fr_160px] gap-6 items-start">
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                Niveau de préparation actuel
              </p>
              <PrepStars score={living.glance.score} />
              <p className="font-serif text-4xl font-bold text-[#A07070]">
                {living.glance.score}{" "}
                <span className="text-lg text-[#B8954A]">/ 100</span>
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {living.glance.narrative}
              </p>
            </div>
            <div className="mx-auto rounded-2xl border border-[#B8954A]/30 bg-white p-3 shadow-sm">
              <ScoreRing
                value={living.glance.score}
                label="Préparation"
                size={130}
              />
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <VisualPanel title="Vos cinq principales forces">
              <ForceBars
                items={living.glance.forceLabels.map((label, i) => ({
                  label,
                  value: forceCards[i]?.score,
                }))}
              />
            </VisualPanel>
            <VisualPanel title="Priorités à impact" tone="accent">
              <ul className="space-y-3">
                {living.glance.priorities.map((p, i) => (
                  <li
                    key={p}
                    className="rapport-reveal flex gap-3 items-start"
                    style={{ animationDelay: `${i * 90}ms` }}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#B8954A]/15 text-xs font-bold text-[#7A5F28] border border-[#B8954A]/30">
                      {i + 1}
                    </span>
                    <span className="text-sm text-foreground/90 pt-1">{p}</span>
                  </li>
                ))}
              </ul>
            </VisualPanel>
          </div>
        </DocPage>
      ) : null}

      <DocPage
        number={++page}
        title={
          resume?.title ||
          (complete ? "Résumé exécutif" : "Résumé personnalisé")
        }
      >
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
          {resume?.body}
        </p>
      </DocPage>

      <DocPage number={++page} title="Votre portrait relationnel">
        <div className="rounded-2xl border border-[#B8954A]/20 bg-[#B8954A]/[0.04] p-5 sm:p-6">
          <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
            {portrait?.body}
          </p>
        </div>
      </DocPage>

      <DocPage number={++page} title={forces?.title || "Vos principales forces"}>
        {forces?.body ? (
          <p className="text-sm text-muted-foreground leading-relaxed mb-5 whitespace-pre-line">
            {forces.body}
          </p>
        ) : null}
        {forceCards.length > 0 ? (
          <div className="mb-6 rounded-2xl border border-[#B8954A]/25 bg-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-3">
              Lecture graphique
            </p>
            <ForceBars
              items={forceCards.map((c) => ({
                label: c.why || c.title,
                value: c.score,
              }))}
            />
          </div>
        ) : null}
        <div className="space-y-4">
          {forceCards.map((card, i) => (
            <NarrativeBlock key={card.id} index={i + 1} card={card} kind="force" />
          ))}
        </div>
      </DocPage>

      <DocPage
        number={++page}
        title={
          vigilances?.title || "Les compétences à développer en priorité"
        }
      >
        {vigilances?.body ? (
          <p className="text-sm text-muted-foreground leading-relaxed mb-5 whitespace-pre-line">
            {vigilances.body}
          </p>
        ) : null}
        <div className="space-y-4">
          {axeCards.map((card, i) => (
            <NarrativeBlock key={card.id} index={i + 1} card={card} kind="axe" />
          ))}
        </div>
      </DocPage>

      {!complete && living.nextStep ? (
        <DocPage number={++page} title="Votre prochaine étape">
          <div className="rounded-2xl border-2 border-[#B8954A]/40 bg-gradient-to-br from-[#B8954A]/15 via-white to-[#F2EBE0] p-6 space-y-4">
            <p className="text-sm text-foreground/90 leading-relaxed">
              {living.nextStep.completenessNote}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
              Évaluation recommandée
            </p>
            <h3 className="font-serif text-3xl font-bold text-[#A07070]">
              {living.nextStep.title}
            </h3>
            <ul className="grid sm:grid-cols-2 gap-2">
              {living.nextStep.why.map((w) => (
                <li
                  key={w}
                  className="rounded-xl border border-[#B8954A]/20 bg-white/80 px-3 py-2 text-sm text-muted-foreground"
                >
                  · {w}
                </li>
              ))}
            </ul>
            <Link
              href={living.nextStep.href}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground print:hidden"
            >
              Réaliser « {living.nextStep.title} »
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </DocPage>
      ) : null}

      <PartDivider
        title={
          complete
            ? "Les grandes dimensions de votre fonctionnement relationnel"
            : "Analyses détaillées"
        }
      />

      <ChapterProgressDots
        items={detailChapters.map((c) => ({
          id: c.id,
          title: c.title,
          unlocked: c.unlocked,
        }))}
      />

      {detailChapters.map((ch) => (
        <DocPage
          key={ch.id}
          number={++page}
          title={ch.title}
          locked={!ch.unlocked}
        >
          {!ch.unlocked ? (
            <div className="space-y-4">
              {ch.sections?.map((s) => (
                <div key={s.heading} className="space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground">
                    {s.heading}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {s.body}
                  </p>
                </div>
              ))}
              {ch.durationHint ? (
                <p className="text-xs font-semibold text-accent">
                  {ch.durationHint}
                </p>
              ) : null}
              <LockedCta hint={ch.unlockHint} href={ch.unlockHref} />
            </div>
          ) : (
            <div className="space-y-4">
              {ch.sections?.map((s) => (
                <div
                  key={s.heading}
                  className="rounded-xl border border-[#B8954A]/15 bg-white/70 p-4 space-y-1.5"
                >
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#B8954A]" />
                    {s.heading}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          )}
        </DocPage>
      ))}

      {synthese?.body ? (
        <DocPage number={++page} title={synthese.title}>
          <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
            {synthese.body}
          </p>
        </DocPage>
      ) : null}

      <PartDivider
        title={
          complete
            ? "Votre plan de croissance personnalisé"
            : "Plan d’action, progression et conclusion"
        }
      />

      <DocPage number={++page} title={plan?.title || "Feuille de route"}>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5 whitespace-pre-line">
          {plan?.body}
        </p>
        <div className="space-y-4">
          {planCards.map((card, i) => (
            <div
              key={card.id}
              className="rapport-reveal relative overflow-hidden rounded-2xl border border-[#B8954A]/35 bg-gradient-to-br from-[#B8954A]/12 via-white to-white p-5 space-y-2"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute -right-2 -top-2 font-serif text-6xl font-bold text-[#B8954A]/10 select-none">
                {i + 1}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent relative">
                Priorité n°{i + 1}
              </p>
              <h3 className="font-serif text-xl font-bold relative">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line relative">
                {card.description}
              </p>
            </div>
          ))}
        </div>
        {plan?.sections?.length ? (
          <div className="mt-8 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
              Plan sur trois mois
            </p>
            <MonthTimeline months={plan.sections} />
          </div>
        ) : null}
      </DocPage>

      <DocPage number={++page} title="Vous souhaitez aller plus loin ?">
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 whitespace-pre-line">
          {ressources?.body}
        </p>
        <ul className="grid sm:grid-cols-2 gap-2 mb-4">
          {(ressources?.bullets ?? []).map((b) => (
            <li
              key={b}
              className="rounded-xl border border-[#B8954A]/20 bg-[#B8954A]/[0.05] px-3 py-2.5 text-sm text-foreground/90"
            >
              · {b}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 print:hidden">
          <Link
            href="/coaching"
            className="inline-flex h-10 items-center rounded-xl bg-[#B8954A] px-4 text-xs font-bold text-[#A07070]"
          >
            Réserver une séance de coaching
          </Link>
          <Link
            href="/coffre-premium"
            className="inline-flex h-10 items-center rounded-xl border border-border bg-white px-4 text-xs font-semibold"
          >
            Coffre Premium
          </Link>
        </div>
      </DocPage>

      <DocPage number={++page} title={evolution?.title || "Progression"}>
        <div className="mb-4 flex justify-center sm:justify-start">
          <div className="rounded-2xl border border-[#B8954A]/25 bg-white p-3 shadow-sm">
            <ScoreRing
              value={living.completenessPercent}
              label="Progression Alliance"
              size={124}
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3 whitespace-pre-line">
          {evolution?.body}
        </p>
        {evolution?.unlockActions?.length ? (
          <div className="space-y-2 print:hidden">
            {evolution.unlockActions.map((a) => (
              <Link
                key={a.href + a.label}
                href={a.href}
                className="flex items-center justify-between rounded-xl border border-[#B8954A]/30 bg-[#B8954A]/10 px-4 py-3 text-sm font-semibold text-[#7A5F28] hover:bg-[#B8954A]/18 transition"
              >
                {a.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        ) : null}
      </DocPage>

      <DocPage number={++page} title={conclusion?.title || "Conclusion"}>
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
          {conclusion?.body}
        </p>
        {conclusion?.bullets?.length ? (
          <div className="mt-6 rounded-2xl border border-[#B8954A]/35 bg-gradient-to-br from-[#B8954A]/10 to-white p-5 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
              Résumé de votre progression
            </p>
            {conclusion.bullets.map((b) => (
              <p key={b} className="text-sm text-foreground/90">
                · {b}
              </p>
            ))}
          </div>
        ) : null}
        <p className="mt-6 text-xs italic text-muted-foreground">
          L’équipe KELIAA Alliance — « Mieux se connaître aujourd’hui pour
          construire une relation durable demain. »
        </p>
        <div className="mt-6 rounded-xl border border-accent/25 bg-accent/10 p-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <p className="text-sm font-medium inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            Continuez votre préparation
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="/rapport/telecharger?dl=1"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#B8954A]/40 bg-white px-4 text-xs font-bold"
            >
              <Download className="h-3.5 w-3.5" /> Télécharger
            </a>
            <Link
              href="/alliance/parcours"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground"
            >
              Mon parcours <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </DocPage>
    </article>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-[10px] uppercase tracking-wider text-white/45">
        {label}
      </dt>
      <dd className="font-medium text-[#D4AF72]">{value}</dd>
    </div>
  )
}

function VisualPanel({
  title,
  children,
  tone = "default",
}: {
  title: string
  children: React.ReactNode
  tone?: "default" | "muted" | "accent"
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4 space-y-3",
        tone === "accent"
          ? "border-[#B8954A]/35 bg-gradient-to-br from-[#B8954A]/10 to-white"
          : tone === "muted"
            ? "border-border/70 bg-secondary/30"
            : "border-[#B8954A]/25 bg-white"
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
        {title}
      </p>
      {children}
    </div>
  )
}

function PartDivider({ title }: { title: string }) {
  return (
    <div className="rapport-reveal pt-6 pb-2 text-center space-y-3">
      <div className="flex items-center justify-center gap-3">
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#B8954A]" />
        <span className="h-2 w-2 rotate-45 border border-[#B8954A] bg-[#D4AF72]/40" />
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#B8954A]" />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
        KELIAA Alliance™
      </p>
      <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
        {title}
      </h2>
    </div>
  )
}

function DocPage({
  number,
  title,
  locked,
  children,
}: {
  number: number
  title: string
  locked?: boolean
  children: React.ReactNode
}) {
  return (
    <OrnamentFrame>
      <section
        className={cn(
          "rapport-reveal rapport-page-premium rounded-[1.5rem] border p-6 sm:p-8 space-y-4 print:shadow-none print:break-inside-avoid",
          locked
            ? "locked border-dashed border-border/80"
            : "border-[#B8954A]/35"
        )}
      >
        <header className="space-y-1 border-b border-[#B8954A]/20 pb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-[#B8954A]/15 px-1.5 text-[10px] font-bold text-[#7A5F28]">
              {number}
            </span>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              Page {number}
              {locked ? " · Analyse en attente" : ""}
            </p>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">{title}</h2>
        </header>
        {children}
      </section>
    </OrnamentFrame>
  )
}

function NarrativeBlock({
  index,
  card,
  kind,
}: {
  index?: number
  card: InsightCard
  kind: "force" | "axe"
}) {
  return (
    <div
      className={cn(
        "rapport-reveal rounded-2xl border p-5 space-y-2",
        kind === "force"
          ? "border-[#B8954A]/35 bg-gradient-to-br from-[#B8954A]/10 via-white to-white"
          : "border-primary/15 bg-primary/[0.03]"
      )}
    >
      <div className="flex items-start gap-3">
        {index != null ? (
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
              kind === "force"
                ? "bg-[#B8954A] text-[#A07070]"
                : "bg-primary/15 text-primary"
            )}
          >
            {index}
          </span>
        ) : null}
        <div className="min-w-0 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
            {kind === "force" ? "Force" : "Axe de progression"}
          </p>
          <h3 className="font-serif text-xl font-bold leading-snug">
            {card.title}
          </h3>
          <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
            {card.description}
          </p>
        </div>
      </div>
    </div>
  )
}

function LockedCta({ hint, href }: { hint?: string; href?: string }) {
  const target = href || "/assessments"
  return (
    <div className="rounded-xl border border-dashed border-[#B8954A]/40 bg-white/80 p-4 space-y-3 print:hidden">
      <p className="text-sm font-medium text-foreground/90">
        {hint ||
          "Cette analyse n’est pas encore disponible. Réalisez l’évaluation rattachée pour l’enrichir automatiquement."}
      </p>
      <p className="text-xs text-muted-foreground">
        Dès la validation du test, cette partie se remplit toute seule — sans
        intervention manuelle.
      </p>
      <Link
        href={target}
        className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
      >
        Aller au test rattaché
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}
