"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { MemberPage } from "@/components/layout/MemberPage"
import { joinCoupleWithCodeAction } from "@/app/actions/couple"

export default function CoupleRejoindrePage() {
  const router = useRouter()
  const [code, setCode] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await joinCoupleWithCodeAction(code)
    setLoading(false)
    if (res.requiresAuth) {
      router.push(`/login?next=${encodeURIComponent("/couple/rejoindre")}`)
      return
    }
    if (res.error) {
      setError(res.error)
      return
    }
    router.push("/couple/espace")
  }

  return (
    <MemberPage>
      <div className="max-w-md mx-auto space-y-5 py-8">
        <h1 className="font-serif text-3xl font-bold">Rejoindre un bilan</h1>
        <p className="text-sm text-muted-foreground">
          Entrez le code partagé par votre partenaire.
        </p>
        <form onSubmit={submit} className="space-y-3">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="KLY-XXXXX"
            className="w-full h-11 rounded-xl border border-border bg-white px-4 font-mono tracking-wider"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-60"
          >
            {loading ? "Vérification…" : "Rejoindre"}
          </button>
        </form>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    </MemberPage>
  )
}
