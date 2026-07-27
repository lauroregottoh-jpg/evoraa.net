import { ASSESSMENT_RETAKE_COOLDOWN_DAYS } from "@/lib/assessments/constants"

export function getNextRetakeDate(completedAt: string | null | undefined): Date | null {
  if (!completedAt) return null
  const next = new Date(completedAt)
  next.setDate(next.getDate() + ASSESSMENT_RETAKE_COOLDOWN_DAYS)
  return next
}

export function canRetakeAssessment(completedAt: string | null | undefined): boolean {
  if (!completedAt) return true
  const next = getNextRetakeDate(completedAt)
  if (!next) return true
  return next.getTime() <= Date.now()
}

export function formatRetakeDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}
