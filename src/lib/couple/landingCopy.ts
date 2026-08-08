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
  ctaSecondary: "J’ai un code",
} as const

/** Quatre situations — cartes interactives pour se projeter. */
export const LANDING_SITUATIONS = [
  {
    id: "interest",
    label: "Intérêt mutuel",
    title: "Vous vous intéressez l’un à l’autre",
    body: "Vous souhaitez savoir où cette relation peut vous mener.",
    accent: "from-[#5C1F28] to-[#8B2E3A]",
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

/** Affichage marketing des prix (doc) — le montant facturé reste amountXof côté serveur. */
export const LANDING_PRICE_DISPLAY = {
  couple_essential: {
    compareAtXof: 40_000,
    perPersonXof: 15_000,
    coupleTotalXof: 30_000,
  },
  couple_premium_plus: {
    compareAtXof: 60_000,
    perPersonXof: 25_000,
    coupleTotalXof: 50_000,
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
      accent: "from-[#5C1F28] to-[#8B2E3A]",
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
  title: "Vous ne repartez pas avec « voici vos résultats, bonne chance »",
  subtitle: "Votre rapport vous aide à passer de la compréhension à l’action.",
  items: [
    {
      title: "Conversations guidées",
      body: "Des questions précises et un cadre pour aborder un sujet difficile — pas « tu ne comprends jamais… », plutôt « voilà ce que j’ai compris. Comment est-ce que toi, tu le vois ? »",
    },
    {
      title: "Exercices à deux",
      body: "Téléchargeables, imprimables : vous asseoir ensemble, écrire, répondre, échanger. Le bilan ne s’arrête pas à l’écran.",
    },
    {
      title: "Priorités claires",
      body: "Pas vingt choses à changer. Les sujets qui méritent réellement votre attention — et quoi faire maintenant.",
    },
  ],
} as const

export const LANDING_AUDIENCES = [
  {
    title: "Vous préparez votre mariage ?",
    body: "Un temps volontaire pour parler de sujets que la préparation du mariage ne permet pas toujours d’approfondir. Vous ne préparez pas seulement une cérémonie — vous préparez une vie à deux.",
    image: "/home/hero-african-wedding.png",
  },
  {
    title: "Vous êtes déjà mariés ?",
    body: "Comprendre certains fonctionnements, mettre des mots sur des sujets qui reviennent, retrouver vos forces, décider ensemble de ce que vous voulez améliorer. Il n’est jamais trop tôt — ni trop tard.",
    image: "/home/compare-couple.png",
  },
  {
    title: "Vous êtes chrétiens ?",
    body: "KELIAA est pensée d’abord pour vous. Et si vous n’êtes pas chrétien ? Vous êtes également le bienvenu. KELIAA COUPLE™ est ouvert à tous les couples qui souhaitent mieux comprendre leur dynamique.",
    image: "/home/story-community.png",
  },
] as const

export const LANDING_STEPS = [
  {
    n: "01",
    title: "L’un de vous achète",
    body: "Un seul achat pour deux personnes.",
  },
  {
    n: "02",
    title: "Vous invitez l’autre",
    body: "Un lien sécurisé ou un code. Deux places. Pas une de plus.",
  },
  {
    n: "03",
    title: "Vous répondez séparément",
    body: "Chacun son espace. Chacun ses réponses. Chacun sa sincérité.",
  },
  {
    n: "04",
    title: "KELIAA analyse",
    body: "Convergences, différences, priorités — vos deux résultats croisés.",
  },
  {
    n: "05",
    title: "Vous découvrez votre rapport",
    body: "Enfin quelque chose de concret à regarder ensemble.",
  },
] as const

export const LANDING_OFFERS = {
  eyebrow: "Alors, quelle expérience choisir ?",
  essentialFor:
    "Pour les couples qui veulent comprendre leur dynamique et savoir par où commencer.",
  essentialClose:
    "Vous voulez simplement comprendre ce qui se passe entre vous et savoir quoi travailler ? Commencez ici.",
  essentialFeatures: [
    "Analyse individuelle",
    "Analyse de couple",
    "Forces & priorités",
    "Recommandations",
    "Exercices + plan d’action",
    "Rapport 35–50 pages",
  ],
  premiumFor: "Tout l’Essentiel. Puis davantage de profondeur.",
  premiumFeatures: [
    "Dynamiques approfondies",
    "Scénarios relationnels",
    "Conversations guidées approfondies",
    "Protocoles de travail",
    "Charte relationnelle",
    "Plan d’action étendu · rapport 50–70 pages",
  ],
  summaryEssential: "Je veux comprendre notre couple.",
  summaryPremium:
    "Je veux comprendre notre couple et aller beaucoup plus loin dans le travail.",
} as const

export const LANDING_IMAGINE = {
  eyebrow: "Imaginez la conversation après le bilan",
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
  body: "Votre couple a besoin de clarté, de conversations et de compréhension…",
  bodyEnd: "Votre couple n’a pas besoin de verdicts.",
  lastQ: "Une dernière question",
  lastPrompt:
    "Si vous pouviez découvrir une seule chose importante sur votre couple aujourd’hui, qu’aimeriez-vous savoir ?",
  lastOptions: [
    "Ce qui vous rapproche",
    "Ce qui vous différencie",
    "Ce qui pourrait devenir une difficulté",
    "Ce que vous devez travailler",
  ],
  lastQuote: "Est-ce que nous sommes réellement aussi alignés que nous le pensons ?",
  start: "Votre bilan commence ici.",
  tagline:
    "Comprendre votre dynamique. Clarifier vos différences. Construire avec intention.",
} as const
