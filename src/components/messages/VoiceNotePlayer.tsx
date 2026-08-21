"use client"

import * as React from "react"
import { Pause, Play } from "lucide-react"
import { formatVoiceDuration } from "@/lib/messaging/voiceNotes"
import { cn } from "@/utils/cn"

export function VoiceNotePlayer({
  src,
  durationMs,
  onNeedSrc,
  mine,
}: {
  src: string | null
  durationMs: number | null
  onNeedSrc?: () => Promise<string | null>
  mine: boolean
}) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const [url, setUrl] = React.useState(src)
  const [playing, setPlaying] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    setUrl(src)
  }, [src])

  React.useEffect(() => {
    const el = audioRef.current
    if (!el) return
    const onTime = () => {
      const d = el.duration || (durationMs || 0) / 1000
      setProgress(d > 0 ? el.currentTime / d : 0)
    }
    const onEnd = () => {
      setPlaying(false)
      setProgress(0)
    }
    el.addEventListener("timeupdate", onTime)
    el.addEventListener("ended", onEnd)
    return () => {
      el.removeEventListener("timeupdate", onTime)
      el.removeEventListener("ended", onEnd)
    }
  }, [durationMs, url])

  const toggle = async () => {
    let next = url
    if (!next && onNeedSrc) {
      setLoading(true)
      try {
        next = await onNeedSrc()
        if (next) setUrl(next)
      } finally {
        setLoading(false)
      }
    }
    if (!next) return
    const el = audioRef.current
    if (!el) return
    if (el.src !== next) el.src = next
    if (playing) {
      el.pause()
      setPlaying(false)
      return
    }
    try {
      await el.play()
      setPlaying(true)
    } catch {
      setPlaying(false)
    }
  }

  const label = formatVoiceDuration(durationMs)

  return (
    <div className="flex items-center gap-3 min-w-[168px]">
      <audio ref={audioRef} preload="none" className="hidden" />
      <button
        type="button"
        onClick={() => void toggle()}
        disabled={loading}
        aria-label={playing ? "Pause" : "Écouter le vocal"}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full shrink-0 transition-colors",
          mine
            ? "bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
            : "bg-primary/15 text-primary hover:bg-primary/25"
        )}
      >
        {playing ? (
          <Pause className="h-4 w-4 fill-current" />
        ) : (
          <Play className="h-4 w-4 fill-current ml-0.5" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "h-1 rounded-full overflow-hidden",
            mine ? "bg-primary-foreground/25" : "bg-foreground/15"
          )}
        >
          <div
            className={cn(
              "h-full rounded-full",
              mine ? "bg-primary-foreground" : "bg-primary"
            )}
            style={{ width: `${Math.min(100, Math.round(progress * 100))}%` }}
          />
        </div>
        <p
          className={cn(
            "mt-1 text-[10px] font-medium tracking-wide",
            mine ? "text-primary-foreground/80" : "text-muted-foreground"
          )}
        >
          {loading ? "Chargement…" : `Vocal · ${label}`}
        </p>
      </div>
    </div>
  )
}
