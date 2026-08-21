/**
 * Contrôle qualité — Directive globale §31 + docs 86/181.
 * Adapté à la trame maître (ids slugifiés depuis le MD).
 */

import { isPremiumPlusOffer } from "@/lib/couple/offers"
import type { CoupleReportDocument } from "@/lib/couple/report"
import { textHasForbidden } from "@/lib/couple/engine/charter"
import type { EngineResult } from "@/lib/couple/engine/types"
import { getResourceById } from "@/lib/couple/engine/resources/catalog"

function hasSectionMatching(
  doc: CoupleReportDocument,
  re: RegExp
): boolean {
  return doc.sections.some((s) => re.test(s.id) || re.test(s.title))
}

export function qualityGate(
  doc: CoupleReportDocument,
  engine: EngineResult
): { ok: boolean; notes: string[] } {
  const notes: string[] = []

  if (engine.synthesis.priorities.length > 3) {
    notes.push("Plus de 3 priorités")
  }
  if (
    engine.synthesis.priorities.length < 1 &&
    engine.cards.some((c) => c.gap > 25)
  ) {
    notes.push("Écarts importants sans priorité")
  }

  const requiredPatterns: Array<[string, RegExp]> = [
    ["bienvenue", /bienvenue|accueil/i],
    ["regard", /regard/i],
    ["profil A", /profil.*(daniel|a\b)|le-profil-de-/i],
    ["profil B", /profil.*(naomi|b\b)|le-profil-de-/i],
    ["rencontre profils", /rencontrent|dynamique/i],
    ["plan", /plan-d-action|plan d.action/i],
    ["conclusion", /conclusion|retenir-de-votre-bilan/i],
  ]
  for (const [label, re] of requiredPatterns) {
    if (!hasSectionMatching(doc, re)) {
      notes.push(`Section manquante: ${label}`)
    }
  }

  const profils = doc.sections.filter(
    (s) => /profil-de-|LE PROFIL/i.test(s.id + s.title)
  )
  if (profils.length >= 2) {
    const ta = profils[0]!.paragraphs.join(" ")
    const tb = profils[1]!.paragraphs.join(" ")
    if (ta === tb) notes.push("Portraits A/B identiques")
  }

  if (doc.sections.length < 10) {
    notes.push("Trame Premium trop courte")
  }

  const retainCount = doc.sections.filter((s) =>
    (s.blocks || []).some(
      (b) =>
        b.type === "h2" &&
        /retenir|conclusion|fil rouge|synthèse|carte/i.test(b.text)
    )
  ).length
  if (retainCount < 1 && doc.sections.length < 5) {
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
    if (!hasSectionMatching(doc, /carte-relationnelle|carte relationnelle/i)) {
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

  // Texte maître attendu en ouverture (démo / trame)
  const welcome = doc.sections.find((s) => /bienvenue/i.test(s.id + s.title))
  if (
    welcome &&
    !welcome.paragraphs.some((p) =>
      /vous êtes ensemble|votre avenir mérite/i.test(p)
    )
  ) {
    notes.push("Ouverture hors trame maître")
  }

  return { ok: notes.length === 0, notes }
}
