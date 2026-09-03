"use client"

import * as React from "react"
import Link from "next/link"
import {
  clearSessionReminderAction,
  getUpcomingSessionRemindersAction,
} from "@/lib/coaching/actions"

/**
 * Rappels in-app séance (J-1 / H-1 / H-0 fenêtre) — clear à l’entrée salle.
 */
export function CoachingSessionReminders() {
  const [reminders, setReminders] = React.useState<
    Array<{
      sessionId: string
      role: "client" | "coach"
      label: string
      when: string
    }>
  >([])

  React.useEffect(() => {
    void getUpcomingSessionRemindersAction().then((r) => {
      setReminders(r.reminders || [])
    })
  }, [])

  if (reminders.length === 0) return null

  return (
    <div className="space-y-2 mb-4">
      {reminders.map((r) => {
        const when = new Date(r.when)
        const hours = (when.getTime() - Date.now()) / (60 * 60 * 1000)
        const urgency =
          hours <= 1 ? "dans moins d’1 h" : hours <= 24 ? "demain / sous 24 h" : ""
        return (
          <div
            key={`${r.sessionId}-${r.role}`}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#B8954A]/40 bg-[#F2EBE0] px-3 py-2.5 text-sm"
          >
            <div className="min-w-0">
              <p className="font-semibold text-[#A07070] truncate">{r.label}</p>
              <p className="text-xs text-muted-foreground">
                {when.toLocaleString("fr-FR")}
                {urgency ? ` · ${urgency}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/coaching/session"
                onClick={() => {
                  void clearSessionReminderAction(r.sessionId, r.role)
                }}
                className="inline-flex h-9 items-center rounded-lg bg-[#A07070] px-3 text-xs font-bold text-[#F2EBE0]"
              >
                Entrer en salle
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await clearSessionReminderAction(r.sessionId, r.role)
                  setReminders((prev) =>
                    prev.filter((x) => x.sessionId !== r.sessionId)
                  )
                }}
                className="text-xs text-muted-foreground underline"
              >
                Ignorer
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
