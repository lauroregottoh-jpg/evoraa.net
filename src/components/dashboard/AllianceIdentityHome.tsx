"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  BadgeCheck,
  ClipboardList,
  Crown,
  Gift,
  Headphones,
  Library,
  Route,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/utils/cn"
import { AmbientSnowOrbs } from "@/components/home/AmbientSnowOrbs"

const REVEAL_ITEMS = [
  {
    icon: ClipboardList,
    title: "Rapport Personnalisé",
    href: "/rapport/global",
  },
  {
    icon: Sparkles,
    title: "Tests débloqués",
    href: "/assessments",
  },
  {
    icon: Library,
    title: "Coffre Premium",
    href: "/coffre-premium",
  },
  {
    icon: Headphones,
    title: "Support humain",
    href: "/coaching",
  },
  {
    icon: Route,
    title: "Parcours guidé",
    href: "/alliance/parcours",
  },
] as const

const UNLOCKED = [
  {
    icon: ClipboardList,
    title: "Rapport Personnalisé complet",
    body: "Bilan relationnel enrichi — chapitres qui s’ouvrent au fil des tests.",
    href: "/rapport/global",
  },
  {
    icon: Sparkles,
    title: "Tests supplémentaires Alliance",
    body: "Matériel enrichi : évaluations du Rapport visibles et débloquées.",
    href: "/assessments",
  },
  {
    icon: Library,
    title: "Coffre Premium",
    body: "Guides et ressources exclusives pour préparer votre mariage.",
    href: "/coffre-premium",
  },
  {
    icon: Route,
    title: "Parcours Alliance guidé",
    body: "Missions, niveaux et prochaine étape claire — vous n’êtes jamais perdu.",
    href: "/alliance/parcours",
  },
] as const

function defaultAvatar(gender: "M" | "F" | null) {
  if (gender === "M") return "/avatars/avatar-man-default.png"
  return "/avatars/avatar-woman-default.png"
}

