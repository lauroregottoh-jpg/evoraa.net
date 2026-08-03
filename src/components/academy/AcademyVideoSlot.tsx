"use client"

import Image from "next/image"
import type { AcademyLesson } from "@/lib/academy/modules"

type Props = {
  lesson: Pick<
    AcademyLesson,
    "title" | "videoUrl" | "videoProvider" | "durationMin" | "coverImage"
  >
}

const DEFAULT_COVER = "/academy/academy-foi.png"

/**
 * Vidéo si URL présente, sinon couverture thématique du module.
 */
export function AcademyVideoSlot({ lesson }: Props) {
  const url = lesson.videoUrl?.trim()
  const cover = lesson.coverImage || DEFAULT_COVER

  if (url) {
    const embed = toEmbedUrl(url, lesson.videoProvider)
    if (embed) {
      return (
        <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black shadow-sm">
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
        <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black shadow-sm">
          <video controls className="h-full w-full" src={url}>
            Votre navigateur ne lit pas la vidéo.
          </video>
        </div>
      )
    }
  }

  return (
    <div className="relative aspect-[4/3] sm:aspect-video w-full overflow-hidden rounded-2xl border border-border shadow-sm group">
      <Image
        src={cover}
        alt=""
        fill
        priority
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        sizes="(max-width: 768px) 100vw, 720px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
        <p className="text-white/90 text-xs font-semibold uppercase tracking-widest mb-1">
          Ambiance du thème
        </p>
        <p className="text-white text-sm sm:text-base font-medium leading-snug drop-shadow">
          {lesson.title}
          {lesson.durationMin ? ` · ~${lesson.durationMin} min de lecture` : ""}
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
