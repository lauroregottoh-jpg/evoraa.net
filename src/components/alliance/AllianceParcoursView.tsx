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

      <section className="rounded-2xl border border-[#B8954A]/30 bg-gradient-to-br from-[#B8954A]/10 via-white to-card p-5 space-y-4 shadow-card">
        <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
          Schéma du parcours
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
          {ALLIANCE_STAGES.map((stage, i) => (
            <div key={stage.id} className="flex items-center gap-2 flex-1 min-w-0">
              <div className="rounded-xl border border-[#B8954A]/35 bg-white px-3 py-2.5 flex-1 text-center">
                <p className="text-[10px] font-bold text-accent">Étape {i + 1}</p>
                <p className="text-xs font-semibold leading-snug mt-0.5">
                  {stage.title.replace(/^Étape \d+ — /, "")}
                </p>
              </div>
              {i < ALLIANCE_STAGES.length - 1 ? (
                <ChevronRight className="hidden sm:block h-4 w-4 text-accent shrink-0 mx-1" />
              ) : null}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Me connaître → Me préparer → Rencontrer → Construire
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-serif text-xl font-bold">Première mission</h2>
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
