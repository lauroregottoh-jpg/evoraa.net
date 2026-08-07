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
}: {
  cards: AssessmentCardView[]
  showComplementary?: boolean
}) {
  const essentials = cards.filter((c) => c.tier === "essential")
  const complementary = cards.filter((c) => c.tier === "complementary")
  const premiumPlus = cards.filter((c) => c.tier === "premium_plus")

  return (
    <div className="space-y-8">
      <Section
        eyebrow="Essentielles"
        title="Les 10 clés de votre Rapport Personnalisé"
        cards={essentials}
      />
      {showComplementary ? (
        <Section
          eyebrow="Complémentaires"
          title="Enrichissez progressivement votre lecture"
          cards={complementary}
        />
      ) : null}
      <Section
        eyebrow="Premium+"
        title="Analyses approfondies"
        cards={premiumPlus}
      />
    </div>
  )
}

function Section({
  eyebrow,
  title,
  cards,
}: {
  eyebrow: string
  title: string
  cards: AssessmentCardView[]
}) {
  if (!cards.length) return null
  return (
    <section className="space-y-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
          {eyebrow}
        </p>
        <h2 className="font-serif text-2xl font-bold">{title}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card, i) => (
          <Card key={card.id} card={card} index={i} />
        ))}
      </div>
    </section>
  )
}

function Card({ card, index }: { card: AssessmentCardView; index: number }) {
  const locked =
    card.state === "locked" || card.state === "premium_plus" || !card.href
  const done = card.state === "done"

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[1.35rem] border p-5 sm:p-6 transition-all duration-500",
        done
          ? "border-emerald-500/30 bg-emerald-500/[0.06]"
          : locked
            ? "border-border/80 bg-secondary/40"
            : "border-border/70 bg-gradient-to-br from-white via-white to-accent/[0.06] hover:-translate-y-1",
        "assessment-pillar-card"
      )}
      style={{ animationDelay: `${index * 55}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary/80">
            {card.tier === "essential"
              ? `Éval. ${String(card.order).padStart(2, "0")}`
              : card.tier === "premium_plus"
                ? "Premium+"
                : "Complémentaire"}
          </p>
          <h3 className="font-serif text-xl font-bold leading-tight mt-0.5">
            {card.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            {card.subtitle}
          </p>
        </div>
        {done ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
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
          <Link
            href="/rapport"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-emerald-600/30 bg-emerald-600/10 px-4 text-sm font-semibold text-emerald-800"
          >
            Voir mon analyse
          </Link>
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
            {card.href ? "Bientôt" : "Débloquer Alliance"}
          </Link>
        )}
      </div>
    </article>
  )
}
