/**
 * Bibliothèque d’interprétation KELYA COUPLE™
 * Chaîne : donnée → sens possible → ce qu’on ne conclut pas → action / questions.
 * Jamais de phrases clones génériques d’une dimension à l’autre.
 */

import type { CoupleDimensionId } from "@/lib/couple/questionBank"
import type { DimensionPairScore } from "@/lib/couple/scoring"

export type CoupleNames = { nameA: string; nameB: string }

export type DimLibrary = {
  /** Ce que mesure cet axe (vocabulaire clair pour le couple). */
  measures: string
  /** Lecture force / forte convergence. */
  force: string
  /** Si A marque nettement plus haut que B. */
  aHigher: string
  /** Si B marque nettement plus haut que A. */
  bHigher: string
  /** Si écart faible mais niveau bas (tous deux bas). */
  bothLow?: string
  /** Vigilance (écart fort ou niveau bas). */
  vigilance: string
  /** Questions concrètes pour échanger. */
  questions: string[]
  /** Micro-actions datables (spécifiques à l’axe). */
  actions: string[]
  /** Angle conflit / dynamique typique. */
  conflictPattern?: string
}

export const DIMENSION_LIBRARY: Record<CoupleDimensionId, DimLibrary> = {
  vision_couple: {
    measures:
      "La place du couple dans votre vie : projet commun, rythme, équilibre entre « nous » et « moi ».",
    force:
      "Vous semblez partager une conception proche du couple comme espace de construction commune. Cette base facilite les décisions et les ajustements à long terme.",
    aHigher:
      "Vos réponses suggèrent que {A} accorde une place plus structurante au projet de couple, tandis que {B} laisse davantage de place à d’autres priorités personnelles. Ce n’est pas un jugement : c’est un écart de poids donné au « nous ».",
    bHigher:
      "Vos réponses suggèrent que {B} met davantage le couple au centre des choix, tandis que {A} garde une vision plus individualisée ou progressive. Clarifier ce que chacun appelle « avancer ensemble » évite les malentendus.",
    vigilance:
      "L’écart sur la vision du couple est marqué. Sans conversation explicite, l’un peut se sentir freiné, l’autre poussé — ou l’inverse.",
    questions: [
      "Qu’est-ce qu’une relation réussie signifie concrètement pour chacun ?",
      "Quelles habitudes êtes-vous prêts à faire évoluer pour le couple ?",
      "Quelles choses souhaitez-vous absolument préserver individuellement ?",
    ],
    actions: [
      "Écrire chacun 5 lignes : « Notre couple dans 3 ans » puis comparer.",
      "Choisir un seul point de vision à clarifier cette semaine (pas dix).",
    ],
    conflictPattern:
      "Le conflit naît souvent quand l’un parle d’engagement concret et l’autre d’espace / timing.",
  },
  valeurs: {
    measures:
      "Ce qui guide vos choix difficiles : loyauté, foi, honnêteté, famille, réussite, justice, etc.",
    force:
      "Vos réponses indiquent une base de valeurs relativement commune. C’est un repère précieux quand les décisions deviennent difficiles.",
    aHigher:
      "{A} semble faire porter plus de poids à certaines valeurs structurantes dans le quotidien. {B} peut vivre les mêmes mots avec une priorisation différente — d’où l’intérêt de passer des valeurs générales aux situations concrètes.",
    bHigher:
      "{B} semble faire porter plus de poids à certaines valeurs dans les arbitrages. {A} peut partager le vocabulaire sans y mettre le même ordre de priorité.",
    vigilance:
      "Une différence de valeurs devient critique quand elle influence argent, famille, spiritualité ou limites. Il faut nommer ce qui est négociable et ce qui ne l’est pas.",
    questions: [
      "Quelles sont les trois valeurs non négociables de chacun ?",
      "Dans quelle situation récente une valeur a-t-elle heurté l’autre ?",
    ],
    actions: [
      "Lister 3 valeurs chacun, puis trouver 1 situation réelle où elles s’expriment.",
      "Décider d’une règle commune pour un dilemme récurrent.",
    ],
  },
  mariage: {
    measures:
      "Ce que signifie l’engagement / le mariage : rôles, fidélité, projet, rythme avant et après.",
    force:
      "Vous semblez avoir une conception relativement proche de l’engagement. Cela réduit le risque de visions totalement opposées du mariage.",
    aHigher:
      "{A} semble plus avancé(e) ou plus exigeant(e) sur la clarté du projet matrimonial. {B} peut encore avoir besoin de temps, de conditions, ou d’une définition différente de « être prêt ».",
    bHigher:
      "{B} semble plus avancé(e) sur le projet d’engagement. {A} peut prioriser d’autres conditions (stabilité, carrière, clarté) avant de se sentir prêt(e).",
    vigilance:
      "Des attentes implicites sur le mariage non alignées créent de la pression. Transformez-les en conversations datées avant de franchir de grandes étapes.",
    questions: [
      "Que signifie être marié / engagé pour chacun ?",
      "Quelles concessions sont acceptables ? Quelles limites ne le sont pas ?",
      "Quel calendrier réaliste chacun envisage — et pourquoi ?",
    ],
    actions: [
      "Écrire chacun : « Ce que j’attends du conjoint dans les 2 premières années ».",
      "Fixer une date de revue du sujet (ex. dans 30 jours), sans pression du soir même.",
    ],
    conflictPattern:
      "L’un entend « tu retardes », l’autre entend « tu précipites » — alors que les deux parlent de sécurité.",
  },
  communication: {
    measures:
      "Capacité à exprimer, écouter, reformuler et aborder les sujets sensibles sans s’humilier.",
    force:
      "La communication apparaît comme une ressource : capacité relative à exprimer, écouter et aborder les sujets importants.",
    aHigher:
      "{A} se situe plus haut sur la communication. {B} peut avoir l’impression de moins être entendu(e), ou de devoir « forcer » pour parler. Vérifiez si le problème est la quantité ou la qualité des échanges difficiles.",
    bHigher:
      "{B} se situe plus haut sur la communication. {A} peut communiquer moins, ou autrement (actions plutôt que mots). Le risque : croire que « on se parle assez » alors qu’un seul porte le verbal.",
    vigilance:
      "L’écart de perception sur la communication est un signal fort : l’un peut croire beaucoup communiquer, l’autre ressentir qu’il n’est pas entendu.",
    questions: [
      "Quand as-tu eu l’impression de ne pas être entendu(e) ces 14 derniers jours ?",
      "Préfères-tu parler tout de suite ou après un temps de pause ?",
    ],
    actions: [
      "Instaurer un check-in de 15 min / semaine (une joie, une friction, une demande).",
      "Règle : reformuler avant de répondre sur les sujets sensibles.",
    ],
    conflictPattern:
      "Le conflit s’emballe quand l’un veut résoudre tout de suite et l’autre a besoin d’être d’abord compris.",
  },
  conflits: {
    measures:
      "Réflexes face au désaccord : parler / se retirer, réparer, éviter l’humiliation, reprendre le dialogue.",
    force:
      "Vous disposez de ressources utiles pour traverser les désaccords : dialogue, responsabilité, volonté de réparation.",
    aHigher:
      "{A} semble plus à l’aise pour affronter ou structurer le conflit. {B} peut avoir besoin de plus de temps ou de sécurité avant d’entrer dans le sujet. Sans accord, l’un peut paraître agressif, l’autre fuyant.",
    bHigher:
      "{B} semble plus disposé(e) à traiter le conflit rapidement. {A} peut ralentir ou se retirer. Ce motif approche/retrait est classique — et très réparable s’il est nommé.",
    vigilance:
      "Quand l’intensité monte, vos réflexes divergent. Sans méthode commune (pause + reprise), le conflit laisse des traces même après « la paix ».",
    questions: [
      "En conflit, j’ai besoin de… (parler / silence / geste / temps) ?",
      "Quel signal de pause pouvons-nous utiliser sans que ce soit un rejet ?",
    ],
    actions: [
      "Écrire ensemble un protocole : signal de pause → durée → heure de reprise → réparation.",
      "Après la prochaine friction : 10 min « ce que j’ai ressenti / ce que je propose ».",
    ],
    conflictPattern:
      "Boucle typique : l’un presse → l’autre se ferme → le premier presse plus → le second se sent attaqué.",
  },
  emotions: {
    measures:
      "Identification, expression et régulation des émotions dans le couple (sans diagnostic clinique).",
    force:
      "Bonne capacité relative à identifier et exprimer les émotions, avec une part de responsabilité individuelle dans la régulation.",
    aHigher:
      "{A} semble plus expressif(ve) ou plus centré(e) sur le vécu émotionnel. {B} peut réguler autrement (calme, analyse, action). Sans traduction, l’un peut se sentir « froid », l’autre « trop intense ».",
    bHigher:
      "{B} semble plus expressif(ve) émotionnellement. {A} peut avoir besoin de plus de temps pour nommer ce qu’il/elle ressent.",
    vigilance:
      "Les émotions fortes peuvent colorer rapidement vos réactions. Distinguez ressenti, besoin et demande concrète.",
    questions: [
      "Quand je suis touché(e), qu’est-ce qui m’aide vraiment ?",
      "Qu’est-ce que je fais (ou évite) quand je suis en colère / triste ?",
    ],
    actions: [
      "Pratiquer : « Je ressens… j’ai besoin de… je te demande… » une fois cette semaine.",
    ],
  },
  affection: {
    measures:
      "Manières de donner et recevoir l’affection : gestes, mots, temps, présence, attention.",
    force:
      "Compréhension relativement proche de la façon dont l’affection se donne et se reçoit chez vous.",
    aHigher:
      "{A} se situe plus haut sur l’affection / proximité. {B} peut exprimer l’amour autrement (service, stabilité, humour). Le risque : interpréter la différence comme un manque d’amour.",
    bHigher:
      "{B} se situe plus haut sur le besoin ou l’expression d’affection. {A} peut sous-estimer l’impact des gestes quotidiens manquants.",
    vigilance:
      "Un écart d’affection crée souvent un sentiment de manque d’un côté et d’incompréhension de l’autre. Traduisez en comportements concrets.",
    questions: [
      "Quels gestes me font me sentir aimé(e) concrètement ?",
      "Qu’est-ce que mon partenaire fait déjà que je n’ai pas assez reconnu ?",
    ],
    actions: [
      "Chacun choisit 1 langage d’affection à pratiquer 3 fois cette semaine.",
    ],
  },
  intimite: {
    measures:
      "Proximité intime (émotionnelle et/ou physique) : désir, rythme, sécurité, conversation sur le sujet.",
    force:
      "Vous semblez disposer d’une base de confiance relative pour parler ou vivre l’intimité sans trop de tension déclarée.",
    aHigher:
      "{A} semble plus à l’aise ou plus demandeur(se) sur l’intimité. {B} peut avoir besoin de plus de sécurité, de rythme, ou de conversation préalable.",
    bHigher:
      "{B} semble plus à l’aise ou plus demandeur(se) sur l’intimité. {A} peut ralentir — ce n’est pas forcément un rejet.",
    vigilance:
      "Les écarts d’intimité blessent vite s’ils restent tabous. Priorité : sécurité + langage respectueux, pas la performance.",
    questions: [
      "Qu’est-ce qui facilite / bloque mon ouverture intime ?",
      "Comment parlons-nous de ce sujet sans pression ni humiliation ?",
    ],
    actions: [
      "Prévoir une conversation calme (pas au lit, pas en colère) de 20 min sur besoins et limites.",
    ],
  },
  finances: {
    measures:
      "Rapport à l’argent : sécurité, dépenses, épargne, seuils de décision commune, autonomie financière.",
    force:
      "Vous semblez relativement alignés sur la manière d’aborder l’argent — une ressource rare et précieuse pour le couple.",
    aHigher:
      "{A} se situe nettement plus haut sur la prudence / priorité financière. {B} peut vouloir avancer sur d’autres projets sans attendre « le montant idéal ». Le risque : {A} voit {B} comme pressé(e) ; {B} voit {A} comme frein permanent.",
    bHigher:
      "{B} se situe nettement plus haut sur la prudence / priorité financière. {A} peut accepter davantage de construire progressivement. Sans règles communes, chacun projette des peurs sur l’autre.",
    vigilance:
      "Écart important sur les finances. Ce n’est pas « qui a raison sur l’argent » : c’est clarifier seuils, peurs, projets qui peuvent commencer maintenant vs ceux qui attendent une sécurité minimale.",
    questions: [
      "À partir de quel montant décidons-nous forcément ensemble ?",
      "Qu’est-ce qui me rassure avant une dépense / un engagement important ?",
      "Quels projets peuvent avancer avant d’atteindre l’objectif financier idéal ?",
    ],
    actions: [
      "Rédiger 3 règles financières pour 90 jours (seuil commun, autonomie, revue mensuelle).",
      "Nommer 1 peur d’argent chacun sans se juger.",
    ],
    conflictPattern:
      "L’un parle sécurité / délais ; l’autre parle avancement / vie qui passe — les deux ont peur de perdre quelque chose.",
  },
  famille: {
    measures:
      "Place de la famille / belle-famille : loyautés, limites, fréquentation, décisions sous pression familiale.",
    force:
      "Vous semblez relativement alignés sur la place de la famille dans votre couple — moins de zone grise sur « qui prime ».",
    aHigher:
      "{A} semble plus sensible à la loyauté ou à la présence familiale. {B} peut vouloir plus de frontière couple / famille. Sans accord, l’un se sent trahi, l’autre envahi.",
    bHigher:
      "{B} semble plus sensible à la place de la famille. {A} peut prioriser davantage le couple comme unité première.",
    vigilance:
      "Les tensions famille / belle-famille deviennent explosives si le couple n’a pas de frontière commune. Décidez à deux avant de répondre à la famille.",
    questions: [
      "Quelles décisions doivent rester 100 % couple, même sous pression familiale ?",
      "Comment protégeons-nous le « nous » sans manquer de respect ?",
    ],
    actions: [
      "Écrire 3 règles couple/famille (visite, argent, avis, enfants éventuels).",
    ],
  },
  roles: {
    measures:
      "Répartition des rôles conjugaux : charge mentale, domestique, financière, décisionnelle, émotionnelle.",
    force:
      "Vous semblez relativement d’accord sur la façon de répartir les rôles — ou au moins sur le principe d’équité négociée.",
    aHigher:
      "{A} semble plus structuré(e) ou plus porteur(se) sur certains rôles. {B} peut vivre une répartition différente (implicite). Le risque : charge invisible non reconnue.",
    bHigher:
      "{B} semble plus structuré(e) ou plus porteur(se) sur certains rôles. Clarifiez qui porte quoi — et ce qui doit être redistribué.",
    vigilance:
      "Sans rôles explicites, la frustration s’accumule (« je fais tout » / « tu contrôles tout »). Rendez la charge visible.",
    questions: [
      "Qui porte quoi aujourd’hui (liste réelle) ?",
      "Qu’est-ce qui me fatigue le plus dans la répartition actuelle ?",
    ],
    actions: [
      "Faire une liste à deux des tâches / décisions, puis redistribuer 2 items pour 30 jours.",
    ],
  },
  decision: {
    measures:
      "Comment vous décidez : vitesse, information, qui tranche, seuils, blocages.",
    force:
      "Vous semblez disposer d’une logique de décision relativement compatible — moins de friction sur le « comment on tranche ».",
    aHigher:
      "{A} semble plus à l’aise pour trancher ou accélérer. {B} peut avoir besoin de plus d’infos / de temps. Sans cadre : l’un se sent freiné, l’autre poussé.",
    bHigher:
      "{B} semble plus à l’aise pour accélérer la décision. {A} peut ralentir pour sécuriser. Cadrez : « on décide si on décide aujourd’hui ou dans X jours ».",
    vigilance:
      "Écart de rythme décisionnel. Posez un protocole : options, critères, délai, qui tranche temporairement en cas de blocage.",
    questions: [
      "Sur quels sujets ai-je besoin de plus de temps / d’infos ?",
      "Qui tranche temporairement si on bloque — et jusqu’à quand ?",
    ],
    actions: [
      "Pour la prochaine décision importante : écrire options + critère + date limite.",
    ],
    conflictPattern:
      "Daniel-type : « je sécurise » ; Naomi-type : « on avance » — même amour, rythmes opposés.",
  },
  projet_vie: {
    measures:
      "Direction de vie : où vivre, quand s’engager, famille, timing des grandes étapes, horizons.",
    force:
      "Vous semblez relativement alignés sur la direction générale de votre projet de vie.",
    aHigher:
      "{A} se situe plus haut / plus structuré(e) sur le projet de vie tel que mesuré. {B} peut vouloir un autre rythme ou d’autres priorités d’étapes. Transformez les visions générales en choix datés.",
    bHigher:
      "{B} se situe plus haut sur l’avancée / la clarté du projet de vie. {A} peut prioriser d’autres conditions (sécurité, carrière) avant certaines étapes. Ce n’est pas de l’incompatibilité : c’est un écart de calendrier et de critères.",
    vigilance:
      "Écart structurant sur le projet de vie. Sans dates et critères communs, l’un attend, l’autre presse — et la frustration monte.",
    questions: [
      "Quelles étapes sont non négociables pour moi dans les 24 mois ?",
      "Qu’est-ce qui doit être vrai avant que je me sente prêt(e) pour X ?",
      "Quels projets peuvent commencer maintenant sans attendre le « parfait » ?",
    ],
    actions: [
      "Construire une frise à deux : 6 / 12 / 24 mois (logement, engagement, famille, travail).",
      "Choisir 1 étape à clarifier sous 14 jours avec une date de revue.",
    ],
    conflictPattern:
      "L’un sécurise les fondations ; l’autre veut faire avancer la construction — les deux ont raison partiellement.",
  },
  carriere: {
    measures:
      "Place de la carrière / aspirations : ambition, mobilité, sacrifices, soutien mutuel professionnel.",
    force:
      "Vous semblez relativement alignés sur la place du travail et des aspirations dans votre vie de couple.",
    aHigher:
      "{A} accorde une place plus importante à la progression / stabilité professionnelle. {B} peut vouloir que d’autres projets (couple, famille, vie) ne soient pas repoussés indéfiniment. Nommez le « jusqu’à quand ».",
    bHigher:
      "{B} accorde une place plus importante à la carrière / aspirations. {A} peut craindre que le couple passe après. Clarifiez ce qui est temporaire vs structurel.",
    vigilance:
      "Écart marqué carrière / couple. Sans accord sur les saisons (période d’effort vs période de foyer), l’un se sent seul, l’autre incompris.",
    questions: [
      "Quelle ambition professionnelle est non négociable pour moi ?",
      "Quel sacrifice suis-je prêt(e) / pas prêt(e) à faire pour la carrière de l’autre ?",
      "Jusqu’à quelle date cette priorité carrière reste-t-elle « saison » ?",
    ],
    actions: [
      "Écrire un accord de saison : 6–12 mois, objectifs, et ce qui reste protégé pour le couple.",
    ],
  },
  enfants: {
    measures:
      "Désir, timing et vision de la parentalité / des enfants (y compris « pas d’enfants » ou « plus tard »).",
    force:
      "Vous semblez relativement alignés sur la question des enfants / de la parentalité — un sujet souvent explosif s’il reste flou.",
    aHigher:
      "{A} se situe plus haut sur l’urgence ou la clarté du projet enfants. {B} peut vouloir attendre, d’autres conditions, ou une vision différente. Ce sujet ne se « négocie » pas à la légère : il se clarifie avec respect.",
    bHigher:
      "{B} se situe plus haut sur le projet enfants / parentalité. {A} peut prioriser d’autres étapes avant. L’écart de timing est l’enjeu — pas l’amour.",
    vigilance:
      "Écart important sur enfants / parentalité. C’est un domaine structurant : dates, conditions, et limites personnelles doivent être dites clairement, sans pression humiliante.",
    questions: [
      "Est-ce que je veux des enfants ? Si oui, dans quel horizon ?",
      "Quelles conditions sont indispensables pour moi avant ?",
      "Que se passe-t-il si nos horizons ne se rejoignent pas ?",
    ],
    actions: [
      "Chacun écrit sa position (désir / timing / conditions) puis lecture croisée sans interruption.",
      "Fixer une revue du sujet à une date précise (pas « on verra »).",
    ],
  },
  autonomie: {
    measures:
      "Équilibre entre proximité et espace personnel : amitiés, temps seul, décisions individuelles.",
    force:
      "Vous semblez relativement alignés sur le dosage autonomie / interdépendance.",
    aHigher:
      "{A} semble valoriser davantage l’autonomie. {B} peut avoir besoin de plus de présence. Sans traduction : l’un se sent étouffé, l’autre abandonné.",
    bHigher:
      "{B} semble valoriser davantage l’autonomie. {A} peut chercher plus de fusion / présence.",
    vigilance:
      "Écart autonomie / proximité. Posez des rituels de lien ET des zones d’espace sans culpabilité.",
    questions: [
      "De combien de temps seul(e) ai-je besoin par semaine ?",
      "Qu’est-ce qui me fait me sentir connecté(e) même à distance ?",
    ],
    actions: [
      "Planifier 1 créneau couple + 1 créneau personnel chacun cette semaine.",
    ],
  },
  spiritualite: {
    measures:
      "Place des convictions / spiritualité / pratique dans la vie de couple et les choix.",
    force:
      "Vous semblez relativement alignés sur la place des convictions dans votre vie commune.",
    aHigher:
      "{A} semble accorder plus de poids à la spiritualité / convictions dans les choix. {B} peut vivre cela autrement (plus discret, plus questionnant, ou différent).",
    bHigher:
      "{B} semble accorder plus de poids à la spiritualité / convictions. {A} peut avoir une pratique ou une intensité différente.",
    vigilance:
      "Les écarts de convictions deviennent douloureux s’ils restent non dits, surtout pour mariage, enfants, argent, dimanche / pratiques.",
    questions: [
      "Qu’est-ce qui est non négociable pour moi sur le plan des convictions ?",
      "Comment respectons-nous nos différences sans nous juger ?",
    ],
    actions: [
      "Clarifier 3 points : pratique individuelle, pratique commune, éducation éventuelle des enfants.",
    ],
  },
  limites: {
    measures:
      "Respect des limites, confiance, sécurité relationnelle (non-humiliation, non-contrôle).",
    force:
      "Vos réponses suggèrent une base solide de respect et de sécurité — fondation essentielle du couple.",
    aHigher:
      "{A} se situe plus haut sur la clarté / le respect des limites. {B} peut avoir des seuils différents. Vérifiez que « non » est audible des deux côtés.",
    bHigher:
      "{B} se situe plus haut sur la clarté des limites. {A} peut avoir besoin de plus d’explicite pour se sentir en sécurité.",
    vigilance:
      "Signal de vigilance sur limites / confiance / sécurité. Si apparaît peur, contrôle ou humiliation répétée, priorisez la mise en sécurité et un professionnel. Ce bilan n’est pas un diagnostic.",
    bothLow:
      "Les deux scores sont bas sur limites / sécurité. Ralentissez : respect et sécurité avant tout exercice de communication.",
    questions: [
      "Qu’est-ce qui franchit une limite pour moi ?",
      "Est-ce que je me sens en sécurité pour dire non ?",
    ],
    actions: [
      "Écrire 5 limites personnelles non négociables et les partager.",
      "Si peur ou contrôle : chercher une aide adaptée (pas seulement « mieux communiquer »).",
    ],
  },
}

