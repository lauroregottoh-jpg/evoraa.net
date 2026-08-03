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
  /** Paragraphes de la leçon (contenu long) */
  body?: string[]
  /** Puces optionnelles (rétrocompat / CMS) */
  points?: string[]
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
  /** Temps de lecture estimé (minutes) */
  durationMin: number
  /** Image de couverture thématique */
  coverImage?: string
  /** Introduction narrative */
  intro?: string[]
  /** Objectifs d'apprentissage */
  learningGoals?: string[]
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
    title: "Construire sa vie spirituelle",
    summary: "Cette leçon t'aidera à construire une habitude de prière simple, réaliste et durable. Tu découvriras qu'il vaut mieux quelques minutes vécues avec sincérité qu'une longue prière occasionnelle.",
    lessons: [
      {
        slug: "prier-un-peu-mais-vraiment",
        title: "Prier un peu… mais vraiment",
        subtitle: "Avant de construire une vie à deux, il est important d'apprendre à construire une relation personnelle avec Dieu.",
        durationMin: 10,
        isFreePreview: true,
        coverImage: "/academy/academy-foi.png",
        videoUrl: null,
        intro: [
          "Avant de construire une vie à deux, il est important d'apprendre à construire une relation personnelle avec Dieu. Beaucoup de personnes pensent qu'il faut prier longtemps pour être de \"bons chrétiens\". Elles se fixent des objectifs difficiles à tenir, se découragent rapidement, puis finissent par abandonner complètement. Pourtant, la croissance spirituelle ne dépend pas de la durée de nos prières, mais de notre fidélité à revenir vers Dieu, jour après jour.",
          "Cette leçon t'aidera à construire une habitude de prière simple, réaliste et durable. Tu découvriras qu'il vaut mieux quelques minutes vécues avec sincérité qu'une longue prière occasionnelle. L'objectif n'est pas d'impressionner Dieu, mais de développer une relation authentique qui fortifiera ta vie personnelle et préparera les fondations de ton futur foyer.",
        ],
        learningGoals: [
          "Comprendre pourquoi la régularité est plus importante que la durée.",
          "Mettre en place un temps de prière adapté à ton quotidien.",
          "Identifier les habitudes qui favorisent une vie spirituelle stable.",
          "Éviter les erreurs qui découragent le plus souvent.",
        ],
        sections: [
          {
            title: "Pourquoi la régularité compte davantage que la durée",
            body: [
              "Beaucoup de personnes commencent leur vie de prière avec de grandes ambitions. Elles décident de prier une heure par jour, puis abandonnent dès que leur emploi du temps change. Ce fonctionnement crée souvent de la frustration et un sentiment d'échec.",
              "La Bible nous montre pourtant que la fidélité est plus importante que la performance. Une habitude simple, répétée chaque jour, construit une relation beaucoup plus solide qu'un effort intense mais irrégulier. L'objectif n'est donc pas de prier longtemps, mais de revenir vers Dieu avec constance.",
            ],
          },
          {
            title: "Construire une habitude de prière qui dure",
            body: [
              "Une bonne habitude est une habitude que tu peux réellement tenir. Choisis un moment précis de la journée, un endroit calme et une durée raisonnable. Cinq minutes vécues avec attention auront plus de valeur qu'un long moment passé dans la distraction.",
              "Si tu manques une journée, ne culpabilise pas. Reprends simplement le lendemain. La persévérance est plus importante que la perfection.",
            ],
          },
          {
            title: "Les habitudes qui renforcent une vie spirituelle",
            body: [
              "La prière n'est pas la seule habitude qui nourrit ta relation avec Dieu. Lire quelques versets, prendre quelques instants pour remercier Dieu ou réfléchir à ce que tu as appris dans la journée sont également des moyens de grandir spirituellement.",
              "Ces habitudes n'ont pas besoin d'être compliquées. Elles deviennent efficaces lorsqu'elles trouvent naturellement leur place dans ton quotidien.",
            ],
          },
          {
            title: "Les erreurs qui découragent le plus souvent",
            body: [
              "L'une des erreurs les plus fréquentes consiste à comparer sa vie spirituelle à celle des autres. Chacun avance à son rythme et vit une relation différente avec Dieu.",
              "Une autre erreur est de croire qu'il faut attendre d'avoir envie de prier. Comme toute relation, la vie spirituelle se construit aussi dans la fidélité, même lorsque les émotions sont moins présentes.",
            ],
          },
        ],
        keyPoints: [
          "Une vie spirituelle solide ne se construit pas grâce à des efforts exceptionnels, mais grâce à des habitudes simples vécues avec fidélité. Ce qui compte n'est pas la longueur de tes prières, mais la régularité avec laquelle tu choisis de rencontrer Dieu.",
        ],
        resources: [],
        selfCheck: {
          prompt: "Fais le point — coche ce qui est déjà vrai pour toi",
          items: [
            "J'ai choisi un moment réaliste pour prier.",
            "Je comprends pourquoi la régularité est essentielle.",
            "J'ai identifié les habitudes qui peuvent nourrir ma vie spirituelle.",
            "Je connais les erreurs qui risquent de me décourager.",
          ],
        },
        exercise: "Pendant les cinq prochains jours, réserve cinq minutes à un moment fixe de la journée pour prier. À la fin de chaque temps, note en une phrase ce que tu retiens de cette rencontre avec Dieu.",
      },
    ],
  },
  {
    id: "dialogue",
    title: "Mieux communiquer avant le mariage",
    summary: "Apprendre à communiquer avant le mariage est une véritable préparation à la vie de couple. Il ne s'agit pas de tout dire, tout le temps, mais d'apprendre à exprimer ses besoins, ses inquiétudes et ses attentes avec respect.",
    lessons: [
      {
        slug: "dire-ce-que-lon-ressent",
        title: "Dire ce que l'on ressent... avant que le silence ne parle à notre place",
        subtitle: "La communication est l'un des fondements d'une relation solide.",
        durationMin: 10,
        isFreePreview: false,
        coverImage: "/academy/academy-dialogue.png",
        videoUrl: null,
        intro: [
          "La communication est l'un des fondements d'une relation solide. Pourtant, beaucoup de difficultés ne viennent pas d'un manque d'amour, mais d'un manque de dialogue. Par peur de blesser, d'être rejeté ou de provoquer une dispute, certaines personnes préfèrent garder leurs émotions pour elles. Sur le moment, cela semble plus simple. Avec le temps, ces silences deviennent pourtant une source de frustrations, de malentendus et d'éloignement.",
          "Apprendre à communiquer avant le mariage est une véritable préparation à la vie de couple. Il ne s'agit pas de tout dire, tout le temps, mais d'apprendre à exprimer ses besoins, ses inquiétudes et ses attentes avec respect. Une bonne communication ne supprime pas les désaccords, mais elle permet de les traverser sans abîmer la relation.",
        ],
        learningGoals: [
          "comprendre pourquoi les non-dits fragilisent une relation ;",
          "reconnaître les freins qui t'empêchent d'exprimer ce que tu ressens ;",
          "apprendre à parler avec respect, même lorsque le sujet est délicat ;",
          "créer des habitudes de communication qui renforcent la confiance.",
        ],
        sections: [
          {
            title: "Pourquoi les non-dits deviennent des problèmes",
            body: [
              "Un sujet que l'on évite ne disparaît pas forcément. Bien souvent, il continue de grandir dans notre esprit. On interprète les paroles de l'autre, on imagine ses intentions et on accumule des frustrations sans jamais les vérifier. Le jour où tout finit par sortir, la réaction paraît souvent disproportionnée parce qu'elle ne concerne plus un seul événement, mais plusieurs semaines, voire plusieurs mois de silence.",
              "Exprimer ce que l'on ressent ne signifie pas créer des conflits. Au contraire, c'est souvent la meilleure façon d'éviter qu'un petit problème ne devienne une grande blessure.",
            ],
          },
          {
            title: "Identifier ce qui t'empêche de parler",
            body: [
              "Certaines personnes ont grandi dans un environnement où il valait mieux se taire que s'exprimer. D'autres craignent de décevoir, de perdre la personne qu'elles aiment ou d'être mal comprises. Ces peurs sont réelles, mais elles ne doivent pas diriger la relation.",
              "Prends le temps de te demander ce qui te retient lorsque tu hésites à parler. Est-ce la peur de la réaction de l'autre ? La difficulté à mettre des mots sur tes émotions ? Ou simplement l'habitude de tout garder pour toi ? Identifier ce frein est souvent la première étape vers une communication plus saine.",
            ],
          },
          {
            title: "Parler avec respect, même lorsqu'un sujet est difficile",
            body: [
              "Le choix des mots a une grande importance. Une même idée peut être entendue de manière très différente selon la façon dont elle est exprimée. Évite les phrases qui accusent ou généralisent, comme « Tu fais toujours… » ou « Tu ne m'écoutes jamais… ». Elles poussent souvent l'autre à se défendre plutôt qu'à écouter.",
              "Privilégie des formulations qui parlent de ton ressenti : « Je me suis senti blessé lorsque… » ou « J'aimerais que nous en parlions ensemble. » Elles ouvrent davantage la porte au dialogue et permettent de chercher une solution sans transformer la discussion en affrontement.",
            ],
          },
          {
            title: "Construire des habitudes qui renforcent la confiance",
            body: [
              "Une bonne communication ne dépend pas uniquement des grandes conversations. Elle se construit aussi dans les échanges du quotidien. Prendre quelques minutes pour parler de sa journée, demander sincèrement comment l'autre va ou remercier pour une attention reçue contribue à créer un climat de confiance.",
              "Lorsque ces habitudes sont présentes avant le mariage, elles deviennent des réflexes précieux pour traverser ensemble les défis de la vie de couple.",
            ],
          },
        ],
        keyPoints: [
          "Les non-dits ne protègent pas une relation. Ils repoussent simplement les difficultés à plus tard. Une communication sincère, respectueuse et régulière permet de construire une relation où chacun se sent écouté, compris et en sécurité.",
        ],
        resources: [],
        selfCheck: {
          prompt: "Fais le point — coche ce qui est déjà vrai pour toi",
          items: [
            "Je comprends pourquoi les non-dits peuvent fragiliser une relation.",
            "J'ai identifié ce qui m'empêche le plus souvent d'exprimer mes émotions.",
            "Je sais formuler mon ressenti sans attaquer l'autre.",
            "Je souhaite mettre en place de meilleures habitudes de communication au quotidien.",
          ],
        },
        exercise: "Choisis une personne importante dans ta vie. Cette semaine, prends l'initiative d'avoir une conversation que tu repousses depuis quelque temps. Prépare-toi avec calme, exprime ton ressenti sans accuser et laisse à l'autre le temps de répondre. À la fin de l'échange, demande-toi : *Ai-je cherché à comprendre autant qu'à être compris ?*",
      },
    ],
  },
  {
    id: "conflits",
    title: "Gérer les désaccords avec maturité",
    summary: "Apprendre à gérer un conflit avant le mariage est une compétence précieuse. Si tu sais écouter, reconnaître tes torts, demander pardon et rechercher une solution plutôt qu'une victoire, tu poseras des bases solides pour ton futur foyer.",
    lessons: [
      {
        slug: "gerer-les-desaccords",
        title: "Les conflits ne sont pas le problème... la manière de les gérer l'est.",
        subtitle: "Beaucoup de personnes pensent qu'un couple solide est un couple qui ne se dispute jamais.",
        durationMin: 10,
        isFreePreview: false,
        coverImage: "/academy/academy-conflits.png",
        videoUrl: null,
        intro: [
          "Beaucoup de personnes pensent qu'un couple solide est un couple qui ne se dispute jamais. Pourtant, les désaccords font partie de toute relation. Deux personnes ont des histoires, des sensibilités, des habitudes et des attentes différentes. Il est donc normal que des incompréhensions apparaissent. Ce qui fait la différence, ce n'est pas l'absence de conflit, mais la manière dont chacun choisit d'y réagir.",
          "Apprendre à gérer un conflit avant le mariage est une compétence précieuse. Si tu sais écouter, reconnaître tes torts, demander pardon et rechercher une solution plutôt qu'une victoire, tu poseras des bases solides pour ton futur foyer. Un conflit bien géré peut même renforcer la confiance lorsqu'il devient une occasion de mieux se comprendre.",
        ],
        learningGoals: [
          "comprendre pourquoi les conflits sont normaux dans une relation ;",
          "identifier les réactions qui aggravent une dispute ;",
          "apprendre à gérer un désaccord avec calme et respect ;",
          "transformer un conflit en opportunité de grandir ensemble.",
        ],
        sections: [
          {
            title: "Les conflits sont inévitables, mais ils ne sont pas dangereux",
            body: [
              "Avoir un désaccord ne signifie pas que la relation est en danger. Bien souvent, un conflit révèle simplement une différence de besoins, de valeurs ou de manière de voir les choses. Chercher à éviter toutes les discussions difficiles n'est pas une solution. Les sujets ignorés reviennent presque toujours, souvent avec plus de force.",
              "Considère le conflit comme un signal. Il indique qu'un sujet mérite d'être écouté et compris. Lorsqu'il est abordé avec respect, il permet de mieux connaître l'autre et de renforcer la relation.",
            ],
          },
          {
            title: "Les réactions qui font dégénérer une dispute",
            body: [
              "Dans une dispute, ce ne sont pas toujours les désaccords qui blessent le plus, mais la manière de les exprimer. Les paroles humiliantes, les cris, les accusations, les menaces ou le silence volontaire ferment la porte au dialogue. Chercher à avoir le dernier mot ou vouloir prouver que l'on a raison coûte souvent plus cher que le problème lui-même.",
              "Lorsque les émotions prennent toute la place, il devient difficile d'écouter. Apprendre à faire une pause, respirer et reprendre la conversation plus tard est parfois le choix le plus sage.",
            ],
          },
          {
            title: "Comment traverser un désaccord avec maturité",
            body: [
              "Une discussion constructive commence par une écoute sincère. Avant de répondre, cherche d'abord à comprendre ce que l'autre ressent. Pose des questions, reformule ce que tu as entendu et évite d'interpréter ses intentions. Cette attitude réduit les malentendus et montre que tu accordes de la valeur à son point de vue.",
              "Lorsque tu reconnais avoir commis une erreur, n'hésite pas à le dire. Demander pardon n'est pas un signe de faiblesse, mais de maturité. Dans une relation durable, préserver le lien est plus important que protéger son orgueil.",
            ],
          },
          {
            title: "Faire de chaque conflit une occasion de grandir",
            body: [
              "Après une dispute, prends le temps de revenir sur ce qui s'est passé. Demande-toi ce que cette situation t'a appris sur toi-même, sur l'autre et sur votre manière de communiquer. Chaque conflit peut devenir une occasion d'améliorer la relation si chacun accepte d'en tirer une leçon.",
              "Avec le temps, cette manière d'aborder les désaccords crée un climat de confiance. Chacun sait qu'il peut exprimer son opinion sans craindre d'être rejeté ou méprisé.",
            ],
          },
        ],
        keyPoints: [
          "Les conflits ne détruisent pas une relation. Ce sont les paroles blessantes, le manque d'écoute et le refus de chercher une solution qui l'affaiblissent. Une relation solide n'est pas une relation sans disputes, mais une relation où chacun apprend à gérer les désaccords avec respect, humilité et bienveillance.",
        ],
        resources: [],
        selfCheck: {
          prompt: "Fais le point — coche ce qui est déjà vrai pour toi",
          items: [
            "Je comprends que les conflits font partie de toute relation.",
            "Je sais reconnaître les réactions qui aggravent une dispute.",
            "Je suis capable de faire une pause avant de répondre sous le coup de la colère.",
            "Je suis prêt(e) à rechercher une solution plutôt qu'à vouloir absolument avoir raison.",
          ],
        },
        exercise: "Repense à un conflit récent, que ce soit avec une personne que tu fréquentes, un ami ou un membre de ta famille. Écris ce qui a déclenché la situation, ce que tu as ressenti et ce que tu aurais pu faire différemment. Si cela est possible, reprends cette conversation avec calme pour clarifier ce qui n'a pas été compris.",
      },
    ],
  },
  {
    id: "purete",
    title: "Respect, limites et intimité avant le mariage",
    summary: "Les limites ne sont pas là pour créer de la distance ou refroidir les sentiments. Elles existent pour préserver ce qui est précieux.",
    lessons: [
      {
        slug: "poser-des-limites",
        title: "Poser des limites n'est pas un manque d'amour",
        subtitle: "Lorsque deux personnes commencent à se fréquenter, il est naturel qu'elles aient envie de passer du temps ensemble, de mieux se connaître et de construire une relation plus profonde.",
        durationMin: 10,
        isFreePreview: false,
        coverImage: "/academy/academy-limites.png",
        videoUrl: null,
        intro: [
          "Lorsque deux personnes commencent à se fréquenter, il est naturel qu'elles aient envie de passer du temps ensemble, de mieux se connaître et de construire une relation plus profonde. Pourtant, l'amour ne grandit pas uniquement grâce à la proximité. Il grandit aussi grâce au respect. Des limites clairement définies protègent la relation, évitent les malentendus et permettent à chacun d'avancer en confiance.",
          "Les limites ne sont pas là pour créer de la distance ou refroidir les sentiments. Elles existent pour préserver ce qui est précieux. Qu'il s'agisse de la manière de se parler, de la gestion des émotions, de la sexualité ou du respect de l'espace personnel, il est toujours plus facile de fixer des limites avant qu'une situation ne devienne compliquée. Une relation saine est une relation où chacun connaît les valeurs qui guident le couple et choisit de les respecter.",
        ],
        learningGoals: [
          "comprendre pourquoi les limites protègent une relation ;",
          "identifier les domaines dans lesquels il est important de fixer des limites avant le mariage ;",
          "apprendre à communiquer ces limites avec respect et bienveillance ;",
          "reconnaître les situations où une limite mérite d'être réaffirmée.",
        ],
        sections: [
          {
            title: "Pourquoi les limites sont indispensables",
            body: [
              "Les limites ne sont pas des barrières contre l'amour. Elles sont des repères qui permettent à chacun de savoir ce qui est acceptable ou non dans la relation. Lorsqu'elles sont claires, elles réduisent les incompréhensions, renforcent le respect mutuel et créent un climat de sécurité.",
              "Attendre qu'un problème survienne pour parler de ses limites est souvent plus difficile. En les abordant dès le début de la relation, chacun sait sur quelles bases la confiance pourra se construire.",
            ],
          },
          {
            title: "Les limites importantes avant le mariage",
            body: [
              "Les limites concernent bien plus que la sexualité. Elles touchent également la manière de communiquer, le respect du temps de chacun, l'utilisation des réseaux sociaux, les fréquentations, les finances ou encore la place accordée aux familles. Tous ces sujets méritent d'être discutés avant de devenir des sources de tension.",
              "Prendre le temps d'échanger sur ces questions permet de mieux connaître l'autre et d'éviter de nombreuses déceptions. Une limite clairement exprimée vaut toujours mieux qu'une attente silencieuse.",
            ],
          },
          {
            title: "Comment parler de ses limites",
            body: [
              "Exprimer une limite ne revient pas à imposer sa volonté. Il s'agit d'expliquer ce qui est important pour soi et pourquoi cela compte. Une conversation calme, honnête et respectueuse favorise davantage la compréhension qu'une réaction sous le coup de l'émotion.",
              "Il est également important d'écouter les limites de l'autre avec la même attention. Le respect doit toujours être réciproque. Une relation équilibrée ne repose pas sur les exigences d'une seule personne, mais sur des décisions prises ensemble.",
            ],
          },
          {
            title: "Lorsque les limites ne sont pas respectées",
            body: [
              "Il peut arriver qu'une limite soit franchie, volontairement ou non. Dans ce cas, il est important d'en parler rapidement. Ignorer la situation ou espérer qu'elle ne se reproduira plus risque d'installer un malaise durable.",
              "Si une personne refuse systématiquement de respecter les limites pourtant clairement exprimées, cela mérite une réflexion sérieuse. Le respect est l'une des bases d'une relation saine. Sans lui, la confiance finit par s'affaiblir.",
            ],
          },
        ],
        keyPoints: [
          "Les limites ne sont pas un signe de méfiance. Elles sont une preuve de maturité et de respect. Elles permettent de construire une relation où chacun se sent libre, écouté et en sécurité, tout en préparant des bases solides pour un futur mariage.",
        ],
        resources: [],
        selfCheck: {
          prompt: "Fais le point — coche ce qui est déjà vrai pour toi",
          items: [
            "Je comprends que les limites protègent la relation.",
            "J'ai identifié les limites qui sont importantes pour moi.",
            "Je suis capable d'exprimer mes limites avec respect.",
            "Je comprends que respecter les limites de l'autre est une preuve d'amour et de maturité.",
          ],
        },
        exercise: "Prends un moment pour réfléchir aux valeurs qui sont les plus importantes pour toi dans une relation. Identifie trois limites que tu considères essentielles avant le mariage et demande-toi si tu serais capable de les expliquer avec calme à la personne que tu fréquentes. Si tu es déjà en relation, choisissez un moment pour en parler ensemble avec bienveillance.",
      },
    ],
  },
  {
    id: "familles",
    title: "Préparer son futur foyer",
    summary: "Préparer son futur foyer, c'est apprendre à honorer sa famille tout en construisant progressivement une nouvelle unité. Ce n'est pas choisir entre ses parents et son conjoint, mais comprendre que chaque relation a sa juste place.",
    lessons: [
      {
        slug: "construire-son-couple-et-sa-famille",
        title: "Construire son couple sans oublier sa famille",
        subtitle: "Le mariage ne réunit pas seulement deux personnes.",
        durationMin: 10,
        isFreePreview: false,
        coverImage: "/academy/academy-familles.png",
        videoUrl: null,
        intro: [
          "Le mariage ne réunit pas seulement deux personnes. Il rapproche aussi deux histoires, deux éducations, deux cultures et parfois deux façons très différentes de voir la famille. Beaucoup de tensions dans les jeunes couples ne viennent pas d'un manque d'amour, mais d'attentes qui n'ont jamais été exprimées concernant les parents, les frères et sœurs, les visites, les conseils ou encore les responsabilités familiales.",
          "Préparer son futur foyer, c'est apprendre à honorer sa famille tout en construisant progressivement une nouvelle unité. Ce n'est pas choisir entre ses parents et son conjoint, mais comprendre que chaque relation a sa juste place. Plus ces sujets sont abordés avant le mariage, plus il sera facile de préserver la paix une fois engagé.",
        ],
        learningGoals: [
          "comprendre pourquoi la famille peut devenir une source de tensions dans le couple ;",
          "distinguer le respect de sa famille de la dépendance familiale ;",
          "apprendre à poser des limites saines avec bienveillance ;",
          "préparer un foyer où chacun trouve sa place sans créer de conflits inutiles.",
        ],
        sections: [
          {
            title: "Comprendre l'influence de la famille sur le couple",
            body: [
              "Notre manière de voir le mariage est souvent influencée par ce que nous avons vécu dans notre propre famille. Certains ont grandi dans un environnement où tout se décidait en famille, tandis que d'autres ont appris à être très indépendants. Ces différences ne sont ni bonnes ni mauvaises, mais elles méritent d'être connues et discutées.",
              "Prendre conscience de cette influence permet de mieux comprendre certaines réactions et d'éviter de juger trop rapidement son futur conjoint. Derrière une habitude se cache souvent une histoire.",
            ],
          },
          {
            title: "Honorer ses parents sans oublier son futur foyer",
            body: [
              "La Bible nous encourage à honorer nos parents. Cet honneur ne signifie pas que toutes les décisions du couple doivent leur appartenir. En grandissant et en préparant un foyer, chacun apprend progressivement à prendre ses responsabilités et à construire son propre cadre de vie.",
              "Honorer sa famille, c'est continuer à lui témoigner du respect, de la reconnaissance et de l'amour, tout en comprenant que certaines décisions relèvent désormais du couple.",
            ],
          },
          {
            title: "Savoir poser des limites avec respect",
            body: [
              "Les limites ne servent pas à éloigner les familles, mais à protéger l'équilibre du futur foyer. Elles concernent par exemple la fréquence des visites, les conseils sollicités ou non, la gestion des conflits ou encore la place que chacun occupe dans les décisions importantes.",
              "Une limite bien expliquée est souvent mieux acceptée qu'un silence qui finit par créer de la frustration. L'objectif n'est pas de blesser, mais de construire des relations saines avec tous.",
            ],
          },
          {
            title: "Construire une nouvelle équipe",
            body: [
              "Le mariage crée une nouvelle famille. Cela demande d'apprendre à prendre des décisions ensemble, à se soutenir mutuellement et à présenter un front uni face aux défis. Lorsque chacun sait que son partenaire le respecte et le soutient, les influences extérieures deviennent beaucoup plus faciles à gérer.",
              "Préparer cette unité avant le mariage permet de construire un foyer où les liens familiaux restent précieux sans prendre la place de la relation de couple.",
            ],
          },
        ],
        keyPoints: [
          "Aimer sa famille et construire son propre foyer ne sont pas deux objectifs opposés. Une relation équilibrée permet de préserver les liens familiaux tout en donnant au couple l'espace nécessaire pour grandir, prendre ses décisions et bâtir son avenir.",
        ],
        resources: [],
        selfCheck: {
          prompt: "Fais le point — coche ce qui est déjà vrai pour toi",
          items: [
            "Je comprends que chaque personne arrive avec une histoire familiale différente.",
            "Je sais faire la différence entre honorer ma famille et dépendre de son avis.",
            "Je comprends l'importance de poser des limites respectueuses.",
            "Je suis prêt(e) à construire un foyer où le couple devient une véritable équipe.",
          ],
        },
        exercise: "Prends quelques minutes pour réfléchir à la place qu'occupe ta famille dans tes décisions importantes. Quelles habitudes aimerais-tu conserver dans ton futur foyer ? Lesquelles souhaites-tu faire évoluer ? Si tu es en couple, prenez le temps d'échanger sur vos attentes concernant les familles, les visites, les fêtes et les décisions importantes.",
      },
    ],
  },
  {
    id: "finances",
    title: "Parler d'argent avant le mariage",
    summary: "Parler d'argent ne signifie pas parler uniquement de salaire. C'est aussi parler de sa manière de gérer ses dépenses, de son rapport à l'épargne, de ses dettes éventuelles, de ses priorités et de sa vision de l'avenir.",
    lessons: [
      {
        slug: "parler-dargent",
        title: "L'argent ne fait pas le bonheur... mais il mérite d'être discuté",
        subtitle: "Beaucoup de couples évitent de parler d'argent pendant les fréquentations, par peur de créer un malaise ou de paraître trop exigeants.",
        durationMin: 10,
        isFreePreview: false,
        coverImage: "/academy/academy-finances.png",
        videoUrl: null,
        intro: [
          "Beaucoup de couples évitent de parler d'argent pendant les fréquentations, par peur de créer un malaise ou de paraître trop exigeants. Pourtant, les questions financières ne disparaissent pas après le mariage. Elles deviennent souvent plus importantes, car elles touchent les projets, les responsabilités et les choix du quotidien. Mieux vaut découvrir ces différences avant de s'engager que de les subir plus tard.",
          "Parler d'argent ne signifie pas parler uniquement de salaire. C'est aussi parler de sa manière de gérer ses dépenses, de son rapport à l'épargne, de ses dettes éventuelles, de ses priorités et de sa vision de l'avenir. Une conversation honnête sur ces sujets permet de construire une relation basée sur la confiance plutôt que sur les suppositions.",
        ],
        learningGoals: [
          "comprendre pourquoi les finances doivent être abordées avant le mariage ;",
          "identifier les sujets financiers importants à discuter avec ton futur conjoint ;",
          "apprendre à parler d'argent avec transparence et respect ;",
          "poser les bases d'une gestion financière saine pour votre futur foyer.",
        ],
        sections: [
          {
            title: "Pourquoi parler d'argent avant de s'engager",
            body: [
              "L'argent influence de nombreuses décisions dans un foyer : le logement, les projets, les enfants, les loisirs ou encore les responsabilités familiales. Lorsque ces sujets ne sont jamais abordés, chacun avance avec ses propres attentes, ce qui peut rapidement créer des frustrations.",
              "Parler d'argent n'est pas un manque de confiance. C'est une preuve de maturité. Plus les choses sont claires dès le départ, moins il y aura de surprises une fois le mariage commencé.",
            ],
          },
          {
            title: "Les conversations à ne pas éviter",
            body: [
              "Il est important d'échanger sur des sujets concrets : votre manière de gérer un budget, votre rapport aux dépenses, l'existence de dettes, vos objectifs d'épargne ou encore votre façon d'aider vos proches lorsque cela est nécessaire. Ces conversations ne servent pas à juger l'autre, mais à mieux comprendre son fonctionnement.",
              "L'objectif n'est pas d'être identiques. Deux personnes peuvent avoir des habitudes différentes et construire malgré tout une excellente gestion financière, à condition d'apprendre à dialoguer et à prendre des décisions ensemble.",
            ],
          },
          {
            title: "La transparence construit la confiance",
            body: [
              "Cacher une difficulté financière ou minimiser une dette par peur de la réaction de l'autre fragilise la relation. La confiance se construit lorsque chacun ose parler avec honnêteté, même lorsque certains sujets sont inconfortables.",
              "La transparence ne consiste pas à tout contrôler, mais à permettre à l'autre de prendre ses décisions en connaissant la réalité. Une relation solide repose sur la vérité, même lorsqu'elle demande du courage.",
            ],
          },
          {
            title: "Construire une vision commune",
            body: [
              "Un budget est un outil, pas une contrainte. Il permet de donner une direction à vos ressources en fonction de vos priorités. Parler de vos projets, de votre manière de consommer et de vos objectifs futurs vous aidera à avancer dans la même direction.",
              "Le plus important n'est pas le montant que chacun gagne, mais la capacité du couple à gérer ensemble ce qui lui est confié avec responsabilité, sagesse et transparence.",
            ],
          },
        ],
        keyPoints: [
          "L'argent ne devrait jamais être un sujet tabou dans une relation. Les conversations que vous avez aujourd'hui peuvent éviter de nombreuses incompréhensions demain. Plus vous apprenez à parler de finances avec honnêteté avant le mariage, plus vous construirez un foyer fondé sur la confiance.",
        ],
        resources: [],
        selfCheck: {
          prompt: "Fais le point — coche ce qui est déjà vrai pour toi",
          items: [
            "Je comprends pourquoi il est important de parler d'argent avant le mariage.",
            "Je connais les principaux sujets financiers à aborder avec mon futur conjoint.",
            "Je suis prêt(e) à être transparent(e) concernant ma situation financière.",
            "Je souhaite construire une gestion financière fondée sur la confiance et la responsabilité.",
          ],
        },
        exercise: "Prends un moment pour faire le point sur ta situation financière. Liste tes principales sources de revenus, tes dépenses régulières, tes éventuelles dettes et tes objectifs financiers. Si tu es en couple, choisissez un moment pour échanger sur votre vision de l'argent, sans chercher à convaincre l'autre, mais simplement à mieux vous comprendre.",
      },
    ],
  },
  {
    id: "emotions",
    title: "Mieux gérer ses émotions",
    summary: "Avant de construire un mariage, il est important d'apprendre à mieux se connaître. Une personne qui comprend ses émotions, sait les exprimer avec maturité et prend le temps de guérir de son passé sera davantage capable de construire une relation équilibrée.",
    lessons: [
      {
        slug: "gerer-ses-emotions",
        title: "Apprendre à gérer ses émotions avant de construire une relation durable",
        subtitle: "Les émotions font partie de notre vie.",
        durationMin: 10,
        isFreePreview: false,
        coverImage: "/academy/academy-emotions.png",
        videoUrl: null,
        intro: [
          "Les émotions font partie de notre vie. Elles nous renseignent sur ce que nous vivons, ce qui nous touche et ce qui compte pour nous. Pourtant, lorsqu'elles prennent toute la place, elles peuvent influencer nos décisions, nos paroles et nos réactions. Beaucoup de relations souffrent non pas parce que les personnes ne s'aiment pas, mais parce qu'elles réagissent sous l'effet de la colère, de la peur, de la jalousie ou de blessures qui n'ont jamais été guéries.",
          "Avant de construire un mariage, il est important d'apprendre à mieux se connaître. Une personne qui comprend ses émotions, sait les exprimer avec maturité et prend le temps de guérir de son passé sera davantage capable de construire une relation équilibrée. Cette leçon t'aidera à reconnaître tes réactions émotionnelles et à développer des habitudes qui favorisent des relations plus sereines.",
        ],
        learningGoals: [
          "comprendre l'influence de tes émotions sur tes relations ;",
          "reconnaître les réactions émotionnelles qui fragilisent une relation ;",
          "apprendre à exprimer tes émotions avec maturité ;",
          "identifier les blessures qui méritent d'être guéries avant le mariage.",
        ],
        sections: [
          {
            title: "Les émotions ne sont pas tes ennemies",
            body: [
              "Ressentir de la colère, de la tristesse, de la peur ou de la déception est parfaitement normal. Les émotions ne sont ni bonnes ni mauvaises. Elles révèlent souvent un besoin, une inquiétude ou une blessure. Le problème n'est donc pas de ressentir une émotion, mais de la laisser diriger chacune de nos réactions.",
              "Prendre quelques instants pour identifier ce que tu ressens avant de répondre permet souvent d'éviter des paroles que tu pourrais regretter. Une émotion reconnue est plus facile à gérer qu'une émotion ignorée.",
            ],
          },
          {
            title: "Les réactions qui fragilisent une relation",
            body: [
              "Sous l'effet des émotions, certaines personnes deviennent agressives, d'autres se renferment complètement. D'autres encore cherchent à contrôler leur partenaire ou interprètent chaque situation comme une menace pour la relation. Ces réactions ne résolvent pas les difficultés ; elles les amplifient.",
              "Apprendre à prendre du recul avant de répondre est une compétence précieuse. Quelques minutes de calme peuvent éviter des disputes inutiles et permettre un dialogue plus constructif.",
            ],
          },
          {
            title: "Guérir avant de construire",
            body: [
              "Nos expériences passées influencent souvent notre manière d'aimer. Une trahison, un rejet ou une relation douloureuse peuvent créer des peurs qui continuent à peser sur les relations suivantes. Sans travail personnel, il est facile de demander à son partenaire de réparer des blessures qu'il n'a pas causées.",
              "Prendre le temps de reconnaître ces blessures et de demander de l'aide lorsque c'est nécessaire est une démarche de maturité. Se préparer au mariage, c'est aussi choisir de ne pas laisser son passé diriger son avenir.",
            ],
          },
          {
            title: "Développer une maturité émotionnelle",
            body: [
              "La maturité émotionnelle consiste à reconnaître ce que l'on ressent, à l'exprimer avec respect et à rester responsable de ses réactions. Elle ne signifie pas ne plus ressentir d'émotions, mais apprendre à ne pas en devenir prisonnier.",
              "Avec le temps, cette capacité favorise des échanges plus paisibles, une meilleure compréhension mutuelle et une relation où chacun se sent en sécurité pour exprimer ce qu'il vit.",
            ],
          },
        ],
        keyPoints: [
          "Les émotions sont des messagers, pas des décideurs. Plus tu apprends à les comprendre et à les gérer avec sagesse, plus tu seras capable de construire une relation stable, apaisée et durable.",
        ],
        resources: [],
        selfCheck: {
          prompt: "Fais le point — coche ce qui est déjà vrai pour toi",
          items: [
            "Je comprends que les émotions influencent mes réactions.",
            "Je suis capable d'identifier ce que je ressens avant de répondre.",
            "Je reconnais les blessures qui méritent encore d'être guéries.",
            "Je souhaite développer une plus grande maturité émotionnelle avant de m'engager dans le mariage.",
          ],
        },
        exercise: "Pendant les sept prochains jours, prends quelques minutes chaque soir pour noter une émotion forte que tu as ressentie dans la journée. Écris ce qui l'a déclenchée, comment tu as réagi et ce que tu aurais pu faire différemment. Cet exercice t'aidera à mieux comprendre ton fonctionnement émotionnel.",
      },
    ],
  },
  {
    id: "projet",
    title: "Construire un projet de vie à deux",
    summary: "Construire un projet de vie à deux ne consiste pas à prévoir chaque détail de l'avenir. Il s'agit plutôt d'apprendre à partager ses aspirations, à écouter celles de l'autre et à rechercher une direction commune.",
    lessons: [
      {
        slug: "projet-de-vie-a-deux",
        title: "Le mariage ne se prépare pas seulement avec de l'amour, mais aussi avec une vision commune",
        subtitle: "L'amour est une belle raison de se marier, mais il ne suffit pas à répondre aux grandes questions de la vie.",
        durationMin: 10,
        isFreePreview: false,
        coverImage: "/academy/academy-projet.png",
        videoUrl: null,
        intro: [
          "L'amour est une belle raison de se marier, mais il ne suffit pas à répondre aux grandes questions de la vie. Avec le temps, un couple devra prendre des décisions importantes : où vivre, comment gérer les finances, avoir ou non des enfants, concilier vie professionnelle et vie familiale, servir Dieu ensemble, soutenir leurs proches ou encore poursuivre certains projets personnels. Lorsque ces sujets ne sont jamais abordés avant le mariage, ils deviennent souvent des sources d'incompréhension.",
          "Construire un projet de vie à deux ne consiste pas à prévoir chaque détail de l'avenir. Il s'agit plutôt d'apprendre à partager ses aspirations, à écouter celles de l'autre et à rechercher une direction commune. Plus cette vision est claire avant l'engagement, plus le couple avancera avec confiance face aux décisions importantes.",
        ],
        learningGoals: [
          "comprendre pourquoi il est important de parler de votre vision d'avenir avant le mariage ;",
          "identifier les grands sujets qui méritent d'être abordés pendant les fréquentations ;",
          "apprendre à construire des projets en tenant compte des attentes de chacun ;",
          "développer une vision commune fondée sur le dialogue, le respect et la confiance.",
        ],
        sections: [
          {
            title: "Pourquoi parler de l'avenir avant de s'engager",
            body: [
              "Certaines différences ne deviennent visibles qu'avec le temps. L'un rêve de vivre à l'étranger tandis que l'autre souhaite rester près de sa famille. L'un désire plusieurs enfants alors que l'autre n'est pas encore prêt à en avoir. Ces différences ne signifient pas que la relation est vouée à l'échec, mais elles doivent être connues avant de prendre un engagement.",
              "Aborder ces sujets suffisamment tôt permet de mieux comprendre les attentes de chacun et d'éviter les mauvaises surprises. Une décision importante est toujours plus facile lorsqu'elle est prise ensemble que lorsqu'elle est imposée après le mariage.",
            ],
          },
          {
            title: "Les conversations à ne pas repousser",
            body: [
              "Parlez de votre vision du mariage, de votre foi, de votre travail, de vos projets professionnels, de votre désir d'avoir des enfants, de votre manière de gérer l'argent, de votre implication auprès de vos familles et de vos priorités de vie. Ces échanges ne servent pas à vérifier si vous êtes identiques, mais à découvrir si vous êtes capables de construire un projet commun malgré vos différences.",
              "Il n'est pas nécessaire d'avoir toutes les réponses immédiatement. L'essentiel est d'apprendre à dialoguer avec honnêteté et à accueillir le point de vue de l'autre avec respect.",
            ],
          },
          {
            title: "Construire une vision commune",
            body: [
              "Une relation solide avance plus facilement lorsque chacun sait où le couple souhaite aller. Cela demande parfois des compromis, des ajustements et beaucoup d'écoute. Construire une vision commune ne signifie pas abandonner tous ses rêves personnels, mais chercher un équilibre où chacun peut s'épanouir tout en contribuant au projet du couple.",
              "Les décisions les plus importantes se prennent rarement dans l'urgence. Prenez le temps de réfléchir ensemble, de prier si vous partagez la même foi et de rechercher ce qui favorisera le bien du foyer sur le long terme.",
            ],
          },
          {
            title: "Grandir ensemble au fil des années",
            body: [
              "Les projets évolueront avec le temps. Certaines priorités changeront, de nouvelles responsabilités apparaîtront et des imprévus feront partie du parcours. Un couple qui a appris à dialoguer et à ajuster sa vision restera plus uni face à ces changements.",
              "L'objectif n'est pas de tout contrôler, mais de développer une manière de prendre des décisions ensemble, dans le respect, la confiance et la recherche du bien commun.",
            ],
          },
        ],
        keyPoints: [
          "Le mariage est un chemin que l'on construit à deux. Plus vous prenez le temps de parler de votre avenir avant de vous engager, plus vous serez capables d'avancer ensemble avec confiance, même lorsque la vie vous réservera des surprises.",
        ],
        resources: [],
        selfCheck: {
          prompt: "Fais le point — coche ce qui est déjà vrai pour toi",
          items: [
            "Je comprends l'importance de construire une vision commune avant le mariage.",
            "J'ai identifié les principaux sujets à aborder avec mon futur conjoint.",
            "Je suis prêt(e) à écouter les projets et les attentes de l'autre avec ouverture.",
            "Je souhaite construire un avenir fondé sur le dialogue, la confiance et des objectifs partagés.",
          ],
        },
        exercise: "Prends une feuille et écris les cinq projets qui comptent le plus pour toi dans les cinq prochaines années. Si tu es en couple, partagez ensuite vos listes et échangez sur vos priorités. Cherchez les points qui vous rapprochent, ceux qui demandent encore des discussions et les décisions que vous pourriez commencer à préparer dès aujourd'hui.",
      },
    ],
  },
]

export function getAcademyModule(id: string): AcademyModule | undefined {
  return ACADEMY_MODULES.find((m) => m.id === id)
}

export function getAcademyLesson(moduleId: string, lessonSlug: string) {
  const academyModule = getAcademyModule(moduleId)
  if (!academyModule) return undefined
  const index = academyModule.lessons.findIndex((l) => l.slug === lessonSlug)
  if (index < 0) return undefined
  const lesson = academyModule.lessons[index]
  return {
    module: academyModule,
    lesson,
    index,
    prev: index > 0 ? academyModule.lessons[index - 1] : null,
    next: index < academyModule.lessons.length - 1 ? academyModule.lessons[index + 1] : null,
  }
}

export function academyLessonPath(moduleId: string, lessonSlug: string) {
  return `/academie-mariage/${moduleId}/${lessonSlug}`
}

export function academyModulePath(moduleId: string) {
  return `/academie-mariage/${moduleId}`
}
