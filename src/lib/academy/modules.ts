export const ACADEMY_MODULES = [
  {
    id: "foi",
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
    title: "Projet de vie à deux",
    summary: "Enfants, rôles, distance, épargne : bâtir une vision partagée.",
    lessons: [
      "Aligner le projet d'enfants",
      "Rôles au foyer sans guerre idéologique",
      "Objectifs concrets (logement, épargne)",
    ],
  },
] as const

export type AcademyModuleId = (typeof ACADEMY_MODULES)[number]["id"]
