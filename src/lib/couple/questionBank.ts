/**
 * Banque questionnaire KELYA COUPLE™ v1.0.0
 * Structure alignée sur docs/KELIAA COUPLE TM/03_BANQUE_QUESTIONS.md
 * V1 produit : 3 items × 18 dimensions (extensible sans changer le scoring).
 */

export type CoupleDimensionId =
  | "vision_couple"
  | "valeurs"
  | "mariage"
  | "communication"
  | "conflits"
  | "emotions"
  | "affection"
  | "intimite"
  | "finances"
  | "famille"
  | "roles"
  | "decision"
  | "projet_vie"
  | "carriere"
  | "enfants"
  | "autonomie"
  | "spiritualite"
  | "limites"

export type CoupleQuestionType = "LIKERT" | "COUPLE_PERCEPTION"

export type CoupleQuestion = {
  id: string
  dimension: CoupleDimensionId
  text: string
  type: CoupleQuestionType
  /** Si true, un écart fort peut alimenter un flag de vigilance sécurité (sans diagnostic). */
  safetyRelevant?: boolean
}

export const COUPLE_DIMENSION_META: Record<
  CoupleDimensionId,
  { label: string; order: number }
> = {
  vision_couple: { label: "Vision du couple", order: 1 },
  valeurs: { label: "Valeurs fondamentales", order: 2 },
  mariage: { label: "Vision du mariage", order: 3 },
  communication: { label: "Communication", order: 4 },
  conflits: { label: "Gestion des conflits", order: 5 },
  emotions: { label: "Fonctionnement émotionnel", order: 6 },
  affection: { label: "Affection et proximité", order: 7 },
  intimite: { label: "Intimité", order: 8 },
  finances: { label: "Finances", order: 9 },
  famille: { label: "Famille et belle-famille", order: 10 },
  roles: { label: "Rôles conjugaux", order: 11 },
  decision: { label: "Prise de décision", order: 12 },
  projet_vie: { label: "Projet de vie", order: 13 },
  carriere: { label: "Carrière et aspirations", order: 14 },
  enfants: { label: "Enfants et parentalité", order: 15 },
  autonomie: { label: "Autonomie et interdépendance", order: 16 },
  spiritualite: { label: "Spiritualité et convictions", order: 17 },
  limites: { label: "Limites, confiance et sécurité", order: 18 },
}

const LIKERT_OPTIONS = [
  { id: "1", label: "Pas du tout d’accord", value: 1 },
  { id: "2", label: "Plutôt pas d’accord", value: 2 },
  { id: "3", label: "Ni d’accord ni pas d’accord", value: 3 },
  { id: "4", label: "Plutôt d’accord", value: 4 },
  { id: "5", label: "Tout à fait d’accord", value: 5 },
] as const

export function getCoupleLikertOptions() {
  return LIKERT_OPTIONS
}

function q(
  id: string,
  dimension: CoupleDimensionId,
  text: string,
  type: CoupleQuestionType = "LIKERT",
  safetyRelevant?: boolean
): CoupleQuestion {
  return { id, dimension, text, type, safetyRelevant }
}

