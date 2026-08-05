"use server"

import { getKillSwitches } from "@/lib/platform/killSwitches"

/** Gate inscriptions (email + Google register). */
export async function assertRegistrationOpenAction(): Promise<{
  error?: string
}> {
  const ks = await getKillSwitches()
  if (ks.registrationsPaused || ks.maintenanceMode) {
    return {
      error:
        "Les inscriptions sont temporairement fermées. Réessayez plus tard ou contactez le support.",
    }
  }
  return {}
}
