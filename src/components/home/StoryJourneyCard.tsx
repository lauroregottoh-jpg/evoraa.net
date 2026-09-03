"use client"

import * as React from "react"
import {
  Check,
  Heart,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { cn } from "@/utils/cn"

const MOMENTS = [
  {
    label: "Compatibilité proposée",
    title: "91 % compatibles",
    detail: "Foi, projet de foyer et communication alignés.",
    icon: Sparkles,
  },
  {
    label: "Premier échange",
    title: "Une conversation qui a du sens",
    detail: "« Quelle place la foi tient-elle dans ton projet de couple ? »",
    icon: MessageCircle,
  },
  {
    label: "Confiance",
    title: "Vous prenez le temps",
    detail: "Profil vérifié, échanges respectueux, aucun empressement.",
    icon: ShieldCheck,
  },
  {
    label: "Discernement",
    title: "Une histoire devient possible",
    detail: "Vous avancez avec clarté vers une relation tournée vers le mariage.",
    icon: Heart,
  },
]

export function StoryJourneyCard() {
  const [active, setActive] = React.useState(0)

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % MOMENTS.length)
    }, 3200)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-accent/10 blur-3xl"
      />
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#241c1e]/95 p-5 shadow-elevated sm:p-7">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
              Aperçu de votre parcours
            </p>
            <p className="mt-1 text-sm text-white/65">
              Une rencontre, étape après étape
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-200">
            <Check className="h-3 w-3" /> Profils vérifiés
          </span>
        </div>

        <div className="my-6 flex items-center justify-center">
          <ProfileInitial initials="VO" label="Vous" />
          <div className="relative mx-3 h-px flex-1 bg-gradient-to-r from-white/10 via-accent to-white/10">
            <Heart className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent p-2 text-[#2D1020] shadow-lg" />
          </div>
          <ProfileInitial initials="PC" label="Profil compatible" accent />
        </div>

        <div className="relative min-h-40 overflow-hidden rounded-2xl border border-white/10 bg-[#120f10]/80 p-5">
          {MOMENTS.map((moment, index) => {
            const Icon = moment.icon
            const isActive = index === active
            return (
              <div
                key={moment.label}
                className={cn(
                  "transition-opacity duration-500 ease-out",
                  isActive
                    ? "relative opacity-100"
                    : "pointer-events-none absolute inset-5 opacity-0"
                )}
                aria-hidden={!isActive}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
                  {moment.label}
                </p>
                <h3 className="mt-1 font-serif text-2xl font-bold text-white">
                  {moment.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {moment.detail}
                </p>
              </div>
            )
          })}
        </div>

        <div className="mt-5 grid grid-cols-4 gap-2" aria-label="Étapes de l'histoire">
          {MOMENTS.map((item, index) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Voir l'étape ${index + 1} : ${item.label}`}
              className="group space-y-2 text-left"
            >
              <span
                className={cn(
                  "block h-1 rounded-full transition-colors duration-300",
                  index <= active ? "bg-accent" : "bg-white/15"
                )}
              />
              <span
                className={cn(
                  "hidden text-[9px] leading-tight sm:block",
                  index === active ? "text-white" : "text-white/40"
                )}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProfileInitial({
  initials,
  label,
  accent,
}: {
  initials: string
  label: string
  accent?: boolean
}) {
  return (
    <div className="w-24 text-center">
      <div
        className={cn(
          "mx-auto flex h-14 w-14 items-center justify-center rounded-full border font-serif text-base font-bold shadow-lg",
          accent
            ? "border-accent/60 bg-accent/20 text-accent"
            : "border-white/20 bg-white/10 text-white"
        )}
      >
        {initials}
      </div>
      <p className="mt-2 text-[10px] text-white/60">{label}</p>
    </div>
  )
}
