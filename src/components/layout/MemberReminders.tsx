"use client"

import { ClipboardList, Crown } from "lucide-react"

type NavHandler = (href: string) => (e?: React.MouseEvent) => void

type MemberRemindersProps = {
  completionPercentage: number
  hasAvatar: boolean
  assessmentsDone: number
  assessmentsTotal: number
  renewSoon: boolean
  daysRemaining: number | null
  trialDaysRemaining: number | null
  isTrialBoost: boolean
  isPaid: boolean
  onNavigate: NavHandler
}

/**
 * Un seul rappel clair (pas de grappe de chips Photo/Profil/Tests/Alliance).
 * Priorité : tests tant que &lt; 5 ou profil &lt; 15 %.
 */
export function MemberReminders({
  completionPercentage,
  hasAvatar,
  assessmentsDone,
  assessmentsTotal,
  renewSoon,
  daysRemaining,
  trialDaysRemaining,
  isTrialBoost,
  isPaid,
  onNavigate,
}: MemberRemindersProps) {
  const testsLeft = assessmentsDone < assessmentsTotal
  const pushTestsFirst = testsLeft || completionPercentage < 15
  const showRenew = renewSoon && daysRemaining != null && daysRemaining <= 7
  const showTrial =
    isTrialBoost && trialDaysRemaining != null && trialDaysRemaining <= 7

  let task: { href: string; label: string; cta: string } | null = null
  if (pushTestsFirst && testsLeft) {
    task = {
      href: "/assessments",
      label: `Eva · Questionnaires ${assessmentsDone}/${assessmentsTotal}`,
      cta: "Continuer les tests",
    }
  } else if (!hasAvatar) {
    task = {
      href: "/profile",
      label: "Eva · Ajoutez une photo claire",
      cta: "Ajouter ma photo",
    }
  } else if (completionPercentage < 100) {
    task = {
      href: "/profile",
      label: `Eva · Profil à ${completionPercentage}%`,
      cta: "Compléter",
    }
  }

  if (!task && !showRenew && !showTrial) return null

  return (
    <div className="relative z-0 border-t border-border/40 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2 space-y-2">
        {showRenew && (
          <a
            href="/billing"
            onClick={onNavigate("/billing")}
            className="flex items-center justify-between gap-3 rounded-xl bg-primary text-primary-foreground px-3 py-2 text-xs sm:text-sm cursor-pointer"
          >
            <span className="inline-flex items-center gap-2 min-w-0">
              <Crown className="h-4 w-4 shrink-0 text-accent" />
              <span className="font-semibold truncate">
                Alliance : il vous reste {daysRemaining} jour
                {daysRemaining === 1 ? "" : "s"}
              </span>
            </span>
            <span className="shrink-0 font-bold underline underline-offset-2">
              Renouveler
            </span>
          </a>
        )}

        {showTrial && !showRenew && (
          <button
            type="button"
            onClick={onNavigate("/compatibility")}
            className="w-full flex items-center justify-between gap-3 rounded-xl border border-accent/40 bg-accent/10 px-3 py-2 text-xs sm:text-sm cursor-pointer text-left"
          >
            <span className="font-medium truncate">
              Boost temporaire : {trialDaysRemaining} jour
              {trialDaysRemaining === 1 ? "" : "s"} restant
              {trialDaysRemaining === 1 ? "" : "s"}
            </span>
            <span className="shrink-0 font-semibold text-accent">Explorer</span>
          </button>
        )}

        {task && (
          <a
            href={task.href}
            onClick={onNavigate(task.href)}
            className="flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-background/80 px-3 py-2 text-xs sm:text-sm cursor-pointer hover:border-primary/40 transition-colors"
          >
            <span className="inline-flex items-center gap-2 min-w-0">
              <ClipboardList className="h-4 w-4 shrink-0 text-primary" />
              <span className="font-medium truncate">{task.label}</span>
            </span>
            <span className="shrink-0 font-semibold text-primary">{task.cta} →</span>
          </a>
        )}
      </div>
    </div>
  )
}
