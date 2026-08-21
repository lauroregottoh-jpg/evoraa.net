"use client"

import * as React from "react"
import Link from "next/link"
import { Mic, Square, Trash2, Send } from "lucide-react"
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
  const [phase, setPhase] = React.useState<"idle" | "recording" | "review">("idle")
  const [elapsed, setElapsed] = React.useState(0)
  const [error, setError] = React.useState("")
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const previewUrlRef = React.useRef<string | null>(null)
  const recorderRef = React.useRef<MediaRecorder | null>(null)
  const chunksRef = React.useRef<Blob[]>([])
  const streamRef = React.useRef<MediaStream | null>(null)
  const startedAtRef = React.useRef(0)
  const blobRef = React.useRef<Blob | null>(null)
  const durationRef = React.useRef(0)
  const timerRef = React.useRef<number | null>(null)
  const transcriptRef = React.useRef("")
  const recognitionRef = React.useRef<{ stop: () => void } | null>(null)

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
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
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
        blobRef.current = blob
        durationRef.current = ms
        const url = URL.createObjectURL(blob)
        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
        previewUrlRef.current = url
        setPreviewUrl(url)
        setPhase("review")
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

  const cancelReview = () => {
    blobRef.current = null
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    previewUrlRef.current = null
    setPreviewUrl(null)
    setPhase("idle")
    setElapsed(0)
  }

  const send = async () => {
    const blob = blobRef.current
    if (!blob) return
    await onSend(blob, durationRef.current, transcriptRef.current.trim())
    cancelReview()
  }

  if (!enabled) {
    return (
      <Link
        href="/billing"
        className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/80 text-muted-foreground hover:text-foreground hover:bg-secondary/60 shrink-0"
        title="Vocaux réservés à Alliance"
        aria-label="Vocaux réservés à Alliance"
      >
        <Mic className="h-4 w-4" />
      </Link>
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
          aria-label="Arrêter l’enregistrement"
        >
          <Square className="h-4 w-4 fill-current" />
        </Button>
      </div>
    )
  }

  if (phase === "review") {
    return (
      <div className="flex items-center gap-2 shrink-0">
        {previewUrl ? (
          <audio src={previewUrl} controls className="h-10 max-w-[140px]" />
        ) : null}
        <Button
          type="button"
          variant="ghost"
          className="h-12 w-12 rounded-xl"
          onClick={cancelReview}
          disabled={isSending}
          aria-label="Supprimer le vocal"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          className="h-12 px-4 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground"
          onClick={() => void send()}
          disabled={isSending}
        >
          <Send className="h-4 w-4" />
        </Button>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
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
