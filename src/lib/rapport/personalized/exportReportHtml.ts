/**
 * Export HTML imprimable du Rapport Alliance — avec visuels premium
 * (anneaux, barres, étoiles, cadres, timeline, grille dimensions).
 */

import type { LivingPersonalizedReport } from "@/lib/rapport/personalized/buildLivingReport"
import type { InsightCard } from "@/lib/rapport/personalized/insightCards"

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

function list(items: string[], bullet = "·"): string {
  if (!items.length) return ""
  return `<ul class="plain">${items
    .map((i) => `<li><span class="b">${esc(bullet)}</span> ${esc(i)}</li>`)
    .join("")}</ul>`
}

function scoreRingSvg(
  value: number,
  label: string,
  gradId: string,
  size = 120
): string {
  const pct = Math.max(0, Math.min(100, Math.round(value)))
  const stroke = 9
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  return `
  <div class="ring-wrap">
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="ring" aria-hidden="true">
      <defs>
        <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F3D9A4"/>
          <stop offset="55%" stop-color="#B8954A"/>
          <stop offset="100%" stop-color="#8A6A2E"/>
        </linearGradient>
      </defs>
      <g transform="rotate(-90 ${size / 2} ${size / 2})">
        <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="rgba(215,184,102,0.2)" stroke-width="${stroke}"/>
        <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="url(#${gradId})" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"/>
      </g>
    </svg>
    <div class="ring-label">
      <strong>${pct}</strong>
      <span>/ 100</span>
      <em>${esc(label)}</em>
    </div>
  </div>`
}

function forceBarsHtml(
  items: { label: string; value?: number }[]
): string {
  if (!items.length) return ""
  return `<div class="bars">${items
    .map((item, i) => {
      const v =
        typeof item.value === "number"
          ? Math.max(35, Math.min(98, Math.round(item.value)))
          : Math.max(55, 92 - i * 8)
      return `
      <div class="bar-row">
        <div class="bar-meta"><span>${esc(item.label)}</span><b>${v}</b></div>
        <div class="bar-track"><div class="bar-fill" style="width:${v}%"></div></div>
      </div>`
    })
    .join("")}</div>`
}

function starsHtml(score: number): string {
  const filled = Math.max(0, Math.min(10, Math.round(score / 10)))
  let out = '<div class="stars" aria-label="' + filled + ' sur 10">'
  for (let i = 0; i < 10; i++) {
    out += `<span class="${i < filled ? "on" : "off"}">★</span>`
  }
  out += "</div>"
  return out
}

function chapterDotsHtml(
  items: { title: string; unlocked: boolean }[]
): string {
  const done = items.filter((i) => i.unlocked).length
  return `
  <div class="dims">
    <div class="dims-head"><span>Dimensions analysées</span><b>${done}/${items.length}</b></div>
    <div class="dims-grid">
      ${items
        .map(
          (it) =>
            `<div class="dim ${it.unlocked ? "ok" : "wait"}" title="${esc(it.title)}">${it.unlocked ? "✓" : "·"}</div>`
        )
        .join("")}
    </div>
    <div class="dims-legend">
      ${items
        .map(
          (it) =>
            `<span class="${it.unlocked ? "ok" : "wait"}">${it.unlocked ? "●" : "○"} ${esc(it.title)}</span>`
        )
        .join("")}
    </div>
  </div>`
}

function monthTimelineHtml(
  months: { heading: string; body: string }[]
): string {
  if (!months.length) return ""
  return `<div class="timeline">${months
    .map(
      (m, i) => `
    <div class="tl-item">
      <div class="tl-num">${i + 1}</div>
      <div class="tl-body"><h3>${esc(m.heading)}</h3>${paras(m.body)}</div>
    </div>`
    )
    .join("")}</div>`
}

