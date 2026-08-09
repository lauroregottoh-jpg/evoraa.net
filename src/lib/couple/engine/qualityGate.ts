/**
 * Contrôle qualité — Directive globale §31 + docs 86/181.
 */

import { isPremiumPlusOffer } from "@/lib/couple/offers"
import type { CoupleReportDocument } from "@/lib/couple/report"
import { textHasForbidden } from "@/lib/couple/engine/charter"
import type { EngineResult } from "@/lib/couple/engine/types"
import { getResourceById } from "@/lib/couple/engine/resources/catalog"

export function qualityGate(
  doc: CoupleReportDocument,
  engine: EngineResult
): { ok: boolean; notes: string[] } {
  const notes: string[] = []

  // Priorités ≤ 3
  if (engine.synthesis.priorities.length > 3) {
    notes.push("Plus de 3 priorités")
  }
  if (
    engine.synthesis.priorities.length < 1 &&
    engine.cards.some((c) => c.gap > 25)
  ) {
    notes.push("Écarts importants sans priorité")
  }

  // Données utilisées / structure Premium
  const required = [
    "accueil",
    "regard",
    "profil-a",
    "profil-b",
    "croisement",
    "forces",
    "plan",
    "conclusion",
  ]
  for (const id of required) {
    if (!doc.sections.some((s) => s.id === id)) {
      notes.push(`Section manquante: ${id}`)
    }
  }

  // Portraits distincts (pas clones)
  const a = doc.sections.find((s) => s.id === "profil-a")
  const b = doc.sections.find((s) => s.id === "profil-b")
  if (a && b) {
    const ta = a.paragraphs.join(" ")
    const tb = b.paragraphs.join(" ")
    if (ta === tb) notes.push("Portraits A/B identiques")
    if (!ta.includes(doc.names.nameA)) notes.push("Portrait A sans nom A")
    if (!tb.includes(doc.names.nameB)) notes.push("Portrait B sans nom B")
  }

  // Grandes différences = priorités
  const diffSections = doc.sections.filter((s) => s.id.startsWith("diff-"))
  if (diffSections.length > 3) notes.push("Plus de 3 chapitres différence")
  if (
    engine.synthesis.priorities.length > 0 &&
    diffSections.length !== engine.synthesis.priorities.length
  ) {
    notes.push("Chapitres différence non alignés sur priorités")
  }

  // Exercices liés
  if (doc.exercises.length < 1) notes.push("Aucun exercice")
  if (doc.actionPlan.length < 1) notes.push("Plan d’action manquant")

  // Conclusions de parties (au moins quelques h2 « retenir »)
  const retainCount = doc.sections.filter((s) =>
    (s.blocks || []).some(
      (b) =>
        b.type === "h2" &&
        /retenir|conclusion|fil rouge|synthèse/i.test(b.text)
    )
  ).length
  if (retainCount < 2) {
    notes.push("Peu de conclusions de parties")
  }

  for (const sel of engine.selectedResources) {
    const found = getResourceById(sel.resource.id)
    if (!found) notes.push(`Ressource inconnue: ${sel.resource.id}`)
    if (found && found.version !== sel.versionPinned) {
      notes.push(`Version non pinnée: ${sel.resource.id}`)
    }
  }

  if (isPremiumPlusOffer(doc.offerId)) {
    if (doc.premiumPlusExtras.length < 1) {
      notes.push("Premium Plus sans modules PP")
    }
    if (doc.sections.length < 10) {
      notes.push("Base Premium trop courte pour PP")
    }
    // PP ne doit pas remplacer Premium
    if (!doc.sections.some((s) => s.id === "carte-relationnelle")) {
      notes.push("PP sans carte relationnelle Premium")
    }
  }

  const prose = doc.sections.flatMap((s) => s.paragraphs).join("\n")
  const forbidden = textHasForbidden(prose)
  if (forbidden.length > 2) {
    notes.push(`Formulations charte: ${forbidden.slice(0, 3).join(", ")}`)
  }

  if (/TODO|FIXME|lorem ipsum|\[prompt\]/i.test(prose)) {
    notes.push("Placeholders ou prompts internes visibles")
  }

  if (!doc.names.nameA?.trim() || !doc.names.nameB?.trim()) {
    notes.push("Noms manquants")
  }

  if (!doc.actionPlan.length && !doc.exercises.length) {
    notes.push("Aucune action ni exercice")
  }

  return { ok: notes.length === 0, notes }
}
