"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/utils/cn"

const FAQS = [
  {
    q: "Pourquoi devenir membre Alliance ?",
    a: "Parce que vous profitez de toute la puissance du Matching KELIAA™ et d'une expérience complète pour avancer plus sereinement dans votre recherche.",
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

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-accent/25 bg-accent/10 p-5 sm:p-7 space-y-3 text-center">
        <h2 className="font-serif text-2xl font-bold">Alliance, sans artifice</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Soft launch : nous publierons des témoignages membres authentiques dès qu&apos;ils
          seront disponibles. En attendant, comparez les quotas Decouverte / Alliance et
          choisissez au rythme de votre discernement.
        </p>
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
