import fs from "fs"
import path from "path"
import { PLANS } from "@/lib/billing/plans"

export type EvaChatMessage = {
  role: "user" | "assistant"
  content: string
}

export type EvaEngineResult = {
  answer: string
  intent: string
  source: "openai" | "knowledge" | "crisis" | "guardrail"
  ctaHref?: string
  ctaLabel?: string
}

const CRISIS_PATTERNS =
  /suicid|me tuer|me faire du mal|automutil|violé|violence conjugale|je vais mourir|je ne veux plus vivre/i

const FORBIDDEN =
  /crypto|bitcoin|parti politique|vote pour|nudes?|sexe gratuit|escort/i

function extraForbiddenFromNotes(adminNotes?: string): RegExp | null {
  if (!adminNotes) return null
  const m = adminNotes.match(/Sujets interdits \(ops\):\s*(.+)/i)
  if (!m?.[1]) return null
  const parts = m[1]
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 2)
  if (!parts.length) return null
  try {
    return new RegExp(parts.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "i")
  } catch {
    return null
  }
}

function docsDir() {
  return path.join(process.cwd(), "docs", "eva")
}

function readDoc(name: string): string {
  try {
    return fs.readFileSync(path.join(docsDir(), name), "utf8")
  } catch {
    return ""
  }
}

/** Prompt système assemblé depuis docs/eva (+ vérité tarifaire live). */
export function buildEvaSystemPrompt(adminExtra?: string): string {
  const core =
    readDoc("10_system_prompt.md") ||
    `Tu es Eva, conseillère relationnelle KELIAA. Bienveillante, claire, sans jugement.`
  const faq = readDoc("06_faq.md")
  const matrix = readDoc("subscription_matrix.md")
  const guard = readDoc("09_guardrails.md")

  const livePlans = `
## Tarifs LIVE (code — prioritaire)
- Découverte (${PLANS.free.amountXof} FCFA): ${PLANS.free.limits.dailySuggestions} sugg/j, ${PLANS.free.limits.conversationsPerMonth} convos/mois, ${PLANS.free.limits.messagesPerConversation} msg/convo, EVA ${PLANS.free.limits.evaQuestionsPerDay}/j
- Alliance (${PLANS.premium_plus.amountXof} FCFA/mois): ${PLANS.premium_plus.limits.dailySuggestions} sugg/j, ${PLANS.premium_plus.limits.conversationsPerMonth} convos/mois, ${PLANS.premium_plus.limits.messagesPerConversation} msg/convo, EVA ${PLANS.premium_plus.limits.evaQuestionsPerDay}/j
`

  return [
    core,
    livePlans,
    adminExtra ? `## Notes admin\n${adminExtra}` : "",
    faq ? `## FAQ\n${faq.slice(0, 6000)}` : "",
    matrix ? `## Matrice\n${matrix.slice(0, 3500)}` : "",
    guard ? `## Garde-fous\n${guard.slice(0, 2500)}` : "",
  ]
    .filter(Boolean)
    .join("\n\n")
}

type ScoredHit = { score: number; intent: string; answer: string; ctaHref?: string; ctaLabel?: string }

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .split(/[^a-z0-9àâäéèêëïîôùûüç]+/i)
    .filter((t) => t.length > 2)
}

