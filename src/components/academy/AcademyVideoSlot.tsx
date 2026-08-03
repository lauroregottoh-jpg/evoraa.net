"use client"

import Image from "next/image"
import type { AcademyLesson } from "@/lib/academy/modules"

type Props = {
  lesson: Pick<
    AcademyLesson,
    "title" | "videoUrl" | "videoProvider" | "durationMin" | "coverImage"
  > & { coverImage?: string }
}

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1511632765486-a01980e01d4e?q=80&w=1600&auto=format&fit=crop"

/**
 * Affiche la vidéo si une URL est renseignée.
 * Sinon : image d’ambiance (pas de texte technique YouTube/Vimeo).
 */
export function AcademyVideoSlot({ lesson }: Props) {
  const url = lesson.videoUrl?.trim()
  const cover = (lesson as { coverImage?: string }).coverImage || DEFAULT_COVER

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
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border">
      <Image
        src={cover}
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 720px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <p className="absolute bottom-3 left-4 right-4 text-white text-sm font-medium drop-shadow">
        {lesson.title}
        {lesson.durationMin ? ` · ~${lesson.durationMin} min` : ""}
      </p>
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
