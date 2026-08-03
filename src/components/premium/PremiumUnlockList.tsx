"use client"

import * as React from "react"
import {
  CheckCircle2,
  Crown,
  Heart,
  Lock,
  MessageCircle,
  Sparkles,
  Unlock,
  Zap,
} from "lucide-react"
import { cn } from "@/utils/cn"
import { PLANS } from "@/lib/billing/plans"

const FEATURES = [
  {
    icon: Heart,
    title: "Plus de compatibilités pertinentes",
    free: "3 / jour",
    alliance: "15 / jour",
    locked: false,
  },
  {
    icon: MessageCircle,
    title: "Plus de conversations sérieuses",
    free: "5 / mois · 5 msg",
    alliance: "25 / mois · 100 msg",
    locked: false,
  },
  {
    icon: Sparkles,
    title: "Plus d’échanges avec EVA",
    free: "3 questions / jour",
    alliance: "20 / jour",
    locked: false,
  },
  {
    icon: Zap,
    title: "Lecture des 5 piliers de compatibilité",
    free: "Aperçu",
    alliance: "Accès étendu",
    locked: false,
  },
  {
    icon: Crown,
    title: "Badge Alliance",
    free: "—",
    alliance: "Visible sur le profil",
    locked: false,
  },
] as const

export function PremiumUnlockList() {
  const alliance = PLANS.premium_plus

  return (
    <section className="rounded-2xl border border-border bg-white p-5 sm:p-7 space-y-5 shadow-card">
      <div className="space-y-1.5">
        <h2 className="font-serif text-2xl font-bold text-foreground">
          Ce qu&apos;Alliance débloque pour vous
        </h2>
        <p className="text-sm text-muted-foreground">
          Tout ce qui change pour avancer plus vite vers une rencontre sérieuse.
        </p>
      </div>

      <ul className="space-y-3">
        {FEATURES.map((f) => {
          const Icon = f.icon
          return (
            <li
              key={f.title}
              className="flex items-start gap-3 rounded-xl border border-border/80 bg-background/60 px-3 py-3 sm:px-4"
            >
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{f.title}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1 text-muted-foreground line-through decoration-destructive/40">
                    <Lock className="h-3 w-3 text-destructive/70" />
                    {f.free}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-primary">
                    <Unlock className="h-3 w-3" />
                    {f.alliance}
                  </span>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      <ul className="grid sm:grid-cols-2 gap-2 pt-1">
        {alliance.features.slice(0, 6).map((feat) => (
          <li key={feat} className="flex items-start gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className={cn("h-3.5 w-3.5 mt-0.5 text-accent shrink-0")} />
            {feat}
          </li>
        ))}
      </ul>
    </section>
  )
}
