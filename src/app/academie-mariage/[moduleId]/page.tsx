import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { MemberPage } from "@/components/layout/MemberPage"
import { AcademyCoachingCta } from "@/components/academy/AcademyCoachingCta"
import { ModuleProgressBar } from "@/components/academy/AcademyProgress"
import {
  academyLessonPath,
} from "@/lib/academy/modules"
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

  return (
    <MemberPage>
      <div className="max-w-3xl mx-auto space-y-8 pb-10">
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
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Leçon {i + 1}
                  {lesson.isFreePreview ? " · Aperçu" : ""}
                  {" · "}
                  {lesson.durationMin} min
                  {!lesson.videoUrl ? " · Texte" : " · Vidéo"}
                </p>
                <h2 className="font-serif text-lg font-bold truncate">{lesson.title}</h2>
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
