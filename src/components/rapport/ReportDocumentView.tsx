"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight,
  Crown,
  Lock,
  Sparkles,
} from "lucide-react"
import type { LivingPersonalizedReport } from "@/lib/rapport/personalized/buildLivingReport"
import type { InsightCard } from "@/lib/rapport/personalized/insightCards"
import { cn } from "@/utils/cn"

/**
 * Document Rapport Personnalisé — structure 23-1 / UI Spec 20.
 * Une page web = document complet déroulé (pas d’accordéon).
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

  const byId = (id: string) => living.chapters.find((c) => c.id === id)
  const couverture = byId("couverture")
  const resume = byId("resume")
  const portrait = byId("portrait")
  const forces = byId("forces")
  const vigilances = byId("vigilances")
  const plan = byId("plan")
  const ressources = byId("ressources")
  const evolution = byId("evolution")
  const conclusion = byId("conclusion")

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
      "synthese",
    ].includes(c.id)
  )

  const forceCards = forces?.insightCards?.filter((c) => c.kind === "force") ?? []
  const axeCards =
    vigilances?.insightCards?.filter((c) => c.kind === "vigilance") ?? []
  const recoTips = living.base.lightTips.slice(0, 5)

  return (
    <article className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* ——— PAGE 1 · COUVERTURE ——— */}
      <section className="relative overflow-hidden rounded-[1.75rem] border-2 border-[#B8954A]/45 bg-gradient-to-br from-[#1C1412] via-[#2A1810] to-[#5C1F28] text-[#F8F4EE] p-8 sm:p-12 shadow-elevated min-h-[22rem] flex flex-col justify-between">
        <div
          aria-hidden
          className="alliance-gold-sweep pointer-events-none absolute inset-0 opacity-50"
        />
        <div className="relative z-10 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#F3D9A4]">
            KELIAA · Alliance
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-tight">
            Rapport Personnalisé
          </h1>
          <p className="text-lg text-[#F3D9A4]/90 font-medium">{name}</p>
        </div>
        <div className="relative z-10 grid sm:grid-cols-3 gap-4 mt-10 pt-6 border-t border-white/15">
          <Meta label="Date" value={dateLabel} />
          <Meta
            label="Complétude"
            value={`${living.completenessPercent}%`}
          />
          <Meta
            label="Évaluations"
            value={`${living.testsCompleted}/${living.essentialsTotal}`}
          />
        </div>
        {couverture?.body ? (
          <p className="relative z-10 mt-6 text-sm text-white/70 leading-relaxed max-w-xl whitespace-pre-line">
            {couverture.body}
          </p>
        ) : null}
        <div className="relative z-10 mt-4">
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
      </section>

      {/* ——— PAGE 2 · RÉSUMÉ ——— */}
      <DocPage number={2} title="Résumé personnalisé" teaser="Votre profil en quelques minutes">
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
          {resume?.body ||
            `${name}, votre résumé s’enrichira au fur et à mesure de vos évaluations.`}
        </p>
        {resume?.bullets?.length ? (
          <ul className="mt-4 space-y-2">
            {resume.bullets.map((b) => (
              <li
                key={b}
                className="flex gap-2 text-sm text-muted-foreground leading-relaxed"
              >
                <span className="text-accent font-bold">·</span>
                {b}
              </li>
            ))}
          </ul>
        ) : null}
      </DocPage>

      {/* ——— PAGE 3 · PORTRAIT ——— */}
      <DocPage
        number={3}
        title="Votre portrait relationnel"
        teaser="Qui êtes-vous dans une relation ?"
      >
        {portrait?.unlocked === false ? (
          <LockedBlock
            hint={portrait.unlockHint}
            href={isAlliance ? portrait.unlockHref : "/premium"}
            isAlliance={isAlliance}
          />
        ) : (
          <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
            {portrait?.body}
          </p>
        )}
      </DocPage>

      {/* ——— PAGE 4 · FORCES ——— */}
      <DocPage
        number={4}
        title="Vos principales forces"
        teaser="Ressources à reconnaître et à cultiver"
      >
        {forces?.unlocked === false ? (
          <LockedBlock
            hint={forces.unlockHint}
            href={isAlliance ? forces.unlockHref : "/premium"}
            isAlliance={isAlliance}
          />
        ) : (
          <>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {forces?.body}
            </p>
            {forceCards.length > 0 ? (
              <div className="space-y-4">
                {forceCards.map((card) => (
                  <InsightBlock key={card.id} card={card} />
                ))}
              </div>
            ) : (
              <EmptyHint href="/assessments">
                Complétez au moins un test Matching pour faire apparaître vos
                forces personnalisées.
              </EmptyHint>
            )}
          </>
        )}
      </DocPage>

      {/* ——— PAGE 5 · AXES ——— */}
      <DocPage
        number={5}
        title="Vos axes de progression"
        teaser="Pas des faiblesses — des leviers de croissance"
      >
        {vigilances?.unlocked === false ? (
          <LockedBlock
            hint={vigilances.unlockHint}
            href={isAlliance ? vigilances.unlockHref : "/premium"}
            isAlliance={isAlliance}
          />
        ) : (
          <>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {vigilances?.body}
            </p>
            {axeCards.length > 0 ? (
              <div className="space-y-4">
                {axeCards.map((card) => (
                  <InsightBlock key={card.id} card={card} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucun axe prioritaire marqué pour l’instant — continuez vos
                évaluations pour affiner cette lecture.
              </p>
            )}
          </>
        )}
      </DocPage>

      {/* ——— ANALYSES DÉTAILLÉES ——— */}
      {detailChapters.map((ch) => (
        <DocPage
          key={ch.id}
          number={ch.page}
          title={ch.title}
          teaser={ch.teaser}
          locked={!ch.unlocked}
        >
          {!ch.unlocked ? (
            <LockedBlock
              hint={ch.unlockHint}
              href={isAlliance ? ch.unlockHref : "/premium"}
              isAlliance={isAlliance}
            />
          ) : (
            <div className="space-y-4">
              {ch.sections?.length ? (
                ch.sections.map((s) => (
                  <div key={s.heading} className="space-y-1.5">
                    <h3 className="text-sm font-bold text-foreground">
                      {s.heading}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {s.body}
                    </p>
                  </div>
                ))
              ) : ch.body ? (
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {ch.body}
                </p>
              ) : null}
              {ch.tips?.length ? (
                <div className="space-y-2 pt-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                    Conseils
                  </p>
                  {ch.tips.map((t) => (
                    <div
                      key={t.id ?? t.title}
                      className="rounded-xl border border-accent/20 bg-accent/[0.04] p-3"
                    >
                      <p className="text-sm font-semibold">{t.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {t.advice}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
              {ch.unlockHref ? (
                <Link
                  href={ch.unlockHref}
                  className="inline-flex text-xs font-semibold text-primary underline underline-offset-2"
                >
                  Voir / compléter le test lié →
                </Link>
              ) : null}
            </div>
          )}
        </DocPage>
      ))}

      {/* ——— PLAN ——— */}
      <DocPage
        number={plan?.page ?? 15}
        title="Plan de progression"
        teaser="Transformer les analyses en actions"
      >
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {plan?.body}
        </p>
        {recoTips.length > 0 ? (
          <ol className="space-y-3">
            {recoTips.map((t, i) => (
              <li
                key={t.id ?? t.title}
                className="rounded-xl border border-[#B8954A]/30 bg-[#B8954A]/[0.06] p-4"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                  Priorité {i + 1}
                </p>
                <p className="font-serif text-lg font-bold mt-0.5">{t.title}</p>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {t.advice}
                </p>
                {t.why ? (
                  <p className="text-xs italic text-muted-foreground/80 mt-2">
                    Pourquoi : {t.why}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        ) : (
          <EmptyHint href="/assessments">
            Vos recommandations officielles apparaîtront dès que des axes seront
            identifiés via vos tests.
          </EmptyHint>
        )}
      </DocPage>

      {/* ——— RESSOURCES ——— */}
      <DocPage
        number={ressources?.page ?? 16}
        title="Ressources Alliance"
        teaser="Pour aller plus loin"
      >
        <ul className="space-y-2">
          {(ressources?.bullets ?? []).map((b) => (
            <li key={b} className="text-sm text-foreground/90">
              · {b}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 mt-4">
          <Link
            href="/coffre-premium"
            className="inline-flex h-10 items-center rounded-xl bg-[#B8954A] px-4 text-xs font-bold text-[#1C1412]"
          >
            Coffre Premium
          </Link>
          <Link
            href="/coaching"
            className="inline-flex h-10 items-center rounded-xl border border-border bg-white px-4 text-xs font-semibold"
          >
            Coaching
          </Link>
          <Link
            href="/academie-mariage"
            className="inline-flex h-10 items-center rounded-xl border border-border bg-white px-4 text-xs font-semibold"
          >
            Académie
          </Link>
        </div>
      </DocPage>

      {/* ——— ÉVOLUTION ——— */}
      <DocPage
        number={evolution?.page ?? 17}
        title="Évolution de votre rapport"
        teaser="Votre rapport évolue avec vous"
      >
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {evolution?.body}
        </p>
        {evolution?.unlockActions?.length ? (
          <div className="space-y-2">
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

      {/* ——— CONCLUSION ——— */}
      <DocPage
        number={conclusion?.page ?? 18}
        title="Conclusion"
        teaser="Encouragement et prochaines étapes"
      >
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
          {conclusion?.body}
        </p>
        <div className="mt-6 rounded-xl border border-accent/25 bg-accent/10 p-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            Continuez votre préparation
          </p>
          <Link
            href="/alliance/parcours"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground"
          >
            Mon parcours <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </DocPage>
    </article>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-white/45">{label}</p>
      <p className="font-serif text-lg font-bold text-[#F3D9A4] mt-0.5">{value}</p>
    </div>
  )
}

function DocPage({
  number,
  title,
  teaser,
  locked,
  children,
}: {
  number: number
  title: string
  teaser?: string
  locked?: boolean
  children: React.ReactNode
}) {
  return (
    <section
      className={cn(
        "rounded-[1.5rem] border bg-card p-6 sm:p-8 shadow-sm space-y-4",
        locked
          ? "border-dashed border-border/80 bg-secondary/20"
          : "border-[#B8954A]/25"
      )}
    >
      <header className="space-y-1 border-b border-border/60 pb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
          Page {number}
          {locked ? " · À débloquer" : ""}
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold">{title}</h2>
        {teaser ? (
          <p className="text-sm text-muted-foreground">{teaser}</p>
        ) : null}
      </header>
      {children}
    </section>
  )
}

function InsightBlock({ card }: { card: InsightCard }) {
  const isForce = card.kind === "force"
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 space-y-3",
        isForce
          ? "border-[#B8954A]/40 bg-gradient-to-br from-[#B8954A]/10 via-white to-white"
          : "border-primary/20 bg-primary/[0.03]"
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
        {isForce ? "Force" : "Axe de progression"}
      </p>
      <h3 className="font-serif text-xl font-bold leading-snug">{card.title}</h3>
      <p className="text-sm text-foreground/90 leading-relaxed">
        {card.description}
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        <span className="font-semibold text-foreground/80">
          Pourquoi c’est important —
        </span>{" "}
        {card.why}
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        <span className="font-semibold text-foreground/80">
          {isForce ? "Impact dans le futur mariage —" : "Si on n’y travaille pas —"}
        </span>{" "}
        {card.impact}
      </p>
      <p className="rounded-xl border border-border/70 bg-white px-3 py-2.5 text-sm text-foreground/90 leading-relaxed">
        <span className="font-semibold">Conseil pratique —</span> {card.tip}
      </p>
    </div>
  )
}

function LockedBlock({
  hint,
  href,
  isAlliance,
}: {
  hint?: string
  href?: string
  isAlliance: boolean
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-white/80 p-4 space-y-3">
      <p className="text-sm text-muted-foreground leading-relaxed">
        {hint ||
          "Cette analyse n’est pas encore disponible. Complétez l’évaluation correspondante."}
      </p>
      <p className="text-sm font-medium">
        Pour débloquer vos résultats, cliquez ici :
      </p>
      {href ? (
        <Link
          href={isAlliance ? href : "/premium"}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          {isAlliance ? "Faire le test" : "Débloquer avec Alliance"}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      ) : null}
    </div>
  )
}

function EmptyHint({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-dashed border-border p-4 space-y-2">
      <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
      <Link
        href={href}
        className="inline-flex text-sm font-semibold text-primary underline underline-offset-2"
      >
        Aller aux tests →
      </Link>
    </div>
  )
}
