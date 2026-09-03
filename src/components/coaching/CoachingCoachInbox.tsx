"use client"

import * as React from "react"
import {
  deleteCoachAvailabilityAction,
  getCoachAvailabilityAction,
  listCoachInboxAction,
  upsertCoachAvailabilityAction,
  type CoachingSessionListItem,
} from "@/lib/coaching/actions"
import { CoachingSessionRoom } from "@/components/coaching/CoachingSessionRoom"
import { CoachingEndQuestionnaire } from "@/components/coaching/CoachingEndQuestionnaire"
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

/**
 * Inbox coach : réservations, brief, dispos, messages, salle.
 * Pas de mention de transcription.
 */
export function CoachingCoachInbox({
  coachName,
  onSwitchRole,
}: {
  coachName: string
  onSwitchRole?: () => void
}) {
  const [sessions, setSessions] = React.useState<
    Array<
      CoachingSessionListItem & {
        briefMessage: string | null
        objectives: string[]
        realFirstName: string | null
      }
    >
  >([])
  const [slots, setSlots] = React.useState<
    Array<{
      id: string
      weekday: number | null
      startTime: string | null
      endTime: string | null
    }>
  >([])
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [endedId, setEndedId] = React.useState<string | null>(null)
  const [endedAborted, setEndedAborted] = React.useState(false)
  const [weekday, setWeekday] = React.useState(1)
  const [startTime, setStartTime] = React.useState("09:00")
  const [endTime, setEndTime] = React.useState("12:00")
  const [availError, setAvailError] = React.useState("")

  const refresh = React.useCallback(async () => {
    const [inbox, avail] = await Promise.all([
      listCoachInboxAction(),
      getCoachAvailabilityAction(),
    ])
    setSessions(inbox.sessions || [])
    setSlots(avail.slots || [])
  }, [])

  React.useEffect(() => {
    void refresh()
  }, [refresh])

  const active = sessions.find((s) => s.id === activeId)

  if (endedId) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-10">
        <CoachingEndQuestionnaire
          sessionId={endedId}
          role="coach"
          aborted={endedAborted}
          onDone={() => {
            setEndedId(null)
            setEndedAborted(false)
            setActiveId(null)
            void refresh()
          }}
        />
      </div>
    )
  }

  if (active) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-10">
        <button
          type="button"
          onClick={() => setActiveId(null)}
          className="text-xs font-semibold text-[#5C1F28] underline"
        >
          ← Retour inbox
        </button>
        <div className="rounded-2xl border bg-[#FBF9F6] p-4 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B8954A]">
            Brief
          </p>
          <h2 className="font-serif text-lg font-bold text-[#5C1F28]">
            {active.clientDisplayName}
            {active.displayAnonymous && active.realFirstName
              ? ` · identité suivie : ${active.realFirstName}`
              : ""}
          </h2>
          {active.subject ? (
            <p className="text-sm font-medium">{active.subject}</p>
          ) : null}
          {active.briefMessage ? (
            <p className="text-sm text-[#2B2421]/70">{active.briefMessage}</p>
          ) : null}
          {active.objectives.length > 0 ? (
            <ul className="text-sm list-disc pl-5 space-y-1">
              {active.objectives.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          ) : null}
          <p className="text-xs text-muted-foreground">
            Recommandation : démarrer par l’écoute du besoin principal, puis une
            piste concrète avant la fin.
          </p>
        </div>
        <CoachingSessionRoom
          sessionId={active.id}
          bookingId={active.bookingId}
          role="coach"
          initialStatus={
            active.status === "ACTIVE" || active.status === "PREP"
              ? (active.status as "PREP" | "ACTIVE")
              : "WAITING"
          }
          onEnded={({ aborted }) => {
            setEndedAborted(aborted)
            setEndedId(active.id)
          }}
          onLeaveWaiting={() => setActiveId(null)}
        />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      <header className="rounded-[1.75rem] border border-[#B8954A]/35 bg-gradient-to-br from-[#5C1F28] via-[#3D1519] to-[#2B2421] p-7 text-[#FBF9F6]">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F3D9A4]">
          Espace coach
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold">
          {coachName || "Inbox sessions"}
        </h1>
        <p className="mt-2 text-sm text-white/75">
          Réservations, briefs, messages prédéfinis et salle audio.
        </p>
      </header>

      <section className="rounded-2xl border bg-white p-5 space-y-4">
        <h2 className="font-serif text-xl font-bold text-[#5C1F28]">
          Disponibilités
        </h2>
        <p className="text-sm text-muted-foreground">
          Publiez vos plages récurrentes — les coachés réservent dessus.
        </p>
        <div className="grid sm:grid-cols-4 gap-2">
          <select
            value={weekday}
            onChange={(e) => setWeekday(Number(e.target.value))}
            className="h-10 rounded-xl border px-2 text-sm"
          >
            {WEEKDAYS.map((d, i) => (
              <option key={d} value={i}>
                {d}
              </option>
            ))}
          </select>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="h-10 rounded-xl border px-2 text-sm"
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="h-10 rounded-xl border px-2 text-sm"
          />
          <button
            type="button"
            onClick={async () => {
              setAvailError("")
              const r = await upsertCoachAvailabilityAction({
                weekday,
                startTime,
                endTime,
              })
              if (r.error) setAvailError(r.error)
              else void refresh()
            }}
            className="h-10 rounded-xl bg-[#5C1F28] text-[#FBF9F6] text-sm font-semibold"
          >
            Ajouter
          </button>
        </div>
        {availError ? (
          <p className="text-xs text-destructive">{availError}</p>
        ) : null}
        <ul className="space-y-2">
          {slots.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm"
            >
              <span>
                {s.weekday != null ? WEEKDAYS[s.weekday] : "—"} ·{" "}
                {(s.startTime || "").slice(0, 5)} – {(s.endTime || "").slice(0, 5)}
              </span>
              <button
                type="button"
                onClick={async () => {
                  await deleteCoachAvailabilityAction(s.id)
                  void refresh()
                }}
                className="text-xs text-destructive underline"
              >
                Retirer
              </button>
            </li>
          ))}
          {slots.length === 0 ? (
            <li className="text-sm text-muted-foreground">
              Aucune disponibilité publiée.
            </li>
          ) : null}
        </ul>
      </section>

      <section className="rounded-2xl border bg-white p-5 space-y-3">
        <h2 className="font-serif text-xl font-bold text-[#5C1F28]">
          Sessions à venir
        </h2>
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Pas encore de réservation.
          </p>
        ) : (
          <ul className="space-y-2">
            {sessions.map((s) => {
              const live = ["WAITING", "PREP", "CONNECTING", "ACTIVE"].includes(
                s.status
              )
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(s.id)}
                    className={cn(
                      "w-full text-left rounded-xl border px-4 py-3",
                      live
                        ? "border-[#5C1F28] bg-[#5C1F28]/5"
                        : "border-border bg-[#FBF9F6]"
                    )}
                  >
                    <p className="text-sm font-semibold">
                      {s.clientDisplayName}
                      {s.displayAnonymous ? " · anonymat d’affichage" : ""}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {s.subject || "Sans objet"} · {s.displayedMinutes} min ·{" "}
                      {s.status}
                      {s.scheduledStart
                        ? ` · ${new Date(s.scheduledStart).toLocaleString("fr-FR")}`
                        : ""}
                    </p>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {onSwitchRole ? (
        <button
          type="button"
          onClick={onSwitchRole}
          className="block mx-auto text-xs underline text-muted-foreground"
        >
          Changer de rôle
        </button>
      ) : null}
    </div>
  )
}
