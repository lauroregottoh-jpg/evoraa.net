import Link from "next/link"
import { MemberShell } from "@/components/layout/MemberShell"
import { getUsageSnapshot } from "@/lib/billing/usage"
import {
  BookOpen,
  Heart,
  MessageCircle,
  Shield,
  Users,
  Wallet,
  Sparkles,
  Compass,
} from "lucide-react"

const MODULES = [
  {
    id: "foi",
    icon: BookOpen,
    title: "Foi au quotidien du couple",
    summary:
      "Prière à deux, Parole, service d'église : comment avancer sans s'épuiser ni se juger.",
    lessons: [
      "Construire un rythme de prière réaliste",
      "Servir à l'église sans négliger le foyer",
      "Discerner avec un pasteur / aîné mature",
    ],
  },
  {
    id: "dialogue",
    icon: MessageCircle,
    title: "Dialogue & besoins affectifs",
    summary: "Dire ce qu'on ressent sans attaquer. Écouter sans se défendre tout de suite.",
    lessons: [
      "La formule « je ressens / j'ai besoin »",
      "Recevoir un feedback difficile",
      "Exprimer ses besoins sans attendre qu'on devine",
    ],
  },
  {
    id: "conflits",
    icon: Shield,
    title: "Conflits & réconciliation",
    summary: "Silence, colère, premier pas : des outils pour sortir des impasses.",
    lessons: [
      "Règles de pause pendant une dispute",
      "Faire le premier pas sans s'écraser",
      "Ne pas laisser pourrir une blessure",
    ],
  },
  {
    id: "purete",
    icon: Heart,
    title: "Pureté & limites physiques",
    summary:
      "Abstinence, limites, passé sexuel : clarifier avec dignité pour protéger l'engagement.",
    lessons: [
      "Définir ses limites avant le mariage",
      "Parler de sexualité avec respect",
      "Guérison et transparence sur le passé",
    ],
  },
  {
    id: "familles",
    icon: Users,
    title: "Familles & foyer",
    summary:
      "Honorer les parents, vivre ou non avec la famille, décider à deux : des visions différentes, légitimes.",
    lessons: [
      "Limites saines avec les beaux-parents",
      "Vivre avec la famille : pour ou contre, sans jugement",
      "Quand la famille a une opinion forte",
    ],
  },
  {
    id: "finances",
    icon: Wallet,
    title: "Finances & intendance",
    summary: "Dettes, dîme, budget, aide à la famille : poser un cadre commun.",
    lessons: [
      "Transparence avant l'engagement",
      "Budget simple à deux",
      "Aider sa famille sans asphyxier le foyer",
    ],
  },
  {
    id: "emotions",
    icon: Sparkles,
    title: "Émotions & stress",
    summary: "Réagir sous pression, jalousie, méfiance après une blessure.",
    lessons: [
      "Nommer l'émotion avant de répondre",
      "Jalousie : règles et confiance",
      "Guérir d'une déception amoureuse",
    ],
  },
  {
    id: "projet",
    icon: Compass,
    title: "Projet de vie à deux",
    summary: "Enfants, rôles, distance, épargne : bâtir une vision partagée.",
    lessons: [
      "Aligner le projet d'enfants",
      "Rôles au foyer sans guerre idéologique",
      "Objectifs concrets (logement, épargne)",
    ],
  },
]

export default async function AcademieMariagePage() {
  const usage = await getUsageSnapshot()

  return (
    <MemberShell planLabel={usage?.planName} isPaid={usage?.isPaid}>
      <div className="max-w-3xl mx-auto space-y-8 pb-10">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Académie du mariage
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">
            Grandir avant (et pour) l&apos;alliance
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Des modules courts pour travailler vos axes d&apos;amélioration issus des
            questionnaires — dialogue, familles, pureté, finances, foi. Sans jugement : avec
            clarté.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/assessments"
              className="text-sm font-semibold text-primary underline"
            >
              Voir mes axes (tests)
            </Link>
            <Link href="/help" className="text-sm font-semibold text-muted-foreground underline">
              Poser une question à EVA
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {MODULES.map((mod) => {
            const Icon = mod.icon
            return (
              <section
                key={mod.id}
                id={mod.id}
                className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold">{mod.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{mod.summary}</p>
                  </div>
                </div>
                <ul className="space-y-1.5 pl-1">
                  {mod.lessons.map((lesson) => (
                    <li key={lesson} className="text-sm flex gap-2">
                      <span className="text-accent font-bold">·</span>
                      <span>{lesson}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          L&apos;Académie s&apos;enrichira de contenus vidéo et d&apos;exercices. Pour l&apos;instant :
          repères concrets liés à votre profil KELIAA.
        </p>
      </div>
    </MemberShell>
  )
}