function forceCardsHtml(cards: InsightCard[]): string {
  return cards
    .filter((c) => c.kind === "force")
    .map(
      (c, i) => `
    <article class="card force">
      <div class="card-n">${i + 1}</div>
      <div>
        <p class="eyebrow">Force</p>
        <h3>${esc(c.title)}</h3>
        ${paras(c.description)}
      </div>
    </article>`
    )
    .join("")
}

function axeCardsHtml(cards: InsightCard[]): string {
  return cards
    .filter((c) => c.kind === "vigilance")
    .map(
      (c, i) => `
    <article class="card axe">
      <div class="card-n alt">${i + 1}</div>
      <div>
        <p class="eyebrow">Axe de progression</p>
        <h3>${esc(c.title)}</h3>
        ${paras(c.description)}
      </div>
    </article>`
    )
    .join("")
}

const PRINT_CSS = `
:root {
  --ink:#2B2421; --gold:#B8954A; --gold-soft:#F3D9A4; --gold-deep:#8A6A2E;
  --muted:#5c534c; --cream:#F8F4EE; --paper:#FFFEFB; --line:#e4d5b5;
}
* { box-sizing: border-box; }
body {
  font-family: Georgia, "Times New Roman", serif;
  color: var(--ink);
  line-height: 1.55;
  max-width: 780px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 4rem;
  background: linear-gradient(180deg, #f7f1e6 0%, #fff 180px);
}
.toolbar {
  display: flex; gap: .6rem; justify-content: flex-end; margin-bottom: 1.25rem;
  position: sticky; top: 0; z-index: 5; padding: .6rem 0; background: rgba(255,254,251,.92);
  backdrop-filter: blur(6px);
}
.toolbar button, .toolbar a {
  font-family: system-ui, sans-serif; font-size: .78rem; font-weight: 700;
  border-radius: 10px; padding: .55rem 1rem; border: 1px solid var(--line);
  background: #fff; color: var(--ink); cursor: pointer; text-decoration: none;
  display: inline-flex; align-items: center; justify-content: center;
}
.toolbar .primary { background: var(--gold); border-color: var(--gold); color: #2B2421; }
.toolbar .secondary { background: #fff; border-color: var(--gold); color: var(--gold-deep); }
.frame {
  position: relative;
  border: 1.5px solid rgba(215,184,102,.4);
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(215,184,102,.07), transparent 30%),
    linear-gradient(135deg, #fffefb, #f8f4ee 50%, #fff);
  padding: 1.35rem 1.35rem 1.5rem;
  margin: 1.35rem 0;
  box-shadow: 0 10px 28px -22px rgba(28,20,18,.4);
}
.frame::before, .frame::after {
  content: ""; position: absolute; width: 16px; height: 16px; border-color: var(--gold);
}
.frame::before { top: 10px; left: 10px; border-top: 2px solid; border-left: 2px solid; }
.frame::after { top: 10px; right: 10px; border-top: 2px solid; border-right: 2px solid; }
.frame .corner-bl, .frame .corner-br {
  position: absolute; width: 16px; height: 16px; border-color: var(--gold);
}
.frame .corner-bl { bottom: 10px; left: 10px; border-bottom: 2px solid; border-left: 2px solid; }
.frame .corner-br { bottom: 10px; right: 10px; border-bottom: 2px solid; border-right: 2px solid; }
.cover {
  background: linear-gradient(145deg, #2B2421 0%, #2A1810 45%, #5C1F28 100%);
  color: #F8F4EE; border-color: rgba(215,184,102,.55);
  padding: 1.75rem 1.5rem 1.6rem;
}
.cover .brand { letter-spacing: .24em; text-transform: uppercase; font-size: .68rem; color: var(--gold-soft); font-weight: 700; margin: 0; }
.cover h1 { font-size: 1.85rem; margin: .45rem 0 .2rem; color: var(--gold-soft); }
.cover .sub { color: rgba(243,217,164,.85); margin: 0 0 1rem; }
.cover-grid { display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-start; justify-content: space-between; }
.cover .rings { display: flex; gap: .75rem; }
.cover .ring-wrap { background: #fff; border-radius: 16px; padding: .55rem; color: var(--ink); }
.meta {
  margin-top: 1.1rem; background: rgba(0,0,0,.22); border: 1px solid rgba(255,255,255,.12);
  border-radius: 14px; padding: .9rem 1rem;
}
.meta p { margin: .2rem 0; font-size: .92rem; color: rgba(255,253,249,.9); }
.meta strong { color: var(--gold-soft); }
.progress { margin-top: .75rem; }
.progress .labels { display:flex; justify-content:space-between; font-size:.7rem; color:rgba(255,255,255,.5); margin-bottom:.3rem; }
.progress .track { height: 8px; border-radius: 999px; background: rgba(255,255,255,.12); overflow: hidden; }
.progress .fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #8A6A2E, #B8954A, #F3D9A4); }
h2 {
  font-size: 1.4rem; margin: 0 0 .75rem; padding-bottom: .4rem;
  border-bottom: 1px solid var(--line);
}
h3 { font-size: 1.05rem; margin: .9rem 0 .35rem; }
p { margin: .5rem 0; }
.page-n {
  display: inline-flex; align-items: center; gap: .45rem;
  font-size: .68rem; letter-spacing: .16em; text-transform: uppercase;
  color: var(--gold-deep); font-weight: 700; margin-bottom: .35rem;
}
.page-n span {
  display:inline-flex; min-width: 1.4rem; height: 1.4rem; align-items:center; justify-content:center;
  background: rgba(215,184,102,.18); border-radius: 6px; padding: 0 .3rem;
}
.ring-wrap { position: relative; width: 120px; height: 120px; }
.ring { display: block; }
.ring-label {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; text-align: center; pointer-events: none;
}
.ring-label strong { font-size: 1.55rem; line-height: 1; }
.ring-label span { font-size: .65rem; color: var(--gold); font-weight: 700; }
.ring-label em {
  font-style: normal; font-size: .58rem; letter-spacing: .12em; text-transform: uppercase;
  color: var(--gold-deep); margin-top: .2rem; font-weight: 700; max-width: 5.5rem;
}
.stars { letter-spacing: .08em; font-size: 1.25rem; margin: .4rem 0; }
.stars .on { color: var(--gold); }
.stars .off { color: rgba(215,184,102,.28); }
.bars { display: flex; flex-direction: column; gap: .65rem; }
.bar-meta { display:flex; justify-content:space-between; gap: .75rem; font-size: .88rem; }
.bar-meta b { color: var(--gold); font-variant-numeric: tabular-nums; }
.bar-track {
  height: 10px; border-radius: 999px; background: rgba(215,184,102,.14);
  border: 1px solid rgba(215,184,102,.18); overflow: hidden;
}
.bar-fill {
  height: 100%; border-radius: 999px;
  background: linear-gradient(90deg, #8A6A2E, #B8954A, #F3D9A4);
}
.panel {
  border: 1px solid rgba(215,184,102,.28); border-radius: 14px;
  background: #fff; padding: .9rem 1rem; margin: .75rem 0;
}
.panel.accent { background: linear-gradient(135deg, rgba(215,184,102,.12), #fff); }
.panel .eyebrow, .card .eyebrow, .dims-head span {
  font-size: .65rem; letter-spacing: .16em; text-transform: uppercase;
  color: var(--gold-deep); font-weight: 700; margin: 0 0 .55rem;
}
.two { display: grid; grid-template-columns: 1fr 1fr; gap: .9rem; }
@media (max-width: 640px) { .two { grid-template-columns: 1fr; } .cover-grid { justify-content: center; } }
.card {
  display: flex; gap: .85rem; border: 1px solid rgba(215,184,102,.3);
  border-radius: 14px; padding: 1rem; margin: .7rem 0;
  background: linear-gradient(135deg, rgba(215,184,102,.1), #fff);
  break-inside: avoid;
}
.card.axe { background: #faf8f6; border-color: rgba(100,31,43,.15); }
.card-n {
  flex-shrink: 0; width: 2rem; height: 2rem; border-radius: 999px;
  display:flex; align-items:center; justify-content:center;
  background: var(--gold); color: #2B2421; font-weight: 700; font-size: .9rem;
}
.card-n.alt { background: rgba(100,31,43,.12); color: #5C1F28; }
.card h3 { margin-top: 0; }
.dims {
  border: 1px solid rgba(215,184,102,.28); border-radius: 16px;
  padding: 1rem; background: linear-gradient(135deg, rgba(215,184,102,.08), #fff);
  margin: 1rem 0;
}
.dims-head { display:flex; justify-content:space-between; align-items:center; margin-bottom: .65rem; }
.dims-head b { color: var(--gold-deep); }
.dims-grid {
  display: grid; grid-template-columns: repeat(8, 1fr); gap: .4rem; margin-bottom: .65rem;
}
.dim {
  aspect-ratio: 1; border-radius: 10px; display:flex; align-items:center; justify-content:center;
  font-size: .75rem; font-weight: 700; border: 1px solid var(--line);
}
.dim.ok { background: rgba(215,184,102,.16); border-color: rgba(215,184,102,.45); color: var(--gold-deep); }
.dim.wait { background: #fff; color: #b0a89f; border-style: dashed; }
.dims-legend { display:flex; flex-wrap:wrap; gap: .35rem .75rem; font-size: .72rem; }
.dims-legend .ok { color: var(--ink); }
.dims-legend .wait { color: var(--muted); }
.timeline { position: relative; padding-left: .25rem; }
.tl-item { display:flex; gap: .85rem; margin-bottom: 1rem; break-inside: avoid; }
.tl-num {
  width: 2.1rem; height: 2.1rem; border-radius: 999px; flex-shrink: 0;
  display:flex; align-items:center; justify-content:center;
  border: 2px solid var(--gold); background: linear-gradient(135deg, #F3D9A4, #B8954A);
  font-weight: 700; color: #2B2421;
}
.priority {
  position: relative; overflow: hidden;
  border: 1px solid rgba(215,184,102,.35); border-radius: 16px;
  padding: 1rem 1.1rem; margin: .75rem 0;
  background: linear-gradient(135deg, rgba(215,184,102,.12), #fff);
  break-inside: avoid;
}
.priority .ghost {
  position: absolute; right: .4rem; top: -.3rem; font-size: 3.5rem;
  color: rgba(215,184,102,.12); font-weight: 700; line-height: 1;
}
.pending {
  border-left: 3px solid #d4c4a0; padding-left: 1rem;
  background: rgba(0,0,0,.015); border-radius: 0 12px 12px 0;
}
.divider {
  text-align: center; margin: 1.75rem 0 1rem;
}
.divider .orn {
  display:flex; align-items:center; justify-content:center; gap: .55rem; margin-bottom: .4rem;
}
.divider .orn i {
  display:block; width: 2.4rem; height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold));
}
.divider .orn i:last-child { background: linear-gradient(270deg, transparent, var(--gold)); }
.divider .orn b {
  width: .45rem; height: .45rem; border: 1px solid var(--gold);
  background: rgba(243,217,164,.45); transform: rotate(45deg);
}
.divider .brand {
  letter-spacing: .24em; text-transform: uppercase; font-size: .65rem;
  color: var(--gold-deep); font-weight: 700;
}
.divider h2 { border: 0; margin: .25rem 0 0; padding: 0; font-size: 1.25rem; }
.plain { list-style: none; padding: 0; margin: .4rem 0 .8rem; }
.plain li { margin: .3rem 0; display:flex; gap: .45rem; }
.plain .b { color: var(--gold); font-weight: 700; }
.chip-grid { display:grid; grid-template-columns: 1fr 1fr; gap: .45rem; }
.chip {
  border: 1px solid rgba(215,184,102,.22); border-radius: 10px;
  background: rgba(215,184,102,.06); padding: .55rem .7rem; font-size: .88rem;
}
.sign { font-style: italic; color: var(--muted); margin-top: 1.4rem; }
.summary-box {
  border: 1px solid rgba(215,184,102,.35); border-radius: 14px;
  background: linear-gradient(135deg, rgba(215,184,102,.12), #fff);
  padding: 1rem; margin-top: 1rem;
}
@media print {
  body { padding: 0; background: #fff; max-width: none; }
  .toolbar { display: none !important; }
  .frame { box-shadow: none; break-inside: avoid; }
  .card, .priority, .tl-item, .pending, .dims { break-inside: avoid; }
  a { color: inherit; text-decoration: none; }
}
`

