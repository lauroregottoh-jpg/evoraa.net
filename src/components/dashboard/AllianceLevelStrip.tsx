"use client"

import Link from "next/link"
import { Check, Lock } from "lucide-react"
import { cn } from "@/utils/cn"

const STEPS = [
  { id: "tests", label: "Test premium", href: "/assessments" },
  { id: "rapport", label: "Rapport personnalisé", href: "/rapport/global" },
  { id: "matching", label: "Matching enrichi", href: "/compatibility" },
] as const

/**
 * État sobre du parcours Alliance — accueil.
 */
export function AllianceLevelStrip({
  assessmentsDone = 0,
  isPaid = false,
}: {
  assessmentsDone?: number
  isPaid?: boolean
}) {
  const done = {
    tests: assessmentsDone >= 5,
    rapport: isPaid && assessmentsDone >= 1,
    matching: assessmentsDone >= 5,
  }

  return (
    <section className="rounded-2xl border border-border/60 bg-[#F2EBE0] px-4 py-5 sm:px-6 space-y-4">
      <h2 className="font-serif text-xl font-bold text-foreground">
        Niveau d’Alliance
      </h2>
      <ul className="space-y-2">
        {STEPS.map((step) => {
          const unlocked = done[step.id as keyof typeof done]
          return (
            <li key={step.id}>
              <Link
                href={step.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3 py-3 text-sm transition-colors",
                  unlocked
                    ? "border-[#B8954A]/45 bg-[#B8954A]/10 text-foreground"
                    : "border-border/70 bg-white text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full shrink-0",
                    unlocked
                      ? "bg-[#2D1020] text-[#F2EBE0]"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {unlocked ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Lock className="h-3.5 w-3.5" />
                  )}
                </span>
                <span className="font-medium">{step.label}</span>
                <span className="ml-auto text-[11px] font-semibold uppercase tracking-wide">
                  {unlocked ? "Disponible" : "À débloquer"}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
