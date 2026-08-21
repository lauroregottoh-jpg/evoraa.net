import { createAdminClient } from "@/utils/supabase/admin"
import { VOICE_NOTE_BUCKET, extensionForMime } from "@/lib/messaging/voiceNotes"

type TranscribeOk = { ok: true; text: string }
type TranscribeFail = { ok: false; status: number; detail: string }

async function postTranscription(input: {
  url: string
  key: string
  blob: Blob
  filename: string
  model: string
}): Promise<TranscribeOk | TranscribeFail> {
  const body = new FormData()
  body.append("file", input.blob, input.filename)
  body.append("model", input.model)
  body.append("language", "fr")

  const res = await fetch(input.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${input.key}` },
    body,
  })

  if (!res.ok) {
    const detail = (await res.text()).slice(0, 400)
    return { ok: false, status: res.status, detail }
  }

  const data = (await res.json()) as { text?: string }
  const text = (data.text || "").trim()
  if (!text) return { ok: false, status: res.status, detail: "empty transcript" }
  return { ok: true, text }
}

async function transcribeBlob(
  blob: Blob,
  filename: string
): Promise<TranscribeOk | TranscribeFail> {
  const groq = process.env.GROQ_API_KEY?.trim()
  if (groq) {
    const groqResult = await postTranscription({
      url: "https://api.groq.com/openai/v1/audio/transcriptions",
      key: groq,
      blob,
      filename,
      model: process.env.GROQ_TRANSCRIBE_MODEL?.trim() || "whisper-large-v3-turbo",
    })
    if (groqResult.ok) return groqResult
    console.error("[voice] groq", groqResult.status, groqResult.detail)
  }

  const openai = process.env.OPENAI_API_KEY?.trim()
  if (openai) {
    const model =
      process.env.OPENAI_TRANSCRIBE_MODEL?.trim() || "gpt-4o-mini-transcribe"
    let result = await postTranscription({
      url: "https://api.openai.com/v1/audio/transcriptions",
      key: openai,
      blob,
      filename,
      model,
    })
    if (!result.ok && result.status === 404 && model !== "whisper-1") {
      result = await postTranscription({
        url: "https://api.openai.com/v1/audio/transcriptions",
        key: openai,
        blob,
        filename,
        model: "whisper-1",
      })
    }
    return result
  }

  return { ok: false, status: 0, detail: "aucune clé Groq/OpenAI" }
}

function cleanClientTranscript(raw: string | null | undefined): string | null {
  const text = (raw || "").replace(/\s+/g, " ").trim()
  if (text.length < 2) return null
  return text.slice(0, 8000)
}

/** Retranscription ops — ne jamais afficher le texte au destinataire du fil. */
export async function transcribeStoredVoiceNote(input: {
  messageId: string
  audioPath: string
  mime: string | null
  clientTranscript?: string | null
}): Promise<void> {
  const admin = createAdminClient()
  const fallback = cleanClientTranscript(input.clientTranscript)

  const { data: file, error: dlErr } = await admin.storage
    .from(VOICE_NOTE_BUCKET)
    .download(input.audioPath)

  if (dlErr || !file) {
    console.error("[voice] download", dlErr?.message)
    await admin
      .from("messages")
      .update({
        transcript_text: fallback,
        transcript_status: fallback ? "ready" : "failed",
      })
      .eq("id", input.messageId)
    return
  }

  const mime = input.mime || file.type || "audio/webm"
  const filename = `vocal.${extensionForMime(mime)}`
  const result = await transcribeBlob(file, filename)

  if (result.ok) {
    const { error } = await admin
      .from("messages")
      .update({
        transcript_text: result.text.slice(0, 8000),
        transcript_status: "ready",
      })
      .eq("id", input.messageId)
    if (error) console.error("[voice] transcript save", error.message)
    return
  }

  console.error("[voice] transcribe", result.status, result.detail)
  await admin
    .from("messages")
    .update({
      transcript_text: fallback,
      transcript_status: fallback ? "ready" : result.status === 0 ? "none" : "failed",
    })
    .eq("id", input.messageId)
}

export { cleanClientTranscript }
