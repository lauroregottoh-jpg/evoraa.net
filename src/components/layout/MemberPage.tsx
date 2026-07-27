import { MemberShell } from "@/components/layout/MemberShell"
import { getUsageSnapshot } from "@/lib/billing/usage"
import { createClient } from "@/utils/supabase/server"

type MemberPageProps = {
  children: React.ReactNode
  dense?: boolean
}

/** Shell membre unifié : menu + quotas plan sur toutes les pages produit. */
export async function MemberPage({ children, dense }: MemberPageProps) {
  const [usage, supabase] = await Promise.all([getUsageSnapshot(), createClient()])
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let firstName: string | undefined
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("first_name")
      .eq("user_id", user.id)
      .maybeSingle()
    firstName = data?.first_name ?? undefined
  }

  return (
    <MemberShell
      firstName={firstName}
      planLabel={usage?.planName}
      isPaid={Boolean(usage?.isPaid)}
      dense={dense}
    >
      {children}
    </MemberShell>
  )
}
