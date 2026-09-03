"use client"

import * as React from "react"
import Link from "next/link"
import {
  Heart,
  HeartHandshake,
  Home,
  Sparkles,
  Sprout,
  Unlock,
  Users,
} from "lucide-react"
import {
  COFFRE_DOMAIN_META,
  getCoffreResourcesByDomain,
  type CoffreDomain,
  type CoffreResource,
} from "@/lib/coffre/resources"
import {
  COFFRE_INITIAL_UNLOCKS,
  COFFRE_UNLOCKS_PER_MONTH,
} from "@/lib/coffre/unlock"
import { PLANS } from "@/lib/billing/plans"
import { cn } from "@/utils/cn"

const DOMAIN_ICONS: Record<
  CoffreDomain,
  React.ComponentType<{ className?: string }>
> = {
  "preparation-mariage": Heart,
  "vie-couple": HeartHandshake,
  "identite-guerison": Sprout,
  "education-enfants": Users,
  "foyer-famille": Home,
}

type Props = {
  resources: CoffreResource[]
  isPaid: boolean
  onUnlockCta: () => void
}

export function CoffreUnlockSection({ resources, isPaid, onUnlockCta }: Props) {
  const alliance = PLANS.premium_plus

  const byDomain = React.useMemo(() => {
    return getCoffreResourcesByDomain(resources).map((group) => ({
      ...group,
      Icon: DOMAIN_ICONS[group.domain],
      meta: COFFRE_DOMAIN_META[group.domain],
    }))
  }, [resources])

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-primary/20 bg-gradient-to-br from-[#2A1216] via-[#2D1020] to-[#3D2A14] text-[#F2EBE0] shadow-elevated">
      <div
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(215,184,102,0.45), transparent 68%)",
        }}
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full opacity-25"
        style={{
          background:
            "radial-gradient(circle, rgba(255,253,249,0.22), transparent 70%)",
        }}
      />

      <div className="relative p-6 sm:p-8 lg:p-10 space-y-8">
        <div className="max-w-2xl space-y-3">
          <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
            <Unlock className="h-3.5 w-3.5" />
            Ce que vous débloquez
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
            {isPaid
              ? "Votre bibliothèque grandit avec vous"
              : "Imaginez ouvrir ce coffre dès ce soir"}
          </h2>
          <p className="text-sm sm:text-base text-white/75 leading-relaxed">
            {isPaid
              ? `Vous avez ${COFFRE_INITIAL_UNLOCKS} ressources au choix dès Alliance, puis +${COFFRE_UNLOCKS_PER_MONTH} chaque mois. Choisissez le domaine qui vous parle — le reste reste à portée de main.`
              : `Préparation au mariage, couple, guérison, famille, enfants… Une bibliothèque privée par domaine. Dès Alliance : ${COFFRE_INITIAL_UNLOCKS} ressources au choix, puis +${COFFRE_UNLOCKS_PER_MONTH} chaque mois.`}
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/[0.07] backdrop-blur-[2px] p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/65">
              Domaines dans votre Coffre
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-2.5 py-1 text-[11px] font-semibold text-accent">
              <Sparkles className="h-3 w-3" />
              {resources.length} ressources
            </span>
          </div>

          <ul className="grid sm:grid-cols-2 gap-3">
            {byDomain.map((item, i) => {
              const Icon = item.Icon
              return (
                <li
                  key={item.domain}
                  className={cn(
                    "group flex gap-3 rounded-xl border border-white/10 bg-black/20 px-3.5 py-3.5",
                    "transition-all duration-300 hover:border-accent/40 hover:bg-black/30 hover:-translate-y-0.5",
                    "animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
                  )}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15"
                    style={{ backgroundColor: `${item.meta.tone}cc` }}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </span>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <p className="font-serif text-lg font-semibold leading-none">
                        {item.label}
                      </p>
                      <span className="text-[11px] font-semibold text-accent/90">
                        {item.resources.length}{" "}
                        {item.resources.length > 1
                          ? "disponibles"
                          : "disponible"}
                      </span>
                    </div>
                    <p className="text-xs text-white/65 leading-relaxed">
                      {item.blurb}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 justify-between pt-1">
          <div className="space-y-1.5">
            <p className="font-serif text-2xl font-bold text-white">
              {alliance.amountXof.toLocaleString("fr-FR")} FCFA
              <span className="text-base font-sans font-medium text-white/60">
                {alliance.periodLabel}
              </span>
            </p>
            <p className="text-xs text-white/55 leading-relaxed max-w-sm">
              Rapport Alliance, Matching enrichi, badge — et ce Coffre qui
              s’ouvre mois après mois.
            </p>
          </div>

          {isPaid ? (
            <Link
              href="/billing"
              className="shrink-0 inline-flex h-12 items-center justify-center rounded-xl bg-accent text-accent-foreground px-6 text-sm font-bold hover:opacity-95 transition-opacity"
            >
              Gérer mon Alliance
            </Link>
          ) : (
            <button
              type="button"
              onClick={onUnlockCta}
              className="shrink-0 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent text-accent-foreground px-6 text-sm font-bold hover:opacity-95 transition-all hover:scale-[1.02]"
            >
              <Unlock className="h-4 w-4" />
              Débloquer Coffre Premium
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
