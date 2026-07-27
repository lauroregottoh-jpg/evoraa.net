"use client"

import * as React from "react"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils/cn"

const STORAGE_KEY = "keliaa_academy_progress"

function readProgress(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {}
  } catch {
    return {}
  }
}

export function lessonProgressKey(moduleId: string, lessonSlug: string) {
  return `${moduleId}:${lessonSlug}`
}

export function useLessonProgress(moduleId: string, lessonSlug: string) {
  const key = lessonProgressKey(moduleId, lessonSlug)
  const [done, setDone] = React.useState(false)

  React.useEffect(() => {
    setDone(Boolean(readProgress()[key]))
  }, [key])

  const markDone = () => {
    const next = { ...readProgress(), [key]: true }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setDone(true)
  }

  return { done, markDone }
}

export function ModuleProgressBar({
  moduleId,
  lessonSlugs,
}: {
  moduleId: string
  lessonSlugs: string[]
}) {
  const [doneCount, setDoneCount] = React.useState(0)

  React.useEffect(() => {
    const p = readProgress()
    setDoneCount(lessonSlugs.filter((s) => p[lessonProgressKey(moduleId, s)]).length)
  }, [moduleId, lessonSlugs])

  const pct = lessonSlugs.length
    ? Math.round((doneCount / lessonSlugs.length) * 100)
    : 0

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          Progression · {doneCount}/{lessonSlugs.length} leçons
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export function MarkLessonDoneButton({
  moduleId,
  lessonSlug,
}: {
  moduleId: string
  lessonSlug: string
}) {
  const { done, markDone } = useLessonProgress(moduleId, lessonSlug)

  return (
    <Button
      type="button"
      variant={done ? "outline" : "default"}
      className={cn("rounded-xl", done && "border-emerald-500/40 text-emerald-700 dark:text-emerald-300")}
      onClick={markDone}
      disabled={done}
    >
      <CheckCircle2 className="h-4 w-4 mr-2" />
      {done ? "Leçon terminée" : "Marquer comme vue"}
    </Button>
  )
}
