"use client"

import * as React from "react"
import { cn } from "@/utils/cn"

export type PremiumHeroSlide = {
  badge: string
  title: string
  highlight: string
  subtitle: string
}

/** Source : KELIA - Page d'accueil.docx — section Alliance / Premium */
const DEFAULT_SLIDES: PremiumHeroSlide[] = [
  {
    badge: "Matching à 5 piliers",
    title: "mérite plus que le hasard.",
    highlight: "Votre futur conjoint",
    subtitle:
      "Alliance vous donne accès à toute la puissance du Matching KELIAA™ à 5 piliers pour recevoir davantage de profils réellement compatibles avec votre foi, vos valeurs et votre projet de mariage.",
  },
  {
    badge: "Compatibilités détaillées",
    title: "toutes les chances à votre future rencontre.",
    highlight: "Donnez",
    subtitle:
      "Passez à Alliance et profitez d'une expérience complète conçue pour vous aider à rencontrer une personne réellement compatible.",
  },
  {
    badge: "Renouvellement manuel",
    title: "vous perdez moins de temps, vous avancez plus sereinement.",
    highlight: "Avec Alliance,",
    subtitle:
      "Parce que rencontrer la bonne personne ne dépend pas uniquement du nombre de profils consultés — vous échangez avec des profils plus pertinents grâce au Matching KELIAA™.",
  },
]

export function PremiumHeroCarousel({
  firstName,
  slides = DEFAULT_SLIDES,
  intervalMs = 5000,
}: {
  firstName?: string
  slides?: PremiumHeroSlide[]
  intervalMs?: number
}) {
  const [index, setIndex] = React.useState(0)
  const name = firstName?.trim() || ""

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [slides.length, intervalMs])

  const slide = slides[index]

  return (
    <section className="text-center space-y-5 max-w-3xl mx-auto px-1">
      <div key={index} className="space-y-4">
        <span className="inline-flex items-center rounded-full bg-accent/20 text-accent-foreground border border-accent/30 px-3 py-1 text-[11px] font-semibold tracking-wide">
          {slide.badge}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight">
          {name ? (
            <>
              <span className="italic font-semibold">{name}</span>
              {", "}
            </>
          ) : null}
          <span className="text-accent">{slide.highlight}</span> {slide.title}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          {slide.subtitle}
        </p>
      </div>

      <div
        className="grid grid-cols-3 gap-2 sm:gap-4 rounded-2xl bg-accent/10 border border-accent/20 px-3 py-4 sm:px-6"
        aria-label="Indicateurs Alliance"
      >
        {[
          { value: "5", label: "piliers Matching" },
          { value: "✓", label: "compatibilités détaillées" },
          { value: "100 %", label: "renouvellement manuel" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-serif text-xl sm:text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 leading-snug">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 pt-1">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`En-tête ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn(
              "h-2 rounded-full transition-all",
              i === index ? "w-7 bg-accent" : "w-2 bg-border hover:bg-muted-foreground/40"
            )}
          />
        ))}
      </div>
    </section>
  )
}
