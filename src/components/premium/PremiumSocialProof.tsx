"use client"

import * as React from "react"
import { ChevronDown, Quote } from "lucide-react"
import { cn } from "@/utils/cn"

/** Témoignages + FAQ Alliance — KELIA Page d'accueil.docx */
const ALLIANCE_TESTIMONIALS = [
  {
    quote:
      "Je pensais simplement avoir plus de profils. En réalité, j'ai surtout reçu des recommandations beaucoup plus pertinentes. Chaque conversation semblait partir sur de meilleures bases.",
    name: "Grâce",
    meta: "Alliance depuis 4 mois",
  },
  {
    quote:
      "Le score de compatibilité nous a permis d'aborder rapidement les sujets essentiels. Nous savions déjà que nous partagions les mêmes convictions.",
    name: "David",
    meta: "Alliance",
  },
  {
    quote:
      "Je considère aujourd'hui Alliance comme un investissement dans mon avenir, pas comme une dépense supplémentaire.",
    name: "Rachel",
    meta: "Alliance",
  },
  {
    quote:
      "J'ai perdu moins de temps avec des échanges sans lendemain. Les profils proposés correspondaient réellement à ce que je recherchais.",
    name: "Samuel",
    meta: "Alliance",
  },
]

const FAQS = [
  {
    q: "Pourquoi devenir membre Alliance ?",
    a: "Parce que vous profitez de toute la puissance du Matching KELLIA™ et d'une expérience complète pour avancer plus sereinement dans votre recherche.",
  },
  {
    q: "Puis-je arrêter quand je le souhaite ?",
    a: "Oui. Le renouvellement est entièrement manuel. Vous gardez toujours le contrôle.",
  },
  {
    q: "Mon paiement est-il sécurisé ?",
    a: "Oui. Tous les paiements sont réalisés via Bictorys ou CinetPay selon votre pays.",
  },
  {
    q: "Que se passe-t-il si je repasse en offre Découverte ?",
    a: "Votre compte reste actif. Vous conservez votre profil et retrouvez simplement les fonctionnalités incluses dans l'offre gratuite.",
  },
  {
    q: "Pourquoi proposer un abonnement ?",
    a: "Parce que nous préférons investir dans la qualité des recommandations, la sécurité de la plateforme et l'amélioration continue de notre Matching plutôt que d'afficher de la publicité ou de vendre vos données.",
  },
]

export function PremiumSocialProof() {
  const [open, setOpen] = React.useState<number | null>(0)
  const [tIndex, setTIndex] = React.useState(0)

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setTIndex((i) => (i + 1) % ALLIANCE_TESTIMONIALS.length)
    }, 5500)
    return () => window.clearInterval(id)
  }, [])

  const t = ALLIANCE_TESTIMONIALS[tIndex]

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-accent/25 bg-accent/10 p-5 sm:p-7 space-y-4">
        <div className="text-center space-y-2">
          <span className="inline-flex rounded-full bg-accent/30 px-3 py-1 text-[11px] font-semibold">
            Soft launch
          </span>
          <h2 className="font-serif text-2xl font-bold">Ils avancent avec Alliance</h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Exemples de parcours inspirés des retours de la communauté. Les témoignages vérifiés
            remplacent progressivement ces exemples.
          </p>
        </div>
        <figure className="text-center space-y-4 min-h-[160px] flex flex-col justify-center">
          <Quote className="h-7 w-7 text-accent mx-auto" />
          <blockquote className="font-serif text-lg sm:text-xl italic text-foreground leading-relaxed">
            « {t.quote} »
          </blockquote>
          <figcaption className="text-sm font-semibold text-primary">
            {t.name}
            <span className="block font-normal text-muted-foreground mt-1">{t.meta}</span>
          </figcaption>
        </figure>
        <div className="flex justify-center gap-2">
          {ALLIANCE_TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Témoignage ${i + 1}`}
              onClick={() => setTIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === tIndex ? "w-7 bg-accent" : "w-2 bg-border"
              )}
            />
          ))}
        </div>
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
