"use server"

import { createClient } from "@/utils/supabase/server"
import { canUseCoachingLive } from "@/lib/coaching/access"
import { resolveAuthEmail } from "@/lib/admin/consolePath"

export async function getCoachingAccessAction(): Promise<{
  unlocked: boolean
  isCoach: boolean
  email: string | null
}> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { unlocked: false, isCoach: false, email: null }

  const email = resolveAuthEmail(user)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle()

  const { data: coach } = await supabase
    .from("coaches")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()

  const unlocked = canUseCoachingLive({
    email,
    role: (profile?.role as string) || null,
  })

  return {
    unlocked,
    isCoach: Boolean(coach),
    email,
  }
}
