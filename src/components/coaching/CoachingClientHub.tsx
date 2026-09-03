"use client"

import * as React from "react"
import {
  getCoachingCreditBalanceAction,
  getLinkedCoachesAction,
} from "@/lib/coaching/actions"
import { COACHING_CREDIT_DISPLAY_MINUTES } from "@/lib/coaching/domain"
import { cn } from "@/utils/cn"

type GenderPref = "female" | "male" | "none"

const PREF_KEY = "keliaa_coach_gender_pref"

/**
 * Espace client coaching : crédits, préférence genre, suivi sessions.
 * Pas de code coach côté client (réservé ops / coach).
 */
export function CoachingClientHub({
  hideHistoryPlaceholder = false,
}: {
  hideHistoryPlaceholder?: boolean
}) {
  const [balance, setBalance] = React.useState<number | null>(null)
  const [linked, setLinked] = React.useState<
    Array<{ id: string; name: string }>
  >([])
  const [pref, setPref] = React.useState<GenderPref>("none")
  const [saved, setSaved] = React.useState(false)

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(PREF_KEY) as GenderPref | null
      if (raw === "female" || raw === "male" || raw === "none") setPref(raw)
    } catch {
      /* ignore */
    }
    void (async () => {
      const [b, c] = await Promise.all([
        getCoachingCreditBalanceAction(),
        getLinkedCoachesAction(),
      ])
      if (typeof b.balance === "number") setBalance(b.balance)
      if (c.coaches)
        setLinked(c.coaches.map((x) => ({ id: x.id, name: x.name })))
    })()
  }, [])

  const savePref = (next: GenderPref) => {
    setPref(next)
    setSaved(true)
    try {
      localStorage.setItem(PREF_KEY, next)
    } catch {
      /* ignore */
    }
    window.setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-[#5C1F28]/15 bg-[#FBF9F6] p-5 sm:p-6 space-y-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B8954A]">
            Réserver mon coaching
          </p>
          <h2 className="font-serif text-xl font-bold text-[#5C1F28] mt-1">
            Crédits & préférence coach
          </h2>
          <p className="text-sm text-[#2B2421]/70 mt-1">
            1 crédit = {COACHING_CREDIT_DISPLAY_MINUTES} minutes de séance.
            Choisissez le type de coach souhaité — le système propose un coach
            disponible selon votre préférence.
          </p>
        </div>

        <div className="rounded-xl bg-white border border-[#B8954A]/30 px-4 py-3">
          <p className="text-xs uppercase tracking-wider text-[#8A6A2E] font-semibold">
            Mes crédits
          </p>
          <p className="font-serif text-3xl font-bold text-[#5C1F28] mt-1">
            {balance === null ? "…" : balance}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-[#2B2421]">
            Je préfère un coach…
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(
              [
                { id: "female" as const, label: "Femme" },
                { id: "male" as const, label: "Homme" },
                { id: "none" as const, label: "Aucune préférence" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => savePref(opt.id)}
                className={cn(
                  "rounded-xl border px-3 py-3 text-sm font-semibold transition-colors",
                  pref === opt.id
                    ? "border-[#5C1F28] bg-[#5C1F28] text-[#F8F4EE]"
                    : "border-[#5C1F28]/20 bg-white text-[#2B2421] hover:border-[#5C1F28]/40"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {saved ? (
            <p className="text-xs text-[#5C1F28]">Préférence enregistrée.</p>
          ) : null}
        </div>
      </section>

      {!hideHistoryPlaceholder ? (
        <section className="rounded-2xl border border-[#2B2421]/10 bg-white p-5 sm:p-6 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B8954A]">
            Suivre mes sessions
          </p>
          <h2 className="font-serif text-xl font-bold text-[#5C1F28]">
            Mes séances de coaching
          </h2>
          {linked.length > 0 ? (
            <ul className="text-sm space-y-2">
              {linked.map((c) => (
                <li
                  key={c.id}
                  className="rounded-xl border border-[#B8954A]/25 bg-[#FBF9F6] px-4 py-3"
                >
                  Coach associé : <strong>{c.name}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#2B2421]/60 leading-relaxed">
              Aucune séance planifiée pour le moment. Achetez des crédits,
              indiquez votre préférence de genre, puis réservez sur le
              calendrier — votre coach apparaîtra dans l’historique.
            </p>
          )}
        </section>
      ) : linked.length > 0 ? (
        <section className="rounded-2xl border border-[#2B2421]/10 bg-white p-5 space-y-2">
          <p className="text-xs font-semibold text-[#8A6A2E]">Coach(s) associé(s)</p>
          <ul className="text-sm space-y-1">
            {linked.map((c) => (
              <li key={c.id}>
                <strong>{c.name}</strong>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
