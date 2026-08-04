import { Suspense } from "react"
import { RegisterFlow } from "@/components/register/RegisterFlow"

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-primary text-white">
          Chargement…
        </div>
      }
    >
      <RegisterFlow />
    </Suspense>
  )
}
