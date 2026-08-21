"use client"

import * as React from "react"
import Link from "next/link"

/**
 * Accroche type Duolingo : personnage KELIAA animé (clin d’œil / bounce)
 * pour ramener l’attention vers l’app — login, dashboard, PWA.
 * (Les icônes d’écran d’accueil ne peuvent pas vraiment « bouger » sur iOS ;
 *  l’animation est donc dans l’app.)
 */
export function KeliaaBuddyNudge({
  variant = "card",
  href,
}: {
  variant?: "card" | "floating"
  href?: string
}) {
  const [wink, setWink] = React.useState(false)

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setWink(true)
      window.setTimeout(() => setWink(false), 280)
    }, 4200)
    return () => window.clearInterval(id)
  }, [])

  const face = (
    <div className="relative h-16 w-16 shrink-0">
      <div className="absolute inset-0 rounded-2xl bg-[#5C1F28] shadow-lg animate-[keliaa-bounce_2.8s_ease-in-out_infinite]" />
      <div className="absolute inset-0 flex items-center justify-center font-serif text-3xl font-bold text-[#F3D9A4]">
        K
      </div>
      <span
        className={`absolute left-[28%] top-[38%] h-2 w-2 rounded-full bg-[#F3D9A4] transition-transform ${
          wink ? "scale-y-[0.15]" : "scale-y-100"
        }`}
      />
      <span className="absolute right-[28%] top-[38%] h-2 w-2 rounded-full bg-[#F3D9A4]" />
      <span className="absolute left-1/2 top-[62%] h-1 w-4 -translate-x-1/2 rounded-full bg-[#F3D9A4]/80" />
    </div>
  )

  const copy = (
    <div className="min-w-0">
      <p className="font-serif text-lg font-bold leading-tight">
        KELIAA te fait un clin d’œil
      </p>
      <p className="mt-1 text-sm text-white/75 leading-snug">
        Like en retour = conversation. Reviens souvent : les bons profils
        n’attendent pas.
      </p>
    </div>
  )

  if (variant === "floating" && href) {
    return (
      <Link
        href={href}
        className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-2xl border border-[#5C1F28]/20 bg-white/95 px-3 py-2 shadow-lg backdrop-blur sm:bottom-6"
        aria-label="Ouvrir KELIAA"
      >
        {face}
        <span className="max-w-[9rem] text-xs font-semibold text-[#5C1F28] leading-snug">
          Quelqu’un t’attend peut‑être… jette un œil
        </span>
      </Link>
    )
  }

  const body = (
    <>
      {face}
      {copy}
    </>
  )

  const className =
    "flex items-center gap-4 rounded-2xl border border-[#5C1F28]/15 bg-gradient-to-r from-[#5C1F28] to-[#3D1519] p-4 text-[#FBF9F6] shadow-sm"

  if (href) {
    return (
      <Link href={href} className={className}>
        {body}
      </Link>
    )
  }

  return <div className={className}>{body}</div>
}
