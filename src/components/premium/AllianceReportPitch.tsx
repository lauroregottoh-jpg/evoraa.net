import {
  BadgeCheck,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Sparkles,
  Target,
  Zap,
} from "lucide-react"

/** Bloc central Alliance — rapport individuel, pas un simple aperçu. */
export function AllianceReportPitch() {
  const pillars = [
    {
      icon: ClipboardList,
      title: "Rapport personnalisé complet",
      body: "À partir de vos 5 questionnaires déjà faits, Alliance ouvre le bilan détaillé — sans nouveau test obligatoire. Lecture claire de votre profil relationnel.",
    },
    {
      icon: Target,
      title: "Axes d’amélioration + suggestion du jour",
      body: "Personnalité, foi, conflits, vision du couple, finances — axes priorisés, avec une piste concrète à travailler.",
    },
    {
      icon: BadgeCheck,
      title: "Badge Alliance & priorité",
      body: "Badge vérifié Alliance sur votre profil, et place prioritaire dans les suggestions auprès des membres compatibles.",
    },
    {
      icon: Zap,
      title: "Boost optionnel",
      body: "Besoin d’être encore plus visible pour une période courte ? Ajoutez un Boost (24 h, 3 j ou 7 j) sans changer votre Matching.",
    },
    {
      icon: GraduationCap,
      title: "Lien direct avec l’Académie",
      body: "Vos axes s’ancrent dans des modules Académie : un plan de croissance, pas seulement une liste de points faibles.",
    },
    {
      icon: BookOpen,
      title: "Base pour vos rencontres",
      body: "Mieux vous connaître aide le Matching : suggestions plus pertinentes et échanges plus sérieux.",
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
        Après paiement : activation des quotas Alliance, génération du rapport depuis vos
        tests existants, badge + priorité. Le Boost reste un ajout séparé pour la
        visibilité ponctuelle.
      </p>
    </section>
  )
}
