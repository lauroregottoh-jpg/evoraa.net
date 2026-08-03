import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const md = fs.readFileSync(path.join(root, "docs/ACADEMIE DU MARIAGE.md"), "utf8")

const meta = [
  { id: "foi", cover: "/academy/academy-foi.png", slug: "prier-un-peu-mais-vraiment", free: true },
  { id: "dialogue", cover: "/academy/academy-dialogue.png", slug: "dire-ce-que-lon-ressent", free: false },
  { id: "conflits", cover: "/academy/academy-conflits.png", slug: "gerer-les-desaccords", free: false },
  { id: "purete", cover: "/academy/academy-limites.png", slug: "poser-des-limites", free: false },
  { id: "familles", cover: "/academy/academy-familles.png", slug: "construire-son-couple-et-sa-famille", free: false },
  { id: "finances", cover: "/academy/academy-finances.png", slug: "parler-dargent", free: false },
  { id: "emotions", cover: "/academy/academy-emotions.png", slug: "gerer-ses-emotions", free: false },
  { id: "projet", cover: "/academy/academy-projet.png", slug: "projet-de-vie-a-deux", free: false },
]

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function estimateMin(text) {
  // Lecture attentive (FR) ≈ 140 mots/min
  return Math.max(10, Math.round(wordCount(text) / 140))
}

function clean(s) {
  return s.replace(/\r/g, "").trim()
}

function extractBullets(block) {
  return block
    .split("\n")
    .map((l) => l.replace(/^\*\s*/, "").replace(/^☐\s*/, "").trim())
    .filter((l) => l && !l.startsWith("#") && !l.startsWith("---") && !l.startsWith("À la fin"))
}

