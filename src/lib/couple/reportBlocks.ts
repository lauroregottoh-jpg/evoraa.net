/**
 * Blocs structurés pour le rapport Couple (hiérarchie typo + visuels).
 */

export type CoupleReportBlock =
  | { type: "h2"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "ol"; items: string[] }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string; tone?: "info" | "gold" | "alert" }
  | {
      type: "scoreChart"
      label: string
      scoreA: number
      scoreB: number
      nameA: string
      nameB: string
      convergence: number
    }
  | { type: "fillBlank"; prompt: string; lines?: number }
  | {
      type: "rolePlay"
      title: string
      roleA: string
      roleB: string
      scene: string
    }

export function paragraphsToBlocks(paragraphs: string[]): CoupleReportBlock[] {
  return paragraphs.map((text) => ({ type: "paragraph" as const, text }))
}

export function sectionBlocksFromLegacy(args: {
  paragraphs: string[]
  bullets?: string[]
  subtitleBlocks?: CoupleReportBlock[]
}): CoupleReportBlock[] {
  const blocks: CoupleReportBlock[] = [...(args.subtitleBlocks || [])]
  for (const p of args.paragraphs) blocks.push({ type: "paragraph", text: p })
  if (args.bullets?.length) blocks.push({ type: "ul", items: args.bullets })
  return blocks
}
