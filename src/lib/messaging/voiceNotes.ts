export const VOICE_NOTE_MAX_DURATION_MS = 60_000
export const VOICE_NOTE_MAX_BYTES = 2_000_000
export const VOICE_NOTE_SIGNED_URL_SECONDS = 60 * 60
export const VOICE_NOTE_BUCKET = "voice-notes"

const ALLOWED_MIME = new Set([
  "audio/webm",
  "audio/webm;codecs=opus",
  "audio/mp4",
  "audio/mpeg",
  "audio/ogg",
  "audio/ogg;codecs=opus",
  "audio/wav",
  "audio/x-wav",
  "audio/mp3",
])

export function normalizeAudioMime(raw: string | null | undefined): string | null {
  const mime = (raw || "").split(";")[0].trim().toLowerCase()
  if (!mime) return null
  if (ALLOWED_MIME.has(raw!.toLowerCase()) || ALLOWED_MIME.has(mime)) {
    return mime
  }
  return null
}

export function extensionForMime(mime: string): string {
  if (mime.includes("webm")) return "webm"
  if (mime.includes("ogg")) return "ogg"
  if (mime.includes("mp4") || mime.includes("m4a") || mime.includes("aac")) {
    return "m4a"
  }
  if (mime.includes("mpeg") || mime.includes("mp3")) return "mp3"
  if (mime.includes("wav")) return "wav"
  return "webm"
}

export function formatVoiceDuration(ms: number | null | undefined): string {
  const total = Math.max(0, Math.round((Number(ms) || 0) / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function voicePreviewLabel(durationMs: number | null | undefined): string {
  return `Vocal · ${formatVoiceDuration(durationMs)}`
}
