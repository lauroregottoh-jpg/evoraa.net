"use client"

import Link from "next/link"
import { Check, Lock } from "lucide-react"
import { cn } from "@/utils/cn"

const STEPS = [
  { id: "tests", label: "Tests premium", href: "/assessments" },
  { id: "rapport", label: "Rapport personnalisé", href: "/rapport/global" },
  { id: "matching", label: "Matching enrichi", href: "/compatibility" },
] as const

/**
 * Strip parcours Alliance — style Farata.
 * Fond ivoire, items blancs avec accents or/bordeaux.
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
    <section
      className="rounded-2xl px-5 py-5 sm:px-6 space-y-3"
      style={{ background: "#F2EBE0", border: "1px solid rgba(184,149,74,0.25)" }}
    >
      {/* En-tête */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-serif text-lg font-bold" style={{ color: "#A07070" }}>
          Votre parcours Alliance
        </h2>
        <div className="h-px flex-1 mx-3 rounded-full" style={{ background: "#B8954A", opacity: 0.35 }} />
        <span
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "#B8954A" }}
        >
          {Object.values(done).filter(Boolean).length} / {STEPS.length}
        </span>
      </div>

      <ul className="space-y-2">
        {STEPS.map((step) => {
          const unlocked = done[step.id as keyof typeof done]
          return (
            <li key={step.id}>
              <Link
                href={step.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors",
                  unlocked
                    ? "bg-white hover:bg-white/80"
                    : "bg-white/60 hover:bg-white/80"
                )}
                style={{
                  border: unlocked
                    ? "1px solid rgba(184,149,74,0.55)"
                    : "1px solid rgba(201,187,175,0.6)",
                }}
              >
                {/* Icône étape */}
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full shrink-0"
                  style={{
                    background: unlocked ? "#A07070" : "#DDD0C4",
                    color: unlocked ? "#F2EBE0" : "#7A4F55",
                  }}
                >
                  {unlocked ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Lock className="h-3.5 w-3.5" />
                  )}
                </span>

                <span
                  className="font-semibold"
                  style={{ color: unlocked ? "#A07070" : "#7A4F55" }}
                >
                  {step.label}
                </span>

                <span
                  className="ml-auto text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: unlocked ? "#B8954A" : "#C9BBAF" }}
                >
                  {unlocked ? "Disponible ✓" : "À débloquer"}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
