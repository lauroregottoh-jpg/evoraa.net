"use client"

import Link from "next/link"
import { PLANS } from "@/lib/billing/plans"
import { COUPLE_OFFERS } from "@/lib/couple/offers"
import { COUPLE_BRAND } from "@/lib/couple/config"

/** Bloc tarifs dual : KELIAA (app) + KELYA Couple. */
export function HomeDualPricingSection() {
  const alliance = PLANS.premium_plus
  const discovery = PLANS.free

  return (
    <section className="py-20 sm:py-24 px-6 sm:px-12 lg:px-20 bg-secondary/20">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3 gsap-fade-up">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
            Tarifs
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">
            Deux offres, deux besoins
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            KELIAA accompagne les célibataires. {COUPLE_BRAND} accompagne les
            couples déjà engagés — des bilans ponctuels, pas un abonnement
            mensuel.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 gsap-fade-up">
          <div className="rounded-[1.5rem] border border-border/70 bg-white/90 p-6 sm:p-8 space-y-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Application KELIAA
              </p>
              <h3 className="font-serif text-2xl font-bold mt-1">
                Rencontres & Alliance
              </h3>
            </div>
            <ul className="space-y-3">
              <li className="flex justify-between gap-4 border-b border-border/50 pb-3">
                <span className="text-sm font-medium">{discovery.name}</span>
                <span className="font-serif text-lg font-bold text-primary">
                  Gratuit
                </span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-sm font-medium">
                  {alliance.name}
                  <span className="block text-xs text-muted-foreground font-normal">
                    {alliance.periodLabel}
                  </span>
                </span>
                <span className="text-right">
                  <span className="font-serif text-lg font-bold text-primary">
                    {alliance.amountXof.toLocaleString("fr-FR")} FCFA
                  </span>
                  {alliance.compareAtXof ? (
                    <span className="block text-xs text-muted-foreground line-through">
                      {alliance.compareAtXof.toLocaleString("fr-FR")} FCFA
                    </span>
                  ) : null}
                </span>
              </li>
            </ul>
            <Link
              href="/pricing"
              className="inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              Voir tous les tarifs KELIAA →
            </Link>
          </div>

          <div className="rounded-[1.5rem] border border-accent/35 bg-gradient-to-br from-white via-[#F8F4EE] to-accent/10 p-6 sm:p-8 space-y-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                {COUPLE_BRAND}
              </p>
              <h3 className="font-serif text-2xl font-bold mt-1">
                Bilans de couple
              </h3>
            </div>
            <ul className="space-y-3">
              {Object.values(COUPLE_OFFERS).map((offer) => (
                <li
                  key={offer.id}
                  className="flex justify-between gap-4 border-b border-border/40 last:border-0 pb-3 last:pb-0"
                >
                  <span className="text-sm font-medium">
                    {offer.marketingName}
                    {offer.popular ? (
                      <span className="ml-2 text-[10px] uppercase tracking-wider text-accent font-bold">
                        populaire
                      </span>
                    ) : null}
                  </span>
                  <span className="font-serif text-lg font-bold text-primary whitespace-nowrap">
                    {offer.amountXof.toLocaleString("fr-FR")} FCFA
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/couple"
              className="inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              Découvrir KELYA Couple →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
