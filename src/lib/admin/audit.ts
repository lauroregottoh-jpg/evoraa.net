import { createAdminClient } from "@/utils/supabase/admin"
import { createClient } from "@/utils/supabase/server"

type AuditArgs = {
  action: string
  targetType?: string | null
  targetId?: string | null
  meta?: Record<string, unknown> | null
}

/**
 * Journal ops — never throws / never blocks the caller.
 */
export async function logAdminAction(args: AuditArgs) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const admin = createAdminClient()
    await admin.from("admin_audit_log").insert({
      actor_user_id: user?.id ?? null,
      actor_email: user?.email ?? null,
      action: args.action,
      target_type: args.targetType ?? null,
      target_id: args.targetId ?? null,
      meta: args.meta ?? {},
    })
  } catch {
    /* audit must not block ops */
  }
}

export type AdminAuditRow = {
  id: string
  actorUserId: string | null
  actorEmail: string | null
  action: string
  targetType: string | null
  targetId: string | null
  meta: Record<string, unknown> | null
  createdAt: string
}

/**
 * Lecture paginée du journal ops (staff). Service role bypass RLS for consistency.
 */
export async function listAdminAuditLog(input: {
  action?: string | null
  actorEmail?: string | null
  limit?: number
}): Promise<{ rows: AdminAuditRow[]; error?: string }> {
  try {
    const limit = Math.min(Math.max(input.limit ?? 40, 1), 80)
    const admin = createAdminClient()
    let q = admin
      .from("admin_audit_log")
      .select(
        "id, actor_user_id, actor_email, action, target_type, target_id, meta, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(limit)

    const action = input.action?.trim()
    if (action) q = q.eq("action", action)

    const email = input.actorEmail?.trim().toLowerCase()
    if (email) q = q.ilike("actor_email", email)

    const { data, error } = await q
    if (error) return { rows: [], error: error.message }

    const rows: AdminAuditRow[] = (data ?? []).map((r) => ({
      id: r.id as string,
      actorUserId: (r.actor_user_id as string) || null,
      actorEmail: (r.actor_email as string) || null,
      action: r.action as string,
      targetType: (r.target_type as string) || null,
      targetId: (r.target_id as string) || null,
      meta:
        r.meta && typeof r.meta === "object"
          ? (r.meta as Record<string, unknown>)
          : null,
      createdAt: r.created_at as string,
    }))
    return { rows }
  } catch (e) {
    return {
      rows: [],
      error: e instanceof Error ? e.message : "audit_list_failed",
    }
  }
}
