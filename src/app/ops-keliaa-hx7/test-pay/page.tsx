import Link from "next/link"
import { getAdminDashboardData } from "@/app/actions/admin"
import { logoutAction } from "@/app/actions/auth"
import { AdminTestPay150 } from "@/components/admin/AdminTestPay150"
import {
  canFullAdminOps,
  OPS_CONSOLE_PATH,
} from "@/lib/admin/consolePath"

export const dynamic = "force-dynamic"

export default async function OpsTestPay150Page() {
  let data: Awaited<ReturnType<typeof getAdminDashboardData>>
  try {
    data = await getAdminDashboardData()
  } catch {
    return (
      <Gate
        title="Console indisponible"
        body="Erreur temporaire. Reconnectez-vous puis réessayez."
      />
    )
  }

  if (data.error || !data.viewerRole) {
    return (
      <Gate
        title="Accès réservé"
        body={data.error || "Connectez-vous avec un compte administrateur."}
      />
    )
  }

  if (!canFullAdminOps({ role: data.viewerRole })) {
    return (
      <Gate
        title="Admin principal requis"
        body="Cette page micro-paiement est réservée à l’administrateur principal."
      />
    )
  }

  const ops = data.ops

  return (
    <main className="min-h-screen bg-[#F4F6F5] flex items-center justify-center p-6">
      <AdminTestPay150
        demoMode={Boolean(ops?.paymentsDemoMode)}
        hasBictorys={Boolean(ops?.hasBictorys)}
        paymentProvider={ops?.paymentProvider || "unknown"}
      />
    </main>
  )
}

function Gate({ title, body }: { title: string; body: string }) {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#F4F6F5]">
      <div className="max-w-md text-center space-y-3 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">{body}</p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href={`/login?next=${encodeURIComponent(`${OPS_CONSOLE_PATH}/test-pay`)}`}
            className="text-primary underline text-sm"
          >
            Se connecter
          </Link>
          <Link href={OPS_CONSOLE_PATH} className="text-primary underline text-sm">
            Console ops
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="text-primary underline text-sm">
              Se déconnecter
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
