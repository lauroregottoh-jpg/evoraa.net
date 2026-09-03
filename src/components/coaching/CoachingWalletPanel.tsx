"use client"

import * as React from "react"
import {
  getCoachingCreditBalanceAction,
  getLinkedCoachesAction,
  linkCoachByCodeAction,
} from "@/lib/coaching/actions"
import { COACHING_CREDIT_DISPLAY_MINUTES } from "@/lib/coaching/domain"

export function CoachingWalletPanel() {
  const [balance, setBalance] = React.useState<number | null>(null)
  const [coaches, setCoaches] = React.useState<
    Array<{ id: string; name: string; code?: string }>
  >([])
  const [code, setCode] = React.useState("")
  const [msg, setMsg] = React.useState<string | null>(null)
  const [busy, setBusy] = React.useState(false)

  const refresh = React.useCallback(async () => {
    const [b, c] = await Promise.all([
      getCoachingCreditBalanceAction(),
      getLinkedCoachesAction(),
    ])
    if (typeof b.balance === "number") setBalance(b.balance)
    if (c.coaches) setCoaches(c.coaches)
  }, [])

  React.useEffect(() => {
    void refresh()
  }, [refresh])

  const onLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    const res = await linkCoachByCodeAction(code)
    setBusy(false)
    if (res.error) {
      setMsg(res.error)
      return
    }
    setMsg(`Coach associé : ${res.coachName}`)
    setCode("")
    await refresh()
  }

  return (
    <section className="rounded-2xl border border-[#5C1F28]/15 bg-[#FBF9F6] p-5 space-y-4">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B8954A]">
          Mon coaching
        </p>
        <h2 className="font-serif text-xl font-bold text-[#5C1F28] mt-1">
          Crédits & coach
        </h2>
        <p className="text-sm text-[#2B2421]/70 mt-1">
          1 crédit = {COACHING_CREDIT_DISPLAY_MINUTES} minutes de séance
          (budget technique 40 min côté serveur).
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

      <form onSubmit={onLink} className="space-y-2">
        <label className="block text-sm font-medium text-[#2B2421]">
          Code coach
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="ex. KE-4827"
            className="mt-1 w-full rounded-xl border border-[#5C1F28]/20 bg-white px-3 py-2 text-sm"
            autoCapitalize="characters"
          />
        </label>
        <button
          type="submit"
          disabled={busy || !code.trim()}
          className="rounded-xl bg-[#5C1F28] text-[#F8F4EE] px-4 py-2 text-sm font-semibold disabled:opacity-50"
        >
          Associer mon coach
        </button>
      </form>

      {msg ? (
        <p className="text-sm text-[#5C1F28] bg-[#5C1F28]/08 rounded-lg px-3 py-2">
          {msg}
        </p>
      ) : null}

      {coaches.length > 0 ? (
        <ul className="text-sm space-y-1">
          {coaches.map((c) => (
            <li key={c.id}>
              <span className="font-semibold">{c.name}</span>
              {c.code ? (
                <span className="text-[#8A6A2E]"> · {c.code}</span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-[#2B2421]/55">
          Aucun coach lié pour l’instant. Entrez le code remis par votre coach.
        </p>
      )}
    </section>
  )
}
