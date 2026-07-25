import { createClient } from "@/utils/supabase/server"
import { getPlan, isPaidPlan, type PlanDefinition, type PlanId } from "@/lib/billing/plans"

export type ActiveSubscription = {
  id: string
  planId: PlanId
  status: string
  startsAt: string | null
  endsAt: string | null
  plan: PlanDefinition
}

export async function getActiveSubscription(
  userId?: string
): Promise<ActiveSubscription | null> {
  const supabase = await createClient()
  let uid = userId
  if (!uid) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    uid = user?.id
  }
  if (!uid) return null

  const { data } = await supabase
    .from("subscriptions")
    .select("id, plan, status, starts_at, ends_at")
    .eq("user_id", uid)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!data) return null

  const endsAt = data.ends_at ? new Date(data.ends_at) : null
  if (endsAt && endsAt.getTime() < Date.now()) {
    await supabase
      .from("subscriptions")
      .update({ status: "expired" })
      .eq("id", data.id)
    return null
  }

  const planId = (data.plan as PlanId) || "free"
  const safeId: PlanId =
    planId === "premium" || planId === "premium_plus" || planId === "free"
      ? planId
      : "free"
  return {
    id: data.id,
    planId: safeId,
    status: data.status ?? "active",
    startsAt: data.starts_at,
    endsAt: data.ends_at,
    plan: getPlan(safeId),
  }
}

export async function getUserEntitlements(userId?: string) {
  const sub = await getActiveSubscription(userId)
  const plan = sub?.plan ?? getPlan("free")
  return {
    planId: plan.id,
    planName: plan.name,
    limits: plan.limits,
    subscription: sub,
    isPaid: isPaidPlan(plan.id),
  }
}
