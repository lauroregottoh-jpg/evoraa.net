"use client"

import * as React from "react"
import type { AcademySelfCheck } from "@/lib/academy/modules"

export function AcademySelfCheckBox({
  moduleId,
  lessonSlug,
  selfCheck,
}: {
  moduleId: string
  lessonSlug: string
  selfCheck: AcademySelfCheck
}) {
  const storageKey = `keliaa_academy_check:${moduleId}:${lessonSlug}`
  const [checked, setChecked] = React.useState<boolean[]>(() =>
    selfCheck.items.map(() => false)
  )

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw) as boolean[]
        if (parsed.length === selfCheck.items.length) setChecked(parsed)
      }
    } catch {
      /* ignore */
    }
  }, [storageKey, selfCheck.items.length])

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = prev.map((v, idx) => (idx === i ? !v : v))
      localStorage.setItem(storageKey, JSON.stringify(next))
      return next
    })
  }

  const score = checked.filter(Boolean).length

  return (
    <section className="rounded-2xl border border-border bg-card p-5 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-serif text-lg font-bold">Auto-test</h2>
        <span className="text-xs text-muted-foreground">
          {score}/{selfCheck.items.length}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{selfCheck.prompt}</p>
      <ul className="space-y-2">
        {selfCheck.items.map((item, i) => (
          <li key={item}>
            <label className="flex items-start gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={checked[i] ?? false}
                onChange={() => toggle(i)}
                className="mt-1 h-4 w-4 rounded border-border accent-primary"
              />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  )
}
