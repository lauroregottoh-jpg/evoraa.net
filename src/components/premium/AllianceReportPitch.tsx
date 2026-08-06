import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  Sparkles,
  Target,
} from "lucide-react"

/** Bloc central Alliance — rapport individuel, pas un simple aperçu. */
export function AllianceReportPitch() {
  const pillars = [
    {
      icon: ClipboardList,
      title: "Rapport personnalisé complet",
      body: "À partir de vos 5 questionnaires, Alliance ouvre le bilan détaillé : lecture claire de votre profil relationnel, pas seulement 1–2 conseils légers.",
    },
    {
      icon: Target,
      title: "Axes d’amélioration priorisés",
      body: "Personnalité & stress, foi & valeurs, conflits & dialogue, vision du couple, finances & projet — chaque axe indique où travailler concrètement.",
    },
    {
      icon: GraduationCap,
      title: "Lien direct avec l’Académie",
      body: "Vos axes s’ancrent dans des modules Académie du mariage : vous avancez avec un plan, pas seulement une liste de points faibles.",
    },
    {
      icon: BookOpen,
      title: "Base pour vos rencontres",
      body: "Mieux vous connaître aide le Matching : suggestions plus pertinentes et échanges plus sérieux une fois Alliance active.",
    },
  ]

  return (
    <section className="rounded-2xl border border-accent/35 bg-gradient-to-br from-accent/10 via-card to-card p-5 sm:p-7 space-y-5">
      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
          Nouveauté Alliance
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground leading-tight">
          Rapport personnalisé + axes d’amélioration
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Alliance ne se limite pas à « plus de matchs ». Vous débloquez votre{" "}
          <strong className="text-foreground font-semibold">
            rapport individuel KELIAA
          </strong>{" "}
          : lecture des 5 piliers, axes d’amélioration priorisés, et orientation
          vers l’Académie pour progresser.
        </p>
      </div>

      <ul className="grid sm:grid-cols-2 gap-3">
        {pillars.map((p) => {
          const Icon = p.icon
          return (
            <li
              key={p.title}
              className="rounded-xl border border-border/80 bg-background/80 p-4 space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="h-9 w-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="text-sm font-semibold">{p.title}</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{p.body}</p>
            </li>
          )
        })}
      </ul>

      <p className="text-[11px] text-muted-foreground flex items-start gap-2 leading-relaxed">
        <Sparkles className="h-3.5 w-3.5 mt-0.5 text-accent shrink-0" />
        Des options avancées (visibilité, packs coaching) arriveront plus tard —
        sans remplacer Alliance mensuelle actuelle.
      </p>
    </section>
  )
}
