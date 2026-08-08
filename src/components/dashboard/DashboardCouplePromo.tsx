"use client"

import Link from "next/link"
import { HeartHandshake } from "lucide-react"
import { COUPLE_BRAND } from "@/lib/couple/config"
import { cn } from "@/utils/cn"

type Props = {
  isPaid: boolean
  className?: string
}

/** Carte promo Couple — dashboards Découverte & Alliance. */
export function DashboardCouplePromo({ isPaid, className }: Props) {
  return (
    <Link
      href="/couple"
      className={cn(
        "flex items-start gap-3 rounded-2xl border p-5 transition-colors",
        isPaid
          ? "border-primary/25 bg-primary/[0.04] hover:bg-primary/[0.07]"
          : "border-border bg-card hover:border-primary/30",
        className
      )}
    >
      <div
        className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
          isPaid ? "bg-primary/15 text-primary" : "bg-secondary text-primary"
        )}
      >
        <HeartHandshake className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Nouveau
        </p>
        <p className="font-serif text-lg font-bold mt-0.5">{COUPLE_BRAND}</p>
        <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
          {isPaid
            ? "Bilan de compatibilité pour votre couple — questionnaires confidentiels, rapport et plan d’action."
            : "Déjà en couple ? Découvrez le bilan relationnel KELYA — distinct du matching célibataires."}
        </p>
        <span className="inline-block mt-2 text-xs font-bold text-primary">
          Voir la présentation →
        </span>
      </div>
    </Link>
  )
}
