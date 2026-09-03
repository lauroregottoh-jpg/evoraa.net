"use client"

import * as React from "react"
import Link from "next/link"
import { CoachingClientHome } from "@/components/coaching/CoachingClientHome"
import { CoachingCoachInbox } from "@/components/coaching/CoachingCoachInbox"
import { CoachingLockOverlay } from "@/components/coaching/CoachingLockOverlay"
import {
  activateCoachByCodeAction,
  getMyCoachProfileAction,
} from "@/lib/coaching/actions"
import { getCoachingAccessAction } from "@/lib/coaching/accessAction"

/**
 * Faire votre session — parcours coaché par défaut.
 * Espace coach uniquement si profil coach (code) ; pas de question à tous les membres.
 */
export function CoachingSessionClient() {
  const [boot, setBoot] = React.useState(true)
  const [unlocked, setUnlocked] = React.useState(false)
  const [mode, setMode] = React.useState<"client" | "coach">("client")
  const [coachReady, setCoachReady] = React.useState(false)
  const [coachName, setCoachName] = React.useState("")
  const [coachCode, setCoachCode] = React.useState("")
  const [codeError, setCodeError] = React.useState("")
  const [codeLoading, setCodeLoading] = React.useState(false)
  const [showCoachGate, setShowCoachGate] = React.useState(false)

  React.useEffect(() => {
    void (async () => {
      const [access, me] = await Promise.all([
        getCoachingAccessAction(),
        getMyCoachProfileAction(),
      ])
      setUnlocked(access.unlocked)
      if (me.coach) {
        setCoachReady(true)
        setCoachName(me.coach.name)
        if (access.isCoach) setMode("coach")
      }
      setBoot(false)
    })()
  }, [])

  const submitCoachCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setCodeLoading(true)
    setCodeError("")
    const r = await activateCoachByCodeAction(coachCode)
    setCodeLoading(false)
    if (r.error) {
      setCodeError(r.error)
      return
    }
    setCoachReady(true)
    setCoachName(r.coachName || "")
    setMode("coach")
    setShowCoachGate(false)
  }

  if (boot) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-sm text-muted-foreground">
        Chargement…
      </div>
    )
  }

  const body =
    mode === "coach" && coachReady ? (
      <CoachingCoachInbox
        coachName={coachName}
        onSwitchRole={() => setMode("client")}
      />
    ) : showCoachGate && !coachReady ? (
      <div className="max-w-lg mx-auto space-y-6 pb-10">
        <header className="rounded-[1.75rem] border border-[#B8954A]/35 bg-gradient-to-br from-[#7F5557] via-[#8B5C62] to-[#7F5557] p-7 text-[#F2EBE0]">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#D4AF72]">
            Espace coach
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold">
            Code coach
          </h1>
          <p className="mt-2 text-sm text-white/75">
            Réservé aux coachs KELIAA — le coaché n’a pas besoin de code.
          </p>
        </header>
        <form
          onSubmit={submitCoachCode}
          className="rounded-2xl border bg-white p-6 space-y-4"
        >
          <label className="block space-y-1.5 text-sm">
            <span className="font-medium">Votre code</span>
            <input
              value={coachCode}
              onChange={(e) => setCoachCode(e.target.value)}
              className="w-full h-11 rounded-xl border px-3 text-sm uppercase tracking-wider"
              placeholder="KE-····"
              autoComplete="off"
            />
          </label>
          {codeError ? (
            <p className="text-xs text-destructive">{codeError}</p>
          ) : null}
          <button
            type="submit"
            disabled={codeLoading}
            className="w-full h-11 rounded-xl bg-[#7F5557] text-[#F2EBE0] text-sm font-bold disabled:opacity-60"
          >
            {codeLoading ? "Vérification…" : "Entrer"}
          </button>
          <button
            type="button"
            onClick={() => setShowCoachGate(false)}
            className="w-full text-xs text-muted-foreground underline"
          >
            Retour à mon espace coaché
          </button>
        </form>
      </div>
    ) : (
      <CoachingClientHome
        onOpenCoachSpace={() => {
          if (coachReady) setMode("coach")
          else setShowCoachGate(true)
        }}
      />
    )

  if (!unlocked) {
    return (
      <div className="max-w-3xl mx-auto pb-10">
        <CoachingLockOverlay>
          <div className="min-h-[28rem] space-y-4 p-2">
            <div className="rounded-[1.75rem] border border-[#B8954A]/35 bg-gradient-to-br from-[#7F5557] to-[#7F5557] p-8 text-[#F2EBE0]">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#D4AF72]">
                Faire votre session
              </p>
              <h1 className="mt-2 font-serif text-3xl font-bold">
                Votre parcours coaching
              </h1>
              <p className="mt-2 text-sm text-white/75">
                Réservation, salle audio, historique — aperçu.
              </p>
            </div>
            <div className="rounded-2xl border bg-white p-6 h-40" />
            <div className="rounded-2xl border bg-white p-6 h-32" />
          </div>
        </CoachingLockOverlay>
        <p className="text-center text-xs text-muted-foreground mt-4">
          <Link href="/coaching" className="underline">
            Retour à l’offre coaching
          </Link>
        </p>
      </div>
    )
  }

  return body
}
