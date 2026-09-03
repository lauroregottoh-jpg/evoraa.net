"use client"

import * as React from "react"
import {
  bookCoachingSlotAction,
  getCoachAvailabilityAction,
  listBookableCoachesAction,
} from "@/lib/coaching/actions"
import { COACHING_CREDIT_DISPLAY_MINUTES } from "@/lib/coaching/domain"
import { cn } from "@/utils/cn"

const WEEKDAYS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
]

const PREF_KEY = "keliaa_coach_gender_pref"

type GenderPref = "female" | "male"

function nextOccurrences(
  weekday: number,
  startTime: string,
  count: number
): Date[] {
  const out: Date[] = []
  const [hh, mm] = startTime.split(":").map(Number)
  const cursor = new Date()
  cursor.setSeconds(0, 0)
  for (let i = 0; i < 21 && out.length < count; i++) {
    const d = new Date(cursor)
    d.setDate(cursor.getDate() + i)
    if (d.getDay() !== weekday) continue
    d.setHours(hh || 9, mm || 0, 0, 0)
    if (d.getTime() < Date.now() + 30 * 60 * 1000) continue
    out.push(d)
  }
  return out
}

/**
 * Réservation seule : F/H → coach → durée → créneau → confirmer.
 */
export function CoachingReservePanel({
  balance,
  onBooked,
}: {
  balance: number
  onBooked: (sessionId?: string) => void
}) {
  const [pref, setPref] = React.useState<GenderPref>("female")
  const [coach, setCoach] = React.useState<{
    id: string
    name: string
    gender: string | null
  } | null>(null)
  const [options, setOptions] = React.useState<
    Array<{ label: string; iso: string }>
  >([])
  const [credits, setCredits] = React.useState(1)
  const [selected, setSelected] = React.useState("")
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [loadingCoach, setLoadingCoach] = React.useState(true)
  const [justBookedRemaining, setJustBookedRemaining] = React.useState<
    number | null
  >(null)

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(PREF_KEY)
      if (raw === "female" || raw === "male") setPref(raw)
    } catch {
      /* ignore */
    }
  }, [])

  React.useEffect(() => {
    let cancelled = false
    setLoadingCoach(true)
    setSelected("")
    try {
      localStorage.setItem(PREF_KEY, pref)
    } catch {
      /* ignore */
    }
    void listBookableCoachesAction({ genderPreference: pref }).then((r) => {
      if (cancelled) return
      const list = r.coaches || []
      setCoach(list[0] || null)
      setLoadingCoach(false)
    })
    return () => {
      cancelled = true
    }
  }, [pref])

  React.useEffect(() => {
    if (!coach?.id) {
      setOptions([])
      return
    }
    void getCoachAvailabilityAction(coach.id).then((r) => {
      const slots = r.slots || []
      const next: Array<{ label: string; iso: string }> = []
      for (const s of slots) {
        if (s.weekday == null || !s.startTime) continue
        const times = nextOccurrences(s.weekday, s.startTime.slice(0, 5), 3)
        for (const t of times) {
          next.push({
            label: `${WEEKDAYS[t.getDay()]} ${t.toLocaleString("fr-FR", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}`,
            iso: t.toISOString(),
          })
        }
      }
      setOptions(next.slice(0, 10))
    })
  }, [coach?.id])

  const remainingAfter = Math.max(0, balance - credits)

  const book = async () => {
    if (!coach?.id || !selected) {
      setError("Choisissez un créneau.")
      return
    }
    if (balance < credits) {
      setError("Crédits insuffisants.")
      return
    }
    setLoading(true)
    setError("")

    const r = await bookCoachingSlotAction({
      coachId: coach.id,
      scheduledStart: selected,
      credits,
      displayAnonymous: false,
      genderPreference: pref,
      splitPlan: { creditsPerSession: credits },
    })
    setLoading(false)
    if (r.error) {
      setError(r.error)
      return
    }
    setJustBookedRemaining(remainingAfter)
    setSelected("")
    onBooked(r.sessionId)
  }

  return (
    <section className="rounded-2xl border border-[#641F2B]/15 bg-[#FCFAF6] p-5 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-serif text-xl font-bold text-[#641F2B]">
          Réserver mon coaching
        </h2>
        <p className="text-sm text-[#2B2421]/70">
          1 crédit = {COACHING_CREDIT_DISPLAY_MINUTES} min
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-[#2B2421]">Je préfère un coach…</p>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { id: "female" as const, label: "Femme" },
              { id: "male" as const, label: "Homme" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setPref(opt.id)}
              className={cn(
                "rounded-xl border px-3 py-3 text-sm font-semibold transition-colors",
                pref === opt.id
                  ? "border-[#641F2B] bg-[#641F2B] text-[#FFFDF9]"
                  : "border-[#641F2B]/20 bg-white text-[#2B2421] hover:border-[#641F2B]/40"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[#D7B866]/35 bg-white px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A6A2E]">
          Votre coach
        </p>
        {loadingCoach ? (
          <p className="font-serif text-2xl font-bold text-[#641F2B] mt-1">…</p>
        ) : coach ? (
          <p className="font-serif text-2xl font-bold text-[#641F2B] mt-1">
            {coach.name}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground mt-1">
            Coach indisponible pour le moment.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Durée</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { c: 1, label: "30 min (1 crédit)" },
            { c: 2, label: "1 h (2 crédits)" },
          ].map((opt) => (
            <button
              key={opt.c}
              type="button"
              onClick={() => setCredits(opt.c)}
              className={cn(
                "rounded-xl border px-3 py-3 text-sm font-semibold",
                credits === opt.c
                  ? "border-[#641F2B] bg-[#641F2B] text-[#FFFDF9]"
                  : "border-[#641F2B]/20 bg-white"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Créneaux libres</p>
        {!coach ? (
          <p className="text-xs text-muted-foreground">Choisissez Femme ou Homme.</p>
        ) : options.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Aucun créneau publié pour l’instant.
          </p>
        ) : (
          <div className="grid gap-2">
            {options.map((o) => (
              <button
                key={o.iso}
                type="button"
                onClick={() => setSelected(o.iso)}
                className={cn(
                  "text-left rounded-xl border px-3 py-2.5 text-sm",
                  selected === o.iso
                    ? "border-[#641F2B] bg-[#641F2B]/8"
                    : "border-border bg-white hover:border-[#641F2B]/35"
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {error ? <p className="text-xs text-destructive">{error}</p> : null}

      {justBookedRemaining != null ? (
        <p className="text-sm rounded-xl border border-emerald-600/25 bg-emerald-50 px-3 py-2.5 text-emerald-900">
          Créneau réservé. Il vous reste{" "}
          <strong>
            {justBookedRemaining} crédit
            {justBookedRemaining > 1 ? "s" : ""}
          </strong>
          . Rejoignez la réunion ci-dessous quand vous êtes prêt(e).
        </p>
      ) : null}

      <button
        type="button"
        disabled={loading || !selected || !coach}
        onClick={() => void book()}
        className="h-11 w-full rounded-xl bg-[#641F2B] text-sm font-bold text-[#FCFAF6] disabled:opacity-60"
      >
        {loading
          ? "Réservation…"
          : `Confirmer · ${remainingAfter} crédit${remainingAfter > 1 ? "s" : ""} restant${remainingAfter > 1 ? "s" : ""} après`}
      </button>
    </section>
  )
}
