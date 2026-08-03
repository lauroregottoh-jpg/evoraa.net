"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"

const REASON_LABELS: Record<string, string> = {
  propos_deplaces:
    "Propos déplacés, impatients ou contraires au respect chrétien",
  authenticite_suspecte: "Doute sur la véracité du profil ou des photos",
  sollicitation_commerciale:
    "Sollicitation commerciale ou demande financière suspecte",
  pression_externe: "Pression insistante pour échanger hors de Keliaa",
}

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
    REASON_LABELS[payload.reasonCode] || payload.reasonCode || "Autre motif"
  const details = (payload.details || "").trim()
  const reason = details ? `${label} — ${details}` : label

  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    reported_user_id: reportedUserId,
    reason,
    status: "pending",
  })

  if (error) return { error: error.message }

  revalidatePath("/admin")
  revalidatePath("/moderation")
  return { success: true }
}
