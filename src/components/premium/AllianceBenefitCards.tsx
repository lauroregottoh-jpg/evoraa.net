"use client"

import * as React from "react"
import Link from "next/link"
import {
  BadgeCheck,
  ChevronDown,
  ClipboardList,
  Crown,
  Heart,
  Library,
  MessageCircle,
  Sparkles,
  Target,
} from "lucide-react"
import { cn } from "@/utils/cn"
import { PLANS } from "@/lib/billing/plans"
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
  accent?: boolean
  href?: string
  cta?: string
}

const CARDS: BenefitCard[] = [
  {
    id: "rapport",
    icon: ClipboardList,
    title: "Rapport personnalisé (5 piliers)",
    summary:
      "Une lecture claire de votre profil relationnel — pas un score flou.",
    details: [
      "Bilan complet à partir de vos questionnaires déjà remplis",
      "Lecture des 5 piliers : personnalité, foi, conflits, vision, finances",
      "Points forts et zones de vigilance formulés simplement",
      "Base solide pour vos prochaines rencontres sérieuses",
    ],
    accent: true,
  },
  {
    id: "axes",
    icon: Target,
    title: "Axes d’amélioration priorisés",
    summary:
      "Savoir où grandir — avec une piste concrète, pas une liste vague.",
    details: [
      "Axes classés par impact sur votre préparation au mariage",
      "Une suggestion du jour pour avancer sans vous disperser",
      "Lien naturel vers les modules Académie quand c’est pertinent",
      "Suivi de progrès au fil de vos réponses",
    ],
  },
  {
    id: "coffre",
    icon: Library,
    title: "Coffre Premium",
    summary: "Inclus dans l’abonnement Alliance — bibliothèque privée de PDF.",
    details: [
      `${COFFRE_INITIAL_UNLOCKS} ressources au choix dès l’activation`,
      `Puis +${COFFRE_UNLOCKS_PER_MONTH} ressources au choix chaque mois`,
      "Guides, journaux, prières, exercices, affirmations…",
      "Téléchargements sécurisés, à votre rythme",
    ],
    accent: true,
    href: "/coffre-premium",
    cta: "Voir le Coffre Premium",
  },
  {
    id: "matching",
    icon: Heart,
    title: "Matching enrichi",
    summary: "Plus de suggestions pertinentes, plus d’espace pour échanger.",
    details: [
      "15 suggestions de compatibilité / jour (vs 3 en Découverte)",
      "25 nouvelles conversations sérieuses / mois (vs 5)",
      "100 messages par conversation (vs 5)",
      "Score de compatibilité plus détaillé pour décider mieux",
    ],
  },
  {
    id: "eva",
    icon: Sparkles,
    title: "Eva, votre coach locale",
    summary: "Plus de questions pour clarifier vos doutes au quotidien.",
    details: [
      "20 questions Eva / jour (vs 3 en Découverte)",
      "Réponses ancrées dans la vision KELIAA",
      "Idéal pour préparer une conversation ou un discernement",
    ],
  },
  {
    id: "badge",
    icon: Crown,
    title: "Badge Alliance & priorité",
    summary: "Être reconnu comme membre engagé — et mieux vu.",
    details: [
      "Badge Alliance vérifié sur votre profil",
      "Priorité soft dans les suggestions auprès des membres compatibles",
      "Signal de sérieux pour les profils qui comptent",
    ],
  },
  {
    id: "support",
    icon: BadgeCheck,
    title: "Support prioritaire",
    summary: "Une oreille humaine quand vous en avez besoin.",
    details: [
      "WhatsApp VIP + ticket prioritaire",
      "Réponse plus rapide sur les sujets urgents",
      "En complément du coaching payant si vous voulez aller plus loin",
    ],
  },
]

function BenefitCardItem({ card }: { card: BenefitCard }) {
  const [open, setOpen] = React.useState(card.accent ?? false)
  const Icon = card.icon

  return (
    <article
      className={cn(
        "rounded-2xl border bg-white overflow-hidden shadow-card transition-all duration-300",
        card.accent
          ? "border-accent/40 ring-1 ring-accent/15"
          : "border-border/80",
        open && "shadow-elevated"
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left p-5 sm:p-6 flex items-start gap-3"
        aria-expanded={open}
      >
        <span
          className={cn(
            "mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            card.accent
              ? "bg-accent/15 text-accent"
              : "bg-primary/10 text-primary"
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-xl font-bold leading-snug">
              {card.title}
            </h3>
            <ChevronDown
              className={cn(
                "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300",
                open && "rotate-180"
              )}
            />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {card.summary}
          </p>
          {card.id === "coffre" ? (
            <span className="inline-flex mt-1 text-[10px] font-bold uppercase tracking-wider text-accent">
              Inclus Alliance
            </span>
          ) : null}
        </div>
      </button>

      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <ul className="px-5 sm:px-6 pb-5 space-y-2 border-t border-border/50 pt-4">
            {card.details.map((d) => (
              <li
                key={d}
                className="flex items-start gap-2 text-sm text-foreground/90"
              >
                <MessageCircle className="h-3.5 w-3.5 mt-1 text-accent shrink-0" />
                <span className="leading-relaxed">{d}</span>
              </li>
            ))}
          </ul>
          {card.href && card.cta ? (
            <div className="px-5 sm:px-6 pb-5">
              <Link
                href={card.href}
                className="inline-flex h-10 items-center rounded-xl bg-primary text-primary-foreground px-4 text-sm font-semibold"
              >
                {card.cta}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
}

/** Cartes détaillées — ce qu’Alliance développe (remplace le tableau comparatif). */
export function AllianceBenefitCards() {
  const alliance = PLANS.premium_plus

  return (
    <section className="space-y-5">
      <div className="space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
          Ce qu’Alliance développe
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold">
          Des bonus qui changent vraiment votre parcours
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Cliquez une carte pour voir le détail. Alliance, c’est le rapport, le
          Matching enrichi, le{" "}
          <strong className="text-foreground">Coffre Premium inclus</strong>, et
          plus d’espace pour avancer sérieusement.
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4">
        {CARDS.map((card) => (
          <BenefitCardItem key={card.id} card={card} />
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Alliance — {alliance.amountXof.toLocaleString("fr-FR")} FCFA
        {alliance.periodLabel}
      </p>
    </section>
  )
}
