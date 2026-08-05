"use client"

import * as React from "react"
import {
  CheckCircle2,
  ClipboardList,
  Crown,
  Heart,
  Lock,
  MessageCircle,
  MessagesSquare,
  Sparkles,
  Unlock,
} from "lucide-react"
import { cn } from "@/utils/cn"
import { PLANS } from "@/lib/billing/plans"

/** Comparaison Découverte → Alliance — quotas explicites (pas de flou). */
const FEATURES = [
  {
    icon: Heart,
    title: "Suggestions de compatibilité",
    free: "3 / jour",
    alliance: "15 / jour",
  },
  {
    icon: MessageCircle,
    title: "Nouvelles conversations sérieuses",
    free: "5 / mois",
    alliance: "25 / mois",
  },
  {
    icon: MessagesSquare,
    title: "Messages par conversation",
    free: "5 messages",
    alliance: "100 messages",
  },
  {
    icon: Sparkles,
    title: "Échanges avec Eva",
    free: "3 questions / jour",
    alliance: "20 questions / jour",
  },
  {
    icon: ClipboardList,
    title: "Mon bilan relationnel",
    free: "Conseils légers",
    alliance: "Résumé + points par domaine",
  },
  {
    icon: Crown,
    title: "Badge Alliance",
    free: "—",
    alliance: "Visible sur le profil",
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
          Les quotas exacts — Découverte vs Alliance — pour avancer avec plus de
          conversations et d&apos;échanges sérieux.
        </p>
      </div>

      <div className="hidden sm:grid grid-cols-[1fr_7rem_7rem] gap-2 px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        <span>Avantage</span>
        <span className="text-right">Découverte</span>
        <span className="text-right text-primary">Alliance</span>
      </div>

      <ul className="space-y-3">
        {FEATURES.map((f) => {
          const Icon = f.icon
          return (
            <li
              key={f.title}
              className="flex flex-col sm:grid sm:grid-cols-[1fr_7rem_7rem] sm:items-center gap-2 rounded-xl border border-border/80 bg-background/60 px-3 py-3 sm:px-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold text-foreground pt-2">{f.title}</p>
              </div>
              <div className="flex sm:block items-center justify-between gap-2 pl-13 sm:pl-0 sm:text-right">
                <span className="sm:hidden text-[10px] uppercase text-muted-foreground">Découverte</span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground line-through decoration-destructive/40 sm:justify-end">
                  <Lock className="h-3 w-3 text-destructive/70 shrink-0" />
                  {f.free}
                </span>
              </div>
              <div className="flex sm:block items-center justify-between gap-2 pl-13 sm:pl-0 sm:text-right">
                <span className="sm:hidden text-[10px] uppercase text-primary font-semibold">Alliance</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-primary sm:justify-end">
                  <Unlock className="h-3 w-3 shrink-0" />
                  {f.alliance}
                </span>
              </div>
            </li>
          )
        })}
      </ul>

      <ul className="grid sm:grid-cols-2 gap-2 pt-1">
        {alliance.features.map((feat) => (
          <li key={feat} className="flex items-start gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className={cn("h-3.5 w-3.5 mt-0.5 text-accent shrink-0")} />
            {feat}
          </li>
        ))}
      </ul>
    </section>
  )
}
