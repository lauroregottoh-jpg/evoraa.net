"use client"

import * as React from "react"
import { Rocket, TrendingUp } from "lucide-react"

/** Boost UI — paiement non branché : on n'affiche plus un faux checkout. */
export function BoostSection() {
  const [message, setMessage] = React.useState("")

  return (
    <section className="rounded-2xl border border-border bg-white p-5 sm:p-7 space-y-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Boost</p>
          <h2 className="font-serif text-2xl font-bold">Donnez plus de visibilité à votre profil</h2>
          <p className="text-sm text-muted-foreground max-w-xl">
            Pendant la durée du Boost, votre profil sera présenté en priorité auprès des membres
            compatibles. Cette option arrive après stabilisation d&apos;Alliance.
          </p>
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
          <Rocket className="h-5 w-5" />
        </span>
      </div>

      <div className="flex flex-wrap gap-3 text-xs font-semibold">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
          10× visibilité
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1.5">
          Bientôt
        </span>
      </div>

      <button
        type="button"
        onClick={() =>
          setMessage(
            "Le Boost sera disponible dès que le paiement et la table profile_boosts seront activés. En attendant : complétez votre profil et activez Alliance."
          )
        }
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/60 text-foreground h-11 px-6 text-sm font-semibold"
      >
        <Rocket className="h-4 w-4" />
        Boost — bientôt disponible
      </button>
      {message && <p className="text-xs text-muted-foreground">{message}</p>}
    </section>
  )
}
