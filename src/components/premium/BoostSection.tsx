"use client"

import * as React from "react"
import { Rocket, CheckCircle2, Clock } from "lucide-react"
import { BOOST_PACKS } from "@/lib/billing/premiumOffers"
import { cn } from "@/utils/cn"

/**
 * Un Boost = visibilité prioritaire temporaire du profil
 * dans les suggestions aux membres compatibles.
 * Achetable seul (même en Découverte) ou offert avec Alliance 1/3/6 mois.
 */
export function BoostSection() {
  const [selected, setSelected] = React.useState(BOOST_PACKS[0].id)
  const pack = BOOST_PACKS.find((p) => p.id === selected) ?? BOOST_PACKS[0]

  return (
    <section className="rounded-2xl border border-border bg-white p-5 sm:p-7 space-y-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Boost profil</p>
          <h2 className="font-serif text-2xl font-bold">Apparaître en priorité</h2>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
            Pendant la durée choisie, votre profil est mis en avant auprès des membres
            compatibles : plus de chances d&apos;être vu, sans changer votre Matching.
            Disponible seul ou en bonus avec Alliance (1 / 3 / 6 mois).
          </p>
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
          <Rocket className="h-5 w-5" />
        </span>
      </div>

      <ul className="grid sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
        {[
          "Priorité dans les suggestions compatibles",
          "Durée claire (24 h, 3 j ou 7 j)",
          "Sans modifier votre score de Matching",
        ].map((t) => (
          <li key={t} className="flex items-start gap-2 rounded-xl bg-secondary/50 px-3 py-2.5">
            <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
            <span>{t}</span>
          </li>
        ))}
      </ul>

      <div className="grid gap-3 sm:grid-cols-3">
        {BOOST_PACKS.map((b) => {
          const active = b.id === selected
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => setSelected(b.id)}
              className={cn(
                "text-left rounded-2xl border px-4 py-4 transition-all",
                active
                  ? "border-accent bg-accent/10 shadow-card"
                  : "border-border hover:border-accent/40"
              )}
            >
              <p className="font-semibold text-sm text-foreground">{b.label}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {b.durationLabel}
              </p>
              <p className="mt-2 font-serif text-xl font-bold text-primary">
                {b.amountXof.toLocaleString("fr-FR")}{" "}
                <span className="text-xs font-sans font-semibold">FCFA</span>
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground leading-snug">{b.description}</p>
            </button>
          )
        })}
      </div>

      <div className="rounded-xl border border-border bg-secondary/40 px-4 py-3 text-xs text-muted-foreground leading-relaxed">
        Sélection : <strong className="text-foreground">{pack.label}</strong> —{" "}
        {pack.amountXof.toLocaleString("fr-FR")} FCFA pour {pack.durationLabel}. Le paiement Boost
        en ligne arrive juste après Alliance ; vous pouvez déjà choisir votre formule.
      </div>

      <button
        type="button"
        disabled
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary/80 text-primary-foreground h-11 px-6 text-sm font-semibold opacity-90 cursor-not-allowed"
      >
        <Rocket className="h-4 w-4" />
        Activer {pack.label} — bientôt payable
      </button>
    </section>
  )
}
