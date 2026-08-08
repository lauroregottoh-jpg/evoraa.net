import Link from "next/link"
import { MemberPage } from "@/components/layout/MemberPage"
import { CoupleShell } from "@/components/couple/CoupleShell"

const TIMELINE = [
  "Achat confirmé",
  "Invitation du partenaire",
  "Questionnaires individuels",
  "Analyse croisée",
  "Rapport & exercices",
]

export default function CoupleOnboardingPage() {
  return (
    <MemberPage>
      <CoupleShell activeHref="/couple/espace">
        <div className="max-w-xl space-y-6">
          <h1 className="font-serif text-3xl font-bold">Vous êtes accompagnés</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Ce n’est pas un quiz rapide. C’est un bilan pensé pour deux personnes
            qui veulent comprendre leur dynamique et travailler concrètement.
          </p>
          <ul className="space-y-3">
            {TIMELINE.map((step, i) => (
              <li
                key={step}
                className="flex gap-3 items-start rounded-xl border border-border/60 bg-white/70 px-4 py-3"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <span className="text-sm font-medium pt-1">{step}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/couple/inviter"
            className="inline-flex h-11 items-center rounded-xl bg-primary text-primary-foreground px-5 text-sm font-semibold"
          >
            Inviter mon partenaire
          </Link>
        </div>
      </CoupleShell>
    </MemberPage>
  )
}
