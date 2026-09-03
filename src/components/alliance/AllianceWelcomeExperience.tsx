"use client"

import * as React from "react"
import Link from "next/link"
import { Check, Crown, RefreshCw, Sparkles, UserRound } from "lucide-react"
import {
  ALLIANCE_FIRST_MISSIONS,
  ALLIANCE_PRIVILEGES,
  ALLIANCE_RENEWAL_HIGHLIGHTS,
  ALLIANCE_RENEWAL_KEY,
  ALLIANCE_WELCOME_KEY,
  type AllianceCinemaMode,
  type AllianceMissionFlags,
} from "@/lib/alliance/journey"
import { cn } from "@/utils/cn"
import { LoyaltyRewardReveal } from "@/components/loyalty/LoyaltyProgramCard"

type Phase = "cinema" | "privileges" | "mission"

export type ProfileGapSuggestion = {
  id: string
  label: string
  href: string
}

export function AllianceWelcomeExperience({
  firstName,
  missions,
  mode = "welcome",
  profileGaps = [],
  loyaltyReward = null,
}: {
  firstName: string
  missions: AllianceMissionFlags
  mode?: AllianceCinemaMode
  /** Infos manquantes seulement — jamais re-demander ce qui est déjà rempli. */
  profileGaps?: ProfileGapSuggestion[]
  loyaltyReward?: {
    bonusMessages: number
    boosts: number
    vip?: boolean
  } | null
}) {
  const isRenewal = mode === "renewal"
  const [phase, setPhase] = React.useState<Phase>("cinema")
  const [line, setLine] = React.useState(0)
  const [privIndex, setPrivIndex] = React.useState(-1)
  const [showLoyalty, setShowLoyalty] = React.useState(
    () => Boolean(loyaltyReward && loyaltyReward.bonusMessages > 0)
  )

  const highlights = isRenewal ? ALLIANCE_RENEWAL_HIGHLIGHTS : ALLIANCE_PRIVILEGES

  React.useEffect(() => {
    try {
      if (isRenewal) {
        localStorage.setItem(ALLIANCE_RENEWAL_KEY, String(Date.now()))
      } else {
        localStorage.setItem(ALLIANCE_WELCOME_KEY, "1")
      }
    } catch {
      /* ignore */
    }
  }, [isRenewal])

  React.useEffect(() => {
    if (phase !== "cinema") return
    const timers = [
      window.setTimeout(() => setLine(1), 900),
      window.setTimeout(() => setLine(2), 2800),
      window.setTimeout(() => setLine(3), 4800),
      window.setTimeout(() => setPhase("privileges"), 7200),
    ]
    return () => timers.forEach(clearTimeout)
  }, [phase])

  React.useEffect(() => {
    if (phase !== "privileges") return
    setPrivIndex(0)
    const timers: number[] = []
    highlights.forEach((_, i) => {
      timers.push(window.setTimeout(() => setPrivIndex(i), 450 * (i + 1)))
    })
    timers.push(
      window.setTimeout(
        () => setPhase("mission"),
        450 * (highlights.length + 2)
      )
    )
    return () => timers.forEach(clearTimeout)
  }, [phase, highlights])

  const remaining = ALLIANCE_FIRST_MISSIONS.filter((m) => !missions[m.field]).length

  return (
    <div className="min-h-[70vh]">
      {showLoyalty && loyaltyReward ? (
        <LoyaltyRewardReveal
          bonusMessages={loyaltyReward.bonusMessages}
          boosts={loyaltyReward.boosts}
          vip={loyaltyReward.vip}
          onContinue={() => setShowLoyalty(false)}
        />
      ) : null}
      {phase === "cinema" ? (
        <section className="relative overflow-hidden rounded-[1.75rem] bg-[#120f10] text-[#F2EBE0] px-6 py-16 sm:py-20 text-center shadow-elevated">
          <div
            aria-hidden
            className="alliance-gold-sweep pointer-events-none absolute inset-0 opacity-70"
          />
          <p
            className={cn(
              "font-serif text-3xl sm:text-4xl font-bold tracking-tight transition-all duration-700",
              line >= 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            )}
          >
            KELIAA
          </p>
          <div
            className={cn(
              "mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#B8954A]/50 bg-[#B8954A]/15 transition-all duration-700",
              line >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-75"
            )}
          >
            {isRenewal ? (
              <RefreshCw className="h-7 w-7 text-[#D4AF72]" />
            ) : (
              <Crown className="h-7 w-7 text-[#D4AF72]" />
            )}
          </div>
          <h1
            className={cn(
              "mt-6 font-serif text-3xl sm:text-5xl font-bold transition-all duration-700",
              line >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            {isRenewal
              ? "Félicitations pour votre renouvellement"
              : "Bienvenue dans Alliance"}
          </h1>
          <div className="mt-6 space-y-3 max-w-md mx-auto min-h-[5.5rem]">
            <p
              className={cn(
                "text-sm sm:text-base text-white/75 leading-relaxed transition-all duration-700",
                line >= 3 ? "opacity-100" : "opacity-0"
              )}
            >
              {isRenewal
                ? "Vous avez choisi de continuer — votre espace Alliance reste le vôtre."
                : "Vous n’êtes plus simplement sur une application de rencontre."}
            </p>
            <p
              className={cn(
                "text-sm sm:text-base text-[#D4AF72] leading-relaxed transition-all duration-700 delay-300",
                line >= 3 ? "opacity-100" : "opacity-0"
              )}
            >
              {isRenewal
                ? "Merci pour votre confiance. Voici ce que votre renouvellement prolonge."
                : "Vous entrez dans un espace de préparation au mariage."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPhase("privileges")}
            className="mt-8 inline-flex h-11 items-center rounded-xl bg-[#B8954A] px-6 text-sm font-bold text-[#7F5557]"
          >
            {isRenewal ? "Continuer" : "Commencer"}
          </button>
        </section>
      ) : null}

      {phase === "privileges" ? (
        <section className="rounded-[1.75rem] border border-accent/30 bg-gradient-to-br from-[#7F5557] via-[#722F37] to-[#8B5C62] p-6 sm:p-8 text-[#F2EBE0] space-y-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF72]">
            {isRenewal ? "Votre renouvellement" : "Vos privilèges"}
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            {isRenewal
              ? `${firstName}, Alliance continue avec vous`
              : `${firstName}, Alliance s’ouvre pour vous`}
          </h2>
          <ul className="space-y-2.5">
            {highlights.map((p, i) => {
              const visible = i <= privIndex
              return (
                <li
                  key={p.id}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-all duration-500",
                    visible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-3"
                  )}
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#B8954A]/25 text-[#D4AF72]">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{p.title}</p>
                    <p className="text-xs text-white/65 leading-relaxed">{p.body}</p>
                  </div>
                </li>
              )
            })}
          </ul>
          <button
            type="button"
            onClick={() => setPhase("mission")}
            className="inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-bold text-primary"
          >
            Continuer
          </button>
        </section>
      ) : null}

      {phase === "mission" ? (
        <section className="space-y-5 animate-in fade-in duration-500">
          <div className="rounded-[1.75rem] border border-border bg-card p-6 sm:p-8 space-y-3 shadow-card">
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              {isRenewal ? "Prochaine étape" : "Première mission"}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              {isRenewal ? `Rebonjour ${firstName}` : `Bienvenue ${firstName}`}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isRenewal
                ? "Reprenez votre parcours là où vous l’avez laissé."
                : "Pour profiter pleinement d’Alliance, commencez par ces étapes."}{" "}
              {!isRenewal ? (
                <strong className="text-foreground">
                  {remaining} étape{remaining === 1 ? "" : "s"} restante
                  {remaining === 1 ? "" : "s"}
                </strong>
              ) : null}
            </p>
            <ul className="space-y-2 pt-2">
              {ALLIANCE_FIRST_MISSIONS.map((m) => {
                const done = missions[m.field]
                return (
                  <li key={m.id}>
                    <Link
                      href={m.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors",
                        done
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded border text-[10px]",
                          done
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-muted-foreground/40"
                        )}
                      >
                        {done ? <Check className="h-3 w-3" /> : null}
                      </span>
                      {m.title}
                    </Link>
                  </li>
                )
              })}
            </ul>

            {profileGaps.length > 0 ? (
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-4 space-y-2 mt-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-800 inline-flex items-center gap-1.5">
                  <UserRound className="h-3.5 w-3.5" />
                  Suggestions profil
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Nous ne vous redemandons pas ce que vous avez déjà rempli. Voici
                  seulement ce qui manque encore :
                </p>
                <ul className="space-y-1.5">
                  {profileGaps.map((g) => (
                    <li key={g.id}>
                      <Link
                        href={g.href}
                        className="text-sm font-semibold text-primary underline underline-offset-2"
                      >
                        {g.label} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <Link
              href="/alliance/parcours"
              className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-bold"
            >
              {isRenewal ? "Reprendre mon parcours" : "Commencer mon parcours"}
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-border text-sm font-semibold"
            >
              Aller à l’accueil Alliance
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  )
}
