"use client"

import * as React from "react"
import Link from "next/link"
import { Loader2, Mic, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatVoiceDuration, VOICE_NOTE_MAX_DURATION_MS } from "@/lib/messaging/voiceNotes"

function pickMime(): string {
  if (typeof MediaRecorder === "undefined") return ""
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ]
  return candidates.find((m) => MediaRecorder.isTypeSupported(m)) || ""
}

type BrowserSpeech = {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((ev: {
    results: ArrayLike<{ 0?: { transcript?: string } }>
  }) => void) | null
  start: () => void
  stop: () => void
}

function startBrowserSpeech(onText: (text: string) => void): { stop: () => void } | null {
  const w = window as unknown as {
    SpeechRecognition?: new () => BrowserSpeech
    webkitSpeechRecognition?: new () => BrowserSpeech
  }
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition
  if (!Ctor) return null
  try {
    const recg = new Ctor()
    recg.lang = "fr-FR"
    recg.continuous = true
    recg.interimResults = true
    recg.onresult = (ev) => {
      let out = ""
      for (let i = 0; i < ev.results.length; i++) {
        out += ev.results[i]?.[0]?.transcript || ""
      }
      onText(out)
    }
    recg.start()
    return recg
  } catch {
    return null
  }
}

export function VoiceNoteRecorder({
  enabled,
  disabled,
  isSending,
  onSend,
}: {
  enabled: boolean
  disabled: boolean
  isSending: boolean
  onSend: (blob: Blob, durationMs: number, transcript: string) => Promise<void>
}) {
  const [phase, setPhase] = React.useState<"idle" | "recording" | "sending">("idle")
  const [elapsed, setElapsed] = React.useState(0)
  const [error, setError] = React.useState("")
  const [showPremiumHint, setShowPremiumHint] = React.useState(false)
  const recorderRef = React.useRef<MediaRecorder | null>(null)
  const chunksRef = React.useRef<Blob[]>([])
  const streamRef = React.useRef<MediaStream | null>(null)
  const startedAtRef = React.useRef(0)
  const timerRef = React.useRef<number | null>(null)
  const transcriptRef = React.useRef("")
  const recognitionRef = React.useRef<{ stop: () => void } | null>(null)
  const onSendRef = React.useRef(onSend)
  onSendRef.current = onSend

  const stopTracks = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const stopRecognition = () => {
    try {
      recognitionRef.current?.stop()
    } catch {
      /* already stopped */
    }
    recognitionRef.current = null
  }

  React.useEffect(() => {
    return () => {
      clearTimer()
      stopTracks()
      stopRecognition()
    }
  }, [])

  const finishRecording = React.useCallback(() => {
    clearTimer()
    const rec = recorderRef.current
    if (rec && rec.state !== "inactive") rec.stop()
  }, [])

  const startRecording = async () => {
    setError("")
    if (!enabled) return
    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("Votre navigateur ne permet pas d’enregistrer un vocal.")
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const mime = pickMime()
      const rec = mime
        ? new MediaRecorder(stream, { mimeType: mime })
        : new MediaRecorder(stream)
      chunksRef.current = []
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      rec.onstop = () => {
        stopRecognition()
        stopTracks()
        const type = rec.mimeType || mime || "audio/webm"
        const blob = new Blob(chunksRef.current, { type })
        const ms = Math.min(
          VOICE_NOTE_MAX_DURATION_MS,
          Date.now() - startedAtRef.current
        )
        if (blob.size < 400) {
          setPhase("idle")
          setElapsed(0)
          setError("Enregistrement trop court.")
          return
        }
        setPhase("sending")
        void onSendRef
          .current(blob, ms, transcriptRef.current.trim())
          .then(() => {
            setPhase("idle")
            setElapsed(0)
          })
          .catch(() => {
            setPhase("idle")
            setElapsed(0)
            setError("Échec d’envoi. Réessayez.")
          })
      }
      recorderRef.current = rec
      startedAtRef.current = Date.now()
      transcriptRef.current = ""
      recognitionRef.current = startBrowserSpeech((text) => {
        transcriptRef.current = text
      })
      rec.start(200)
      setElapsed(0)
      setPhase("recording")
      timerRef.current = window.setInterval(() => {
        const ms = Date.now() - startedAtRef.current
        setElapsed(ms)
        if (ms >= VOICE_NOTE_MAX_DURATION_MS) finishRecording()
      }, 200)
    } catch {
      setError("Micro refusé. Autorisez le microphone pour envoyer un vocal.")
      stopTracks()
    }
  }

  const cancelRecording = () => {
    clearTimer()
    stopRecognition()
    const rec = recorderRef.current
    if (rec && rec.state !== "inactive") {
      rec.onstop = () => {
        stopTracks()
        chunksRef.current = []
        setPhase("idle")
        setElapsed(0)
      }
      rec.stop()
    } else {
      stopTracks()
      setPhase("idle")
      setElapsed(0)
    }
  }

  if (!enabled) {
    return (
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => setShowPremiumHint((v) => !v)}
          className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-border/80 text-muted-foreground opacity-55 hover:opacity-80 shrink-0"
          aria-label="Fonctionnalité Premium"
          title="Fonctionnalité Premium"
        >
          <Mic className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#5C1F28] text-[9px] text-white">
            🔒
          </span>
        </button>
        {showPremiumHint ? (
          <div className="absolute bottom-14 right-0 z-20 w-44 rounded-xl border border-border bg-[#FBF9F6] p-3 shadow-md">
            <p className="text-xs font-semibold text-foreground">
              Fonctionnalité Premium
            </p>
            <Link
              href="/premium"
              className="mt-2 inline-flex text-[11px] font-bold text-[#5C1F28] underline underline-offset-2"
            >
              Découvrir Premium
            </Link>
          </div>
        ) : null}
      </div>
    )
  }

  if (phase === "recording") {
    return (
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs font-medium text-destructive tabular-nums min-w-[2.5rem]">
          {formatVoiceDuration(elapsed)}
        </span>
        <Button
          type="button"
          variant="destructive"
          className="h-12 w-12 rounded-xl"
          onClick={finishRecording}
          aria-label="Arrêter et envoyer"
          title="Arrêter et envoyer"
        >
          <Square className="h-4 w-4 fill-current" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="h-12 px-2 rounded-xl text-xs"
          onClick={cancelRecording}
          aria-label="Annuler"
        >
          Annuler
        </Button>
      </div>
    )
  }

  if (phase === "sending" || isSending) {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/80 shrink-0">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="shrink-0">
      <Button
        type="button"
        variant="outline"
        className="h-12 w-12 rounded-xl border-border/80"
        disabled={disabled || isSending}
        onClick={() => void startRecording()}
        aria-label="Enregistrer un vocal"
        title="Vocal (max 60 s)"
      >
        <Mic className="h-4 w-4" />
      </Button>
      {error ? (
        <p className="text-[10px] text-destructive mt-1 max-w-[9rem]">{error}</p>
      ) : null}
    </div>
  )
}
