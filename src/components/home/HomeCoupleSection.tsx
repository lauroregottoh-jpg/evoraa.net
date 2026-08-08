"use client"

import Link from "next/link"
import { HeartHandshake, ArrowRight } from "lucide-react"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { COUPLE_BRAND, COUPLE_TAGLINE, COUPLE_PROMISE } from "@/lib/couple/config"

/** Teaser accueil — la vente détaillée est sur /couple. */
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
      <div className="relative z-10 max-w-3xl mx-auto space-y-6 gsap-fade-up text-center sm:text-left">
        <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
          <HeartHandshake className="h-3.5 w-3.5" />
          Nouveau · Service spécialisé
        </p>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.08]">
          {COUPLE_BRAND}
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          {COUPLE_TAGLINE}. {COUPLE_PROMISE}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
          Fiancés, cheminants, jeunes mariés ou couples depuis des années :
          un bilan pour comprendre ce qui vous rapproche, ce qui vous différencie,
          et ce que vous pouvez construire ensemble — sans verdict
          d’incompatibilité.
        </p>
        <div className="flex flex-wrap gap-3 pt-1 justify-center sm:justify-start">
          <MagneticButton href="/couple" size="lg" className="px-7">
            Découvrir {COUPLE_BRAND}
            <ArrowRight className="ml-2 h-4 w-4" />
          </MagneticButton>
          <Link
            href="/pricing#couples"
            className="inline-flex h-12 items-center rounded-xl border border-border bg-white/70 px-5 text-sm font-semibold text-foreground"
          >
            Voir les tarifs couple
          </Link>
        </div>
      </div>
    </section>
  )
}
