"use client"

import * as React from "react"
import { Sparkles, Heart } from "lucide-react"

/**
 * Accueil — Bienvenue très animée (zoom-in).
 */
export function DiscoveryWelcomeHero({
  firstName,
  variant = "discovery",
}: {
  firstName?: string | null
  variant?: "discovery" | "alliance"
}) {
  const name = firstName?.trim() || null

  return (
    <section className="discovery-welcome relative overflow-hidden rounded-[1.75rem] border border-[#B8954A]/30 bg-gradient-to-br from-[#FFFBF5] via-[#F8F4EE] to-[#F3E8D0] px-5 py-10 sm:px-8 sm:py-12 shadow-card">
      <div
        aria-hidden
        className="discovery-welcome-glow pointer-events-none absolute -right-8 -top-8 h-44 w-44 rounded-full bg-[#B8954A]/25 blur-3xl"
      />
      <div
        aria-hidden
        className="discovery-welcome-glow-b pointer-events-none absolute -left-6 bottom-0 h-36 w-36 rounded-full bg-[#5C1F28]/12 blur-3xl"
      />
      <div
        aria-hidden
        className="discovery-welcome-ring pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#B8954A]/20"
      />
      <div
        aria-hidden
        className="discovery-welcome-ring-b pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#B8954A]/10"
      />

      <div className="relative z-10 text-center space-y-4">
        <p className="discovery-welcome-eyebrow inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.28em] text-[#8B6914]">
          <Sparkles className="h-3.5 w-3.5 discovery-spark text-[#B8954A]" />
          {variant === "alliance" ? "Espace Alliance" : "Espace Découverte"}
        </p>

        <h1 className="discovery-welcome-title discovery-welcome-zoom font-serif text-4xl sm:text-6xl font-bold text-[#1C1412] leading-tight">
          Bienvenue
          {name ? (
            <>
              <span className="text-[#B8954A]">,</span>{" "}
              <span className="discovery-welcome-name text-[#5C1F28]">{name}</span>
            </>
          ) : (
            <span className="text-[#B8954A]"> !</span>
          )}
        </h1>

        <p className="discovery-welcome-sub mx-auto max-w-md text-sm sm:text-base text-[#1C1412]/70 leading-relaxed">
          {variant === "alliance"
            ? "Votre parcours Alliance commence ici — foi, discernement et Matching enrichi."
            : "Nous sommes heureux de vous accompagner vers une rencontre alignée — foi, valeurs et projet de mariage."}
        </p>

        <div
          aria-hidden
          className="discovery-welcome-hearts flex items-center justify-center gap-3 pt-1"
        >
          <Heart className="h-4 w-4 text-[#B8954A]/50 fill-[#B8954A]/20" />
          <Heart className="h-6 w-6 text-[#5C1F28]/45 fill-[#5C1F28]/15" />
          <Heart className="h-4 w-4 text-[#B8954A]/50 fill-[#B8954A]/20" />
        </div>
      </div>
    </section>
  )
}
