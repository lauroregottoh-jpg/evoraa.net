"use client"

import * as React from "react"
import Link from "next/link"
import { joinCoupleWithCodeAction } from "@/app/actions/couple"
import { Lock } from "lucide-react"
import { cn } from "@/utils/cn"

/**
 * Contenu Couple visible mais verrouillé tant que le bilan n’est pas payé / rejoint.
 * CTA ouvre le paiement sans quitter le contexte (lien offre + rejoindre).
 */
export function CouplePaywallOverlay({
  title = "Débloquez votre bilan",
  body = "Vous voyez l’espace KELIAA Couple™. Les questionnaires, le dossier et les livrables s’ouvrent après l’achat (ou avec le code de votre partenaire).",
  className,
  children,
}: {
  title?: string
  body?: string
  className?: string
  children: React.ReactNode
}) {
  const [code, setCode] = React.useState("")
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const submitCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await joinCoupleWithCodeAction(code)
    setLoading(false)
    if (res.requiresAuth) {
      window.location.assign(
        `/login?next=${encodeURIComponent("/couple/espace")}`
      )
      return
    }
    if (res.error) {
      setError(res.error)
      return
    }
    window.location.assign("/couple/espace")
  }

  return (
    <div className={cn("relative", className)}>
      <div
        className="pointer-events-none select-none opacity-[0.55] grayscale-[0.35]"
        aria-hidden
      >
        {children}
      </div>
      <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-[#F2EBE0]/55 backdrop-blur-[2px]">
        <div className="w-full max-w-md rounded-2xl border border-[#B8954A]/40 bg-white shadow-elevated p-6 space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#A07070]/10 text-[#A07070]">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#A07070]">{title}</h2>
          <p className="text-sm text-[#A07070]/75 leading-relaxed">{body}</p>
          <form onSubmit={submitCode} className="space-y-2 text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Déjà inscrit(e) ? Entrez le code partenaire
            </label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="KLY-XXXXX"
              className="w-full h-11 rounded-xl border px-4 font-mono tracking-wider"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full h-11 rounded-xl bg-[#A07070] text-sm font-semibold text-[#F2EBE0] disabled:opacity-60"
            >
              {loading ? "Vérification…" : "Entrer dans l’espace"}
            </button>
            {error ? (
              <p className="text-xs text-destructive">{error}</p>
            ) : null}
          </form>
          <div className="flex flex-col sm:flex-row gap-2 justify-center pt-1">
            <Link
              href="/couple/offre"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#A07070] px-5 text-sm font-semibold text-[#F2EBE0]"
            >
              Faire le paiement — débloquer
            </Link>
            <Link
              href="/couple/rejoindre"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#A07070]/25 px-5 text-sm font-semibold text-[#A07070]"
            >
              J’ai un code partenaire
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Carte livrable grisée (aperçu). */
export function CoupleLockedCard({
  title,
  description,
  onUnlockHref = "/couple/offre",
}: {
  title: string
  description: string
  onUnlockHref?: string
}) {
  return (
    <div className="relative rounded-2xl border border-[#A07070]/10 bg-[#F2EBE0]/90 p-5 opacity-90">
      <div className="flex gap-3 items-start">
        <Lock className="h-5 w-5 text-[#A07070]/50 shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <p className="font-serif text-lg font-bold text-[#A07070]/70">{title}</p>
          <p className="mt-1 text-sm text-[#A07070]/55">{description}</p>
          <Link
            href={onUnlockHref}
            className="mt-3 inline-flex text-xs font-bold uppercase tracking-wider text-[#A07070]"
          >
            Débloquer →
          </Link>
        </div>
      </div>
    </div>
  )
}
