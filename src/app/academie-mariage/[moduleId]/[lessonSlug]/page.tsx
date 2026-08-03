import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { MemberPage } from "@/components/layout/MemberPage"
import { AcademyVideoSlot } from "@/components/academy/AcademyVideoSlot"
import { AcademyLessonArticle } from "@/components/academy/AcademyLessonArticle"
import { AcademyCoachingCta } from "@/components/academy/AcademyCoachingCta"
import { MarkLessonDoneButton } from "@/components/academy/AcademyProgress"
import { AcademySelfCheckBox } from "@/components/academy/AcademySelfCheck"
import {
  academyLessonPath,
  academyModulePath,
} from "@/lib/academy/modules"
import { getPublishedLesson } from "@/lib/academy/published"
import { loadPublicCms } from "@/lib/admin/loadCms"

export default async function AcademyLessonPage({
  params,
}: {
  params: Promise<{ moduleId: string; lessonSlug: string }>
}) {
  const { moduleId, lessonSlug } = await params
  const cms = await loadPublicCms()
  const data = getPublishedLesson(moduleId, lessonSlug, cms.academyOverrides)
  if (!data) notFound()

  const { module: mod, lesson, index, prev, next } = data

  return (
    <MemberPage>
      <div className="max-w-2xl mx-auto space-y-8 pb-12">
        <header className="space-y-3">
          <Link
            href={academyModulePath(mod.id)}
            className="inline-flex items-center text-xs text-muted-foreground hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" /> {mod.title}
          </Link>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Module · Leçon {index + 1}/{mod.lessons.length}
          </p>
          <h1 className="font-serif text-3xl sm:text-[2.5rem] font-bold leading-[1.15] tracking-tight">
            {lesson.title}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">{lesson.subtitle}</p>
        </header>

        <AcademyVideoSlot lesson={lesson} />

        <AcademyLessonArticle lesson={lesson}>
          <section className="rounded-2xl border border-border bg-card/80 p-5 sm:p-6 space-y-3 relative overflow-hidden">
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl"
              aria-hidden
            />
            <h2 className="font-serif text-xl font-bold relative">À retenir</h2>
            <div className="space-y-3 relative">
              {lesson.keyPoints.map((p) => (
                <p key={p.slice(0, 40)} className="text-[16px] leading-[1.75] text-foreground/90">
                  {p}
                </p>
              ))}
            </div>
          </section>

          {lesson.resources.length > 0 ? (
            <section className="rounded-2xl border border-border bg-card p-5 space-y-3">
              <h2 className="font-serif text-lg font-bold">Ressources pratiques</h2>
              <ul className="space-y-3">
                {lesson.resources.map((r) => (
                  <li key={r.label} className="text-sm">
                    <p className="font-semibold text-foreground">{r.label}</p>
                    <p className="text-muted-foreground mt-0.5 leading-snug">{r.detail}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </AcademyLessonArticle>

        <AcademySelfCheckBox
          moduleId={mod.id}
          lessonSlug={lesson.slug}
          selfCheck={lesson.selfCheck}
        />

        <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6 space-y-2">
          <h2 className="font-serif text-xl font-bold">Exercice de la semaine</h2>
          <p className="text-[16px] leading-[1.75]">{lesson.exercise}</p>
        </section>

        <div className="flex flex-col sm:flex-row gap-3">
          <MarkLessonDoneButton moduleId={mod.id} lessonSlug={lesson.slug} />
        </div>

        <AcademyCoachingCta moduleId={mod.id} moduleTitle={mod.title} />

        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2 border-t border-border">
          {prev ? (
            <Link
              href={academyLessonPath(mod.id, prev.slug)}
              className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={academyLessonPath(mod.id, next.slug)}
              className="inline-flex items-center text-sm font-semibold text-primary"
            >
              {next.title} <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          ) : (
            <Link
              href={academyModulePath(mod.id)}
              className="inline-flex items-center text-sm font-semibold text-primary"
            >
              Retour au module <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          )}
        </div>
      </div>
    </MemberPage>
  )
}
