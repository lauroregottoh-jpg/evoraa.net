"use client"

import * as React from "react"
import { Flame } from "lucide-react"

const STORAGE_KEY = "KELLIA_presence_days"

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function yesterdayKey() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

/** Streak discret de présence (local) — sans gamification agressive. */
export function PresenceStreak() {
  const [streak, setStreak] = React.useState(0)

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const data = raw
        ? (JSON.parse(raw) as { last: string; count: number })
        : { last: "", count: 0 }
      const today = todayKey()
      const yesterday = yesterdayKey()

      let next = data.count
      if (data.last === today) {
        next = data.count
      } else if (data.last === yesterday) {
        next = data.count + 1
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ last: today, count: next }))
      } else {
        next = 1
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ last: today, count: next }))
      }
      setStreak(next)
    } catch {
      setStreak(1)
    }
  }, [])

  if (streak < 1) return null

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <Flame className="h-3.5 w-3.5 text-accent" />
      {streak === 1 ? "Présent(e) aujourd'hui" : `${streak} jours de présence`}
    </span>
  )
}
