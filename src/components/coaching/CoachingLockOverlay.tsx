"use client"

import Link from "next/link"
import { Lock } from "lucide-react"
import { cn } from "@/utils/cn"

/**
 * Coaching visible mais verrouillé (aperçu) — sauf comptes bêta (admin / Sarah).
 */
export function CoachingLockOverlay({
  title = "Coaching bientôt ouvert",
  body = "Vous voyez l’espace coaching KELIAA. L’accès live (réservation + salle audio) sera débloqué progressivement. En attendant, découvrez l’offre — le paiement ouvrira automatiquement « Faire votre session ».",
  className,
  children,
}: {
  title?: string
  body?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("relative", className)}>
      <div
        className="pointer-events-none select-none opacity-[0.55] grayscale-[0.35]"
        aria-hidden
      >
        {children}
      </div>
      <div className="absolute inset-0 z-10 flex items-start justify-center p-4 pt-10 sm:pt-16 bg-[#FBF9F6]/55 backdrop-blur-[2px]">
        <div className="w-full max-w-md rounded-2xl border border-[#B8954A]/40 bg-white shadow-elevated p-6 space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#5C1F28]/10 text-[#5C1F28]">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#5C1F28]">
            {title}
          </h2>
          <p className="text-sm text-[#2B2421]/75 leading-relaxed">{body}</p>
          <Link
            href="/coaching#payer"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#5C1F28] px-5 text-sm font-semibold text-[#FBF9F6] w-full sm:w-auto"
          >
            Voir l’offre coaching
          </Link>
        </div>
      </div>
    </div>
  )
}