/** Base locale : FAQ + scénarios d’intention (sans LLM). */
function knowledgeHits(question: string): ScoredHit[] {
  const q = question.toLowerCase()
  const tokens = new Set(tokenize(question))

  const bank: Array<{
    intent: string
    keys: string[]
    answer: string
    ctaHref?: string
    ctaLabel?: string
  }> = [
    {
      intent: "discover",
      keys: ["keliaa", "cest quoi", "decouvrir", "dating", "rencontre"],
      answer:
        "KELIAA est un espace de rencontres pour célibataires chrétiens fondé sur le discernement — pas le swipe. On clarifie d’abord votre vision (foi, mariage, foyer), puis la compatibilité via des questionnaires, puis le dialogue respectueux. Quel est votre objectif aujourd’hui : comprendre le produit, vous inscrire, ou préparer un mariage ?",
      ctaHref: "/how-it-works",
      ctaLabel: "Voir comment ça marche",
    },
    {
      intent: "howto_signup",
      keys: ["inscri", "compte", "register", "creer", "connexion", "mot de passe"],
      answer:
        "Pour commencer : créez un compte sur /register, confirmez votre e-mail, complétez l’onboarding, puis les 5 questionnaires. Si vous ne parvenez plus à vous connecter, utilisez « Mot de passe oublié » plutôt que de créer un second compte. Où en êtes-vous exactement ?",
      ctaHref: "/register",
      ctaLabel: "Créer mon compte",
    },
    {
      intent: "pricing",
      keys: ["prix", "tarif", "cout", "coute", "payant", "alliance", "5000", "2500", "10000", "gratuit", "abonnement"],
      answer: `Découverte est gratuite (goûter le Matching, avec quotas serrés). Alliance coûte ${PLANS.premium_plus.amountXof.toLocaleString("fr-FR")} FCFA/mois et élève clairement suggestions, conversations, messages et questions Eva. Le plan 2 500 n’est plus public. Un niveau ~10 000 « Souverain » est prévu plus tard, pas encore vendu. Voulez-vous que je compare Free et Alliance pour votre usage ?`,
      ctaHref: "/billing",
      ctaLabel: "Voir Alliance",
    },
    {
      intent: "quota_block",
      keys: ["quota", "limite", "plus de message", "plus de question", "bloque"],
      answer: `Sur Découverte, Eva est limitée à ${PLANS.free.limits.evaQuestionsPerDay} questions/jour, ${PLANS.free.limits.conversationsPerMonth} nouvelles conversations/mois et ${PLANS.free.limits.messagesPerConversation} messages/conversation — volontairement, pour goûter. Alliance passe à ${PLANS.premium_plus.limits.evaQuestionsPerDay} questions Eva/jour et des échanges nettement plus amples. Si vous êtes déjà prêt(e) à accélérer sérieusement, Alliance a du sens.`,
      ctaHref: "/billing",
      ctaLabel: "Passer Alliance",
    },
    {
      intent: "matching",
      keys: ["match", "compatibil", "suggestion", "pilier", "propos"],
      answer:
        "Le Matching KELIAA repose sur 5 piliers : personnalité, spirituel, relation, vie de couple et finances. Sans les questionnaires, le Matching ne peut pas vraiment cibler quelqu’un aligné avec votre vision. Complétez d’abord les tests, puis explorez vos suggestions. Combien de questionnaires avez-vous déjà terminés ?",
      ctaHref: "/assessments",
      ctaLabel: "Faire les tests",
    },
    {
      intent: "assessment",
      keys: ["test", "questionnaire", "attachement", "personnalite", "stress"],
      answer:
        "Les 5 tests (Personnalité & stress, Foi & valeurs, Conflits & dialogue, Vision du couple, Finances & projet) construisent votre score. Ils sont inclus dans Découverte. Sans eux, votre profil reste incomplet et le Matching reste faible. Souhaitez-vous commencer par Personnalité & stress ?",
      ctaHref: "/assessments",
      ctaLabel: "Ouvrir les questionnaires",
    },
    {
      intent: "academy",
      keys: ["academie", "lecon", "module", "preparer", "mariage", "finances", "limites", "famille"],
      answer:
        "L’Académie du mariage propose 8 modules (1 leçon profonde chacun) : foi, dialogue, conflits, limites, familles, finances, émotions, projet. Choisissez le thème qui vous concerne maintenant plutôt que tout lire d’un coup. Quel sujet vous préoccupe le plus ?",
      ctaHref: "/academie-mariage",
      ctaLabel: "Ouvrir l’Académie",
    },
    {
      intent: "emotional_pain",
      keys: ["souffre", "pleure", "seul", "douleur", "blesse", "mal", "triste", "anxieu"],
      answer:
        "Merci de me le dire. Ce que vous traversez mérite du respect et du rythme. Sur KELIAA, vous pouvez commencer petit : un contenu d’inspiration, un module « émotions », ou un échange avec quelqu’un de confiance. Je ne remplace pas un thérapeute ni un pasteur. Si c’est trop lourd aujourd’hui, écrivez à contact@keliaa.org. Qu’est-ce qui serait le plus utile pour vous dans l’heure qui vient : un pas léger, ou un contact humain ?",
      ctaHref: "/inspiration",
      ctaLabel: "Inspiration",
    },
    {
      intent: "ex_recovery",
      keys: ["ex", "trompe", "rupture", "retrouver"],
      answer:
        "La douleur d’une rupture est réelle. Je ne peux pas vous aider à manipuler quelqu’un pour « retrouver » une personne. En revanche, on peut travailler reconstruction, limites et maturité — notamment via l’Académie (émotions) et, si besoin, un coaching humain. Voulez-vous un pas concret pour cette semaine ?",
      ctaHref: "/academie-mariage/emotions",
      ctaLabel: "Module émotions",
    },
    {
      intent: "already_coupled",
      keys: ["marie", "fiance", "en couple", "epoux", "epouse"],
      answer:
        "KELIAA est pensée surtout pour les célibataires en démarche de mariage. Si vous êtes déjà en couple, fiancé(e) ou marié(e), l’Académie, l’Inspiration et le coaching humain restent utiles — le Matching n’est pas le centre. Souhaitez-vous un module de préparation (finances, familles, projet) ?",
      ctaHref: "/academie-mariage",
      ctaLabel: "Académie",
    },
    {
      intent: "coaching",
      keys: ["coach", "seance", "accompagn", "rendez-vous", "psy"],
      answer:
        "Le coaching humain KELIAA : séances de 30 min à partir de 15 000 FCFA (packs jusqu’à 12 séances). Paiement sur /coaching puis formulaire de brief. Eva ne remplace pas un psychologue clinique.",
      ctaHref: "/contact",
      ctaLabel: "Contacter",
    },
    {
      intent: "faith_question",
      keys: ["prier", "priere", "foi", "eglise", "verset", "dieu", "spirituel"],
      answer:
        "Sur la vie spirituelle, KELIAA privilégie la régularité humble plutôt que la performance. Le module « Construire sa vie spirituelle » de l’Académie aide à poser un rythme réaliste. Je peux aussi vous orienter vers Inspiration. Quel aspect vous préoccupe : prière personnelle, couple, ou discernement ?",
      ctaHref: "/academie-mariage/foi",
      ctaLabel: "Module foi",
    },
  ]

  const hits: ScoredHit[] = []
  for (const row of bank) {
    let score = 0
    for (const k of row.keys) {
      if (q.includes(k)) score += 3
      for (const t of tokenize(k)) {
        if (tokens.has(t)) score += 1
      }
    }
    if (score > 0) {
      hits.push({
        score,
        intent: row.intent,
        answer: row.answer,
        ctaHref: row.ctaHref,
        ctaLabel: row.ctaLabel,
      })
    }
  }
  return hits.sort((a, b) => b.score - a.score)
}

