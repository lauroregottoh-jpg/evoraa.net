"use client"

import { Camera, ClipboardList, Crown, User } from "lucide-react"
import { cn } from "@/utils/cn"

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

/** Bandeau rappels : % profil, tâches restantes, Alliance J-7. */
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
  const profileIncomplete = completionPercentage < 95
  const testsLeft = assessmentsDone < assessmentsTotal
  const showTasks = !hasAvatar || profileIncomplete || testsLeft
  const showRenew = renewSoon && daysRemaining != null && daysRemaining <= 7
  const showTrial =
    isTrialBoost && trialDaysRemaining != null && trialDaysRemaining <= 7

  if (!showTasks && !showRenew && !showTrial) return null

  return (
    <div className="border-t border-border/40 bg-secondary/40">
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
                {daysRemaining === 1 ? "" : "s"} — renouvelez pour garder vos quotas
              </span>
            </span>
            <span className="shrink-0 font-bold underline underline-offset-2">Renouveler</span>
          </a>
        )}

        {showTrial && !showRenew && (
          <a
            href="/compatibility"
            onClick={onNavigate("/compatibility")}
            className="flex items-center justify-between gap-3 rounded-xl border border-accent/40 bg-accent/10 px-3 py-2 text-xs sm:text-sm cursor-pointer"
          >
            <span className="font-medium truncate">
              Découverte enrichie : {trialDaysRemaining} jour
              {trialDaysRemaining === 1 ? "" : "s"} restant
              {trialDaysRemaining === 1 ? "" : "s"}
            </span>
            <span className="shrink-0 font-semibold text-accent">Explorer</span>
          </a>
        )}

        {showTasks && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <a
              href="/profile"
              onClick={onNavigate("/profile")}
              className="flex items-center gap-2 min-w-[140px] cursor-pointer"
              title="Compléter mon profil"
            >
              <div className="relative h-8 w-8 shrink-0">
                <svg className="h-8 w-8 -rotate-90" viewBox="0 0 36 36" aria-hidden>
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    className="stroke-border"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    className="stroke-primary"
                    strokeWidth="3"
                    strokeDasharray={`${Math.min(100, completionPercentage) * 0.94} 94`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold">
                  {completionPercentage}%
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
                  Profil
                </p>
                <p className="text-xs font-semibold truncate">
                  {completionPercentage >= 95 ? "Presque complet" : "À compléter"}
                </p>
              </div>
            </a>

            <div className="flex flex-wrap gap-1.5 flex-1">
              {!hasAvatar && (
                <TaskChip
                  href="/profile"
                  onNavigate={onNavigate}
                  icon={<Camera className="h-3 w-3" />}
                  label="Photo"
                />
              )}
              {profileIncomplete && (
                <TaskChip
                  href="/profile"
                  onNavigate={onNavigate}
                  icon={<User className="h-3 w-3" />}
                  label={`Profil ${completionPercentage}%`}
                />
              )}
              {testsLeft && (
                <TaskChip
                  href="/assessments"
                  onNavigate={onNavigate}
                  icon={<ClipboardList className="h-3 w-3" />}
                  label={`Tests ${assessmentsDone}/${assessmentsTotal}`}
                />
              )}
              {!isPaid && (
                <TaskChip
                  href="/billing"
                  onNavigate={onNavigate}
                  icon={<Crown className="h-3 w-3" />}
                  label="Alliance"
                  muted
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TaskChip({
  href,
  onNavigate,
  icon,
  label,
  muted,
}: {
  href: string
  onNavigate: NavHandler
  icon: React.ReactNode
  label: string
  muted?: boolean
}) {
  return (
    <a
      href={href}
      onClick={onNavigate(href)}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold cursor-pointer",
        muted
          ? "border-border text-muted-foreground hover:bg-secondary"
          : "border-primary/25 bg-primary/5 text-primary hover:bg-primary/10"
      )}
    >
      {icon}
      {label}
    </a>
  )
}
