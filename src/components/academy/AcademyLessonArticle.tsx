"use client"

import type { AcademyLesson } from "@/lib/academy/modules"
import { Clock } from "lucide-react"
import { cn } from "@/utils/cn"

type Props = {
  lesson: AcademyLesson
  children?: React.ReactNode
}

/**
 * Mise en page lisible d'une leçon longue : intro, objectifs, sections numérotées.
 */
export function AcademyLessonArticle({ lesson, children }: Props) {
  return (
    <article className="space-y-10">
      <div className="academy-fade-up flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Clock className="h-3.5 w-3.5 text-primary" />
        <span>Lecture ~{lesson.durationMin} min</span>
      </div>

      {lesson.intro?.length ? (
        <div className="academy-fade-up space-y-4" style={{ animationDelay: "60ms" }}>
          {lesson.intro.map((p) => (
            <p
              key={p.slice(0, 48)}
              className="text-[17px] sm:text-lg leading-[1.75] text-foreground/90"
            >
              {p}
            </p>
          ))}
        </div>
      ) : null}

      {lesson.learningGoals?.length ? (
        <section
          className="academy-fade-up rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.06] to-transparent p-5 sm:p-6 space-y-3"
          style={{ animationDelay: "110ms" }}
        >
          <h2 className="font-serif text-xl font-bold">Ce que tu vas apprendre</h2>
          <ul className="space-y-2.5">
            {lesson.learningGoals.map((g) => (
              <li key={g} className="flex gap-3 text-sm sm:text-[15px] leading-relaxed">
                <span
                  className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0"
                  aria-hidden
                />
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {lesson.sections.map((section, i) => (
        <section
          key={section.title}
          className={cn("academy-fade-up space-y-4 scroll-mt-24")}
          style={{ animationDelay: `${150 + i * 70}ms` }}
        >
          <div className="flex items-start gap-3">
            <span
              className={cn(
                "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                "bg-primary/10 text-primary text-sm font-bold font-serif"
              )}
            >
              {i + 1}
            </span>
            <h2 className="font-serif text-2xl font-bold leading-snug pt-0.5">
              {section.title}
            </h2>
          </div>
          {section.body?.map((p) => (
            <p
              key={p.slice(0, 40)}
              className="text-[16px] sm:text-[17px] leading-[1.8] text-foreground/90 pl-0 sm:pl-11"
            >
              {p}
            </p>
          ))}
          {section.points?.length ? (
            <ul className="space-y-2 pl-0 sm:pl-11">
              {section.points.map((p) => (
                <li key={p} className="text-sm flex gap-2 leading-snug">
                  <span className="text-accent font-bold shrink-0">·</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      {children}
    </article>
  )
}
