export type PhotoRules = {
  enabled: boolean
  minBytes: number
  maxBytes: number
  rejectNamePatterns: string[]
  allowedMimeHints: string[]
  autoApproveClean: boolean
  msgApprove: string
  msgReject: string
  msgRetry: string
}

export type SanctionRules = {
  enabled: boolean
  warn1Label: string
  warn2Label: string
  suspendDays: number
  autoBlockAfterWarns: number
  bannedWords: string[]
  trustPenaltyWarn: number
  trustBonusVerify: number
  trustBonusReco: number
}

export type EvaConfig = {
  systemPrompt: string
  tone: string
  forbiddenTopics: string[]
  knowledgeNotes: string
  analyzeConversations: boolean
  dailyReportEnabled: boolean
}

export type YoutubeConfig = {
  enabled: boolean
  channelId: string
  apiKeyConfigured: boolean
  defaultPlaylistId: string
}

export type IntegrationsConfig = {
  stripeNotes: string
  cinetpay: boolean
  resend: boolean
  openaiNotes: string
  webhookUrl: string
}

export const DEFAULT_PHOTO_RULES: PhotoRules = {
  enabled: true,
  minBytes: 15_000,
  maxBytes: 8_388_608,
  rejectNamePatterns: ["nude", "nsfw", "xxx", "sexy", "lingerie"],
  allowedMimeHints: ["image/jpeg", "image/png", "image/webp"],
  autoApproveClean: false,
  msgApprove: "Photo conforme — visage clair, tenue respectueuse.",
  msgReject:
    "Photo refusée : non conforme aux règles KELIAA (tenue, cadrage ou contenu).",
  msgRetry:
    "Merci d'envoyer une nouvelle photo : visage visible, fond simple, tenue respectueuse.",
}

export const DEFAULT_SANCTION_RULES: SanctionRules = {
  enabled: true,
  warn1Label: "Avertissement 1",
  warn2Label: "Avertissement 2",
  suspendDays: 7,
  autoBlockAfterWarns: 3,
  bannedWords: ["putain", "salope", "sexe gratuit", "envoie nudes", "nudes", "escort"],
  trustPenaltyWarn: 10,
  trustBonusVerify: 15,
  trustBonusReco: 20,
}

export const DEFAULT_EVA_CONFIG: EvaConfig = {
  systemPrompt:
    "Tu es EVA, conseillère spirituelle KELIAA. Ton style est doux, biblique, pratique, sans jugement.",
  tone: "doux et biblique",
  forbiddenTopics: ["politique partisane", "investissement crypto", "contenu sexuel explicite"],
  knowledgeNotes:
    "Prioriser prière, pureté, famille, communication, finances comme intendance.",
  analyzeConversations: false,
  dailyReportEnabled: true,
}

export const DEFAULT_YOUTUBE: YoutubeConfig = {
  enabled: false,
  channelId: "",
  apiKeyConfigured: false,
  defaultPlaylistId: "",
}

export const DEFAULT_INTEGRATIONS: IntegrationsConfig = {
  stripeNotes: "Stripe non branché en V1 — CinetPay / démo actifs.",
  cinetpay: true,
  resend: true,
  openaiNotes: "Vision photo / LLM EVA = option V2 (clé API).",
  webhookUrl: "",
}

function asObj(raw: unknown): Record<string, unknown> {
  return raw && typeof raw === "object" && !Array.isArray(raw)
    ? (raw as Record<string, unknown>)
    : {}
}

function asStringArray(v: unknown, fallback: string[]): string[] {
  if (!Array.isArray(v)) return fallback
  return v.map((x) => String(x)).filter(Boolean)
}

export function parsePhotoRules(raw: unknown): PhotoRules {
  const o = asObj(raw)
  return {
    enabled: Boolean(o.enabled ?? DEFAULT_PHOTO_RULES.enabled),
    minBytes: Number(o.minBytes ?? DEFAULT_PHOTO_RULES.minBytes) || 15000,
    maxBytes: Number(o.maxBytes ?? DEFAULT_PHOTO_RULES.maxBytes) || 8388608,
    rejectNamePatterns: asStringArray(
      o.rejectNamePatterns,
      DEFAULT_PHOTO_RULES.rejectNamePatterns
    ),
    allowedMimeHints: asStringArray(
      o.allowedMimeHints,
      DEFAULT_PHOTO_RULES.allowedMimeHints
    ),
    autoApproveClean: Boolean(o.autoApproveClean ?? DEFAULT_PHOTO_RULES.autoApproveClean),
    msgApprove: String(o.msgApprove ?? DEFAULT_PHOTO_RULES.msgApprove),
    msgReject: String(o.msgReject ?? DEFAULT_PHOTO_RULES.msgReject),
    msgRetry: String(o.msgRetry ?? DEFAULT_PHOTO_RULES.msgRetry),
  }
}

