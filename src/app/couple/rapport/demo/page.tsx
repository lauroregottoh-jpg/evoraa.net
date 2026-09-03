import { Suspense } from "react"
import CoupleRapportDemoClient from "./DemoClient"

export default function CoupleRapportDemoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F2EBE0] flex items-center justify-center text-sm text-[#7F5557]/60">
          Chargement de l’aperçu…
        </div>
      }
    >
      <CoupleRapportDemoClient />
    </Suspense>
  )
}
