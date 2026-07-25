import { MainLayout } from "@/components/layout/MainLayout";
import { AdminConsole } from "@/components/admin/AdminConsole";
import { getAdminDashboardData } from "@/app/actions/admin";
import Link from "next/link";

export default async function AdminPage() {
  const data = await getAdminDashboardData();

  if (data.error || !data.stats || !data.retention) {
    return (
      <MainLayout maxWidth="4xl">
        <div className="py-16 text-center space-y-3">
          <h1 className="font-serif text-2xl">Accès admin requis</h1>
          <p className="text-sm text-muted-foreground">{data.error}</p>
          <Link href="/dashboard" className="text-accent underline text-sm">
            Retour tableau de bord
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout maxWidth="7xl" showFooter={false}>
      <AdminConsole
        stats={data.stats}
        retention={data.retention}
        users={data.users}
        reports={data.reports}
        payments={data.payments}
        photos={data.photos}
        subscriptions={data.subscriptions}
      />
    </MainLayout>
  );
}