export function parseSanctionRules(raw: unknown): SanctionRules {
  const o = asObj(raw)
  return {
    enabled: Boolean(o.enabled ?? DEFAULT_SANCTION_RULES.enabled),
    warn1Label: String(o.warn1Label ?? DEFAULT_SANCTION_RULES.warn1Label),
    warn2Label: String(o.warn2Label ?? DEFAULT_SANCTION_RULES.warn2Label),
    suspendDays: Number(o.suspendDays ?? DEFAULT_SANCTION_RULES.suspendDays) || 7,
    autoBlockAfterWarns:
      Number(o.autoBlockAfterWarns ?? DEFAULT_SANCTION_RULES.autoBlockAfterWarns) || 3,
    bannedWords: asStringArray(o.bannedWords, DEFAULT_SANCTION_RULES.bannedWords),
    trustPenaltyWarn:
      Number(o.trustPenaltyWarn ?? DEFAULT_SANCTION_RULES.trustPenaltyWarn) || 10,
    trustBonusVerify:
      Number(o.trustBonusVerify ?? DEFAULT_SANCTION_RULES.trustBonusVerify) || 15,
    trustBonusReco:
      Number(o.trustBonusReco ?? DEFAULT_SANCTION_RULES.trustBonusReco) || 20,
  }
}

export function parseEvaConfig(raw: unknown): EvaConfig {
  const o = asObj(raw)
  return {
    systemPrompt: String(o.systemPrompt ?? DEFAULT_EVA_CONFIG.systemPrompt),
    tone: String(o.tone ?? DEFAULT_EVA_CONFIG.tone),
    forbiddenTopics: asStringArray(o.forbiddenTopics, DEFAULT_EVA_CONFIG.forbiddenTopics),
    knowledgeNotes: String(o.knowledgeNotes ?? DEFAULT_EVA_CONFIG.knowledgeNotes),
    analyzeConversations: Boolean(
      o.analyzeConversations ?? DEFAULT_EVA_CONFIG.analyzeConversations
    ),
    dailyReportEnabled: Boolean(
      o.dailyReportEnabled ?? DEFAULT_EVA_CONFIG.dailyReportEnabled
    ),
  }
}

export function parseYoutubeConfig(raw: unknown): YoutubeConfig {
  const o = asObj(raw)
  return {
    enabled: Boolean(o.enabled ?? DEFAULT_YOUTUBE.enabled),
    channelId: String(o.channelId ?? ""),
    apiKeyConfigured: Boolean(o.apiKeyConfigured ?? false),
    defaultPlaylistId: String(o.defaultPlaylistId ?? ""),
  }
}

export function parseIntegrations(raw: unknown): IntegrationsConfig {
  const o = asObj(raw)
  return {
    stripeNotes: String(o.stripeNotes ?? DEFAULT_INTEGRATIONS.stripeNotes),
    cinetpay: Boolean(o.cinetpay ?? DEFAULT_INTEGRATIONS.cinetpay),
    resend: Boolean(o.resend ?? DEFAULT_INTEGRATIONS.resend),
    openaiNotes: String(o.openaiNotes ?? DEFAULT_INTEGRATIONS.openaiNotes),
    webhookUrl: String(o.webhookUrl ?? ""),
  }
}

export type PhotoVerdict = {
  decision: "approve" | "reject" | "retry"
  reasons: string[]
  message: string
  score: number
}

/** Discernement photo automatique (règles) — pas de vision LLM V1. */
export function evaluatePhotoRules(
  meta: { fileName?: string; mime?: string; bytes?: number },
  rules: PhotoRules
): PhotoVerdict {
  const reasons: string[] = []
  let score = 70
  const name = (meta.fileName || "").toLowerCase()
  const mime = (meta.mime || "").toLowerCase()
  const bytes = meta.bytes ?? 0

  if (!rules.enabled) {
    return {
      decision: "retry",
      reasons: ["Auto-photo désactivée — revue humaine"],
      message: rules.msgRetry,
      score: 50,
    }
  }

  if (bytes > 0 && bytes < rules.minBytes) {
    reasons.push(`Fichier trop léger (< ${Math.round(rules.minBytes / 1000)} Ko)`)
    score -= 25
  }
  if (bytes > rules.maxBytes) {
    reasons.push("Fichier trop lourd")
    score -= 20
  }
  if (mime && rules.allowedMimeHints.length && !rules.allowedMimeHints.some((m) => mime.includes(m.replace("image/", "")))) {
    if (!mime.startsWith("image/")) {
      reasons.push("Type de fichier non image")
      score -= 40
    }
  }
  for (const pat of rules.rejectNamePatterns) {
    if (pat && name.includes(pat.toLowerCase())) {
      reasons.push(`Nom de fichier suspect (« ${pat} »)`)
      score -= 50
    }
  }

  if (score < 40) {
    return { decision: "reject", reasons, message: rules.msgReject, score }
  }
  if (score < 60 || reasons.length > 0) {
    return {
      decision: "retry",
      reasons: reasons.length ? reasons : ["Qualité insuffisante"],
      message: rules.msgRetry,
      score,
    }
  }
  if (rules.autoApproveClean) {
    return {
      decision: "approve",
      reasons: ["Conforme aux règles automatiques"],
      message: rules.msgApprove,
      score,
    }
  }
  return {
    decision: "retry",
    reasons: ["OK technique — validation humaine recommandée"],
    message: rules.msgRetry,
    score,
  }
}

export function scanTextForBanned(
  text: string,
  banned: string[]
): { flagged: boolean; hits: string[] } {
  const lower = text.toLowerCase()
  const hits = banned.filter((w) => w && lower.includes(w.toLowerCase()))
  return { flagged: hits.length > 0, hits }
}

export function nextSanctionStatus(
  warningCount: number,
  rules: SanctionRules
): "none" | "warned" | "warned_2" | "suspended" | "blocked" {
  if (warningCount >= rules.autoBlockAfterWarns) return "blocked"
  if (warningCount >= 2) return "suspended"
  if (warningCount === 1) return "warned"
  return "none"
}
