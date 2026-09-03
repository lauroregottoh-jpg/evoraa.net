"use client"

import * as React from "react"
import {
  bookCoachingSlotAction,
  getCoachAvailabilityAction,
  getLinkedCoachesAction,
  listBookableCoachesAction,
} from "@/lib/coaching/actions"
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

const ANON_KEY = "keliaa_display_anonymous"
const PREF_KEY = "keliaa_coach_gender_pref"

/** Propose les prochaines occurrences d’une plage récurrente. */
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

export function CoachingBookingCalendar({
  balance,
  onBooked,
}: {
  balance: number
  onBooked: () => void
}) {
  const [coaches, setCoaches] = React.useState<
    Array<{ id: string; name: string }>
  >([])
  const [coachId, setCoachId] = React.useState("")
  const [options, setOptions] = React.useState<
    Array<{ label: string; iso: string; credits: number }>
  >([])
  const [credits, setCredits] = React.useState(1)
  const [anonymous, setAnonymous] = React.useState(false)
  const [selected, setSelected] = React.useState("")
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    try {
      setAnonymous(localStorage.getItem(ANON_KEY) === "1")
    } catch {
      /* ignore */
    }
    void (async () => {
      let genderPreference: "female" | "male" | "none" = "none"
      try {
        const raw = localStorage.getItem(PREF_KEY)
        if (raw === "female" || raw === "male" || raw === "none") {
          genderPreference = raw
        }
      } catch {
        /* ignore */
      }
      const linked = await getLinkedCoachesAction()
      let list = (linked.coaches || []).map((c) => ({
        id: c.id,
        name: c.name,
      }))
      if (list.length === 0) {
        const bookable = await listBookableCoachesAction({ genderPreference })
        list = (bookable.coaches || []).map((c) => ({
          id: c.id,
          name: c.name,
        }))
      }
      setCoaches(list)
      if (list[0]) setCoachId(list[0].id)
    })()
  }, [])

  React.useEffect(() => {
    if (!coachId) {
      setOptions([])
      return
    }
    void getCoachAvailabilityAction(coachId).then((r) => {
      const slots = r.slots || []
      const next: Array<{ label: string; iso: string; credits: number }> = []
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
            credits,
          })
        }
      }
      setOptions(next.slice(0, 12))
    })
  }, [coachId, credits])

  const book = async () => {
    if (!coachId || !selected) {
      setError("Choisissez un coach et un créneau.")
      return
    }
    if (balance < credits) {
      setError("Crédits insuffisants.")
      return
    }
    setLoading(true)
    setError("")
    let genderPreference: "female" | "male" | "none" = "none"
    try {
      const raw = localStorage.getItem(PREF_KEY)
      if (raw === "female" || raw === "male" || raw === "none") {
        genderPreference = raw
      }
      localStorage.setItem(ANON_KEY, anonymous ? "1" : "0")
    } catch {
      /* ignore */
    }

    const r = await bookCoachingSlotAction({
      coachId,
      scheduledStart: selected,
      credits,
      displayAnonymous: anonymous,
      genderPreference,
      splitPlan: { creditsPerSession: credits },
    })
    setLoading(false)
    if (r.error) {
      setError(r.error)
      return
    }
    onBooked()
  }

  return (
    <section className="rounded-2xl border border-[#2D1020]/15 bg-[#F2EBE0] p-5 sm:p-6 space-y-4">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B8954A]">
          Calendrier
        </p>
        <h2 className="font-serif text-xl font-bold text-[#2D1020] mt-1">
          Réserver un créneau
        </h2>
        <p className="text-sm text-[#2D1020]/70 mt-1">
          1 crédit = 30 min. Une séance d’1 h consomme 2 crédits.
        </p>
      </div>

      {coaches.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucun coach disponible pour le moment. Réessayez bientôt ou contactez
          le support.
        </p>
      ) : (
        <>
          <label className="block space-y-1.5 text-sm">
            <span className="font-medium">Coach</span>
            <select
              value={coachId}
              onChange={(e) => setCoachId(e.target.value)}
              className="w-full h-11 rounded-xl border bg-white px-3"
            >
              {coaches.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <div className="space-y-2">
            <p className="text-sm font-medium">Durée de cette séance</p>
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
                      ? "border-[#2D1020] bg-[#2D1020] text-[#F2EBE0]"
                      : "border-[#2D1020]/20 bg-white"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-start gap-2 text-sm rounded-xl border bg-white px-3 py-3">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              <strong className="font-semibold">Anonymat d’affichage</strong>
              <span className="block text-xs text-muted-foreground mt-0.5">
                Votre nom n’apparaît pas dans l’expérience publique de la salle.
                KELIAA et le coach disposent toujours de votre identité pour le
                suivi et le paiement.
              </span>
            </span>
          </label>

          <div className="space-y-2">
            <p className="text-sm font-medium">Créneaux libres</p>
            {options.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Ce coach n’a pas encore publié de disponibilités.
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
                        ? "border-[#2D1020] bg-[#2D1020]/8"
                        : "border-border bg-white hover:border-[#2D1020]/35"
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {error ? (
            <p className="text-xs text-destructive">{error}</p>
          ) : null}

          <button
            type="button"
            disabled={loading || !selected}
            onClick={() => void book()}
            className="h-11 w-full rounded-xl bg-[#2D1020] text-sm font-bold text-[#F2EBE0] disabled:opacity-60"
          >
            {loading
              ? "Réservation…"
              : `Confirmer · il restera ${Math.max(0, balance - credits)} crédit${Math.max(0, balance - credits) > 1 ? "s" : ""}`}
          </button>
          <p className="text-xs text-center text-muted-foreground">
            Solde actuel : {balance} crédit{balance > 1 ? "s" : ""} · cette séance :{" "}
            {credits} crédit{credits > 1 ? "s" : ""}
          </p>
        </>
      )}
    </section>
  )
}
