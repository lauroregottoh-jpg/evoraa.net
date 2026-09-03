/**
 * Copy landing KELYA COUPLE™ — source :
 * docs/KELIAA COUPLE TM/KELIAA COUPLE™- page d'accueil.md
 */

export const LANDING_HERO = {
  hook: "Découvrez votre dynamique de couple : ce qui vous unit, ce qui vous différencie et comment vous pouvez construire ensemble.",
  essentialQ:
    "Dans chacune de ces situations, il y a une question essentielle : est-ce que nous comprenons réellement comment nous fonctionnons ensemble ?",
  tensions: [
    "Vous ne comprenez pas toujours pourquoi vous réagissez différemment.",
    "Vous avez parfois l’impression de parler de la même chose sans jamais vous comprendre complètement.",
    "Certains sujets reviennent régulièrement dans vos discussions.",
    "Vous découvrez parfois des attentes que vous ne soupçonniez pas chez l’autre.",
    "Vous vous demandez comment vos différences vont se vivre dans la durée.",
  ],
  invite:
    "Et si, au lieu d’attendre que ces différences deviennent des difficultés, vous preniez maintenant le temps de les comprendre ?",
  promise:
    "KELIAA COUPLE™ vous permet d’explorer votre dynamique à deux à partir de vos réponses individuelles, puis de mettre vos deux regards en relation.",
  discover:
    "Vous découvrez vos points de convergence, vos différences, vos forces, vos zones de vigilance et les sujets qui méritent réellement votre attention.",
  deeper:
    "Mais surtout, vous comprenez mieux pourquoi vous pouvez fonctionner différemment, comment ces différences peuvent se manifester dans votre relation et sur quoi vous pouvez concrètement travailler ensemble.",
  map:
    "Votre bilan devient ainsi une véritable carte de compréhension de votre couple : une façon de mettre des mots sur ce que vous vivez déjà, de mieux anticiper ce qui pourrait devenir sensible et de savoir par où commencer pour construire une relation plus consciente.",
  ctaPrimary: "Découvrir mon bilan de couple",
  ctaSecondary: "Accéder à mon espace couple",
} as const

/** Quatre situations — cartes interactives pour se projeter. */
export const LANDING_SITUATIONS = [
  {
    id: "interest",
    label: "Intérêt mutuel",
    title: "Vous vous intéressez l’un à l’autre",
    body: "Vous souhaitez savoir où cette relation peut vous mener.",
    accent: "from-[#2D1020] to-[#8B2E3A]",
  },
  {
    id: "path",
    label: "Chemin ensemble",
    title: "Vous avez décidé de cheminer ensemble",
    body: "Vous voulez prendre le temps de mieux vous connaître avant d’aller plus loin.",
    accent: "from-[#2A1810] to-[#5C3A1A]",
  },
  {
    id: "engaged",
    label: "Fiançailles",
    title: "Vous êtes fiancés",
    body: "Vous préparez votre mariage, avec l’envie de construire sur des bases solides.",
    accent: "from-[#1C3A2A] to-[#2A5C3A]",
  },
  {
    id: "married",
    label: "Mariage",
    title: "Vous êtes déjà mariés",
    body: "Depuis quelques mois ou plusieurs années — vous aimez votre conjoint, mais certains sujets reviennent, certaines incompréhensions s’installent ou certaines tensions deviennent difficiles à gérer.",
    accent: "from-[#3A2A10] to-[#6B4A1A]",
  },
] as const

export type LandingSituationId = (typeof LANDING_SITUATIONS)[number]["id"]

/** Affichage marketing — tarif de lancement (facturé = coupleTotalXof). */
export const LANDING_PRICE_DISPLAY = {
  couple_essential: {
    compareAtXof: 20_000,
    perPersonXof: 5_000,
    coupleTotalXof: 10_000,
  },
  couple_premium_plus: {
    compareAtXof: 50_000,
    perPersonXof: 10_000,
    coupleTotalXof: 20_000,
  },
} as const

