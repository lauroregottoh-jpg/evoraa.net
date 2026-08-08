"use client"

import Link from "next/link"
import { HeartHandshake, ArrowRight } from "lucide-react"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { COUPLE_BRAND, COUPLE_TAGLINE, COUPLE_PROMISE } from "@/lib/couple/config"
import { COUPLE_OFFERS } from "@/lib/couple/offers"

export function HomeCoupleSection() {
  return (
    <section className="relative py-20 sm:py-24 px-6 sm:px-12 lg:px-20 overflow-hidden">
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background:
            "linear-gradient(135deg, #F8F4EE 0%, #EDE6DC 45%, #E8DFD2 100%)",
        }}
      />
      <div className="relative z-10 max-w-6xl mx-auto space-y-10">
        <div className="max-w-2xl space-y-4 gsap-fade-up">
          <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
            <HeartHandshake className="h-3.5 w-3.5" />
            Nouveau
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.08]">
            {COUPLE_BRAND}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {COUPLE_TAGLINE}. {COUPLE_PROMISE}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Un bilan pour les couples déjà engagés — questionnaires confidentiels,
            analyse croisée, rapport, exercices et plan d’action. Distinct du
            matching célibataires KELIAA.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <MagneticButton href="/couple" size="lg" className="px-7">
              Découvrir le bilan
              <ArrowRight className="ml-2 h-4 w-4" />
            </MagneticButton>
            <Link
              href="/couple/offre"
              className="inline-flex h-12 items-center rounded-xl border border-border bg-white/70 px-5 text-sm font-semibold text-foreground"
            >
              Voir les offres
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 gsap-fade-up">
          {Object.values(COUPLE_OFFERS).map((offer) => (
            <div
              key={offer.id}
              className="rounded-2xl border border-border/60 bg-white/80 p-5 sm:p-6 space-y-2"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {offer.popular ? "Le plus choisi" : "Offre"}
              </p>
              <h3 className="font-serif text-xl font-bold">{offer.marketingName}</h3>
              <p className="font-serif text-2xl font-bold text-primary">
                {offer.amountXof.toLocaleString("fr-FR")}{" "}
                <span className="text-sm font-sans font-medium text-muted-foreground">
                  FCFA
                </span>
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {offer.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
