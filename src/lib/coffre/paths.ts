import fs from "fs"
import path from "path"
import type { CoffreResource } from "@/lib/coffre/resources"

/** Dossier source des PDF (hors public — téléchargement contrôlé). */
export function getCoffreDocsDir(): string {
  return path.join(process.cwd(), "docs", "COFFRE PREMIUM")
}

/**
 * Résout le chemin absolu d’un PDF de façon sûre (anti path-traversal).
 * Tolère les écarts d’apostrophes / accents entre catalogue et disque.
 */
export function resolveCoffrePdfPath(resource: CoffreResource): string | null {
  const dir = getCoffreDocsDir()
  if (!fs.existsSync(dir)) return null

  const candidates = [resource.fileName]
  const normalizedWanted = normalizeName(resource.fileName)

  let files: string[] = []
  try {
    files = fs.readdirSync(dir)
  } catch {
    return null
  }

  for (const name of candidates) {
    const full = path.join(dir, name)
    if (fs.existsSync(full) && isInsideDir(dir, full)) return full
  }

  const fuzzy = files.find((f) => normalizeName(f) === normalizedWanted)
  if (fuzzy) {
    const full = path.join(dir, fuzzy)
    if (isInsideDir(dir, full)) return full
  }

  // Dernier recours : préfixe significatif (avant " - " ou ".pdf")
  const stem = normalizedWanted.replace(/\.pdf+$/i, "").slice(0, 24)
  if (stem.length >= 12) {
    const byStem = files.find((f) => normalizeName(f).startsWith(stem))
    if (byStem) {
      const full = path.join(dir, byStem)
      if (isInsideDir(dir, full)) return full
    }
  }

  return null
}

function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’′`]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
}

function isInsideDir(dir: string, filePath: string): boolean {
  const resolvedDir = path.resolve(dir)
  const resolvedFile = path.resolve(filePath)
  return (
    resolvedFile === resolvedDir ||
    resolvedFile.startsWith(resolvedDir + path.sep)
  )
}