export const LANDING_RECOGNIZE = {
  eyebrow: "Vous allez peut-être vous reconnaître",
  title: "Vous vous aimez. Mais vous ne fonctionnez pas toujours de la même manière.",
  body: [
    "Vous pensez bien vous connaître. Puis une conversation sur l’argent tourne mal. Ou une décision importante devient compliquée. Ou vous découvrez que vous n’avez pas du tout la même vision de la famille.",
    "L’un de vous veut parler immédiatement. Et l’autre préfère se taire.",
  ],
  wrongQ: "Pourquoi ne pensons-nous / faisons-nous pas pareil ?",
  rightQ: "Savons-nous construire avec nos différences ?",
} as const

export const LANDING_DISCOVER_OUTCOMES = {
  eyebrow: "C’est ce que KELIAA COUPLE™ va vous aider à découvrir",
  intro:
    "Vous répondez chacun de votre côté. Puis KELIAA met vos deux résultats en relation. Et soudain, certaines choses deviennent plus claires.",
  items: [
    { title: "Ce qui vous rapproche", hint: "Vos bases communes" },
    { title: "Ce qui vous différencie", hint: "Vos écarts utiles" },
    { title: "Ce que vous aviez sous-estimé", hint: "Les angles morts" },
    { title: "Ce que vous devez vraiment discuter", hint: "Les vraies conversations" },
    { title: "Ce sur quoi vous appuyer", hint: "Vos ressources" },
  ],
} as const

export const LANDING_REPORT_PILLARS = {
  eyebrow: "Vous ne recevez pas juste un score",
  title: "Imaginez ouvrir votre rapport",
  close:
    "Vous passez de « nous avons un problème » à « nous savons ce que nous devons comprendre et travailler ».",
  items: [
    {
      title: "Vos forces",
      body: "Ce qui fonctionne déjà entre vous — une vraie ressource pour votre relation.",
      accent: "from-[#2D1020] to-[#8B2E3A]",
    },
    {
      title: "Vos convergences",
      body: "Les domaines où vos attentes et vos visions se rejoignent.",
      accent: "from-[#1C3A2A] to-[#2A5C3A]",
    },
    {
      title: "Vos différences",
      body: "Les sujets sur lesquels vous ne voyez pas forcément les choses de la même manière.",
      accent: "from-[#2A1810] to-[#5C3A1A]",
    },
    {
      title: "Zones de vigilance",
      body: "Les différences à clarifier avant qu’elles ne deviennent des tensions répétitives.",
      accent: "from-[#3A2A10] to-[#6B4A1A]",
    },
    {
      title: "Vos priorités",
      body: "Les quelques sujets sur lesquels il serait réellement utile de commencer.",
      accent: "from-[#1C2840] to-[#2A3A5C]",
    },
  ],
} as const

export const LANDING_TWO_LOOKS = {
  eyebrow: "Deux personnes. Deux regards. Une analyse.",
  privateTitle: "Chacun répond en privé",
  privateBody:
    "Vous n’avez pas besoin de regarder votre partenaire répondre, ni de modifier votre réponse pour éviter une discussion. Vous répondez honnêtement. Vos réponses restent confidentielles.",
  crossTitle: "Puis KELIAA croise vos deux résultats",
  crossWrong: "Qui êtes-vous ?",
  crossRight: "Que se passe-t-il lorsque vos deux façons de fonctionner se rencontrent ?",
} as const

export const LANDING_MAYBE = {
  title: "Vous pourriez découvrir…",
  items: [
    "Que vous êtes très alignés sur votre vision du mariage — mais pas sur l’argent.",
    "Que vous partagez les mêmes valeurs — mais gérez les conflits de manière complètement différente.",
    "Que vous avez une excellente base relationnelle — mais un sujet important jamais vraiment abordé.",
    "Ou peut-être que vous êtes beaucoup plus alignés que vous ne le pensiez.",
  ],
  close: "Le bilan vous permet de le voir.",
} as const

