"use client"

import * as React from "react"
import {
  Room,
  RoomEvent,
  Track,
  type RemoteTrack,
  type RemoteTrackPublication,
  type RemoteParticipant,
} from "livekit-client"
import { Mic, MicOff } from "lucide-react"

export type CoachingLiveKitRoomHandle = {
  hangup: () => void
}

/**
 * Salle audio LiveKit 100 % dans KELIAA (pas d’iframe Daily/Meet).
 */
export const CoachingLiveKitRoom = React.forwardRef<
  CoachingLiveKitRoomHandle,
  {
    url: string
    token: string
    displayName: string
    onJoined?: () => void
    onPeerPresent?: () => void
    onFatalError?: (message: string) => void
  }
>(function CoachingLiveKitRoom(
  { url, token, displayName, onJoined, onPeerPresent, onFatalError },
  ref
) {
  const roomRef = React.useRef<Room | null>(null)
  const remoteAudioRef = React.useRef<HTMLAudioElement | null>(null)
  const peerNotifiedRef = React.useRef(false)
  const [connected, setConnected] = React.useState(false)
  const [muted, setMuted] = React.useState(false)
  const [peerLabel, setPeerLabel] = React.useState<string | null>(null)

  const onJoinedRef = React.useRef(onJoined)
  const onPeerPresentRef = React.useRef(onPeerPresent)
  const onFatalErrorRef = React.useRef(onFatalError)
  onJoinedRef.current = onJoined
  onPeerPresentRef.current = onPeerPresent
  onFatalErrorRef.current = onFatalError

  const notifyPeerIfReady = React.useCallback((room: Room) => {
    if (peerNotifiedRef.current) return
    const remotes = Array.from(room.remoteParticipants.values())
    if (remotes.length >= 1) {
      peerNotifiedRef.current = true
      const first = remotes[0]
      setPeerLabel(first.name || first.identity || "Participant")
      onPeerPresentRef.current?.()
    }
  }, [])

  const attachRemoteAudio = React.useCallback((track: RemoteTrack) => {
    if (track.kind !== Track.Kind.Audio) return
    const el = remoteAudioRef.current
    if (!el) return
    track.attach(el)
    void el.play().catch(() => undefined)
  }, [])

  React.useImperativeHandle(
    ref,
    () => ({
      hangup: () => {
        const room = roomRef.current
        roomRef.current = null
        try {
          room?.disconnect(true)
        } catch {
          /* ignore */
        }
      },
    }),
    []
  )

  React.useEffect(() => {
    let cancelled = false
    peerNotifiedRef.current = false
    const room = new Room({
      adaptiveStream: true,
      dynacast: true,
      audioCaptureDefaults: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    })
    roomRef.current = room

    const onTrackSubscribed = (
      track: RemoteTrack,
      _pub: RemoteTrackPublication,
      participant: RemoteParticipant
    ) => {
      attachRemoteAudio(track)
      setPeerLabel(participant.name || participant.identity || "Participant")
      notifyPeerIfReady(room)
    }

    const onParticipantConnected = () => {
      notifyPeerIfReady(room)
    }

    room.on(RoomEvent.TrackSubscribed, onTrackSubscribed)
    room.on(RoomEvent.ParticipantConnected, onParticipantConnected)
    room.on(RoomEvent.Disconnected, () => {
      if (!cancelled) setConnected(false)
    })

    void (async () => {
      try {
        await room.connect(url, token)
        if (cancelled) {
          room.disconnect(true)
          return
        }

        await room.localParticipant.setMicrophoneEnabled(true)
        if (cancelled) {
          room.disconnect(true)
          return
        }

        setConnected(true)
        onJoinedRef.current?.()
        notifyPeerIfReady(room)

        // Pistes déjà présentes
        for (const p of room.remoteParticipants.values()) {
          for (const pub of p.trackPublications.values()) {
            if (pub.track && pub.kind === Track.Kind.Audio) {
              attachRemoteAudio(pub.track as RemoteTrack)
            }
          }
        }
      } catch (e) {
        if (!cancelled) {
          const msg =
            e instanceof Error ? e.message : "Impossible d’ouvrir la salle."
          if (/NotAllowedError|Permission denied|NotAllowed/i.test(msg)) {
            onFatalErrorRef.current?.(
              "Le navigateur a refusé le micro. Autorisez le microphone pour keliaa.org puis réessayez."
            )
          } else {
            onFatalErrorRef.current?.(msg)
          }
        }
      }
    })()

    return () => {
      cancelled = true
      room.off(RoomEvent.TrackSubscribed, onTrackSubscribed)
      room.off(RoomEvent.ParticipantConnected, onParticipantConnected)
      try {
        room.disconnect(true)
      } catch {
        /* ignore */
      }
      if (roomRef.current === room) roomRef.current = null
    }
  }, [url, token, displayName, attachRemoteAudio, notifyPeerIfReady])

  const toggleMute = () => {
    const room = roomRef.current
    if (!room) return
    const next = !muted
    void room.localParticipant.setMicrophoneEnabled(!next)
    setMuted(next)
  }

  return (
    <div className="relative flex min-h-[280px] flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#2B2421] to-black px-4 py-10 sm:min-h-[360px]">
      <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />

      <div className="text-center space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E8D49A]">
          Audio LiveKit · dans KELIAA
        </p>
        <p className="font-serif text-xl font-bold text-[#FCFAF6]">
          {connected
            ? peerLabel
              ? `En ligne avec ${peerLabel}`
              : "Connecté — en attente de l’autre…"
            : "Connexion à la salle…"}
        </p>
        <p className="text-sm text-white/60 max-w-sm mx-auto">
          Connecté en tant que {displayName}. Micro géré ici — aucun Google,
          GitHub ni paiement tiers.
        </p>
      </div>

      <button
        type="button"
        onClick={toggleMute}
        disabled={!connected}
        className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        {muted ? "Micro coupé" : "Micro actif"}
      </button>
    </div>
  )
})
