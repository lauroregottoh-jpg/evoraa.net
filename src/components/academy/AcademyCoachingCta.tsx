import Link from "next/link"
import { CalendarClock } from "lucide-react"
import { getCoachingPacks } from "@/lib/billing/coachingOffers"

type Props = {
  moduleTitle: string
  moduleId: string
}

export function AcademyCoachingCta({ moduleTitle, moduleId }: Props) {
  const href = `/coaching?module=${encodeURIComponent(moduleId)}&moduleTitle=${encodeURIComponent(moduleTitle)}`
  const preview30 = getCoachingPacks(30).filter((p) => ["c1", "c4"].includes(p.id))
  const preview60 = getCoachingPacks(60).find((p) => p.id === "c1")

  return (
    <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5 space-y-4">
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">
          Coaching payant · 30 min ou 1 h
        </p>
        <p className="font-serif text-lg font-bold">Besoin d&apos;un accompagnement humain ?</p>
        <p className="text-sm text-muted-foreground">
          Hors Alliance. Visio ou téléphone. Après paiement, un formulaire recueille vos
          disponibilités.
        </p>
      </div>

      <ul className="space-y-2">
        {preview30.map((p) => (
          <li
            key={`30-${p.id}`}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-2.5"
          >
            <div>
              <p className="text-sm font-semibold">{p.label} · 30 min</p>
              <p className="text-[11px] text-muted-foreground">{p.hint}</p>
            </div>
            <p className="text-sm font-bold text-primary shrink-0">
              {p.amountXof.toLocaleString("fr-FR")} FCFA
            </p>
          </li>
        ))}
        {preview60 ? (
          <li className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-2.5">
            <div>
              <p className="text-sm font-semibold">1 séance · 1 h</p>
              <p className="text-[11px] text-muted-foreground">{preview60.hint}</p>
            </div>
            <p className="text-sm font-bold text-primary shrink-0">
              {preview60.amountXof.toLocaleString("fr-FR")} FCFA
            </p>
          </li>
        ) : null}
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
