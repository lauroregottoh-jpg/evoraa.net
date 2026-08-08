/** Types + parse bug hunt — safe client (pas d’import Supabase). */

export const BUG_HUNT_SETTING_KEY = "ops_bug_hunt_status" as const

export type BugFinding = {
  id: string
  severity: "info" | "warn" | "fail"
  title: string
  detail: string
  autoFixed?: boolean
  fixNote?: string
}

export type BugHuntReport = {
  checkedAt: string
  findings: BugFinding[]
  fixed: number
  needsHuman: number
  ok: boolean
}

export function parseBugHuntReport(value: unknown): BugHuntReport | null {
  if (!value || typeof value !== "object") return null
  const v = value as Partial<BugHuntReport>
  if (!v.checkedAt || !Array.isArray(v.findings)) return null
  return v as BugHuntReport
}
