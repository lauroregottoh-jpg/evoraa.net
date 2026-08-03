import Link from "next/link"
import { Phone } from "lucide-react"

type Props = {
  moduleTitle: string
  moduleId: string
}

/** Tarifs coaching humain — affichés clairement (payant). */
export const COACHING_PRICES = [
  {
    name: "Séance individuelle",
    detail: "45–60 min · visio ou téléphone",
    price: "15 000 FCFA",
  },
  {
    name: "Pack 3 séances",
    detail: "Suivi sur 1 mois environ",
    price: "40 000 FCFA",
  },
] as const

export function AcademyCoachingCta({ moduleTitle, moduleId }: Props) {
  const href = `/contact?subject=coaching&module=${encodeURIComponent(moduleId)}&moduleTitle=${encodeURIComponent(moduleTitle)}`

  return (
    <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5 space-y-4">
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">
          Coaching payant
        </p>
        <p className="font-serif text-lg font-bold">Besoin d&apos;un accompagnement humain ?</p>
        <p className="text-sm text-muted-foreground">
          Le coaching n&apos;est pas inclus dans Alliance. C&apos;est un service payant, à la
          demande. Écrivez à{" "}
          <a href="mailto:contact@keliaa.org" className="text-primary font-semibold underline-offset-2 hover:underline">
            contact@keliaa.org
          </a>
          .
        </p>
      </div>

      <ul className="space-y-2">
        {COACHING_PRICES.map((p) => (
          <li
            key={p.name}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-2.5"
          >
            <div>
              <p className="text-sm font-semibold">{p.name}</p>
              <p className="text-[11px] text-muted-foreground">{p.detail}</p>
            </div>
            <p className="text-sm font-bold text-primary shrink-0">{p.price}</p>
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 h-11 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
      >
        <Phone className="h-4 w-4" /> Demander un coaching
      </Link>
    </div>
  )
}
