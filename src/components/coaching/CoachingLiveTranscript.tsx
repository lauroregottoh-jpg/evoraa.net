"use client"

import * as React from "react"
import { appendCoachingSessionTranscriptAction } from "@/lib/coaching/actions"

type SpeechRec = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  onresult: ((ev: { results: ArrayLike<{ 0?: { transcript?: string }; isFinal?: boolean }> }) => void) | null
  onerror: (() => void) | null
}

function getSpeechCtor(): (new () => SpeechRec) | null {
  if (typeof window === "undefined") return null
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRec
    webkitSpeechRecognition?: new () => SpeechRec
  }
  return w.SpeechRecognition || w.webkitSpeechRecognition || null
}

/**
 * Retranscrit la voix locale pendant la séance (Chrome/Edge).
 * Chaque participant envoie sa part — l’OPS voit le texte assemblé.
 */
export function CoachingLiveTranscript({
  sessionId,
  role,
  active,
}: {
  sessionId: string
  role: "client" | "coach"
  active: boolean
}) {
  const [supported, setSupported] = React.useState(false)
  const [listening, setListening] = React.useState(false)
  const [preview, setPreview] = React.useState("")
  const recRef = React.useRef<SpeechRec | null>(null)
  const bufferRef = React.useRef("")

  React.useEffect(() => {
    setSupported(Boolean(getSpeechCtor()))
  }, [])

  React.useEffect(() => {
    if (!active || !supported) return
    const Ctor = getSpeechCtor()
    if (!Ctor) return
    const rec = new Ctor()
    rec.lang = "fr-FR"
    rec.continuous = true
    rec.interimResults = true
    rec.onresult = (ev) => {
      let finalText = ""
      let interim = ""
      for (let i = 0; i < ev.results.length; i += 1) {
        const piece = ev.results[i]?.[0]?.transcript || ""
        if (ev.results[i]?.isFinal) finalText += `${piece} `
        else interim = piece
      }
      setPreview((finalText + interim).trim().slice(-400))
      if (finalText.trim()) {
        bufferRef.current += `${finalText.trim()} `
        const chunk = bufferRef.current.trim()
        if (chunk.length >= 40) {
          bufferRef.current = ""
          void appendCoachingSessionTranscriptAction({
            sessionId,
            role,
            chunk,
          })
        }
      }
    }
    rec.onerror = () => setListening(false)
    recRef.current = rec
    try {
      rec.start()
      setListening(true)
    } catch {
      setListening(false)
    }
    return () => {
      const leftover = bufferRef.current.trim()
      if (leftover) {
        void appendCoachingSessionTranscriptAction({
          sessionId,
          role,
          chunk: leftover,
        })
      }
      try {
        rec.stop()
      } catch {
        /* ignore */
      }
      recRef.current = null
      setListening(false)
    }
  }, [active, supported, sessionId, role])

  if (!active) return null

  return (
    <div className="rounded-xl border border-[#D7B866]/30 bg-[#EFE5DA] px-3 py-2.5 text-xs text-[#451923]">
      <p className="font-semibold">
        Transcription de la séance
        {listening ? " · en cours" : supported ? " · en pause" : " · non disponible ici"}
      </p>
      <p className="mt-1 text-[#451923]/75 leading-relaxed">
        {supported
          ? "Vous parlez dans KELIAA ; le texte est enregistré pour l’équipe (pas affiché à l’autre personne)."
          : "Ouvrez Chrome ou Edge pour la retranscription automatique. La salle audio fonctionne quand même."}
      </p>
      {preview ? (
        <p className="mt-2 italic line-clamp-3">« {preview} »</p>
      ) : null}
    </div>
  )
}