/** Banque active — mêmes questions pour les deux participants. */
export const COUPLE_QUESTIONS: CoupleQuestion[] = [
  q("VIS-001", "vision_couple", "Je considère notre relation comme un projet que nous devons construire ensemble."),
  q("VIS-002", "vision_couple", "Nous avons une vision suffisamment claire de ce que nous voulons construire à deux."),
  q("VIS-003", "vision_couple", "Notre couple a une direction commune, même si nos styles diffèrent.", "COUPLE_PERCEPTION"),

  q("VAL-001", "valeurs", "Nos valeurs essentielles se rejoignent sur l’essentiel."),
  q("VAL-002", "valeurs", "Le respect mutuel est une base non négociable dans notre relation."),
  q("VAL-003", "valeurs", "Nous partageons une vision proche de ce qui est juste et important dans la vie."),

  q("MAR-001", "mariage", "Le mariage (ou une alliance durable) fait partie de notre projet commun."),
  q("MAR-002", "mariage", "Nous avons déjà parlé concrètement de ce que signifierait nous engager."),
  q("MAR-003", "mariage", "Je me sens prêt(e) à construire une vie à deux sur le long terme."),

  q("COM-001", "communication", "Je peux exprimer mes besoins sans craindre d’être mal compris(e)."),
  q("COM-002", "communication", "Nous savons parler des sujets sensibles sans tout casser."),
  q("COM-003", "communication", "Mon partenaire m’écoute réellement quand j’exprime quelque chose d’important.", "COUPLE_PERCEPTION"),

  q("CNF-001", "conflits", "Face à un désaccord, je cherche plutôt à comprendre qu’à gagner."),
  q("CNF-002", "conflits", "Nous savons réparer après une dispute."),
  q("CNF-003", "conflits", "Les conflits dans notre couple restent gérables et respectueux.", "COUPLE_PERCEPTION"),

  q("EMO-001", "emotions", "Je me sens en sécurité pour partager mes émotions dans le couple."),
  q("EMO-002", "emotions", "Je sais reconnaître ce que je ressens avant de réagir."),
  q("EMO-003", "emotions", "Mon partenaire accueille mes émotions sans les minimiser.", "COUPLE_PERCEPTION"),

  q("AFF-001", "affection", "Nous exprimons régulièrement de l’affection (mots, gestes, présence)."),
  q("AFF-002", "affection", "Je me sens aimé(e) dans notre quotidien."),
  q("AFF-003", "affection", "La proximité affective est nourrie des deux côtés.", "COUPLE_PERCEPTION"),

  q("INT-001", "intimite", "Nous pouvons parler d’intimité avec respect et clarté."),
  q("INT-002", "intimite", "Je me sens respecté(e) dans mon rythme et mes limites intimes."),
  q("INT-003", "intimite", "Notre complicité intime est un sujet que nous pouvons aborder sans honte.", "COUPLE_PERCEPTION"),

  q("FIN-001", "finances", "Nous avons une vision compatible de l’argent et des priorités financières."),
  q("FIN-002", "finances", "Je me sens à l’aise pour parler d’argent avec mon partenaire."),
  q("FIN-003", "finances", "Les décisions financières importantes se prennent dans un esprit d’équipe.", "COUPLE_PERCEPTION"),

  q("FAM-001", "famille", "Nous savons poser des limites saines avec nos familles."),
  q("FAM-002", "famille", "Je me sens soutenu(e) par mon partenaire face aux pressions familiales."),
  q("FAM-003", "famille", "La place de nos familles dans notre couple est claire et respectueuse.", "COUPLE_PERCEPTION"),

  q("ROL-001", "roles", "Nous discutons des rôles et responsabilités sans rigidité injuste."),
  q("ROL-002", "roles", "Je me sens équitablement considéré(e) dans la répartition du quotidien."),
  q("ROL-003", "roles", "Nos attentes sur les rôles conjugaux sont suffisamment alignées.", "COUPLE_PERCEPTION"),

  q("DEC-001", "decision", "Les décisions importantes se prennent à deux."),
  q("DEC-002", "decision", "Je me sens entendu(e) quand nous devons trancher."),
  q("DEC-003", "decision", "Le pouvoir de décision est partagé de façon saine dans notre couple.", "COUPLE_PERCEPTION"),

  q("PRJ-001", "projet_vie", "Nous partageons une vision proche de notre avenir (lieu, rythme, priorités)."),
  q("PRJ-002", "projet_vie", "Je peux parler de mes rêves personnels sans que cela menace le couple."),
  q("PRJ-003", "projet_vie", "Notre projet de vie commun est en construction réelle.", "COUPLE_PERCEPTION"),

  q("CAR-001", "carriere", "Nous respectons les aspirations professionnelles de chacun."),
  q("CAR-002", "carriere", "Le travail n’écrase pas systématiquement notre relation."),
  q("CAR-003", "carriere", "Nous savons négocier les arbitrages carrière / couple.", "COUPLE_PERCEPTION"),

  q("ENF-001", "enfants", "Nous avons une vision compatible concernant les enfants (désir, timing, éducation)."),
  q("ENF-002", "enfants", "Ce sujet peut être abordé sans pression ni silence."),
  q("ENF-003", "enfants", "Nos attentes parentales sont suffisamment claires pour avancer.", "COUPLE_PERCEPTION"),

  q("AUT-001", "autonomie", "Chacun a de l’espace pour être soi sans se perdre."),
  q("AUT-002", "autonomie", "L’interdépendance dans notre couple me semble saine."),
  q("AUT-003", "autonomie", "Nous équilibrons bien proximité et liberté personnelle.", "COUPLE_PERCEPTION"),

  q("SPI-001", "spiritualite", "Nos convictions spirituelles ou de sens de la vie peuvent cohabiter avec respect."),
  q("SPI-002", "spiritualite", "Je me sens libre d’exprimer ma foi ou mes convictions dans le couple."),
  q("SPI-003", "spiritualite", "La dimension spirituelle (ou de sens) est un sujet abordable entre nous.", "COUPLE_PERCEPTION"),

  q("LIM-001", "limites", "Mes limites sont respectées dans cette relation.", "LIKERT", true),
  q("LIM-002", "limites", "Je me sens en sécurité émotionnelle avec mon partenaire.", "LIKERT", true),
  q("LIM-003", "limites", "La confiance et le respect des limites sont solides chez nous.", "COUPLE_PERCEPTION", true),
]

export function getCoupleQuestions() {
  return COUPLE_QUESTIONS
}

export function getCoupleQuestionCount() {
  return COUPLE_QUESTIONS.length
}