export function whoHigher(
  d: DimensionPairScore
): "A" | "B" | "balanced" {
  if (d.scoreA - d.scoreB >= 12) return "A"
  if (d.scoreB - d.scoreA >= 12) return "B"
  return "balanced"
}

function fillNames(text: string, names: CoupleNames): string {
  return text.replaceAll("{A}", names.nameA).replaceAll("{B}", names.nameB)
}

export function explainConvergenceMetric(gap: number, convergence: number): string {
  return `La « convergence » mesure à quel point vos scores se rejoignent sur un axe (100 % = écart quasi nul entre vous ; plus l’écart grandit, plus la convergence baisse). Ici : écart ${gap} pts → convergence ${convergence} %. Ce n’est pas une note d’amour : c’est un indicateur d’alignement de réponses.`
}

export function interpretDimension(
  d: DimensionPairScore,
  names: CoupleNames
): {
  measures: string
  data: string
  meaning: string
  notConclude: string
  questions: string[]
  actions: string[]
  conflictPattern?: string
  levelLabel: string
} {
  const lib = DIMENSION_LIBRARY[d.dimension]
  const higher = whoHigher(d)
  const avg = (d.scoreA + d.scoreB) / 2

  let meaning: string
  if (d.status === "convergence" && avg >= 55) {
    meaning = fillNames(lib.force, names)
  } else if (d.status === "vigilance" || avg < 40) {
    meaning =
      avg < 40 && lib.bothLow
        ? fillNames(lib.bothLow, names)
        : fillNames(lib.vigilance, names)
    if (higher === "A") meaning += " " + fillNames(lib.aHigher, names)
    else if (higher === "B") meaning += " " + fillNames(lib.bHigher, names)
  } else if (higher === "A") {
    meaning = fillNames(lib.aHigher, names)
  } else if (higher === "B") {
    meaning = fillNames(lib.bHigher, names)
  } else {
    meaning = `Vos scores sont proches (${d.scoreA} % / ${d.scoreB} %) mais le niveau ou le statut invite à approfondir. ${fillNames(lib.force, names)}`
  }

  const data = `Données — ${d.label} : ${names.nameA} ${d.scoreA} % · ${names.nameB} ${d.scoreB} % · écart ${d.gap} pts · convergence ${d.convergence} % · statut « ${
    d.status === "convergence"
      ? "alignement"
      : d.status === "difference"
        ? "à explorer"
        : "vigilance"
  } ».`

  const levelLabel =
    d.status === "vigilance"
      ? "Vigilance"
      : d.status === "difference"
        ? "À explorer"
        : avg >= 70
          ? "Force"
          : "Alignement"

  return {
    measures: lib.measures,
    data,
    meaning,
    notConclude:
      "Cela ne permet pas de conclure à une incompatibilité, ni à un avenir garanti. C’est une photographie de vos réponses actuelles — matière à clarification.",
    questions: lib.questions,
    actions: lib.actions,
    conflictPattern: lib.conflictPattern
      ? fillNames(lib.conflictPattern, names)
      : undefined,
    levelLabel,
  }
}

