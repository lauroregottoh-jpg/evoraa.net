"use client"

import * as React from "react"
import Link from "next/link"
import {
  ClipboardList,
  Crown,
  Heart,
  Headphones,
  Library,
  MessageCircle,
  Sparkles,
  Target,
  Zap,
} from "lucide-react"
import { cn } from "@/utils/cn"
import {
  COFFRE_INITIAL_UNLOCKS,
  COFFRE_UNLOCKS_PER_MONTH,
} from "@/lib/coffre/unlock"

type BenefitCard = {
  id: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  summary: string
  details: string[]
  tone: string
  soft: string
  ink: string
  badge?: string
  href?: string
  cta?: string
}

const CARDS: BenefitCard[] = [
  {
    id: "bilan",
    icon: ClipboardList,
    title: "Rapport Personnalisé Alliance™",
    summary:
      "Un rapport vivant (~18 pages) : portrait, forces, vigilances, chapitres qui se débloquent à chaque test.",
    details: [
      "Structure officielle : couverture → portrait → compétences → plan → évolution",
      "10 évaluations essentielles + analyses Premium+ à venir",
      "Sections verrouillées visibles — chaque test ouvre une nouvelle analyse",
      "Recommandations concrètes + liens Académie / Coffre / Eva",
    ],
    tone: "#5C1F28",
    soft: "rgba(92, 31, 40, 0.08)",
    ink: "#5C1F28",
    href: "/rapport/global",
    cta: "Voir mon rapport",
  },
  {
    id: "coffre",
    icon: Library,
    title: "Coffre Premium",
    summary:
      "Une bibliothèque privée de guides, journaux et exercices — inclus dans Alliance.",
    details: [
      `${COFFRE_INITIAL_UNLOCKS} ressources au choix dès l’activation`,
      `Puis +${COFFRE_UNLOCKS_PER_MONTH} chaque mois tant que l’abonnement est actif`,
      "PDF exclusifs pour préparer votre mariage avec sérieux",
      "Vous choisissez ce que vous débloquez, à votre rythme",
    ],
    tone: "#B8954A",
    soft: "rgba(184, 149, 74, 0.12)",
    ink: "#7A5F28",
    badge: "Inclus Alliance",
    href: "/coffre-premium",
    cta: "Voir le Coffre Premium",
  },
  {
    id: "matching",
    icon: Heart,
    title: "Matching enrichi",
    summary:
      "Plus d’espace pour rencontrer les bons profils — sans vous disperser.",
    details: [
      "15 suggestions de compatibilité / jour (vs 3)",
      "25 nouvelles conversations sérieuses / mois (vs 5)",
      "100 messages par conversation (vs 5)",
      "Score plus détaillé pour décider avec lucidité",
    ],
    tone: "#7A4050",
    soft: "rgba(122, 64, 80, 0.1)",
    ink: "#7A4050",
  },
  {
    id: "eva",
    icon: Sparkles,
    title: "Eva, votre coach KELIAA",
    summary:
      "Clarifier un doute, préparer une conversation, discerner — sans attendre le prochain coaching.",
    details: [
      "20 questions / jour (vs 3 en Découverte)",
      "Réponses ancrées dans la vision KELIAA du mariage",
      "Objectif : vous aider à penser juste avant d’agir",
      "Utile au quotidien entre deux rencontres ou séances",
    ],
    tone: "#4A3F2A",
    soft: "rgba(74, 63, 42, 0.1)",
    ink: "#4A3F2A",
  },
  {
    id: "badge",
    icon: Crown,
    title: "Badge Alliance & priorité",
    summary:
      "Montrer que vous êtes engagé(e) — et être mieux vu(e) par les profils sérieux.",
    details: [
      "Badge Alliance vérifié sur votre profil",
      "Priorité soft dans les suggestions auprès des membres compatibles",
      "Un signal de sérieux qui rassure avant le premier message",
      "Vous gagnez en visibilité sans changer qui vous êtes",
    ],
    tone: "#6B3A2A",
    soft: "rgba(107, 58, 42, 0.1)",
    ink: "#6B3A2A",
  },
  {
    id: "support",
    icon: Headphones,
    title: "Support prioritaire",
    summary:
      "Une oreille humaine quand un blocage compte vraiment — pas une file anonyme.",
    details: [
      "WhatsApp VIP pour les urgences compte, paiement ou matching",
      "Ticket prioritaire dans l’app (file Alliance)",
      "Pourquoi c’est important : une réponse humaine calme un doute plus vite qu’un formulaire",
      "Complément naturel du coaching payant si vous voulez aller plus loin",
    ],
    tone: "#2F3D4A",
    soft: "rgba(47, 61, 74, 0.1)",
    ink: "#2F3D4A",
  },
]

