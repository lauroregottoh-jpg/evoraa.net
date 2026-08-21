"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CouplePageFrame } from "@/components/couple/CouplePageFrame"
import { joinCoupleWithTokenAction } from "@/app/actions/couple"
import { Suspense } from "react"

function JoinInner() {
  const search = useSearchParams()
  const router = useRouter()
  const token = search.get("token") || ""
  const [message, setMessage] = React.useState("Association en cours…")

  React.useEffect(() => {
    if (!token) {
      setMessage("Lien invalide.")
      return
    }
    void joinCoupleWithTokenAction(token).then((res) => {
      if (res.requiresAuth) {
        router.replace(
          `/register?next=${encodeURIComponent(`/couple/join?token=${token}`)}`
        )
        return
      }
      if (res.error) {
        setMessage(res.error)
        return
      }
      router.replace("/couple/espace")
    })
  }, [token, router])

  return (
    <div className="max-w-md mx-auto py-16 text-center space-y-3">
      <h1 className="font-serif text-2xl font-bold">Rejoindre le bilan</h1>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

export default function CoupleJoinPage() {
  return (
    <CouplePageFrame>
      <Suspense fallback={<p className="p-8 text-sm">Chargement…</p>}>
        <JoinInner />
      </Suspense>
    </CouplePageFrame>
  )
}
