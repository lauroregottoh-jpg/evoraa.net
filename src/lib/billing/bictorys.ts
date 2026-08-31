export type BictorysPaymentMode = "mobile_money" | "card"

export const BICTORYS_VALID_MODES = new Set<BictorysPaymentMode>(["mobile_money", "card"])

/** Modes réellement activés côté marchand Bictorys (voir BICTORYS_PAYMENT_MODE). */
export function getBictorysEnabledPaymentModes(): BictorysPaymentMode[] {
  const raw = process.env.BICTORYS_PAYMENT_MODE?.trim()
  if (!raw) return ["mobile_money"]

  const modes = raw
    .split(/[,;|]+/)
    .map((s) => s.trim().toLowerCase())
    .filter((s): s is BictorysPaymentMode =>
      BICTORYS_VALID_MODES.has(s as BictorysPaymentMode)
    )

  const unique = [...new Set(modes)]
  return unique.length > 0 ? unique : ["mobile_money"]
}

export function isBictorysPaymentModeEnabled(mode: BictorysPaymentMode): boolean {
  return getBictorysEnabledPaymentModes().includes(mode)
}

/** UEMOA — Mobile Money pre-selected */
const UEMOA_COUNTRIES = new Set(["SN", "CI", "ML", "BF", "BJ", "TG", "GW", "NE"])

/** Diaspora / card-first countries */
const CARD_PREFERRED = new Set([
  "FR",
  "BE",
  "CH",
  "CA",
  "US",
  "GB",
  "DE",
  "ES",
  "IT",
  "NL",
  "LU",
  "MA",
  "DZ",
  "TN",
  "CM",
  "GA",
  "CG",
  "CD",
])

const COUNTRY_ALIASES: Record<string, string> = {
  senegal: "SN",
  sénégal: "SN",
  "cote d'ivoire": "CI",
  "côte d'ivoire": "CI",
  "ivory coast": "CI",
  mali: "ML",
  "burkina faso": "BF",
  benin: "BJ",
  bénin: "BJ",
  togo: "TG",
  "guinee-bissau": "GW",
  "guinée-bissau": "GW",
  niger: "NE",
  france: "FR",
  belgique: "BE",
  belgium: "BE",
  suisse: "CH",
  switzerland: "CH",
  canada: "CA",
  "etats-unis": "US",
  "états-unis": "US",
  "united states": "US",
  "royaume-uni": "GB",
  "united kingdom": "GB",
  maroc: "MA",
  morocco: "MA",
  algerie: "DZ",
  algérie: "DZ",
  algeria: "DZ",
  tunisie: "TN",
  tunisia: "TN",
  cameroun: "CM",
  cameroon: "CM",
}

export function normalizeCountryCode(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null
  const trimmed = raw.trim()
  if (/^[A-Za-z]{2}$/.test(trimmed)) return trimmed.toUpperCase()
  return COUNTRY_ALIASES[trimmed.toLowerCase()] ?? null
}

export function resolveBictorysPaymentMode(
  country: string | null | undefined,
  override?: string | null
): BictorysPaymentMode {
  const enabled = getBictorysEnabledPaymentModes()
  let mode: BictorysPaymentMode = "mobile_money"

  if (override && BICTORYS_VALID_MODES.has(override as BictorysPaymentMode)) {
    mode = override as BictorysPaymentMode
  } else {
    const code = normalizeCountryCode(country)
    if (code && CARD_PREFERRED.has(code)) mode = "card"
    else if (code && UEMOA_COUNTRIES.has(code)) mode = "mobile_money"
  }

  if (enabled.includes(mode)) return mode
  return enabled[0] ?? "mobile_money"
}

export function bictorysPaymentModeLabel(mode: BictorysPaymentMode): string {
  return mode === "card" ? "Carte bancaire" : "Mobile Money"
}

export function parseBictorysPaymentMode(raw: unknown): BictorysPaymentMode | null {
  if (typeof raw !== "string") return null
  return BICTORYS_VALID_MODES.has(raw as BictorysPaymentMode)
    ? (raw as BictorysPaymentMode)
    : null
}
