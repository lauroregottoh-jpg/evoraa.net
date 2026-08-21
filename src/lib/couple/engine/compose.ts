/**
 * Composition = document maître littéral + injection résultats tests.
 * Source unique : KELIAA COUPLE™.md / Premium Plus.md (sync-master-md).
 */

import {
  COUPLE_BRAND,
  COUPLE_CONTENT_VERSION,
  COUPLE_QUESTIONNAIRE_VERSION,
  COUPLE_REPORT_VERSION,
  COUPLE_SCORING_VERSION,
  COUPLE_TAGLINE,
} from "@/lib/couple/config"
import { isPremiumPlusOffer, type CoupleOfferId } from "@/lib/couple/offers"
import {
  interpretGlobalScore,
  type CoupleScoringResult,
} from "@/lib/couple/scoring"
import type { CoupleReportBlock } from "@/lib/couple/reportBlocks"
import type { EngineResult } from "@/lib/couple/engine/types"
import type {
  CoupleActionStep,
  CoupleExercise,
  CoupleReportDocument,
  CoupleReportNames,
  CoupleReportSection,
} from "@/lib/couple/report"
import { PREMIUM_MASTER_CHAPTERS } from "@/lib/couple/engine/masters/content/premiumChapters"
import { PREMIUM_PLUS_MASTER_POINTS } from "@/lib/couple/engine/masters/content/premiumPlusPoints"
import {
  injectMasterTokens,
  markdownToBlocks,
} from "@/lib/couple/engine/masters/mdToBlocks"
import {
  buildCoupleInsightProfile,
  type CoupleInsightProfile,
} from "@/lib/couple/engine/insightProfile"
import type { CoupleDimensionId } from "@/lib/couple/questionBank"

const SKIP_CHAPTER_IDS = new Set([
  "22-directive-de-production-pour-le-moteur-keliaa-couple",
  "keliaa-couple",
])

function isDemoCouple(names: CoupleReportNames): boolean {
  return (
    names.nameA.trim().toLowerCase() === "daniel" &&
    names.nameB.trim().toLowerCase() === "naomi"
  )
}

function enrichVisuals(
  chapterId: string,
  chapterTitle: string,
  blocks: CoupleReportBlock[],
  names: CoupleReportNames,
  scoring: CoupleScoringResult,
  engine: EngineResult
): CoupleReportBlock[] {
  let out = [...blocks]
  const dim = (id: CoupleDimensionId) =>
    scoring.dimensions.find((d) => d.dimension === id)

  // Transformer listes « convergence / attention » du maître en cartes visuelles (mêmes mots)
  out = promoteMasterListsToCards(out)

  // Cartes relationnelles (chapitres courts du maître) → carte visuelle
  if (
    /^(ce-qui-vous|ce-qui-peut|ce-que-vous-devez|votre-equilibre|votre-point-d|votre-prochaine)/i.test(
      chapterId
    )
  ) {
    const paras = out.filter((b) => b.type === "paragraph")
    if (paras.length >= 1) {
      out.unshift({
        type: "visualCards",
        title: chapterTitle,
        cards: [
          {
            label: chapterTitle,
            body: paras
              .map((p) => (p.type === "paragraph" ? p.text : ""))
              .join(" "),
          },
        ],
      })
    }
  }

  // Règles communes → callout (texte maître)
  if (/regle/i.test(chapterId) || /règle|regle/i.test(chapterTitle)) {
    const idx = out.findIndex((b) => b.type === "paragraph")
    if (idx >= 0 && out[idx]!.type === "paragraph") {
      out[idx] = {
        type: "callout",
        text: out[idx]!.text,
        tone: "gold",
      }
    }
  }

  // Regard — jauges issues des résultats (données test), en plus du texte maître
  if (chapterId.includes("regard") || chapterId.includes("un-regard")) {
    const prios = engine.synthesis.priorities.slice(0, 3)
    for (const p of prios) {
      out.push({
        type: "scoreChart",
        label: p.card.label,
        scoreA: p.card.scoreA,
        scoreB: p.card.scoreB,
        nameA: names.nameA,
        nameB: names.nameB,
        convergence: p.card.convergence,
      })
    }
  }

  // Chapitres différences — jauge de la dimension concernée
  if (chapterId.includes("finance")) {
    const f = dim("finances")
    if (f) {
      out.unshift({
        type: "scoreChart",
        label: "Finances",
        scoreA: f.scoreA,
        scoreB: f.scoreB,
        nameA: names.nameA,
        nameB: names.nameB,
        convergence: f.convergence,
      })
    }
  }
  if (chapterId.includes("projet-de-vie") || chapterId.includes("projet_vie")) {
    const f = dim("projet_vie")
    if (f) {
      out.unshift({
        type: "scoreChart",
        label: "Projet de vie",
        scoreA: f.scoreA,
        scoreB: f.scoreB,
        nameA: names.nameA,
        nameB: names.nameB,
        convergence: f.convergence,
      })
    }
  }
  if (chapterId.includes("carriere") || chapterId.includes("aspirations")) {
    const f = dim("carriere")
    if (f) {
      out.unshift({
        type: "scoreChart",
        label: "Carrière et aspirations",
        scoreA: f.scoreA,
        scoreB: f.scoreB,
        nameA: names.nameA,
        nameB: names.nameB,
        convergence: f.convergence,
      })
    }
  }

  // Carte relationnelle sommaire
  if (
    chapterId.includes("carte-relationnelle") ||
    chapterId.includes("carte-finale") ||
    chapterId.includes("23-votre-carte")
  ) {
    const cards: Array<{ label: string; body: string }> = []
    for (let i = 0; i < out.length; i++) {
      const b = out[i]
      if (b?.type === "h2") {
        const next = out[i + 1]
        if (next?.type === "paragraph") {
          cards.push({ label: b.text, body: next.text })
        }
      }
    }
    if (cards.length >= 2) {
      out.unshift({
        type: "visualCards",
        title: chapterTitle,
        cards: cards.slice(0, 8),
      })
    }
  }

  return out
}

