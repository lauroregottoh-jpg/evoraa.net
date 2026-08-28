import Link from "next/link"
import { getAdminDashboardData } from "@/app/actions/admin"
import { AdminPaymentLinksPanel } from "@/components/admin/AdminPaymentLinksPanel"
import {
  canFullAdminOps,
  OPS_CONSOLE_PATH,
} from "@/lib/admin/consolePath"

export const dynamic = "force-dynamic"

export default async function AdminPaymentLinksPage() {
  let data: Awaited<ReturnType<typeof getAdminDashboardData>>
  try {
    data = await getAdminDashboardData()
  } catch {
    return <Gate title="Console indisponible" body="Erreur temporaire. Réessayez." />
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
        body="Cette page est réservée à l'administrateur principal."
      />
    )
  }

  const ops = data.ops

  return (
    <main className="min-h-screen bg-[#F4F6F5] p-6">
      <AdminPaymentLinksPanel
        hasBictorys={Boolean(ops?.hasBictorys)}
        hasMoneroo={Boolean(ops?.hasMoneroo)}
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
        <Link href={OPS_CONSOLE_PATH} className="text-primary underline text-sm">
          Console ops
        </Link>
      </div>
    </main>
  )
}
