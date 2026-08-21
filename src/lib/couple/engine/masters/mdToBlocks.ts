/**
 * Convertit le markdown maître en blocs rapport (mots du doc, pas d’invention).
 */

import type { CoupleReportBlock } from "@/lib/couple/reportBlocks"

function isFillLine(line: string): boolean {
  return /^_{5,}/.test(line.trim()) || /^_{3,}\s*$/.test(line.trim())
}

function stripMd(s: string): string {
  return s.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").trim()
}

/**
 * Détecte un cycle schéma du maître : ### N. Titre + corps + ↓
 * → bloc cycleFlow avec les titres exacts du document.
 */
function tryParseCycle(
  lines: string[],
  start: number
): { block: CoupleReportBlock; next: number } | null {
  const steps: string[] = []
  let i = start
  let sawArrow = false

  while (i < lines.length) {
    const trimmed = lines[i]!.trim()
    const stepHead = /^###\s+(\d+)\.\s+(.+)$/.exec(trimmed)
    if (stepHead) {
      const title = stripMd(stepHead[2]!)
      const bodyLines: string[] = []
      i++
      while (i < lines.length) {
        const t = lines[i]!.trim()
        if (
          t === "↓" ||
          t === "---" ||
          /^###\s+/.test(t) ||
          /^##\s+/.test(t) ||
          /^#\s+/.test(t)
        ) {
          break
        }
        if (!t) {
          i++
          continue
        }
        bodyLines.push(stripMd(t))
        i++
      }
      const body = bodyLines.join(" ").trim()
      steps.push(body ? `${title} — ${body}` : title)
      // skip blank / arrow
      while (i < lines.length) {
        const t = lines[i]!.trim()
        if (t === "↓") {
          sawArrow = true
          i++
          continue
        }
        if (!t) {
          i++
          continue
        }
        break
      }
      continue
    }
    break
  }

  if (steps.length >= 3 && (sawArrow || steps.length >= 4)) {
    return {
      block: {
        type: "cycleFlow",
        title: "Cycle",
        steps,
      },
      next: i,
    }
  }
  return null
}

/**
 * Parse un fragment markdown du document maître.
 */
export function markdownToBlocks(md: string): CoupleReportBlock[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n")
  const blocks: CoupleReportBlock[] = []
  let i = 0
  let para: string[] = []
  let listItems: string[] = []
  let listType: "ul" | "ol" | null = null

  const flushPara = () => {
    const t = para.join(" ").replace(/\s+/g, " ").trim()
    para = []
    if (!t) return
    blocks.push({ type: "paragraph", text: stripMd(t) })
  }

  const flushList = () => {
    if (!listType || !listItems.length) {
      listItems = []
      listType = null
      return
    }
    blocks.push({
      type: listType,
      items: listItems.map(stripMd),
    })
    listItems = []
    listType = null
  }

  while (i < lines.length) {
    const line = lines[i]!
    const trimmed = line.trim()

    if (!trimmed || trimmed === "---") {
      flushPara()
      flushList()
      i++
      continue
    }

    // Cycle schéma (maître) avant traitement h3 générique
    if (/^###\s+\d+\.\s+/.test(trimmed)) {
      flushPara()
      flushList()
      const cycle = tryParseCycle(lines, i)
      if (cycle) {
        blocks.push(cycle.block)
        i = cycle.next
        continue
      }
    }

    if (isFillLine(trimmed)) {
      flushPara()
      flushList()
      const prev = blocks[blocks.length - 1]
      if (prev?.type === "fillBlank") {
        prev.lines = (prev.lines ?? 2) + 1
      } else {
        blocks.push({ type: "fillBlank", prompt: "Écrire ici…", lines: 2 })
      }
      i++
      continue
    }

    const h2 = /^##\s+(.+)$/.exec(trimmed)
    if (h2) {
      flushPara()
      flushList()
      blocks.push({ type: "h2", text: stripMd(h2[1]!) })
      i++
      continue
    }

    const h3 = /^###\s+(.+)$/.exec(trimmed)
    if (h3) {
      flushPara()
      flushList()
      blocks.push({ type: "h2", text: stripMd(h3[1]!) })
      i++
      continue
    }

    if (/^#\s+/.test(trimmed)) {
      flushPara()
      flushList()
      i++
      continue
    }

    const ul = /^[-*]\s+(.+)$/.exec(trimmed)
    if (ul) {
      flushPara()
      if (listType && listType !== "ul") flushList()
      listType = "ul"
      listItems.push(ul[1]!)
      i++
      continue
    }

    const ol = /^\d+\.\s+(.+)$/.exec(trimmed)
    if (ol) {
      flushPara()
      if (listType && listType !== "ol") flushList()
      listType = "ol"
      listItems.push(ol[1]!)
      i++
      continue
    }

    if (/_{5,}/.test(trimmed) && trimmed.length > 10) {
      flushPara()
      flushList()
      const prompt = stripMd(trimmed.replace(/_+/g, ""))
      blocks.push({
        type: "fillBlank",
        prompt: prompt || "Écrire ici…",
        lines: 2,
      })
      i++
      continue
    }

    flushList()
    para.push(trimmed)
    i++
  }

  flushPara()
  flushList()
  return blocks
}

