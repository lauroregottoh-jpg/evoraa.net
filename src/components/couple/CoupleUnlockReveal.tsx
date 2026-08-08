"use client"

import * as React from "react"
import Link from "next/link"
import {
  ClipboardList,
  HeartHandshake,
  Sparkles,
  Users,
  BookOpen,
} from "lucide-react"
import { COUPLE_BRAND } from "@/lib/couple/config"
import { cn } from "@/utils/cn"

const UNLOCKS = [
  { icon: Users, title: "Invitation partenaire" },
  { icon: ClipboardList, title: "Questionnaires individuels" },
  { icon: BookOpen, title: "Rapport de couple" },
  { icon: Sparkles, title: "Exercices & plan d’action" },
] as const

/**
 * Célébration d’ouverture du bilan Couple — carton + confettis + bienvenue.
 */
export function CoupleUnlockReveal({
  firstName,
  onContinueHref = "/couple/onboarding",
}: {
  firstName?: string | null
  onContinueHref?: string
}) {
  const name = firstName?.trim() || "vous"
  const [phase, setPhase] = React.useState<"closed" | "open" | "burst">(
    "closed"
  )

  React.useEffect(() => {
    const t1 = window.setTimeout(() => setPhase("open"), 700)
    const t2 = window.setTimeout(() => setPhase("burst"), 1600)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <section className="relative overflow-hidden rounded-[1.85rem] border-2 border-[#B8954A]/40 bg-gradient-to-br from-[#5C1F28] via-[#3D1519] to-[#1C1412] text-[#FBF9F6] px-5 py-10 sm:px-8 sm:py-12 shadow-lg">
      {/* Confettis */}
      {phase !== "closed" && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className="alliance-gift-confetti absolute left-1/2 top-[42%] rounded-[2px]"
              style={{
                width: 6 + (i % 3) * 2,
                height: 8 + (i % 4) * 2,
                background: i % 2 === 0 ? "#B8954A" : "#F3D9A4",
                ["--dx" as string]: `${((i % 9) - 4) * 28}px`,
                ["--dy" as string]: `${-40 - (i % 5) * 18}px`,
                animationDelay: `${i * 40}ms`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 text-center space-y-3">
        <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#F3D9A4]">
          <HeartHandshake className="h-3.5 w-3.5" />
          {COUPLE_BRAND}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
          Félicitations{name !== "vous" ? `, ${name}` : ""} !
        </h1>
        <p className="text-base sm:text-lg text-white/80 max-w-md mx-auto leading-relaxed">
          Bienvenue dans {COUPLE_BRAND}. Vous venez de débloquer votre bilan de
          couple — un espace pour comprendre votre dynamique et construire avec
          intention.
        </p>
      </div>

      {/* Carton / dossier */}
      <div className="relative z-10 mx-auto mt-8 flex justify-center">
        <div
          className={cn(
            "relative h-36 w-44 sm:h-40 sm:w-52 transition-transform duration-700",
            phase === "closed" && "scale-95",
            phase !== "closed" && "scale-100"
          )}
        >
          <div className="absolute inset-0 rounded-xl bg-[#F8F4EE] border-2 border-[#B8954A] shadow-xl" />
          <div
            className={cn(
              "absolute inset-x-2 top-2 h-[55%] origin-top rounded-t-lg bg-[#5C1F28] border border-[#B8954A]/50 transition-transform duration-700",
              phase === "closed" ? "rotate-0" : "-rotate-[28deg] -translate-y-1"
            )}
          />
          <div className="absolute inset-x-4 bottom-4 top-[42%] rounded-md bg-white/90 p-2 space-y-1.5">
            <div className="h-1.5 rounded bg-[#5C1F28]/30 w-full" />
            <div className="h-1.5 rounded bg-[#5C1F28]/20 w-4/5" />
            <div className="h-1.5 rounded bg-[#B8954A]/50 w-3/5" />
          </div>
        </div>
      </div>

      <div
        className={cn(
          "relative z-10 mt-8 grid sm:grid-cols-2 gap-2 transition-opacity duration-500",
          phase === "burst" ? "opacity-100" : "opacity-0"
        )}
      >
        {UNLOCKS.map((u) => (
          <div
            key={u.title}
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm"
          >
            <u.icon className="h-4 w-4 text-[#F3D9A4] shrink-0" />
            <span className="font-medium">{u.title}</span>
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href={onContinueHref}
          className="inline-flex h-12 items-center rounded-xl bg-[#B8954A] text-[#1C1412] px-6 text-sm font-bold"
        >
          Commencer l’onboarding
        </Link>
        <Link
          href="/couple/inviter"
          className="inline-flex h-12 items-center rounded-xl border border-white/30 px-6 text-sm font-semibold text-white"
        >
          Inviter mon partenaire
        </Link>
      </div>
    </section>
  )
}