export const LANDING_TOOLS = {
  eyebrow: "Et surtout…",
  title: "De la compréhension à l’action",
  subtitle: "Votre rapport ne s’arrête pas à l’écran.",
  items: [
    {
      title: "Conversations guidées",
      body: "Des questions précises et un cadre pour aborder un sujet difficile — pas « tu ne comprends jamais… », plutôt « voilà ce que j’ai compris. Comment est-ce que toi, tu le vois ? »",
    },
    {
      title: "Exercices à deux",
      body: "Téléchargeables, imprimables : vous asseoir ensemble, écrire, répondre, échanger. Le travail continue hors de l’écran.",
    },
    {
      title: "Priorités claires",
      body: "Pas vingt choses à changer d’un coup. Les sujets qui méritent réellement votre attention — et quoi faire maintenant.",
    },
    {
      title: "Recommandations personnalisées",
      body: "Des pistes reliées à votre dynamique réelle, pour savoir concrètement par où avancer.",
    },
    {
      title: "Plan d’action",
      body: "Transformer les prises de conscience en gestes simples, progressifs, à vivre à deux.",
    },
    {
      title: "Téléchargement du dossier",
      body: "Gardez votre rapport et vos outils pour y revenir, les relire et les travailler ensemble.",
    },
  ],
} as const

export const LANDING_AUDIENCES = [
  {
    title: "Vous êtes cheminants ou fiancés",
    body: "Vous construisez déjà quelque chose à deux — avec ou sans date de mariage. Le bilan vous aide à clarifier comment vous fonctionnez ensemble avant que les sujets sensibles ne s’installent dans le silence.",
  },
  {
    title: "Vous préparez votre mariage",
    body: "Un temps volontaire pour parler de sujets que la préparation du mariage ne permet pas toujours d’approfondir. Vous préparez une vie à deux — pas seulement une cérémonie.",
  },
  {
    title: "Vous êtes déjà mariés",
    body: "Nouvellement mariés ou depuis plusieurs années : comprendre certains fonctionnements, mettre des mots sur ce qui revient, retrouver vos forces, décider ensemble de ce que vous voulez améliorer.",
  },
  {
    title: "Chrétiens — et ouverts à tous",
    body: "KELIAA est née d’une vision chrétienne et pensée d’abord pour les couples et fiancés chrétiens. Mais le moteur du bilan Couple n’est pas réservé à la chrétienté : le cœur de l’expérience, c’est votre dynamique relationnelle — communication, différences, attentes, décisions, projets. Que vous soyez chrétiens ou non, vous pouvez faire ce bilan.",
  },
] as const

export const LANDING_STEPS = [
  {
    n: "01",
    title: "L’un de vous souscrit",
    body: "Un seul achat pour deux personnes — peu importe qui commence.",
  },
  {
    n: "02",
    title: "Vous invitez l’autre",
    body: "Un lien sécurisé ou un code. Deux places, pas une de plus.",
  },
  {
    n: "03",
    title: "Vous répondez séparément",
    body: "Chacun son espace. Chacun ses réponses. Chacun sa sincérité.",
  },
  {
    n: "04",
    title: "KELIAA analyse",
    body: "Vos deux résultats sont croisés : convergences, différences, priorités.",
  },
  {
    n: "05",
    title: "Vous découvrez et téléchargez",
    body: "Votre rapport est prêt à regarder ensemble — et à conserver.",
  },
] as const

export const LANDING_REPORT_BLOCKS = [
  {
    title: "Bienvenue & mode d’emploi",
    body: "Comment lire votre bilan sans vous défendre — d’abord les forces, puis les différences.",
  },
  {
    title: "Votre couple en un regard",
    body: "Score global (indicateur, pas verdict), convergences et points d’attention en une vue claire.",
  },
  {
    title: "Deux portraits individuels",
    body: "Ce que le test révèle de chacun dans le couple — structures parallèles, pas un simple échange de prénoms.",
  },
  {
    title: "Dynamique croisée",
    body: "Ce qui se passe quand vos deux profils se rencontrent — une phrase de dynamique centrale à retenir.",
  },
  {
    title: "Communication & désaccords",
    body: "Règles concrètes, cycles possibles, exercices pour entendre ce qui se trouve derrière les mots.",
  },
  {
    title: "Forces & grandes différences",
    body: "Ce qui vous porte déjà, puis jusqu’à 3 grandes différences développées avec exercices Premium.",
  },
  {
    title: "Plan d’action, suivi, carte relationnelle",
    body: "Actions datées, check-ins, synthèse finale — puis conclusion Voir · Choisir · Agir.",
  },
  {
    title: "Premium Plus — Points d’approfondissement",
    body: "Dynamique profonde, décisions, com sous tension, affection, argent, familles… sélectionnés selon vos résultats.",
  },
] as const

