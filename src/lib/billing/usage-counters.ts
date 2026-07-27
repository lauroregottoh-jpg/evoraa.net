import { createClient } from "@/utils/supabase/server"

export const EVA_COUNTER_KEY = "eva_questions"

export function todayPeriodKey() {
  return new Date().toISOString().slice(0, 10)
}

export async function getCounterCount(
  userId: string,
  counterKey: string,
  periodKey: string
): Promise<number> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("usage_counters")
    .select("count")
    .eq("user_id", userId)
    .eq("counter_key", counterKey)
    .eq("period_key", periodKey)
    .maybeSingle()
  return data?.count ?? 0
}

export async function incrementCounter(
  userId: string,
  counterKey: string,
  periodKey: string
): Promise<number> {
  const supabase = await createClient()
  const current = await getCounterCount(userId, counterKey, periodKey)
  const next = current + 1

  const { error } = await supabase.from("usage_counters").upsert(
    {
      user_id: userId,
      counter_key: counterKey,
      period_key: periodKey,
      count: next,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,counter_key,period_key" }
  )

  if (error) throw new Error(error.message)
  return next
}
