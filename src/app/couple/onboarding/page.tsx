import Link from "next/link"
import { MemberPage } from "@/components/layout/MemberPage"
import { CoupleShell } from "@/components/couple/CoupleShell"
import { CoupleDeadlineBanner } from "@/components/couple/CoupleDeadlineBanner"
import { COUPLE_BRAND } from "@/lib/couple/config"

const TIMELINE = [
  {
    title: "Achat confirmé",
    body: "Votre bilan est ouvert. Bienvenue dans votre espace couple.",
  },
  {
    title: "Invitation du partenaire",
    body: "Partagez le lien ou le code — un seul achat couvre deux participants.",
  },
  {
    title: "Questionnaires individuels",
    body: "Chacun répond de son côté sous 30 jours (+ 10 j de marge). Les réponses brutes restent confidentielles.",
  },
  {
    title: "Analyse croisée",
    body: "Quand les deux ont terminé, nous croisons vos regards.",
  },
  {
    title: "Dossier livrables",
    body: "Rapport slides, cahier d’exercices, plan d’action et téléchargements.",
  },
]

export default function CoupleOnboardingPage() {
  return (
    <MemberPage>
      <CoupleShell activeHref="/couple/espace">
        <div className="max-w-xl space-y-6">
          <header className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              Onboarding · {COUPLE_BRAND}
            </p>
            <h1 className="font-serif text-3xl font-bold">
              Félicitations — votre bilan est débloqué
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ce n’est pas un quiz rapide. C’est un parcours pensé pour deux
              personnes qui veulent comprendre leur dynamique et avancer avec
              clarté.
            </p>
          </header>

          <CoupleDeadlineBanner variant="warning" />

          <ul className="space-y-3">
            {TIMELINE.map((step, i) => (
              <li
                key={step.title}
                className="flex gap-3 items-start rounded-xl border border-border/60 bg-white/70 px-4 py-3"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/couple/dossier"
              className="inline-flex h-11 items-center rounded-xl border border-[#B8954A]/40 bg-[#B8954A]/10 px-5 text-sm font-semibold text-[#7F5557]"
            >
              Voir le dossier
            </Link>
            <Link
              href="/couple/inviter"
              className="inline-flex h-11 items-center rounded-xl bg-primary text-primary-foreground px-5 text-sm font-semibold"
            >
              Inviter mon partenaire
            </Link>
            <Link
              href="/couple/questionnaire"
              className="inline-flex h-11 items-center rounded-xl border px-5 text-sm font-semibold"
            >
              Commencer mon questionnaire
            </Link>
          </div>
        </div>
      </CoupleShell>
    </MemberPage>
  )
}
