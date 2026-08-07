/**
 * Formulations officielles — DOSSIER RAPPORT §4 (sélection locale, pas de LLM).
 */

const INTRODUCTIONS = [
  "Merci d’avoir pris le temps de réaliser votre bilan. Les résultats qui suivent vous offrent un aperçu de votre fonctionnement relationnel actuel.",
  "Ce rapport a été conçu pour vous aider à mieux comprendre votre profil relationnel et à identifier des pistes de progression concrètes.",
  "Les réponses que vous avez fournies permettent de mettre en lumière vos principaux points forts ainsi que les domaines pouvant être développés.",
  "Ce bilan constitue une invitation à mieux vous connaître afin de construire des relations plus saines et plus équilibrées.",
  "Les résultats présentés ci-dessous reflètent votre fonctionnement actuel au regard des réponses que vous avez données.",
]

const CONCLUSIONS = [
  "Ce bilan vous offre une meilleure compréhension de votre fonctionnement relationnel actuel. En mettant progressivement en pratique les recommandations proposées, vous pourrez renforcer les compétences qui favoriseront des relations plus harmonieuses.",
  "Les résultats présentés dans ce rapport constituent une base de réflexion pour votre développement personnel. Chaque axe de progression représente une opportunité de grandir et de construire des relations plus solides.",
  "Ce rapport met en lumière vos forces ainsi que les domaines qui méritent davantage d’attention. L’essentiel est d’avancer avec constance, bienveillance envers vous-même et volonté de progresser.",
  "Votre profil montre que vous disposez déjà de nombreuses ressources. Les recommandations proposées vous aideront à continuer votre évolution et à développer des relations plus équilibrées.",
  "Ce bilan n’est pas une étiquette, mais un outil de compréhension. Utilisez-le comme un guide pour orienter vos prochains pas et poursuivre votre croissance relationnelle.",
]

const ENCOURAGEMENTS = [
  "Chaque progrès, même modeste, contribue à construire des relations plus équilibrées.",
  "Les compétences relationnelles se développent avec le temps, la pratique et la volonté de progresser.",
  "Ce rapport constitue un point de départ, non une finalité.",
  "Les résultats obtenus aujourd’hui ne déterminent pas votre avenir ; ils vous indiquent simplement des pistes de progression.",
  "Continuez à avancer à votre rythme en mettant en pratique les recommandations les plus adaptées à votre situation.",
  "Chaque effort réalisé aujourd’hui prépare les relations que vous construirez demain.",
  "Les changements durables commencent souvent par de petites actions répétées avec régularité.",
  "Vous possédez déjà des ressources sur lesquelles vous pourrez vous appuyer pour évoluer.",
]

const HIGH_SCORE = [
  "Ce résultat constitue l’un de vos principaux points forts.",
  "Cette dimension apparaît particulièrement développée.",
  "Vous semblez disposer de solides ressources dans ce domaine.",
]

const MID_SCORE = [
  "Cette compétence est présente mais peut encore être renforcée.",
  "Les bases sont encourageantes et méritent d’être consolidées.",
  "Cette dimension présente un bon potentiel d’évolution.",
]

const LOW_SCORE = [
  "Cette dimension constitue actuellement un axe de progression prioritaire.",
  "Les résultats montrent qu’une attention particulière pourrait être portée à ce domaine.",
  "Ce résultat ne représente pas une limite définitive mais une opportunité de progression.",
]

function pick<T>(list: T[], seed: number): T {
  return list[Math.abs(seed) % list.length]
}

function seedFrom(input: string): number {
  let h = 0
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) | 0
  return h
}

export function pickIntroduction(seedKey: string): string {
  return pick(INTRODUCTIONS, seedFrom(seedKey + ":intro"))
}

export function pickConclusion(seedKey: string): string {
  return pick(CONCLUSIONS, seedFrom(seedKey + ":outro"))
}

export function pickEncouragement(seedKey: string): string {
  return pick(ENCOURAGEMENTS, seedFrom(seedKey + ":enc"))
}

export function pickScorePhrase(
  band: "force" | "mid" | "low",
  seedKey: string
): string {
  if (band === "force") return pick(HIGH_SCORE, seedFrom(seedKey + ":hi"))
  if (band === "mid") return pick(MID_SCORE, seedFrom(seedKey + ":mid"))
  return pick(LOW_SCORE, seedFrom(seedKey + ":lo"))
}
