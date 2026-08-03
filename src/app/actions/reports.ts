"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import {
  labelForReason,
  MEMBER_REPORT_REASONS,
} from "@/lib/admin/moderationCatalog"
import { OPS_CONSOLE_PATH } from "@/lib/admin/consolePath"

export async function submitSafetyReportAction(payload: {
  reportedUserId: string
  reasonCode: string
  details?: string
}): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Connectez-vous pour signaler un membre." }

  const reportedUserId = payload.reportedUserId.trim()
  if (!reportedUserId) {
    return { error: "Membre signalé introuvable." }
  }
  if (reportedUserId === user.id) {
    return { error: "Vous ne pouvez pas vous signaler vous-même." }
  }

  const label =
    labelForReason(MEMBER_REPORT_REASONS, payload.reasonCode) ||
    payload.reasonCode ||
    "Autre motif"
  const details = (payload.details || "").trim()
  const reason = details ? `[${payload.reasonCode}] ${label} — ${details}` : `[${payload.reasonCode}] ${label}`

  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    reported_user_id: reportedUserId,
    reason,
    status: "pending",
  })

  if (error) return { error: error.message }

  revalidatePath(OPS_CONSOLE_PATH)
  revalidatePath("/moderation")
  revalidatePath("/messages")
  return { success: true }
}
