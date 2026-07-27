"use client"

import { Play, VideoOff } from "lucide-react"
import type { AcademyLesson } from "@/lib/academy/modules"

type Props = {
  lesson: Pick<AcademyLesson, "title" | "videoUrl" | "videoProvider" | "durationMin">
}

/**
 * Emplacement vidéo prêt pour YouTube / Vimeo / fichier.
 * Tant que videoUrl est vide : placeholder de test (pas de média).
 */
export function AcademyVideoSlot({ lesson }: Props) {
  const url = lesson.videoUrl?.trim()

  if (url) {
    const embed = toEmbedUrl(url, lesson.videoProvider)
    if (embed) {
      return (
        <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black">
          <iframe
            src={embed}
            title={lesson.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )
    }
    if (lesson.videoProvider === "file" || url.endsWith(".mp4")) {
      return (
        <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black">
          <video controls className="h-full w-full" src={url}>
            Votre navigateur ne lit pas la vidéo.
          </video>
        </div>
      )
    }
  }

  return (
    <div className="aspect-video w-full rounded-2xl border border-dashed border-border bg-secondary/40 flex flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
        {url ? <Play className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
      </div>
      <div className="space-y-1 max-w-sm">
        <p className="text-sm font-semibold">Vidéo à venir (~{lesson.durationMin} min)</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          L&apos;emplacement est prêt. Dès qu&apos;une URL YouTube / Vimeo (ou un fichier) est
          ajoutée dans le catalogue, elle s&apos;affiche ici automatiquement.
        </p>
      </div>
    </div>
  )
}

function toEmbedUrl(url: string, provider?: AcademyLesson["videoProvider"]): string | null {
  if (provider === "file") return null
  try {
    const u = new URL(url)
    if (u.hostname.includes("youtu")) {
      const id =
        u.searchParams.get("v") ||
        (u.hostname === "youtu.be" ? u.pathname.slice(1) : u.pathname.split("/").pop())
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (u.hostname.includes("vimeo")) {
      const id = u.pathname.split("/").filter(Boolean).pop()
      return id ? `https://player.vimeo.com/video/${id}` : null
    }
  } catch {
    return null
  }
  return null
}
