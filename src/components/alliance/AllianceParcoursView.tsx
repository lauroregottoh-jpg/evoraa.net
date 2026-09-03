"use client"

import Link from "next/link"
import { Check, ChevronRight } from "lucide-react"
import {
  ALLIANCE_ACHIEVEMENTS,
  ALLIANCE_FIRST_MISSIONS,
  ALLIANCE_LEVELS,
  ALLIANCE_STAGES,
  type AllianceAchievementFlags,
  type AllianceMissionFlags,
} from "@/lib/alliance/journey"
import { cn } from "@/utils/cn"

export function AllianceParcoursView({
  firstName,
  missions,
  missionPercent,
  level,
  achievements,
  assessmentsDone,
  hasMatchSignal,
}: {
  firstName: string
  missions: AllianceMissionFlags
  missionPercent: number
  level: 1 | 2 | 3
  achievements: AllianceAchievementFlags
  assessmentsDone: number
  hasMatchSignal: boolean
}) {
  const levelMeta = ALLIANCE_LEVELS.find((l) => l.id === level) ?? ALLIANCE_LEVELS[0]
  const remaining = ALLIANCE_FIRST_MISSIONS.filter((m) => !missions[m.field]).length

  const doneFor = (key: string) => {
    if (key === "tests") return assessmentsDone >= 5
    if (key === "match") return hasMatchSignal
    return Boolean(missions[key as keyof AllianceMissionFlags])
  }

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
          Mon parcours Alliance
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
          {firstName}, votre préparation avance
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
          Alliance n’est pas une liste de fonctionnalités — c’est un parcours pour
          préparer un mariage solide, avec lucidité.
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-card">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Votre parcours Alliance</p>
            <p className="font-serif text-xl font-bold">
              Niveau {level} · {levelMeta.title}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{levelMeta.subtitle}</p>
          </div>
          <p className="font-serif text-2xl font-bold text-primary">{missionPercent}%</p>
        </div>
        <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
            style={{ width: `${missionPercent}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {ALLIANCE_LEVELS.map((l) => (
            <span
              key={l.id}
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide border",
                l.id === level
                  ? "border-accent/40 bg-accent/15 text-accent"
                  : l.id < level
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                    : "border-border text-muted-foreground"
              )}
            >
              Niv. {l.id} {l.title}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border-2 border-[#D7B866]/40 bg-gradient-to-br from-[#D7B866]/12 via-white to-card p-6 sm:p-8 space-y-6 shadow-elevated">
        <div className="text-center space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-accent">
            Schéma visuel
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Votre parcours Alliance
          </h2>
          <p className="text-sm text-muted-foreground">
            Quatre saisons — de la connaissance de soi à la relation solide
          </p>
        </div>

        {/* Timeline visuelle */}
        <div className="relative">
          <div
            aria-hidden
            className="hidden sm:block absolute left-8 right-8 top-[2.15rem] h-1 rounded-full bg-gradient-to-r from-[#D7B866]/30 via-[#D7B866] to-[#D7B866]/30"
          />
          <ol className="grid sm:grid-cols-4 gap-4 relative z-10">
            {ALLIANCE_STAGES.map((stage, i) => (
              <li key={stage.id} className="flex flex-col items-center text-center gap-3">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#D7B866] bg-white font-serif text-2xl font-bold text-[#A78335] shadow-md">
                  {i + 1}
                </span>
                <div className="space-y-1 px-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                    Étape {i + 1}
                  </p>
                  <p className="font-serif text-base font-bold leading-snug">
                    {stage.title.replace(/^Étape \d+ — /, "")}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Première mission — schéma */}
        <div className="rounded-2xl border border-[#D7B866]/30 bg-white/90 p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
              Première mission · schéma
            </p>
            <span className="text-xs font-semibold text-muted-foreground">
              {remaining} restante{remaining === 1 ? "" : "s"}
            </span>
          </div>
          <div className="flex flex-col gap-0">
            {ALLIANCE_FIRST_MISSIONS.map((m, i) => {
              const done = missions[m.field]
              return (
                <div key={m.id} className="flex gap-3">
                  <div className="flex flex-col items-center w-8 shrink-0">
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold",
                        done
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-[#D7B866] bg-[#D7B866]/15 text-[#A78335]"
                      )}
                    >
                      {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    {i < ALLIANCE_FIRST_MISSIONS.length - 1 ? (
                      <span
                        className={cn(
                          "w-0.5 flex-1 min-h-[1.25rem]",
                          done ? "bg-emerald-400" : "bg-[#D7B866]/35"
                        )}
                      />
                    ) : null}
                  </div>
                  <Link
                    href={m.href}
                    className={cn(
                      "flex-1 mb-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                      done
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800"
                        : "border-border hover:border-[#D7B866]/50 bg-card"
                    )}
                  >
                    {m.title}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-serif text-xl font-bold">Première mission · liste</h2>
          <span className="text-xs font-semibold text-muted-foreground">
            {remaining} restante{remaining === 1 ? "" : "s"}
          </span>
        </div>
        <ul className="space-y-2">
          {ALLIANCE_FIRST_MISSIONS.map((m) => {
            const done = missions[m.field]
            return (
              <li key={m.id}>
                <Link
                  href={m.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm",
                    done
                      ? "border-emerald-500/30 bg-emerald-500/10"
                      : "border-border hover:border-primary/35"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded border",
                      done
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-muted-foreground/40"
                    )}
                  >
                    {done ? <Check className="h-3 w-3" /> : null}
                  </span>
                  <span className="flex-1 font-medium">{m.title}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      {ALLIANCE_STAGES.map((stage) => (
        <section
          key={stage.id}
          className="rounded-2xl border border-border bg-card p-5 space-y-3"
        >
          <h2 className="font-serif text-lg font-bold">{stage.title}</h2>
          <ul className="space-y-2">
            {stage.items.map((item) => {
              const done = doneFor(item.doneKey)
              return (
                <li key={`${stage.id}-${item.label}`}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm hover:bg-secondary/50"
                  >
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full shrink-0",
                        done ? "bg-emerald-500" : "bg-border"
                      )}
                    />
                    <span className={cn(done && "text-muted-foreground line-through")}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      <section className="rounded-2xl border border-border bg-card p-5 space-y-3">
        <h2 className="font-serif text-xl font-bold">Succès</h2>
        <ul className="grid sm:grid-cols-2 gap-2">
          {ALLIANCE_ACHIEVEMENTS.map((a) => {
            const unlocked = achievements[a.field]
            return (
              <li
                key={a.id}
                className={cn(
                  "rounded-xl border px-3 py-3 text-sm",
                  unlocked
                    ? "border-accent/35 bg-accent/10"
                    : "border-border opacity-55"
                )}
              >
                <span className="mr-1.5">{unlocked ? "🏆" : "○"}</span>
                {a.title}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
