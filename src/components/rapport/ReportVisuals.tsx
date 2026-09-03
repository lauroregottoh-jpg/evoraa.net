"use client"

import * as React from "react"
import { cn } from "@/utils/cn"

/** Anneau de score animé — indice de préparation / complétude. */
export function ScoreRing({
  value,
  max = 100,
  label,
  size = 132,
  stroke = 9,
  delayMs = 0,
}: {
  value: number
  max?: number
  label: string
  size?: number
  stroke?: number
  delayMs?: number
}) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c

  return (
    <div
      className="rapport-reveal relative inline-flex flex-col items-center"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rapport-ring -rotate-90"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(215,184,102,0.18)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#rapportGoldGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="rapport-ring-progress"
          style={{ ["--ring-offset" as string]: offset }}
        />
        <defs>
          <linearGradient id="rapportGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF72" />
            <stop offset="55%" stopColor="#B8954A" />
            <stop offset="100%" stopColor="#8A6A2E" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="font-serif text-3xl font-bold text-[#7F5557] leading-none">
          {pct}
        </p>
        <p className="text-[9px] font-bold uppercase tracking-wider text-[#B8954A] mt-1">
          / {max}
        </p>
      </div>
      <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A5F28] text-center max-w-[9rem]">
        {label}
      </p>
    </div>
  )
}

/** Barres de forces — graphique horizontal animé. */
export function ForceBars({
  items,
}: {
  items: { label: string; value?: number }[]
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const v =
          typeof item.value === "number"
            ? Math.max(35, Math.min(98, item.value))
            : Math.max(55, 92 - i * 8)
        return (
          <div
            key={item.label}
            className="rapport-reveal space-y-1.5"
            style={{ animationDelay: `${120 + i * 90}ms` }}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-foreground/90 truncate">
                {item.label}
              </p>
              <span className="text-[11px] font-bold text-[#B8954A] tabular-nums shrink-0">
                {v}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-[#B8954A]/12 overflow-hidden border border-[#B8954A]/15">
              <div
                className="rapport-bar-fill h-full rounded-full bg-gradient-to-r from-[#8A6A2E] via-[#B8954A] to-[#D4AF72]"
                style={{
                  width: `${v}%`,
                  animationDelay: `${200 + i * 100}ms`,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** Étoiles de préparation (visuel). */
export function PrepStars({ score }: { score: number }) {
  const filled = Math.max(0, Math.min(10, Math.round(score / 10)))
  return (
    <div
      className="rapport-reveal flex flex-wrap gap-1"
      aria-label={`${filled} sur 10`}
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "rapport-star inline-block text-lg leading-none",
            i < filled ? "text-[#B8954A]" : "text-[#B8954A]/25"
          )}
          style={{ animationDelay: `${i * 60}ms` }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

/** Cadre ornemental coin doré. */
export function OrnamentFrame({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("rapport-frame relative", className)}>
      <span aria-hidden className="rapport-corner rapport-corner-tl" />
      <span aria-hidden className="rapport-corner rapport-corner-tr" />
      <span aria-hidden className="rapport-corner rapport-corner-bl" />
      <span aria-hidden className="rapport-corner rapport-corner-br" />
      {children}
    </div>
  )
}

/** Timeline visuelle 3 mois. */
export function MonthTimeline({
  months,
}: {
  months: { heading: string; body: string }[]
}) {
  return (
    <div className="relative space-y-0 pl-2">
      <div
        aria-hidden
        className="absolute left-[1.15rem] top-3 bottom-3 w-px bg-gradient-to-b from-[#B8954A] via-[#B8954A]/40 to-transparent"
      />
      {months.map((m, i) => (
        <div
          key={m.heading}
          className="rapport-reveal relative flex gap-4 pb-5 last:pb-0"
          style={{ animationDelay: `${i * 120}ms` }}
        >
          <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#B8954A] bg-gradient-to-br from-[#D4AF72] to-[#B8954A] font-serif text-sm font-bold text-[#7F5557] shadow-sm">
            {i + 1}
          </div>
          <div className="min-w-0 pt-1">
            <h3 className="text-sm font-bold text-foreground">{m.heading}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mt-1">
              {m.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

/** Pastilles de progression des chapitres détail. */
export function ChapterProgressDots({
  items,
}: {
  items: { id: string; title: string; unlocked: boolean }[]
}) {
  const done = items.filter((i) => i.unlocked).length
  return (
    <div className="rounded-2xl border border-[#B8954A]/25 bg-gradient-to-br from-[#B8954A]/[0.08] via-white to-[#F2EBE0] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
          Dimensions analysées
        </p>
        <p className="text-xs font-bold text-[#7A5F28]">
          {done}/{items.length}
        </p>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {items.map((item, i) => (
          <div
            key={item.id}
            title={item.title}
            className={cn(
              "rapport-reveal aspect-square rounded-xl border flex items-center justify-center text-[10px] font-bold transition-transform",
              item.unlocked
                ? "border-[#B8954A]/50 bg-[#B8954A]/15 text-[#7A5F28]"
                : "border-dashed border-border/70 bg-white/60 text-muted-foreground/50"
            )}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {item.unlocked ? "✓" : "·"}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {items.map((item) => (
          <span
            key={item.id + "-l"}
            className={cn(
              "text-[10px]",
              item.unlocked ? "text-foreground/80" : "text-muted-foreground/60"
            )}
          >
            {item.unlocked ? "●" : "○"} {item.title}
          </span>
        ))}
      </div>
    </div>
  )
}
