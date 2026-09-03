"use client"

import { cn } from "@/utils/cn"

type Props = {
  label: string
  scoreA: number
  scoreB: number
  nameA: string
  nameB: string
  convergence: number
  className?: string
}

function Bar({
  value,
  color,
  name,
}: {
  value: number
  color: string
  name: string
}) {
  const w = Math.max(4, Math.min(100, value))
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-[#7F5557]">{name}</span>
        <span className="font-serif text-xl font-bold text-[#7F5557]">{value}%</span>
      </div>
      <div className="h-3.5 overflow-hidden rounded-full bg-[#7F5557]/08">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${w}%`, background: color }}
        />
      </div>
    </div>
  )
}

/** Barres A/B + convergence — SVG/CSS léger. */
export function CoupleScoreChart({
  label,
  scoreA,
  scoreB,
  nameA,
  nameB,
  convergence,
  className,
}: Props) {
  return (
    <figure
      className={cn(
        "rounded-2xl border border-[#B8954A]/30 bg-gradient-to-br from-[#F2EBE0] to-[#F3EDE4] p-5 sm:p-6",
        className
      )}
    >
      <figcaption className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B8954A]">
            Lecture visuelle
          </p>
          <p className="font-serif text-lg sm:text-xl font-bold text-[#7F5557]">{label}</p>
        </div>
        <p className="text-sm text-[#7F5557]/70">
          Convergence{" "}
          <span className="font-serif text-lg font-bold text-[#7F5557]">
            {convergence}%
          </span>
        </p>
      </figcaption>
      <div className="space-y-4">
        <Bar value={scoreA} name={nameA} color="#7F5557" />
        <Bar value={scoreB} name={nameB} color="#B8954A" />
      </div>
      <svg
        viewBox="0 0 200 28"
        className="mt-5 w-full text-[#7F5557]/15"
        aria-hidden
      >
        <line x1="0" y1="14" x2="200" y2="14" stroke="currentColor" strokeWidth="1" />
        <circle cx={(scoreA / 100) * 200} cy="14" r="5" fill="#7F5557" />
        <circle cx={(scoreB / 100) * 200} cy="14" r="5" fill="#B8954A" />
      </svg>
    </figure>
  )
}