function BenefitCardItem({
  card,
  index,
}: {
  card: BenefitCard
  index: number
}) {
  const [open, setOpen] = React.useState(true)
  const Icon = card.icon

  return (
    <article
      className={cn(
        "group relative rounded-2xl border border-border/70 bg-white overflow-hidden shadow-card",
        "transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-elevated",
        "animate-in fade-in slide-in-from-bottom-3 fill-mode-both",
        "h-full flex flex-col",
        open && "ring-1 shadow-elevated"
      )}
      style={{
        animationDelay: `${index * 70}ms`,
        ["--card-tone" as string]: card.tone,
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-1.5 transition-opacity duration-300"
        style={{ background: card.tone, opacity: open ? 1 : 0.85 }}
      />
      <div className="w-full text-left p-5 sm:p-6 space-y-3 flex-1 flex flex-col">
        <div className="flex items-start gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
            style={{ background: card.soft, color: card.ink }}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif text-xl font-bold leading-snug">
                {card.title}
              </h3>
              {card.badge ? (
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: card.soft, color: card.ink }}
                >
                  {card.badge}
                </span>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {card.summary}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "grid transition-all duration-400 ease-out flex-1",
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <ul className="pt-3 space-y-2.5 border-t border-border/50">
              {card.details.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-2 text-sm text-foreground/90"
                >
                  <Target
                    className="h-3.5 w-3.5 mt-1 shrink-0"
                    style={{ color: card.tone }}
                  />
                  <span className="leading-relaxed">{d}</span>
                </li>
              ))}
            </ul>
            {card.href && card.cta ? (
              <div className="pt-4">
                <Link
                  href={card.href}
                  className="inline-flex h-10 items-center rounded-xl px-4 text-sm font-semibold text-white transition-opacity hover:opacity-95"
                  style={{ background: card.tone }}
                >
                  {card.cta}
                </Link>
              </div>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-auto pt-2 text-[11px] font-semibold text-left hover:underline"
          style={{ color: card.ink }}
          aria-expanded={open}
        >
          {open ? "Voir moins" : "Voir plus"}
        </button>
      </div>
    </article>
  )
}

/** Cartes Alliance — grille 2×2, animées, sans surcharge. */
export function AllianceBenefitCards() {
  return (
    <section className="space-y-5">
      <div className="space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
          Ce qu’Alliance ouvre
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold">
          Six avantages, une seule intention
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Tout est affiché d’emblée. Cliquez sur « Voir moins » si vous voulez
          alléger une carte — pensé pour préparer un mariage sérieux, pas pour
          accumuler des options.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 items-stretch">
        {CARDS.map((card, index) => (
          <BenefitCardItem key={card.id} card={card} index={index} />
        ))}
      </div>
    </section>
  )
}

/** Bloc bas de page — focus bilan + axes (sans simulation). */
export function AllianceBilanSection() {
  return (
    <section className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.06] via-white to-accent/10 p-5 sm:p-7 space-y-4">
      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
          Au cœur d’Alliance
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
          Rapport Personnalisé Alliance™
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Alliance ne se limite pas à « plus de matchs ». Vous débloquez un{" "}
          <strong className="text-foreground font-semibold">
            rapport vivant
          </strong>{" "}
          : chapitres qui s’enrichissent à chaque évaluation, forces, vigilances
          et plan d’action — sans jamais cacher ce qui reste à découvrir.
        </p>
      </div>
      <ul className="grid sm:grid-cols-2 gap-3">
        {[
          {
            icon: ClipboardList,
            title: "18 pages structurées",
            body: "Couverture, portrait, compétences, plan, ressources, évolution.",
          },
          {
            icon: Target,
            title: "10+ évaluations",
            body: "Essentielles, complémentaires, Premium+ — chaque test ouvre une analyse.",
          },
          {
            icon: MessageCircle,
            title: "Chapitres verrouillés visibles",
            body: "Rien n’est caché : vous voyez ce qu’il reste à débloquer.",
          },
          {
            icon: Zap,
            title: "Activation immédiate",
            body: "Après paiement : rapport, quotas, badge et Coffre Premium s’ouvrent ensemble.",
          },
        ].map((item) => {
          const Icon = item.icon
          return (
            <li
              key={item.title}
              className="rounded-xl border border-border/70 bg-white/80 p-4 space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="text-sm font-semibold">{item.title}</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.body}
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
