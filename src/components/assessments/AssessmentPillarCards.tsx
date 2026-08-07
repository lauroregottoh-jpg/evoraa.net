"use client"

import * as React from "react"
import Link from "next/link"
import {
  CheckCircle2,
  Circle,
  Compass,
  HeartHandshake,
  Lock,
  MessageCircleHeart,
  Scale,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/utils/cn"
import type { AssessmentSlug } from "@/lib/assessments/questionBank"

export type AssessmentProgressItem = {
  slug: AssessmentSlug | string
  name: string
  description: string
  questionCount: number
  score: number | null
  completed: boolean
  canStart: boolean
  canRetake: boolean
  lockMessage?: string | null
}

const PILLAR_META: Record<
  string,
  {
    short: string
    accent: string
    glow: string
    icon: React.ComponentType<{ className?: string }>
  }
> = {
  personality: {
    short: "Humaine",
    accent: "from-[#5C1F28]/[0.14] via-white to-[#D4AF37]/[0.08]",
    glow: "group-hover:shadow-[0_18px_40px_-18px_rgba(92,31,40,0.45)]",
    icon: HeartHandshake,
  },
  spiritual: {
    short: "Spirituelle",
    accent: "from-[#D4AF37]/[0.16] via-white to-[#5C1F28]/[0.06]",
    glow: "group-hover:shadow-[0_18px_40px_-18px_rgba(212,175,55,0.4)]",
    icon: Sparkles,
  },
  relationship: {
    short: "Relationnelle",
    accent: "from-[#722F37]/[0.12] via-white to-[#FDFBF7]",
    glow: "group-hover:shadow-[0_18px_40px_-18px_rgba(114,47,55,0.4)]",
    icon: MessageCircleHeart,
  },
  couple_life: {
    short: "Projets de vie",
    accent: "from-[#2F4A3C]/[0.1] via-white to-[#D4AF37]/[0.08]",
    glow: "group-hover:shadow-[0_18px_40px_-18px_rgba(47,74,60,0.35)]",
    icon: Compass,
  },
  finances: {
    short: "Valeurs",
    accent: "from-[#4A3B2F]/[0.1] via-white to-[#5C1F28]/[0.08]",
    glow: "group-hover:shadow-[0_18px_40px_-18px_rgba(74,59,47,0.35)]",
    icon: Scale,
  },
}

export function AssessmentPillarCards({
  items,
}: {
  items: readonly AssessmentProgressItem[]
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item, index) => {
        const meta = PILLAR_META[item.slug] ?? PILLAR_META.personality
        const Icon = meta.icon
        const locked = item.completed && !item.canRetake
        const delay = `${index * 70}ms`

        return (
          <article
            key={item.slug}
            className={cn(
              "group relative overflow-hidden rounded-[1.35rem] border border-border/70 bg-gradient-to-br p-5 sm:p-6",
              "transition-all duration-500 ease-out hover:-translate-y-1.5",
              meta.accent,
              meta.glow,
              "assessment-pillar-card"
            )}
            style={{ animationDelay: delay }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/50 blur-2xl transition-transform duration-700 group-hover:scale-125"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-10 left-8 h-24 w-24 rounded-full bg-accent/15 blur-2xl transition-opacity duration-700 opacity-60 group-hover:opacity-100"
            />

            <div className="relative z-10 flex flex-col gap-4 h-full">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-white/90 text-primary shadow-sm transition-transform duration-500 group-hover:rotate-3 group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">
                      Pilier {index + 1} · {meta.short}
                    </p>
                    <h2 className="font-serif text-xl font-bold leading-tight text-foreground">
                      {item.name}
                    </h2>
                  </div>
                </div>
                <span className="shrink-0">
                  {item.completed ? (
                    locked ? (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    )
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground/70" />
                  )}
                </span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {item.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <p className="text-xs text-muted-foreground">
                  {item.questionCount} scénarios
                  {item.score != null ? ` · Profil ${item.score}%` : ""}
                </p>
                {item.canStart ? (
                  <Link
                    href={`/assessments/${item.slug}`}
                    className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 group-hover:gap-2.5"
                  >
                    {item.completed ? "Mettre à jour" : "Commencer"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <span className="inline-flex h-10 items-center rounded-xl border border-border bg-white/70 px-4 text-sm text-muted-foreground">
                    Validé
                  </span>
                )}
              </div>
              {item.lockMessage ? (
                <p className="text-xs text-accent/90">{item.lockMessage}</p>
              ) : null}
            </div>
          </article>
        )
      })}
    </div>
  )
}
