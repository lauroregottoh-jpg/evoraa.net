export type AcademyModuleId =
  | "foi"
  | "dialogue"
  | "conflits"
  | "purete"
  | "familles"
  | "finances"
  | "emotions"
  | "projet"

export type AcademyLesson = {
  slug: string
  title: string
  durationMin: number
  /** Texte pédagogique (test / soft-launch) */
  body: string[]
  keyPoints: string[]
  exercise: string
  /**
   * Prêt pour plus tard : URL YouTube / Vimeo / fichier.
   * Vide = emplacement vidéo affiché, pas encore de média.
   */
  videoUrl?: string | null
  videoProvider?: "youtube" | "vimeo" | "file" | null
  isFreePreview?: boolean
}

export type AcademyModule = {
  id: AcademyModuleId
  title: string
  summary: string
  lessons: AcademyLesson[]
}

export const ACADEMY_MODULES: AcademyModule[] = [
  {
    id: "foi",
    title: "Foi au quotidien du couple",
    summary:
      "Prière à deux, Parole, service d'église : comment avancer sans s'épuiser ni se juger.",
    lessons: [
      {
        slug: "rythme-priere",
        title: "Construire un rythme de prière réaliste",
        durationMin: 8,
        isFreePreview: true,
        videoUrl: null,
        body: [
          "Beaucoup de couples veulent « prier ensemble tous les jours » et abandonnent en trois semaines. Le problème n'est pas le manque de foi : c'est souvent un rythme trop idéaliste.",
          "Commencez petit : 3 minutes le soir, ou une prière courte le dimanche après le culte. La régularité bâtit l'intimité spirituelle plus que la durée.",
          "Si l'un des deux est plus à l'aise à voix haute, alternez : un jour l'un parle, l'autre dit « Amen » ; le lendemain, inversez.",
        ],
        keyPoints: [
          "Petit et régulier > long et irrégulier",
          "Décidez ensemble le créneau (pas « quand on aura le temps »)",
          "Pas de comparaison avec d'autres couples d'église",
        ],
        exercise:
          "Cette semaine, choisissez 3 soirs et priez 3 minutes ensemble (ou seul(e) en préparant ce rythme pour plus tard). Notez ce qui a aidé ou freiné.",
      },
      {
        slug: "service-eglise",
        title: "Servir à l'église sans négliger le foyer",
        durationMin: 7,
        videoUrl: null,
        body: [
          "Le service est une joie — jusqu'à ce qu'il vide le couple. Clarifiez vos saisons : parfois on sert beaucoup, parfois on se recentre sur le foyer.",
          "Posez une règle simple : aucun engagement d'église sans en parler à deux (ou à un mentor si vous êtes encore célibataire).",
        ],
        keyPoints: [
          "Le foyer n'est pas l'ennemi du service",
          "Dire non peut être un acte d'amour",
          "Revoir les engagements tous les 3 mois",
        ],
        exercise:
          "Listez vos engagements actuels (église, travail, famille). Cochez ce qui peut attendre 3 mois. Partagez la liste avec quelqu'un de confiance.",
      },
      {
        slug: "discerner-pasteur",
        title: "Discerner avec un pasteur / aîné mature",
        durationMin: 6,
        videoUrl: null,
        body: [
          "Vous n'avez pas à tout porter seul(e). Un pasteur ou un couple mature peut éclairer un doute — sans remplacer votre responsabilité.",
          "Préparez 3 questions précises avant le rendez-vous. Évitez les monologues de 40 minutes : allez à l'essentiel.",
        ],
        keyPoints: [
          "Cherchez la sagesse, pas la validation à tout prix",
          "Gardez la confidentialité et le respect",
          "Vous restez décideurs de votre engagement",
        ],
        exercise:
          "Écrivez 3 questions que vous poseriez à un aîné sur votre saison actuelle (célibat, relation, mariage).",
      },
    ],
  },
  {
    id: "dialogue",
    title: "Dialogue & besoins affectifs",
    summary: "Dire ce qu'on ressent sans attaquer. Écouter sans se défendre tout de suite.",
    lessons: [
      {
        slug: "je-ressens",
        title: "La formule « je ressens / j'ai besoin »",
        durationMin: 8,
        isFreePreview: true,
        videoUrl: null,
        body: [
          "« Tu ne m'écoutes jamais » attaque. « Je me sens seul(e) quand on ne parle pas le soir ; j'ai besoin de 10 minutes ensemble » ouvre une porte.",
          "La formule : Je ressens… quand… j'ai besoin de… Elle ne garantit pas l'accord, mais elle invite au respect.",
        ],
        keyPoints: [
          "Parler de soi plutôt que d'accuser",
          "Un besoin n'est pas un ordre",
          "Écouter 30 secondes avant de répondre",
        ],
        exercise:
          "Reformulez une frustration récente avec « je ressens / j'ai besoin ». Lisez-la à voix haute une fois.",
      },
      {
        slug: "feedback-difficile",
        title: "Recevoir un feedback difficile",
        durationMin: 7,
        videoUrl: null,
        body: [
          "Le premier réflexe est souvent de se défendre. Essayez d'abord : « Merci d'en parler. Laisse-moi digérer. »",
          "Vous pouvez être en désaccord et rester respectueux. Le but n'est pas de « gagner ».",
        ],
        keyPoints: [
          "Pause avant la riposte",
          "Clarifier : « Tu veux que je comprenne ou que je change quelque chose ? »",
          "Revenir plus tard si besoin",
        ],
        exercise:
          "Demandez à un ami de confiance un feedback honnête sur un point relationnel. Entraînez-vous à écouter sans vous justifier pendant 2 minutes.",
      },
      {
        slug: "besoins-sans-deviner",
        title: "Exprimer ses besoins sans attendre qu'on devine",
        durationMin: 6,
        videoUrl: null,
        body: [
          "Attendre que l'autre « comprenne tout seul » crée de la rancœur. L'amour mature ose demander clairement.",
          "Demander n'est pas manipuler : c'est offrir une chance à l'autre de répondre librement.",
        ],
        keyPoints: [
          "Clarté = dignité",
          "Accepter un non sans punition",
          "Remercier quand le besoin est entendu",
        ],
        exercise:
          "Notez 2 besoins affectifs non dits cette année. Choisissez-en un à exprimer cette semaine (même à un ami).",
      },
    ],
  },
  {
    id: "conflits",
    title: "Conflits & réconciliation",
    summary: "Silence, colère, premier pas : des outils pour sortir des impasses.",
    lessons: [
      {
        slug: "regle-pause",
        title: "Règles de pause pendant une dispute",
        durationMin: 7,
        isFreePreview: true,
        videoUrl: null,
        body: [
          "Quand le ton monte, le cerveau passe en mode survie. Une pause de 20–30 minutes n'est pas de la fuite si vous fixez une heure de retour.",
          "Phrase utile : « Je m'arrête pour ne pas te blesser. On se reparle à 20h. »",
        ],
        keyPoints: [
          "Pause avec heure de retour",
          "Pas de messages agressifs pendant la pause",
          "Revenir même si ce n'est pas « résolu »",
        ],
        exercise:
          "Écrivez votre phrase de pause personnelle. Gardez-la dans les notes du téléphone.",
      },
      {
        slug: "premier-pas",
        title: "Faire le premier pas sans s'écraser",
        durationMin: 6,
        videoUrl: null,
        body: [
          "Faire le premier pas, ce n'est pas dire « c'est entièrement de ma faute ». C'est : « Je tiens à nous. Voici ma part. »",
        ],
        keyPoints: [
          "Responsabilité ≠ humiliation",
          "Nommer sa part concrètement",
          "Inviter l'autre sans le forcer",
        ],
        exercise:
          "Pensez à un conflit non résolu. Quelle est « votre part » en une phrase honnête ?",
      },
      {
        slug: "ne-pas-pourrir",
        title: "Ne pas laisser pourrir une blessure",
        durationMin: 6,
        videoUrl: null,
        body: [
          "Le silence prolongé transforme une blessure en mur. Mieux vaut une conversation maladroite qu'une rancune de six mois.",
        ],
        keyPoints: [
          "Fixer une date pour en parler",
          "Écrire d'abord si la parole est trop chaude",
          "Chercher de l'aide si le cycle se répète",
        ],
        exercise:
          "Identifiez une blessure encore ouverte. Planifiez un créneau cette semaine pour l'aborder (ou pour prier / écrire à ce sujet).",
      },
    ],
  },
  {
    id: "purete",
    title: "Pureté & limites physiques",
    summary:
      "Abstinence, limites, passé sexuel : clarifier avec dignité pour protéger l'engagement.",
    lessons: [
      {
        slug: "definir-limites",
        title: "Définir ses limites avant le mariage",
        durationMin: 8,
        isFreePreview: true,
        videoUrl: null,
        body: [
          "Les limites floues créent de la confusion et de la culpabilité. Mieux vaut des limites claires, discutées tôt, que des non-dits.",
          "Ce n'est pas un concours de sainteté : c'est une protection pour l'engagement et le respect mutuel.",
        ],
        keyPoints: [
          "Écrire ses limites personnelles d'abord",
          "En parler avant que la situation chauffe",
          "Revoir si nécessaire avec un mentor",
        ],
        exercise:
          "Sur une feuille : 3 choses OK / 3 choses pas OK pour vous avant le mariage. Gardez-le privé pour l'instant.",
      },
      {
        slug: "parler-sexualite",
        title: "Parler de sexualité avec respect",
        durationMin: 7,
        videoUrl: null,
        body: [
          "Le sujet n'est pas « sale ». Il demande pudeur, clarté et timing. Évitez d'en parler pour la première fois dans l'émotion forte.",
        ],
        keyPoints: [
          "Lieu calme, pas en public",
          "Respecter le rythme de l'autre",
          "Pas de pression ni de chantage",
        ],
        exercise:
          "Préparez 2 phrases respectueuses pour ouvrir ce sujet le moment venu.",
      },
      {
        slug: "passe-transparence",
        title: "Guérison et transparence sur le passé",
        durationMin: 7,
        videoUrl: null,
        body: [
          "La transparence n'exige pas tous les détails. Elle exige l'honnêteté utile pour bâtir la confiance — souvent avec un conseiller.",
        ],
        keyPoints: [
          "Guérir soi-même d'abord",
          "Choisir le bon moment et le bon niveau de détail",
          "La grâce et la vérité vont ensemble",
        ],
        exercise:
          "Si un élément du passé pèse : notez si vous avez besoin d'un pasteur / conseiller avant d'en parler à un futur conjoint.",
      },
    ],
  },
  {
    id: "familles",
    title: "Familles & foyer",
    summary:
      "Honorer les parents, vivre ou non avec la famille, décider à deux : des visions différentes, légitimes.",
    lessons: [
      {
        slug: "beaux-parents",
        title: "Limites saines avec les beaux-parents",
        durationMin: 7,
        isFreePreview: true,
        videoUrl: null,
        body: [
          "Honorer ses parents et construire un foyer autonome ne s'opposent pas. Les limites se décident à deux, avec respect.",
        ],
        keyPoints: [
          "Le couple décide, la famille conseille",
          "Pas de triangulation (plaintes via un parent)",
          "Visites et argent : règles claires",
        ],
        exercise:
          "Écrivez une limite que vous voulez protéger (temps, argent, décisions). Formulez-la sans agresser.",
      },
      {
        slug: "vivre-avec-famille",
        title: "Vivre avec la famille : pour ou contre, sans jugement",
        durationMin: 6,
        videoUrl: null,
        body: [
          "Selon les cultures et les moyens, vivre avec la famille peut être sage ou étouffant. L'essentiel : un accord conscient, pas subi.",
        ],
        keyPoints: [
          "Nommer avantages / coûts",
          "Durée prévue si possible",
          "Espace d'intimité du couple",
        ],
        exercise:
          "Listez 3 avantages et 3 risques de cohabiter avec la famille élargie dans votre contexte.",
      },
      {
        slug: "opinion-famille",
        title: "Quand la famille a une opinion forte",
        durationMin: 6,
        videoUrl: null,
        body: [
          "Écouter n'oblige pas à obéir. Remerciez, puis décidez selon vos convictions et votre discernement.",
        ],
        keyPoints: [
          "Écouter sans se disputer immédiatement",
          "Répondre avec calme et clarté",
          "Soutien d'un mentor si pression forte",
        ],
        exercise:
          "Rédigez une réponse courte et respectueuse à une objection familiale typique (mariage, études, déménagement…).",
      },
    ],
  },
  {
    id: "finances",
    title: "Finances & intendance",
    summary: "Dettes, dîme, budget, aide à la famille : poser un cadre commun.",
    lessons: [
      {
        slug: "transparence-argent",
        title: "Transparence avant l'engagement",
        durationMin: 8,
        isFreePreview: true,
        videoUrl: null,
        body: [
          "L'argent cache souvent la honte. Mieux vaut un inventaire honnête tôt qu'une surprise après la demande en mariage.",
        ],
        keyPoints: [
          "Revenus, dettes, habitudes",
          "Pas de jugement : de la clarté",
          "Plan commun ensuite",
        ],
        exercise:
          "Faites votre inventaire personnel (même approximatif) : revenus, dettes, dépenses fixes.",
      },
      {
        slug: "budget-deux",
        title: "Budget simple à deux",
        durationMin: 7,
        videoUrl: null,
        body: [
          "Un budget n'est pas une prison : c'est une carte. Commencez par besoins / épargne / dons / loisirs.",
        ],
        keyPoints: [
          "Une revue mensuelle de 20 minutes",
          "Compte commun ou règles claires",
          "Marge pour l'imprévu",
        ],
        exercise:
          "Répartissez 100 % d'un revenu fictif (ou réel) en 4 cases : besoins, épargne, dons, plaisir.",
      },
      {
        slug: "aider-famille",
        title: "Aider sa famille sans asphyxier le foyer",
        durationMin: 6,
        videoUrl: null,
        body: [
          "Aider parents et fratrie est souvent une valeur forte. Posez un plafond mensuel pour ne pas détruire le couple.",
        ],
        keyPoints: [
          "Montant décidé à deux",
          "Urgence ≠ habitude",
          "Dire non avec respect",
        ],
        exercise:
          "Fixez (même pour vous seul) un plafond mensuel d'aide familiale réaliste.",
      },
    ],
  },
  {
    id: "emotions",
    title: "Émotions & stress",
    summary: "Réagir sous pression, jalousie, méfiance après une blessure.",
    lessons: [
      {
        slug: "nommer-emotion",
        title: "Nommer l'émotion avant de répondre",
        durationMin: 6,
        isFreePreview: true,
        videoUrl: null,
        body: [
          "« Je suis en colère » ou « j'ai peur » change déjà la conversation. Sans nom, l'émotion dirige toute seule.",
        ],
        keyPoints: [
          "Pause de 10 secondes",
          "Nommer : peur, colère, tristesse, honte…",
          "Puis choisir la réponse",
        ],
        exercise:
          "Aujourd'hui, quand une émotion monte, notez son nom avant d'envoyer un message.",
      },
      {
        slug: "jalousie",
        title: "Jalousie : règles et confiance",
        durationMin: 7,
        videoUrl: null,
        body: [
          "La jalousie signale parfois un besoin de sécurité — ou une blessure ancienne. Des règles claires aident ; le contrôle étouffe.",
        ],
        keyPoints: [
          "Parler du besoin sous la jalousie",
          "Règles mutuelles (réseaux, amitiés)",
          "Travail personnel si la peur domine",
        ],
        exercise:
          "Identifiez une situation qui déclenche de la jalousie. Quel besoin se cache derrière ?",
      },
      {
        slug: "guerir-deception",
        title: "Guérir d'une déception amoureuse",
        durationMin: 7,
        videoUrl: null,
        body: [
          "Avant de « rebondir », laissez le deuil faire son travail. La précipitation reproduit souvent le même schéma.",
        ],
        keyPoints: [
          "Temps + soutien + vérité",
          "Éviter de idéaliser le suivant",
          "Tirer une leçon sans se condamner",
        ],
        exercise:
          "Écrivez 3 choses apprises d'une déception passée (sans ruminer les détails).",
      },
    ],
  },
  {
    id: "projet",
    title: "Projet de vie à deux",
    summary: "Enfants, rôles, distance, épargne : bâtir une vision partagée.",
    lessons: [
      {
        slug: "projet-enfants",
        title: "Aligner le projet d'enfants",
        durationMin: 7,
        isFreePreview: true,
        videoUrl: null,
        body: [
          "Nombre, timing, « on verra » : mieux vaut en parler tôt. Les désaccords ici pèsent lourd s'ils restent cachés.",
        ],
        keyPoints: [
          "Dire son souhait réel",
          "Écouter sans ridiculiser",
          "Revenir au sujet chaque année si besoin",
        ],
        exercise:
          "Notez votre vision (enfants / timing / ouverts). Une phrase suffit.",
      },
      {
        slug: "roles-foyer",
        title: "Rôles au foyer sans guerre idéologique",
        durationMin: 6,
        videoUrl: null,
        body: [
          "Les rôles se négocient selon dons, saison et convictions — pas selon les réseaux sociaux. L'essentiel : un accord juste pour les deux.",
        ],
        keyPoints: [
          "Compétences + charge mentale",
          "Revoir quand la vie change",
          "Respect mutuel avant « qui a raison »",
        ],
        exercise:
          "Listez 5 tâches du foyer. Pour chacune : qui le ferait le mieux aujourd'hui ?",
      },
      {
        slug: "objectifs-concrets",
        title: "Objectifs concrets (logement, épargne)",
        durationMin: 6,
        videoUrl: null,
        body: [
          "Une vision sans chiffre reste un rêve. Posez 1 objectif à 12 mois (logement, épargne, formation).",
        ],
        keyPoints: [
          "Un objectif mesurable",
          "Étapes mensuelles",
          "Célébrer les petites victoires",
        ],
        exercise:
          "Écrivez un objectif à 12 mois + la première action de ce mois-ci.",
      },
    ],
  },
]

export function getAcademyModule(id: string): AcademyModule | undefined {
  return ACADEMY_MODULES.find((m) => m.id === id)
}

export function getAcademyLesson(moduleId: string, lessonSlug: string) {
  const mod = getAcademyModule(moduleId)
  if (!mod) return null
  const lesson = mod.lessons.find((l) => l.slug === lessonSlug)
  if (!lesson) return null
  const index = mod.lessons.findIndex((l) => l.slug === lessonSlug)
  return {
    module: mod,
    lesson,
    index,
    prev: index > 0 ? mod.lessons[index - 1] : null,
    next: index < mod.lessons.length - 1 ? mod.lessons[index + 1] : null,
  }
}

export function academyLessonPath(moduleId: string, lessonSlug: string) {
  return `/academie-mariage/${moduleId}/${lessonSlug}`
}

export function academyModulePath(moduleId: string) {
  return `/academie-mariage/${moduleId}`
}
