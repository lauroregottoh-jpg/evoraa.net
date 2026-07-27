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

export type AcademySelfCheck = {
  prompt: string
  items: string[]
}

export type AcademyLesson = {
  slug: string
  title: string
  subtitle: string
  durationMin: number
  /** Blocs courts : titre + puces pratiques */
  sections: AcademySection[]
  keyPoints: string[]
  resources: AcademyResource[]
  /** Mini auto-test / checklist */
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
    title: "Foi au quotidien du couple",
    summary:
      "Prière, Parole, service : des rythmes réalistes pour avancer sans s'épuiser ni se juger.",
    lessons: [
      {
        slug: "rythme-priere",
        title: "Un rythme de prière réaliste",
        subtitle: "Petit, régulier, tenable — pas un marathon spirituel.",
        durationMin: 8,
        isFreePreview: true,
        videoUrl: null,
        sections: [
          {
            title: "Pourquoi ça casse souvent",
            points: [
              "Objectif trop haut (« 30 min chaque soir ») → abandon en 2 semaines",
              "Un des deux parle, l'autre subit → frustration",
              "Prière = performance au lieu de présence",
            ],
          },
          {
            title: "Ce qui marche en pratique",
            points: [
              "3 minutes, 3 soirs / semaine : déjà une victoire",
              "Fixer l'heure (ex. après le repas) — pas « quand on pourra »",
              "Alterner : un jour l'un prie à voix haute, l'autre dit Amen",
              "Célibataire : même rythme seul(e), pour le préparer au couple",
            ],
          },
        ],
        keyPoints: [
          "Régularité > durée",
          "Créneau écrit dans l'agenda",
          "Pas de comparaison avec d'autres couples d'église",
        ],
        resources: [
          {
            label: "Modèle 3 minutes",
            detail: "1) Merci (30s) 2) Besoin du jour (1 min) 3) Bénédiction mutuelle (30s)",
          },
          {
            label: "Verset ancre",
            detail: "Matthieu 18.20 — présence promise, même à deux, même court.",
          },
        ],
        selfCheck: {
          prompt: "Cochez ce qui est vrai pour vous cette semaine",
          items: [
            "J'ai un créneau de prière écrit (seul ou à deux)",
            "Mon objectif tient en ≤ 5 minutes",
            "Je ne me compare pas à un « couple modèle »",
          ],
        },
        exercise:
          "Choisissez 3 soirs. Chronométrez 3 minutes. Notez 1 frein et 1 aide après chaque fois.",
      },
      {
        slug: "service-eglise",
        title: "Servir sans vider le foyer",
        subtitle: "Le service est une saison — pas une compétition d'épuisement.",
        durationMin: 7,
        videoUrl: null,
        sections: [
          {
            title: "Signaux d'alerte",
            points: [
              "Vous rentrez trop fatigué(e) pour parler ou prier",
              "Les enfants / le conjoint voient surtout votre absence",
              "Dire non à l'église vous remplit de culpabilité",
            ],
          },
          {
            title: "Règles simples",
            points: [
              "Aucun nouvel engagement sans en parler à deux (ou à un mentor)",
              "Revue tous les 3 mois : garder / réduire / pause",
              "Une saison intense (camp, conférence) = une saison de récupération après",
            ],
          },
        ],
        keyPoints: [
          "Foyer et service ne s'opposent pas — ils se planifient",
          "Dire non peut être un acte d'amour",
          "La culpabilité n'est pas un guide fiable",
        ],
        resources: [
          {
            label: "Tableau des engagements",
            detail: "Colonnes : activité · heures/semaine · joie (1–5) · coût foyer (1–5)",
          },
          {
            label: "Phrase utile au responsable",
            detail: "« Pour cette saison, je peux X heures. Au-delà, je dois décliner. »",
          },
        ],
        selfCheck: {
          prompt: "Auto-test charge de service",
          items: [
            "Je connais mon nombre d'heures / semaine pour l'église",
            "Mon conjoint / mentor connaît mes engagements",
            "J'ai le droit écrit de dire non sans me justifier 10 minutes",
          ],
        },
        exercise:
          "Listez tous vos engagements. Cochez 1 à 2 qui peuvent attendre 3 mois. Dites-le à quelqu'un cette semaine.",
      },
      {
        slug: "discerner-pasteur",
        title: "Discerner avec un aîné mature",
        subtitle: "Demander conseil sans déléguer sa décision.",
        durationMin: 6,
        videoUrl: null,
        sections: [
          {
            title: "Quand aller voir quelqu'un",
            points: [
              "Décision lourde (mariage, déménagement, rupture)",
              "Vous tournez en rond depuis > 1 mois",
              "Conflit familial ou d'église qui vous dépasse",
            ],
          },
          {
            title: "Comment préparer le RDV",
            points: [
              "3 questions max, écrites",
              "Faits en 5 minutes, pas un roman",
              "Demander : sagesse, pas « dites-moi quoi faire »",
            ],
          },
        ],
        keyPoints: [
          "Le conseiller éclaire — vous décidez",
          "Confidentialité et respect",
          "Un deuxième avis si le premier vous met mal à l'aise",
        ],
        resources: [
          {
            label: "Fiche RDV",
            detail: "Situation (5 lignes) · Ce que j'ai déjà essayé · 3 questions · Ce que je crains",
          },
          {
            label: "Qui choisir ?",
            detail: "Quelqu'un mature, discret, sans intérêt personnel dans votre choix.",
          },
        ],
        selfCheck: {
          prompt: "Suis-je prêt(e) à demander conseil ?",
          items: [
            "J'ai 3 questions précises",
            "Je peux accepter un avis différent du mien",
            "Je sais que la décision finale reste la mienne",
          ],
        },
        exercise:
          "Écrivez vos 3 questions. Identifiez 1 personne à contacter (même si le RDV est dans 2 semaines).",
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
        subtitle: "Remplacer l'accusation par une demande claire.",
        durationMin: 8,
        isFreePreview: true,
        videoUrl: null,
        sections: [
          {
            title: "À éviter",
            points: [
              "« Tu ne m'écoutes jamais »",
              "« Tu es comme ça… » (étiquette)",
              "Remonter 10 vieux dossiers dans la même phrase",
            ],
          },
          {
            title: "Structure utile",
            points: [
              "Je ressens… (émotion)",
              "Quand… (fait précis, récent)",
              "J'ai besoin de… (demande faisable)",
            ],
          },
        ],
        keyPoints: [
          "Un fait > une généralisation",
          "Un besoin n'est pas un ordre",
          "30 secondes d'écoute avant de répondre",
        ],
        resources: [
          {
            label: "Exemple prêt",
            detail:
              "« Je me sens seul(e) quand on ne se parle pas le soir. J'ai besoin de 10 minutes ensemble sans téléphone. »",
          },
          {
            label: "Liste d'émotions",
            detail: "Seul(e), frustré(e), inquiet(e), fatigué(e), blessé(e), reconnaissant(e)…",
          },
        ],
        selfCheck: {
          prompt: "Reformulation",
          items: [
            "Ma phrase parle de moi, pas d'une attaque",
            "Le fait est daté / précis",
            "La demande tient en une action concrète",
          ],
        },
        exercise:
          "Prenez une frustration récente. Écrivez-la en 1 phrase « je ressens / quand / j'ai besoin ». Lisez-la à voix haute.",
      },
      {
        slug: "feedback-difficile",
        title: "Recevoir un feedback difficile",
        subtitle: "Écouter d'abord — se défendre après, si besoin.",
        durationMin: 7,
        videoUrl: null,
        sections: [
          {
            title: "Réflexe à freiner",
            points: [
              "Interrompre pour se justifier",
              "Retourner la faute immédiatement",
              "Fuite (silence froid 3 jours)",
            ],
          },
          {
            title: "Séquence saine",
            points: [
              "« Merci d'en parler. Laisse-moi digérer. »",
              "Clarifier : comprendre ou changer quelque chose ?",
              "Revenir à heure fixe si c'est trop chaud",
            ],
          },
        ],
        keyPoints: [
          "Pause ≠ rejet",
          "Vous pouvez être en désaccord et rester respectueux",
          "Le but n'est pas de « gagner »",
        ],
        resources: [
          {
            label: "3 questions miroir",
            detail:
              "1) Qu'as-tu besoin que je comprenne ? 2) Qu'attends-tu de moi ? 3) Quand on en reparle ?",
          },
          {
            label: "Si c'est injuste",
            detail: "Notez votre version à froid. Revenez avec des faits, pas de la rage.",
          },
        ],
        selfCheck: {
          prompt: "Dernier feedback reçu",
          items: [
            "J'ai écouté au moins 2 minutes sans me justifier",
            "J'ai reformulé ce que j'ai compris",
            "J'ai fixé un moment pour y revenir si besoin",
          ],
        },
        exercise:
          "Demandez à un ami 1 feedback honnête. Entraînez-vous à écouter 2 minutes sans vous défendre.",
      },
      {
        slug: "besoins-sans-deviner",
        title: "Demander sans attendre qu'on devine",
        subtitle: "La clarté est un cadeau — pas une faiblesse.",
        durationMin: 6,
        videoUrl: null,
        sections: [
          {
            title: "Le piège du « il/elle devrait savoir »",
            points: [
              "Attendisme → rancœur",
              "Tests (« si tu m'aimais, tu saurais ») → manipulation",
              "L'autre échoue à un examen qu'il n'a pas vu",
            ],
          },
          {
            title: "Demander proprement",
            points: [
              "Une demande à la fois",
              "Accepter un non sans punition",
              "Remercier quand c'est entendu (même partiel)",
            ],
          },
        ],
        keyPoints: [
          "Demander = offrir une chance",
          "Non ≠ rejet de votre personne",
          "Répéter calmement si oublié — pas avec sarcasme",
        ],
        resources: [
          {
            label: "Besoins fréquents",
            detail: "Temps · encouragement · aide concrète · tendresse · solitude respectée · prière",
          },
          {
            label: "Phrase courte",
            detail: "« Est-ce possible pour toi de… cette semaine ? »",
          },
        ],
        selfCheck: {
          prompt: "Besoins non dits",
          items: [
            "J'ai identifié 2 besoins non exprimés",
            "J'en ai formulé 1 clairement",
            "Je suis prêt(e) à entendre un non",
          ],
        },
        exercise:
          "Notez 2 besoins non dits. Exprimez-en 1 cette semaine (conjoint, ami ou mentor).",
      },
    ],
  },
  {
    id: "conflits",
    title: "Conflits & réconciliation",
    summary: "Pause, premier pas, blessures : sortir des impasses sans s'écraser.",
    lessons: [
      {
        slug: "regle-pause",
        title: "La règle de pause",
        subtitle: "S'arrêter pour ne pas blesser — puis revenir.",
        durationMin: 7,
        isFreePreview: true,
        videoUrl: null,
        sections: [
          {
            title: "Quand faire pause",
            points: [
              "Voix qui monte / insultes proches",
              "Envie de fuir ou de « gagner » à tout prix",
              "Corps en alerte (cœur, tremblements)",
            ],
          },
          {
            title: "Comment faire pause",
            points: [
              "Phrase : « Je m'arrête pour ne pas te blesser. On se reparle à __h. »",
              "20–30 minutes minimum",
              "Pas de SMS agressifs pendant la pause",
            ],
          },
        ],
        keyPoints: [
          "Pause avec heure de retour = responsabilité",
          "Pause sans retour = abandon",
          "Revenir même si ce n'est pas « résolu »",
        ],
        resources: [
          {
            label: "Activités de pause",
            detail: "Marcher · boire de l'eau · prier 2 min · écrire 5 lignes — pas ruminer sur le canapé",
          },
          {
            label: "À l'écrit si besoin",
            detail: "3 faits · 1 émotion · 1 besoin — avant de se revoir",
          },
        ],
        selfCheck: {
          prompt: "Votre protocole",
          items: [
            "J'ai une phrase de pause mémorisée",
            "Nous avons (ou j'ai) une durée de pause par défaut",
            "Je m'engage à revenir à l'heure dite",
          ],
        },
        exercise:
          "Écrivez votre phrase de pause. Enregistrez-la dans les notes du téléphone.",
      },
      {
        slug: "premier-pas",
        title: "Faire le premier pas",
        subtitle: "Responsabilité ≠ s'écraser.",
        durationMin: 6,
        videoUrl: null,
        sections: [
          {
            title: "Ce que ce n'est pas",
            points: [
              "« C'est entièrement de ma faute » (faux si ce n'est pas vrai)",
              "Mendier le pardon en s'humiliant",
              "Ignorer la part de l'autre",
            ],
          },
          {
            title: "Ce que c'est",
            points: [
              "« Je tiens à nous. Voici ma part : … »",
              "Nommer un comportement concret à changer",
              "Inviter l'autre sans le forcer",
            ],
          },
        ],
        keyPoints: [
          "Le premier pas ouvre la porte — l'autre reste libre",
          "Une part honnête vaut mieux qu'un grand discours",
          "La fierté coûte plus cher que 2 minutes d'humilité",
        ],
        resources: [
          {
            label: "Modèle",
            detail:
              "« Quand j'ai [fait X], ça t'a [impact]. Je reconnais ma part. Je voudrais [action]. Es-tu ouvert(e) à en reparler ? »",
          },
        ],
        selfCheck: {
          prompt: "Sur un conflit en cours",
          items: [
            "Je peux nommer ma part en une phrase",
            "Je ne demande pas à l'autre d'effacer sa blessure",
            "Je suis prêt(e) à un premier pas cette semaine",
          ],
        },
        exercise:
          "Sur un conflit non résolu : écrivez « votre part » en une phrase honnête.",
      },
      {
        slug: "ne-pas-pourrir",
        title: "Ne pas laisser pourrir une blessure",
        subtitle: "Mieux une conversation maladroite qu'une rancune de 6 mois.",
        durationMin: 6,
        videoUrl: null,
        sections: [
          {
            title: "Signes de pourriture",
            points: [
              "Ironie / froid sans explication",
              "Vous en parlez à tout le monde sauf à la personne",
              "Le moindre détail ravive la même colère",
            ],
          },
          {
            title: "Débloquer",
            points: [
              "Fixer une date pour en parler (même 20 minutes)",
              "Écrire d'abord si la parole est trop chaude",
              "Chercher un tiers mature si le cycle se répète",
            ],
          },
        ],
        keyPoints: [
          "Le temps seul ne guérit pas toujours",
          "Nommer la blessure = premier soin",
          "Aide extérieure = sagesse, pas échec",
        ],
        resources: [
          {
            label: "Timer 20 min",
            detail: "10 min chacun · pas d'interruptions · 1 demande chacun à la fin",
          },
          {
            label: "Quand appeler à l'aide",
            detail: "Même conflit 3+ fois · insultes · peur · silence > 2 semaines",
          },
        ],
        selfCheck: {
          prompt: "Blessure ouverte ?",
          items: [
            "J'ai identifié une blessure encore active",
            "J'ai un créneau pour l'aborder (ou pour écrire / prier)",
            "Je sais qui pourrait m'aider si je bloque",
          ],
        },
        exercise:
          "Identifiez 1 blessure ouverte. Planifiez un créneau cette semaine (parole, écrit ou prière).",
      },
    ],
  },
  {
    id: "purete",
    title: "Pureté & limites physiques",
    summary: "Limites, parole et passé : clarifier avec dignité pour protéger l'engagement.",
    lessons: [
      {
        slug: "definir-limites",
        title: "Définir ses limites avant le mariage",
        subtitle: "Le flou crée la confusion ; la clarté protège.",
        durationMin: 8,
        isFreePreview: true,
        videoUrl: null,
        sections: [
          {
            title: "Pourquoi écrire ses limites",
            points: [
              "Sous émotion, on négocie mal",
              "Chacun a un passé et une conscience différents",
              "Ce n'est pas un concours de sainteté — c'est du respect",
            ],
          },
          {
            title: "Comment faire",
            points: [
              "Seul(e) d'abord : OK / pas OK / zone grise",
              "En parler avant que la situation chauffe",
              "Revoir avec un mentor si besoin",
            ],
          },
        ],
        keyPoints: [
          "Limites personnelles avant limites de couple",
          "Revoir si le contexte change",
          "Pression ≠ amour",
        ],
        resources: [
          {
            label: "Grille simple",
            detail: "3 colonnes : OK · Pas OK · À discuter — lieux, heures, réseaux, contact physique",
          },
          {
            label: "Phrase de protection",
            detail: "« Je tiens à toi et à nos limites. On s'arrête là pour ce soir. »",
          },
        ],
        selfCheck: {
          prompt: "Clarté personnelle",
          items: [
            "J'ai écrit au moins 3 « pas OK »",
            "Je peux les dire sans m'excuser 5 minutes",
            "Je sais qui m'aiderait si je suis sous pression",
          ],
        },
        exercise:
          "Feuille privée : 3 OK / 3 pas OK. Gardez-la. Pas besoin de tout partager tout de suite.",
      },
      {
        slug: "parler-sexualite",
        title: "Parler de sexualité avec respect",
        subtitle: "Pudeur + clarté + bon timing.",
        durationMin: 7,
        videoUrl: null,
        sections: [
          {
            title: "Mauvais moments",
            points: [
              "En public ou devant la famille",
              "Au milieu d'une dispute",
              "Sous forte excitation (décisions biaisées)",
            ],
          },
          {
            title: "Bon cadre",
            points: [
              "Lieu calme, temps limité (20–30 min)",
              "Respecter le rythme de l'autre",
              "Zéro chantage (« si tu m'aimais… »)",
            ],
          },
        ],
        keyPoints: [
          "Le sujet n'est pas sale — il demande sagesse",
          "Écouter autant que parler",
          "On peut reporter sans rejeter",
        ],
        resources: [
          {
            label: "Ouverture respectueuse",
            detail:
              "« J'aimerais qu'on clarifie nos limites / attentes, pour se respecter. Est-ce un bon moment ? »",
          },
          {
            label: "Si blocage",
            detail: "Proposer un couple mentor ou pasteur — pas forcer la confidence.",
          },
        ],
        selfCheck: {
          prompt: "Préparation",
          items: [
            "J'ai 2 phrases d'ouverture prêtes",
            "Je connais mon rythme (pas celui des réseaux)",
            "Je refuse la pression comme critère d'amour",
          ],
        },
        exercise: "Écrivez 2 phrases respectueuses pour ouvrir ce sujet le moment venu.",
      },
      {
        slug: "passe-transparence",
        title: "Passé, guérison, transparence",
        subtitle: "Honnêteté utile — pas forcément tous les détails.",
        durationMin: 7,
        videoUrl: null,
        sections: [
          {
            title: "Ordre sage",
            points: [
              "Guérir / être accompagné(e) soi-même d'abord",
              "Choisir le niveau de détail utile à la confiance",
              "Bon moment (pas le 2ᵉ rendez-vous ni la veille du mariage sans préparation)",
            ],
          },
          {
            title: "Pièges",
            points: [
              "Tout cacher par honte",
              "Tout déverser pour « vider » sans égard",
              "Utiliser le passé de l'autre comme arme plus tard",
            ],
          },
        ],
        keyPoints: [
          "Grâce et vérité ensemble",
          "Un conseiller peut préparer la conversation",
          "Le futur conjoint n'est pas votre thérapeute exclusif",
        ],
        resources: [
          {
            label: "Questions à se poser",
            detail:
              "Qu'est-ce qui affecte notre futur ? Qu'est-ce qui est déjà guéri ? De quoi ai-je besoin (prière, counseling) ?",
          },
          {
            label: "Soutien",
            detail: "Pasteur · conseiller chrétien · groupe de guérison — selon votre contexte.",
          },
        ],
        selfCheck: {
          prompt: "Transparence responsable",
          items: [
            "Je distingue honte et responsabilité",
            "Je sais si j'ai besoin d'aide avant d'en parler",
            "Je ne compte pas utiliser un passé contre quelqu'un",
          ],
        },
        exercise:
          "Si un élément pèse : notez « j'ai besoin d'un conseiller avant / je peux en parler / pas encore ». Une case suffit.",
      },
    ],
  },
  {
    id: "familles",
    title: "Familles & foyer",
    summary: "Honorer les parents, décider à deux, poser des limites sans guerre.",
    lessons: [
      {
        slug: "beaux-parents",
        title: "Limites saines avec les familles",
        subtitle: "Honorer ≠ tout accepter.",
        durationMin: 7,
        isFreePreview: true,
        videoUrl: null,
        sections: [
          {
            title: "Principes",
            points: [
              "Le couple décide ; la famille conseille",
              "Pas de triangulation (plaintes via un parent)",
              "Visites, argent, avis : règles claires",
            ],
          },
          {
            title: "En pratique",
            points: [
              "Une voix du couple vers l'extérieur (éviter les messages contradictoires)",
              "Remercier avant de poser une limite",
              "Revoir les règles aux grandes saisons (bébé, deuil, déménagement)",
            ],
          },
        ],
        keyPoints: [
          "Limite = protection du foyer, pas rejet des parents",
          "L'unité du couple passe avant « faire plaisir à tous »",
          "La politesse n'oblige pas à l'obéissance adulte",
        ],
        resources: [
          {
            label: "Phrase limite",
            detail:
              "« On vous aime. Sur ce point, on a décidé X. Merci de nous faire confiance. »",
          },
          {
            label: "Sujets à clarifier",
            detail: "Argent · garde enfants · avis sur conjoint · fréquence des visites · secrets",
          },
        ],
        selfCheck: {
          prompt: "Clarté familiale",
          items: [
            "Nous (ou je) avons 1 limite prioritaire écrite",
            "Elle est formulée sans insulte",
            "On sait qui parle à la famille élargie",
          ],
        },
        exercise:
          "Écrivez 1 limite à protéger (temps, argent ou décisions) en une phrase respectueuse.",
      },
      {
        slug: "vivre-avec-famille",
        title: "Vivre avec la famille élargie",
        subtitle: "Pour ou contre — sans jugement culturel.",
        durationMin: 6,
        videoUrl: null,
        sections: [
          {
            title: "Peser le pour / contre",
            points: [
              "Avantages : aide, économies, présence",
              "Risques : intimité, conflits, décisions diluées",
              "Durée prévue si possible (ex. 12 mois)",
            ],
          },
          {
            title: "Si vous cohabitez",
            points: [
              "Espace couple (chambre / horaires)",
              "Budget et courses : qui paie quoi",
              "Droit de dire non aux « avis » quotidiens",
            ],
          },
        ],
        keyPoints: [
          "Accord conscient > arrangement subi",
          "Culture et moyens comptent — la dignité aussi",
          "Prévoir une date de réévaluation",
        ],
        resources: [
          {
            label: "Checklist cohabitation",
            detail: "Durée · loyer · intimité · tâches · gestion des conflits · plan de sortie",
          },
        ],
        selfCheck: {
          prompt: "Décision éclairée",
          items: [
            "J'ai listé 3 avantages et 3 risques",
            "Il y a une durée ou une condition de sortie",
            "L'intimité du couple est prévue",
          ],
        },
        exercise: "3 avantages + 3 risques de cohabiter dans votre contexte. Une page max.",
      },
      {
        slug: "opinion-famille",
        title: "Quand la famille a une opinion forte",
        subtitle: "Écouter sans abdiquer.",
        durationMin: 6,
        videoUrl: null,
        sections: [
          {
            title: "Recevoir",
            points: [
              "Écouter sans se disputer immédiatement",
              "Remercier pour l'intérêt",
              "Dire : « On va prier / réfléchir, on revient vers vous »",
            ],
          },
          {
            title: "Répondre",
            points: [
              "Décision claire, ton calme",
              "Pas besoin d'un plaidoyer de 30 minutes",
              "Mentor si la pression devient harcèlement",
            ],
          },
        ],
        keyPoints: [
          "Écouter ≠ obéir",
          "La répétition calme vaut mieux que la colère",
          "Protéger le couple des campagnes familiales",
        ],
        resources: [
          {
            label: "Réponse type",
            detail:
              "« Merci pour votre avis. Nous avons décidé X, en conscience. On compte sur votre bénédiction. »",
          },
        ],
        selfCheck: {
          prompt: "Sous pression ?",
          items: [
            "Je distingue conseil et contrôle",
            "J'ai une réponse courte prête",
            "Je sais qui m'appuie si ça force",
          ],
        },
        exercise:
          "Rédigez une réponse courte à une objection familiale typique (mariage, études, déménagement…).",
      },
    ],
  },
  {
    id: "finances",
    title: "Finances & intendance",
    summary: "Transparence, budget, aide familiale : un cadre commun sans honte.",
    lessons: [
      {
        slug: "transparence-argent",
        title: "Transparence avant l'engagement",
        subtitle: "Mieux un inventaire honnête tôt qu'une surprise tardive.",
        durationMin: 8,
        isFreePreview: true,
        videoUrl: null,
        sections: [
          {
            title: "À mettre sur la table",
            points: [
              "Revenus approximatifs",
              "Dettes (montant + mensualités)",
              "Habitudes (épargne, dons, dépenses « plaisir »)",
            ],
          },
          {
            title: "Comment en parler",
            points: [
              "Sans jugement : faits d'abord",
              "Documents si possible (relevés, crédits)",
              "Plan ensuite — pas seulement des sentiments",
            ],
          },
        ],
        keyPoints: [
          "La honte se soigne par la clarté, pas le secret",
          "Chacun révèle avant de demander à l'autre",
          "Un mentor financier peut aider si c'est lourd",
        ],
        resources: [
          {
            label: "Mini bilan",
            detail: "Actifs · dettes · charges fixes mensuelles · reste à vivre",
          },
          {
            label: "Phrase d'ouverture",
            detail: "« Je veux qu'on construise en vérité. Voici ma situation actuelle… »",
          },
        ],
        selfCheck: {
          prompt: "Suis-je transparent(e) avec moi-même ?",
          items: [
            "Je connais mes dettes à ±10 %",
            "Je connais mes charges fixes",
            "Je peux en parler sans mentir par omission",
          ],
        },
        exercise: "Faites votre inventaire personnel (même approximatif) sur une feuille.",
      },
      {
        slug: "budget-deux",
        title: "Budget simple à deux",
        subtitle: "Une carte — pas une prison.",
        durationMin: 7,
        videoUrl: null,
        sections: [
          {
            title: "4 cases",
            points: [
              "Besoins (loyer, nourriture, transport)",
              "Épargne / imprévus",
              "Dons",
              "Plaisir (sans culpabilité, avec plafond)",
            ],
          },
          {
            title: "Routine",
            points: [
              "Revue 20 minutes / mois",
              "Compte commun ou règles claires si comptes séparés",
              "1 objectif d'épargne visible",
            ],
          },
        ],
        keyPoints: [
          "Le budget se révise — il ne se rigidifie pas",
          "Chacun a un peu d'autonomie (argent « libre »)",
          "L'imprévu est prévu (même petit)",
        ],
        resources: [
          {
            label: "Rituel mensuel",
            detail: "Date fixe · thés · 4 cases · 1 ajustement · 1 célébration",
          },
          {
            label: "Outils simples",
            detail: "Cahier · Excel · app notes — le plus simple que vous tiendrez",
          },
        ],
        selfCheck: {
          prompt: "Budget vivant ?",
          items: [
            "Nous (ou je) avons 4 cases définies",
            "Il y a une date de revue",
            "Il existe un petit poste « plaisir » assumé",
          ],
        },
        exercise:
          "Répartissez 100 % d'un revenu (réel ou fictif) en 4 cases. Une ligne chacune.",
      },
      {
        slug: "aider-famille",
        title: "Aider sa famille sans asphyxier le foyer",
        subtitle: "Générosité avec un plafond.",
        durationMin: 6,
        videoUrl: null,
        sections: [
          {
            title: "Tension classique",
            points: [
              "Pression familiale vs besoin du couple",
              "Urgence réelle vs habitude de dépendance",
              "Culpabilité si on dit non",
            ],
          },
          {
            title: "Cadre",
            points: [
              "Plafond mensuel décidé à deux",
              "Urgence ≠ abonnement à vie",
              "Dire non avec respect et alternative (si possible)",
            ],
          },
        ],
        keyPoints: [
          "Aider n'oblige pas à se ruiner",
          "Le couple est prioritaire sur les demandes chroniques",
          "La transparence évite les « cadeaux secrets » toxiques",
        ],
        resources: [
          {
            label: "Plafond",
            detail: "Montant max / mois · exceptions (santé, décès) · qui décide en urgence",
          },
          {
            label: "Non respectueux",
            detail: "« On ne peut pas ce mois-ci. On a un engagement foyer. On prie avec vous. »",
          },
        ],
        selfCheck: {
          prompt: "Générosité cadrée",
          items: [
            "Un plafond existe (même provisoire)",
            "Le conjoint / mentor est au courant",
            "Je distingue urgence et habitude",
          ],
        },
        exercise: "Fixez un plafond mensuel d'aide familiale réaliste (même pour vous seul).",
      },
    ],
  },
  {
    id: "emotions",
    title: "Émotions & stress",
    summary: "Nommer, calmer, reconstruire la confiance après stress ou blessure.",
    lessons: [
      {
        slug: "nommer-emotion",
        title: "Nommer l'émotion avant de répondre",
        subtitle: "Ce qui est nommé se dirige mieux.",
        durationMin: 6,
        isFreePreview: true,
        videoUrl: null,
        sections: [
          {
            title: "Sans nom = pilote automatique",
            points: [
              "Message envoyé trop vite",
              "Ton qui blesse",
              "Regret 10 minutes plus tard",
            ],
          },
          {
            title: "Micro-protocole",
            points: [
              "Pause 10 secondes",
              "Nommer : peur, colère, tristesse, honte, fatigue…",
              "Puis choisir : parler / écrire / marcher",
            ],
          },
        ],
        keyPoints: [
          "L'émotion est une info, pas un ordre",
          "Nommer n'excuse pas de blesser",
          "Le corps signale souvent avant les mots",
        ],
        resources: [
          {
            label: "Vocabulaire court",
            detail: "En colère · inquiet · humilié · déçu · submergé · reconnaissant",
          },
          {
            label: "Phrase tampon",
            detail: "« Je suis trop monté(e). Je reviens dans 20 minutes. »",
          },
        ],
        selfCheck: {
          prompt: "Aujourd'hui",
          items: [
            "J'ai nommé au moins 1 émotion avant d'agir",
            "J'ai utilisé une pause une fois",
            "Je n'ai pas envoyé de message « à chaud »",
          ],
        },
        exercise:
          "Quand une émotion monte : notez son nom avant d'envoyer un message. Une fois suffit pour commencer.",
      },
      {
        slug: "jalousie",
        title: "Jalousie : règles et confiance",
        subtitle: "Besoin de sécurité ≠ droit de contrôler.",
        durationMin: 7,
        videoUrl: null,
        sections: [
          {
            title: "Deux lectures possibles",
            points: [
              "Besoin de rassurance (légitime à dire)",
              "Blessure ancienne (à travailler)",
              "Contrôle déguisé (à refuser)",
            ],
          },
          {
            title: "Cadre couple",
            points: [
              "Règles mutuelles (réseaux, amitiés, transparence)",
              "Parler du besoin sous la jalousie",
              "Aide perso si la peur domine tout",
            ],
          },
        ],
        keyPoints: [
          "La confiance se construit — elle ne s'exige pas par la force",
          "Règles claires > soupçons permanents",
          "Surveiller le téléphone de l'autre n'est pas une solution durable",
        ],
        resources: [
          {
            label: "Questions utiles",
            detail: "De quoi ai-je peur ? De quoi ai-je besoin ? Quelle règle nous aiderait tous les deux ?",
          },
          {
            label: "Ligne rouge",
            detail: "Insultes · isolement · chantage — sortir et chercher de l'aide",
          },
        ],
        selfCheck: {
          prompt: "Lecture honnête",
          items: [
            "Je peux nommer le besoin sous ma jalousie",
            "Mes demandes sont des règles, pas du contrôle",
            "Je travaille aussi ma part (pas seulement « l'autre doit… »)",
          ],
        },
        exercise:
          "Situation déclenchante → besoin caché en 1 mot. Écrivez-le.",
      },
      {
        slug: "guerir-deception",
        title: "Guérir d'une déception amoureuse",
        subtitle: "Avant de rebondir : laisser le deuil faire son travail.",
        durationMin: 7,
        videoUrl: null,
        sections: [
          {
            title: "Pièges du rebond",
            points: [
              "Nouveau lien pour anesthésier la douleur",
              "Idéaliser le suivant",
              "Répéter le même schéma sans l'avoir nommé",
            ],
          },
          {
            title: "Chemin de guérison",
            points: [
              "Temps + soutien + vérité",
              "Journal : faits / leçons / pardon (soi et l'autre)",
              "Reprise progressive (amitiés, service, projets)",
            ],
          },
        ],
        keyPoints: [
          "Guérir n'est pas « tout oublier »",
          "Une leçon claire évite la rumination",
          "Vous n'êtes pas en retard sur l'amour",
        ],
        resources: [
          {
            label: "3 questions",
            detail: "Qu'ai-je appris sur moi ? Sur mes critères ? Sur mes limites ?",
          },
          {
            label: "Soutien",
            detail: "Ami fidèle · pasteur · counseling — selon l'intensité de la blessure",
          },
        ],
        selfCheck: {
          prompt: "État de guérison",
          items: [
            "Je peux parler de la déception sans exploser",
            "J'ai tiré 1–3 leçons concrètes",
            "Je ne force pas un nouveau départ « pour prouver »",
          ],
        },
        exercise:
          "Écrivez 3 choses apprises d'une déception (sans ruminer les détails).",
      },
    ],
  },
  {
    id: "projet",
    title: "Projet de vie à deux",
    summary: "Enfants, rôles, objectifs : aligner une vision partageable.",
    lessons: [
      {
        slug: "projet-enfants",
        title: "Aligner le projet d'enfants",
        subtitle: "En parler tôt — avec douceur et clarté.",
        durationMin: 7,
        isFreePreview: true,
        videoUrl: null,
        sections: [
          {
            title: "Sujets à clarifier",
            points: [
              "Désir d'enfants : oui / non / ouvert",
              "Timing approximatif",
              "Nombre envisagé (même large)",
            ],
          },
          {
            title: "Si désaccord",
            points: [
              "Écouter sans ridiculiser",
              "Ne pas « convertir » sous pression",
              "Revenir au sujet (ce n'est pas un one-shot)",
            ],
          },
        ],
        keyPoints: [
          "Le non-dit pèse plus que le désaccord assumé",
          "Les convictions peuvent évoluer — la vérité actuelle compte",
          "Un mentor aide si le fossé est large",
        ],
        resources: [
          {
            label: "Carte vision",
            detail: "Ma vision · sa vision · zone commune · points à creuser",
          },
        ],
        selfCheck: {
          prompt: "Clarté personnelle",
          items: [
            "Je peux dire ma vision en une phrase",
            "Je connais (ou vais demander) celle de l'autre",
            "Je refuse de mentir pour « garder » quelqu'un",
          ],
        },
        exercise: "Votre vision enfants/timing en une phrase. Notez-la.",
      },
      {
        slug: "roles-foyer",
        title: "Rôles au foyer",
        subtitle: "Selon dons et saison — pas selon les réseaux.",
        durationMin: 6,
        videoUrl: null,
        sections: [
          {
            title: "Éviter la guerre idéologique",
            points: [
              "Ni « c'est toujours comme ça chez nous » sans discussion",
              "Ni copie d'un modèle Instagram",
              "Charge mentale = travail invisible à nommer",
            ],
          },
          {
            title: "Répartir",
            points: [
              "Lister les tâches",
              "Qui le fait le mieux / qui a la bande passante",
              "Revoir quand la vie change (job, bébé, déménagement)",
            ],
          },
        ],
        keyPoints: [
          "Accord juste > modèle théorique",
          "Remercier le travail invisible",
          "Flexible ≠ flou",
        ],
        resources: [
          {
            label: "Liste type",
            detail: "Courses · repas · ménage · admin · enfants · liens famille · spirituel",
          },
          {
            label: "Revue",
            detail: "Tous les 3 mois : qu'est-ce qui pèse ? Qu'est-ce qu'on permute ?",
          },
        ],
        selfCheck: {
          prompt: "Équité ressentie",
          items: [
            "Les tâches principales sont nommées",
            "Chacun sait ce qu'il porte",
            "On a une date de revue",
          ],
        },
        exercise:
          "Listez 5 tâches du foyer. Pour chacune : qui le ferait le mieux aujourd'hui ?",
      },
      {
        slug: "objectifs-concrets",
        title: "Objectifs concrets (12 mois)",
        subtitle: "Une vision sans chiffre reste un rêve.",
        durationMin: 6,
        videoUrl: null,
        sections: [
          {
            title: "Choisir 1 objectif",
            points: [
              "Logement · épargne · formation · dette · santé",
              "Mesurable (montant, date, livrable)",
              "Partagé si vous êtes à deux",
            ],
          },
          {
            title: "Le découper",
            points: [
              "Étape de ce mois",
              "Responsable",
              "Mini-célébration à mi-parcours",
            ],
          },
        ],
        keyPoints: [
          "1 objectif bien suivi > 5 abandonnés",
          "Écrire = s'engager",
          "Ajuster sans abandonner la direction",
        ],
        resources: [
          {
            label: "Fiche 12 mois",
            detail: "Objectif · pourquoi · montant/date · 1ère action · revue mensuelle",
          },
        ],
        selfCheck: {
          prompt: "Objectif vivant",
          items: [
            "J'ai 1 objectif à 12 mois écrit",
            "J'ai 1 action ce mois-ci",
            "Quelqu'un de confiance est au courant",
          ],
        },
        exercise:
          "Écrivez 1 objectif à 12 mois + la première action de ce mois-ci.",
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
