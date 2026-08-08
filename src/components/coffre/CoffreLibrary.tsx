"use client"

import * as React from "react"
import { Library, Sparkles } from "lucide-react"
import { CoffrePremiumModal } from "@/components/coffre/CoffrePremiumModal"
import { CoffreResourceCard } from "@/components/coffre/CoffreResourceCard"
import { CoffreUnlockSection } from "@/components/coffre/CoffreUnlockSection"
import { unlockCoffreResource } from "@/app/actions/coffre"
import {
  getCoffreStats,
  type CoffreResource,
} from "@/lib/coffre/resources"
import type { CoffreAccessState } from "@/lib/coffre/unlock"
import {
  COFFRE_INITIAL_UNLOCKS,
  COFFRE_UNLOCKS_PER_MONTH,
  isResourceUnlocked,
} from "@/lib/coffre/unlock"
import { PLANS } from "@/lib/billing/plans"

type Props = {
  resources: CoffreResource[]
  initialAccess: CoffreAccessState
}

export function CoffreLibrary({ resources, initialAccess }: Props) {
  const [access, setAccess] = React.useState(initialAccess)
  const [modalOpen, setModalOpen] = React.useState(false)
  const [modalTitle, setModalTitle] = React.useState<string | undefined>()
  const [unlockingId, setUnlockingId] = React.useState<string | null>(null)
  const [justUnlockedId, setJustUnlockedId] = React.useState<string | null>(
    null
  )
  const [toast, setToast] = React.useState<string | null>(null)
  const stats = React.useMemo(() => getCoffreStats(), [])
  const alliancePrice = PLANS.premium_plus.amountXof.toLocaleString("fr-FR")

  React.useEffect(() => {
    setAccess(initialAccess)
  }, [initialAccess])

  const openPremiumModal = (title?: string) => {
    setModalTitle(title)
    setModalOpen(true)
  }

  const handleUnlock = async (resource: CoffreResource) => {
    if (!access.isPaid) {
      openPremiumModal(resource.title)
      return
    }
    if (access.remainingSlots <= 0) {
      setToast(
        "Prochain déblocage dans un mois — deux nouvelles ressources au choix."
      )
      return
    }

    setUnlockingId(resource.id)
    setToast(null)
    const result = await unlockCoffreResource(resource.id)
    setUnlockingId(null)

    if (!result.ok) {
      if (result.error?.includes("Alliance")) {
        openPremiumModal(resource.title)
      } else {
        setToast(result.error ?? "Déblocage impossible.")
      }
      if (result.access) setAccess(result.access)
      return
    }

    if (result.access) setAccess(result.access)
    setJustUnlockedId(resource.id)
    setToast(`« ${resource.title} » est maintenant disponible.`)
    window.setTimeout(() => setJustUnlockedId(null), 900)
  }

  const nextLabel = access.nextUnlockAt
    ? new Date(access.nextUnlockAt).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
      })
    : null

  return (
    <div className="space-y-8">
      <header className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-gradient-to-br from-[#F8F4EE] via-[#F3EFE8] to-[#E8E0D4] px-5 py-8 sm:px-8 sm:py-10 shadow-premium">
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(circle, rgba(184,149,74,0.35), transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(92,31,40,0.22), transparent 70%)",
          }}
        />

        <div className="relative space-y-4 max-w-2xl">
          <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
            <Library className="h-3.5 w-3.5" />
            Bibliothèque exclusive · vignettes Premium
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.05]">
            Le Coffre Premium
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {stats.total} ressources exclusives — guides, journaux, prières,
            exercices et préparation familiale — pour ceux qui préparent un
            mariage sérieux, pas un swipe.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {access.isPaid ? (
              <>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/35 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent">
                  <Sparkles className="h-3.5 w-3.5" />
                  {access.unlockedIds.length}/{access.unlockQuota} débloquées
                </span>
                {access.remainingSlots > 0 ? (
                  <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
                    {access.remainingSlots} au choix maintenant
                  </span>
                ) : nextLabel ? (
                  <span className="inline-flex rounded-full border border-border bg-white/70 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                    +{COFFRE_UNLOCKS_PER_MONTH} le {nextLabel}
                  </span>
                ) : null}
              </>
            ) : (
              <>
                <span className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent">
                  {stats.total} ressources · Alliance
                </span>
                <span className="inline-flex rounded-full border border-border bg-white/70 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  Aperçu Découverte — téléchargement réservé
                </span>
              </>
            )}
          </div>
        </div>
      </header>

      {!access.isPaid && (
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/[0.07] via-accent/[0.08] to-primary/[0.05] px-4 py-4 sm:px-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              Dès Alliance ({alliancePrice} FCFA/mois) :{" "}
              {COFFRE_INITIAL_UNLOCKS} ressources au choix, puis +
              {COFFRE_UNLOCKS_PER_MONTH} chaque mois
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Vous voyez tout le Coffre. Alliance ouvre les PDF — et la
              bibliothèque grandit avec votre abonnement.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openPremiumModal()}
            className="shrink-0 inline-flex h-11 items-center justify-center rounded-xl bg-primary text-primary-foreground px-5 text-sm font-semibold"
          >
            Ouvrir le Coffre avec Alliance
          </button>
        </div>
      )}

      {toast && (
        <p
          role="status"
          className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-foreground animate-in fade-in duration-300"
        >
          {toast}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
        {resources.map((resource, index) => {
          const unlocked = isResourceUnlocked(
            resource.id,
            access,
            resource.premiumOnly
          )
          const locked = !unlocked
          return (
            <CoffreResourceCard
              key={resource.id}
              resource={resource}
              locked={locked}
              canUnlock={access.isPaid && access.remainingSlots > 0}
              isPaid={access.isPaid}
              unlocking={unlockingId === resource.id}
              justUnlocked={justUnlockedId === resource.id}
              index={index}
              onLockedClick={() => {
                if (access.isPaid) {
                  setToast(
                    nextLabel
                      ? `Prochaines ressources disponibles le ${nextLabel}.`
                      : "Aucun créneau de déblocage pour le moment."
                  )
                } else {
                  openPremiumModal(resource.title)
                }
              }}
              onUnlock={() => handleUnlock(resource)}
            />
          )
        })}
      </div>

      <CoffreUnlockSection
        resources={resources}
        isPaid={access.isPaid}
        onUnlockCta={() => openPremiumModal()}
      />

      <CoffrePremiumModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        resourceTitle={modalTitle}
      />
    </div>
  )
}