export const LANDING_OFFERS = {
  eyebrow: "Alors, quelle expérience choisir ?",
  essentialFor:
    "Pour les couples qui veulent le bilan de référence KELIAA COUPLE™ — comprendre leur dynamique et savoir par où commencer.",
  essentialClose:
    "Vous voulez un vrai rapport Premium (format A4), pas juste un score ? Commencez ici.",
  essentialFeatures: [
    "Analyse individuelle de chaque partenaire",
    "Analyse croisée et dynamique centrale",
    "Forces, convergences, grandes différences",
    "Exercices Premium + plan d’action",
    "Carte relationnelle",
    "Rapport A4 personnalisé (corps ≥ 14 pt)",
  ],
  premiumFor: "Tout le Premium. Puis les Points d’approfondissement Premium Plus.",
  premiumFeatures: [
    "100 % du Bilan Premium",
    "Points PP sélectionnés selon vos résultats",
    "Protocoles et conversations guidées",
    "Charte relationnelle et scénarios",
    "Plan d’action étendu",
    "Même format A4, plus de profondeur",
  ],
} as const

export const LANDING_IMAGINE = {
  eyebrow: "Imaginez",
  title: "Vous êtes assis ensemble. Votre rapport est ouvert devant vous.",
  body: "Vous ne cherchez pas qui a tort ni qui a le meilleur score. Vous regardez, vous découvrez et vous échangez tranquillement.",
  quotes: [
    "Je ne savais pas que tu voyais les choses comme ça.",
    "Maintenant je comprends mieux.",
    "Bon. Qu’est-ce qu’on fait maintenant ?",
  ],
  close: "C’est précisément là que le bilan devient utile.",
} as const

export const LANDING_CLOSING = {
  title: "Votre couple a besoin de bien plus que d’espérer",
  body: "Votre couple a besoin de clarté, de conversations et de compréhension — pas de verdicts, ni d’incertitude.",
  finishTitle: "Pour finir",
  lastPrompt:
    "Vos différences versus vos compatibilités — ce qui vous rapproche, ce qui vous différencie, ou simplement :",
  lastQuote: "Est-ce que nous sommes réellement aussi alignés que nous le pensons ?",
  start: "Faites le bilan pour le découvrir.",
  tagline:
    "Comprendre votre dynamique. Clarifier vos différences. Construire avec intention.",
} as const

export const LANDING_FAQ = [
  {
    q: "Est-ce qu’un seul partenaire doit acheter ?",
    a: "Oui. Un seul achat couvre le bilan pour deux participants. La personne qui achète peut ensuite inviter son partenaire.",
  },
  {
    q: "Qui doit commencer ?",
    a: "Peu importe. Monsieur ou Madame peut souscrire et créer le bilan.",
  },
  {
    q: "Mon partenaire doit-il avoir un compte KELIAA ?",
    a: "Il pourra rejoindre via l’invitation prévue. Le parcours est conçu pour intégrer facilement le second participant.",
  },
  {
    q: "Mon partenaire verra-t-il mes réponses ?",
    a: "Non. Les réponses brutes individuelles sont confidentielles. Le rapport présente une analyse de votre dynamique commune.",
  },
  {
    q: "Et si nous obtenons un faible pourcentage ?",
    a: "Le pourcentage n’est pas un verdict. Un résultat faible indique surtout des différences importantes à comprendre et à travailler.",
  },
  {
    q: "Et si nous avons un score élevé ?",
    a: "C’est une bonne indication de convergence, mais cela ne signifie pas que votre couple n’a rien à travailler. Le rapport identifie aussi les points à entretenir.",
  },
  {
    q: "Peut-on télécharger le rapport ?",
    a: "Oui. Les documents prévus dans votre offre peuvent être téléchargés et conservés pour les relire ou travailler dessus ensemble.",
  },
  {
    q: "Le Premium Plus remplace-t-il le Bilan Premium ?",
    a: "Non. Premium Plus comprend 100 % du Bilan Premium et ajoute des Points d’approfondissement sélectionnés selon vos résultats.",
  },
  {
    q: "Est-ce une thérapie de couple ?",
    a: "Non. KELIAA COUPLE™ est un outil d’évaluation, de réflexion et de travail relationnel. Si un accompagnement professionnel est nécessaire, des orientations adaptées peuvent être proposées.",
  },
] as const
