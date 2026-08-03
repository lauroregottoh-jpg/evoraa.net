/**
 * Bibliothèque éditoriale KELIAA — source : docs/Bibliothèque éditoriale.docx
 * Ton : conseiller conjugal, concret, pas citation générique.
 */

export type EditorialCategory =
  | "pensee"
  | "conseil"
  | "question"
  | "verset"
  | "defi"
  | "astuce"
  | "citation"
  | "preparation"
  | "encouragement"
  | "a_mediter"
  | "conseil_coach"
  | "erreur"
  | "conversation"
  | "verset_explique"
  | "saviez_vous"

export type EditorialItem = {
  id: string
  category: EditorialCategory
  /** Libellé affiché (Pensée du jour, Défi, …) */
  label: string
  title?: string
  body: string
  /** Référence biblique ou source courte */
  source?: string
}

export const EDITORIAL_CATEGORY_META: Record<
  EditorialCategory,
  { label: string; short: string }
> = {
  pensee: { label: "Pensée du jour", short: "Pensée" },
  conseil: { label: "Conseil du jour", short: "Conseil" },
  question: { label: "Question de réflexion", short: "Question" },
  verset: { label: "Verset du jour", short: "Verset" },
  defi: { label: "Défi du jour", short: "Défi" },
  astuce: { label: "Astuce relationnelle", short: "Astuce" },
  citation: { label: "Citation KELIAA", short: "Citation" },
  preparation: { label: "Préparation au mariage", short: "Préparation" },
  encouragement: { label: "Encouragement", short: "Encouragement" },
  a_mediter: { label: "À méditer", short: "À méditer" },
  conseil_coach: { label: "Le conseil du coach", short: "Coach" },
  erreur: { label: "Une erreur fréquente", short: "Erreur" },
  conversation: { label: "Idée de conversation", short: "Conversation" },
  verset_explique: { label: "Verset expliqué", short: "Verset +" },
  saviez_vous: { label: "Le saviez-vous ?", short: "Le saviez-vous ?" },
}

function items(
  category: EditorialCategory,
  bodies: Array<string | { title?: string; body: string; source?: string }>
): EditorialItem[] {
  const meta = EDITORIAL_CATEGORY_META[category]
  return bodies.map((raw, i) => {
    if (typeof raw === "string") {
      return {
        id: `${category}-${i + 1}`,
        category,
        label: meta.label,
        body: raw,
      }
    }
    return {
      id: `${category}-${i + 1}`,
      category,
      label: meta.label,
      title: raw.title,
      body: raw.body,
      source: raw.source,
    }
  })
}

/** Rotation pour que l’accueil ne montre pas toujours le même format. */
export const DAILY_CATEGORY_ROTATION: EditorialCategory[] = [
  "pensee",
  "conseil",
  "defi",
  "question",
  "verset",
  "astuce",
  "erreur",
  "conversation",
  "a_mediter",
  "conseil_coach",
  "preparation",
  "encouragement",
  "citation",
  "verset_explique",
  "saviez_vous",
]

