/**
 * Composition du rapport — ordre doc 86.
 */

import {
  COUPLE_BRAND,
  COUPLE_CONTENT_VERSION,
  COUPLE_PROMISE,
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
import {
  describeGapPlain,
  interpretDimension,
  profileHighlights,
} from "@/lib/couple/interpretations"
import {
  scrubAiFiller,
  voirChoisirAgir,
  writeOICA,
} from "@/lib/couple/engine/charter"
import type {
  EngineResult,
  SelectedResource,
} from "@/lib/couple/engine/types"
import type {
  CoupleActionStep,
  CoupleExercise,
  CoupleReportDocument,
  CoupleReportNames,
  CoupleReportSection,
} from "@/lib/couple/report"

function section(
  id: string,
  title: string,
  subtitle: string | undefined,
  paragraphs: string[],
  blocks?: CoupleReportBlock[]
): CoupleReportSection {
  return {
    id,
    title,
    subtitle,
    paragraphs: paragraphs.map(scrubAiFiller),
    blocks,
  }
}

function resourceToExercise(
  sel: SelectedResource,
  names: CoupleReportNames
): CoupleExercise {
  const r = sel.resource
  return {
    id: r.id,
    title: r.title,
    objective: r.objective,
    why: sel.adaptedWhy,
    duration: r.duration,
    preparation: "Choisissez un moment calme. Téléphones de côté.",
    steps: sel.adaptedSteps,
    questions: sel.adaptedQuestions,
    share: "Partagez ce que vous avez écrit ou vécu — pas vos hypothèses sur l’autre.",
    debrief: "Ai-je été entendu(e) ? Ai-je écouté sans me justifier trop vite ?",
    takeaway: r.objective,
    nextAction: sel.adaptedSteps[sel.adaptedSteps.length - 1] ?? "Revenez à ce sujet dans 7 jours.",
    premiumPlus: r.premiumPlus,
    fillPrompts: sel.adaptedQuestions.slice(0, 3).map((q) => `${q}`),
    rolePlay:
      r.format === "exercice"
        ? {
            title: `Jeu de rôle — ${r.title}`,
            roleA: `${names.nameA} : exprime ton vécu en « je » (90 secondes).`,
            roleB: `${names.nameB} : reformule uniquement ce que tu as entendu.`,
            scene: r.why,
          }
        : undefined,
  }
}

function buildActionPlanFromEngine(
  engine: EngineResult,
  names: CoupleReportNames
): CoupleActionStep[] {
  const steps: CoupleActionStep[] = engine.synthesis.priorities.map((p, i) => {
    const ix = interpretDimension(p.card.pair, names)
    return {
      order: i + 1,
      what: `Priorité ${p.rank} — ${p.card.label}`,
      how: `${p.firstAction} Questions : ${ix.questions.slice(0, 2).join(" · ")}`,
      when:
        i === 0
          ? "Cette semaine (créneau 30 min)."
          : i === 1
            ? "Dans les 14 jours."
            : "Dans les 21 jours.",
      goal: scrubAiFiller(p.why).slice(0, 180),
      progressSignal: ix.actions[1] ?? "Vous pouvez citer un ajustement tenu.",
    }
  })

  steps.push({
    order: steps.length + 1,
    what: "Ensemble — check-in de 15 minutes",
    how: "Une joie, une friction, une demande, une gratitude.",
    when: "Chaque semaine, jour fixe.",
    goal: "Créer de la régularité.",
    progressSignal: "Le check-in a eu lieu au moins 3 semaines sur 4.",
  })

  if (!steps.length) {
    steps.push({
      order: 1,
      what: "Entretenir une convergence",
      how: "Relisez vos forces et choisissez un rituel hebdomadaire de 15 min.",
      when: "Cette semaine.",
      goal: "Ne pas laisser l’alignement s’user.",
      progressSignal: "Le rituel a eu lieu.",
    })
  }
  return steps
}

function buildPremiumPlusExtras(
  names: CoupleReportNames,
  engine: EngineResult
): CoupleReportSection[] {
  const top = engine.synthesis.priorities[0]?.card.label ?? "la communication"
  const a = names.nameA
  const b = names.nameB
  return [
    section(
      "pp-dynamique",
      "Analyse approfondie des dynamiques",
      "Qui initie · qui reçoit · qui répare",
      [
        `${a} et ${b} créent un système. ${engine.coupleMap.dynamicsSentence}`,
        "Observer qui initie, qui reçoit et qui répare est souvent plus utile qu’une note globale.",
      ],
      [
        { type: "h2", text: "À observer 14 jours" },
        {
          type: "ol",
          items: [
            "Qui initie les conversations sensibles ?",
            "Qui propose la réparation ?",
            "Une habitude à inverser une fois — puis noter le climat.",
          ],
        },
      ]
    ),
    section(
      "pp-scenarios",
      "Scénarios relationnels",
      "Trois situations types",
      [
        `Scénario rythme : sur « ${top} », l’un veut accélérer, l’autre ralentir. Cadre : décider si on décide aujourd’hui ou dans 7 jours.`,
        "Scénario silence après dispute : signal de pause + heure de reprise.",
        "Scénario sujet sensible : protocole 5 étapes Premium Plus.",
      ]
    ),
    section(
      "pp-protocole",
      "Protocole de conversation difficile",
      "25–30 minutes",
      [
        "Cadre → tour A → tour B → reformulation → demande → engagement daté.",
        "Tension qui monte → pause 20 min, puis reprise du protocole (pas du combat).",
      ],
      [
        {
          type: "ol",
          items: [
            "Cadre (2 min)",
            "Tour A / Tour B (5 min chacun)",
            "Reformulation croisée (5 min)",
            "Une demande chacun (3 min)",
            "Micro-engagement daté (2 min)",
          ],
        },
      ]
    ),
    section(
      "pp-charte",
      "Charte relationnelle",
      "5 engagements",
      [
        "Rédigez 5 engagements visibles. Relisez-les le 1er dimanche du mois.",
      ],
      [
        {
          type: "ul",
          items: [
            "Nous ne nous humilions pas, même en colère.",
            "Nous utilisons un signal de pause avant l’emballement.",
            "Nous réparons avant de « passer à autre chose ».",
            "Nous décidons ensemble au-delà du seuil convenu.",
            "Nous célébrons au moins une chose positive chaque semaine.",
          ],
        },
      ]
    ),
    section(
      "pp-suivi",
      "Suivi 7 et 21 jours",
      "Une priorité tenue",
      [
        "Jours 1–7 : une seule action liée à la priorité n°1.",
        "Jours 8–21 : élargir à un second geste si la première action tient.",
        "À J+21 : noter ce qui a bougé — même un peu.",
      ]
    ),
  ]
}

export function composeCoupleReport(args: {
  offerId: CoupleOfferId
  names: CoupleReportNames
  scoring: CoupleScoringResult
  engine: EngineResult
}): CoupleReportDocument {
  const { offerId, names, scoring, engine } = args
  const interpretation = interpretGlobalScore(scoring.globalScore)
  const syn = engine.synthesis
  const profA = profileHighlights(scoring, "A", names)
  const profB = profileHighlights(scoring, "B", names)

  const lookBlocks: CoupleReportBlock[] = [
    { type: "h2", text: "Forces" },
    {
      type: "ul",
      items: syn.forces.map(
        (c) =>
          `${c.label} — ${names.nameA} ${c.scoreA} % · ${names.nameB} ${c.scoreB} %`
      ),
    },
    { type: "h2", text: "Écarts à voir" },
    {
      type: "ul",
      items: syn.differences.map(
        (c) =>
          `${c.label} — écart ${c.gap} pts (${c.differenceClass.replaceAll("_", " ")})`
      ),
    },
    { type: "h2", text: "Priorités (max 3)" },
    {
      type: "ol",
      items: syn.priorities.map(
        (p) => `${p.card.label} — ${p.firstAction}`
      ),
    },
    {
      type: "callout",
      tone: "gold",
      text: syn.dynamicsSentence,
    },
  ]

  const sections: CoupleReportSection[] = [
    section(
      "accueil",
      "Message d’accueil",
      "Votre dossier commence ici",
      [
        `${names.nameA} et ${names.nameB}, bienvenue dans votre bilan ${COUPLE_BRAND}.`,
        COUPLE_PROMISE,
        "Ce dossier n’est pas un jugement sur votre avenir. C’est une carte : ce qui vous unit, ce qui vous différencie, ce que vous pouvez construire.",
      ],
      [
        {
          type: "ol",
          items: [
            "Un regard d’ensemble sur votre couple",
            "Deux portraits individuels",
            "Écarts classés, puis priorités et actions",
          ],
        },
      ]
    ),
    section(
      "intro",
      "Introduction personnalisée",
      "Comment utiliser ce bilan",
      [
        scrubAiFiller(
          `Pour ${names.nameA} et ${names.nameB}, ce bilan met surtout en lumière : ${
            syn.forces[0] ? `l’appui « ${syn.forces[0].label} »` : "vos convergences"
          }${
            syn.priorities[0]
              ? `, et le chantier « ${syn.priorities[0].card.label} »`
              : ""
          }.`
        ),
        "Lisez d’abord le regard d’ensemble et vos portraits. Puis les écarts. Les priorités et exercices viennent ensuite — une chose à la fois.",
        syn.dynamicsSentence,
      ]
    ),
    section(
      "regard",
      "Votre couple en un regard",
      interpretation.title,
      [
        `Score global : ${scoring.globalScore} %. ${interpretation.paragraph}`,
        `Appuis : ${syn.forces.map((f) => f.label).join(", ") || "à lire plus bas"}.`,
        `Priorités : ${syn.priorities.map((p) => p.card.label).join(", ") || "entretenir l’alignement"}.`,
      ],
      lookBlocks
    ),
    section(
      "score",
      "Score global — indicateur",
      interpretation.title,
      [
        `Score couple : ${scoring.globalScore} %.`,
        interpretation.paragraph,
        "Un score bas n’écrit pas « incompatibles ». Un score élevé n’écrit pas « rien à travailler ».",
      ],
      [
        {
          type: "callout",
          tone: "info",
          text: "Indicateur de dynamique — jamais un verdict d’avenir.",
        },
      ]
    ),
    section(
      "profil-a",
      `Portrait — ${names.nameA}`,
      "Ce que le test révèle de vous",
      profA.narrative,
      [
        { type: "h2", text: "Portrait" },
        ...profA.narrative.map((t) => ({
          type: "paragraph" as const,
          text: scrubAiFiller(t),
        })),
      ]
    ),
    section(
      "profil-b",
      `Portrait — ${names.nameB}`,
      "Ce que le test révèle de vous",
      profB.narrative,
      [
        { type: "h2", text: "Portrait" },
        ...profB.narrative.map((t) => ({
          type: "paragraph" as const,
          text: scrubAiFiller(t),
        })),
      ]
    ),
    section(
      "croisement",
      "Analyse croisée",
      "Quand vos deux profils se rencontrent",
      [
        syn.dynamicsSentence,
        `${names.nameA} apporte surtout : ${profA.highs.map((d) => d.label).join(", ")}.`,
        `${names.nameB} apporte surtout : ${profB.highs.map((d) => d.label).join(", ")}.`,
        "Là où vos scores divergent, le couple gagne à traduire le besoin derrière le chiffre — sans procès d’intention.",
      ],
      [
        { type: "h2", text: "Motif à deux" },
        { type: "paragraph", text: syn.dynamicsSentence },
        {
          type: "ul",
          items: syn.priorities.map(
            (p) =>
              `${p.card.label} — ${interpretDimension(p.card.pair, names).conflictPattern ?? "À clarifier ensemble."}`
          ),
        },
      ]
    ),
    (() => {
      const blocks: CoupleReportBlock[] = [
        {
          type: "callout",
          tone: "info",
          text: "Convergence = alignement de vos réponses sur un axe. Ce n’est ni une note d’amour ni une garantie.",
        },
      ]
      for (const c of syn.convergences.slice(0, 3)) {
        const ix = interpretDimension(c.pair, names)
        const oica = writeOICA({
          observation: describeGapPlain(c.pair, names),
          interpretation: ix.meaning,
          consequence: "Cette proximité facilite la confiance si elle est nommée.",
          action: ix.actions[0] ?? "Nommer cette force à voix haute cette semaine.",
        })
        blocks.push(
          { type: "h2", text: c.label },
          { type: "paragraph", text: `1) ${oica[0]}` },
          { type: "paragraph", text: `2) ${oica[1]}` },
          { type: "paragraph", text: `3) ${oica[3]}` }
        )
      }
      return section(
        "convergences",
        "Forces & convergences",
        "Ce qui vous porte déjà",
        syn.convergences.map((c) => interpretDimension(c.pair, names).meaning),
        blocks
      )
    })(),
    (() => {
      const gaps = syn.differences
      const blocks: CoupleReportBlock[] = [
        {
          type: "callout",
          tone: "gold",
          text: "Ici : décrire l’écart. Les actions sont dans « Priorités de travail ».",
        },
      ]
      for (const c of gaps) {
        const ix = interpretDimension(c.pair, names)
        blocks.push(
          {
            type: "h2",
            text: `${c.differenceClass.replaceAll("_", " ")} — ${c.label}`,
          },
          { type: "paragraph", text: describeGapPlain(c.pair, names) },
          { type: "paragraph", text: `Ce que mesure cet axe : ${ix.measures}` },
          { type: "paragraph", text: ix.meaning },
          { type: "paragraph", text: ix.notConclude }
        )
      }
      return section(
        "ecarts",
        "Écarts à clarifier",
        "D’abord comprendre ce qui diffère",
        gaps.map((c) => `${describeGapPlain(c.pair, names)} ${interpretDimension(c.pair, names).meaning}`),
        blocks
      )
    })(),
    section(
      "vigilance",
      "Zones de vigilance",
      "Ton prudent — sans répéter tout l’écart",
      syn.vigilances.length
        ? syn.vigilances.slice(0, 3).map(
            (c) =>
              `${c.label} : écart ${c.gap} pts — attention « ${c.attention.replaceAll("_", " ")} ». Détail dans Écarts / Priorités.`
          )
        : ["Aucune vigilance majeure aux seuils actuels."],
      [
        {
          type: "callout",
          tone: "alert",
          text: "Vigilance = signal pour ralentir et clarifier — pas une accusation.",
        },
        {
          type: "ul",
          items: syn.vigilances.slice(0, 3).map(
            (c) =>
              `${c.label} — ${names.nameA} ${c.scoreA} % · ${names.nameB} ${c.scoreB} %`
          ),
        },
      ]
    ),
    (() => {
      const blocks: CoupleReportBlock[] = [
        {
          type: "callout",
          tone: "alert",
          text: "Maximum 3 priorités. Une priorité tenue vaut dix intentions.",
        },
      ]
      for (const p of syn.priorities) {
        const ix = interpretDimension(p.card.pair, names)
        const showChart = p.rank <= 3
        blocks.push(
          { type: "h2", text: `Priorité ${p.rank} — ${p.card.label}` },
          ...(showChart
            ? [
                {
                  type: "scoreChart" as const,
                  label: p.card.label,
                  scoreA: p.card.scoreA,
                  scoreB: p.card.scoreB,
                  nameA: names.nameA,
                  nameB: names.nameB,
                  convergence: p.card.convergence,
                },
              ]
            : []),
          { type: "paragraph", text: describeGapPlain(p.card.pair, names) },
          { type: "paragraph", text: `Pourquoi : ${p.why}` },
          {
            type: "paragraph",
            text: `Si non traité, cela peut se manifester comme : ${ix.conflictPattern ?? "frustration répétée ou silence."}`,
          },
          { type: "h2", text: "Questions pour échanger" },
          { type: "ol", items: ix.questions },
          { type: "h2", text: "Première action" },
          { type: "paragraph", text: p.firstAction },
          ...(p.resourceIds.length
            ? [
                {
                  type: "ul" as const,
                  items: p.resourceIds.map((id) => `Ressource : ${id}`),
                },
              ]
            : [])
        )
      }
      return section(
        "priorites",
        "Priorités de travail",
        "Pourquoi · observer · agir",
        syn.priorities.map(
          (p) =>
            `Priorité ${p.rank} — ${p.card.label}. ${describeGapPlain(p.card.pair, names)} ${p.firstAction}`
        ),
        blocks
      )
    })(),
    section(
      "ressources",
      "Ressources pour vous",
      "Sélectionnées pour votre profil",
      engine.selectedResources.slice(0, 8).map(
        (s) =>
          `${s.resource.title} (${s.resource.format}) — ${s.adaptedWhy}`
      ),
      [
        {
          type: "ul",
          items: engine.selectedResources.slice(0, 8).map(
            (s) =>
              `${s.resource.title} · ${s.resource.duration} · ${s.resource.format}`
          ),
        },
      ]
    ),
    section(
      "conclusion",
      "Conclusion & prochaine étape",
      "Voir · Choisir · Agir",
      voirChoisirAgir({
        voir: syn.dynamicsSentence,
        choisir: syn.priorities[0]
          ? `Priorité n°1 : ${syn.priorities[0].card.label}`
          : "Entretenir une force cette semaine",
        agir: syn.priorities[0]?.firstAction ?? "Un check-in de 15 minutes à deux.",
      }),
      [
        {
          type: "callout",
          tone: "gold",
          text: voirChoisirAgir({
            voir: "Ce qui unit et ce qui diffère",
            choisir: syn.priorities[0]?.card.label ?? "Une force à cultiver",
            agir: syn.priorities[0]?.firstAction ?? "Check-in 15 min",
          }).join(" · "),
        },
      ]
    ),
  ]

  const premiumPlusExtras = isPremiumPlusOffer(offerId)
    ? buildPremiumPlusExtras(names, engine)
    : []

  const exerciseResources = engine.selectedResources.filter(
    (s) => s.resource.format === "exercice" || s.resource.format === "protocole"
  )
  const exercises = exerciseResources
    .slice(0, isPremiumPlusOffer(offerId) ? 6 : 4)
    .map((s) => resourceToExercise(s, names))

  // Toujours au moins 2 exercices
  if (exercises.length < 2) {
    const extras = engine.selectedResources
      .filter((s) => !exercises.find((e) => e.id === s.resource.id))
      .slice(0, 2 - exercises.length)
    for (const s of extras) exercises.push(resourceToExercise(s, names))
  }

  const actionPlan = buildActionPlanFromEngine(engine, names)
  if (isPremiumPlusOffer(offerId)) {
    actionPlan.push({
      order: actionPlan.length + 1,
      what: "Appliquer le protocole de conversation difficile une fois",
      how: "Chronomètre en main — section Premium Plus.",
      when: "Dans les 14 jours.",
      goal: "Terminer les 5 étapes sans humiliation.",
      progressSignal: "Protocole complété.",
    })
  }

  let safetyNotice: string | null = null
  if (scoring.safetyFlags.includes("limites_securite")) {
    safetyNotice =
      "Certaines réponses touchent à la sécurité relationnelle et au respect des limites. Ce bilan ne pose aucun diagnostic. Si vous vous sentez en danger, diminué(e) ou contrôlé(e), contactez un professionnel compétent. Les exercices de communication ne remplacent pas une mise en sécurité."
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
    sections,
    exercises,
    actionPlan,
    premiumPlusExtras,
    safetyNotice,
  }
}
