"use client"

import * as React from "react"
import { Clock3, Rocket, TrendingUp, X } from "lucide-react"
import { cn } from "@/utils/cn"
import { BOOST_PACKS, type BoostPackId } from "@/lib/billing/premiumOffers"

export function BoostSection() {
  const [openIntro, setOpenIntro] = React.useState(false)
  const [openPacks, setOpenPacks] = React.useState(false)
  const [selected, setSelected] = React.useState<BoostPackId>("boost_3d")
  const [message, setMessage] = React.useState("")

  const pack = BOOST_PACKS.find((p) => p.id === selected)!

  const confirm = () => {
    setMessage(
      `Pack « ${pack.label} » (${pack.amountXof.toLocaleString("fr-FR")} FCFA) prêt. Le paiement Boost sera branché sur Bictorys dès activation de la table profile_boosts.`
    )
    setOpenPacks(false)
    setOpenIntro(false)
  }

  return (
    <section className="rounded-2xl border border-border bg-white p-5 sm:p-7 space-y-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Boost</p>
          <h2 className="font-serif text-2xl font-bold">Donnez plus de visibilité à votre profil</h2>
          <p className="text-sm text-muted-foreground max-w-xl">
            Pendant la durée du Boost, votre profil est présenté en priorité auprès des membres
            compatibles. Jusqu&apos;à 10 fois plus de visibilité. Idéal lorsque votre profil est
            complet et que vous souhaitez accélérer votre recherche.
          </p>
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
          <Rocket className="h-5 w-5" />
        </span>
      </div>

      <div className="flex flex-wrap gap-3 text-xs font-semibold">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
          10× visibilité
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1.5 text-accent-foreground">
          Compatible Alliance
        </span>
      </div>

      <button
        type="button"
        onClick={() => setOpenIntro(true)}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground h-11 px-6 text-sm font-semibold hover:bg-primary/90"
      >
        <Rocket className="h-4 w-4" />
        Acheter un Boost
      </button>
      {message && <p className="text-xs text-muted-foreground">{message}</p>}

      {openIntro && (
        <Modal onClose={() => setOpenIntro(false)} title="Boostez votre visibilité">
          <div className="flex justify-center mb-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Rocket className="h-6 w-6" />
            </span>
          </div>
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            Apparaissez en priorité dans les recherches et recevez jusqu&apos;à 10× plus de vues sur
            votre profil.
          </p>
          <div className="mt-4 flex justify-center gap-4 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              10× visibilité
            </span>
            <span className="inline-flex items-center gap-1.5 text-accent">Alliance</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setOpenIntro(false)
              setOpenPacks(true)
            }}
            className="mt-6 w-full rounded-xl bg-primary text-primary-foreground h-11 text-sm font-semibold"
          >
            Acheter un Boost
          </button>
          <button
            type="button"
            onClick={() => setOpenIntro(false)}
            className="mt-2 w-full h-10 text-sm text-muted-foreground hover:text-foreground"
          >
            Plus tard
          </button>
        </Modal>
      )}

      {openPacks && (
        <Modal onClose={() => setOpenPacks(false)} title="Choisissez votre boost">
          <div className="space-y-2.5">
            {BOOST_PACKS.map((p) => {
              const active = p.id === selected
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelected(p.id)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                    active ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                  )}
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{p.label}</p>
                    <p className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-0.5">
                      <Clock3 className="h-3 w-3" />
                      {p.durationLabel}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-primary">
                    {p.amountXof.toLocaleString("fr-FR")} F
                  </p>
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={confirm}
            className="mt-5 w-full rounded-xl bg-primary text-primary-foreground h-11 text-sm font-semibold"
          >
            Continuer · {pack.amountXof.toLocaleString("fr-FR")} FCFA
          </button>
          <button
            type="button"
            onClick={() => {
              setOpenPacks(false)
              setOpenIntro(true)
            }}
            className="mt-2 w-full h-10 text-sm text-muted-foreground hover:text-foreground"
          >
            ← Retour
          </button>
        </Modal>
      )}
    </section>
  )
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/45 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white border border-border p-5 sm:p-6 shadow-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground hover:bg-secondary"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
        <h3 className="font-serif text-xl font-bold text-center mb-1 pr-6">{title}</h3>
        {children}
      </div>
    </div>
  )
}