export function renderReportExportHtml(input: {
  firstName: string
  living: LivingPersonalizedReport
  generatedAtLabel: string
  downloadHref?: string
  filename?: string
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
  ] as const

  const detailChapters = detailIds
    .map((id) => byId(id))
    .filter(Boolean) as NonNullable<ReturnType<typeof byId>>[]

  const forceCards =
    forces?.insightCards?.filter((c) => c.kind === "force") ?? []
  const axeCards =
    vigilances?.insightCards?.filter((c) => c.kind === "vigilance") ?? []
  const planCards =
    plan?.insightCards?.filter((c) => c.kind === "vigilance") ?? []

  let page = 0
  const pageLabel = () => {
    page += 1
    return `<p class="page-n"><span>${page}</span> Page ${page}</p>`
  }

  const framed = (inner: string, extraClass = "") => `
  <section class="frame ${extraClass}">
    <span class="corner-bl" aria-hidden="true"></span>
    <span class="corner-br" aria-hidden="true"></span>
    ${inner}
  </section>`

  const blocks: string[] = []

  blocks.push(`
<header class="frame cover">
  <span class="corner-bl" aria-hidden="true"></span>
  <span class="corner-br" aria-hidden="true"></span>
  <div class="cover-grid">
    <div>
      <p class="brand">KELIAA ALLIANCE™</p>
      <h1>${esc(title)}</h1>
      <p class="sub">Préparation au Mariage</p>
    </div>
    <div class="rings">
      ${scoreRingSvg(living.completenessPercent, "Complétude", "g1")}
      ${
        living.globalIndex != null
          ? scoreRingSvg(
              living.globalIndex,
              complete ? "Préparation" : "Indice",
              "g2"
            )
          : ""
      }
    </div>
  </div>
  <div class="meta">
    <p><strong>${esc(living.confidentialLabel)}</strong></p>
    <p>Nom : ${esc(name)}</p>
    <p>Date : ${esc(input.generatedAtLabel)}</p>
    <p>Version : ${esc(living.versionLabel)}</p>
    <p>Évaluations : ${living.testsCompleted} / ${living.essentialsTotal}</p>
    <p>${esc(living.indexLabel)} : ${
      living.globalIndex != null ? `${living.globalIndex} / 100` : "En cours"
    }</p>
    <div class="progress">
      <div class="labels"><span>Progression du document</span><span>${living.completenessPercent}%</span></div>
      <div class="track"><div class="fill" style="width:${living.completenessPercent}%"></div></div>
    </div>
  </div>
</header>`)

  blocks.push(
    framed(`
    ${pageLabel()}
    <h2>Bienvenue</h2>
    ${paras(living.welcomeBody)}
  `)
  )

  if (living.statusBlock) {
    blocks.push(
      framed(`
      ${pageLabel()}
      <h2>Où en êtes-vous aujourd’hui ?</h2>
      <div class="cover-grid" style="margin-bottom:1rem">
        ${scoreRingSvg(living.completenessPercent, "En cours", "g3", 110)}
        <div style="flex:1">${paras(living.statusBlock.intro)}</div>
      </div>
      <div class="two">
        <div class="panel">
          <p class="eyebrow">Déjà dans votre rapport</p>
          ${list(living.statusBlock.included, "✓")}
        </div>
        <div class="panel">
          <p class="eyebrow">À approfondir</p>
          ${list(living.statusBlock.remaining, "○")}
        </div>
      </div>
    `)
    )
  }

  if (living.glance) {
    blocks.push(
      framed(`
      ${pageLabel()}
      <h2>Votre portrait en un regard</h2>
      <div class="cover-grid">
        <div style="flex:1">
          <p class="eyebrow">Niveau de préparation actuel</p>
          ${starsHtml(living.glance.score)}
          <p><strong style="font-size:1.6rem">${living.glance.score}</strong> <span style="color:var(--gold)">/ 100</span></p>
          ${paras(living.glance.narrative)}
        </div>
        ${scoreRingSvg(living.glance.score, "Préparation", "g4", 128)}
      </div>
      <div class="two" style="margin-top:1rem">
        <div class="panel">
          <p class="eyebrow">Vos principales forces</p>
          ${forceBarsHtml(
            living.glance.forceLabels.map((label, i) => ({
              label,
              value: forceCards[i]?.score,
            }))
          )}
        </div>
        <div class="panel accent">
          <p class="eyebrow">Priorités à impact</p>
          ${list(living.glance.priorities, "•")}
        </div>
      </div>
    `)
    )
  }

  if (resume?.body) {
    blocks.push(
      framed(`
      ${pageLabel()}
      <h2>${esc(resume.title)}</h2>
      ${paras(resume.body)}
    `)
    )
  }

  if (portrait?.body) {
    blocks.push(
      framed(`
      ${pageLabel()}
      <h2>Votre portrait relationnel</h2>
      <div class="panel accent">${paras(portrait.body)}</div>
    `)
    )
  }

  if (forceCards.length) {
    blocks.push(
      framed(`
      ${pageLabel()}
      <h2>${esc(forces?.title || "Vos principales forces")}</h2>
      ${forces?.body ? paras(forces.body) : ""}
      <div class="panel">
        <p class="eyebrow">Lecture graphique</p>
        ${forceBarsHtml(
          forceCards.map((c) => ({
            label: c.why || c.title,
            value: c.score,
          }))
        )}
      </div>
      ${forceCardsHtml(forceCards)}
    `)
    )
  }

  if (axeCards.length) {
    blocks.push(
      framed(`
      ${pageLabel()}
      <h2>${esc(vigilances?.title || "Compétences à développer")}</h2>
      ${vigilances?.body ? paras(vigilances.body) : ""}
      ${axeCardsHtml(axeCards)}
    `)
    )
  }

  if (living.nextStep) {
    blocks.push(
      framed(`
      ${pageLabel()}
      <h2>Votre prochaine étape</h2>
      <p>${esc(living.nextStep.completenessNote)}</p>
      <p class="eyebrow">Évaluation recommandée</p>
      <h3 style="font-size:1.5rem;margin-top:.2rem">${esc(living.nextStep.title)}</h3>
      <div class="chip-grid" style="margin-top:.75rem">
        ${living.nextStep.why
          .map((w) => `<div class="chip">· ${esc(w)}</div>`)
          .join("")}
      </div>
    `)
    )
  }

  blocks.push(`
  <div class="divider">
    <div class="orn"><i></i><b></b><i></i></div>
    <p class="brand">KELIAA Alliance™</p>
    <h2>${
      complete
        ? "Les grandes dimensions de votre fonctionnement relationnel"
        : "Analyses détaillées"
    }</h2>
  </div>`)

  blocks.push(
    chapterDotsHtml(
      detailChapters.map((c) => ({
        title: c.title,
        unlocked: c.unlocked,
      }))
    )
  )

  for (const ch of detailChapters) {
    if (!ch.unlocked) {
      const pending = (ch.sections || [])
        .map((s) => `<h3>${esc(s.heading)}</h3>${paras(s.body)}`)
        .join("\n")
      blocks.push(
        framed(
          `
        ${pageLabel()}
        <h2>${esc(ch.title)} — Analyse en attente</h2>
        <div class="pending">
          ${pending}
          <p><strong>${esc(ch.unlockHint || "Complétez l’évaluation correspondante.")}</strong></p>
          ${ch.unlockHref ? `<p>Test rattaché : ${esc(ch.unlockHref)}</p>` : ""}
        </div>
      `,
          "pending-page"
        )
      )
    } else {
      const body = (ch.sections || [])
        .map(
          (s) => `
        <div class="panel">
          <h3>${esc(s.heading)}</h3>
          ${paras(s.body)}
        </div>`
        )
        .join("\n")
      blocks.push(
        framed(`
        ${pageLabel()}
        <h2>${esc(ch.title)}</h2>
        ${body || (ch.body ? paras(ch.body) : "")}
      `)
      )
    }
  }

  if (synthese?.body) {
    blocks.push(
      framed(`
      ${pageLabel()}
      <h2>${esc(synthese.title)}</h2>
      ${paras(synthese.body)}
    `)
    )
  }

  blocks.push(`
  <div class="divider">
    <div class="orn"><i></i><b></b><i></i></div>
    <p class="brand">KELIAA Alliance™</p>
    <h2>${
      complete
        ? "Votre plan de croissance personnalisé"
        : "Plan d’action, progression et conclusion"
    }</h2>
  </div>`)

  if (plan) {
    const priorities = planCards
      .map(
        (c, i) => `
      <div class="priority">
        <span class="ghost">${i + 1}</span>
        <p class="eyebrow">Priorité n°${i + 1}</p>
        <h3>${esc(c.title)}</h3>
        ${paras(c.description)}
      </div>`
      )
      .join("")
    blocks.push(
      framed(`
      ${pageLabel()}
      <h2>${esc(plan.title)}</h2>
      ${plan.body ? paras(plan.body) : ""}
      ${priorities}
      ${
        plan.sections?.length
          ? `<p class="eyebrow" style="margin-top:1.2rem">Plan sur trois mois</p>${monthTimelineHtml(plan.sections)}`
          : ""
      }
    `)
    )
  }

  if (evolution?.body) {
    blocks.push(
      framed(`
      ${pageLabel()}
      <h2>${esc(evolution.title)}</h2>
      <div style="margin-bottom:1rem">${scoreRingSvg(living.completenessPercent, "Progression Alliance", "g5", 118)}</div>
      ${paras(evolution.body)}
      ${list(evolution.bullets || [])}
    `)
    )
  }

  if (conclusion?.body) {
    blocks.push(
      framed(`
      ${pageLabel()}
      <h2>${esc(conclusion.title)}</h2>
      ${paras(conclusion.body)}
      ${
        conclusion.bullets?.length
          ? `<div class="summary-box"><p class="eyebrow">Résumé de votre progression</p>${list(conclusion.bullets)}</div>`
          : ""
      }
      <p class="sign">L’équipe KELIAA Alliance — « Mieux se connaître aujourd’hui pour construire une relation durable demain. »</p>
    `)
    )
  }

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)} — ${esc(name)}</title>
  <style>${PRINT_CSS}</style>
</head>
<body>
  <div class="toolbar no-print">
    <button type="button" class="primary" onclick="window.print()">Imprimer</button>
    <a class="secondary" href="${esc(input.downloadHref || "/rapport/telecharger?dl=1")}" download="${esc(input.filename || "keliaa-rapport-alliance.html")}">Télécharger</a>
  </div>
  ${blocks.join("\n")}
</body>
</html>`
}
