import { createClient } from "@/utils/supabase/server"
import { getActiveSubscription } from "@/lib/billing/entitlements"
import { isPaidPlan } from "@/lib/billing/plans"
import { getCoffreResource } from "@/lib/coffre/resources"
import {
  buildCoffreAccessState,
  type CoffreAccessState,
} from "@/lib/coffre/unlock"

export async function loadCoffreUnlockedIds(userId: string): Promise<string[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("coffre_unlocks")
    .select("resource_id")
    .eq("user_id", userId)

  if (error) {
    console.warn("[coffre] unlocks read:", error.message)
    return []
  }

  return (data ?? [])
    .map((row) => row.resource_id as string)
    .filter(Boolean)
}

export async function resolveCoffreAccess(
  userId: string
): Promise<CoffreAccessState> {
  const sub = await getActiveSubscription(userId)
  const isPaid = Boolean(sub && isPaidPlan(sub.planId))
  const unlockedIds = isPaid ? await loadCoffreUnlockedIds(userId) : []

  return buildCoffreAccessState({
    isPaid,
    startsAt: isPaid ? sub?.startsAt ?? null : null,
    unlockedIds,
  })
}

export async function userCanDownloadCoffreResource(
  resourceId: string,
  userId: string
): Promise<boolean> {
  const resource = getCoffreResource(resourceId)
  if (!resource) return false
  if (!resource.premiumOnly) return true

  const access = await resolveCoffreAccess(userId)
  if (!access.isPaid) return false
  return access.unlockedIds.includes(resourceId)
}
