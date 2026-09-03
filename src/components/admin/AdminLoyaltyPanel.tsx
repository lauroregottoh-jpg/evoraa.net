"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  adminAdjustLoyalty,
  adminGetLoyaltySnapshot,
} from "@/app/actions/admin"

type Snapshot = Awaited<ReturnType<typeof adminGetLoyaltySnapshot>>

export function AdminLoyaltyPanel({
  userId,
  isFullAdmin,
}: {
  userId: string
  isFullAdmin: boolean
}) {
  const [snap, setSnap] = React.useState<Snapshot | null>(null)
  const [busy, setBusy] = React.useState(false)
  const [msg, setMsg] = React.useState<string | null>(null)
  const [deltaBonus, setDeltaBonus] = React.useState("15")
  const [deltaBoosts, setDeltaBoosts] = React.useState("0")
  const [streak, setStreak] = React.useState("")
  const [note, setNote] = React.useState("")

  const load = React.useCallback(async () => {
    setBusy(true)
    setMsg(null)
    try {
      const res = await adminGetLoyaltySnapshot(userId)
      setSnap(res)
      if ("error" in res && res.error) setMsg(res.error)
    } finally {
      setBusy(false)
    }
  }, [userId])

  React.useEffect(() => {
    void load()
  }, [load])

  const account = snap && "account" in snap ? snap.account : null
  const grants = snap && "grants" in snap ? snap.grants : []

  return (
    <div className="border-t border-border pt-3 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Fidélité Alliance
        </p>
        <Button size="sm" variant="ghost" disabled={busy} onClick={() => void load()}>
          Rafraîchir
        </Button>
      </div>

      {account ? (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <p>
            Streak : <strong>{account.consecutiveMonths}</strong> mois
          </p>
          <p>
            Bonus : <strong>{account.bonusMessagesBalance}</strong> msgs
          </p>
          <p>
            Boosts : <strong>{account.profileBoostsAvailable}</strong>
          </p>
          <p>
            Carte : <strong>{account.fidelityCardId}</strong>
          </p>
          <p className="col-span-2">
            VIP :{" "}
            <strong>{account.vipSessionEligible ? "éligible" : "non"}</strong>
            {account.lastGrantAt
              ? ` · dernier grant ${new Date(account.lastGrantAt).toLocaleDateString("fr-FR")}`
              : ""}
          </p>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">Aucun compte fidélité encore.</p>
      )}

      {isFullAdmin ? (
        <div className="space-y-2 rounded-xl border border-border bg-secondary/30 p-3">
          <p className="text-[11px] text-muted-foreground">
            Ajustement manuel (compensation). Solde bonus jamais &lt; 0.
          </p>
          <div className="grid grid-cols-3 gap-2">
            <label className="text-[10px] space-y-1">
              Δ messages
              <input
                className="w-full h-8 rounded-md border border-border bg-background px-2 text-xs"
                value={deltaBonus}
                onChange={(e) => setDeltaBonus(e.target.value)}
              />
            </label>
            <label className="text-[10px] space-y-1">
              Δ boosts
              <input
                className="w-full h-8 rounded-md border border-border bg-background px-2 text-xs"
                value={deltaBoosts}
                onChange={(e) => setDeltaBoosts(e.target.value)}
              />
            </label>
            <label className="text-[10px] space-y-1">
              Streak (opt.)
              <input
                className="w-full h-8 rounded-md border border-border bg-background px-2 text-xs"
                placeholder="ex. 3"
                value={streak}
                onChange={(e) => setStreak(e.target.value)}
              />
            </label>
          </div>
          <input
            className="w-full h-8 rounded-md border border-border bg-background px-2 text-xs"
            placeholder="Note ops (optionnel)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <Button
            size="sm"
            disabled={busy}
            onClick={() => {
              void (async () => {
                setBusy(true)
                setMsg(null)
                const res = await adminAdjustLoyalty({
                  userId,
                  deltaBonusMessages: Number(deltaBonus) || 0,
                  deltaBoosts: Number(deltaBoosts) || 0,
                  consecutiveMonths:
                    streak.trim() === "" ? undefined : Number(streak),
                  note: note.trim() || undefined,
                })
                if (res.error) setMsg(res.error)
                else {
                  setMsg("Ajustement enregistré.")
                  await load()
                }
                setBusy(false)
              })()
            }}
          >
            Appliquer ajustement
          </Button>
        </div>
      ) : null}

      {msg ? <p className="text-[11px] text-muted-foreground">{msg}</p> : null}

      {grants && grants.length > 0 ? (
        <div className="max-h-40 overflow-y-auto divide-y divide-border text-[11px]">
          {grants.map((g) => (
            <div key={g.id} className="py-1.5 flex justify-between gap-2">
              <span>
                {g.kind} · +{g.bonusMessages} msg
                {g.boosts > 0 ? ` · +${g.boosts} boost` : ""}
                {" · "}M{g.consecutiveAfter}
              </span>
              <span className="text-muted-foreground shrink-0">
                {new Date(g.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function AdminLoyaltyAllianceNote() {
  return (
    <div className="rounded-xl border border-[#B8954A]/35 bg-[#FFFBF5] px-4 py-3 text-xs text-[#2D1020]/80 space-y-1.5">
      <p className="font-bold text-[#2D1020]">Programme Fidélité Alliance</p>
      <p>
        Attribution auto à chaque paiement Alliance : +15 msgs / mois ; tous les 3
        mois +30 + Boost 24 h ; mois 12 = Session VIP.
      </p>
      <p>
        Solde bonus permanent (inactif en Découverte). Consulter / ajuster depuis
        la fiche membre.
      </p>
    </div>
  )
}
