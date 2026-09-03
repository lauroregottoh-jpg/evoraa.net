"use client"

import Link from "next/link"
import { COUPLE_BRAND } from "@/lib/couple/config"

/** Accueil — deux portes, sans aucun prix. */
export function HomeDualPricingSection() {
  return (
    <section className="py-20 sm:py-24 px-6 sm:px-12 lg:px-20 bg-background">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3 gsap-fade-up">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
            KELIAA aujourd’hui
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary">
            Deux portes d’entrée
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Pour les célibataires qui cherchent la bonne personne — et pour les
            couples déjà engagés qui veulent clarifier leur dynamique.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 gsap-fade-up">
          <Link
            href="/pricing#celibataires"
            className="rounded-[1.5rem] border border-border bg-card p-6 sm:p-8 space-y-4 hover:border-primary/40 transition-colors block shadow-card"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Application KELIAA
            </p>
            <h3 className="font-serif text-2xl font-bold">Pour les célibataires</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Matching à 5 piliers, Communauté, Rapport Alliance, Coffre Premium
              et programme Fidélité.
            </p>
            <span className="inline-flex text-sm font-semibold text-primary">
              Voir les tarifs →
            </span>
          </Link>

          <Link
            href="/couple"
            className="rounded-[1.5rem] border border-accent/35 bg-card p-6 sm:p-8 space-y-4 hover:border-accent/55 transition-colors block shadow-card"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#A78335]">
              {COUPLE_BRAND}
            </p>
            <h3 className="font-serif text-2xl font-bold">Pour les couples</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bilan relationnel ponctuel pour deux : questionnaires, analyse
              croisée, rapport et plan d’action.
            </p>
            <span className="inline-flex text-sm font-semibold text-primary">
              Découvrir {COUPLE_BRAND} →
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
