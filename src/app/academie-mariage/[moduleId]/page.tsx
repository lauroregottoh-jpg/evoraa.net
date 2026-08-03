import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ChevronRight, Clock } from "lucide-react"
import { MemberPage } from "@/components/layout/MemberPage"
import { AcademyCoachingCta } from "@/components/academy/AcademyCoachingCta"
import { ModuleProgressBar } from "@/components/academy/AcademyProgress"
import { academyLessonPath } from "@/lib/academy/modules"
import { getPublishedModule } from "@/lib/academy/published"
import { loadPublicCms } from "@/lib/admin/loadCms"

export default async function AcademyModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>
}) {
  const { moduleId } = await params
  const cms = await loadPublicCms()
  const mod = getPublishedModule(moduleId, cms.academyOverrides)
  if (!mod) notFound()

  const slugs = mod.lessons.map((l) => l.slug)
  const cover = mod.lessons[0]?.coverImage

  return (
    <MemberPage>
      <div className="max-w-3xl mx-auto space-y-8 pb-10">
        {cover ? (
          <div className="relative h-44 sm:h-56 w-full overflow-hidden rounded-2xl border border-border">
            <Image
              src={cover}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          </div>
        ) : null}

        <div className="space-y-3">
          <Link
            href="/academie-mariage"
            className="inline-flex items-center text-xs text-muted-foreground hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Académie
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">{mod.title}</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">{mod.summary}</p>
          <ModuleProgressBar moduleId={mod.id} lessonSlugs={slugs} />
        </div>

        <div className="grid gap-3">
          {mod.lessons.map((lesson, i) => (
            <Link
              key={lesson.slug}
              href={academyLessonPath(mod.id, lesson.slug)}
              className="rounded-2xl border border-border bg-card p-4 sm:p-5 flex items-center justify-between gap-3 hover:border-primary/40 transition-colors"
            >
              <div className="min-w-0 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground inline-flex items-center gap-1.5">
                  Leçon {i + 1}
                  {lesson.isFreePreview ? " · Aperçu" : ""}
                  <span className="inline-flex items-center gap-1 normal-case font-semibold tracking-normal text-primary">
                    <Clock className="h-3 w-3" />~{lesson.durationMin} min
                  </span>
                </p>
                <h2 className="font-serif text-lg font-bold leading-snug">{lesson.title}</h2>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
            </Link>
          ))}
        </div>

        <AcademyCoachingCta moduleId={mod.id} moduleTitle={mod.title} />
      </div>
    </MemberPage>
  )
}
