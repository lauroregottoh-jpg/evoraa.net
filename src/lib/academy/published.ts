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
  const module = getPublishedModule(moduleId, overrides)
  if (!module) return undefined
  const index = module.lessons.findIndex((l) => l.slug === lessonSlug)
  if (index < 0) return undefined
  const lesson = module.lessons[index]
  return {
    module,
    lesson,
    index,
    prev: index > 0 ? module.lessons[index - 1] : null,
    next: index < module.lessons.length - 1 ? module.lessons[index + 1] : null,
  }
}