const parts = md.split(/^# Module \d+ — /m).slice(1)
if (parts.length !== 8) {
  console.error("Expected 8 modules, got", parts.length)
  process.exit(1)
}

const modules = parts.map((part, i) => {
  const m = meta[i]
  const lines = part.split("\n")
  const moduleTitle = clean(lines[0])
  const lessonMatch = part.match(/## Leçon\s*:\s*(.+)/)
  const lessonTitle = clean(lessonMatch?.[1] || "")

  const introChunk = part.split(/## Ce que tu vas apprendre/)[0]
  const afterLesson = introChunk.split(/## Leçon\s*:/)[1] || ""
  const introParas = afterLesson
    .split("\n")
    .slice(1)
    .join("\n")
    .split(/\n\s*\n/)
    .map(clean)
    .filter((p) => p && !p.startsWith("---") && !p.startsWith("#"))

  const learningChunk = part.split(/## Ce que tu vas apprendre/)[1]?.split(/^# \d\./m)[0] || ""
  const learningGoals = extractBullets(learningChunk).filter((l) => !l.startsWith("À la fin"))

  const sections = []
  const numbered = [...part.matchAll(/^# (\d+)\. (.+)$/gm)]
  for (let s = 0; s < numbered.length; s++) {
    const title = clean(numbered[s][2])
    const start = numbered[s].index + numbered[s][0].length
    const end = s + 1 < numbered.length ? numbered[s + 1].index : part.search(/^## À retenir/m)
    const bodyRaw = part.slice(start, end === -1 ? undefined : end)
    const body = bodyRaw
      .split(/\n\s*\n/)
      .map(clean)
      .filter((p) => p && !p.startsWith("---") && !p.startsWith("#"))
    sections.push({ title, body })
  }

  const keyChunk = part.split(/## À retenir/)[1]?.split(/## Exercice/)[0] || ""
  const keyPoints = keyChunk
    .split(/\n\s*\n/)
    .map(clean)
    .filter((p) => p && !p.startsWith("---"))

  const exerciseChunk = part.split(/## Exercice[^\n]*/)[1]?.split(/## Fais le point/)[0] || ""
  const exercise = exerciseChunk
    .split(/\n\s*\n/)
    .map(clean)
    .filter((p) => p && !p.startsWith("---"))
    .join(" ")

  const checkChunk = part.split(/## Fais le point/)[1] || ""
  const selfItems = extractBullets(checkChunk).filter((l) => !l.startsWith("#"))

  const fullText = [
    introParas.join(" "),
    sections.map((s) => s.body.join(" ")).join(" "),
    keyPoints.join(" "),
    exercise,
  ].join(" ")
  const durationMin = estimateMin(fullText)
  const subtitle = introParas[0]?.split(/(?<=\.)\s+/)[0] || moduleTitle
  const summary =
    introParas[1]?.split(/(?<=\.)\s+/).slice(0, 2).join(" ") ||
    introParas[0]?.split(/(?<=\.)\s+/).slice(0, 2).join(" ") ||
    moduleTitle

  return {
    id: m.id,
    title: moduleTitle,
    summary,
    lessons: [
      {
        slug: m.slug,
        title: lessonTitle,
        subtitle,
        durationMin,
        isFreePreview: m.free,
        coverImage: m.cover,
        videoUrl: null,
        intro: introParas,
        learningGoals,
        sections,
        keyPoints,
        resources: [],
        selfCheck: {
          prompt: "Fais le point — coche ce qui est déjà vrai pour toi",
          items: selfItems,
        },
        exercise,
      },
    ],
  }
})

function serialize(value, indent = 0) {
  const pad = "  ".repeat(indent)
  const padIn = "  ".repeat(indent + 1)
  if (value === null) return "null"
  if (typeof value === "string") return JSON.stringify(value)
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]"
    const items = value.map((v) => `${padIn}${serialize(v, indent + 1)}`).join(",\n")
    return `[\n${items},\n${pad}]`
  }
  const keys = Object.keys(value)
  if (keys.length === 0) return "{}"
  const fields = keys
    .map((k) => {
      let v = value[k]
      if (k === "id" && typeof v === "string") {
        return `${padIn}id: ${JSON.stringify(v)}`
      }
      return `${padIn}${k}: ${serialize(v, indent + 1)}`
    })
    .join(",\n")
  return `{\n${fields},\n${pad}}`
}

const header = `export type AcademyModuleId =
  | "foi"
  | "dialogue"
  | "conflits"
  | "purete"
  | "familles"
  | "finances"
  | "emotions"
  | "projet"

export type AcademySection = {
  title: string
  /** Paragraphes de la leçon (contenu long) */
  body?: string[]
  /** Puces optionnelles (rétrocompat / CMS) */
  points?: string[]
}

export type AcademyResource = {
  label: string
  detail: string
}

/** Checklist perso — pas un quiz ni une note */
export type AcademySelfCheck = {
  prompt: string
  items: string[]
}

export type AcademyLesson = {
  slug: string
  title: string
  subtitle: string
  /** Temps de lecture estimé (minutes) */
  durationMin: number
  /** Image de couverture thématique */
  coverImage?: string
  /** Introduction narrative */
  intro?: string[]
  /** Objectifs d'apprentissage */
  learningGoals?: string[]
  sections: AcademySection[]
  keyPoints: string[]
  resources: AcademyResource[]
  selfCheck: AcademySelfCheck
  exercise: string
  videoUrl?: string | null
  videoProvider?: "youtube" | "vimeo" | "file" | null
  isFreePreview?: boolean
}

export type AcademyModule = {
  id: AcademyModuleId
  title: string
  summary: string
  lessons: AcademyLesson[]
}

`

const footer = `
export function getAcademyModule(id: string): AcademyModule | undefined {
  return ACADEMY_MODULES.find((m) => m.id === id)
}

export function getAcademyLesson(moduleId: string, lessonSlug: string) {
  const module = getAcademyModule(moduleId)
  if (!module) return undefined
  const index = module.lessons.findIndex((l) => l.slug === lessonSlug)
  if (index < 0) return undefined
  const lesson = module.lessons[index]
  return {
    module,
    lesson,
    index,
    prev: index > 0 ? module.lessons[index - 1] : null,
    next: index < module.lessons.length - 1 ? module.lessons[index + 1] : null,
  }
}

export function academyLessonPath(moduleId: string, lessonSlug: string) {
  return \`/academie-mariage/\${moduleId}/\${lessonSlug}\`
}

export function academyModulePath(moduleId: string) {
  return \`/academie-mariage/\${moduleId}\`
}
`

const out =
  header +
  `export const ACADEMY_MODULES: AcademyModule[] = ${serialize(modules)}\n` +
  footer

fs.writeFileSync(path.join(root, "src/lib/academy/modules.ts"), out)
console.log("Wrote modules.ts")
for (const m of modules) {
  const l = m.lessons[0]
  console.log(`${m.id}: ${l.title} (~${l.durationMin} min, ${l.sections.length} sec, ${l.selfCheck.items.length} checks)`)
}
