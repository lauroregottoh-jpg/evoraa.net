/**
 * Contrôle qualité avant livraison — docs 86 / 181.
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

  if (engine.synthesis.priorities.length > 3) {
    notes.push("Plus de 3 priorités")
  }
  if (engine.synthesis.priorities.length < 1 && engine.cards.some((c) => c.gap > 25)) {
    notes.push("Écarts importants sans priorité")
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
    // PP doit contenir la base Essentiel (sections non vides)
    if (doc.sections.length < 8) {
      notes.push("Base Essentiel trop courte pour PP")
    }
  }

  const prose = doc.sections
    .flatMap((s) => s.paragraphs)
    .join("\n")
  const forbidden = textHasForbidden(prose)
  if (forbidden.length > 2) {
    notes.push(`Formulations charte: ${forbidden.slice(0, 3).join(", ")}`)
  }

  if (!doc.names.nameA?.trim() || !doc.names.nameB?.trim()) {
    notes.push("Noms manquants")
  }

  // Première action identifiable
  if (!doc.actionPlan.length && !doc.exercises.length) {
    notes.push("Aucune action ni exercice")
  }

  return { ok: notes.length === 0, notes }
}
