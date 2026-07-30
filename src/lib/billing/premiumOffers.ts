export type BoostPackId = "boost_24h" | "boost_3d" | "boost_7d"

export type BoostPack = {
  id: BoostPackId
  label: string
  durationLabel: string
  hours: number
  amountXof: number
  description: string
}

export const BOOST_PACKS: BoostPack[] = [
  {
    id: "boost_24h",
    label: "Boost 24h",
    durationLabel: "24h",
    hours: 24,
    amountXof: 1500,
    description: "Visibilité prioritaire pendant une journée.",
  },
  {
    id: "boost_3d",
    label: "Boost 3 jours",
    durationLabel: "3 jours",
    hours: 72,
    amountXof: 3000,
    description: "Idéal pour un week-end de suggestions.",
  },
  {
    id: "boost_7d",
    label: "Boost 7 jours",
    durationLabel: "7 jours",
    hours: 168,
    amountXof: 5000,
    description: "Une semaine en tête des recherches.",
  },
]

export function getBoostPack(id: string | null | undefined): BoostPack | null {
  return BOOST_PACKS.find((p) => p.id === id) ?? null
}

export type AllianceDurationId = "1m" | "3m" | "6m"

export type AllianceDurationOption = {
  id: AllianceDurationId
  months: number
  label: string
  amountXof: number
  compareAtXof: number
  discountPercent: number
  popular?: boolean
  /** Boosts offerts (affichage commercial, activation réelle ultérieure) */
  bonusBoosts: number
  /** Pour l’instant le checkout réel reste sur 30 jours Alliance */
  checkoutPlanId: "premium_plus"
}

/** Options commerciales inspirées Farata — facturation réelle = Alliance 30 j. */
export const ALLIANCE_DURATION_OPTIONS: AllianceDurationOption[] = [
  {
    id: "1m",
    months: 1,
    label: "Alliance 1 mois",
    amountXof: 5000,
    compareAtXof: 7500,
    discountPercent: 33,
    popular: true,
    bonusBoosts: 1,
    checkoutPlanId: "premium_plus",
  },
  {
    id: "3m",
    months: 3,
    label: "Alliance 3 mois",
    amountXof: 12000,
    compareAtXof: 22500,
    discountPercent: 47,
    bonusBoosts: 3,
    checkoutPlanId: "premium_plus",
  },
  {
    id: "6m",
    months: 6,
    label: "Alliance 6 mois",
    amountXof: 21000,
    compareAtXof: 45000,
    discountPercent: 53,
    bonusBoosts: 6,
    checkoutPlanId: "premium_plus",
  },
]

export function getAllianceDuration(id: string | null | undefined): AllianceDurationOption {
  return ALLIANCE_DURATION_OPTIONS.find((o) => o.id === id) ?? ALLIANCE_DURATION_OPTIONS[0]
}
