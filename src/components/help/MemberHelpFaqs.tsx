"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

type FaqItem = { q: string; a: React.ReactNode }

const SECTIONS: Array<{ id: string; title: string; items: FaqItem[] }> = [
  {
    id: "inscription",
    title: "Inscription & connexion",
    items: [
      {
        q: "Google ou e-mail — comment me connecter ?",
        a: (
          <>
            Utilisez le même mode qu’à l’inscription. Compte Google → bouton Google. Compte
            e-mail → mot de passe, ou{" "}
            <Link href="/forgot-password" className="text-primary font-semibold underline">
              mot de passe oublié
            </Link>
            .
          </>
        ),
      },
      {
        q: "Je vois « email ou mot de passe incorrect »",
        a: "Vérifiez l’adresse, le clavier, puis réinitialisez le mot de passe. Ne créez pas un second compte avec une autre adresse.",
      },
    ],
  },
  {
    id: "matching",
    title: "Matching & compatibilités",
    items: [
      {
        q: "Comment sont calculées les suggestions ?",
        a: "À partir de votre profil, vos critères de recherche et vos questionnaires. Plus le profil est complet, plus les propositions sont pertinentes.",
      },
      {
        q: "Je ne vois presque personne",
        a: "Élargissez le rayon ou l’âge dans Paramètres, complétez les tests, et vérifiez que le mode pause n’est pas activé.",
      },
    ],
  },
  {
    id: "alliance",
    title: "Alliance & paiement",
    items: [
      {
        q: "Que se passe-t-il juste après le paiement Alliance ?",
        a: "Le système réutilise vos questionnaires déjà remplis pour générer le rapport personnalisé et les axes d’amélioration — sans nouveau test obligatoire. Ensuite : plus de suggestions, badge Alliance, et priorité de visibilité. Un Boost séparé peut renforcer encore cette priorité sur une durée limitée.",
      },
      {
        q: "Alliance vs Boost ?",
        a: "Alliance = abonnement (rapport, quotas, badge, priorité de base). Boost = mise en avant temporaire dans les suggestions, en plus.",
      },
    ],
  },
  {
    id: "coaching",
    title: "Coaching & Académie",
    items: [
      {
        q: "Pourquoi un coach humain ?",
        a: "Pour un blocage précis (dialogue, timing mariage, famille…) qu’EVA ou les modules seuls ne suffisent pas à trancher. Après paiement, un court formulaire fixe le créneau.",
      },
      {
        q: "Académie gratuite / premium ?",
        a: "Une partie des modules reste accessible gratuitement ; le parcours premium (contenu enrichi) arrivera ensuite. Pour l’instant la structure est en place.",
      },
    ],
  },
]

export function MemberHelpFaqs() {
  const [open, setOpen] = React.useState<string | null>("inscription")

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="font-serif text-2xl font-bold">FAQ</h2>
        <p className="text-xs text-muted-foreground">
          Questions fréquentes, classées par thème. Pour une question personnelle : EVA
          ci-dessous.
        </p>
      </div>

      {SECTIONS.map((section) => {
        const isOpen = open === section.id
        return (
          <section
            key={section.id}
            className="rounded-xl border border-border overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : section.id)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left bg-secondary/40 hover:bg-secondary/60"
            >
              <span className="text-sm font-bold">{section.title}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen ? (
              <ul className="divide-y divide-border">
                {section.items.map((item) => (
                  <li key={item.q} className="px-4 py-3 space-y-1.5">
                    <p className="text-sm font-semibold">{item.q}</p>
                    <div className="text-xs text-muted-foreground leading-relaxed">{item.a}</div>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        )
      })}
    </div>
  )
}
