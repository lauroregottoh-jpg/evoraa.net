import { MemberShell } from "@/components/layout/MemberShell"
import { getUsageSnapshot } from "@/lib/billing/usage"
import { getAssessmentsProgress } from "@/app/actions/assessments"
import { createClient } from "@/utils/supabase/server"

type MemberPageProps = {
  children: React.ReactNode
  dense?: boolean
}

/** Shell membre unifié : menu + rappels profil / Alliance sur toutes les pages. */
export async function MemberPage({ children, dense }: MemberPageProps) {
  const [usage, supabase, assessments] = await Promise.all([
    getUsageSnapshot(),
    createClient(),
    getAssessmentsProgress(),
  ])
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let firstName: string | undefined
  let completionPercentage = 0
  let hasAvatar = true

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("first_name, completion_percentage, avatar_url")
      .eq("user_id", user.id)
      .maybeSingle()
    firstName = data?.first_name ?? undefined
    completionPercentage = data?.completion_percentage ?? 0
    hasAvatar = Boolean(data?.avatar_url)
  }

  const assessmentsDone = (assessments.progress ?? []).filter((p) => p.completed).length

  return (
    <MemberShell
      firstName={firstName}
      planLabel={usage?.planName}
      isPaid={Boolean(usage?.isPaid)}
      dense={dense}
      completionPercentage={completionPercentage}
      hasAvatar={hasAvatar}
      assessmentsDone={assessmentsDone}
      assessmentsTotal={5}
      renewSoon={Boolean(usage?.renewSoon)}
      daysRemaining={usage?.daysRemaining ?? null}
      trialDaysRemaining={usage?.trialDaysRemaining ?? null}
      isTrialBoost={Boolean(usage?.isTrialBoost)}
    >
      {children}
    </MemberShell>
  )
}
