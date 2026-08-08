"use client"

import * as React from "react"
import { CouplePageFrame } from "@/components/couple/CouplePageFrame"
import { CoupleShell } from "@/components/couple/CoupleShell"
import {
  getMyCoupleStateAction,
  regenerateCoupleInviteAction,
} from "@/app/actions/couple"

export default function CoupleInviterPage() {
  const [coupleId, setCoupleId] = React.useState<string | null>(null)
  const [code, setCode] = React.useState<string | null>(null)
  const [url, setUrl] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    void getMyCoupleStateAction().then((s) => {
      if ("couple" in s && s.couple) {
        setCoupleId(s.couple.id)
        if (s.invite?.invite_code) setCode(s.invite.invite_code)
      }
    })
  }, [])

  const regen = async () => {
    if (!coupleId) return
    setLoading(true)
    setError(null)
    const res = await regenerateCoupleInviteAction(coupleId)
    setLoading(false)
    if (res.error) {
      setError(res.error)
      return
    }
    setCode(res.inviteCode || null)
    setUrl(res.inviteUrl || null)
  }

  return (
    <CouplePageFrame>
      <CoupleShell activeHref="/couple/inviter">
        <div className="max-w-lg space-y-5">
          <h1 className="font-serif text-3xl font-bold">Inviter votre partenaire</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Partagez le lien ou le code. Une seule personne peut rejoindre. Une
            fois les deux places prises, l’invitation est définitivement utilisée.
          </p>

          {code && (
            <div className="rounded-2xl border bg-white/80 p-5 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Code
              </p>
              <p className="font-mono text-2xl font-bold tracking-widest">{code}</p>
            </div>
          )}

          {url && (
            <div className="rounded-2xl border bg-white/80 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Lien
              </p>
              <p className="text-xs break-all font-mono">{url}</p>
            </div>
          )}

          <button
            type="button"
            disabled={!coupleId || loading}
            onClick={regen}
            className="inline-flex h-11 items-center rounded-xl bg-primary text-primary-foreground px-5 text-sm font-semibold disabled:opacity-60"
          >
            {loading ? "…" : code ? "Régénérer l’invitation" : "Générer l’invitation"}
          </button>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>
      </CoupleShell>
    </CouplePageFrame>
  )
}