export function profileHighlights(
  scoring: { dimensions: DimensionPairScore[] },
  seat: "A" | "B",
  names: CoupleNames
): { highs: DimensionPairScore[]; lows: DimensionPairScore[]; narrative: string[] } {
  const scored = [...scoring.dimensions].sort((x, y) => {
    const sx = seat === "A" ? x.scoreA : x.scoreB
    const sy = seat === "A" ? y.scoreA : y.scoreB
    return sy - sx
  })
  const highs = scored.slice(0, 3)
  const lows = scored.slice(-2).reverse()
  const me = seat === "A" ? names.nameA : names.nameB
  const other = seat === "A" ? names.nameB : names.nameA

  const narrative = [
    `${me}, vos scores les plus élevés portent surtout sur : ${highs.map((d) => d.label).join(", ")}. Ce sont des ressources que vous apportez au couple — des zones où vous êtes plus clair(e), plus engagé(e) ou plus à l’aise.`,
    `Vos scores plus bas concernent notamment : ${lows.map((d) => d.label).join(", ")}. Ce n’est pas une faiblesse morale : c’est souvent un besoin de sécurité, un rythme différent, ou un sujet encore peu clarifié.`,
    `Ce que ${other} gagnerait à comprendre : vos scores élevés ne sont pas des exigences capricieuses ; vos scores bas ne sont pas du désintérêt. Nommez le besoin derrière le chiffre.`,
  ]

  for (const d of highs) {
    const lib = DIMENSION_LIBRARY[d.dimension]
    narrative.push(
      `Sur « ${d.label} » (${seat === "A" ? d.scoreA : d.scoreB} %) : ${fillNames(lib.force, names)}`
    )
  }
  for (const d of lows) {
    const ix = interpretDimension(d, names)
    narrative.push(
      `Sur « ${d.label} » (${seat === "A" ? d.scoreA : d.scoreB} %) — point de vigilance personnelle : ${ix.meaning}`
    )
  }

  return { highs, lows, narrative }
}
