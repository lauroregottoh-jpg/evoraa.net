"use client"

import * as React from "react"
import { ChevronDown, Quote } from "lucide-react"
import { cn } from "@/utils/cn"
import { KELIAA_TESTIMONIALS } from "@/lib/marketing/testimonials"

const FAQS = [
  {
    q: "Qu’est-ce que le rapport personnalisé Alliance ?",
    a: "C’est votre bilan individuel sur les 5 piliers KELIAA : lecture détaillée de vos réponses, axes d’amélioration priorisés, et orientation vers l’Académie du mariage. Sans Alliance, vous n’avez qu’un aperçu léger.",
  },
  {
    q: "Pourquoi devenir membre Alliance ?",
    a: "Pour débloquer le rapport complet avec axes d’amélioration, puis accélérer avec plus de suggestions, de conversations et d’échanges Eva — toujours autour d’un Matching sérieux, pas du hasard.",
  },
  {
    q: "Puis-je arrêter quand je le souhaite ?",
    a: "Oui. Le renouvellement est entièrement manuel. Vous gardez toujours le contrôle.",
  },
  {
    q: "Mon paiement est-il sécurisé ?",
    a: "Oui. Les paiements sont traités de façon sécurisée (Mobile Money ou carte bancaire).",
  },
  {
    q: "Que se passe-t-il si je n’ai plus Alliance ?",
    a: "Votre compte reste actif. Vous conservez votre profil et retrouvez les limites de l’offre gratuite ; le rapport complet et les axes détaillés restent réservés à Alliance.",
  },
  {
    q: "Y aura-t-il d’autres options plus avancées ?",
    a: "Oui, plus tard (visibilité, packs dédiés). Elles s’ajouteront à Alliance mensuelle — elles ne la remplacent pas.",
  },
]

export function PremiumSocialProof() {
  const [open, setOpen] = React.useState<number | null>(0)
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % KELIAA_TESTIMONIALS.length)
    }, 5500)
    return () => window.clearInterval(id)
  }, [])

  const current = KELIAA_TESTIMONIALS[index]

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-7 space-y-5">
        <div className="text-center space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Témoignages
          </p>
          <h2 className="font-serif text-2xl font-bold">Des parcours qui parlent vrai</h2>
        </div>

        <div className="relative min-h-[220px] sm:min-h-[200px] flex flex-col items-center justify-center text-center px-2">
          {KELIAA_TESTIMONIALS.map((t, i) => (
            <figure
              key={t.name}
              className={cn(
                "absolute inset-x-0 transition-all duration-700 ease-out px-2",
                i === index
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3 pointer-events-none"
              )}
              aria-hidden={i !== index}
            >
              <Quote className="h-6 w-6 text-accent mx-auto mb-4" />
              <blockquote className="font-serif text-lg sm:text-xl text-foreground leading-relaxed italic">
                « {t.quote} »
              </blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-primary">
                {t.name}
                <span className="block font-normal text-muted-foreground mt-0.5">
                  {t.meta}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2">
          {KELIAA_TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Témoignage ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === index ? "w-7 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/40"
              )}
            />
          ))}
        </div>
        <p className="sr-only">Actuellement : {current.name}</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-2xl font-bold text-center">Questions fréquentes</h2>
        {FAQS.map((faq, i) => (
          <div key={faq.q} className="border border-border rounded-xl bg-white overflow-hidden">
            <button
              type="button"
              className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold"
              onClick={() => setOpen(open === i ? null : i)}
            >
              {faq.q}
              <ChevronDown
                className={cn("h-4 w-4 shrink-0 transition-transform", open === i && "rotate-180")}
              />
            </button>
            {open === i && (
              <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            )}
          </div>
        ))}
      </section>
    </div>
  )
}
