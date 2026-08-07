"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight,
  Camera,
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
    desc: "Prénom, foi, vision — posez les bases de votre présence.",
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
    title: "Ajoutez votre photo",
    desc: "Un portrait clair pour être découvert avec confiance.",
    href: "/profile",
    cta: "Ajouter ma photo",
    icon: Camera,
  },
  {
    n: 4,
    title: "Découvrez vos compatibilités",
    desc: "Des profils alignés sur la foi et le projet de mariage.",
    href: "/compatibility",
    cta: "Voir les profils",
    icon: Compass,
  },
  {
    n: 5,
    title: "Échangez avec respect",
    desc: "Des conversations cadrées, orientées discernement.",
    href: "/messages",
    cta: "Messages",
    icon: MessageCircle,
  },
  {
    n: 6,
    title: "Discernez la personne idéale",
    desc: "Prenez le temps. La bonne rencontre se construit.",
    href: "/compatibility",
    cta: "Continuer",
    icon: Heart,
  },
] as const

/**
 * Parcours Découverte animé — marche à suivre jusqu’à la personne idéale.
 */
export function DiscoveryPathVisual({
  firstName,
  assessmentsDone = 0,
  hasAvatar = false,
}: {
  firstName?: string | null
  assessmentsDone?: number
  hasAvatar?: boolean
}) {
  const name = firstName?.trim() || "Membre"
  const activeStep =
    assessmentsDone < 5 ? 2 : !hasAvatar ? 3 : 4

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border-2 border-[#B8954A]/35 bg-gradient-to-br from-[#1C1412] via-[#2A1810] to-[#5C1F28] text-[#F8F4EE] shadow-elevated">
      <div
        aria-hidden
        className="alliance-gold-sweep pointer-events-none absolute inset-0 opacity-45"
      />
      <div
        aria-hidden
        className="rapport-pattern pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
      />

      <div
        aria-hidden
        className="discovery-orb discovery-orb-a pointer-events-none absolute -left-10 top-10 h-40 w-40 rounded-full bg-[#B8954A]/20 blur-3xl"
      />
      <div
        aria-hidden
        className="discovery-orb discovery-orb-b pointer-events-none absolute -right-8 bottom-8 h-48 w-48 rounded-full bg-[#5C1F28]/50 blur-3xl"
      />

      <div className="relative z-10 p-5 sm:p-8 space-y-6">
        <div className="space-y-2 max-w-xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#F3D9A4] inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 discovery-spark" />
            Votre marche à suivre
          </p>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
            {name}, le chemin jusqu’à la bonne rencontre
          </h2>
          <p className="text-sm text-white/75 leading-relaxed">
            Six étapes animées pour passer de Découverte à une relation alignée —
            foi, valeurs et projet de mariage.
          </p>
        </div>

        {/* Grande frise animée — parcours visuel */}
        <div className="relative overflow-hidden rounded-2xl border border-[#B8954A]/30 bg-black/30 px-3 py-6 sm:px-6 sm:py-8">
          <div
            aria-hidden
            className="discovery-horizon-line absolute left-6 right-6 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#B8954A]/70 to-transparent"
          />
          <div className="relative flex items-end justify-between gap-1 sm:gap-2">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              const isActive = step.n === activeStep
              const isGoal = step.n === 6
              return (
                <div
                  key={`map-${step.n}`}
                  className="discovery-map-node flex flex-1 flex-col items-center gap-2 text-center"
                  style={{ animationDelay: `${i * 160}ms` }}
                >
                  <span
                    className={cn(
                      "flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border-2 shadow-lg",
                      isGoal
                        ? "border-[#F3D9A4] bg-gradient-to-br from-[#F3D9A4] to-[#B8954A] text-[#1C1412] discovery-goal-pulse"
                        : isActive
                          ? "border-[#F3D9A4] bg-[#B8954A]/35 text-[#F3D9A4] discovery-step-pulse"
                          : "border-white/25 bg-[#1C1412]/70 text-white/70"
                    )}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </span>
                  <span className="hidden sm:block text-[10px] font-bold uppercase tracking-wide text-[#F3D9A4]/90 leading-tight max-w-[4.5rem]">
                    {isGoal ? "Idéale" : `Étape ${step.n}`}
                  </span>
                  <span className="sm:hidden font-mono text-[10px] font-bold text-[#F3D9A4]">
                    {String(step.n).padStart(2, "0")}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative rounded-2xl border border-white/10 bg-black/25 p-4 sm:p-6 overflow-hidden">
          <div
            aria-hidden
            className="discovery-path-line absolute left-8 sm:left-10 top-10 bottom-10 w-px bg-gradient-to-b from-[#B8954A] via-[#F3D9A4]/50 to-transparent"
          />

          <ol className="relative space-y-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              const isActive = step.n === activeStep
              const isDone =
                (step.n === 2 && assessmentsDone >= 5) ||
                (step.n === 3 && hasAvatar) ||
                (step.n < activeStep && step.n !== 1)
              return (
                <li
                  key={step.n}
                  className={cn(
                    "discovery-step relative flex gap-4 sm:gap-5 rounded-2xl border p-4 transition-all",
                    isActive
                      ? "border-[#B8954A]/60 bg-[#B8954A]/15 shadow-[0_0_30px_rgba(184,149,74,0.2)]"
                      : "border-white/10 bg-white/[0.04]"
                  )}
                  style={{ animationDelay: `${i * 140}ms` }}
                >
                  <div
                    className={cn(
                      "discovery-step-badge relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 font-serif text-lg font-bold",
                      isActive
                        ? "border-[#F3D9A4] bg-gradient-to-br from-[#F3D9A4] to-[#B8954A] text-[#1C1412] discovery-step-pulse"
                        : isDone
                          ? "border-[#B8954A] bg-[#B8954A]/30 text-[#F3D9A4]"
                          : "border-white/25 bg-[#1C1412]/60 text-white/70"
                    )}
                  >
                    {step.n}
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-serif text-lg sm:text-xl font-bold leading-snug">
                          {step.title}
                        </p>
                        <p className="text-sm text-white/65 mt-1 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "discovery-step-icon hidden sm:flex h-11 w-11 items-center justify-center rounded-xl border shrink-0",
                          isActive
                            ? "border-[#B8954A]/50 bg-[#B8954A]/20 text-[#F3D9A4]"
                            : "border-white/15 bg-white/5 text-white/55"
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
                          ? "bg-[#B8954A] text-[#1C1412]"
                          : "border border-white/20 bg-white/5 text-[#F3D9A4] hover:bg-white/10"
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

        <p className="text-center text-xs text-white/50 italic">
          Une étape après l’autre — la bonne personne se découvre dans le bon
          cadre.
        </p>
      </div>
    </section>
  )
}
