"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/utils/cn"
import { TestimonialsCarousel } from "@/components/marketing/TestimonialsCarousel"

const FAQS = [
  {
    q: "Quels modes de paiement sont acceptés ?",
    a: "Mobile Money (Orange, Wave, Moov…) et carte bancaire via Bictorys ou CinetPay, selon la configuration active.",
  },
  {
    q: "Mon paiement est-il sécurisé ?",
    a: "Oui. Le paiement est traité sur la page hébergée du prestataire. KELIAA ne stocke jamais vos données de carte ni votre PIN Mobile Money.",
  },
  {
    q: "Puis-je annuler mon abonnement ?",
    a: "Alliance n'est pas prélevée automatiquement. À la fin des 30 jours, vous choisissez de renouveler ou non.",
  },
  {
    q: "Comment fonctionne le renouvellement ?",
    a: "Renouvellement manuel uniquement. Vous êtes notifié avant l'échéance pour garder vos quotas et votre badge.",
  },
  {
    q: "À quoi sert le Boost ?",
    a: "Le Boost place temporairement votre profil en priorité dans les suggestions (24h, 3 jours ou 7 jours), en complément d'Alliance.",
  },
  {
    q: "Puis-je faire confiance à KELIAA ?",
    a: "Profils modérés, recommandations pastorales, Bouclier de bienveillance et règles claires. Nous privilégions le discernement, pas le swipe.",
  },
]

export function PremiumSocialProof() {
  const [open, setOpen] = React.useState<number | null>(0)

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-accent/25 bg-accent/10 p-5 sm:p-7 space-y-4">
        <div className="text-center space-y-2">
          <span className="inline-flex rounded-full bg-accent/30 px-3 py-1 text-[11px] font-semibold">
            Histoires vraies
          </span>
          <h2 className="font-serif text-2xl font-bold">Ils avancent avec Alliance</h2>
        </div>
        <TestimonialsCarousel />
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
