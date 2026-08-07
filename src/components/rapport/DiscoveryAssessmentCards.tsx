"use client"

import Link from "next/link"
import {
  CheckCircle2,
  Clock,
  Crown,
  Lock,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/utils/cn"
import type { AssessmentCardView } from "@/lib/rapport/personalized/buildLivingReport"

/** Cartes de découverte — RAPPORT PERSONNALISE/22_DISCOVERY_EXPERIENCE.md */
export function DiscoveryAssessmentCards({
  cards,
  showComplementary = true,
  isAlliance = false,
}: {
  cards: AssessmentCardView[]
  showComplementary?: boolean
  isAlliance?: boolean
}) {
  const essentials = cards.filter((c) => c.tier === "essential")
  const complementary = cards.filter((c) => c.tier === "complementary")
  const premiumPlus = cards.filter((c) => c.tier === "premium_plus")

  return (
    <div className="space-y-8">
      <Section
        eyebrow="Essentielles · Rapport"
        title="Les 10 clés de votre Rapport Personnalisé"
        subtitle="Chaque clé ouvre un chapitre. Les tests Matching déjà faits alimentent plusieurs clés."
        cards={essentials}
        isAlliance={isAlliance}
      />
      {showComplementary ? (
        <Section
          eyebrow="Complémentaires"
          title="Enrichissez progressivement votre lecture"
          subtitle={
            isAlliance
              ? "Visibles Alliance — questionnaires dédiés bientôt. En attendant, continuez le Matching."
              : "Visibles mais verrouillées en Découverte — s’ouvrent avec Alliance."
          }
          cards={complementary}
          isAlliance={isAlliance}
        />
      ) : null}
      <Section
        eyebrow="Premium+"
        title="Analyses approfondies"
        subtitle="Réservées aux offres supérieures — déjà visibles pour vous motiver."
        cards={premiumPlus}
        isAlliance={isAlliance}
      />
    </div>
  )
}

function Section({
  eyebrow,
  title,
  subtitle,
  cards,
  isAlliance,
}: {
  eyebrow: string
  title: string
  subtitle?: string
  cards: AssessmentCardView[]
  isAlliance: boolean
}) {
  if (!cards.length) return null
  return (
    <section className="space-y-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
          {eyebrow}
        </p>
        <h2 className="font-serif text-2xl font-bold">{title}</h2>
        {subtitle ? (
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            {subtitle}
          </p>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card, i) => (
          <Card key={card.id} card={card} index={i} isAlliance={isAlliance} />
        ))}
      </div>
    </section>
  )
}

function Card({
  card,
  index,
  isAlliance,
}: {
  card: AssessmentCardView
  index: number
  isAlliance: boolean
}) {
  const locked =
    card.state === "locked" || card.state === "premium_plus" || !card.href
  const done = card.state === "done"
  const gold = isAlliance && (done || (!locked && card.tier === "essential"))

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[1.35rem] border p-5 sm:p-6 transition-all duration-500",
        done
          ? "border-[#B8954A]/40 bg-gradient-to-br from-[#B8954A]/10 via-white to-white"
          : locked
            ? "border-border/80 bg-secondary/40"
            : gold
              ? "border-[#B8954A]/30 bg-gradient-to-br from-white via-white to-[#B8954A]/[0.08] hover:-translate-y-1"
              : "border-border/70 bg-gradient-to-br from-white via-white to-accent/[0.06] hover:-translate-y-1",
        "assessment-pillar-card"
      )}
      style={{ animationDelay: `${index * 55}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={cn(
              "text-[10px] font-bold uppercase tracking-[0.16em]",
              gold || done ? "text-accent" : "text-primary/80"
            )}
          >
            {card.tier === "essential"
              ? `Éval. ${String(card.order).padStart(2, "0")}`
              : card.tier === "premium_plus"
                ? "Premium+"
                : "Complémentaire"}
            {done ? " · Terminé" : locked ? " · Verrouillé" : ""}
          </p>
          <h3 className="font-serif text-xl font-bold leading-tight mt-0.5">
            {card.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            {card.subtitle}
          </p>
        </div>
        {done ? (
          <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
        ) : card.state === "premium_plus" ? (
          <Crown className="h-5 w-5 text-accent shrink-0" />
        ) : locked ? (
          <Lock className="h-5 w-5 text-muted-foreground shrink-0" />
        ) : (
          <Sparkles className="h-5 w-5 text-accent shrink-0" />
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {card.benefits.slice(0, 3).map((b) => (
          <span
            key={b}
            className="rounded-full border border-border/70 bg-white/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
          >
            {b}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          ~{card.durationMin} min
          {done && card.score != null ? ` · ${card.score}%` : ""}
        </p>
        {done && card.href ? (
          <div className="flex items-center gap-2">
            <Link
              href={card.href}
              className="inline-flex h-10 items-center rounded-xl border border-border bg-white px-3 text-xs font-semibold"
            >
              Revoir
            </Link>
            <Link
              href="/rapport"
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#B8954A]/40 bg-[#B8954A]/15 px-3 text-xs font-bold text-[#7A5F28]"
            >
              Voir analyse
            </Link>
          </div>
        ) : card.href && !locked ? (
          <Link
            href={card.href}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground group-hover:gap-2.5 transition-all"
          >
            Commencer <ArrowRight className="h-4 w-4" />
          </Link>
        ) : card.state === "premium_plus" ? (
          <span className="inline-flex h-10 items-center rounded-xl border border-accent/30 bg-accent/10 px-4 text-sm font-semibold text-accent">
            Premium+
          </span>
        ) : (
          <Link
            href="/premium"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border bg-white/80 px-4 text-sm font-semibold text-muted-foreground"
          >
            <Lock className="h-3.5 w-3.5" />
            {isAlliance ? "Bientôt" : "Débloquer Alliance"}
          </Link>
        )}
      </div>
    </article>
  )
}
