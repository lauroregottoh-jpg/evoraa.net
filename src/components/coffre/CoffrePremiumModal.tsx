"use client"

import * as React from "react"
import Link from "next/link"
import { Crown, Sparkles, X } from "lucide-react"
import { PLANS } from "@/lib/billing/plans"
import {
  COFFRE_INITIAL_UNLOCKS,
  COFFRE_UNLOCKS_PER_MONTH,
} from "@/lib/coffre/unlock"

type Props = {
  open: boolean
  onClose: () => void
  resourceTitle?: string
}

export function CoffrePremiumModal({ open, onClose, resourceTitle }: Props) {
  const alliance = PLANS.premium_plus

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="coffre-premium-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#2D1020]/55 backdrop-blur-[2px] animate-in fade-in duration-300"
        aria-label="Fermer"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-border bg-[#F2EBE0] shadow-elevated overflow-hidden animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">
        <div
          className="h-28 sm:h-32 relative"
          style={{
            background:
              "linear-gradient(135deg, #2D1020 0%, #3D181E 55%, #B8954A 140%)",
          }}
        >
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_70%_20%,rgba(255,253,249,0.35),transparent_50%)]" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/15 text-white hover:bg-white/25 flex items-center justify-center transition-colors"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-4 left-5 right-5 flex items-center gap-3 text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 border border-white/20">
              <Crown className="h-5 w-5 text-accent" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                Alliance
              </p>
              <h2
                id="coffre-premium-title"
                className="font-serif text-2xl font-bold leading-tight"
              >
                Le Coffre Premium
              </h2>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {resourceTitle ? (
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">
                « {resourceTitle} »
              </span>{" "}
              fait partie de la bibliothèque exclusive réservée aux membres
              Alliance.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">
              Accédez à une bibliothèque privée de guides, journaux et exercices
              pour préparer votre mariage avec sérieux.
            </p>
          )}

          <ul className="space-y-2.5">
            {[
              `${COFFRE_INITIAL_UNLOCKS} ressources au choix dès l’activation`,
              `Puis +${COFFRE_UNLOCKS_PER_MONTH} ressources au choix chaque mois`,
              "18+ ressources PDF classées par domaine de vie",
              "Téléchargements sécurisés, à votre rythme",
              "Rapport Alliance, Matching enrichi et badge vérifié",
            ].map((line) => (
              <li
                key={line}
                className="flex items-start gap-2.5 text-sm text-foreground"
              >
                <Sparkles className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <p className="text-xs text-muted-foreground">
            Alliance — {alliance.amountXof.toLocaleString("fr-FR")} FCFA
            {alliance.periodLabel}
          </p>

          <div className="flex flex-col gap-2 pt-1">
            <Link
              href="/premium"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-95 transition-opacity"
            >
              Passer à Alliance
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center justify-center rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Continuer en Découverte
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
