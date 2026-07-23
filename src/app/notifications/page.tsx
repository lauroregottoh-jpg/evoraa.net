import { MainLayout } from "@/components/layout/MainLayout";
import { listMyNotifications } from "@/app/actions/notifications";
import { NotificationsList } from "@/components/notifications/NotificationsList";

export default async function NotificationsPage() {
  const { notifications, error } = await listMyNotifications();

  return (
    <MainLayout maxWidth="3xl">
      <div className="space-y-6 py-6">
        <div className="border-b border-border/40 pb-4">
          <h1 className="font-serif text-3xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Alertes KELIA : questionnaires, messages et abonnements.
          </p>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <NotificationsList initial={notifications as never} />
      </div>
    </MainLayout>
  );
}
