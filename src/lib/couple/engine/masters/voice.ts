/**
 * Voix éditoriale Premium — slots inspirés du document maître Daniel & Naomi.
 * Jamais un copier-coller figé : les slots sont remplis par harmonize.
 */

export type VoiceSlots = {
  nameA: string
  nameB: string
  globalScore: number
  scoreTitle: string
  contextLabel: string
  dynamicsTitle: string
  dynamicsBody: string[]
  forceLabels: string[]
  priorityLabels: string[]
  securizerName: string
  advancerName: string
}

export function contextLabel(
  ctx: string
): string {
  switch (ctx) {
    case "interet":
      return "vous commencez à explorer votre compatibilité"
    case "fiançailles":
      return "vous êtes fiancés et envisagez une nouvelle étape"
    case "mariage_recent":
      return "vous êtes récemment mariés"
    case "mariage_etabli":
      return "vous construisez déjà une vie commune établie"
    default:
      return "vous êtes en cheminement de couple"
  }
}

export function welcomeParagraphs(v: VoiceSlots): string[] {
  return [
    `${v.nameA} et ${v.nameB}, ${v.contextLabel}. Cette étape fait apparaître des questions que l’amour, à lui seul, ne permet pas toujours de résoudre : projets communs, finances, carrière, familles, décisions à prendre ensemble. KELIAA COUPLE™ ne cherche pas simplement à vous dire si vous vous ressemblez. Il cherche à comprendre comment vos deux fonctionnements se rencontrent, ce qui vous donne une base solide, et les endroits où vos attentes, besoins ou rythmes peuvent se croiser de manière plus délicate.`,
    `Une différence n’est pas nécessairement un problème, tout comme une grande ressemblance ne garantit pas que tout sera simple. Ce qui compte, c’est de comprendre ce que ces convergences et ces différences peuvent produire dans votre vie réelle — et ce que vous pouvez choisir d’en faire.`,
    `Votre rapport a été pensé comme un espace de réflexion à deux. Vous allez d’abord découvrir ce qui ressort de vos profils individuels, puis ce qui se passe lorsque ces profils sont mis en relation. Vous trouverez ensuite les domaines qui méritent votre attention, avec explications, exercices et recommandations concrètes.`,
  ]
}

export function howToReadParagraphs(v: VoiceSlots): string[] {
  return [
    `Ce rapport n’est pas destiné à être parcouru rapidement jusqu’à la dernière page. Certaines informations vous sembleront évidentes ; d’autres mettront des mots sur des situations que vous avez vécues sans toujours réussir à les expliquer. Lisez d’abord les passages qui concernent chacun de vous sans chercher immédiatement à répondre ou à vous défendre.`,
    `Nous vous recommandons de ne pas commencer par les différences. Votre couple possède déjà des ressources. Les identifier vous permet de comprendre que les sujets qui demandent du travail ne définissent pas toute votre relation.`,
    `Si un passage provoque une réaction forte, notez ce que vous ressentez avant de chercher à « résoudre ». Les exercices proposés ensuite servent à transformer une prise de conscience en conversation concrète.`,
  ]
}

export function regardParagraphs(v: VoiceSlots): string[] {
  const forces =
    v.forceLabels.length > 0
      ? v.forceLabels.join(", ")
      : "plusieurs convergences utiles"
  const prios =
    v.priorityLabels.length > 0
      ? v.priorityLabels.join(", ")
      : "quelques sujets à clarifier"
  return [
    `Votre score global ressort à ${v.globalScore} %. Ce résultat donne une indication sur la proximité observée entre vos réponses, mais ce n’est pas une note attribuée à la qualité de votre relation. Deux couples au même chiffre peuvent avoir des réalités totalement différentes. Dans votre cas, l’intérêt se trouve dans la combinaison entre vos convergences et les écarts qui apparaissent sur certains domaines.`,
    `Lecture du bilan : « ${v.scoreTitle} ». Vos appuis les plus nets incluent notamment : ${forces}.`,
    `Les domaines qui ressortent avec davantage d’intensité : ${prios}. Pris séparément, ils peuvent sembler distincts. Observés ensemble, une dynamique commune apparaît souvent : ${v.securizerName} semble davantage avoir besoin de sécuriser avant d’avancer, tandis que ${v.advancerName} semble davantage avoir besoin de sentir que les choses avancent réellement. Cette différence de rythme peut devenir une source de frustration si elle reste implicite — ou une complémentarité si vous apprenez à la nommer.`,
  ]
}
