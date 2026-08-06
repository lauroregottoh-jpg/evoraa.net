import Link from "next/link"
import { CalendarClock } from "lucide-react"
import { COACHING_PACKS, COACHING_SESSION_MINUTES } from "@/lib/billing/coachingOffers"

type Props = {
  moduleTitle: string
  moduleId: string
}

export function AcademyCoachingCta({ moduleTitle, moduleId }: Props) {
  const href = `/coaching?module=${encodeURIComponent(moduleId)}&moduleTitle=${encodeURIComponent(moduleTitle)}`
  const preview = COACHING_PACKS.filter((p) =>
    ["c1", "c4", "c12"].includes(p.id)
  )

  return (
    <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5 space-y-4">
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">
          Coaching payant · {COACHING_SESSION_MINUTES} min / séance
        </p>
        <p className="font-serif text-lg font-bold">Besoin d&apos;un accompagnement humain ?</p>
        <p className="text-sm text-muted-foreground">
          Hors Alliance. Visio ou téléphone. Après paiement, un formulaire recueille vos
          disponibilités.
        </p>
      </div>

      <ul className="space-y-2">
        {preview.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-2.5"
          >
            <div>
              <p className="text-sm font-semibold">{p.label}</p>
              <p className="text-[11px] text-muted-foreground">{p.hint}</p>
            </div>
            <p className="text-sm font-bold text-primary shrink-0">
              {p.amountXof.toLocaleString("fr-FR")} FCFA
            </p>
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 h-11 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
      >
        <CalendarClock className="h-4 w-4" /> Voir tous les packs et payer
      </Link>
    </div>
  )
}
