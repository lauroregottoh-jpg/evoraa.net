"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { getActiveSubscription } from "@/lib/billing/entitlements"
import { isPaidPlan } from "@/lib/billing/plans"
import { getCoffreResource } from "@/lib/coffre/resources"
import {
  loadCoffreUnlockedIds,
  resolveCoffreAccess,
} from "@/lib/coffre/access"
import {
  buildCoffreAccessState,
  type CoffreAccessState,
} from "@/lib/coffre/unlock"

export type CoffreStateResult = {
  access: CoffreAccessState
  error?: string
}

export async function getCoffreState(): Promise<CoffreStateResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      access: buildCoffreAccessState({
        isPaid: false,
        startsAt: null,
        unlockedIds: [],
      }),
      error: "Connectez-vous pour accéder au Coffre.",
    }
  }

  return { access: await resolveCoffreAccess(user.id) }
}

export async function unlockCoffreResource(
  resourceId: string
): Promise<{ ok: boolean; error?: string; access?: CoffreAccessState }> {
  const resource = getCoffreResource(resourceId)
  if (!resource) {
    return { ok: false, error: "Ressource introuvable." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Connectez-vous pour débloquer." }
  }

  const sub = await getActiveSubscription(user.id)
  if (!sub || !isPaidPlan(sub.planId)) {
    return {
      ok: false,
      error: "Réservé aux membres Alliance.",
    }
  }

  const unlockedIds = await loadCoffreUnlockedIds(user.id)
  const access = buildCoffreAccessState({
    isPaid: true,
    startsAt: sub.startsAt,
    unlockedIds,
  })

  if (unlockedIds.includes(resourceId)) {
    return { ok: true, access }
  }

  if (access.remainingSlots <= 0) {
    return {
      ok: false,
      error:
        "Aucun créneau disponible pour le moment. Deux nouvelles ressources s’ouvrent chaque mois.",
      access,
    }
  }

  const { error } = await supabase.from("coffre_unlocks").insert({
    user_id: user.id,
    resource_id: resourceId,
  })

  if (error) {
    console.error("[coffre] unlock insert:", error.message)
    return {
      ok: false,
      error:
        "Impossible d’enregistrer le déblocage. Vérifiez que la migration coffre_unlocks est appliquée.",
      access,
    }
  }

  const nextAccess = buildCoffreAccessState({
    isPaid: true,
    startsAt: sub.startsAt,
    unlockedIds: [...unlockedIds, resourceId],
  })

  revalidatePath("/coffre-premium")
  return { ok: true, access: nextAccess }
}