async function callOpenAI(
  system: string,
  messages: EvaChatMessage[],
  question: string
): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY?.trim()
  if (!key) return null

  const model = process.env.OPENAI_EVA_MODEL?.trim() || "gpt-4o-mini"
  const payload = {
    model,
    temperature: 0.55,
    max_tokens: 550,
    messages: [
      { role: "system", content: system },
      ...messages.slice(-8).map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: question },
    ],
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      console.error("[eva] openai", res.status, await res.text())
      return null
    }
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }
    return data.choices?.[0]?.message?.content?.trim() || null
  } catch (e) {
    console.error("[eva] openai error", e)
    return null
  }
}

export async function runEvaEngine(input: {
  question: string
  history?: EvaChatMessage[]
  adminNotes?: string
}): Promise<EvaEngineResult> {
  const question = input.question.trim()
  if (!question) {
    return {
      answer: "Posez-moi une question concrète, je vous répondrai avec clarté.",
      intent: "empty",
      source: "guardrail",
    }
  }

  if (CRISIS_PATTERNS.test(question)) {
    return {
      answer:
        "Merci de m’avoir confié cela. Je ne peux pas vous accompagner seule ici. Si vous êtes en danger immédiat, contactez les secours locaux. Vous pouvez aussi écrire à contact@keliaa.org. Vous n’êtes pas seul(e).",
      intent: "crisis",
      source: "crisis",
      ctaHref: "/contact",
      ctaLabel: "Contacter l’équipe",
    }
  }

  if (FORBIDDEN.test(question) || extraForbiddenFromNotes(input.adminNotes)?.test(question)) {
    return {
      answer:
        "Je ne peux pas traiter ce sujet ici. Sur KELIAA, on reste dans le respect, la pudeur et le discernement. En quoi puis-je vous aider concernant votre parcours relationnel ou la plateforme ?",
      intent: "out_of_scope",
      source: "guardrail",
    }
  }

  const system = buildEvaSystemPrompt(input.adminNotes)
  const llm = await callOpenAI(system, input.history || [], question)
  if (llm) {
    const top = knowledgeHits(question)[0]
    return {
      answer: llm,
      intent: top?.intent || "llm",
      source: "openai",
      ctaHref: top?.ctaHref,
      ctaLabel: top?.ctaLabel,
    }
  }

  const hits = knowledgeHits(question)
  if (hits[0] && hits[0].score >= 2) {
    return {
      answer: hits[0].answer,
      intent: hits[0].intent,
      source: "knowledge",
      ctaHref: hits[0].ctaHref,
      ctaLabel: hits[0].ctaLabel,
    }
  }

  return {
    answer:
      "Merci pour votre question. Pour vous répondre juste : précisez si vous cherchez à comprendre KELIAA, à compléter vos tests, à préparer un mariage (Académie), ou à parler d’un point relationnel précis. En attendant, les questionnaires et l’Académie sont souvent le meilleur prochain pas. Si besoin : contact@keliaa.org.",
    intent: "clarify",
    source: "knowledge",
    ctaHref: "/assessments",
    ctaLabel: "Voir les tests",
  }
}
