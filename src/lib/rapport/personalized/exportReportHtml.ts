/**
 * Export HTML du Rapport Personnalisé Alliance — téléchargeable / imprimable.
 * Source unique : LivingPersonalizedReport (mêmes données que /rapport/global).
 */

import type { LivingPersonalizedReport } from "@/lib/rapport/personalized/buildLivingReport"

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function paras(text: string): string {
  return text
    .split(/\n\n+/)
    .map((p) => `<p>${esc(p).replace(/\n/g, "<br/>")}</p>`)
    .join("\n")
}

function list(items: string[]): string {
  if (!items.length) return ""
  return `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`
}

export function renderReportExportHtml(input: {
  firstName: string
  living: LivingPersonalizedReport
  generatedAtLabel: string
}): string {
  const { living } = input
  const name = input.firstName.trim() || "Membre"
  const complete = living.documentMode === "complete"
  const title = complete
    ? "Rapport Personnalisé Alliance™ — Complet"
    : "Rapport Personnalisé Alliance™ — En cours"

  const byId = (id: string) => living.chapters.find((c) => c.id === id)
  const forces = byId("forces")
  const vigilances = byId("vigilances")
  const plan = byId("plan")
  const conclusion = byId("conclusion")
  const evolution = byId("evolution")
  const synthese = byId("synthese")
  const portrait = byId("portrait")
  const resume = byId("resume")

  const detailIds = [
    "communication",
    "conflits",
    "intelligence_emotionnelle",
    "valeurs",
    "vision_mariage",
    "projet_de_vie",
    "finances",
    "spiritualite",
  ]

  const sections: string[] = []

  sections.push(`
<header class="cover">
  <p class="brand">KELIAA ALLIANCE™</p>
  <h1>${esc(title)}</h1>
  <p class="sub">Préparation au Mariage</p>
  <div class="meta">
    <p><strong>${esc(living.confidentialLabel)}</strong></p>
    <p>Nom : ${esc(name)}</p>
    <p>Date : ${esc(input.generatedAtLabel)}</p>
    <p>Version : ${esc(living.versionLabel)}</p>
    <p>Évaluations : ${living.testsCompleted} / ${living.essentialsTotal}</p>
    <p>Complétude : ${living.completenessPercent} %</p>
    <p>${esc(living.indexLabel)} : ${
      living.globalIndex != null ? `${living.globalIndex} / 100` : "En cours"
    }</p>
  </div>
</header>`)

  sections.push(`
<section>
  <h2>Bienvenue</h2>
  ${paras(living.welcomeBody)}
</section>`)

  if (living.statusBlock) {
    sections.push(`
<section>
  <h2>Où en êtes-vous aujourd’hui ?</h2>
  ${paras(living.statusBlock.intro)}
  <h3>À ce stade, votre rapport comprend</h3>
  ${list(living.statusBlock.included)}
  <h3>Les évaluations restantes permettront d’approfondir</h3>
  ${list(living.statusBlock.remaining)}
</section>`)
  }

  if (living.glance) {
    sections.push(`
<section>
  <h2>Votre portrait en un regard</h2>
  <p class="stars">${esc(living.glance.stars)}</p>
  <p><strong>${living.glance.score} / 100</strong></p>
  ${paras(living.glance.narrative)}
  <h3>Vos principales forces</h3>
  ${list(living.glance.forceLabels.map((f) => `✓ ${f}`))}
  <h3>Priorités à impact</h3>
  ${list(living.glance.priorities.map((p) => `• ${p}`))}
</section>`)
  }

  if (resume?.body) {
    sections.push(`
<section>
  <h2>${esc(resume.title)}</h2>
  ${paras(resume.body)}
</section>`)
  }

  if (portrait?.body) {
    sections.push(`
<section>
  <h2>Votre portrait relationnel</h2>
  ${paras(portrait.body)}
</section>`)
  }

  if (forces?.insightCards?.length) {
    const blocks = forces.insightCards
      .filter((c) => c.kind === "force")
      .map(
        (c, i) =>
          `<h3>${i + 1}. ${esc(c.title)}</h3>${paras(c.description)}`
      )
      .join("\n")
    sections.push(`
<section>
  <h2>${esc(forces.title)}</h2>
  ${forces.body ? paras(forces.body) : ""}
  ${blocks}
</section>`)
  }

  if (vigilances?.insightCards?.length) {
    const blocks = vigilances.insightCards
      .filter((c) => c.kind === "vigilance")
      .map((c) => `<h3>${esc(c.title)}</h3>${paras(c.description)}`)
      .join("\n")
    sections.push(`
<section>
  <h2>${esc(vigilances.title)}</h2>
  ${vigilances.body ? paras(vigilances.body) : ""}
  ${blocks}
</section>`)
  }

  if (living.nextStep) {
    sections.push(`
<section>
  <h2>Votre prochaine étape</h2>
  <p>${esc(living.nextStep.completenessNote)}</p>
  <p>Évaluation recommandée : <strong>${esc(living.nextStep.title)}</strong></p>
  <p>Lien : ${esc(living.nextStep.href)}</p>
  ${list(living.nextStep.why)}
</section>`)
  }

  for (const id of detailIds) {
    const ch = byId(id)
    if (!ch) continue
    if (!ch.unlocked) {
      const pending = (ch.sections || [])
        .map((s) => `<h3>${esc(s.heading)}</h3>${paras(s.body)}`)
        .join("\n")
      sections.push(`
<section class="pending">
  <h2>${esc(ch.title)} — Analyse en attente</h2>
  ${pending}
  <p><strong>${esc(ch.unlockHint || "Complétez l’évaluation correspondante.")}</strong></p>
  ${ch.unlockHref ? `<p>Test rattaché : ${esc(ch.unlockHref)}</p>` : ""}
</section>`)
    } else {
      const body = (ch.sections || [])
        .map((s) => `<h3>${esc(s.heading)}</h3>${paras(s.body)}`)
        .join("\n")
      sections.push(`
<section>
  <h2>${esc(ch.title)}</h2>
  ${body || (ch.body ? paras(ch.body) : "")}
</section>`)
    }
  }

  if (synthese?.body) {
    sections.push(`
<section>
  <h2>${esc(synthese.title)}</h2>
  ${paras(synthese.body)}
</section>`)
  }

  if (plan) {
    const planBlocks = (plan.insightCards || [])
      .map(
        (c, i) =>
          `<h3>Priorité n°${i + 1} — ${esc(c.title)}</h3>${paras(c.description)}`
      )
      .join("\n")
    const months = (plan.sections || [])
      .map((s) => `<h3>${esc(s.heading)}</h3>${paras(s.body)}`)
      .join("\n")
    sections.push(`
<section>
  <h2>${esc(plan.title)}</h2>
  ${plan.body ? paras(plan.body) : ""}
  ${planBlocks}
  ${months}
</section>`)
  }

  if (evolution?.body) {
    sections.push(`
<section>
  <h2>${esc(evolution.title)}</h2>
  ${paras(evolution.body)}
  ${list(evolution.bullets || [])}
</section>`)
  }

  if (conclusion?.body) {
    sections.push(`
<section>
  <h2>${esc(conclusion.title)}</h2>
  ${paras(conclusion.body)}
  ${list(conclusion.bullets || [])}
  <p class="sign">L’équipe KELIAA Alliance — « Mieux se connaître aujourd’hui pour construire une relation durable demain. »</p>
</section>`)
  }

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>${esc(title)} — ${esc(name)}</title>
  <style>
    :root { --ink:#1C1412; --gold:#B8954A; --muted:#5c534c; }
    body { font-family: Georgia, "Times New Roman", serif; color: var(--ink); line-height: 1.55; max-width: 720px; margin: 0 auto; padding: 2.5rem 1.25rem 4rem; }
    .brand { letter-spacing: .22em; text-transform: uppercase; font-size: .7rem; color: var(--gold); font-weight: 700; }
    h1 { font-size: 2rem; margin: .4rem 0; }
    h2 { font-size: 1.45rem; margin: 2rem 0 .75rem; border-bottom: 1px solid #e8dfd0; padding-bottom: .35rem; }
    h3 { font-size: 1.05rem; margin: 1.1rem 0 .4rem; }
    .sub { color: var(--muted); }
    .meta { background: #f7f1e6; border: 1px solid #e4d5b5; border-radius: 12px; padding: 1rem 1.1rem; margin-top: 1.25rem; }
    .meta p { margin: .25rem 0; font-size: .95rem; }
    p { margin: .55rem 0; }
    ul { margin: .4rem 0 .8rem 1.1rem; }
    li { margin: .25rem 0; }
    .stars { letter-spacing: .12em; color: var(--gold); font-size: 1.2rem; }
    .pending { opacity: .92; border-left: 3px solid #d4c4a0; padding-left: 1rem; }
    .sign { font-style: italic; color: var(--muted); margin-top: 1.5rem; }
    @media print {
      body { padding: 0; }
      .pending { break-inside: avoid; }
      section { break-inside: avoid; }
    }
  </style>
</head>
<body>
${sections.join("\n")}
</body>
</html>`
}