/** Injection des données réelles dans la trame maître (structure & ton conservés). */
export function injectMasterTokens(
  text: string,
  args: {
    nameA: string
    nameB: string
    globalScore: number
    /** Si true, démo = document maître exact (aucun remplacement). */
    keepDemoNames?: boolean
    /** Slots CIP — ignorés en mode démo. */
    insight?: {
      forces: Array<{ label: string; scoreA: number; scoreB: number }>
      attentions: Array<{ label: string; scoreA: number; scoreB: number }>
      priorityLabels: string[]
      dynamicsSentence?: string
    }
  }
): string {
  if (args.keepDemoNames) return text

  let t = text
  t = t.replaceAll("Daniel", args.nameA).replaceAll("Naomi", args.nameB)
  t = t.replace(
    /score global fictif ressort à \*\*84 %\*\*/gi,
    `score global ressort à **${args.globalScore} %**`
  )
  t = t.replace(
    /score global fictif ressort à 84 %/gi,
    `score global ressort à ${args.globalScore} %`
  )
  t = t.replace(/\*\*84 %\*\*/g, `**${args.globalScore} %**`)

  const insight = args.insight
  if (insight?.forces?.length) {
    const forceBlock = insight.forces
      .slice(0, 3)
      .map((f) => `- **${f.label} : ${f.scoreA} % / ${f.scoreB} %**`)
      .join("\n")
    t = t.replace(
      /(- \*\*Valeurs fondamentales :[^\n]+\n- \*\*Communication :[^\n]+\n- \*\*Vision du couple :[^\n]+)/,
      forceBlock
    )
  }

  if (insight?.attentions?.length) {
    const attBlock = insight.attentions
      .slice(0, 3)
      .map(
        (a) =>
          `- **${a.label} : ${args.nameA} ${a.scoreA} % / ${args.nameB} ${a.scoreB} %**`
      )
      .join("\n")
    t = t.replace(
      /(- \*\*Finances :[^\n]+\n- \*\*Projet de vie :[^\n]+\n- \*\*Carrière et aspirations :[^\n]+)/,
      attBlock
    )
  }

  if (insight?.priorityLabels?.length) {
    const labels = insight.priorityLabels
    let phrase: string
    if (labels.length === 1) phrase = `**${labels[0]}**`
    else if (labels.length === 2)
      phrase = `**${labels[0]}** et **${labels[1]}**`
    else
      phrase = `**${labels[0]}**, **${labels[1]}** et **${labels[2]}**`
    t = t.replace(
      /\*\*les finances, le projet de vie et la carrière ou les aspirations professionnelles\*\*/gi,
      phrase
    )
  }

  // Scores dimensionnels isolés du modèle démo (ex. communication 75 %)
  if (insight?.forces) {
    for (const f of insight.forces) {
      if (/communication/i.test(f.label) && f.scoreA === f.scoreB) {
        t = t.replace(
          /obtiennent tous les deux un score de \*\*75 %\*\*/gi,
          `obtiennent tous les deux un score de **${f.scoreA} %**`
        )
      }
    }
  }

  return t
}