/** Listes du maître sous titres convergence/attention → cartes (texte inchangé). */
function promoteMasterListsToCards(
  blocks: CoupleReportBlock[]
): CoupleReportBlock[] {
  const out: CoupleReportBlock[] = []
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i]!
    const next = blocks[i + 1]
    if (
      b.type === "h2" &&
      next &&
      (next.type === "ul" || next.type === "ol") &&
      /convergence|attention|retenir|points? (de |d')|forces?|ce que vous|ce qui vous|votre règle|équilibre/i.test(
        b.text
      )
    ) {
      out.push({
        type: "visualCards",
        title: b.text,
        cards: next.items.map((item) => {
          const parts = item.split(/:\s*/)
          if (parts.length >= 2) {
            return {
              label: parts[0]!.replace(/\*\*/g, "").trim(),
              body: parts.slice(1).join(": ").replace(/\*\*/g, "").trim(),
            }
          }
          return { label: "Point", body: item }
        }),
      })
      i++ // skip list
      continue
    }
    out.push(b)
  }
  return out
}

function chapterToSection(
  ch: { id: string; title: string; subtitle?: string; markdown: string },
  names: CoupleReportNames,
  scoring: CoupleScoringResult,
  engine: EngineResult,
  keepDemoNames: boolean,
  insight: CoupleInsightProfile | null
): CoupleReportSection {
  const insightSlots =
    !keepDemoNames && insight
      ? {
          forces: insight.forces,
          attentions: insight.attentions,
          priorityLabels: insight.priorityLabels,
          dynamicsSentence: insight.dynamicsSentence,
        }
      : undefined

  const injected = injectMasterTokens(ch.markdown, {
    nameA: names.nameA,
    nameB: names.nameB,
    globalScore: scoring.globalScore,
    keepDemoNames,
    insight: insightSlots,
  })
  const title = injectMasterTokens(ch.title, {
    nameA: names.nameA,
    nameB: names.nameB,
    globalScore: scoring.globalScore,
    keepDemoNames,
    insight: insightSlots,
  })
  const subtitle = ch.subtitle
    ? injectMasterTokens(ch.subtitle, {
        nameA: names.nameA,
        nameB: names.nameB,
        globalScore: scoring.globalScore,
        keepDemoNames,
        insight: insightSlots,
      })
    : undefined

  let blocks = markdownToBlocks(injected)
  blocks = blocks.map((b) =>
    b.type === "cycleFlow" && /cycle/i.test(ch.id + ch.title)
      ? { ...b, title: title.replace(/^#\s*/, "").trim() || b.title }
      : b
  )
  blocks = enrichVisuals(ch.id, ch.title, blocks, names, scoring, engine)

  const paragraphs = blocks
    .filter((b) => b.type === "paragraph")
    .map((b) => (b.type === "paragraph" ? b.text : ""))

  return {
    id: ch.id,
    title,
    subtitle,
    paragraphs:
      paragraphs.length > 0
        ? paragraphs.slice(0, 8)
        : [`Chapitre — ${title}`],
    blocks,
  }
}

/** Map priorités → Points PP du MD (ids slugifiés). */
function selectPpPointIds(engine: EngineResult): string[] {
  const dims = new Set(
    engine.synthesis.priorities.map((p) => p.card.dimension)
  )
  const ids: string[] = [
    "point-1-comprendre-votre-dynamique-profonde",
  ]
  if (
    dims.has("finances") ||
    dims.has("projet_vie") ||
    dims.has("carriere") ||
    dims.has("decision")
  ) {
    ids.push("point-2-vos-differences-dans-la-prise-de-decision")
  }
  if (dims.has("communication") || dims.has("conflits")) {
    ids.push("point-3-votre-communication-sous-tension")
  }
  if (dims.has("affection") || dims.has("intimite") || dims.has("emotions")) {
    ids.push("point-4-affection-proximite-et-sentiment-d-etre-aime")
  }
  if (dims.has("finances")) {
    ids.push("point-7-argent-securite-et-projet-commun")
  }
  if (dims.has("famille") || dims.has("limites") || dims.has("roles")) {
    ids.push("point-8-familles-entourage-et-frontieres-du-couple")
  }
  if (dims.has("enfants")) {
    ids.push("point-13-parentalite-education-et-vision-de-la-famille")
  }
  // Toujours un plan d’action PP si dispo
  ids.push("point-17-votre-plan-d-action-a-30-60-et-90-jours")
  return [...new Set(ids)].slice(0, 6)
}

function extractExercisesFromSections(
  sections: CoupleReportSection[]
): CoupleExercise[] {
  const out: CoupleExercise[] = []
  for (const s of sections) {
    if (!/exercice/i.test(s.title)) continue
    const steps = (s.blocks || [])
      .filter((b) => b.type === "ol")
      .flatMap((b) => (b.type === "ol" ? b.items : []))
    const fills = (s.blocks || [])
      .filter((b) => b.type === "fillBlank")
      .map((b) => (b.type === "fillBlank" ? b.prompt : ""))
    out.push({
      id: s.id,
      title: s.title,
      objective: s.subtitle || "Exercice du bilan maître",
      why: s.paragraphs[0] || "",
      duration: "30–45 min",
      preparation: "Répondez d’abord seul(e), puis partagez.",
      steps: steps.length ? steps : ["Lire la consigne", "Écrire", "Partager"],
      questions: fills.slice(0, 5),
      share: "Reformulez avant d’argumenter.",
      debrief: "Qu’avez-vous compris du besoin de l’autre ?",
      takeaway: s.paragraphs[s.paragraphs.length - 1] || s.title,
      nextAction: "Revenir sur cet exercice dans 7 jours.",
      fillPrompts: fills.slice(0, 4),
    })
  }
  return out.slice(0, 8)
}

function buildActionFromPlanText(
  sections: CoupleReportSection[]
): CoupleActionStep[] {
  const plan = sections.find((s) => /plan d.action/i.test(s.title))
  if (!plan) {
    return [
      {
        order: 1,
        what: "Relire la priorité n°1 ensemble",
        how: "20 minutes, sans téléphone",
        when: "Cette semaine",
        goal: "Une règle écrite",
        progressSignal: "Règle notée",
      },
    ]
  }
  const items = (plan.blocks || [])
    .filter((b) => b.type === "ol" || b.type === "ul")
    .flatMap((b) => (b.type === "ol" || b.type === "ul" ? b.items : []))
  if (!items.length) {
    return plan.paragraphs.slice(0, 4).map((p, i) => ({
      order: i + 1,
      what: p.slice(0, 80),
      how: p,
      when: i === 0 ? "Cette semaine" : "Prochaines semaines",
      goal: "Avancer d’un cran",
      progressSignal: "Fait / noté",
    }))
  }
  return items.slice(0, 6).map((it, i) => ({
    order: i + 1,
    what: it.slice(0, 100),
    how: it,
    when: i < 2 ? "Cette semaine" : "Prochaines semaines",
    goal: "Mettre en pratique",
    progressSignal: "Fait",
  }))
}

export function composeCoupleReport(args: {
  offerId: CoupleOfferId
  names: CoupleReportNames
  scoring: CoupleScoringResult
  engine: EngineResult
}): CoupleReportDocument {
  const { offerId, names, scoring, engine } = args
  const interpretation = interpretGlobalScore(scoring.globalScore)
  const keepDemoNames = isDemoCouple(names)
  const insight = keepDemoNames
    ? null
    : buildCoupleInsightProfile({ names, scoring, engine })

  const premiumSections = PREMIUM_MASTER_CHAPTERS.filter(
    (c) => !SKIP_CHAPTER_IDS.has(c.id) && !/^directive/i.test(c.title)
  ).map((c) =>
    chapterToSection(c, names, scoring, engine, keepDemoNames, insight)
  )

  const ppIds = selectPpPointIds(engine)

  function pointMatches(pointId: string, want: string) {
    if (pointId === want) return true
    const num = /^point-(\d+)/.exec(want)?.[1]
    if (num && pointId.startsWith(`point-${num}-`)) return true
    return false
  }

  const ppExtras = isPremiumPlusOffer(offerId)
    ? PREMIUM_PLUS_MASTER_POINTS.filter((p) =>
        ppIds.some((id) => pointMatches(p.id, id))
      )
        .sort((a, b) => {
          const ia = ppIds.findIndex((id) => pointMatches(a.id, id))
          const ib = ppIds.findIndex((id) => pointMatches(b.id, id))
          return ia - ib
        })
        .slice(0, 6)
        .map((c) =>
          chapterToSection(c, names, scoring, engine, keepDemoNames, insight)
        )
    : []

  const allForExercises = [...premiumSections, ...ppExtras]
  const exercises = extractExercisesFromSections(allForExercises)
  const actionPlan = buildActionFromPlanText(premiumSections)

  let safetyNotice: string | null = null
  if (scoring.safetyFlags.includes("limites_securite")) {
    safetyNotice =
      "Certaines réponses touchent à la sécurité relationnelle et au respect des limites. Ce bilan ne pose aucun diagnostic. Si vous vous sentez en danger, diminué(e) ou contrôlé(e), contactez un professionnel compétent."
  }

  return {
    brand: COUPLE_BRAND,
    tagline: COUPLE_TAGLINE,
    offerId,
    names,
    globalScore: scoring.globalScore,
    scoreInterpretation: interpretation,
    versions: {
      questionnaire_version: COUPLE_QUESTIONNAIRE_VERSION,
      scoring_version: COUPLE_SCORING_VERSION,
      content_version: COUPLE_CONTENT_VERSION,
      report_version: COUPLE_REPORT_VERSION,
      offer: offerId,
      generation_date: new Date().toISOString(),
    },
    sections: premiumSections,
    exercises:
      exercises.length > 0
        ? exercises
        : [
            {
              id: "ex-master",
              title: "Exercices du bilan",
              objective: "Voir les chapitres Exercice du rapport",
              why: "Les exercices sont intégrés dans les pages du document maître.",
              duration: "selon chapitre",
              preparation: "Ouvrir le chapitre exercice correspondant.",
              steps: ["Aller au chapitre exercice", "Compléter les zones", "Partager"],
              questions: [],
              share: "À deux",
              debrief: "Qu’avez-vous retenu ?",
              takeaway: "Une règle commune",
              nextAction: "Appliquer cette semaine",
            },
          ],
    actionPlan,
    premiumPlusExtras: ppExtras,
    safetyNotice,
  }
}
