"use client"

import * as React from "react"
import { getMyCoupleStateAction } from "@/app/actions/couple"
import {
  CoupleLockedCard,
  CouplePaywallOverlay,
} from "@/components/couple/CouplePaywallOverlay"

/**
 * Affiche le contenu membre seulement si un couple payé / rejoint existe.
 * Sinon : aperçu grisé + CTA paiement (sans page vide).
 */
export function CoupleRequirePaid({
  title,
  body,
  previewTitle,
  previewDescription,
  children,
}: {
  title?: string
  body?: string
  previewTitle: string
  previewDescription: string
  children: React.ReactNode
}) {
  const [ready, setReady] = React.useState(false)
  const [hasCouple, setHasCouple] = React.useState(false)

  React.useEffect(() => {
    void getMyCoupleStateAction().then((s) => {
      setHasCouple(Boolean("couple" in s && s.couple))
      setReady(true)
    })
  }, [])

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Chargement…</p>
  }

  if (!hasCouple) {
    return (
      <CouplePaywallOverlay title={title} body={body}>
        <div className="max-w-2xl space-y-4">
          <CoupleLockedCard
            title={previewTitle}
            description={previewDescription}
          />
          <CoupleLockedCard
            title="Livrables séparés"
            description="Chapitres, convergences, différences, exercices et plan d’action — chacun téléchargeable à part."
          />
        </div>
      </CouplePaywallOverlay>
    )
  }

  return <>{children}</>
}
