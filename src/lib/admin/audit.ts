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
