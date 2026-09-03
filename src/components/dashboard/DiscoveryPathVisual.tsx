"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight,
  ClipboardList,
  Compass,
  Heart,
  MessageCircle,
  Sparkles,
  UserRound,
} from "lucide-react"
import { cn } from "@/utils/cn"

const STEPS = [
  {
    n: 1,
    title: "Complétez votre profil",
    desc: "Foi, valeurs et vision du mariage — posez les bases.",
    href: "/profile",
    cta: "Mon profil",
    icon: UserRound,
  },
  {
    n: 2,
    title: "Passez les 5 tests",
    desc: "Les 5 compatibilités Matching pour affiner votre lecture.",
    href: "/assessments",
    cta: "Mes tests",
    icon: ClipboardList,
  },
  {
    n: 3,
    title: "Découvrez vos compatibilités",
    desc: "Des profils alignés sur la foi et le projet de mariage.",
    href: "/compatibility",
    cta: "Voir les profils",
    icon: Compass,
  },
  {
    n: 4,
    title: "Échangez avec respect",
    desc: "Des conversations cadrées, orientées discernement.",
    href: "/messages",
    cta: "Messages",
    icon: MessageCircle,
  },
  {
    n: 5,
    title: "Discernez la personne idéale",
    desc: "Prenez le temps. La bonne rencontre se construit.",
    href: "/compatibility",
    cta: "Continuer",
    icon: Heart,
  },
] as const

/**
 * Parcours Découverte clair — marche à suivre (sans nag photo).
 */
export function DiscoveryPathVisual({
  assessmentsDone = 0,
}: {
  firstName?: string | null
  assessmentsDone?: number
  hasAvatar?: boolean
}) {
  const activeStep = assessmentsDone < 5 ? 2 : 3

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-[#B8954A]/35 bg-gradient-to-br from-[#FFFBF5] via-[#F2EBE0] to-[#F0E6D4] text-[#2D1020] shadow-card">
      <div
        aria-hidden
        className="discovery-orb discovery-orb-a pointer-events-none absolute -left-10 top-6 h-36 w-36 rounded-full bg-[#B8954A]/15 blur-3xl"
      />
      <div
        aria-hidden
        className="discovery-orb discovery-orb-b pointer-events-none absolute -right-8 bottom-4 h-40 w-40 rounded-full bg-[#2D1020]/08 blur-3xl"
      />

      <div className="relative z-10 p-5 sm:p-8 space-y-6">
        <div className="space-y-2 max-w-xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7A5F28] inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 discovery-spark text-[#B8954A]" />
            Votre marche à suivre
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight text-[#2D1020]">
            Le chemin jusqu’à la bonne rencontre
          </h2>
          <p className="text-sm text-[#2D1020]/65 leading-relaxed">
            Cinq étapes claires pour passer de Découverte à une relation alignée.
          </p>
        </div>

        {/* Frise claire */}
        <div className="relative overflow-hidden rounded-2xl border border-[#B8954A]/25 bg-white/70 px-3 py-6 sm:px-6 sm:py-8 shadow-sm">
          <div
            aria-hidden
            className="discovery-horizon-line absolute left-6 right-6 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#B8954A]/55 to-transparent"
          />
          <div className="relative flex items-end justify-between gap-1 sm:gap-2">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              const isActive = step.n === activeStep
              const isGoal = step.n === 5
              return (
                <div
                  key={`map-${step.n}`}
                  className="discovery-map-node flex flex-1 flex-col items-center gap-2 text-center"
                  style={{ animationDelay: `${i * 140}ms` }}
                >
                  <span
                    className={cn(
                      "flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border-2 shadow-md",
                      isGoal
                        ? "border-[#B8954A] bg-gradient-to-br from-[#D4AF72] to-[#B8954A] text-[#2D1020] discovery-goal-pulse"
                        : isActive
                          ? "border-[#B8954A] bg-[#B8954A]/20 text-[#2D1020] discovery-step-pulse"
                          : "border-[#B8954A]/30 bg-white text-[#7A5F28]"
                    )}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </span>
                  <span className="hidden sm:block text-[10px] font-bold uppercase tracking-wide text-[#7A5F28] leading-tight max-w-[4.5rem]">
                    {isGoal ? "Idéale" : `Étape ${step.n}`}
                  </span>
                  <span className="sm:hidden font-mono text-[10px] font-bold text-[#7A5F28]">
                    {String(step.n).padStart(2, "0")}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative rounded-2xl border border-[#B8954A]/20 bg-white/60 p-4 sm:p-6 overflow-hidden">
          <div
            aria-hidden
            className="discovery-path-line absolute left-8 sm:left-10 top-10 bottom-10 w-px bg-gradient-to-b from-[#B8954A] via-[#B8954A]/35 to-transparent"
          />

          <ol className="relative space-y-3">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              const isActive = step.n === activeStep
              const isDone =
                (step.n === 2 && assessmentsDone >= 5) ||
                (step.n === 1 && assessmentsDone > 0) ||
                (step.n < activeStep && step.n !== 1)
              return (
                <li
                  key={step.n}
                  className={cn(
                    "discovery-step relative flex gap-4 sm:gap-5 rounded-2xl border p-4 transition-all",
                    isActive
                      ? "border-[#B8954A]/50 bg-[#F7F0E0] shadow-sm"
                      : "border-[#B8954A]/15 bg-white/80"
                  )}
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <div
                    className={cn(
                      "discovery-step-badge relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 font-serif text-base font-bold",
                      isActive
                        ? "border-[#B8954A] bg-gradient-to-br from-[#D4AF72] to-[#B8954A] text-[#2D1020] discovery-step-pulse"
                        : isDone
                          ? "border-[#B8954A]/60 bg-[#B8954A]/15 text-[#2D1020]"
                          : "border-[#B8954A]/25 bg-white text-[#7A5F28]"
                    )}
                  >
                    {step.n}
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-serif text-lg font-bold leading-snug text-[#2D1020]">
                          {step.title}
                        </p>
                        <p className="text-sm text-[#2D1020]/60 mt-1 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "discovery-step-icon hidden sm:flex h-10 w-10 items-center justify-center rounded-xl border shrink-0",
                          isActive
                            ? "border-[#B8954A]/40 bg-[#B8954A]/15 text-[#2D1020]"
                            : "border-[#B8954A]/20 bg-white text-[#7A5F28]/80"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                    </div>
                    <Link
                      href={step.href}
                      className={cn(
                        "inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition",
                        isActive
                          ? "bg-[#2D1020] text-[#F2EBE0] hover:bg-[#2D1020]/90"
                          : "border border-[#B8954A]/35 bg-white text-[#2D1020] hover:bg-[#F7F0E0]"
                      )}
                    >
                      {step.cta}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        <p className="text-center text-xs text-[#2D1020]/45 italic">
          Une étape après l’autre — la bonne personne se découvre dans le bon
          cadre.
        </p>
      </div>
    </section>
  )
}
