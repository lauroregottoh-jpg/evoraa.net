"use client"

import * as React from "react"
import Link from "next/link"
import { Lock } from "lucide-react"
import { CoachingSessionRoom } from "@/components/coaching/CoachingSessionRoom"
import { CoachingReservePanel } from "@/components/coaching/CoachingReservePanel"
import { CoachingEndQuestionnaire } from "@/components/coaching/CoachingEndQuestionnaire"
import {
  getCoachingCreditBalanceAction,
  listClientSessionsAction,
  type CoachingSessionListItem,
} from "@/lib/coaching/actions"
import { cn } from "@/utils/cn"

/**
 * Parcours coaché : réserver d’abord, puis espace de réunion.
 */
export function CoachingClientHome({
  onOpenCoachSpace,
}: {
  onOpenCoachSpace?: () => void
}) {
  const [balance, setBalance] = React.useState<number | null>(null)
  const [sessions, setSessions] = React.useState<CoachingSessionListItem[]>([])
  const [activeSessionId, setActiveSessionId] = React.useState<string | null>(
    null
  )
  const [endedSessionId, setEndedSessionId] = React.useState<string | null>(
    null
  )
  const [endedAborted, setEndedAborted] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  const refresh = React.useCallback(async () => {
    const [b, s] = await Promise.all([
      getCoachingCreditBalanceAction(),
      listClientSessionsAction(),
    ])
    if (typeof b.balance === "number") setBalance(b.balance)
    setSessions(s.sessions || [])
    setLoading(false)
  }, [])

  React.useEffect(() => {
    void refresh()
  }, [refresh])

  const locked = balance !== null && balance <= 0
  const active = sessions.find((s) => s.id === activeSessionId)
  const liveSessions = sessions.filter((s) =>
    ["WAITING", "PREP", "CONNECTING", "ACTIVE"].includes(s.status)
  )
  const pastSessions = sessions.filter((s) =>
    ["COMPLETED", "CANCELLED", "NO_SHOW_CLIENT", "NO_SHOW_COACH"].includes(
      s.status
    )
  )
  const reserved = liveSessions.length
  const completed = pastSessions.filter((s) => s.status === "COMPLETED").length

  if (endedSessionId) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-10">
        <CoachingEndQuestionnaire
          sessionId={endedSessionId}
          role="client"
          aborted={endedAborted}
          onDone={() => {
            setEndedSessionId(null)
            setEndedAborted(false)
            setActiveSessionId(null)
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
          onClick={() => setActiveSessionId(null)}
          className="text-xs font-semibold text-[#A07070] underline"
        >
          ← Retour à mon espace
        </button>
        <CoachingSessionRoom
          sessionId={active.id}
          bookingId={active.bookingId}
          role="client"
          initialStatus={
            active.status === "ACTIVE" || active.status === "PREP"
              ? (active.status as "PREP" | "ACTIVE")
              : "WAITING"
          }
          onEnded={({ aborted }) => {
            setEndedAborted(aborted)
            setEndedSessionId(active.id)
          }}
          onLeaveWaiting={() => setActiveSessionId(null)}
        />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      <header className="relative overflow-hidden rounded-[1.75rem] border border-[#B8954A]/35 bg-gradient-to-br from-[#A07070] via-[#8B5C62] to-[#A07070] p-7 sm:p-9 text-[#F2EBE0]">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#D4AF72]">
          Parcours coaché
        </p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold leading-tight">
          Votre espace coaching
        </h1>
        {!loading && balance !== null ? (
          <div className="mt-5 grid grid-cols-3 gap-2 max-w-md">
            <div className="rounded-xl bg-white/10 border border-white/15 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wider text-white/55">
                Crédits
              </p>
              <p className="font-serif text-2xl font-bold">{balance}</p>
            </div>
            <div className="rounded-xl bg-white/10 border border-white/15 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wider text-white/55">
                À venir
              </p>
              <p className="font-serif text-2xl font-bold">{reserved}</p>
            </div>
            <div className="rounded-xl bg-white/10 border border-white/15 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wider text-white/55">
                Terminées
              </p>
              <p className="font-serif text-2xl font-bold">{completed}</p>
            </div>
          </div>
        ) : null}
      </header>

      {loading ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : locked ? (
        <div className="relative">
          <div
            className="pointer-events-none select-none opacity-[0.45] grayscale-[0.25]"
            aria-hidden
          >
            <div className="rounded-2xl border border-[#A07070]/15 bg-[#F2EBE0] p-6 h-48" />
          </div>
          <div className="absolute inset-0 z-10 flex items-start justify-center p-4 pt-6 bg-[#F2EBE0]/40 backdrop-blur-[1px]">
            <div className="w-full max-w-md rounded-2xl border border-[#B8954A]/40 bg-white shadow-elevated p-6 space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#A07070]/10 text-[#A07070]">
                <Lock className="h-5 w-5" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#A07070]">
                Débloquez votre session
              </h2>
              <p className="text-sm text-[#A07070]/75 leading-relaxed">
                Après paiement vous pourrez réserver et rejoindre la réunion.
              </p>
              <Link
                href="/coaching#payer"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#A07070] px-5 text-sm font-semibold text-[#F2EBE0] w-full"
              >
                Prendre mon coaching
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          <CoachingReservePanel
            balance={balance ?? 0}
            onBooked={() => {
              void refresh()
            }}
          />

          <section className="rounded-2xl border border-[#A07070]/25 bg-gradient-to-br from-[#A07070] to-[#8B5C62] p-5 sm:p-6 text-[#F2EBE0] space-y-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#D4AF72]">
                Espace de réunion
              </p>
              <h2 className="font-serif text-xl sm:text-2xl font-bold mt-1">
                Rejoindre votre séance
              </h2>
              <p className="text-sm text-white/75 mt-1 leading-relaxed">
                Entrez en salle d’attente. La séance audio s’ouvre
                automatiquement dès que votre coach se connecte. Aucun crédit
                n’est consommé en attente.
              </p>
            </div>

            {liveSessions.length === 0 ? (
              <p className="text-sm text-white/65 rounded-xl border border-white/15 bg-white/5 px-4 py-3">
                Aucune réunion prévue. Réservez un créneau ci-dessus, puis
                revenez ici pour rejoindre.
              </p>
            ) : (
              <ul className="space-y-2">
                {liveSessions.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setActiveSessionId(s.id)}
                      className="w-full text-left rounded-xl border border-[#D4AF72]/40 bg-white/10 hover:bg-white/15 px-4 py-3.5 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">
                            Réunion avec {s.coachName}
                          </p>
                          <p className="text-xs text-white/65 mt-0.5">
                            {s.displayedMinutes} min
                            {s.scheduledStart
                              ? ` · ${new Date(s.scheduledStart).toLocaleString("fr-FR")}`
                              : ""}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-lg bg-[#D4AF72] px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#A07070]">
                          Rejoindre
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {pastSessions.length > 0 ? (
            <section className="rounded-2xl border border-[#A07070]/10 bg-white p-5 space-y-3">
              <h2 className="font-serif text-lg font-bold text-[#A07070]">
                Séances passées
              </h2>
              <ul className="space-y-2">
                {pastSessions.slice(0, 8).map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => {
                        if (s.status === "COMPLETED") setEndedSessionId(s.id)
                      }}
                      className={cn(
                        "w-full text-left rounded-xl border border-[#B8954A]/25 bg-[#F2EBE0] px-4 py-3",
                        s.status === "COMPLETED" && "hover:border-[#A07070]/30"
                      )}
                    >
                      <p className="text-sm font-semibold text-[#A07070]">
                        {s.coachName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {s.displayedMinutes} min · {s.status}
                        {s.scheduledStart
                          ? ` · ${new Date(s.scheduledStart).toLocaleString("fr-FR")}`
                          : ""}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}

      <div className="flex flex-wrap gap-3 justify-center text-xs">
        <Link href="/coaching" className="underline text-muted-foreground">
          Offres coaching
        </Link>
        {onOpenCoachSpace ? (
          <button
            type="button"
            onClick={onOpenCoachSpace}
            className="underline text-muted-foreground"
          >
            Espace coach (code)
          </button>
        ) : null}
      </div>
    </div>
  )
}
