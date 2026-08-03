import {
  ACADEMY_MODULES,
  type AcademyLesson,
  type AcademyModule,
} from "@/lib/academy/modules"
import type { AcademyOverrides } from "@/lib/admin/cms"

export function applyAcademyOverrides(
  overrides: AcademyOverrides,
  base: AcademyModule[] = ACADEMY_MODULES
): AcademyModule[] {
  return base.map((mod) => {
    const ov = overrides[mod.id]
    if (!ov) return mod
    const lessons = mod.lessons.map((lesson) => {
      const lo = ov.lessons?.[lesson.slug]
      if (!lo) return lesson
      const next: AcademyLesson = {
        ...lesson,
        title: lo.title ?? lesson.title,
        subtitle: lo.subtitle ?? lesson.subtitle,
        exercise: lo.exercise ?? lesson.exercise,
        durationMin: lo.durationMin ?? lesson.durationMin,
        videoUrl: lo.videoUrl !== undefined ? lo.videoUrl : lesson.videoUrl,
        keyPoints: lo.keyPoints?.length ? lo.keyPoints : lesson.keyPoints,
      }
      return next
    })
    return {
      ...mod,
      title: ov.title ?? mod.title,
      summary: ov.summary ?? mod.summary,
      lessons,
    }
  })
}

export function getPublishedModule(
  moduleId: string,
  overrides: AcademyOverrides
): AcademyModule | undefined {
  return applyAcademyOverrides(overrides).find((m) => m.id === moduleId)
}

export function getPublishedLesson(
  moduleId: string,
  lessonSlug: string,
  overrides: AcademyOverrides
) {
  const academyModule = getPublishedModule(moduleId, overrides)
  if (!academyModule) return undefined
  const index = academyModule.lessons.findIndex((l) => l.slug === lessonSlug)
  if (index < 0) return undefined
  const lesson = academyModule.lessons[index]
  return {
    module: academyModule,
    lesson,
    index,
    prev: index > 0 ? academyModule.lessons[index - 1] : null,
    next: index < academyModule.lessons.length - 1 ? academyModule.lessons[index + 1] : null,
  }
}
