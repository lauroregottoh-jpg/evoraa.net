import Link from "next/link"
import { Check } from "lucide-react"
import { cn } from "@/utils/cn"
import { ASSESSMENT_ORDER, ASSESSMENTS } from "@/lib/assessments/questionBank"

type Pillar = {
  slug: string
  completed: boolean
}

type PillarBadgesProps = {
  pillars: Pillar[]
  className?: string
}

/** Progression visuelle des 5 piliers — ludique sans être enfantin. */
export function PillarBadges({ pillars, className }: PillarBadgesProps) {
  const bySlug = new Map(pillars.map((p) => [p.slug, p.completed]))
  const done = pillars.filter((p) => p.completed).length

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Piliers de discernement
        </p>
        <p className="text-xs text-muted-foreground">
          {done}/5
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {ASSESSMENT_ORDER.map((slug) => {
          const completed = Boolean(bySlug.get(slug))
          const name = ASSESSMENTS[slug].name.split(" ")[0]
          return (
            <Link
              key={slug}
              href={completed ? "/assessments" : `/assessments/${slug}`}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                completed
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
              title={ASSESSMENTS[slug].name}
            >
              {completed ? <Check className="h-3 w-3" /> : null}
              {name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
