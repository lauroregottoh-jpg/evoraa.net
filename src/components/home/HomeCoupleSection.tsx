"use client"

import { HeartHandshake, ArrowRight } from "lucide-react"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { COUPLE_BRAND, COUPLE_TAGLINE } from "@/lib/couple/config"

/** Teaser accueil — hook aligné sur la landing Couple mise à jour. */
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
          {COUPLE_TAGLINE}
        </p>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.08]">
          {COUPLE_BRAND}
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Comprenez pourquoi vous fonctionnez comme vous le faites à deux.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
          Intérêt mutuel, chemin ensemble, fiançailles ou mariage : quatre
          situations, une même carte de compréhension de votre couple.
        </p>
        <div className="flex flex-wrap gap-3 pt-1 justify-center sm:justify-start">
          <MagneticButton href="/couple" size="lg" className="px-7">
            Découvrir mon bilan de couple
            <ArrowRight className="ml-2 h-4 w-4" />
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