/** Accueil Alliance : coffret géant → carte or → espace enrichi. */
export function AllianceIdentityHome({
  firstName,
  lastName,
  avatarUrl,
  gender,
  memberSinceLabel,
  isVerified,
  assessmentsDone,
}: {
  firstName: string
  lastName?: string
  avatarUrl: string | null
  gender: "M" | "F" | null
  memberSinceLabel: string
  isVerified: boolean
  assessmentsDone: number
}) {
  const name = firstName.trim() || "Membre"
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim() || name
  const photo = avatarUrl || defaultAvatar(gender)
  const nextHref =
    assessmentsDone < 5 ? "/assessments" : "/alliance/parcours"
  const nextLabel =
    assessmentsDone < 5
      ? "Compléter mes tests (Matching + Alliance)"
      : "Continuer mon parcours Alliance"

  const [phase, setPhase] = React.useState<"idle" | "open" | "reveal">("idle")
  const [cycle, setCycle] = React.useState(0)

  React.useEffect(() => {
    let cancelled = false
    const run = () => {
      if (cancelled) return
      setPhase("idle")
      window.setTimeout(() => {
        if (cancelled) return
        setPhase("open")
        window.setTimeout(() => {
          if (cancelled) return
          setPhase("reveal")
          window.setTimeout(() => {
            if (cancelled) return
            setCycle((c) => c + 1)
          }, 4200)
        }, 900)
      }, 800)
    }
    run()
    return () => {
      cancelled = true
    }
  }, [cycle])

  return (
    <div className="relative space-y-5">
      <AmbientSnowOrbs density="soft" className="opacity-55 z-0" />

      {/* Coffret géant — animation récurrente */}
      <section className="relative z-10 overflow-hidden rounded-[1.75rem] border-2 border-[#B8954A]/50 bg-gradient-to-br from-[#1C1412] via-[#2A1810] to-[#5C1F28] p-6 sm:p-8 text-[#F8F4EE] shadow-elevated">
        <div
          aria-hidden
          className="alliance-gold-sweep pointer-events-none absolute inset-0 opacity-45"
        />
        <p className="relative z-10 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-[#F3D9A4]">
          Bienvenue Alliance · Votre coffret
        </p>
        <h2 className="relative z-10 mt-2 text-center font-serif text-2xl sm:text-3xl font-bold">
          {name}, voici ce que vous avez débloqué
        </h2>

        <div className="relative z-10 mt-6 flex flex-col items-center">
          <div
            className={cn(
              "relative flex h-28 w-28 sm:h-36 sm:w-36 items-end justify-center transition-transform duration-700",
              phase === "open" && "scale-110",
              phase === "reveal" && "scale-105"
            )}
          >
            {/* Lid */}
            <div
              className={cn(
                "absolute left-1/2 top-0 z-20 h-10 w-[88%] -translate-x-1/2 rounded-t-2xl border-2 border-[#F3D9A4]/60 bg-gradient-to-b from-[#D4AF37] to-[#B8954A] shadow-lg origin-bottom transition-transform duration-700",
                phase !== "idle" && "-translate-y-8 -rotate-12"
              )}
            >
              <div className="absolute left-1/2 top-1/2 h-3 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F8F4EE]/35" />
            </div>
            {/* Box body */}
            <div className="relative z-10 flex h-20 w-[88%] sm:h-24 items-center justify-center rounded-b-2xl border-2 border-[#B8954A]/70 bg-gradient-to-b from-[#B8954A] to-[#8A6B2E] shadow-[0_16px_40px_-12px_rgba(184,149,74,0.7)]">
              <Gift
                className={cn(
                  "h-10 w-10 text-[#1C1412] transition-opacity duration-500",
                  phase === "reveal" && "opacity-40"
                )}
              />
            </div>
            {/* Glow */}
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-0 rounded-full bg-[#F3D9A4]/25 blur-2xl transition-opacity duration-700",
                phase === "idle" ? "opacity-20" : "opacity-70"
              )}
            />
          </div>

          <ul
            className={cn(
              "mt-6 grid w-full max-w-lg grid-cols-2 sm:grid-cols-3 gap-2.5 transition-all duration-700",
              phase === "reveal"
                ? "opacity-100 translate-y-0"
                : "opacity-40 translate-y-3"
            )}
          >
            {REVEAL_ITEMS.map((item, i) => {
              const Icon = item.icon
              return (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border border-[#B8954A]/35 bg-white/10 px-2 py-3 text-center backdrop-blur-sm hover:bg-white/15 transition-all",
                      phase === "reveal" && "alliance-gift-reveal"
                    )}
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#B8954A]/25 text-[#F3D9A4]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-[11px] font-semibold leading-tight text-[#F8F4EE]">
                      {item.title}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* Carte membre */}
      <section className="relative z-10 overflow-hidden rounded-[1.6rem] border-2 border-[#B8954A]/55 bg-gradient-to-br from-[#1C1412] via-[#2A1A12] to-[#3D2418] text-[#F8F4EE] p-5 sm:p-7 shadow-elevated">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full bg-[#B8954A]/30 blur-3xl"
        />
        <div
          aria-hidden
          className="alliance-gold-sweep pointer-events-none absolute inset-0 opacity-55"
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative mx-auto sm:mx-0 shrink-0">
            <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl overflow-hidden border-2 border-[#B8954A]/70 shadow-[0_12px_40px_-12px_rgba(184,149,74,0.65)] ring-2 ring-[#F3D9A4]/25">
              <Image
                src={photo}
                alt={`Portrait de ${fullName}`}
                width={128}
                height={128}
                className="h-full w-full object-cover"
                unoptimized={!avatarUrl}
                priority
              />
            </div>
            <span className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl border border-[#B8954A]/50 bg-[#B8954A] text-[#1C1412]">
              <Crown className="h-4 w-4" />
            </span>
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F3D9A4]">
              Carte membre Alliance
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Bienvenue, {name} ✨
            </h1>
            <p className="text-sm text-[#F3D9A4]/90 font-medium">
              Félicitations — Alliance était le bon choix.
            </p>
            <p className="text-sm text-white/65">{fullName}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
              <span className="inline-flex items-center gap-1 rounded-full border border-[#B8954A]/45 bg-[#B8954A]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#F3D9A4]">
                <BadgeCheck className="h-3.5 w-3.5" />
                Membre Premium
              </span>
              <span className="rounded-full border border-[#B8954A]/25 bg-white/5 px-3 py-1 text-[10px] font-semibold text-[#F3D9A4]/85">
                Depuis {memberSinceLabel}
              </span>
              {isVerified ? (
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-[10px] font-semibold text-emerald-200">
                  Profil vérifié
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 rounded-[1.5rem] border-2 border-[#B8954A]/45 bg-gradient-to-br from-[#B8954A]/18 via-white to-primary/[0.04] p-5 sm:p-7 space-y-4 shadow-elevated">
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-widest text-accent">
            Espace enrichi débloqué
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
            Vous avez débloqué un espace enrichi
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Bravo. Vous disposez désormais de tests supplémentaires, d’un bilan
            relationnel complet, du Coffre Premium, d’un parcours guidé et d’un
            accès au support humain — étape par étape.
          </p>
        </div>

        <ul className="grid sm:grid-cols-2 gap-3">
          {UNLOCKED.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className="flex gap-3 rounded-xl border border-[#B8954A]/30 bg-white p-4 hover:border-[#B8954A]/55 transition-colors h-full shadow-sm"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#B8954A]/15 text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold">{item.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                      {item.body}
                    </p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="rounded-xl border border-[#B8954A]/35 bg-[#B8954A]/12 p-4 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
            Prochaine étape
          </p>
          <p className="text-sm font-semibold">
            {assessmentsDone < 5
              ? "Complétez vos tests Matching, puis explorez les 10 clés Alliance."
              : "Suivez votre parcours : missions, rapport global et Coffre Premium."}
          </p>
          <Link
            href={nextHref}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#B8954A] px-5 text-sm font-bold text-[#1C1412]"
          >
            {nextLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