export const EDITORIAL_LIBRARY: EditorialItem[] = [
  ...items("pensee", [
    "Tu n'es pas obligé de répondre immédiatement lorsqu'une discussion devient tendue. Si tu sens que la colère monte, prends quelques minutes pour retrouver ton calme. Une réponse donnée avec sérénité construit souvent davantage qu'une réponse donnée rapidement.",
    "Lorsque ton partenaire te parle d'un problème, demande-toi d'abord s'il attend une solution... ou simplement une oreille attentive. Beaucoup de malentendus naissent parce que l'on répond à une question qui n'a jamais été posée.",
    "Tu peux aimer profondément quelqu'un et pourtant mal communiquer avec lui. Aimer ne dispense pas d'apprendre à écouter, à s'exprimer clairement et à reconnaître ses erreurs. Ces compétences s'acquièrent avec le temps.",
    "Fais attention aux petites phrases prononcées sous le coup de la fatigue ou de la frustration. On oublie parfois pourquoi une dispute a commencé, mais certaines paroles restent gravées longtemps.",
    "Avant de corriger ton partenaire aujourd'hui, prends quelques instants pour reconnaître ce qu'il fait déjà de bien. Les encouragements ouvrent souvent davantage le cœur que les critiques.",
    "Si une discussion tourne toujours autour du même sujet, ce n'est peut-être pas parce que le problème est grand. C'est parfois parce que chacun défend son point de vue sans chercher à comprendre celui de l'autre.",
    "Ne laisse pas les suppositions prendre la place des conversations. Si quelque chose t'inquiète, demande avec douceur plutôt que d'imaginer le pire.",
    "Le téléphone peut attendre quelques minutes. Les personnes que tu aimes, elles, ont besoin de sentir qu'elles comptent vraiment lorsque tu es avec elles.",
    "Lorsque ton partenaire fait un effort, même petit, prends le temps de le remarquer. Une personne encouragée aura souvent envie de continuer.",
    "Il est normal de ne pas être d'accord. Ce qui compte, c'est de rester respectueux pendant le désaccord. La manière dont vous traversez les tensions façonne votre relation bien plus que les tensions elles-mêmes.",
    "Avant de conclure que ton partenaire ne te comprend pas, demande-lui ce qu'il a réellement compris de ce que tu voulais dire. Beaucoup de conflits naissent simplement d'un malentendu.",
    "Si quelque chose t'a blessé aujourd'hui, parle-en avant que le silence ne transforme cette blessure en rancœur.",
    "Il est plus facile de corriger une mauvaise habitude au début que de réparer les conséquences qu'elle laissera avec le temps.",
    "Prends l'habitude de remercier ton partenaire pour les petites choses du quotidien. Ce qui devient habituel finit souvent par passer inaperçu.",
    "Tu n'as pas besoin d'être d'accord sur tout. En revanche, vous avez besoin d'apprendre à vous écouter jusqu'au bout.",
    "Lorsque la colère monte, choisis de ralentir la conversation plutôt que de l'accélérer. Quelques minutes de calme peuvent éviter des paroles que tu regretteras.",
    "Ne laisse pas ton partenaire deviner ce que tu ressens. Exprime-le avec simplicité et respect.",
    "Aujourd'hui, demande-toi : est-ce que je passe plus de temps à relever les erreurs de mon partenaire qu'à reconnaître ses qualités ?",
    "Les excuses sincères réparent souvent plus qu'elles n'humilient.",
    "Un couple ne grandit pas uniquement grâce aux bons moments. Les difficultés traversées avec maturité renforcent aussi la confiance.",
    "Lorsque ton partenaire te parle, pose ton téléphone quelques minutes. Ce geste paraît simple, mais il envoie un message fort : « Tu es important pour moi. »",
    "Avant de répondre, vérifie que tu as bien compris ce que l'autre voulait dire. Répondre à une mauvaise interprétation ne résout jamais le problème.",
    "Les habitudes que vous construisez aujourd'hui façonneront votre relation de demain.",
    "Un compliment sincère peut changer l'ambiance d'une journée entière.",
    "Si une même dispute revient régulièrement, ne cherchez plus seulement à savoir qui a raison. Cherchez ce qui n'a jamais été vraiment résolu.",
    "La confiance grandit lorsque les paroles et les actes vont dans la même direction.",
    "Il est parfois plus courageux de reconnaître son tort que de défendre son orgueil.",
    "N'attends pas une occasion spéciale pour montrer ton affection. Les gestes simples sont souvent ceux dont on se souvient le plus.",
    "Ne compare jamais ton histoire à celle des autres. Tu ignores les combats que chacun traverse.",
    "Lorsque tu sens que la fatigue influence tes réactions, reporte la discussion si c'est possible. On réfléchit rarement bien lorsqu'on est épuisé.",
    "Apprends à poser des questions avec bienveillance plutôt que des accusations. Une question ouvre le dialogue. Une accusation le ferme.",
    "Ton partenaire n'a pas besoin que tu sois parfait. Il a besoin de savoir qu'il peut compter sur toi.",
    "Chaque désaccord est une occasion d'apprendre quelque chose sur l'autre... à condition d'accepter de l'écouter.",
    "Les paroles prononcées sous le coup de la colère peuvent laisser des traces bien après la fin de la dispute. Choisis-les avec soin.",
    "Aujourd'hui, prends quelques minutes pour demander à ton partenaire comment il va... et écoute vraiment sa réponse.",
    "Avant de chercher à être aimé, demande-toi si tu exprimes clairement ton amour au quotidien.",
    "Il est normal d'avoir des différences. Ce qui compte, c'est la manière dont vous choisissez de les vivre ensemble.",
    "Le pardon ne change pas le passé, mais il peut empêcher le passé de contrôler votre avenir.",
    "Prends quelques instants aujourd'hui pour dire à ton partenaire ce que tu apprécies chez lui. Les paroles d'encouragement ne sont jamais perdues.",
  ]),

  ...items("conseil", [
    "Aujourd'hui, remercie ton partenaire pour une qualité que tu apprécies chez lui.",
    "Pose une question sincère et écoute sans interrompre.",
    "Évite de répondre sous le coup de l'émotion.",
    "Trouvez dix minutes sans téléphone pour simplement discuter.",
    "Exprime clairement ce dont tu as besoin au lieu d'espérer que l'autre le devine.",
    "Souris davantage : la tendresse commence souvent par un regard.",
    "Demande pardon rapidement lorsque tu reconnais une erreur.",
    "Encourage ton partenaire dans un projet qui lui tient à cœur.",
    "Fais un compliment précis plutôt qu'un compliment général.",
    "Choisis aujourd'hui la douceur plutôt que la réaction impulsive.",
    "Prie pour ton couple avant de chercher à changer l'autre.",
    "N'oublie pas de dire « merci ».",
    "Ne laisse pas une journée entière se terminer dans le silence après un conflit.",
    "Cherche d'abord à comprendre avant d'être compris.",
    "Offre une attention inattendue aujourd'hui.",
  ]),

  ...items("question", [
    "Est-ce que je fais sentir à mon partenaire qu'il est aimé ?",
    "Qu'est-ce que je pourrais améliorer dans ma manière de communiquer ?",
    "Est-ce que je célèbre davantage les qualités que je critique les défauts ?",
    "Quand ai-je exprimé de la gratitude pour la dernière fois ?",
    "Est-ce que j'écoute vraiment ou est-ce que j'attends simplement mon tour pour parler ?",
    "Mon partenaire se sent-il en sécurité émotionnellement avec moi ?",
    "Est-ce que mes paroles apportent la paix ?",
    "Quelle habitude pourrait améliorer notre relation ?",
    "Suis-je prêt à demander pardon lorsque c'est nécessaire ?",
    "Qu'est-ce qui nourrit notre complicité aujourd'hui ?",
    "Qu'est-ce qui fait que je me sens aimé dans cette relation ?",
    "Est-ce que mon partenaire connaît vraiment mes attentes ?",
    "Quelle qualité de mon partenaire est-ce que je néglige parfois ?",
    "Ai-je pris le temps d'encourager mon partenaire cette semaine ?",
    "Si nous devions résoudre un seul problème ce mois-ci, lequel améliorerait le plus notre relation ?",
    "Est-ce que je critique plus que je n'encourage ?",
    "Quelle habitude aimerais-je construire avec mon partenaire ?",
    "Est-ce que je prends le temps de demander pardon lorsque je me trompe ?",
  ]),

  ...items("verset", [
    {
      body: "Par-dessus tout, revêtez-vous de l'amour, qui est le lien de la perfection.",
      source: "Colossiens 3:14",
    },
    {
      body: "L'amour est patient, il est plein de bonté.",
      source: "1 Corinthiens 13:4",
    },
    {
      body: "Supportez-vous les uns les autres avec amour.",
      source: "Éphésiens 4:2",
    },
    { body: "Deux valent mieux qu'un.", source: "Ecclésiaste 4:9" },
    {
      body: "Que tout ce que vous faites soit fait avec amour.",
      source: "1 Corinthiens 16:14",
    },
    {
      body: "Réjouissez-vous avec ceux qui se réjouissent.",
      source: "Romains 12:15",
    },
    {
      body: "Soyez bons les uns envers les autres.",
      source: "Éphésiens 4:32",
    },
    {
      body: "La réponse douce calme la fureur.",
      source: "Proverbes 15:1",
    },
    { body: "Marchez dans l'amour.", source: "Éphésiens 5:2" },
    {
      body: "Aimez-vous les uns les autres.",
      source: "Jean 13:34",
    },
  ]),

  ...items("defi", [
    "Fais rire ton partenaire aujourd'hui.",
    "Écris un message d'encouragement.",
    "Remercie Dieu pour trois qualités de ton conjoint ou de la personne que tu fréquentes.",
    "Passe un repas sans téléphone.",
    "Prends cinq minutes pour prier ensemble.",
    "Fais un câlin plus long que d'habitude — ou, en fréquentation, un message chaleureux et respectueux.",
    "Souviens-toi d'un beau souvenir vécu ensemble.",
    "Demande : « Comment puis-je mieux t'aimer aujourd'hui ? »",
    "Offre un geste de service sans qu'on te le demande.",
    "Termine la journée par une parole positive.",
    "Aujourd'hui, prenez dix minutes pour discuter sans téléphone, sans télévision et sans aucune distraction. Posez-vous simplement cette question : « Comment s'est passée ta journée ? » Écoutez jusqu'au bout, sans interrompre.",
    "Écrivez un petit mot de gratitude à votre partenaire. Pas un long texte. Une ou deux phrases suffisent, à condition qu'elles soient sincères.",
    "Prenez l'initiative d'organiser un moment à deux cette semaine, même s'il ne dure qu'une demi-heure.",
    "Aujourd'hui, faites un compliment sur une qualité de caractère plutôt que sur l'apparence physique.",
    "Pendant toute une journée, interdisez-vous les reproches. Si quelque chose vous dérange, transformez-le en demande respectueuse.",
  ]),

  ...items("astuce", [
    "Les couples qui rient ensemble traversent souvent mieux les périodes difficiles.",
    "Une bonne communication commence par une bonne écoute.",
    "Les petites habitudes quotidiennes renforcent plus un couple que les grandes promesses.",
    "La comparaison est l'ennemie de la gratitude.",
    "La confiance se nourrit de cohérence.",
    "Les désaccords sont normaux ; le manque de respect ne l'est pas.",
    "Une relation grandit lorsque chacun accepte d'apprendre.",
    "Dire la vérité avec amour vaut mieux que cacher ses émotions.",
    "Le pardon libère davantage celui qui pardonne que celui qui est pardonné.",
    "Les meilleurs couples restent des coéquipiers, même pendant les conflits.",
  ]),

  ...items("citation", [
    "Une relation durable se construit avant le mariage, pas seulement après.",
    "La compatibilité se travaille autant qu'elle se découvre.",
    "L'amour grandit là où chacun choisit d'investir.",
    "Avant de chercher la bonne personne, deviens une bonne personne.",
    "La maturité émotionnelle est un cadeau que l'on offre à son couple.",
    "Les fondations invisibles déterminent la solidité du futur mariage.",
    "Une conversation sincère vaut mieux qu'une longue période de suppositions.",
    "Le bonheur d'un couple est rarement le fruit du hasard.",
    "Chaque relation mérite du temps, de la patience et de la bienveillance.",
    "Les couples les plus solides continuent d'apprendre l'un de l'autre.",
  ]),

  ...items("preparation", [
    "Le mariage ne résout pas les problèmes de communication ; il les révèle.",
    "Parlez de vos valeurs avant de parler de la cérémonie.",
    "Les attentes non exprimées deviennent souvent des frustrations.",
    "Apprenez à gérer les désaccords avant de vivre sous le même toit.",
    "Construisez une vision commune de votre avenir.",
    "La confiance se prépare avant le mariage.",
    "Les habitudes d'aujourd'hui deviendront les habitudes de demain.",
    "La transparence protège la relation.",
    "Prenez le temps de connaître vos différences.",
    "L'engagement est plus fort lorsqu'il repose sur une connaissance profonde de l'autre.",
  ]),

  ...items("encouragement", [
    "Chaque effort sincère compte.",
    "Aucun couple n'est parfait, mais chaque couple peut progresser.",
    "Les difficultés ne définissent pas votre histoire.",
    "Continuez à apprendre à vous aimer.",
    "Dieu peut restaurer ce qui semble fragile.",
    "Ne perdez jamais le goût de vous découvrir.",
    "Votre relation mérite du temps et de l'attention.",
    "L'amour grandit lorsque chacun choisit d'aimer, même dans les jours ordinaires.",
    "Les plus belles relations sont bâties avec patience.",
    "Aujourd'hui est une belle occasion de renforcer votre histoire.",
  ]),

  ...items("a_mediter", [
    {
      title: "Racontez-vous vos journées",
      body: "Prenez l'habitude de vous raconter vos journées. Il ne s'agit pas seulement de dire ce que vous avez fait. Prenez aussi le temps de partager ce que vous avez ressenti, ce qui vous a marqué ou ce qui vous a préoccupé. C'est souvent dans ces échanges ordinaires que naît une véritable intimité.",
    },
    {
      title: "Les non-dits",
      body: "Les non-dits finissent rarement par disparaître. On espère parfois qu'un sujet délicat se réglera avec le temps. Pourtant, ce qui n'est jamais exprimé finit souvent par ressortir au mauvais moment. Choisissez un moment calme pour parler des sujets importants avant qu'ils ne deviennent des sources de tension.",
    },
    {
      title: "Avant la crise",
      body: "N'attendez pas une crise pour prendre soin de votre relation. Les couples solides ne se parlent pas seulement lorsqu'il y a un problème. Ils prennent aussi le temps d'entretenir leur complicité lorsque tout va bien.",
    },
    {
      title: "Reconnaître les efforts",
      body: "Apprenez à reconnaître les efforts. Votre partenaire ne fait peut-être pas tout parfaitement, mais remarquez-vous les progrès qu'il fait ? Un encouragement sincère donne souvent envie de continuer à avancer.",
    },
    {
      title: "Vous n'êtes pas adversaires",
      body: "Lorsqu'un problème apparaît, évitez de vous placer l'un contre l'autre. Le véritable défi n'est pas de savoir qui gagne la discussion, mais comment vous pouvez résoudre le problème ensemble.",
    },
  ]),

  ...items("conseil_coach", [
    {
      title: "Écoutez sans préparer votre réponse",
      body: "Pendant une conversation, concentrez-vous uniquement sur ce que votre partenaire veut vous dire. Résistez à l'envie de répondre immédiatement. Vous serez surpris de tout ce que vous comprendrez simplement en écoutant jusqu'au bout.",
    },
    {
      title: "Remerciez pour quelque chose de précis",
      body: "Au lieu de dire simplement « merci », soyez plus précis : « Merci d'avoir pris le temps de m'appeler aujourd'hui » ou « Merci de m'avoir soutenu cette semaine ». Les remerciements précis touchent davantage.",
    },
    {
      title: "Faites une pause avant une discussion importante",
      body: "Si vous êtes fatigué, stressé ou en colère, il est parfois préférable de reporter une conversation importante de quelques heures plutôt que de la vivre dans de mauvaises conditions.",
    },
    {
      title: "Posez une question de plus",
      body: "Lorsque votre partenaire partage quelque chose, posez une question supplémentaire. Cela montre que vous vous intéressez réellement à ce qu'il vit.",
    },
  ]),

  ...items("erreur", [
    {
      title: "Penser que l'autre sait déjà ce que vous ressentez",
      body: "Même après plusieurs années de relation, personne ne lit dans les pensées. Si quelque chose vous touche, dites-le avec calme. Attendre que l'autre devine conduit souvent à des déceptions inutiles.",
    },
    {
      title: "Confondre écouter et répondre",
      body: "Beaucoup de personnes pensent écouter alors qu'elles préparent déjà leur prochaine réponse. Une véritable écoute consiste à chercher d'abord à comprendre avant de vouloir convaincre.",
    },
    {
      title: "Reporter les conversations importantes",
      body: "Plus une situation attend, plus elle devient difficile à aborder. Les petits sujets réglés rapidement évitent souvent les grandes disputes.",
    },
  ]),

  ...items("conversation", [
    {
      title: "Un souvenir qui fait sourire",
      body: "Demandez à votre partenaire : « Quel est le souvenir de nous deux qui te fait encore sourire aujourd'hui ? » Prenez le temps d'écouter sa réponse, puis partagez la vôtre.",
    },
    {
      title: "Se sentir aimé(e)",
      body: "Posez cette question : « Y a-t-il une chose que je pourrais faire plus souvent pour te faire sentir aimé(e) ? » Écoutez sans vous justifier. Remerciez simplement pour sa confiance.",
    },
    {
      title: "Une habitude à améliorer",
      body: "Essayez cette discussion : « Si nous pouvions améliorer une seule habitude dans notre relation cette année, laquelle choisirais-tu ? »",
    },
  ]),

  ...items("verset_explique", [
    {
      title: "Éphésiens 4:32",
      body: "« Soyez bons les uns envers les autres, compatissants, vous pardonnant réciproquement. » Le pardon ne consiste pas à dire que ce qui s'est passé était acceptable. Il consiste à choisir de ne pas laisser la blessure diriger la suite de votre relation. C'est un chemin qui demande parfois du temps, mais chaque pas vers le pardon ouvre davantage de place à la paix.",
      source: "Éphésiens 4:32",
    },
  ]),

  ...items("saviez_vous", [
    {
      title: "La gratitude relationnelle",
      body: "Les chercheurs observent que les couples qui expriment régulièrement leur reconnaissance l'un envers l'autre déclarent, en moyenne, un niveau de satisfaction relationnelle plus élevé. Dire « merci » ne résout pas tous les problèmes, mais la gratitude aide à ne pas réduire l'autre à ses défauts.",
    },
  ]),
]

