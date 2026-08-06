"use client"

import { BookOpen, Sparkles } from "lucide-react"
import { getWeeklyMeditation } from "@/lib/editorial/library"

/** Réflexion de la semaine — titres clairs + geste concret. */
export function EvaWeeklyReflection() {
  const m = getWeeklyMeditation()

  return (
    <section className="rounded-2xl border border-accent/40 bg-gradient-to-br from-accent/10 via-card to-card p-5 sm:p-6 space-y-4">
      <div className="flex items-center gap-2 text-accent">
        <Sparkles className="h-4 w-4" />
        <span className="text-[10px] uppercase tracking-widest font-bold">
          Réflexion de la semaine
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground leading-tight">
          {m.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{m.body}</p>
      </div>

      <div className="flex items-start gap-2 text-xs italic text-foreground/90 border-t border-border/50 pt-3">
        <BookOpen className="h-4 w-4 text-accent shrink-0 mt-0.5 not-italic" />
        <span>
          « {m.verse} » ({m.verseRef})
        </span>
      </div>

      <p className="text-xs font-medium rounded-xl bg-secondary/50 border border-border px-3 py-2.5 leading-relaxed">
        {m.practice}
      </p>
    </section>
  )
}
