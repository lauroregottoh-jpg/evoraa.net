"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { CouplePageFrame } from "@/components/couple/CouplePageFrame"
import { joinCoupleWithCodeAction } from "@/app/actions/couple"

function RejoindreInner() {
  const router = useRouter()
  const search = useSearchParams()
  const codeFromUrl = (search.get("code") || "").toUpperCase()
  const [code, setCode] = React.useState(codeFromUrl)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const triedAuto = React.useRef(false)

  const nextPath = `/couple/rejoindre${codeFromUrl ? `?code=${encodeURIComponent(codeFromUrl)}` : ""}`

  const submitCode = React.useCallback(
    async (value: string) => {
      setLoading(true)
      setError(null)
      const res = await joinCoupleWithCodeAction(value)
      setLoading(false)
      if (res.requiresAuth) {
        return { needsAuth: true as const }
      }
      if (res.error) {
        setError(res.error)
        return { error: res.error }
      }
      router.replace("/couple/espace")
      return { ok: true as const }
    },
    [router]
  )

  React.useEffect(() => {
    setCode(codeFromUrl)
  }, [codeFromUrl])

  React.useEffect(() => {
    if (!codeFromUrl || triedAuto.current) return
    triedAuto.current = true
    void submitCode(codeFromUrl).then((res) => {
      if (res && "needsAuth" in res && res.needsAuth) {
        setError(null)
      }
    })
  }, [codeFromUrl, submitCode])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await submitCode(code)
    if (res && "needsAuth" in res && res.needsAuth) {
      router.push(`/login?next=${encodeURIComponent(nextPath)}`)
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-5 py-8">
        <h1 className="font-serif text-3xl font-bold">Rejoindre l’espace couple</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Pas encore de compte ? Inscrivez-vous d’abord, puis recliquez sur le
          lien (ou revenez ici avec le code). Déjà inscrit(e) ? Entrez le code
          ci-dessous.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/register?next=${encodeURIComponent(nextPath)}`}
            className="inline-flex h-11 items-center rounded-xl bg-[#A07070] px-5 text-sm font-semibold text-white"
          >
            S’inscrire d’abord
          </Link>
          <Link
            href={`/login?next=${encodeURIComponent(nextPath)}`}
            className="inline-flex h-11 items-center rounded-xl border px-5 text-sm font-semibold"
          >
            J’ai déjà un compte
          </Link>
        </div>
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
            {loading ? "Vérification…" : "Entrer dans l’espace"}
          </button>
        </form>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
  )
}

export default function CoupleRejoindrePage() {
  return (
    <CouplePageFrame>
      <Suspense fallback={<p className="p-8 text-sm">Chargement…</p>}>
        <RejoindreInner />
      </Suspense>
    </CouplePageFrame>
  )
}
