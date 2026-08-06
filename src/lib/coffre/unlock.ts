/**
 * Quota Coffre Premium :
 * - jour 0 : 3 ressources au choix
 * - chaque mois complet d’abonnement actif : +2
 *
 * Exemple : mois 0 → 3 | mois 1 → 5 | mois 2 → 7 | …
 */

export const COFFRE_INITIAL_UNLOCKS = 3
export const COFFRE_UNLOCKS_PER_MONTH = 2

/** Mois complets écoulés depuis la date d’abonnement (anniversaire du jour). */
export function completedSubscriptionMonths(
  startsAt: string | Date | null | undefined,
  now: Date = new Date()
): number {
  if (!startsAt) return 0
  const start = startsAt instanceof Date ? startsAt : new Date(startsAt)
  if (Number.isNaN(start.getTime())) return 0

  let months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth())

  if (now.getDate() < start.getDate()) {
    months -= 1
  }

  return Math.max(0, months)
}

export function coffreUnlockQuota(
  startsAt: string | Date | null | undefined,
  now: Date = new Date()
): number {
  const months = completedSubscriptionMonths(startsAt, now)
  return COFFRE_INITIAL_UNLOCKS + months * COFFRE_UNLOCKS_PER_MONTH
}

export type CoffreAccessState = {
  isPaid: boolean
  startsAt: string | null
  monthsActive: number
  unlockQuota: number
  unlockedIds: string[]
  remainingSlots: number
  nextUnlockAt: string | null
}

export function buildCoffreAccessState(params: {
  isPaid: boolean
  startsAt: string | null
  unlockedIds: string[]
  now?: Date
}): CoffreAccessState {
  const now = params.now ?? new Date()
  const monthsActive = params.isPaid
    ? completedSubscriptionMonths(params.startsAt, now)
    : 0
  const unlockQuota = params.isPaid
    ? coffreUnlockQuota(params.startsAt, now)
    : 0
  const unlockedIds = [...new Set(params.unlockedIds)]
  const remainingSlots = Math.max(0, unlockQuota - unlockedIds.length)

  let nextUnlockAt: string | null = null
  if (params.isPaid && params.startsAt) {
    const start = new Date(params.startsAt)
    if (!Number.isNaN(start.getTime())) {
      const next = new Date(start)
      next.setMonth(start.getMonth() + monthsActive + 1)
      nextUnlockAt = next.toISOString()
    }
  }

  return {
    isPaid: params.isPaid,
    startsAt: params.startsAt,
    monthsActive,
    unlockQuota,
    unlockedIds,
    remainingSlots,
    nextUnlockAt,
  }
}

export function isResourceUnlocked(
  resourceId: string,
  access: CoffreAccessState,
  premiumOnly: boolean
): boolean {
  if (!premiumOnly) return true
  if (!access.isPaid) return false
  return access.unlockedIds.includes(resourceId)
}
