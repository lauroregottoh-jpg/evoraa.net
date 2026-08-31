import { MemberPage } from "@/components/layout/MemberPage"
import { CoachingSalesPage } from "@/components/coaching/CoachingSalesPage"
import { CoachingLockOverlay } from "@/components/coaching/CoachingLockOverlay"
import { getCheckoutHints } from "@/app/actions/billing"
import { getCoachingCreditBalanceAction } from "@/lib/coaching/actions"
import { getCoachingAccessAction } from "@/lib/coaching/accessAction"
import { createClient } from "@/utils/supabase/server"

export const dynamic = "force-dynamic"

export default async function CoachingPage({
  searchParams,
}: {
  searchParams: Promise<{
    module?: string
    moduleTitle?: string
    cancel?: string
  }>
}) {
  const sp = await searchParams
  const [hints, balanceRes, supabase, access] = await Promise.all([
    getCheckoutHints(),
    getCoachingCreditBalanceAction(),
    createClient(),
    getCoachingAccessAction(),
  ])
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let initialFirstName = ""
  let initialLastName = ""
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("user_id", user.id)
      .maybeSingle()
    initialFirstName = profile?.first_name ?? ""
    initialLastName = profile?.last_name ?? ""
  }

  const hasCredits = (balanceRes.balance ?? 0) > 0

  const page = (
    <CoachingSalesPage
      suggestedMode={hints?.suggestedMode ?? "mobile_money"}
      enabledPaymentModes={hints?.enabledPaymentModes ?? ["mobile_money"]}
      moduleId={sp.module}
      moduleTitle={sp.moduleTitle}
      initialFirstName={initialFirstName}
      initialLastName={initialLastName}
      cancel={sp.cancel === "1"}
      hasCredits={hasCredits}
    />
  )

  return (
    <MemberPage>
      {access.unlocked ? (
        page
      ) : (
        <CoachingLockOverlay
          title="Coaching — aperçu"
          body="L’espace coaching est visible mais l’accès live est temporairement réservé. Un cadenas protège la réservation et la salle audio pendant qu’on finalise le parcours."
        >
          {page}
        </CoachingLockOverlay>
      )}
    </MemberPage>
  )
}
