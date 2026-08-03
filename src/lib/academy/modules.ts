export type AcademyModuleId =
  | "foi"
  | "dialogue"
  | "conflits"
  | "purete"
  | "familles"
  | "finances"
  | "emotions"
  | "projet"

export type AcademySection = {
  title: string
  points: string[]
}

export type AcademyResource = {
  label: string
  detail: string
}

/** Checklist perso — pas un quiz ni une note */
export type AcademySelfCheck = {
  prompt: string
  items: string[]
}

export type AcademyLesson = {
  slug: string
  title: string
  subtitle: string
  durationMin: number
  sections: AcademySection[]
  keyPoints: string[]
  resources: AcademyResource[]
  selfCheck: AcademySelfCheck
  exercise: string
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
    title: "Foi au quotidien",
    summary:
      "Avant le mariage : construire une vie avec Dieu que vous pourrez un jour partager à deux, sans pression ni façade.",
    lessons: [
      {
        slug: "rythme-priere",
        title: "Prier un peu, mais vraiment",
        subtitle: "Pas 1 heure par jour. 3 minutes qui tiennent la route.",
        durationMin: 8,
        isFreePreview: true,
        videoUrl: null,
        sections: [
          {
            title: "Ce qui bloque souvent",
            points: [
              "Vous visez trop haut, puis vous abandonnez",
              "Vous priez seulement quand ça va mal",
              "Vous attendez le « bon partenaire » pour commencer à prier",
            ],
          },
          {
            title: "Petits trucs qui marchent",
            points: [
              "Même heure, même coin (lit, chaise, trajet bus)",
              "3 minutes chrono : merci → besoin → Amen",
              "Un verset lu à voix haute, même court",
              "Si vous fréquentez quelqu’un : proposez 1 prière courte le dimanche, pas tous les soirs dès le 1er mois",
            ],
          },
        ],
        keyPoints: [
          "La régularité compte plus que la longueur",
          "Vous préparez le couple en étant déjà solide seul(e)",
          "Dieu n’attend pas une performance",
        ],
        resources: [
          {
            label: "Modèle 3 minutes",
            detail: "Merci (30 s) · Un besoin précis (1 min) · Une bénédiction (30 s).",
          },
          {
            label: "Ancre biblique",
            detail: "Matthieu 6.6 — la chambre fermée avant la scène publique.",
          },
        ],
        selfCheck: {
          prompt: "Cochez ce qui est déjà vrai pour vous (le reste = à travailler)",
          items: [
            "J’ai un moment de prière cette semaine, même court",
            "Mon objectif tient en 5 minutes max",
            "Je ne compare pas ma vie spirituelle à celle des autres sur les réseaux",
          ],
        },
        exercise:
          "Cette semaine : 3 soirs, 3 minutes. Notez juste : « fait / pas fait ». Pas de culpabilité, juste l’habitude.",
      },
      {
        slug: "service-eglise",
        title: "Servir sans s’épuiser",
        subtitle: "L’église a besoin de vous — votre futur foyer aussi.",
        durationMin: 7,
        videoUrl: null,
        sections: [
          {
            title: "Signaux à écouter",
            points: [
              "Vous dites oui par peur de décevoir le pasteur",
              "Vous n’avez plus d’énergie pour vos amis, votre famille, ou un début de relation",
              "Le dimanche devient une course, pas un repos",
            ],
          },
          {
            title: "Avant de vous engager (ou de vous marier)",
            points: [
              "Écrivez vos heures d’église / semaine (honnêtement)",
              "Avant un nouvel engagement : une nuit de réflexion, puis une réponse claire",
              "En fréquentation : dites tôt ce que vous faites à l’église — pour éviter la surprise plus tard",
            ],
          },
        ],
        keyPoints: [
          "Dire non peut être sage",
          "Un service trop lourd aujourd’hui peut devenir un conflit demain",
          "Votre capacité a une limite — et c’est normal",
        ],
        resources: [
          {
            label: "Phrase pour un responsable",
            detail: "« Pour cette saison, je peux X heures. Au-delà, je dois décliner. »",
          },
          {
            label: "Liste rapide",
            detail: "Activité · heures/semaine · joie (1–5) · fatigue (1–5).",
          },
        ],
        selfCheck: {
          prompt: "Cochez ce qui est déjà vrai pour vous",
          items: [
            "Je sais combien d’heures je donne à l’église",
            "J’ai le droit de dire non sans me justifier 10 minutes",
            "Si je fréquente quelqu’un, il/elle connaît mes engagements",
          ],
        },
        exercise:
          "Listez vos engagements d’église. Entourez-en un que vous pourriez réduire 3 mois. Parlez-en à une personne de confiance.",
      },
      {
        slug: "discerner-pasteur",
        title: "Demander conseil sans se décharger",
        subtitle: "Un aîné éclaire. Vous décidez.",
        durationMin: 6,
        videoUrl: null,
        sections: [
          {
            title: "Quand y aller",
            points: [
              "Vous pensez sérieusement à une fréquentation ou à une rupture",
              "Vous tournez en rond depuis des semaines",
              "La famille ou l’église met une pression que vous n’arrivez plus à porter seul(e)",
            ],
          },
          {
            title: "Comment préparer le RDV",
            points: [
              "3 questions max, écrites sur le téléphone",
              "Faits en 5 minutes (pas l’histoire complète depuis 2019)",
              "Demandez de la sagesse, pas « dites-moi oui ou non à sa place »",
            ],
          },
        ],
        keyPoints: [
          "Le conseiller n’épouse pas à votre place",
          "Choisissez quelqu’un discret, mature, sans intérêt caché",
          "Un avis qui vous met très mal à l’aise : prenez un second conseil",
        ],
        resources: [
          {
            label: "Mini fiche RDV",
            detail: "Situation (5 lignes) · Ce que j’ai déjà fait · 3 questions · Ce que je crains.",
          },
          {
            label: "Qui éviter",
            detail: "Quelqu’un qui aime les ragots, ou qui veut vous « caser » à tout prix.",
          },
        ],
        selfCheck: {
          prompt: "Cochez ce qui est déjà vrai pour vous",
          items: [
            "J’ai 3 questions précises à poser",
            "Je peux entendre un avis différent du mien",
            "Je sais que la décision finale reste la mienne",
          ],
        },
        exercise:
          "Écrivez vos 3 questions. Notez le nom d’une personne à contacter — même si le RDV est dans 2 semaines.",
      },
    ],
  },
  {
    id: "dialogue",
    title: "Dialogue & besoins",
    summary:
      "Apprendre à dire les choses tôt, clairement, sans attaquer — avant que le silence ne devienne une habitude de couple.",
    lessons: [
      {
        slug: "je-ressens",
        title: "Dire ce que vous ressentez",
        subtitle: "Une phrase simple vaut mieux qu’un silence de 3 semaines.",
        durationMin: 8,
        isFreePreview: true,
        videoUrl: null,
        sections: [
          {
            title: "Ce qui fait mal",
            points: [
              "« Tu ne m’écoutes jamais » (attaque)",
              "Attendre qu’il/elle « comprenne tout seul »",
              "Tout sortir d’un coup après 10 petits non-dits",
            ],
          },
          {
            title: "Formule à garder",
            points: [
              "Je ressens… (émotion)",
              "Quand… (un fait précis, récent)",
              "J’aimerais… (demande faisable)",
            ],
          },
        ],
        keyPoints: [
          "Un fait précis > une généralisation",
          "Demander n’est pas ordonner",
          "En fréquentation : mieux une petite phrase claire qu’une scène",
        ],
        resources: [
          {
            label: "Exemple prêt",
            detail:
              "« Je me sens un peu mis(e) de côté quand on ne se parle pas 3 jours. J’aimerais un message même court le soir. »",
          },
          {
            label: "Mots utiles",
            detail: "Seul(e), inquiet(e), fatigué(e), blessé(e), content(e), confus(e)…",
          },
        ],
        selfCheck: {
          prompt: "Cochez ce qui est déjà vrai pour vous",
          items: [
            "Ma phrase parle de moi, pas d’une attaque",
            "Le fait est précis (pas « toujours / jamais »)",
            "La demande tient en une action simple",
          ],
        },
        exercise:
          "Prenez une frustration récente. Réécrivez-la en une phrase « je ressens / quand / j’aimerais ». Lisez-la à voix haute.",
      },
      {
        slug: "feedback-difficile",
        title: "Entendre une remarque qui pique",
        subtitle: "Écouter d’abord. Se justifier après, si vraiment besoin.",
        durationMin: 7,
        videoUrl: null,
        sections: [
          {
            title: "Réflexes qui cassent la relation",
            points: [
              "Couper la parole pour se défendre",
              "Retourner la faute tout de suite",
              "Disparaître 3 jours en silence",
            ],
          },
          {
            title: "Ce que vous pouvez faire",
            points: [
              "« Merci d’en parler. Laisse-moi digérer. »",
              "Demander : tu veux que je comprenne, ou que je change quelque chose ?",
              "Fixer un moment pour en reparler (même 24 h plus tard)",
            ],
          },
        ],
        keyPoints: [
          "Pause ≠ rejet",
          "Vous pouvez être en désaccord et rester respectueux",
          "Le but n’est pas de « gagner » l’échange",
        ],
        resources: [
          {
            label: "3 questions utiles",
            detail:
              "1) Qu’as-tu besoin que je comprenne ? 2) Qu’attends-tu de moi ? 3) Quand on en reparle ?",
          },
          {
            label: "Si c’est injuste",
            detail: "Notez votre version à froid. Revenez avec des faits, pas la colère du moment.",
          },
        ],
        selfCheck: {
          prompt: "Cochez ce qui est déjà vrai pour vous",
          items: [
            "Je peux écouter sans interrompre 1 minute",
            "Je sais demander une pause sans fuir",
            "Je peux revenir sur le sujet le lendemain",
          ],
        },
        exercise:
          "Repensez à la dernière remarque difficile. Écrivez ce que vous auriez pu dire en 2 phrases : « j’entends » + « j’ai besoin de… ».",
      },
      {
        slug: "demander-clairement",
        title: "Demander sans attendre qu’on devine",
        subtitle: "La clarté n’est pas une faiblesse. C’est de l’amour anticipé.",
        durationMin: 7,
        videoUrl: null,
        sections: [
          {
            title: "Le piège",
            points: [
              "« S’il/elle m’aimait, il/elle saurait »",
              "Tester l’autre en silence pour voir s’il/elle « mérite »",
              "Râler après coup au lieu d’avoir demandé avant",
            ],
          },
          {
            title: "Demander proprement",
            points: [
              "Une chose à la fois",
              "Dire le besoin + une option concrète",
              "Accepter un non — et en parler, pas punir",
            ],
          },
        ],
        keyPoints: [
          "Deviner n’est pas un don biblique obligatoire",
          "En fréquentation : dites tôt comment vous aimez être rassuré(e)",
          "Un non clair vaut mieux qu’un oui forcé",
        ],
        resources: [
          {
            label: "Phrase type",
            detail: "« J’ai besoin de X. Est-ce possible pour toi ce week-end ? »",
          },
          {
            label: "3 besoins à clarifier tôt",
            detail: "Temps · messages · prière / église · rythme de fréquentation.",
          },
        ],
        selfCheck: {
          prompt: "Cochez ce qui est déjà vrai pour vous",
          items: [
            "Je peux nommer 1 besoin sans raconter toute mon histoire",
            "Je demande avant de me vexer",
            "Je laisse à l’autre le droit de dire non",
          ],
        },
        exercise:
          "Notez 1 besoin non dit. Formulez-le en une phrase. Si vous fréquentez quelqu’un : dites-le cette semaine. Sinon : dites-le à un ami proche.",
      },
    ],
  },
  {
    id: "conflits",
    title: "Conflits & réconciliation",
    summary:
      "Le mariage n’efface pas les disputes. Apprenez dès maintenant à faire pause, revenir, et réparer.",
    lessons: [
      {
        slug: "regle-pause",
        title: "La règle de pause",
        subtitle: "S’arrêter pour ne pas blesser — puis revenir vraiment.",
        durationMin: 8,
        isFreePreview: true,
        videoUrl: null,
        sections: [
          {
            title: "Quand faire pause",
            points: [
              "La voix monte, le cœur tape, vous voulez « gagner »",
              "Vous êtes sur le point d’envoyer un message que vous regretterez",
              "Il est trop tard le soir et vous êtes épuisés",
            ],
          },
          {
            title: "Comment le faire",
            points: [
              "Dire : « Je pause 20 minutes, je reviens. »",
              "Pas de disparition 3 jours sans mot",
              "Revenir : même 10 minutes, même maladroit",
            ],
          },
        ],
        keyPoints: [
          "Pause = protection, pas punition",
          "Toujours fixer un retour",
          "En fréquentation : testez ça tôt — ça révèle beaucoup",
        ],
        resources: [
          {
            label: "Phrase de pause",
            detail: "« Je m’énerve. Je reviens dans 20 min. On n’abandonne pas le sujet. »",
          },
          {
            label: "Pendant la pause",
            detail: "Boire de l’eau, marcher, prier 1 minute. Pas alimenter la rage sur WhatsApp.",
          },
        ],
        selfCheck: {
          prompt: "Cochez ce qui est déjà vrai pour vous",
          items: [
            "J’ai une phrase de pause prête",
            "Je sais revenir après, même gêné(e)",
            "Je n’utilise pas le silence pour punir",
          ],
        },
        exercise:
          "Écrivez votre phrase de pause. Envoyez-la à un ami de confiance ou gardez-la dans les notes du téléphone.",
      },
      {
        slug: "premier-pas",
        title: "Faire le premier pas",
        subtitle: "Dire « j’ai eu tort sur ça » n’est pas s’écraser.",
        durationMin: 7,
        videoUrl: null,
        sections: [
          {
            title: "Ce que ce n’est pas",
            points: [
              "Tout accepter pour « garder la paix »",
              "S’excuser juste pour que l’autre se taise",
              "Attendre que l’autre plie en premier par orgueil",
            ],
          },
          {
            title: "Ce que c’est",
            points: [
              "Nommer votre part : un fait, une attitude",
              "Demander pardon sur quelque chose de précis",
              "Proposer une petite réparation (temps, message, changement)",
            ],
          },
        ],
        keyPoints: [
          "Votre part existe presque toujours",
          "Le premier pas désarme souvent l’autre",
          "Pardon ≠ oublier le problème non traité",
        ],
        resources: [
          {
            label: "Phrase simple",
            detail: "« Sur X, j’ai eu tort. Tu méritais mieux. Est-ce qu’on peut en reparler calmement ? »",
          },
          {
            label: "Ancre",
            detail: "Éphésiens 4.26 — la colère a une heure limite.",
          },
        ],
        selfCheck: {
          prompt: "Cochez ce qui est déjà vrai pour vous",
          items: [
            "Je peux nommer ma part dans un conflit récent",
            "Je peux demander pardon sans « mais toi aussi »",
            "Je peux proposer une réparation concrète",
          ],
        },
        exercise:
          "Pensez à un conflit (ami, famille, fréquentation). Écrivez 1 phrase de responsabilité + 1 proposition de réparation. Envoyez-la si c’est sage.",
      },
      {
        slug: "ne-pas-pourrir",
        title: "Ne pas laisser pourrir",
        subtitle: "Une conversation maladroite vaut mieux qu’une rancune de 6 mois.",
        durationMin: 7,
        videoUrl: null,
        sections: [
          {
            title: "Signes que ça pourrit",
            points: [
              "Vous évitez le sujet, mais vous y pensez souvent",
              "Ironie, froid, ou « tout va bien » forcé",
              "Vous le racontez à tout le monde sauf à la personne concernée",
            ],
          },
          {
            title: "Débloquer",
            points: [
              "Choisir un moment calme (pas au milieu d’une dispute)",
              "Dire : « Il y a quelque chose qui me reste. Est-ce qu’on peut en parler 10 minutes ? »",
              "Si c’est trop lourd : mentor ou pasteur mature",
            ],
          },
        ],
        keyPoints: [
          "Le temps seul ne guérit pas toujours",
          "En fréquentation : une blessure non dite devient souvent une rupture brutale",
          "Mieux tôt, même imparfait",
        ],
        resources: [
          {
            label: "Ouverture douce",
            detail: "« Ce n’est pas pour attaquer. J’ai besoin d’être honnête pour qu’on avance bien. »",
          },
          {
            label: "Limite saine",
            detail: "Si l’autre refuse toute conversation pendant des semaines : c’est une info pour discerner.",
          },
        ],
        selfCheck: {
          prompt: "Cochez ce qui est déjà vrai pour vous",
          items: [
            "Je sais nommer une blessure encore ouverte",
            "Je peux en parler à la bonne personne (pas à tout le groupe)",
            "Je n’attends pas « le moment parfait » depuis trop longtemps",
          ],
        },
        exercise:
          "Notez une chose non dite. Décidez : en parler cette semaine, ou la confier d’abord à un mentor.",
      },
    ],
  },
  {
    id: "purete",
    title: "Pureté & limites",
    summary:
      "Avant le mariage : des limites claires, des mots respectueux, et de l’honnêteté sans se mettre à nu trop tôt.",
    lessons: [
      {
        slug: "definir-limites",
        title: "Définir vos limites avant",
        subtitle: "Le flou crée la confusion. La clarté protège les deux.",
        durationMin: 8,
        isFreePreview: true,
        videoUrl: null,
        sections: [
          {
            title: "Pourquoi écrire vos limites",
            points: [
              "Sous émotion, on improvise mal",
              "Chacun arrive avec une définition différente de « trop loin »",
              "Vous pourrez en parler calmement, pas en urgence à 23 h",
            ],
          },
          {
            title: "Comment faire",
            points: [
              "Seul(e) d’abord : listez ce qui est ok / pas ok pour vous",
              "En fréquentation sérieuse : partagez tôt, sans jugement",
              "Incluez aussi les écrans, les lieux, les heures tardives",
            ],
          },
        ],
        keyPoints: [
          "Vos limites sont un cadeau, pas une accusation",
          "Si l’autre pousse sans respect : c’est une info majeure",
          "Les limites évoluent — mais pas sous pression",
        ],
        resources: [
          {
            label: "Mini grille",
            detail: "Toucher · bisous · solitude · nuit · contenus · alcool. Pour chacun : ok / pas ok / à discuter.",
          },
          {
            label: "Phrase d’ouverture",
            detail: "« Pour moi, pour honorer Dieu et nous respecter, j’aimerais qu’on soit clairs sur… »",
          },
        ],
        selfCheck: {
          prompt: "Cochez ce qui est déjà vrai pour vous",
          items: [
            "J’ai écrit au moins 3 limites personnelles",
            "Je peux les dire sans m’excuser 10 fois",
            "Je sais que « non » n’a pas besoin d’un sermon",
          ],
        },
        exercise:
          "Écrivez vos limites (ok / pas ok / à discuter). Gardez-les privées pour l’instant, ou partagez-les avec un mentor.",
      },
      {
        slug: "parler-sexualite",
        title: "Parler de sexualité avec respect",
        subtitle: "Pudeur + clarté. Pas de détail inutile, pas de silence total.",
        durationMin: 7,
        videoUrl: null,
        sections: [
          {
            title: "Mauvais moments",
            points: [
              "En pleine excitation, ou tard le soir",
              "Par message pendant une dispute",
              "Devant des amis « pour rire »",
            ],
          },
          {
            title: "Bon cadre",
            points: [
              "Jour, lieu calme, intention claire",
              "Parler de valeurs, peurs, attentes — pas d’un inventaire cru",
              "Si besoin : pastorat / counseling chrétien avant le mariage",
            ],
          },
        ],
        keyPoints: [
          "Le silence total crée des surprises douloureuses",
          "Trop de détails trop tôt peut blesser ou exciter sans sagesse",
          "Un couple qui se prépare ose les sujets importants",
        ],
        resources: [
          {
            label: "Sujets utiles",
            detail: "Attentes · peurs · passé (niveau adapté) · pureté · vision du mariage.",
          },
          {
            label: "Si c’est tabou chez vous",
            detail: "Commencez par un livre ou un aîné mature, puis en parlez à deux.",
          },
        ],
        selfCheck: {
          prompt: "Cochez ce qui est déjà vrai pour vous",
          items: [
            "Je sais ce que je veux clarifier avant le mariage",
            "Je peux en parler sans me moquer ni me cacher",
            "Je sais vers qui aller si c’est trop lourd seul(e)",
          ],
        },
        exercise:
          "Notez 3 questions que vous aimeriez aborder avant un engagement. Choisissez le bon moment (ou un mentor d’abord).",
      },
      {
        slug: "passe-guerison",
        title: "Passé, guérison, transparence",
        subtitle: "Honnêteté utile — pas forcément tous les détails le premier mois.",
        durationMin: 8,
        videoUrl: null,
        sections: [
          {
            title: "Ordre sage",
            points: [
              "Guérir avec Dieu et un mentor avant de tout déverser",
              "En fréquentation : timing adapté à la confiance réelle",
              "Avant le mariage : transparence sur ce qui touche le foyer (santé, dettes, enfants, addictions…)",
            ],
          },
          {
            title: "Pièges",
            points: [
              "Tout cacher par honte → explosion plus tard",
              "Tout raconter trop tôt → lien trop intense trop vite",
              "Utiliser le passé de l’autre comme arme",
            ],
          },
        ],
        keyPoints: [
          "La grâce de Dieu ne remplace pas la vérité",
          "Certains sujets demandent un accompagnement",
          "La transparence se gagne ; elle ne se force pas",
        ],
        resources: [
          {
            label: "Ce qui doit sortir avant le mariage",
            detail: "Ce qui impacte la vie à deux : santé, finances, engagements, enfants, addictions.",
          },
          {
            label: "Phrase humble",
            detail: "« Il y a une part de mon passé que je veux partager avec sagesse. Est-ce qu’on peut choisir un bon moment ? »",
          },
        ],
        selfCheck: {
          prompt: "Cochez ce qui est déjà vrai pour vous",
          items: [
            "Je travaille ma guérison (prière, mentor, counseling si besoin)",
            "Je sais distinguer secret honteux et sagesse de timing",
            "Je ne garde pas volontairement une bombe pour « après les fiançailles »",
          ],
        },
        exercise:
          "Écrivez (privé) : ce que je dois guérir · ce que je partagerai tôt · ce que je partagerai avant le mariage. Priez dessus.",
      },
    ],
  },
  {
    id: "familles",
    title: "Familles & foyer",
    summary:
      "Honorer père et mère, tout en préparant un foyer qui pourra respirer. Surtout avant de s’engager.",
    lessons: [
      {
        slug: "limites-familles",
        title: "Limites saines avec la famille",
        subtitle: "Honorer ≠ tout accepter. Aimer ≠ tout raconter.",
        durationMin: 8,
        isFreePreview: true,
        videoUrl: null,
        sections: [
          {
            title: "Principes simples",
            points: [
              "Vos parents comptent — votre futur couple aussi",
              "Certaines décisions se prennent à deux, pas en comité familial",
              "Le respect reste, même quand vous dites non",
            ],
          },
          {
            title: "En pratique (célibataire / en fréquentation)",
            points: [
              "Clarifiez tôt : qui décide quoi (logement, argent, dates)",
              "Ne laissez pas la famille négocier votre relation à votre place",
              "Une phrase polie et ferme vaut mieux qu’un mensonge pour « éviter le drame »",
            ],
          },
        ],
        keyPoints: [
          "Genèse 2.24 : quitter / s’attacher — un processus, pas un scandale",
          "Si la famille gouverne déjà tout : parlez-en avant le mariage",
          "L’unité du couple se prépare dès la fréquentation",
        ],
        resources: [
          {
            label: "Phrase polie",
            detail: "« On entend votre avis. On va prier et décider ensemble. On vous tiendra au courant. »",
          },
          {
            label: "Sujets à clarifier",
            detail: "Visites · argent donné · secrets · qui vient habiter · qui choisit le conjoint.",
          },
        ],
        selfCheck: {
          prompt: "Cochez ce qui est déjà vrai pour vous",
          items: [
            "Je peux dire non à un proche sans exploser",
            "Je sais quels sujets restent privés en couple",
            "Je n’utilise pas ma famille pour faire pression sur quelqu’un",
          ],
        },
        exercise:
          "Notez 1 limite familiale importante pour vous. Formulez-la en une phrase respectueuse. Entraînez-vous à voix haute.",
      },
      {
        slug: "famille-elargie",
        title: "Vivre près (ou avec) la famille",
        subtitle: "Pas de jugement culturel — juste des yeux ouverts.",
        durationMin: 7,
        videoUrl: null,
        sections: [
          {
            title: "Peser le pour / contre",
            points: [
              "Aide concrète vs manque d’intimité",
              "Économie vs tensions quotidiennes",
              "Honneur culturel vs besoin d’espace pour le couple",
            ],
          },
          {
            title: "Si c’est probable chez vous",
            points: [
              "En parler tôt en fréquentation (pas la veille du mariage)",
              "Définir chambre, argent, horaires, visiteurs",
              "Prévoir une date de revue (ex. dans 12 mois)",
            ],
          },
        ],
        keyPoints: [
          "Le « on verra » finit souvent en crise",
          "Deux visions opposées sans compromis = signal d’alarme",
          "Un plan écrit réduit les disputes",
        ],
        resources: [
          {
            label: "Questions à poser",
            detail: "Combien de temps ? Qui paie quoi ? Où se retirer pour parler à deux ?",
          },
          {
            label: "Plan B",
            detail: "Même si vous cohabitez : un espace couple (balade, prière, soirée).",
          },
        ],
        selfCheck: {
          prompt: "Cochez ce qui est déjà vrai pour vous",
          items: [
            "Je sais ce que je veux / ne veux pas sur le logement familial",
            "Je peux en parler sans mentir pour plaire",
            "J’accepte que mon futur conjoint ait aussi une opinion",
          ],
        },
        exercise:
          "Écrivez votre préférence logement (idéal + acceptable + non négociable). Gardez-la pour les conversations sérieuses.",
      },
      {
        slug: "pression-familiale",
        title: "Quand la famille pousse fort",
        subtitle: "Écouter sans abdiquer. Respecter sans se marier sous pression.",
        durationMin: 7,
        videoUrl: null,
        sections: [
          {
            title: "Recevoir",
            points: [
              "Remercier pour l’intérêt (même si c’est lourd)",
              "Séparer : conseil utile vs pression émotionnelle",
              "Ne pas répondre à chaud si vous tremblez de colère",
            ],
          },
          {
            title: "Répondre",
            points: [
              "« On avance à notre rythme. Merci de prier pour nous. »",
              "Ne promettez pas une date juste pour calmer",
              "Si besoin : un aîné mature comme médiateur",
            ],
          },
        ],
        keyPoints: [
          "Se marier pour faire taire la famille est dangereux",
          "Votre « oui » doit être libre",
          "La pression révèle souvent des attentes non dites",
        ],
        resources: [
          {
            label: "Phrase courte",
            detail: "« Je vous aime. Sur ce point, la décision sera la mienne / la nôtre. »",
          },
          {
            label: "Si ça devient toxique",
            detail: "Limitez les appels, documentez, cherchez un accompagnement pastoral.",
          },
        ],
        selfCheck: {
          prompt: "Cochez ce qui est déjà vrai pour vous",
          items: [
            "Je reconnais la différence entre conseil et pression",
            "Je peux tenir une décision sans mentir",
            "Je sais vers qui aller si la pression déborde",
          ],
        },
        exercise:
          "Écrivez votre réponse type à une pression (« à quel âge tu te maries ? »). Entraînez-vous une fois.",
      },
    ],
  },
  {
    id: "finances",
    title: "Finances & intendance",
    summary:
      "Avant de s’engager : savoir ce qu’on gagne, ce qu’on doit, et ce qu’on donne — sans surprise douloureuse.",
    lessons: [
      {
        slug: "transparence-argent",
        title: "Parler argent avant l’engagement",
        subtitle: "Mieux un inventaire honnête tôt qu’une bombe après la bague.",
        durationMin: 8,
        isFreePreview: true,
        videoUrl: null,
        sections: [
          {
            title: "À mettre sur la table",
            points: [
              "Revenus approximatifs et stabilité",
              "Dettes (banque, famille, études)",
              "Habitudes : épargne, dons, dépenses impulsives",
            ],
          },
          {
            title: "Comment en parler",
            points: [
              "Jour calme, pas après une dispute",
              "Faits d’abord, excuses après",
              "Seul(e) d’abord : soyez honnête avec vous-même sur papier",
            ],
          },
        ],
        keyPoints: [
          "Cacher une dette grave n’est pas de la pudeur",
          "L’argent révèle des valeurs",
          "Un partenaire mature préfère la vérité tôt",
        ],
        resources: [
          {
            label: "Liste perso",
            detail: "Revenus · dettes · dons habituels · 3 postes où je dépense trop.",
          },
          {
            label: "Ouverture",
            detail: "« Avant d’aller plus loin, je veux être transparent(e) sur mon argent. »",
          },
        ],
        selfCheck: {
          prompt: "Cochez ce qui est déjà vrai pour vous",
          items: [
            "Je connais le montant approximatif de mes dettes",
            "Je peux expliquer mes priorités d’argent en 2 minutes",
            "Je n’attends pas « après le mariage » pour être honnête",
          ],
        },
        exercise:
          "Faites votre inventaire sur une feuille (même approximatif). Priez. Si besoin, montrez-le à un mentor.",
      },
      {
        slug: "budget-simple",
        title: "Un budget simple (même seul)",
        subtitle: "Une carte claire — pas une prison. Vous vous entraînez pour à deux.",
        durationMin: 7,
        videoUrl: null,
        sections: [
          {
            title: "4 cases",
            points: [
              "Besoins (loyer, nourriture, transport)",
              "Dons / église",
              "Épargne (même petite)",
              "Plaisir (sans culpabilité, avec plafond)",
            ],
          },
          {
            title: "Routine",
            points: [
              "1 fois / mois : 20 minutes sur le téléphone ou un carnet",
              "En fréquentation sérieuse : comparer vos styles (épargnant vs dépensier)",
              "Avant le mariage : décider comment vous gérerez les comptes",
            ],
          },
        ],
        keyPoints: [
          "Petit budget tenu > grand budget imaginaire",
          "Les styles d’argent se confrontent tôt ou tard",
          "L’intendance commence célibataire",
        ],
        resources: [
          {
            label: "Rituel 20 min",
            detail: "Entrées · sorties · 1 ajustement · Amen.",
          },
          {
            label: "Question couple",
            detail: "« Qu’est-ce qui te stresse le plus dans l’argent ? »",
          },
        ],
        selfCheck: {
          prompt: "Cochez ce qui est déjà vrai pour vous",
          items: [
            "Je sais où part mon argent ce mois-ci",
            "J’ai une petite épargne ou un début de plan",
            "Je connais mon style (économe / généreux / impulsif)",
          ],
        },
        exercise:
          "Cette semaine : 20 minutes sur vos 4 cases. Notez 1 poste à ajuster le mois prochain.",
      },
      {
        slug: "aider-famille",
        title: "Aider la famille sans s’asphyxier",
        subtitle: "La générosité a besoin d’un plafond — surtout avant le mariage.",
        durationMin: 7,
        videoUrl: null,
        sections: [
          {
            title: "Tension classique",
            points: [
              "La famille compte sur vous (et parfois trop)",
              "Un futur conjoint peut avoir une autre culture d’aide",
              "Dire non fait culpabiliser — dire oui sans limite aussi",
            ],
          },
          {
            title: "Cadre utile",
            points: [
              "Fixez un montant / mois (ou % ) pour l’aide familiale",
              "Distinguez urgence réelle et demande habituelle",
              "En couple : décidez ensemble, pas sous appel émotionnel",
            ],
          },
        ],
        keyPoints: [
          "Aider n’est pas se ruiner",
          "Le plafond se discute avant les fiançailles",
          "La culpabilité n’est pas un budget",
        ],
        resources: [
          {
            label: "Phrase",
            detail: "« Ce mois-ci je peux X. Au-delà, je ne peux pas. »",
          },
          {
            label: "À clarifier à deux",
            detail: "Parents · frères/sœurs · urgences · dîmes / offrandes.",
          },
        ],
        selfCheck: {
          prompt: "Cochez ce qui est déjà vrai pour vous",
          items: [
            "J’ai une idée de plafond pour l’aide familiale",
            "Je peux dire non sans mentir",
            "Je sais que mon futur foyer aura aussi besoin d’oxygène",
          ],
        },
        exercise:
          "Choisissez un plafond mensuel (même provisoire). Notez-le. Respectez-le 1 mois pour tester.",
      },
    ],
  },
  {
    id: "emotions",
    title: "Émotions & stress",
    summary:
      "Nommer ce qui se passe en vous, gérer la jalousie, et guérir avant de vous précipiter dans une nouvelle relation.",
    lessons: [
      {
        slug: "nommer-emotion",
        title: "Nommer l’émotion avant de répondre",
        subtitle: "Ce qui est nommé se dirige mieux. Ce qui est nié dirige à votre place.",
        durationMin: 7,
        isFreePreview: true,
        videoUrl: null,
        sections: [
          {
            title: "Sans nom = pilote auto",
            points: [
              "Vous répondez sèchement sans savoir pourquoi",
              "Vous envoyez un message trop long à 1 h du matin",
              "Vous priez « contre l’autre » au lieu de déposer votre cœur",
            ],
          },
          {
            title: "Micro-protocole",
            points: [
              "Stop 10 secondes",
              "Dire (à vous) : « Je suis… (mot) »",
              "Puis seulement : répondre, ou attendre",
            ],
          },
        ],
        keyPoints: [
          "L’émotion n’est pas un péché — la laisser tout piloter peut l’être",
          "Un mot simple suffit : peur, tristesse, colère, honte",
          "En fréquentation : « Je suis inquiet(e) » désamorce souvent",
        ],
        resources: [
          {
            label: "Liste courte",
            detail: "Peur · colère · tristesse · honte · joie · fatigue · solitude.",
          },
          {
            label: "Phrase",
            detail: "« Là, je suis [émotion]. Laisse-moi 10 minutes. »",
          },
        ],
        selfCheck: {
          prompt: "Cochez ce qui est déjà vrai pour vous",
          items: [
            "Je peux nommer mon émotion du jour en 1 mot",
            "Je sais faire une pause avant de répondre",
            "Je ne confonds pas émotion et vérité absolue",
          ],
        },
        exercise:
          "3 jours : le soir, écrivez 1 émotion dominante + 1 déclencheur. Pas d’analyse longue.",
      },
      {
        slug: "jalousie-confiance",
        title: "Jalousie : règles et confiance",
        subtitle: "Besoin de sécurité ≠ droit de contrôler le téléphone.",
        durationMin: 8,
        videoUrl: null,
        sections: [
          {
            title: "Deux lectures possibles",
            points: [
              "Besoin normal de clarté et de fidélité",
              "Contrôle qui étouffe (mots de passe, interrogatoires)",
            ],
          },
          {
            title: "Cadre sain (même en fréquentation)",
            points: [
              "Dites ce qui vous rassure (et ce qui vous blesse)",
              "Accords clairs sur amitiés / réseaux / transparence",
              "Si la jalousie domine tout : travail perso + mentor",
            ],
          },
        ],
        keyPoints: [
          "La confiance se construit, elle ne s’extorque pas",
          "Cacher des choses « pour éviter la scène » empire tout",
          "Un contrôle permanent n’est pas de l’amour",
        ],
        resources: [
          {
            label: "Questions honnêtes",
            detail: "Qu’est-ce qui me rassure ? Qu’est-ce que je contrôle par peur ?",
          },
          {
            label: "Accord type",
            detail: "« On se dit les choses qui touchent notre relation. On ne fouille pas par panique. »",
          },
        ],
        selfCheck: {
          prompt: "Cochez ce qui est déjà vrai pour vous",
          items: [
            "Je distingue besoin de sécurité et contrôle",
            "Je peux parler de ma jalousie sans accuser",
            "Je travaille ma part (pas seulement « l’autre doit changer »)",
          ],
        },
        exercise:
          "Notez 1 situation jalouse récente. Écrivez le besoin réel derrière (sécurité, respect, clarté).",
      },
      {
        slug: "guerir-deception",
        title: "Guérir d’une déception amoureuse",
        subtitle: "Avant de rebondir : laisser le cœur se remettre.",
        durationMin: 8,
        videoUrl: null,
        sections: [
          {
            title: "Pièges du rebond",
            points: [
              "Nouvelle relation pour prouver que « ça va »",
              "Comparer chaque personne au précédent",
              "Promettre trop vite pour combler le vide",
            ],
          },
          {
            title: "Chemin simple",
            points: [
              "Nommer la perte (même si « ce n’était pas un mariage »)",
              "Limiter les scrolls sur son profil",
              "Temps avec Dieu, amis sains, éventuellement counseling",
            ],
          },
        ],
        keyPoints: [
          "Guérir n’est pas une faiblesse",
          "KELIAA est un outil — pas un pansement émotionnel",
          "Vous serez plus libre pour aimer après",
        ],
        resources: [
          {
            label: "Signes que vous avancez",
            detail: "Moins d’obsession · sommeil · capacité à dire non · joie qui revient par moments.",
          },
          {
            label: "Ancre",
            detail: "Psaume 34.19 — Dieu près des cœurs brisés.",
          },
        ],
        selfCheck: {
          prompt: "Cochez ce qui est déjà vrai pour vous",
          items: [
            "Je peux parler de ma déception sans m’effondrer chaque fois",
            "Je ne cherche pas quelqu’un juste pour « remplacer »",
            "J’ai au moins 1 personne de confiance dans mon parcours",
          ],
        },
        exercise:
          "Écrivez une lettre (non envoyée) : ce qui a blessé · ce que vous libérez · ce que vous demandez à Dieu. Puis rangez-la.",
      },
    ],
  },
  {
    id: "projet",
    title: "Projet de vie à deux",
    summary:
      "Enfants, rôles, objectifs : en parler assez tôt pour construire ensemble — pas découvrir trop tard des murs invisibles.",
    lessons: [
      {
        slug: "projet-enfants",
        title: "Parler du projet d’enfants",
        subtitle: "Tôt, avec douceur. Pas comme un interrogatoire au 2e café.",
        durationMin: 7,
        isFreePreview: true,
        videoUrl: null,
        sections: [
          {
            title: "Sujets à clarifier",
            points: [
              "Envie d’enfants : oui / non / plus tard / je ne sais pas encore",
              "Nombre approximatif et timing",
              "Peur, infertilité, adoption : des sujets possibles avec délicatesse",
            ],
          },
          {
            title: "Si désaccord",
            points: [
              "Ne forcez pas un « on verra » pour sauver la relation",
              "Prenez le temps + conseil mature",
              "Certains désaccords sont des non-compatibles — et c’est mieux de le savoir",
            ],
          },
        ],
        keyPoints: [
          "Ce n’est pas un sujet « après le mariage seulement »",
          "L’honnêteté aujourd’hui évite la rancune demain",
          "Le désir peut évoluer — le silence, non",
        ],
        resources: [
          {
            label: "Question douce",
            detail: "« Comment tu imagines une famille dans 5–10 ans ? »",
          },
          {
            label: "Timing",
            detail: "Quand la relation devient sérieuse — pas au premier message.",
          },
        ],
        selfCheck: {
          prompt: "Cochez ce qui est déjà vrai pour vous",
          items: [
            "Je connais mon désir actuel (même s’il est « je ne sais pas »)",
            "Je peux en parler sans paniquer",
            "Je n’utiliserai pas ce sujet pour manipuler quelqu’un",
          ],
        },
        exercise:
          "Écrivez votre vision (3 lignes). Si vous êtes en fréquentation sérieuse : choisissez un moment calme pour en parler.",
      },
      {
        slug: "roles-foyer",
        title: "Rôles au foyer",
        subtitle: "Selon dons et saisons — pas selon TikTok ou la pression du quartier.",
        durationMin: 7,
        videoUrl: null,
        sections: [
          {
            title: "Éviter la guerre idéologique",
            points: [
              "« Chez nous les hommes… / les femmes… » sans écoute",
              "Copier un couple d’influenceurs",
              "Tout décider seul(e) « parce que c’est la tradition »",
            ],
          },
          {
            title: "Répartir",
            points: [
              "Lister tâches + compétences + charges mentales",
              "Revoir chaque saison (bébé, déménagement, études)",
              "En fréquentation : observer comment l’autre traite le service et le quotidien",
            ],
          },
        ],
        keyPoints: [
          "Le service mutuel vaut mieux que le score",
          "Les rôles se discutent, ils ne s’imposent pas en silence",
          "Un bon partenaire parle de la vie concrète",
        ],
        resources: [
          {
            label: "Liste à co-créer",
            detail: "Courses · cuisine · lessive · factures · enfants · prière · contacts familles.",
          },
          {
            label: "Question",
            detail: "« Qu’est-ce qui te fatigue le plus dans le quotidien ? »",
          },
        ],
        selfCheck: {
          prompt: "Cochez ce qui est déjà vrai pour vous",
          items: [
            "J’ai une idée de ce que je peux porter / ce qui me pèse",
            "Je peux négocier sans mépriser l’autre",
            "Je n’attends pas un « rôle magique » sans conversation",
          ],
        },
        exercise:
          "Listez 5 tâches de foyer. Notez : j’aime / je peux / j’évite. Gardez pour une discussion sérieuse.",
      },
      {
        slug: "objectifs-12-mois",
        title: "Objectifs concrets (12 mois)",
        subtitle: "Une vision sans petit pas reste un rêve. Même célibataire.",
        durationMin: 8,
        videoUrl: null,
        sections: [
          {
            title: "Choisir 1 objectif",
            points: [
              "Spirituel, relationnel, pro, santé, ou finance — un seul d’abord",
              "Mesurable (ex. : « 3 soirées prière / semaine », pas « être meilleur »)",
              "Lié à la préparation du mariage si c’est votre saison",
            ],
          },
          {
            title: "Le découper",
            points: [
              "12 mois → 90 jours → cette semaine",
              "Un témoin (ami, mentor) pour rendre compte",
              "En couple : 1 objectif commun + 1 personnel chacun",
            ],
          },
        ],
        keyPoints: [
          "Petit et tenu > grand et abandonné",
          "Vous préparez le mariage en devenant quelqu’un de fiable",
          "Dieu bénit aussi la discipline humble",
        ],
        resources: [
          {
            label: "Fiche 1 page",
            detail: "Objectif · pourquoi · 1ère étape cette semaine · qui m’encourage.",
          },
          {
            label: "Revue",
            detail: "Chaque dimanche soir : 5 minutes — avancé / bloqué / prochain pas.",
          },
        ],
        selfCheck: {
          prompt: "Cochez ce qui est déjà vrai pour vous",
          items: [
            "J’ai 1 objectif clair pour les 12 mois",
            "J’ai une première étape cette semaine",
            "Quelqu’un peut me demander des nouvelles",
          ],
        },
        exercise:
          "Écrivez votre objectif 12 mois + l’étape de cette semaine. Envoyez-la à une personne de confiance.",
      },
    ],
  },
]

export function getAcademyModule(id: string): AcademyModule | undefined {
  return ACADEMY_MODULES.find((m) => m.id === id)
}

export function getAcademyLesson(moduleId: string, lessonSlug: string) {
  const module = getAcademyModule(moduleId)
  if (!module) return undefined
  const index = module.lessons.findIndex((l) => l.slug === lessonSlug)
  if (index < 0) return undefined
  const lesson = module.lessons[index]
  return {
    module,
    lesson,
    index,
    prev: index > 0 ? module.lessons[index - 1] : null,
    next: index < module.lessons.length - 1 ? module.lessons[index + 1] : null,
  }
}

export function academyLessonPath(moduleId: string, lessonSlug: string) {
  return `/academie-mariage/${moduleId}/${lessonSlug}`
}

export function academyModulePath(moduleId: string) {
  return `/academie-mariage/${moduleId}`
}
