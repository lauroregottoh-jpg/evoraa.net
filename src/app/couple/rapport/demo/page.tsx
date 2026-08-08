import { Suspense } from "react"
import CoupleRapportDemoClient from "./DemoClient"

export default function CoupleRapportDemoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBF9F6] flex items-center justify-center text-sm text-[#1C1412]/60">
          Chargement de l’aperçu…
        </div>
      }
    >
      <CoupleRapportDemoClient />
    </Suspense>
  )
}
