"use client"

import * as React from "react"
import { GraduationCap } from "lucide-react"
import { cn } from "@/utils/cn"

/** Hero titre Académie — présence animée, brand first. */
export function AcademyHeroTitle({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] border border-primary/20",
        "bg-gradient-to-br from-[#A07070] via-[#722F37] to-[#8B5C62]",
        "px-6 py-10 sm:px-10 sm:py-12 text-center shadow-elevated",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(212,175,55,0.28), transparent 42%), radial-gradient(circle at 80% 80%, rgba(253,251,247,0.12), transparent 45%)",
        }}
      />
      <span
        aria-hidden
        className="academy-hero-orb absolute -left-6 top-8 h-24 w-24 rounded-full bg-[#D4AF37]/25 blur-2xl"
      />
      <span
        aria-hidden
        className="academy-hero-orb-delay absolute -right-4 bottom-4 h-28 w-28 rounded-full bg-white/10 blur-2xl"
      />

      <div className="relative z-10 space-y-4">
        <div className="academy-hero-badge mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF72]">
          <GraduationCap className="h-3.5 w-3.5" />
          Formation KELIAA
        </div>

        <h1 className="academy-hero-title font-serif text-4xl sm:text-5xl md:text-[3.25rem] font-bold leading-[1.1] text-[#F2EBE0]">
          <span className="block academy-hero-line">Académie</span>
          <span className="block academy-hero-line academy-hero-line-2 mt-1 bg-gradient-to-r from-[#D4AF72] via-[#D4AF37] to-[#D4AF72] bg-clip-text text-transparent">
            du mariage
          </span>
        </h1>

        <p className="academy-hero-sub mx-auto max-w-xl text-sm sm:text-base text-white/80 leading-relaxed">
          Huit modules pour vous préparer — foi, dialogue, foyer, valeurs.
          Lisez à votre rythme : d’abord se former, ensuite construire.
        </p>
      </div>
    </header>
  )
}
