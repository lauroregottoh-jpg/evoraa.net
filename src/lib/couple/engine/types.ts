/**
 * Types du moteur de décision KELYA COUPLE™ (docs 181 / 133 / 86).
 */

import type { CoupleDimensionId } from "@/lib/couple/questionBank"
import type { CoupleOfferId } from "@/lib/couple/offers"
import type { DimensionPairScore } from "@/lib/couple/scoring"

export type GapLevel = "faible" | "modere" | "important"
export type ConvergenceLevel = "faible" | "moderee" | "forte"
export type ImpactLevel = "faible" | "modere" | "important"

/** Classification décisionnelle par dimension. */
export type DimensionType =
  | "force"
  | "complementarite"
  | "clarification"
  | "vigilance"
  | "priorite"

export type AttentionLevel =
  | "a_preserver"
  | "a_explorer"
  | "a_clarifier"
  | "a_travailler"

export type ContentPriority = "A" | "B" | "C" | "D" | "E"

export type CoupleContext =
  | "interet"
  | "cheminement"
  | "fiançailles"
  | "mariage_recent"
  | "mariage_etabli"

export type DifferenceClass =
  | "legere"
  | "a_clarifier"
  | "significative"
  | "priorite_travail"

export type ResourceFormat =
  | "carte"
  | "exercice"
  | "fiche"
  | "protocole"
  | "journal"
  | "suivi"

export type ResourceKind =
  | "conversation"
  | "pratique"
  | "reflexion"
  | "progression"
  | "suivi"

export type DomainTag =
  | "communication"
  | "conflits"
  | "finances"
  | "famille"
  | "mariage"
  | "intimite"
  | "valeurs"
  | "projets"
  | "decision"
  | "confiance"
  | "connexion"
  | "spiritualite"
  | "enfants"
  | "roles"
  | "autonomie"
  | "emotions"
  | "affection"
  | "carriere"
  | "limites"

export type ProfileTag =
  | "ecart_faible"
  | "ecart_modere"
  | "ecart_important"
  | "forte_convergence"
  | "forte_difference"
  | "besoin_clarification"
  | "priorite_elevee"
  | "besoin_reconnexion"
  | "besoin_structure"
  | "preparation_mariage"

/** Domaines à fort impact relationnel (doc 181). */
export const HIGH_IMPACT_DIMENSIONS: CoupleDimensionId[] = [
  "finances",
  "projet_vie",
  "enfants",
  "limites",
  "conflits",
  "communication",
  "mariage",
  "carriere",
  "famille",
]

export type DimensionReadingCard = {
  dimension: CoupleDimensionId
  label: string
  scoreA: number
  scoreB: number
  gap: number
  convergence: number
  gapLevel: GapLevel
  convergenceLevel: ConvergenceLevel
  impact: ImpactLevel
  type: DimensionType
  attention: AttentionLevel
  contentPriority: ContentPriority
  differenceClass: DifferenceClass
  pair: DimensionPairScore
}

export type PartnerProfile = {
  seat: "A" | "B"
  name: string
  highDimensions: CoupleDimensionId[]
  lowDimensions: CoupleDimensionId[]
  trends: string[]
  needs: string[]
  sensitivities: string[]
}

export type CoupleMap = {
  context: CoupleContext
  profileA: PartnerProfile
  profileB: PartnerProfile
  dynamicsSentence: string
  profileTags: ProfileTag[]
}

export type PrioritySpec = {
  card: DimensionReadingCard
  rank: 1 | 2 | 3
  why: string
  firstAction: string
  resourceIds: string[]
}

export type InternalSynthesis = {
  forces: DimensionReadingCard[]
  convergences: DimensionReadingCard[]
  differences: DimensionReadingCard[]
  vigilances: DimensionReadingCard[]
  priorities: PrioritySpec[]
  dynamicsSentence: string
  contentPriorities: ContentPriority[]
}

export type CatalogResource = {
  id: string
  version: string
  title: string
  format: ResourceFormat
  kind: ResourceKind
  domain: DomainTag
  domains: DomainTag[]
  tags: ProfileTag[]
  minOffer: "essential" | "premium_plus"
  duration: string
  objective: string
  why: string
  steps: string[]
  questions: string[]
  incompatibleWith: string[]
  premiumPlus?: boolean
}

export type SelectedResource = {
  resource: CatalogResource
  versionPinned: string
  adaptedWhy: string
  adaptedSteps: string[]
  adaptedQuestions: string[]
}

export type EngineInput = {
  offerId: CoupleOfferId
  names: { nameA: string; nameB: string }
  scoring: import("@/lib/couple/scoring").CoupleScoringResult
  context?: CoupleContext
}

export type EngineResult = {
  coupleMap: CoupleMap
  cards: DimensionReadingCard[]
  synthesis: InternalSynthesis
  selectedResources: SelectedResource[]
  qualityNotes: string[]
}
