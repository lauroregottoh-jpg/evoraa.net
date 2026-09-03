"use client"

import * as React from "react"
import {
  Heart,
  Home,
  Leaf,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/utils/cn"

const PILLARS: {
  icon: LucideIcon
  title: string
  desc: string
  accent: string
}[] = [
  {
    icon: Heart,
    title: "Compatibilité relationnelle",
    desc: "Communication, émotions, conflits, confiance.",
    accent: "from-[#641F2B] to-[#8B2E3A]",
  },
  {
    icon: Sparkles,
    title: "Compatibilité spirituelle",
    desc: "Parcours de foi, convictions, pratique, vision chrétienne.",
    accent: "from-[#2A1810] to-[#5C3A1A]",
  },
  {
    icon: Home,
    title: "Compatibilité des projets de vie",
    desc: "Mariage, famille, enfants, avenir.",
    accent: "from-[#1C3A2A] to-[#2A5C3A]",
  },
  {
    icon: Leaf,
    title: "Compatibilité des valeurs",
    desc: "Principes, stewardship, priorités de vie.",
    accent: "from-[#3A2A10] to-[#6B4A1A]",
  },
  {
    icon: Users,
    title: "Compatibilité des personnalités",
    desc: "Personnalité, rythme, ouverture, fiabilité.",
    accent: "from-[#1C2840] to-[#2A3A5C]",
  },
]

/** Showcase animé premium — 5 piliers Matching (accueil / marketing). */
export function MatchingPillarsShowcase({
  className,
}: {
  className?: string
}) {
  return (
    <section
      id="matching-piliers"
      className={cn(
        "relative overflow-hidden py-16 sm:py-24 px-6 sm:px-12",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#2B2421] via-[#2A1810] to-[#641F2B]"
      />
      <div
        aria-hidden
        className="rapport-pattern pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
      />

      <div className="relative z-10 mx-auto max-w-6xl space-y-10">
        <div className="text-center space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#E8D49A]">
            Matching KELIAA™
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#FFFDF9] leading-tight drop-shadow-sm">
            Les 5 piliers du Matching KELIAA™
          </h2>
          <p className="text-sm sm:text-base text-[#FFFDF9]/85 max-w-2xl mx-auto leading-relaxed">
            Parce qu&apos;une relation durable ne repose jamais sur un seul
            critère.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon
            return (
              <article
                key={pillar.title}
                className="matching-pillar-card group relative flex flex-col overflow-hidden rounded-2xl border-2 border-[#D7B866]/55 bg-[#FFFDF9] p-5 text-[#2B2421] shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  aria-hidden
                  className={cn(
                    "matching-pillar-banner mb-4 flex h-24 items-center justify-center rounded-xl bg-gradient-to-br",
                    pillar.accent
                  )}
                >
                  <span className="matching-pillar-icon flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#E8D49A]/70 bg-black/25 text-[#E8D49A] shadow-lg">
                    <Icon className="h-7 w-7" strokeWidth={2.25} />
                  </span>
                </div>
                <span className="matching-pillar-num mb-2 inline-flex h-8 w-fit items-center rounded-lg bg-[#D7B866]/20 px-2.5 font-mono text-xs font-bold text-[#641F2B]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-lg font-bold leading-snug text-[#2B2421]">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-xs text-[#2B2421]/70 leading-relaxed grow">
                  {pillar.desc}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
