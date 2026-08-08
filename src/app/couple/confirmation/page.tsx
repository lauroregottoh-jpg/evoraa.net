import { Suspense } from "react"
import CoupleConfirmationClient from "./ConfirmationClient"

export default function CoupleConfirmationPage() {
  return (
    <Suspense fallback={<p className="p-8 text-sm">Chargement…</p>}>
      <CoupleConfirmationClient />
    </Suspense>
  )
}
