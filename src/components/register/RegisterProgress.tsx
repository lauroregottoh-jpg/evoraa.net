"use client"

import { cn } from "@/utils/cn"

const STEPS = ["Bienvenue", "Compte"] as const

export function RegisterProgress({
  step,
  className,
}: {
  step: 0 | 1
  className?: string
}) {
  return (
    <nav
      aria-label="Progression de l’inscription"
      className={cn("flex items-center justify-center gap-2 sm:gap-3", className)}
    >
      {STEPS.map((label, i) => {
        const active = i === step
        const done = i < step
        return (
          <div key={label} className="flex items-center gap-2 sm:gap-3">
            {i > 0 ? (
              <div
                className={cn(
                  "h-px w-6 sm:w-10 transition-colors duration-500",
                  done || active ? "bg-accent" : "bg-white/30"
                )}
              />
            ) : null}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-500",
                  done && "bg-accent text-accent-foreground",
                  active &&
                    !done &&
                    "bg-white text-primary shadow-md scale-110",
                  !active &&
                    !done &&
                    "bg-white/15 text-white/80 border border-white/30"
                )}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className={cn(
                  "hidden sm:block text-[11px] tracking-wide uppercase font-medium transition-colors",
                  active ? "text-white" : "text-white/60"
                )}
              >
                {label}
              </span>
            </div>
          </div>
        )
      })}
    </nav>
  )
}
