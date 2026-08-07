"use client"

import * as React from "react"
import { cn } from "@/utils/cn"

export type PremiumHeroSlide = {
  badge: string
  title: string
  highlight: string
  subtitle: string
}

const DEFAULT_SLIDES: PremiumHeroSlide[] = [
  {
    badge: "Alliance KELIAA",
    title: "l’espace pour préparer un mariage sérieux.",
    highlight: "Alliance,",
    subtitle:
      "Un abonnement pensé pour ceux qui veulent avancer avec lucidité : se connaître mieux, et rencontrer mieux.",
  },
  {
    badge: "Matching sérieux",
    title: "plus de suggestions vraiment compatibles.",
    highlight: "Ensuite,",
    subtitle:
      "15 suggestions / jour, davantage de conversations et de messages : vous gagnez du temps avec des profils alignés sur votre foi et votre projet.",
  },
  {
    badge: "Renouvellement manuel",
    title: "restez maître de votre abonnement.",
    highlight: "Toujours,",
    subtitle:
      "Pas de prélèvement surprise. Vous renouvelez quand vous le décidez, Mobile Money ou carte bancaire.",
  },
]

export function PremiumHeroCarousel({
  firstName,
  slides = DEFAULT_SLIDES,
  intervalMs = 6000,
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
      <div key={index} className="space-y-4 animate-in fade-in duration-500">
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
        aria-label="Ce qu’Alliance débloque"
      >
        {[
          { value: "Bilan", label: "relationnel + axes" },
          { value: "Coffre", label: "Premium inclus" },
          { value: "15", label: "suggestions / jour" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-serif text-lg sm:text-2xl font-bold text-foreground">
              {s.value}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 leading-snug">
              {s.label}
            </p>
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
              i === index
                ? "w-7 bg-accent"
                : "w-2 bg-border hover:bg-muted-foreground/40"
            )}
          />
        ))}
      </div>
    </section>
  )
}
