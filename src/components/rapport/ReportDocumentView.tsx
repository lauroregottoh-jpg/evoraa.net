"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Crown, Download, Lock, Printer, Sparkles } from "lucide-react"
import type { LivingPersonalizedReport } from "@/lib/rapport/personalized/buildLivingReport"
import type { InsightCard } from "@/lib/rapport/personalized/insightCards"
import { cn } from "@/utils/cn"

/**
 * Document Rapport Personnalisé — Alliance uniquement.
 * Structure 32-1 (incomplet) / 33-1 (complet).
 * Parties vides → test rattaché ; reconstruction auto après chaque évaluation.
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

  const forceCards = forces?.insightCards?.filter((c) => c.kind === "force") ?? []
  const axeCards =
    vigilances?.insightCards?.filter((c) => c.kind === "vigilance") ?? []
  const planCards =
    plan?.insightCards?.filter((c) => c.kind === "vigilance") ?? []

  let page = 1

  return (
    <article className="max-w-3xl mx-auto space-y-8 pb-12 print:max-w-none">
      <div className="flex flex-wrap items-center justify-end gap-2 print:hidden">
        <a
          href="/rapport/telecharger"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#B8954A] px-4 text-xs font-bold text-[#1C1412]"
        >
          <Download className="h-3.5 w-3.5" />
          Télécharger le rapport global
        </a>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-white px-4 text-xs font-semibold"
        >
          <Printer className="h-3.5 w-3.5" />
          Imprimer / PDF
        </button>
      </div>

      <section className="relative overflow-hidden rounded-[1.75rem] border-2 border-[#B8954A]/45 bg-gradient-to-br from-[#1C1412] via-[#2A1810] to-[#5C1F28] text-[#F8F4EE] p-8 sm:p-12 shadow-elevated print:border print:shadow-none">
        <div
          aria-hidden
          className="alliance-gold-sweep pointer-events-none absolute inset-0 opacity-50 print:hidden"
        />
        <div className="relative z-10 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#F3D9A4]">
            KELIAA ALLIANCE™
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
            {complete
              ? "Rapport Personnalisé Alliance™"
              : "Rapport Personnalisé"}
          </h1>
          <p className="text-base text-[#F3D9A4]/90">Préparation au Mariage</p>
        </div>

        <div className="relative z-10 mt-8 rounded-2xl border border-white/15 bg-black/20 p-5 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F3D9A4]">
            {living.confidentialLabel}
          </p>
          <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <MetaRow label="Nom" value={name} />
            <MetaRow label="Date de génération" value={dateLabel} />
            <MetaRow label="Version" value={living.versionLabel} />
            <MetaRow
              label="Évaluations réalisées"
              value={`${living.testsCompleted} / ${living.essentialsTotal}`}
            />
            <MetaRow
              label="Complétude du rapport"
              value={`${living.completenessPercent} %`}
            />
            <MetaRow
              label={living.indexLabel}
              value={
                living.globalIndex != null
                  ? `${living.globalIndex} / 100`
                  : "En cours"
              }
            />
          </dl>
        </div>

        <div className="relative z-10 mt-6">
          {isAlliance ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#B8954A]/50 bg-[#B8954A]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#F3D9A4]">
              <Crown className="h-3 w-3" /> {living.base.offerLabel}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
              <Lock className="h-3 w-3" /> Aperçu
            </span>
          )}
        </div>
        <p className="relative z-10 mt-4 text-xs text-white/55 leading-relaxed max-w-xl">
          Ce document se met à jour automatiquement après chaque évaluation
          Alliance. Les parties non remplies renvoient directement au test
          rattaché.
        </p>
      </section>

      <DocPage number={++page} title="Bienvenue dans votre Rapport Personnalisé Alliance™">
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
          {living.welcomeBody}
        </p>
      </DocPage>

      {!complete && living.statusBlock ? (
        <DocPage number={++page} title="Où en êtes-vous aujourd’hui ?">
          <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
            {living.statusBlock.intro}
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2">
                À ce stade, votre rapport comprend
              </p>
              <ul className="space-y-1.5">
                {living.statusBlock.included.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground">
                    · {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2">
                Les évaluations restantes permettront d’approfondir
              </p>
              <ul className="space-y-1.5">
                {living.statusBlock.remaining.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground">
                    · {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DocPage>
      ) : null}

      {complete && living.glance ? (
        <DocPage number={++page} title="Votre portrait en un regard">
          <div className="space-y-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                Niveau de préparation actuel
              </p>
              <p className="font-serif text-2xl tracking-widest text-[#B8954A] mt-2">
                {living.glance.stars}
              </p>
              <p className="font-serif text-3xl font-bold mt-1">
                {living.glance.score} / 100
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3 whitespace-pre-line">
                {living.glance.narrative}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2">
                Vos cinq principales forces
              </p>
              <ul className="space-y-1.5">
                {living.glance.forceLabels.map((f) => (
                  <li key={f} className="text-sm text-foreground/90">
                    ✓ {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2">
                Les trois priorités qui auront le plus d’impact
              </p>
              <ul className="space-y-1.5">
                {living.glance.priorities.map((p) => (
                  <li key={p} className="text-sm text-muted-foreground">
                    • {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DocPage>
      ) : null}

      <DocPage
        number={++page}
        title={resume?.title || (complete ? "Résumé exécutif" : "Résumé personnalisé")}
      >
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
          {resume?.body}
        </p>
      </DocPage>

      <DocPage number={++page} title="Votre portrait relationnel">
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
          {portrait?.body}
        </p>
      </DocPage>

      <DocPage number={++page} title={forces?.title || "Vos principales forces"}>
        {forces?.body ? (
          <p className="text-sm text-muted-foreground leading-relaxed mb-5 whitespace-pre-line">
            {forces.body}
          </p>
        ) : null}
        <div className="space-y-6">
          {forceCards.map((card, i) => (
            <NarrativeBlock key={card.id} index={i + 1} card={card} />
          ))}
        </div>
      </DocPage>

      <DocPage
        number={++page}
        title={vigilances?.title || "Les compétences à développer en priorité"}
      >
        {vigilances?.body ? (
          <p className="text-sm text-muted-foreground leading-relaxed mb-5 whitespace-pre-line">
            {vigilances.body}
          </p>
        ) : null}
        <div className="space-y-6">
          {axeCards.map((card) => (
            <NarrativeBlock key={card.id} card={card} />
          ))}
        </div>
      </DocPage>

      {!complete && living.nextStep ? (
        <DocPage number={++page} title="Votre prochaine étape">
          <p className="text-sm text-foreground/90 leading-relaxed">
            {living.nextStep.completenessNote}
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            La prochaine évaluation que nous vous recommandons est :
          </p>
          <h3 className="font-serif text-2xl font-bold mt-2">
            {living.nextStep.title}
          </h3>
          <ul className="mt-3 space-y-1">
            {living.nextStep.why.map((w) => (
              <li key={w} className="text-sm text-muted-foreground">
                · {w}
              </li>
            ))}
          </ul>
          <Link
            href={living.nextStep.href}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground mt-5 print:hidden"
          >
            Réaliser « {living.nextStep.title} »
            <ArrowRight className="h-4 w-4" />
          </Link>
        </DocPage>
      ) : null}

      <PartDivider
        title={
          complete
            ? "Les grandes dimensions de votre fonctionnement relationnel"
            : "Analyses détaillées"
        }
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
                <div key={s.heading} className="space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground">
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
        <div className="space-y-5">
          {planCards.map((card, i) => (
            <div
              key={card.id}
              className="rounded-2xl border border-[#B8954A]/30 bg-[#B8954A]/[0.06] p-5 space-y-2"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                Priorité n°{i + 1}
              </p>
              <h3 className="font-serif text-xl font-bold">{card.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {card.description}
              </p>
            </div>
          ))}
        </div>
        {plan?.sections?.length ? (
          <div className="mt-6 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
              Plan sur trois mois
            </p>
            {plan.sections.map((s) => (
              <div key={s.heading} className="space-y-1">
                <h3 className="text-sm font-bold">{s.heading}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </DocPage>

      <DocPage number={++page} title="Vous souhaitez aller plus loin ?">
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 whitespace-pre-line">
          {ressources?.body}
        </p>
        <ul className="space-y-2 mb-4">
          {(ressources?.bullets ?? []).map((b) => (
            <li key={b} className="text-sm text-foreground/90">
              · {b}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 print:hidden">
          <Link
            href="/coaching"
            className="inline-flex h-10 items-center rounded-xl bg-[#B8954A] px-4 text-xs font-bold text-[#1C1412]"
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
        <p className="text-sm text-muted-foreground leading-relaxed mb-3 whitespace-pre-line">
          {evolution?.body}
        </p>
        {evolution?.unlockActions?.length ? (
          <div className="space-y-2 print:hidden">
            {evolution.unlockActions.map((a) => (
              <Link
                key={a.href + a.label}
                href={a.href}
                className="flex items-center justify-between rounded-xl border border-[#B8954A]/30 bg-[#B8954A]/10 px-4 py-3 text-sm font-semibold text-[#7A5F28]"
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
          <div className="mt-6 rounded-xl border border-[#B8954A]/30 bg-[#B8954A]/[0.06] p-4 space-y-2">
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
              href="/rapport/telecharger"
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
      <dd className="font-medium text-[#F3D9A4]">{value}</dd>
    </div>
  )
}

function PartDivider({ title }: { title: string }) {
  return (
    <div className="pt-4 pb-1 text-center space-y-1">
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
    <section
      className={cn(
        "rounded-[1.5rem] border bg-card p-6 sm:p-8 shadow-sm space-y-4 print:shadow-none print:break-inside-avoid",
        locked
          ? "border-dashed border-border/80 bg-secondary/20"
          : "border-[#B8954A]/25"
      )}
    >
      <header className="space-y-1 border-b border-border/60 pb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
          Page {number}
          {locked ? " · Analyse en attente" : ""}
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold">{title}</h2>
      </header>
      {children}
    </section>
  )
}

function NarrativeBlock({
  index,
  card,
}: {
  index?: number
  card: InsightCard
}) {
  return (
    <div className="space-y-2 border-b border-border/50 pb-5 last:border-0 last:pb-0">
      <h3 className="font-serif text-xl font-bold leading-snug">
        {index != null ? `${index}. ${card.title}` : card.title}
      </h3>
      <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
        {card.description}
      </p>
    </div>
  )
}

function LockedCta({ hint, href }: { hint?: string; href?: string }) {
  const target = href || "/assessments"
  return (
    <div className="rounded-xl border border-border/70 bg-white/80 p-4 space-y-3 print:hidden">
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
