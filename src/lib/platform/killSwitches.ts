import { createAdminClient } from "@/utils/supabase/admin"

export type KillSwitches = {
  maintenanceMode: boolean
  paymentsPaused: boolean
  /** Soft flag — enforcement registerAction nécessite AUTH UNLOCK. */
  registrationsPaused: boolean
}

const DEFAULTS: KillSwitches = {
  maintenanceMode: false,
  paymentsPaused: false,
  registrationsPaused: false,
}

function asBool(value: unknown, fallback: boolean) {
  if (typeof value === "boolean") return value
  if (value === "true" || value === "1") return true
  if (value === "false" || value === "0") return false
  if (value && typeof value === "object" && "enabled" in (value as object)) {
    return Boolean((value as { enabled: unknown }).enabled)
  }
  return fallback
}

/** Lit kill switches depuis platform_settings (service role / server). */
export async function getKillSwitches(): Promise<KillSwitches> {
  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from("platform_settings")
      .select("key, value")
      .in("key", [
        "maintenance_mode",
        "payments_paused",
        "registrations_paused",
      ])

    const map = new Map<string, unknown>()
    for (const row of data ?? []) {
      map.set(row.key as string, row.value)
    }

    return {
      maintenanceMode: asBool(map.get("maintenance_mode"), DEFAULTS.maintenanceMode),
      paymentsPaused: asBool(map.get("payments_paused"), DEFAULTS.paymentsPaused),
      registrationsPaused: asBool(
        map.get("registrations_paused"),
        DEFAULTS.registrationsPaused
      ),
    }
  } catch {
    return { ...DEFAULTS }
  }
}

export async function assertPaymentsNotPaused(): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const ks = await getKillSwitches()
  if (ks.paymentsPaused || ks.maintenanceMode) {
    return {
      ok: false,
      error:
        "Les paiements sont temporairement suspendus. Réessayez plus tard ou contactez le support.",
    }
  }
  return { ok: true }
}
