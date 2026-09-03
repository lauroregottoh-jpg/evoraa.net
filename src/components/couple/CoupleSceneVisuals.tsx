"use client"

import { cn } from "@/utils/cn"

/** Scène animée : verrou → rapport dévoilé → duo qui discute. */
export function VizReportUnlockScene({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-md aspect-[5/4] rounded-2xl border border-[#2D1020]/15 bg-white overflow-hidden shadow-sm",
        className
      )}
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#F2EBE0] to-white" />

      {/* Lock */}
      <div className="couple-scene-lock absolute left-1/2 top-[12%] -translate-x-1/2 z-20 flex flex-col items-center text-primary">
        <svg viewBox="0 0 64 72" className="w-14 h-16 sm:w-16 sm:h-[4.5rem]">
          <path
            className="couple-scene-shackle"
            d="M20 28v-8a12 12 0 0124 0v8"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <rect
            x="14"
            y="28"
            width="36"
            height="30"
            rx="6"
            fill="#2D1020"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="32" cy="42" r="4" fill="#B8954A" />
        </svg>
      </div>

      {/* Report opens */}
      <div className="couple-scene-report absolute left-1/2 top-[38%] -translate-x-1/2 z-10 flex items-end justify-center gap-0">
        <div className="couple-scene-page-l h-28 w-[4.5rem] sm:h-32 sm:w-24 rounded-l-md border-2 border-primary bg-[#F2EBE0] p-2 shadow-md">
          <div className="space-y-1.5 opacity-50">
            <div className="h-1.5 rounded bg-primary/40 w-full" />
            <div className="h-1.5 rounded bg-primary/30 w-[80%]" />
            <div className="h-1.5 rounded bg-primary/25 w-full" />
            <div className="h-1.5 rounded bg-accent/50 w-[60%] mt-3" />
          </div>
        </div>
        <div className="couple-scene-page-r h-28 w-[4.5rem] sm:h-32 sm:w-24 rounded-r-md border-2 border-primary border-l-0 bg-white p-2 shadow-md">
          <div className="space-y-1.5 opacity-50">
            <div className="h-1.5 rounded bg-primary/40 w-full" />
            <div className="h-1.5 rounded bg-primary/30 w-3/4" />
            <div className="h-1.5 rounded bg-primary/25 w-full" />
          </div>
        </div>
      </div>

      {/* Couple discussing */}
      <div className="couple-scene-duo absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-end gap-8 sm:gap-12">
        <div className="relative flex flex-col items-center">
          <div className="couple-scene-bubble absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold text-[#2D1020]">
            Je vois…
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/90 border-2 border-accent" />
          <div className="mt-0.5 h-8 w-14 rounded-t-2xl bg-primary/80" />
        </div>
        <div className="relative flex flex-col items-center">
          <div className="couple-scene-bubble couple-scene-bubble-b absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#F2EBE0] border border-primary/30 px-2.5 py-1 text-[10px] font-bold text-primary">
            Et toi ?
          </div>
          <div className="h-10 w-10 rounded-full bg-accent/90 border-2 border-primary" />
          <div className="mt-0.5 h-8 w-14 rounded-t-2xl bg-accent/80" />
        </div>
      </div>
    </div>
  )
}

/** Différences versus compatibilités — duel animé. */
export function VizDualFinish({ className }: { className?: string }) {
  return (
    <div
      className={cn("relative w-full max-w-md py-2", className)}
      aria-hidden
    >
      <div className="flex items-stretch justify-between gap-3">
        <div className="couple-dual-left flex-1 rounded-xl border-2 border-primary bg-white px-3 py-4 text-center shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-accent mb-1">
            Compatibilités
          </p>
          <p className="font-serif text-base sm:text-lg font-bold text-primary leading-snug">
            Ce qui vous rapproche
          </p>
          <p className="mt-2 text-xs text-[#2D1020]/70 leading-relaxed">
            Convergences, forces, terrains communs
          </p>
        </div>
        <div className="couple-dual-heart shrink-0 self-center flex h-11 w-11 items-center justify-center rounded-full bg-accent text-primary font-bold text-lg">
          vs
        </div>
        <div className="couple-dual-right flex-1 rounded-xl border-2 border-[#2D1020] bg-[#F2EBE0] px-3 py-4 text-center shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
            Différences
          </p>
          <p className="font-serif text-base sm:text-lg font-bold text-primary leading-snug">
            Ce qui vous différencie
          </p>
          <p className="mt-2 text-xs text-[#2D1020]/70 leading-relaxed">
            Écarts, vigilance, sujets à clarifier
          </p>
        </div>
      </div>
      <div className="couple-dual-line mx-auto mt-4 h-0.5 bg-accent" />
      <p className="mt-3 text-center font-serif text-sm sm:text-base italic text-primary">
        Êtes-vous aussi alignés que vous le pensez ?
      </p>
    </div>
  )
}
