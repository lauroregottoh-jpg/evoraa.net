"use client"

import * as React from "react"
import { PhoneOff } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import {
  listCannedMessagesAction,
  sendCannedMessageAction,
  markSessionJoinedAction,
  getCoachingSessionPresenceAction,
  startActiveSessionAction,
  leaveWaitingRoomAction,
  completeSessionAction,
  abortSessionAction,
  markSessionAudioStartedAction,
  getSessionRuntimeAction,
  issueCoachingMediaRoomAction,
} from "@/lib/coaching/actions"
import { COACHING_CANNED_TEMPLATES } from "@/lib/coaching/cannedMessages"
import { CoachingSessionLobby } from "@/components/coaching/CoachingSessionLobby"
import {
  CoachingLiveKitRoom,
  type CoachingLiveKitRoomHandle,
} from "@/components/coaching/CoachingLiveKitRoom"
import { CoachingLiveTranscript } from "@/components/coaching/CoachingLiveTranscript"

type SessionStatus = "WAITING" | "PREP" | "ACTIVE"

/**
 * Lobby d’attente → salle LiveKit dans KELIAA + chrono + hangup forcé.
 * Auth = compte KELIAA uniquement (pas Google/GitHub, pas Daily).
 */
export function CoachingSessionRoom({
  sessionId,
  bookingId,
  role,
  initialStatus,
  onEnded,
  onLeaveWaiting,
}: {
  sessionId: string
  bookingId: string | null
  role: "client" | "coach"
  initialStatus: SessionStatus
  onEnded: (result: { aborted: boolean }) => void
  onLeaveWaiting?: () => void
}) {
  const [clientJoined, setClientJoined] = React.useState(role === "client")
  const [coachJoined, setCoachJoined] = React.useState(role === "coach")
  const [peerOnline, setPeerOnline] = React.useState(false)
  const [phase, setPhase] = React.useState<"lobby" | "live">(
    initialStatus === "ACTIVE" ? "live" : "lobby"
  )
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState("")
  const [mediaJoined, setMediaJoined] = React.useState(false)
  const [peerInRoom, setPeerInRoom] = React.useState(false)
  const [startedAt, setStartedAt] = React.useState<string | null>(null)
  const [remainingMs, setRemainingMs] = React.useState<number | null>(null)
  const [displayedMinutes, setDisplayedMinutes] = React.useState(30)
  const [canComplete, setCanComplete] = React.useState(false)
  const [messages, setMessages] = React.useState<
    Array<{ id: string; fromRole: string; body: string }>
  >([])
  const [sending, setSending] = React.useState(false)
  const [mediaRoom, setMediaRoom] = React.useState<{
    url: string
    token: string
    displayName: string
  } | null>(null)

  const audioMarkedRef = React.useRef(false)
  const autoCompleteRef = React.useRef(false)
  const endingRef = React.useRef(false)
  const mediaRef = React.useRef<CoachingLiveKitRoomHandle | null>(null)
  const selfId = React.useRef(`${role}-${Math.random().toString(36).slice(2, 8)}`)
  const openingRef = React.useRef(false)

  const bothDb = clientJoined && coachJoined
  const bothReady = bothDb && peerOnline

  const refreshMessages = React.useCallback(async () => {
    const r = await listCannedMessagesAction({ bookingId, sessionId })
    setMessages(
      (r.messages || []).map((m) => ({
        id: m.id,
        fromRole: m.fromRole,
        body: m.body,
      }))
    )
  }, [bookingId, sessionId])

  const applyPresence = React.useCallback(
    (p: {
      status?: string
      clientJoined?: boolean
      coachJoined?: boolean
    }) => {
      if (typeof p.clientJoined === "boolean") setClientJoined(p.clientJoined)
      if (typeof p.coachJoined === "boolean") setCoachJoined(p.coachJoined)
      if (p.status === "ACTIVE" && phase === "lobby") {
        /* statut DB ACTIVE n’impose pas encore le live tant que l’utilisateur n’a pas cliqué */
      }
    },
    [phase]
  )

  React.useEffect(() => {
    let cancelled = false
    const supabase = createClient()

    void markSessionJoinedAction({ sessionId, role }).then((r) => {
      if (cancelled) return
      if (r.error) {
        setError(r.error)
        return
      }
      applyPresence({
        status: r.status,
        clientJoined: r.clientJoined,
        coachJoined: r.coachJoined,
      })
    })
    void refreshMessages()

    const sync = async () => {
      const p = await getCoachingSessionPresenceAction(sessionId)
      if (cancelled || p.error) return
      applyPresence(p)
    }
    const poll = window.setInterval(() => void sync(), 2500)
    const msgPoll = window.setInterval(() => void refreshMessages(), 10_000)

    const presenceChannel = supabase.channel(`coaching-presence-${sessionId}`, {
      config: { presence: { key: selfId.current } },
    })

    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState() as Record<
          string,
          Array<{ role?: string }>
        >
        const roles = new Set<string>()
        for (const key of Object.keys(state)) {
          for (const meta of state[key] || []) {
            if (meta.role) roles.add(meta.role)
          }
        }
        const other = role === "client" ? "coach" : "client"
        setPeerOnline(roles.has(other))
      })
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "coaching_sessions",
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          const row = payload.new as {
            status?: string
            client_joined_at?: string | null
            coach_joined_at?: string | null
          }
          applyPresence({
            status: row.status,
            clientJoined: Boolean(row.client_joined_at),
            coachJoined: Boolean(row.coach_joined_at),
          })
        }
      )
      .subscribe(async (state) => {
        if (state !== "SUBSCRIBED" || cancelled) return
        await presenceChannel.track({ role, at: Date.now() })
      })

    return () => {
      cancelled = true
      window.clearInterval(poll)
      window.clearInterval(msgPoll)
      void presenceChannel.untrack()
      void supabase.removeChannel(presenceChannel)
    }
  }, [sessionId, role, applyPresence, refreshMessages])

  React.useEffect(() => {
    if (phase === "live") return
    if (!bothReady) return
    if (openingRef.current) return
    openingRef.current = true

    void (async () => {
      const started = await startActiveSessionAction(sessionId)
      if (started.error && !started.status) {
        setError(started.error)
        openingRef.current = false
        return
      }
      openingRef.current = false
    })()
  }, [bothReady, phase, sessionId])

  const enterLive = React.useCallback(async () => {
    setError("")
    setBusy(true)
    const started = await startActiveSessionAction(sessionId)
    if (started.error && !started.status) {
      setError(started.error)
      setBusy(false)
      return
    }
    const roomRes = await issueCoachingMediaRoomAction({ sessionId, role })
    if (roomRes.error || !roomRes.room) {
      setError(roomRes.error || "Salle indisponible.")
      setBusy(false)
      return
    }
    setMediaRoom({
      url: roomRes.room.url,
      token: roomRes.room.token,
      displayName: roomRes.room.displayName,
    })
    setPhase("live")
    setBusy(false)
  }, [sessionId, role])

  React.useEffect(() => {
    if (phase !== "live" || mediaRoom) return
    let cancelled = false
    void issueCoachingMediaRoomAction({ sessionId, role }).then((r) => {
      if (cancelled) return
      if (r.error || !r.room) {
        setError(r.error || "Salle indisponible.")
        setPhase("lobby")
        return
      }
      setMediaRoom({
        url: r.room.url,
        token: r.room.token,
        displayName: r.room.displayName,
      })
    })
    return () => {
      cancelled = true
    }
  }, [phase, mediaRoom, sessionId, role])

  const onMediaJoined = React.useCallback(() => {
    setMediaJoined(true)
  }, [])

  const onPeerPresent = React.useCallback(() => {
    setPeerInRoom(true)
  }, [])

  React.useEffect(() => {
    if (!mediaJoined || audioMarkedRef.current) return
    if (!peerInRoom && !peerOnline) return
    audioMarkedRef.current = true
    void markSessionAudioStartedAction(sessionId).then((r) => {
      if (r.startedAt) setStartedAt(r.startedAt)
      if (r.error) {
        audioMarkedRef.current = false
        setError(r.error)
      }
    })
  }, [mediaJoined, peerInRoom, peerOnline, sessionId])

  const finishComplete = React.useCallback(async () => {
    if (endingRef.current) return
    endingRef.current = true
    mediaRef.current?.hangup()
    const done = await completeSessionAction({
      sessionId,
      consumeCredits: true,
    })
    if (done.completed) {
      onEnded({ aborted: false })
      return
    }
    endingRef.current = false
    autoCompleteRef.current = false
    setError(done.error || "Impossible de valider la séance.")
  }, [sessionId, onEnded])

  React.useEffect(() => {
    if (phase !== "live") return
    let cancelled = false
    const tick = async () => {
      const r = await getSessionRuntimeAction(sessionId)
      if (cancelled || r.error) return
      if (r.startedAt) setStartedAt(r.startedAt)
      if (typeof r.displayedMinutes === "number") {
        setDisplayedMinutes(r.displayedMinutes)
      }
      if (typeof r.remainingMs === "number") setRemainingMs(r.remainingMs)
      if (typeof r.canComplete === "boolean") setCanComplete(r.canComplete)

      if (r.canComplete && !autoCompleteRef.current) {
        autoCompleteRef.current = true
        await finishComplete()
      }
    }
    void tick()
    const t = window.setInterval(() => void tick(), 2000)
    return () => {
      cancelled = true
      window.clearInterval(t)
    }
  }, [phase, sessionId, finishComplete])

  const hangUp = async () => {
    setBusy(true)
    mediaRef.current?.hangup()

    const runtime = await getSessionRuntimeAction(sessionId)
    if (runtime.canComplete) {
      await finishComplete()
      setBusy(false)
      return
    }

    await abortSessionAction({
      sessionId,
      reason: startedAt ? "left_before_duration" : "never_connected_audio",
    })
    setBusy(false)
    onEnded({ aborted: true })
  }

  const leaveLobby = () => {
    void leaveWaitingRoomAction({ sessionId, role }).finally(() => {
      if (onLeaveWaiting) onLeaveWaiting()
      else onEnded({ aborted: true })
    })
  }

  const templates = COACHING_CANNED_TEMPLATES[role]

  const formatRemain = (ms: number | null) => {
    if (ms == null) return null
    const total = Math.ceil(ms / 1000)
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${m}:${String(s).padStart(2, "0")}`
  }

  if (phase === "lobby") {
    const showOther =
      role === "client"
        ? Boolean(coachJoined && peerOnline)
        : Boolean(clientJoined && peerOnline)

    return (
      <div className="space-y-4">
        <CoachingSessionLobby
          role={role}
          clientJoined={role === "client" ? true : showOther || clientJoined}
          coachJoined={role === "coach" ? true : showOther || coachJoined}
          peerReady={bothReady}
          entering={busy}
          onEnter={() => void enterLive()}
        />
        {error ? (
          <p className="text-sm text-amber-900 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2">
            {error}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={leaveLobby}
            className="inline-flex h-11 items-center rounded-xl border border-[#2D1020]/25 bg-white px-4 text-sm font-semibold text-[#2D1020]"
          >
            Quitter la salle d’attente
          </button>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {bothReady
            ? "Cliquez sur « Entrer en séance » — audio dans KELIAA (LiveKit gratuit, sans Google / GitHub / carte)."
            : `Restez ici. Dès que ${role === "client" ? "le coach" : "le membre"} arrive, le bouton pour entrer apparaîtra.`}
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-[#2D1020]/25 bg-gradient-to-br from-[#2D1020] via-[#3D1830] to-[#2D1020] text-[#F2EBE0] overflow-hidden">
      <div className="p-4 sm:p-5 space-y-3 border-b border-white/10">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF72]">
              Salle de coaching
            </p>
            <h2 className="font-serif text-xl sm:text-2xl font-bold mt-1">
              {startedAt
                ? "Séance en cours"
                : peerInRoom
                  ? "Démarrage du chrono…"
                  : mediaJoined
                    ? "En attente de l’autre personne dans la salle…"
                    : "Ouverture de la salle…"}
            </h2>
            <p className="text-sm text-white/70 mt-1">
              {displayedMinutes} min prévues
              {mediaJoined ? " · vous êtes dans la salle" : ""}
              {peerInRoom ? " · les deux sont présents" : ""}
            </p>
          </div>

          {startedAt ? (
            <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 min-w-[140px]">
              <p className="text-[10px] uppercase tracking-wider text-[#D4AF72] font-bold">
                Temps restant
              </p>
              <p className="font-mono text-3xl font-bold mt-1 tabular-nums">
                {formatRemain(remainingMs) ?? "…"}
              </p>
              <p className="text-[11px] text-white/60 mt-1">
                {canComplete
                  ? "C’est bon — validation…"
                  : "Fin automatique à 0:00"}
              </p>
            </div>
          ) : null}
        </div>

        {error ? (
          <p className="text-xs text-amber-200/90 rounded-xl border border-amber-200/30 bg-amber-500/10 px-3 py-2">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void hangUp()}
            disabled={busy}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#D4AF72] px-4 text-sm font-bold text-[#2D1020] disabled:opacity-60"
          >
            <PhoneOff className="h-4 w-4" />
            {canComplete ? "Terminer · valider" : "Quitter (sans valider)"}
          </button>
        </div>
      </div>

      <div className="relative bg-black">
        {mediaRoom ? (
          <CoachingLiveKitRoom
            ref={mediaRef}
            url={mediaRoom.url}
            token={mediaRoom.token}
            displayName={mediaRoom.displayName}
            onJoined={onMediaJoined}
            onPeerPresent={onPeerPresent}
            onFatalError={(msg) => setError(msg)}
          />
        ) : (
          <div className="flex min-h-[360px] items-center justify-center text-sm text-white/70">
            Chargement de la salle…
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6 space-y-4 bg-[#F2EBE0] text-[#2D1020]">
        <CoachingLiveTranscript
          sessionId={sessionId}
          role={role}
          active={mediaJoined}
        />

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B8954A]">
            Messages
          </p>
          <h3 className="font-serif text-lg font-bold text-[#2D1020]">
            Échanges dans KELIAA
          </h3>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto rounded-xl border bg-white p-3">
          {messages.length === 0 ? (
            <p className="text-xs text-muted-foreground">Aucun message encore.</p>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className="rounded-lg border border-[#B8954A]/20 bg-[#F2EBE0] px-3 py-2 text-sm"
              >
                <p className="text-[10px] uppercase tracking-wider text-[#8A6A2E] font-semibold">
                  {m.fromRole === "coach" ? "Message du coach" : "Vos messages"}
                </p>
                <p className="mt-0.5">{m.body}</p>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              disabled={sending}
              onClick={async () => {
                setSending(true)
                await sendCannedMessageAction({
                  role,
                  templateId: t.id,
                  bookingId,
                  sessionId,
                })
                setSending(false)
                void refreshMessages()
              }}
              className="rounded-xl border border-[#2D1020]/25 bg-white px-3 py-2 text-xs font-semibold hover:bg-[#2D1020]/5 disabled:opacity-50"
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
