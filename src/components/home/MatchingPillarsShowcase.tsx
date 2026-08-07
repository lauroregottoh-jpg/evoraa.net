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
}[] = [
  {
    icon: Heart,
    title: "Compatibilité relationnelle",
    desc: "Communication, émotions, conflits, confiance.",
  },
  {
    icon: Sparkles,
    title: "Compatibilité spirituelle",
    desc: "Parcours de foi, convictions, pratique, vision chrétienne.",
  },
  {
    icon: Home,
    title: "Compatibilité des projets de vie",
    desc: "Mariage, famille, enfants, avenir.",
  },
  {
    icon: Leaf,
    title: "Compatibilité des valeurs",
    desc: "Principes, stewardship, priorités de vie.",
  },
  {
    icon: Users,
    title: "Compatibilité des personnalités",
    desc: "Personnalité, rythme, ouverture, fiabilité.",
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
      className={cn(
        "relative overflow-hidden py-20 px-6 sm:px-12",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1C1412] via-[#2A1810] to-[#5C1F28]"
      />
      <div
        aria-hidden
        className="rapport-pattern pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
      />
      <div
        aria-hidden
        className="alliance-gold-sweep pointer-events-none absolute inset-0 opacity-40"
      />

      <div className="relative z-10 mx-auto max-w-6xl space-y-10">
        <div className="text-center space-y-3 matching-pillars-title">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#F3D9A4]">
            Matching KELIAA™
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F8F4EE] leading-tight">
            Les 5 piliers du Matching KELIAA™
          </h2>
          <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
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
                className="matching-pillar-card group relative overflow-hidden rounded-2xl border border-[#B8954A]/40 bg-white/[0.07] backdrop-blur-sm p-5 text-[#F8F4EE] shadow-elevated"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#B8954A]/15 blur-2xl transition group-hover:bg-[#B8954A]/25"
                />
                <div className="relative space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="matching-pillar-num inline-flex h-9 min-w-9 items-center justify-center rounded-xl border border-[#B8954A]/50 bg-[#B8954A]/20 px-2 font-mono text-xs font-bold text-[#F3D9A4]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="matching-pillar-icon flex h-10 w-10 items-center justify-center rounded-full border border-[#B8954A]/35 bg-[#1C1412]/40 text-[#F3D9A4]">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
