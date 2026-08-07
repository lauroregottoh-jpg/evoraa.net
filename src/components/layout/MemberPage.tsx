import { MemberShell } from "@/components/layout/MemberShell"
import { getUsageSnapshot } from "@/lib/billing/usage"
import { getAssessmentsProgress } from "@/app/actions/assessments"
import { getCoffreState } from "@/app/actions/coffre"
import { createClient } from "@/utils/supabase/server"
import { COFFRE_INITIAL_UNLOCKS } from "@/lib/coffre/unlock"

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
  let coffreUnlocked = 0
  let coffreQuota = COFFRE_INITIAL_UNLOCKS

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

  if (usage?.isPaid) {
    const coffre = await getCoffreState()
    coffreUnlocked = coffre.access.unlockedIds?.length ?? 0
    coffreQuota = coffre.access.unlockQuota ?? COFFRE_INITIAL_UNLOCKS
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
      suggestionsLimit={usage?.suggestionsLimit ?? 15}
      evaQuestionsLimit={usage?.evaQuestionsLimit ?? 20}
      coffreUnlocked={coffreUnlocked}
      coffreQuota={coffreQuota}
    >
      {children}
    </MemberShell>
  )
}