export function getEditorialByCategory(category: EditorialCategory): EditorialItem[] {
  return EDITORIAL_LIBRARY.filter((i) => i.category === category)
}

export function dayOfYearUTC(date = new Date()): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0)
  const now = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  return Math.floor((now - start) / 86_400_000)
}

export function pickFromCategory(
  category: EditorialCategory,
  seed: number
): EditorialItem {
  const pool = getEditorialByCategory(category)
  if (pool.length === 0) {
    return EDITORIAL_LIBRARY[seed % EDITORIAL_LIBRARY.length]
  }
  return pool[Math.abs(seed) % pool.length]
}

export type DailyEditorialPack = {
  primary: EditorialItem
  dayIndex: number
}

/** Un seul contenu par jour — le format alterne (pensée, conseil, défi…). */
export function getDailyEditorialPack(date = new Date()): DailyEditorialPack {
  const dayIndex = dayOfYearUTC(date)
  const primaryCat =
    DAILY_CATEGORY_ROTATION[dayIndex % DAILY_CATEGORY_ROTATION.length]

  return {
    dayIndex,
    primary: pickFromCategory(primaryCat, dayIndex * 3 + 1),
  }
}

/**
 * Aperçu limité de la bibliothèque (10–15 contenus).
 * Le reste se découvre au fil des jours via « aujourd’hui ».
 */
export function getBrowsableEditorialPreview(limit = 12): EditorialItem[] {
  const quotas: Partial<Record<EditorialCategory, number>> = {
    pensee: 2,
    conversation: 2,
    astuce: 2,
    conseil: 2,
    defi: 1,
    question: 1,
    verset: 1,
    encouragement: 1,
  }
  const out: EditorialItem[] = []
  for (const [cat, n] of Object.entries(quotas) as Array<[EditorialCategory, number]>) {
    const pool = getEditorialByCategory(cat)
    for (let i = 0; i < Math.min(n, pool.length); i++) {
      out.push(pool[i])
      if (out.length >= limit) return out
    }
  }
  return out.slice(0, limit)
}

export const EDITORIAL_FILTERS: Array<{ id: EditorialCategory | "all"; label: string }> = [
  { id: "all", label: "Tout" },
  { id: "pensee", label: "Pensées" },
  { id: "conseil", label: "Conseils" },
  { id: "conversation", label: "Conversations" },
  { id: "astuce", label: "Astuces" },
  { id: "defi", label: "Défis" },
  { id: "question", label: "Questions" },
  { id: "verset", label: "Versets" },
]
