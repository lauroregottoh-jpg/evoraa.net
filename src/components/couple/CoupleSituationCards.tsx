"use client"

import * as React from "react"
import { Heart, HeartHandshake, Route, Sparkles } from "lucide-react"
import { cn } from "@/utils/cn"
import {
  LANDING_SITUATIONS,
  type LandingSituationId,
} from "@/lib/couple/landingCopy"

const ICONS = {
  interest: Sparkles,
  path: Route,
  engaged: HeartHandshake,
  married: Heart,
} as const

type Props = {
  selected: LandingSituationId | null
  onSelect: (id: LandingSituationId) => void
}

/** Quatre situations — cartes sélectionnables pour se projeter. */
export function CoupleSituationCards({ selected, onSelect }: Props) {
  return (
    <div className="couple-situations-grid grid sm:grid-cols-2 gap-4 lg:gap-5">
      {LANDING_SITUATIONS.map((s, i) => {
        const Icon = ICONS[s.id]
        const isOn = selected === s.id
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            aria-pressed={isOn}
            className={cn(
              "couple-situation-card group relative text-left overflow-hidden rounded-2xl border-2 p-5 sm:p-6 transition-all duration-500",
              "bg-[#F8F4EE] shadow-card hover:shadow-elevated hover:-translate-y-1",
              isOn
                ? "border-accent scale-[1.02] shadow-elevated"
                : "border-[#B8954A]/35 hover:border-accent/60"
            )}
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <div
              aria-hidden
              className={cn(
                "mb-4 flex h-20 items-center justify-center rounded-xl bg-gradient-to-br transition-transform duration-500 group-hover:scale-[1.03]",
                s.accent
              )}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#F3D9A4]/70 bg-black/25 text-[#F3D9A4] shadow-lg">
                <Icon className="h-6 w-6" strokeWidth={2.25} />
              </span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5C1F28]/70">
              {s.label}
            </p>
            <h3 className="mt-1.5 font-serif text-lg sm:text-xl font-bold text-[#2B2421] leading-snug">
              {s.title}
            </h3>
            <p className="mt-2 text-sm text-[#2B2421]/70 leading-relaxed">
              {s.body}
            </p>
            <span
              className={cn(
                "mt-4 inline-flex text-xs font-semibold transition-colors",
                isOn ? "text-accent" : "text-[#2B2421]/45 group-hover:text-primary"
              )}
            >
              {isOn ? "C’est votre situation ✓" : "C’est mon cas →"}
            </span>
          </button>
        )
      })}
    </div>
  )
}
