"use client"

import * as React from "react"
import { Library, Sparkles } from "lucide-react"
import { CoffrePremiumModal } from "@/components/coffre/CoffrePremiumModal"
import { CoffreResourceCard } from "@/components/coffre/CoffreResourceCard"
import { CoffreUnlockSection } from "@/components/coffre/CoffreUnlockSection"
import { unlockCoffreResource } from "@/app/actions/coffre"
import {
  getCoffreResourcesByDomain,
  getCoffreStats,
  type CoffreDomain,
  type CoffreResource,
} from "@/lib/coffre/resources"
import type { CoffreAccessState } from "@/lib/coffre/unlock"
import {
  COFFRE_INITIAL_UNLOCKS,
  COFFRE_UNLOCKS_PER_MONTH,
  isResourceUnlocked,
} from "@/lib/coffre/unlock"
import { PLANS } from "@/lib/billing/plans"
import { cn } from "@/utils/cn"

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
  const domainGroups = React.useMemo(
    () => getCoffreResourcesByDomain(resources),
    [resources]
  )
  /** Premier domaine ouvert par défaut — sinon la page paraît vide. */
  const [activeDomain, setActiveDomain] = React.useState<CoffreDomain | null>(
    () => domainGroups[0]?.domain ?? null
  )
  const stats = React.useMemo(() => getCoffreStats(), [])
  const alliancePrice = PLANS.premium_plus.amountXof.toLocaleString("fr-FR")

  const activeGroup = React.useMemo(
    () =>
      domainGroups.find((g) => g.domain === activeDomain) ??
      domainGroups[0] ??
      null,
    [domainGroups, activeDomain]
  )

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
      <header className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-gradient-to-br from-[#F2EBE0] via-[#F3EFE8] to-[#DDD0C4] px-5 py-8 sm:px-8 sm:py-10 shadow-premium">
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(circle, rgba(215,184,102,0.35), transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(100,31,43,0.22), transparent 70%)",
          }}
        />

        <div className="relative space-y-4 max-w-2xl">
          <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
            <Library className="h-3.5 w-3.5" />
            Bibliothèque exclusive · par domaine
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.05]">
            Le Coffre Premium
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {stats.total} ressources dans {stats.domains} domaines — choisissez
            celui qui vous parle, puis ouvrez les documents (journal, guide,
            prière…).
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

      {/* Domaines — pastilles discrètes sur une ligne */}
      <nav
        aria-label="Domaines du Coffre"
        className="flex flex-nowrap items-center gap-1 overflow-x-auto pb-0.5 -mx-1 px-1 scrollbar-thin"
      >
        <span className="shrink-0 mr-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
          Domaines
        </span>
        {domainGroups.map((group) => {
          const selected = activeGroup?.domain === group.domain
          return (
            <button
              key={group.domain}
              type="button"
              onClick={() => setActiveDomain(group.domain)}
              className={cn(
                "shrink-0 rounded-md px-2.5 py-1 text-[11px] sm:text-xs font-medium whitespace-nowrap transition-colors duration-200",
                selected
                  ? "bg-foreground/[0.08] text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
              )}
            >
              {group.label}
              <span className="ml-1 tabular-nums opacity-45">
                {group.resources.length}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Documents du domaine actif */}
      {activeGroup && (
        <section
          key={activeGroup.domain}
          aria-labelledby="coffre-domain-docs-title"
          className="space-y-4 animate-in fade-in duration-300"
        >
          <div className="space-y-1">
            <h2
              id="coffre-domain-docs-title"
              className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-foreground"
            >
              {activeGroup.label}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
              {activeGroup.blurb}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
            {activeGroup.resources.map((resource, index) => {
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
        </section>
      )}

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
