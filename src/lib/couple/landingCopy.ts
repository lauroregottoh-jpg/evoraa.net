/**
 * Copy landing KELYA COUPLE™ — source :
 * docs/KELIAA COUPLE TM/KELIAA COUPLE™- page d'accueil.md
 */

export const LANDING_HERO = {
  hook: "Et si vous découvriez enfin ce qui se joue vraiment entre vous ?",
  lead: "Vous vous aimez. Vous avez des projets. Peut-être même que vous préparez votre mariage. Mais il y a des sujets dont vous parlez peu.",
  topics: [
    "L’argent",
    "Les familles",
    "Les décisions",
    "Les conflits",
    "Les attentes",
    "Les rôles",
    "L’intimité",
    "L’avenir",
  ],
  invite: "Et si vous preniez enfin le temps de regarder tout cela ensemble ?",
  promise:
    "KELIAA COUPLE™ est un bilan approfondi pour deux personnes qui veulent mieux comprendre leur dynamique et construire leur relation avec davantage de clarté.",
  promiseSub:
    "Pas un verdict ni un simple score — une véritable lecture de votre couple, avec des outils pour avancer.",
  ctaPrimary: "Découvrir mon bilan",
  ctaSecondary: "J’ai un code",
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
  title: "Votre couple n’a pas besoin d’un verdict",
  body: "Il a besoin de clarté, de conversations, de compréhension. Et parfois, simplement que quelqu’un lui donne les bonnes questions à poser.",
  lastQ: "Une dernière question…",
  lastPrompt:
    "Si vous pouviez découvrir une seule chose importante sur votre couple aujourd’hui, qu’aimeriez-vous savoir ?",
  lastOptions: [
    "Ce qui vous rapproche ?",
    "Ce qui vous différencie ?",
    "Ce qui pourrait devenir une difficulté ?",
    "Ce que vous devez travailler ?",
  ],
  lastQuote: "Est-ce que nous sommes réellement aussi alignés que nous le pensons ?",
  start: "Votre bilan commence ici.",
  tagline:
    "Comprendre votre dynamique. Clarifier vos différences. Construire avec intention.",
} as const
