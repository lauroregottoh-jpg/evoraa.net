/**
 * AUTO-GENERATED from docs/DOSSIER RAPPORT.md
 * Do not edit by hand — run: node scripts/parse-dossier-rapport.mjs
 * Generated: 2026-08-05T20:27:19.530Z
 */

import type { ReportPillarId } from "@/lib/rapport/pillars"

export type OfficialRecommendation = {
  id: string
  pillar: ReportPillarId
  domain: string
  title: string
  whenToUse: string
  advice: string
  why: string
  premium: string
  priority?: string
  source: string
}

export const OFFICIAL_RECOMMENDATIONS: OfficialRecommendation[] = [
  {
    "id": "REL001",
    "pillar": "relationnel",
    "domain": "Communication",
    "title": "Exprimer clairement ses besoins",
    "whenToUse": "Utiliser cette recommandation lorsque le score du profil relationnel est faible et que les réponses montrent une difficulté à exprimer ses attentes, ses besoins ou ses émotions.",
    "advice": "Apprenez à exprimer vos besoins de manière simple, précise et respectueuse. Une attente clairement formulée est beaucoup plus facile à comprendre qu'une attente implicite.",
    "why": "Les non-dits créent souvent des frustrations, des malentendus et un sentiment d'incompréhension.",
    "premium": "Ajouter un exercice pratique permettant d'apprendre à transformer un reproche en demande constructive.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL002",
    "pillar": "relationnel",
    "domain": "Communication",
    "title": "Pratiquer l'écoute active",
    "whenToUse": "Lorsque les réponses indiquent une difficulté à écouter l'autre jusqu'au bout ou une tendance à répondre rapidement.",
    "advice": "Pendant vos prochaines conversations importantes, concentrez-vous d'abord sur la compréhension de votre interlocuteur. Reformulez ensuite ce que vous avez compris avant de partager votre point de vue.",
    "why": "L'écoute active favorise la confiance, réduit les malentendus et améliore la qualité des échanges.",
    "premium": "Proposer une méthode d'écoute active en cinq étapes avec un exercice pratique.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL003",
    "pillar": "relationnel",
    "domain": "Communication",
    "title": "Choisir le bon moment pour discuter",
    "whenToUse": "Lorsque les conflits apparaissent principalement pendant les périodes de fatigue, de stress ou de forte émotion.",
    "advice": "Abordez les sujets sensibles lorsque chacun est disponible, calme et disposé à écouter. Le bon moment influence souvent la qualité de la discussion.",
    "why": "Même une bonne idée peut être mal reçue lorsqu'elle est exprimée au mauvais moment.",
    "premium": "Expliquer comment identifier les moments favorables aux conversations importantes.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL004",
    "pillar": "relationnel",
    "domain": "Gestion des émotions",
    "title": "Reconnaître ses émotions avant de réagir",
    "whenToUse": "Lorsque les réponses montrent une tendance à réagir impulsivement.",
    "advice": "Avant de répondre à une situation difficile, prenez quelques instants pour identifier l'émotion que vous ressentez. Comprendre ce que vous vivez permet souvent de mieux gérer votre réaction.",
    "why": "Les émotions non identifiées conduisent fréquemment à des réactions disproportionnées.",
    "premium": "Ajouter un exercice d'identification émotionnelle accompagné d'un journal de suivi.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL005",
    "pillar": "relationnel",
    "domain": "Gestion des conflits",
    "title": "Chercher une solution plutôt qu'un responsable",
    "whenToUse": "Lorsque les réponses révèlent des conflits répétitifs ou des difficultés à résoudre les désaccords.",
    "advice": "Lorsqu'un désaccord survient, posez-vous la question : \"Quelle solution pouvons-nous construire ensemble ?\" plutôt que \"Qui est responsable ?\"",
    "why": "Les relations progressent davantage lorsque les partenaires coopèrent pour résoudre les difficultés plutôt que de chercher un coupable.",
    "premium": "Présenter une méthode simple de résolution constructive des conflits.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL006",
    "pillar": "relationnel",
    "domain": "Confiance",
    "title": "Construire la confiance par la cohérence",
    "whenToUse": "Lorsque le profil montre des difficultés à créer ou maintenir des relations de confiance.",
    "advice": "La confiance se construit progressivement grâce à des comportements cohérents. Respecter vos engagements, même les plus simples, renforce la crédibilité que les autres vous accordent.",
    "why": "Les paroles inspirent la confiance, mais ce sont les actions répétées qui la consolident.",
    "premium": "Ajouter un plan de développement de la confiance sur plusieurs semaines.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL007",
    "pillar": "relationnel",
    "domain": "Expression des émotions",
    "title": "Oser parler de ses ressentis",
    "whenToUse": "Lorsque les réponses montrent une tendance à garder ses émotions pour soi.",
    "advice": "Exprimer ce que vous ressentez avec calme permet aux autres de mieux comprendre votre réalité intérieure et limite l'accumulation de frustrations.",
    "why": "Les émotions exprimées avec respect favorisent des relations plus authentiques.",
    "premium": "Proposer une méthode de communication émotionnelle basée sur des exemples concrets.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL008",
    "pillar": "relationnel",
    "domain": "Relations positives",
    "title": "Valoriser davantage les qualités des autres",
    "whenToUse": "Lorsque le profil met en évidence une communication centrée sur les difficultés.",
    "advice": "Prenez l'habitude de reconnaître régulièrement les qualités, les efforts ou les progrès des personnes qui vous entourent. Les encouragements renforcent les relations.",
    "why": "Les relations se développent plus facilement lorsque les personnes se sentent appréciées et reconnues.",
    "premium": "Créer un exercice de gratitude relationnelle sur vingt-et-un jours.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL009",
    "pillar": "relationnel",
    "domain": "Empathie",
    "title": "Chercher à comprendre avant de vouloir être compris",
    "whenToUse": "Lorsque les réponses montrent une tendance à défendre rapidement son point de vue ou une difficulté à prendre en compte les émotions des autres.",
    "advice": "Avant d'expliquer votre position, prenez quelques instants pour comprendre ce que l'autre ressent réellement. Posez des questions, reformulez ses propos et montrez que vous avez entendu son point de vue.",
    "why": "Une personne qui se sent comprise est généralement plus disposée à écouter en retour.",
    "premium": "Ajouter une méthode d'écoute empathique avec plusieurs mises en situation.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL010",
    "pillar": "relationnel",
    "domain": "Communication",
    "title": "Apprendre à poser les bonnes questions",
    "whenToUse": "Lorsque les réponses montrent des incompréhensions fréquentes ou des suppositions.",
    "advice": "Évitez d'interpréter les intentions des autres. Posez plutôt des questions ouvertes afin de clarifier ce qu'ils pensent ou ressentent réellement.",
    "why": "Les suppositions sont une source fréquente de conflits évitables.",
    "premium": "Ajouter une liste de questions favorisant une communication constructive.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL011",
    "pillar": "relationnel",
    "domain": "Gestion des conflits",
    "title": "Faire une pause avant d'escalader un conflit",
    "whenToUse": "Lorsque le profil révèle une tendance aux réactions impulsives ou aux disputes qui s'intensifient rapidement.",
    "advice": "Si la discussion devient trop tendue, proposez une pause et reprenez l'échange lorsque chacun est plus calme.",
    "why": "Les émotions fortes réduisent souvent la capacité d'écoute et augmentent les réactions défensives.",
    "premium": "Présenter une méthode de retour au dialogue après une pause.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL012",
    "pillar": "relationnel",
    "domain": "Confiance",
    "title": "Développer la fiabilité dans les petites choses",
    "whenToUse": "Lorsque le profil montre une difficulté à inspirer confiance.",
    "advice": "Respectez vos engagements, même les plus simples. Les petites promesses tenues construisent progressivement une relation de confiance.",
    "why": "La confiance se construit par des actions répétées et cohérentes.",
    "premium": "Créer un plan de développement de la crédibilité personnelle.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL013",
    "pillar": "relationnel",
    "domain": "Respect",
    "title": "Respecter les différences de fonctionnement",
    "whenToUse": "Lorsque le profil révèle une difficulté à accepter que les autres pensent ou agissent différemment.",
    "advice": "Cherchez à comprendre les différences plutôt qu'à les corriger systématiquement. Une relation équilibrée laisse de la place aux individualités.",
    "why": "Le respect des différences favorise des relations plus sereines et plus durables.",
    "premium": "Ajouter un exercice permettant d'identifier les différences qui enrichissent une relation.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL014",
    "pillar": "relationnel",
    "domain": "Expression de l'affection",
    "title": "Exprimer régulièrement sa reconnaissance",
    "whenToUse": "Lorsque les réponses montrent une faible tendance à exprimer de la gratitude ou de l'appréciation.",
    "advice": "Prenez l'habitude de remercier sincèrement les personnes qui comptent pour vous, même pour des gestes simples.",
    "why": "La reconnaissance nourrit le lien relationnel et renforce le sentiment d'être apprécié.",
    "premium": "Créer un exercice de gratitude sur trente jours.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL015",
    "pillar": "relationnel",
    "domain": "Gestion des attentes",
    "title": "Clarifier ses attentes",
    "whenToUse": "Lorsque les réponses montrent des déceptions répétées ou des frustrations liées aux relations.",
    "advice": "Exprimez clairement ce que vous attendez d'une relation plutôt que d'espérer que l'autre le devine.",
    "why": "Les attentes implicites sont souvent à l'origine des frustrations relationnelles.",
    "premium": "Ajouter un exercice de clarification des attentes relationnelles.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL016",
    "pillar": "relationnel",
    "domain": "Pardon",
    "title": "Apprendre à pardonner progressivement",
    "whenToUse": "Lorsque le profil révèle une difficulté à dépasser certaines blessures relationnelles.",
    "advice": "Le pardon est souvent un processus. Accordez-vous le temps nécessaire pour avancer progressivement, sans nier ce que vous avez vécu.",
    "why": "Les blessures non traitées peuvent continuer à influencer les relations présentes.",
    "premium": "Proposer un parcours guidé sur le pardon et la reconstruction relationnelle.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL017",
    "pillar": "relationnel",
    "domain": "Relations durables",
    "title": "Investir du temps dans les relations importantes",
    "whenToUse": "Lorsque les réponses montrent une difficulté à entretenir les relations dans la durée.",
    "advice": "Les relations solides se construisent grâce à une attention régulière. Planifiez des moments de qualité avec les personnes importantes de votre vie.",
    "why": "La proximité relationnelle se développe par la constance plus que par les grands gestes.",
    "premium": "Créer un plan de développement des relations significatives.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL018",
    "pillar": "relationnel",
    "domain": "Développement personnel",
    "title": "Développer la connaissance de soi",
    "whenToUse": "Lorsque le profil met en évidence une faible conscience de ses réactions ou de ses besoins.",
    "advice": "Prenez régulièrement un temps pour réfléchir à vos émotions, à vos réactions et aux situations qui les déclenchent.",
    "why": "Une meilleure connaissance de soi améliore généralement la qualité des relations avec les autres.",
    "premium": "Ajouter un exercice d'auto-observation avec un carnet de réflexion guidé.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL019",
    "pillar": "relationnel",
    "domain": "Communication émotionnelle",
    "title": "Exprimer ses émotions avant qu'elles ne deviennent des réactions",
    "whenToUse": "Lorsque les réponses montrent une tendance à accumuler les émotions ou à exploser après une longue période de silence.",
    "advice": "Essayez de partager vos émotions lorsqu'elles apparaissent, sans attendre qu'elles deviennent de la colère ou du découragement. Plus une émotion est exprimée tôt, plus elle est généralement facile à communiquer.",
    "why": "Les émotions non exprimées ont tendance à s'accumuler et à s'exprimer plus tard sous forme de réactions disproportionnées.",
    "premium": "Ajouter un exercice d'identification et d'expression des émotions pendant quatorze jours.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL020",
    "pillar": "relationnel",
    "domain": "Communication",
    "title": "Vérifier que le message a été compris",
    "whenToUse": "Lorsque les réponses montrent des incompréhensions fréquentes.",
    "advice": "À la fin d'une discussion importante, demandez simplement :\n\n\"Qu'as-tu retenu de ce que je voulais dire ?\"\n\nCette question permet souvent de corriger immédiatement les malentendus.",
    "why": "Communiquer ne consiste pas seulement à parler.\n\nCommuniquer consiste également à vérifier que le message reçu correspond au message envoyé.",
    "premium": "Ajouter une méthode complète de reformulation.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL021",
    "pillar": "relationnel",
    "domain": "Gestion des désaccords",
    "title": "Séparer le problème de la personne",
    "whenToUse": "Lorsque les réponses montrent une tendance à personnaliser les conflits.",
    "advice": "Face à une difficulté, concentrez-vous sur le problème à résoudre plutôt que sur les défauts de la personne.",
    "why": "Une personne se sent davantage respectée lorsque son identité n'est pas attaquée pendant un désaccord.",
    "premium": "Ajouter une méthode de résolution de conflit en quatre étapes.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL022",
    "pillar": "relationnel",
    "domain": "Écoute",
    "title": "Accorder une écoute sans interruption",
    "whenToUse": "Lorsque le profil révèle une tendance à couper la parole ou à répondre trop rapidement.",
    "advice": "Pendant une conversation importante, laissez systématiquement votre interlocuteur terminer avant d'intervenir.\n\nPrenez ensuite quelques secondes avant de répondre.",
    "why": "Le silence permet souvent une meilleure compréhension que la réponse immédiate.",
    "premium": "Ajouter un exercice d'écoute consciente.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL023",
    "pillar": "relationnel",
    "domain": "Empathie",
    "title": "Essayer de voir la situation depuis le point de vue de l'autre",
    "whenToUse": "Lorsque les réponses montrent des difficultés à comprendre les réactions des autres.",
    "advice": "Avant de défendre votre position, demandez-vous :\n\n\"Si j'étais à sa place, comment pourrais-je vivre cette situation ?\"",
    "why": "L'empathie réduit les jugements rapides et facilite la compréhension mutuelle.",
    "premium": "Ajouter un exercice d'empathie guidée.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL024",
    "pillar": "relationnel",
    "domain": "Confiance",
    "title": "Créer un climat de sécurité émotionnelle",
    "whenToUse": "Lorsque le profil montre une difficulté à instaurer des relations de confiance.",
    "advice": "Veillez à ce que les personnes qui vous parlent se sentent écoutées, respectées et libres d'exprimer leurs émotions sans crainte d'être jugées.",
    "why": "La confiance grandit lorsque chacun se sent en sécurité dans la relation.",
    "premium": "Ajouter un plan de développement de la sécurité émotionnelle.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL025",
    "pillar": "relationnel",
    "domain": "Relations durables",
    "title": "Entretenir la relation avant qu'elle ne se fragilise",
    "whenToUse": "Lorsque les réponses montrent une tendance à investir dans une relation uniquement lorsqu'une difficulté apparaît.",
    "advice": "Prenez régulièrement des nouvelles des personnes importantes, même lorsqu'aucun problème n'existe.",
    "why": "Les relations solides se construisent dans la continuité et pas uniquement dans les périodes difficiles.",
    "premium": "Créer un calendrier relationnel personnalisé.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL026",
    "pillar": "relationnel",
    "domain": "Gestion des attentes",
    "title": "Accepter que personne ne puisse répondre à tous vos besoins",
    "whenToUse": "Lorsque le profil révèle des attentes très élevées envers les autres.",
    "advice": "Aucune relation humaine n'est capable de répondre parfaitement à l'ensemble de vos attentes.\n\nApprenez à distinguer vos besoins essentiels de vos attentes idéales.",
    "why": "Des attentes irréalistes conduisent souvent à des déceptions répétées.",
    "premium": "Ajouter un exercice de hiérarchisation des attentes.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL027",
    "pillar": "relationnel",
    "domain": "Relations saines",
    "title": "Développer des limites relationnelles équilibrées",
    "whenToUse": "Lorsque les réponses montrent une difficulté à dire non ou à protéger son équilibre personnel.",
    "advice": "Apprenez à poser des limites avec respect lorsque certaines situations dépassent ce qui vous semble acceptable.",
    "why": "Des limites claires favorisent des relations plus respectueuses et plus durables.",
    "premium": "Ajouter un atelier pratique sur les limites personnelles.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL028",
    "pillar": "relationnel",
    "domain": "Croissance personnelle",
    "title": "Considérer chaque relation comme une opportunité d'apprentissage",
    "whenToUse": "Lorsque le profil révèle une tendance à attribuer systématiquement les difficultés aux autres.",
    "advice": "Après chaque situation relationnelle importante, prenez quelques minutes pour identifier ce qu'elle vous a appris sur vous-même.",
    "why": "Les relations sont souvent un miroir qui permet de mieux se connaître.",
    "premium": "Ajouter un journal de réflexion guidé sur trente jours.",
    "source": "dossier_rel_A"
  },
  {
    "id": "REL041",
    "pillar": "relationnel",
    "domain": "Communication",
    "title": "Développer le courage relationnel.",
    "whenToUse": "• l'utilisateur évite les conversations difficiles\n• les réponses montrent une peur du conflit\n• les désaccords restent souvent non résolus",
    "advice": "Choisissez une situation que vous évitez depuis quelque temps.\n\nPréparez calmement ce que vous souhaitez dire.\n\nParlez des faits.\n\nExprimez ensuite votre ressenti.\n\nEnfin, proposez une solution.",
    "why": "Les conflits évités disparaissent rarement.\n\nIls ont plutôt tendance à devenir plus importants avec le temps.",
    "premium": "• méthode complète de préparation d'une conversation difficile\n\n• exemples\n\n• erreurs fréquentes\n\n• exercice guidé",
    "priority": "Très élevée",
    "source": "dossier_rel_B"
  },
  {
    "id": "REL042",
    "pillar": "relationnel",
    "domain": "Écoute",
    "title": "Développer une écoute active.",
    "whenToUse": "• l'utilisateur coupe souvent la parole\n\n• il répond rapidement\n\n• il cherche surtout à convaincre",
    "advice": "Lors de votre prochaine conversation importante, imposez-vous une règle simple :\n\nne répondez qu'après avoir résumé ce que vous avez compris.",
    "why": "Les personnes se sentent davantage respectées lorsqu'elles ont le sentiment d'avoir été réellement entendues.",
    "premium": "• méthode complète de reformulation\n\n• cas pratiques",
    "priority": "Élevée",
    "source": "dossier_rel_B"
  },
  {
    "id": "REL043",
    "pillar": "relationnel",
    "domain": "Gestion des émotions",
    "title": "Développer l'autorégulation émotionnelle.",
    "whenToUse": "• réactions impulsives\n\n• difficultés à gérer la colère\n\n• frustration importante",
    "advice": "Avant de répondre à une situation difficile, prenez trois respirations lentes.\n\nIdentifiez ensuite précisément l'émotion que vous ressentez.\n\nEnfin, choisissez volontairement votre réponse.",
    "why": "Le cerveau prend généralement de meilleures décisions lorsque l'intensité émotionnelle diminue.",
    "premium": "Programme complet de régulation émotionnelle.",
    "priority": "Élevée",
    "source": "dossier_rel_B"
  },
  {
    "id": "REL044",
    "pillar": "relationnel",
    "domain": "Relations durables",
    "title": "Développer la constance relationnelle.",
    "whenToUse": "• difficulté à entretenir les relations\n\n• éloignement progressif",
    "advice": "Chaque semaine, contactez volontairement une personne importante sans attendre une raison particulière.",
    "why": "Les relations solides se développent grâce à une attention régulière.",
    "premium": "Programme \"30 jours pour renforcer vos relations importantes\".\n\nBénéfice principal :\n\nCette recommandation contribue principalement à :\n\n□ renforcer la confiance\n□ améliorer la communication\n□ réduire les conflits\n□ développer la maturité émotionnelle\n□ favoriser des relations durables",
    "priority": "Normale",
    "source": "dossier_rel_B"
  },
  {
    "id": "REL045",
    "pillar": "relationnel",
    "domain": "Communication constructive",
    "title": "Développer une communication constructive.",
    "whenToUse": "- l'utilisateur communique principalement sous le coup de l'émotion ;\n- les réponses montrent des échanges souvent tendus ;\n- les désaccords dégénèrent rapidement.",
    "advice": "Avant une discussion importante, définissez clairement ce que vous souhaitez obtenir de cette conversation. Entrez dans l'échange avec l'objectif de construire une solution plutôt que de convaincre l'autre.",
    "why": "Une conversation orientée vers la recherche de solutions produit généralement des échanges plus sereins qu'une conversation centrée sur les reproches.",
    "premium": "- méthode de préparation d'une discussion importante ;\n- exemples de dialogues ;\n- erreurs fréquentes à éviter ;\n- exercice pratique.",
    "priority": "Élevée",
    "source": "dossier_rel_B"
  },
  {
    "id": "REL046",
    "pillar": "relationnel",
    "domain": "Maturité relationnelle",
    "title": "Développer la maturité émotionnelle.",
    "whenToUse": "- l'utilisateur se sent rapidement blessé ;\n- les critiques sont difficiles à accepter ;\n- les conflits sont souvent pris personnellement.",
    "advice": "Face à une remarque, prenez quelques instants avant de réagir. Demandez-vous d'abord si cette remarque contient une information utile qui peut vous aider à progresser.",
    "why": "Prendre du recul permet souvent de transformer une critique en opportunité d'amélioration.",
    "premium": "Analyse des mécanismes de défense et exercices de prise de recul.",
    "priority": "Élevée",
    "source": "dossier_rel_B"
  },
  {
    "id": "REL047",
    "pillar": "relationnel",
    "domain": "Relations équilibrées",
    "title": "Construire des relations équilibrées.",
    "whenToUse": "- l'utilisateur donne beaucoup sans exprimer ses propres besoins ;\n- les réponses révèlent un déséquilibre relationnel.",
    "advice": "Prendre soin des autres est une qualité. Cependant, une relation saine suppose également de savoir exprimer ses propres besoins avec simplicité et respect.",
    "why": "Une relation durable repose sur un équilibre entre donner, recevoir et savoir demander.",
    "premium": "Programme d'affirmation de soi sur quatre semaines.",
    "priority": "Normale",
    "source": "dossier_rel_B"
  },
  {
    "id": "REL048",
    "pillar": "relationnel",
    "domain": "Gestion des attentes",
    "title": "Développer des attentes réalistes.",
    "whenToUse": "- attentes élevées envers les autres ;\n- nombreuses déceptions relationnelles.",
    "advice": "Avant d'attendre quelque chose d'une personne, demandez-vous si cette attente a été clairement exprimée et si elle est réaliste.",
    "why": "Beaucoup de frustrations proviennent d'attentes implicites ou irréalistes.",
    "premium": "Atelier \"Comprendre et ajuster ses attentes relationnelles\".",
    "priority": "Normale",
    "source": "dossier_rel_B"
  },
  {
    "id": "REL049",
    "pillar": "relationnel",
    "domain": "Confiance",
    "title": "Développer une sécurité relationnelle.",
    "whenToUse": "- peur de l'abandon ;\n- difficulté à faire confiance ;\n- besoin fréquent d'être rassuré.",
    "advice": "Cherchez à distinguer les faits de vos inquiétudes. Toutes les peurs ne reflètent pas nécessairement la réalité. Prenez le temps de vérifier vos perceptions avant de tirer des conclusions.",
    "why": "Une relation solide se construit davantage sur des faits observables que sur des suppositions.",
    "premium": "Parcours guidé sur la sécurité affective, avec exercices de réflexion et plan de progression.",
    "priority": "Très élevée",
    "source": "dossier_rel_B"
  },
  {
    "id": "REL050",
    "pillar": "relationnel",
    "domain": "Gestion des émotions",
    "title": "Développer la capacité à répondre plutôt qu'à réagir.",
    "whenToUse": "- les émotions prennent souvent le dessus ;\n- les réactions sont impulsives ;\n- les décisions sont prises sous le coup de la colère ou de la tristesse.",
    "advice": "Avant toute réponse importante, accordez-vous quelques instants de recul. Respirer profondément, identifier votre émotion et réfléchir à la conséquence de votre réponse permet souvent d'éviter des paroles regrettables.",
    "why": "Une émotion n'est pas un problème.\n\nC'est la manière dont elle est gérée qui influence la qualité des relations.",
    "premium": "• Identifier les déclencheurs émotionnels.\n\n• Construire son plan personnel de régulation émotionnelle.\n\n• Exercices pratiques.",
    "priority": "Élevée",
    "source": "dossier_rel_B"
  },
  {
    "id": "REL051",
    "pillar": "relationnel",
    "domain": "Empathie",
    "title": "Développer l'empathie.",
    "whenToUse": "- difficulté à comprendre les réactions des autres ;\n- nombreux malentendus ;\n- tendance à juger rapidement.",
    "advice": "Lorsque vous vivez une situation difficile avec quelqu'un, demandez-vous :\n\n\"Qu'est-ce que cette personne pourrait être en train de vivre que je ne vois pas ?\"",
    "why": "Comprendre n'est pas toujours être d'accord.\n\nMais comprendre permet presque toujours de mieux communiquer.",
    "premium": "Exercice guidé d'empathie avec plusieurs études de cas.",
    "priority": "Normale",
    "source": "dossier_rel_B"
  },
  {
    "id": "REL052",
    "pillar": "relationnel",
    "domain": "Affirmation de soi",
    "title": "Développer une affirmation de soi respectueuse.",
    "whenToUse": "- difficulté à dire non ;\n- peur de décevoir ;\n- tendance à accepter des situations inconfortables.",
    "advice": "Dire non ne signifie pas rejeter une personne.\n\nCela signifie simplement protéger une limite importante pour vous.\n\nExprimez votre refus avec respect, sans vous sentir obligé de vous justifier longuement.",
    "why": "Les limites claires favorisent des relations plus saines.",
    "premium": "Programme complet sur les limites personnelles.",
    "priority": "Très élevée",
    "source": "dossier_rel_B"
  },
  {
    "id": "REL053",
    "pillar": "relationnel",
    "domain": "Patience",
    "title": "Développer la patience relationnelle.",
    "whenToUse": "- impatience fréquente ;\n- irritabilité ;\n- attentes de résultats immédiats.",
    "advice": "Toutes les relations évoluent à leur propre rythme.\n\nLaissez le temps aux personnes de progresser sans exiger des changements immédiats.",
    "why": "La pression ralentit souvent les changements qu'elle cherche à provoquer.",
    "premium": "Programme \"Développer la patience au quotidien\".",
    "priority": "Normale",
    "source": "dossier_rel_B"
  },
  {
    "id": "REL054",
    "pillar": "relationnel",
    "domain": "Reconnaissance",
    "title": "Développer une culture de l'encouragement.",
    "whenToUse": "- les compliments sont rares ;\n- les efforts des autres passent souvent inaperçus.",
    "advice": "Chaque jour, prenez le temps de reconnaître sincèrement au moins une qualité, un effort ou une attitude positive chez une personne de votre entourage.",
    "why": "Les personnes progressent davantage lorsqu'elles se sentent reconnues que lorsqu'elles se sentent constamment critiquées.",
    "premium": "Défi \"30 jours d'encouragement\" avec suivi quotidien.",
    "priority": "Tous niveaux",
    "source": "dossier_rel_B"
  },
  {
    "id": "SPI001",
    "pillar": "spirituel",
    "domain": "Général",
    "title": "Développez une relation personnelle régulière avec Dieu",
    "whenToUse": "Utiliser lorsque le pilier « spirituel » est un axe de développement.",
    "advice": "Développez une relation personnelle régulière avec Dieu.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "SPI002",
    "pillar": "spirituel",
    "domain": "Général",
    "title": "Accordez une place quotidienne à la prière",
    "whenToUse": "Utiliser lorsque le pilier « spirituel » est un axe de développement.",
    "advice": "Accordez une place quotidienne à la prière.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "SPI003",
    "pillar": "spirituel",
    "domain": "Général",
    "title": "Nourrissez votre foi par une lecture régulière de la Bible",
    "whenToUse": "Utiliser lorsque le pilier « spirituel » est un axe de développement.",
    "advice": "Nourrissez votre foi par une lecture régulière de la Bible.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "SPI004",
    "pillar": "spirituel",
    "domain": "Général",
    "title": "Cherchez à mieux connaître les enseignements bibliques concernant les relations",
    "whenToUse": "Utiliser lorsque le pilier « spirituel » est un axe de développement.",
    "advice": "Cherchez à mieux connaître les enseignements bibliques concernant les relations.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "SPI005",
    "pillar": "spirituel",
    "domain": "Général",
    "title": "Développez les fruits de l'Esprit dans votre quotidien",
    "whenToUse": "Utiliser lorsque le pilier « spirituel » est un axe de développement.",
    "advice": "Développez les fruits de l'Esprit dans votre quotidien.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "SPI006",
    "pillar": "spirituel",
    "domain": "Général",
    "title": "Faites de votre foi un guide pour vos décisions importantes",
    "whenToUse": "Utiliser lorsque le pilier « spirituel » est un axe de développement.",
    "advice": "Faites de votre foi un guide pour vos décisions importantes.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "SPI007",
    "pillar": "spirituel",
    "domain": "Général",
    "title": "Recherchez la volonté de Dieu avant de prendre des décisions relationnelles",
    "whenToUse": "Utiliser lorsque le pilier « spirituel » est un axe de développement.",
    "advice": "Recherchez la volonté de Dieu avant de prendre des décisions relationnelles.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "SPI008",
    "pillar": "spirituel",
    "domain": "Général",
    "title": "Entourez-vous de personnes qui encouragent votre croissance spirituelle",
    "whenToUse": "Utiliser lorsque le pilier « spirituel » est un axe de développement.",
    "advice": "Entourez-vous de personnes qui encouragent votre croissance spirituelle.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "SPI009",
    "pillar": "spirituel",
    "domain": "Général",
    "title": "Développez une foi cohérente avec vos actes",
    "whenToUse": "Utiliser lorsque le pilier « spirituel » est un axe de développement.",
    "advice": "Développez une foi cohérente avec vos actes.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "SPI010",
    "pillar": "spirituel",
    "domain": "Général",
    "title": "Persévérez dans votre croissance spirituelle même lorsque les résultats semblent lents",
    "whenToUse": "Utiliser lorsque le pilier « spirituel » est un axe de développement.",
    "advice": "Persévérez dans votre croissance spirituelle même lorsque les résultats semblent lents.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "PRJ001",
    "pillar": "projets_de_vie",
    "domain": "Général",
    "title": "Clarifiez votre vision du mariage",
    "whenToUse": "Utiliser lorsque le pilier « projets_de_vie » est un axe de développement.",
    "advice": "Clarifiez votre vision du mariage.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "PRJ002",
    "pillar": "projets_de_vie",
    "domain": "Général",
    "title": "Définissez vos priorités de vie",
    "whenToUse": "Utiliser lorsque le pilier « projets_de_vie » est un axe de développement.",
    "advice": "Définissez vos priorités de vie.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "PRJ003",
    "pillar": "projets_de_vie",
    "domain": "Général",
    "title": "Réfléchissez au type de famille que vous souhaitez construire",
    "whenToUse": "Utiliser lorsque le pilier « projets_de_vie » est un axe de développement.",
    "advice": "Réfléchissez au type de famille que vous souhaitez construire.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "PRJ004",
    "pillar": "projets_de_vie",
    "domain": "Général",
    "title": "Établissez vos objectifs professionnels à moyen et long terme",
    "whenToUse": "Utiliser lorsque le pilier « projets_de_vie » est un axe de développement.",
    "advice": "Établissez vos objectifs professionnels à moyen et long terme.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "PRJ005",
    "pillar": "projets_de_vie",
    "domain": "Général",
    "title": "Identifiez vos priorités financières",
    "whenToUse": "Utiliser lorsque le pilier « projets_de_vie » est un axe de développement.",
    "advice": "Identifiez vos priorités financières.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "PRJ006",
    "pillar": "projets_de_vie",
    "domain": "Général",
    "title": "Faites la différence entre vos rêves et vos objectifs",
    "whenToUse": "Utiliser lorsque le pilier « projets_de_vie » est un axe de développement.",
    "advice": "Faites la différence entre vos rêves et vos objectifs.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "PRJ007",
    "pillar": "projets_de_vie",
    "domain": "Général",
    "title": "Écrivez votre projet de vie",
    "whenToUse": "Utiliser lorsque le pilier « projets_de_vie » est un axe de développement.",
    "advice": "Écrivez votre projet de vie.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "PRJ008",
    "pillar": "projets_de_vie",
    "domain": "Général",
    "title": "Réévaluez régulièrement vos objectifs",
    "whenToUse": "Utiliser lorsque le pilier « projets_de_vie » est un axe de développement.",
    "advice": "Réévaluez régulièrement vos objectifs.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "PRJ009",
    "pillar": "projets_de_vie",
    "domain": "Général",
    "title": "Développez une vision réaliste de votre avenir",
    "whenToUse": "Utiliser lorsque le pilier « projets_de_vie » est un axe de développement.",
    "advice": "Développez une vision réaliste de votre avenir.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "PRJ010",
    "pillar": "projets_de_vie",
    "domain": "Général",
    "title": "Construisez un équilibre entre ambition professionnelle et vie personnelle",
    "whenToUse": "Utiliser lorsque le pilier « projets_de_vie » est un axe de développement.",
    "advice": "Construisez un équilibre entre ambition professionnelle et vie personnelle.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "VAL001",
    "pillar": "valeurs",
    "domain": "Général",
    "title": "Identifiez les valeurs qui guident réellement vos décisions",
    "whenToUse": "Utiliser lorsque le pilier « valeurs » est un axe de développement.",
    "advice": "Identifiez les valeurs qui guident réellement vos décisions.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "VAL002",
    "pillar": "valeurs",
    "domain": "Général",
    "title": "Vérifiez que vos choix sont cohérents avec vos convictions",
    "whenToUse": "Utiliser lorsque le pilier « valeurs » est un axe de développement.",
    "advice": "Vérifiez que vos choix sont cohérents avec vos convictions.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "VAL003",
    "pillar": "valeurs",
    "domain": "Général",
    "title": "Développez votre intégrité dans les petites comme dans les grandes décisions",
    "whenToUse": "Utiliser lorsque le pilier « valeurs » est un axe de développement.",
    "advice": "Développez votre intégrité dans les petites comme dans les grandes décisions.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "VAL004",
    "pillar": "valeurs",
    "domain": "Général",
    "title": "Renforcez votre sens des responsabilités",
    "whenToUse": "Utiliser lorsque le pilier « valeurs » est un axe de développement.",
    "advice": "Renforcez votre sens des responsabilités.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "VAL005",
    "pillar": "valeurs",
    "domain": "Général",
    "title": "Réfléchissez à votre rapport à l'argent",
    "whenToUse": "Utiliser lorsque le pilier « valeurs » est un axe de développement.",
    "advice": "Réfléchissez à votre rapport à l'argent.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "VAL006",
    "pillar": "valeurs",
    "domain": "Général",
    "title": "Clarifiez votre vision de la famille",
    "whenToUse": "Utiliser lorsque le pilier « valeurs » est un axe de développement.",
    "advice": "Clarifiez votre vision de la famille.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "VAL007",
    "pillar": "valeurs",
    "domain": "Général",
    "title": "Cultivez le respect de chacun",
    "whenToUse": "Utiliser lorsque le pilier « valeurs » est un axe de développement.",
    "advice": "Cultivez le respect de chacun.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "VAL008",
    "pillar": "valeurs",
    "domain": "Général",
    "title": "Apprenez à rester fidèle à vos principes",
    "whenToUse": "Utiliser lorsque le pilier « valeurs » est un axe de développement.",
    "advice": "Apprenez à rester fidèle à vos principes.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "VAL009",
    "pillar": "valeurs",
    "domain": "Général",
    "title": "Développez une attitude de service",
    "whenToUse": "Utiliser lorsque le pilier « valeurs » est un axe de développement.",
    "advice": "Développez une attitude de service.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "VAL010",
    "pillar": "valeurs",
    "domain": "Général",
    "title": "Faites régulièrement le point sur vos priorités",
    "whenToUse": "Utiliser lorsque le pilier « valeurs » est un axe de développement.",
    "advice": "Faites régulièrement le point sur vos priorités.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "HUM001",
    "pillar": "humain",
    "domain": "Général",
    "title": "Développez de nouveaux centres d'intérêt",
    "whenToUse": "Utiliser lorsque le pilier « humain » est un axe de développement.",
    "advice": "Développez de nouveaux centres d'intérêt.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "HUM002",
    "pillar": "humain",
    "domain": "Général",
    "title": "Prenez le temps de découvrir de nouvelles activités",
    "whenToUse": "Utiliser lorsque le pilier « humain » est un axe de développement.",
    "advice": "Prenez le temps de découvrir de nouvelles activités.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "HUM003",
    "pillar": "humain",
    "domain": "Général",
    "title": "Cultivez votre curiosité",
    "whenToUse": "Utiliser lorsque le pilier « humain » est un axe de développement.",
    "advice": "Cultivez votre curiosité.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "HUM004",
    "pillar": "humain",
    "domain": "Général",
    "title": "Développez votre capacité d'adaptation",
    "whenToUse": "Utiliser lorsque le pilier « humain » est un axe de développement.",
    "advice": "Développez votre capacité d'adaptation.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "HUM005",
    "pillar": "humain",
    "domain": "Général",
    "title": "Apprenez à apprécier les différences",
    "whenToUse": "Utiliser lorsque le pilier « humain » est un axe de développement.",
    "advice": "Apprenez à apprécier les différences.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "HUM006",
    "pillar": "humain",
    "domain": "Général",
    "title": "Prenez soin de votre équilibre de vie",
    "whenToUse": "Utiliser lorsque le pilier « humain » est un axe de développement.",
    "advice": "Prenez soin de votre équilibre de vie.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "HUM007",
    "pillar": "humain",
    "domain": "Général",
    "title": "Développez des habitudes favorables à une vie relationnelle saine",
    "whenToUse": "Utiliser lorsque le pilier « humain » est un axe de développement.",
    "advice": "Développez des habitudes favorables à une vie relationnelle saine.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "HUM008",
    "pillar": "humain",
    "domain": "Général",
    "title": "Accordez du temps à vos proches",
    "whenToUse": "Utiliser lorsque le pilier « humain » est un axe de développement.",
    "advice": "Accordez du temps à vos proches.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "HUM009",
    "pillar": "humain",
    "domain": "Général",
    "title": "Entretenez des relations positives",
    "whenToUse": "Utiliser lorsque le pilier « humain » est un axe de développement.",
    "advice": "Entretenez des relations positives.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  },
  {
    "id": "HUM010",
    "pillar": "humain",
    "domain": "Général",
    "title": "Continuez à développer votre ouverture aux autres",
    "whenToUse": "Utiliser lorsque le pilier « humain » est un axe de développement.",
    "advice": "Continuez à développer votre ouverture aux autres.",
    "why": "",
    "premium": "",
    "source": "dossier_short_list"
  }
] as OfficialRecommendation[]

export const RECOS_BY_PILLAR: Record<ReportPillarId, OfficialRecommendation[]> = {
  relationnel: OFFICIAL_RECOMMENDATIONS.filter((r) => r.pillar === "relationnel"),
  spirituel: OFFICIAL_RECOMMENDATIONS.filter((r) => r.pillar === "spirituel"),
  projets_de_vie: OFFICIAL_RECOMMENDATIONS.filter((r) => r.pillar === "projets_de_vie"),
  valeurs: OFFICIAL_RECOMMENDATIONS.filter((r) => r.pillar === "valeurs"),
  humain: OFFICIAL_RECOMMENDATIONS.filter((r) => r.pillar === "humain"),
}
