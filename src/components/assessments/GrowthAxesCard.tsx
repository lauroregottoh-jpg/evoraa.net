import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { GrowthAxis } from "@/lib/assessments/growth"

export function GrowthAxesCard({ axes }: { axes: GrowthAxis[] }) {
  if (axes.length === 0) {
    return (
      <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-2">
        <h2 className="font-serif text-xl font-bold">Vos axes d&apos;amélioration</h2>
        <p className="text-sm text-muted-foreground">
          Pour l&apos;instant, vos réponses ne mettent pas en évidence de zone fragile. Continuez à
          grandir via l&apos;
          <Link href="/academie-mariage" className="text-primary font-semibold underline">
            Académie du mariage
          </Link>
          .
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-border bg-white p-5 sm:p-6 space-y-4">
      <div>
        <h2 className="font-serif text-xl font-bold">Vos axes d&apos;amélioration</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Points sur lesquels travailler — d&apos;après vos questionnaires. Ce n&apos;est pas un
          jugement : c&apos;est un chemin de croissance.
        </p>
      </div>
      <div className="space-y-3">
        {axes.map((axis) => (
          <div
            key={axis.id}
            className="rounded-xl border border-border/70 p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
          >
            <div className="min-w-0 space-y-1">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {axis.pillarName} · {axis.dimensionLabel} · score {axis.score}%
              </p>
              <p className="font-semibold text-sm">{axis.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{axis.advice}</p>
            </div>
            <Link
              href={axis.academyHref}
              className="shrink-0 inline-flex items-center text-xs font-semibold text-primary"
            >
              Module Académie <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </div>
        ))}
      </div>
      <Link
        href="/academie-mariage"
        className="inline-flex text-sm font-semibold text-accent hover:underline"
      >
        Voir toute l&apos;Académie du mariage →
      </Link>
    </section>
  )
}
