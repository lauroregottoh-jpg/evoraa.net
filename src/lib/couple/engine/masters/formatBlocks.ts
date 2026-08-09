/**
 * Helpers de mise en forme — Directive + charte doc 41.
 */

import type { CoupleReportBlock } from "@/lib/couple/reportBlocks"
import { scrubAiFiller } from "@/lib/couple/engine/charter"

export function h2(text: string): CoupleReportBlock {
  return { type: "h2", text: scrubAiFiller(text) }
}

export function p(text: string): CoupleReportBlock {
  return { type: "paragraph", text: scrubAiFiller(text) }
}

export function ol(items: string[]): CoupleReportBlock {
  return { type: "ol", items: items.map(scrubAiFiller) }
}

export function ul(items: string[]): CoupleReportBlock {
  return { type: "ul", items: items.map(scrubAiFiller) }
}

export function callout(
  text: string,
  tone: "info" | "gold" | "alert" = "gold"
): CoupleReportBlock {
  return { type: "callout", text: scrubAiFiller(text), tone }
}

export function fill(prompt: string, lines = 3): CoupleReportBlock {
  return { type: "fillBlank", prompt: scrubAiFiller(prompt), lines }
}

export function scoreChart(args: {
  label: string
  scoreA: number
  scoreB: number
  nameA: string
  nameB: string
  convergence: number
}): CoupleReportBlock {
  return { type: "scoreChart", ...args }
}

/** Assemble paragraphes longs + sous-titres en chaîne de blocs. */
export function chapter(
  parts: Array<CoupleReportBlock | CoupleReportBlock[] | null | undefined>
): CoupleReportBlock[] {
  const out: CoupleReportBlock[] = []
  for (const part of parts) {
    if (!part) continue
    if (Array.isArray(part)) out.push(...part)
    else out.push(part)
  }
  return out
}

export function conclusionPart(text: string): CoupleReportBlock[] {
  return [
    h2("Ce que cette partie vous invite à retenir"),
    p(scrubAiFiller(text)),
  ]
}
