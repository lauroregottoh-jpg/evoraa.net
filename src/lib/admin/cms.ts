export type AppTexts = {
  banner_photo_title: string
  banner_photo_body: string
  banner_alliance_title: string
  banner_alliance_body: string
  home_greeting_prefix: string
  selection_title: string
  selection_subtitle: string
}

export type AdSlot = {
  id: string
  slot: "dashboard" | "discover" | "messages" | "global"
  title: string
  body: string
  ctaLabel: string
  href: string
  imageUrl?: string
  active: boolean
}

export type AutoModerationConfig = {
  enabled: boolean
  minCompletion: number
  requirePhoto: boolean
  requireVerifiedEmail: boolean
  autoApprovePhotosIfPrimary: boolean
}

export type AcademyLessonOverride = {
  title?: string
  subtitle?: string
  exercise?: string
  videoUrl?: string | null
  keyPoints?: string[]
  durationMin?: number
}

export type AcademyOverrides = Record<
  string,
  {
    title?: string
    summary?: string
    lessons?: Record<string, AcademyLessonOverride>
  }
>

export const DEFAULT_APP_TEXTS: AppTexts = {
  banner_photo_title: "Votre profil sans photo passe inaperçu",
  banner_photo_body: "Ajoutez une photo pour apparaître dans les suggestions.",
  banner_alliance_title: "Passez Alliance",
  banner_alliance_body: "Plus de conversations, visiteurs et favoris.",
  home_greeting_prefix: "Bonjour",
  selection_title: "La sélection KELIAA",
  selection_subtitle: "Des profils choisis pour vous",
}

export const DEFAULT_AUTO_MOD: AutoModerationConfig = {
  enabled: false,
  minCompletion: 70,
  requirePhoto: true,
  requireVerifiedEmail: false,
  autoApprovePhotosIfPrimary: false,
}

export function parseAppTexts(raw: unknown): AppTexts {
  const o = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {}
  return {
    banner_photo_title: String(o.banner_photo_title ?? DEFAULT_APP_TEXTS.banner_photo_title),
    banner_photo_body: String(o.banner_photo_body ?? DEFAULT_APP_TEXTS.banner_photo_body),
    banner_alliance_title: String(
      o.banner_alliance_title ?? DEFAULT_APP_TEXTS.banner_alliance_title
    ),
    banner_alliance_body: String(o.banner_alliance_body ?? DEFAULT_APP_TEXTS.banner_alliance_body),
    home_greeting_prefix: String(
      o.home_greeting_prefix ?? DEFAULT_APP_TEXTS.home_greeting_prefix
    ),
    selection_title: String(o.selection_title ?? DEFAULT_APP_TEXTS.selection_title),
    selection_subtitle: String(o.selection_subtitle ?? DEFAULT_APP_TEXTS.selection_subtitle),
  }
}

export function parseAds(raw: unknown): AdSlot[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item, i) => {
      const o = item && typeof item === "object" ? (item as Record<string, unknown>) : {}
      const slot = String(o.slot || "dashboard")
      return {
        id: String(o.id || `ad-${i}`),
        slot: (["dashboard", "discover", "messages", "global"].includes(slot)
          ? slot
          : "dashboard") as AdSlot["slot"],
        title: String(o.title || ""),
        body: String(o.body || ""),
        ctaLabel: String(o.ctaLabel || "En savoir plus"),
        href: String(o.href || "#"),
        imageUrl: o.imageUrl ? String(o.imageUrl) : undefined,
        active: Boolean(o.active),
      }
    })
    .filter((a) => a.title)
}

export function parseAutoMod(raw: unknown): AutoModerationConfig {
  const o = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {}
  return {
    enabled: Boolean(o.enabled ?? DEFAULT_AUTO_MOD.enabled),
    minCompletion: Number(o.minCompletion ?? DEFAULT_AUTO_MOD.minCompletion) || 70,
    requirePhoto: Boolean(o.requirePhoto ?? DEFAULT_AUTO_MOD.requirePhoto),
    requireVerifiedEmail: Boolean(
      o.requireVerifiedEmail ?? DEFAULT_AUTO_MOD.requireVerifiedEmail
    ),
    autoApprovePhotosIfPrimary: Boolean(
      o.autoApprovePhotosIfPrimary ?? DEFAULT_AUTO_MOD.autoApprovePhotosIfPrimary
    ),
  }
}

export function parseAcademyOverrides(raw: unknown): AcademyOverrides {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {}
  return raw as AcademyOverrides
}

/** Discernement automatique (règles) — pas un LLM facturé. */
export function evaluateProfileAuto(
  profile: {
    completion: number
    hasAvatar: boolean
    hasName: boolean
    emailVerified?: boolean
  },
  cfg: AutoModerationConfig
): { score: number; recommend: "approve" | "review" | "reject"; reasons: string[] } {
  const reasons: string[] = []
  let score = 40

  if (profile.hasName) {
    score += 15
    reasons.push("Nom renseigné")
  } else {
    reasons.push("Nom manquant")
  }

  if (profile.completion >= cfg.minCompletion) {
    score += 25
    reasons.push(`Profil ≥ ${cfg.minCompletion}%`)
  } else {
    reasons.push(`Profil ${profile.completion}% < ${cfg.minCompletion}%`)
  }

  if (profile.hasAvatar) {
    score += 20
    reasons.push("Photo présente")
  } else if (cfg.requirePhoto) {
    reasons.push("Photo obligatoire manquante")
  }

  if (cfg.requireVerifiedEmail) {
    if (profile.emailVerified) {
      score += 10
      reasons.push("Email vérifié")
    } else {
      reasons.push("Email non vérifié")
    }
  }

  let recommend: "approve" | "review" | "reject" = "review"
  if (
    profile.completion >= cfg.minCompletion &&
    (!cfg.requirePhoto || profile.hasAvatar) &&
    profile.hasName &&
    (!cfg.requireVerifiedEmail || profile.emailVerified)
  ) {
    recommend = "approve"
  } else if (profile.completion < 30 && !profile.hasAvatar && !profile.hasName) {
    recommend = "reject"
  }

  return { score: Math.min(100, score), recommend, reasons }
}
