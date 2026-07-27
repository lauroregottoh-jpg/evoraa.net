import { MemberPage } from "@/components/layout/MemberPage";
import { listMyNotifications } from "@/app/actions/notifications";
import { NotificationsList } from "@/components/notifications/NotificationsList";

export default async function NotificationsPage() {
  const { notifications, error } = await listMyNotifications();

  return (
    <MemberPage>
      <div className="space-y-6 py-2 max-w-3xl mx-auto">
        <div className="border-b border-border/40 pb-4">
          <h1 className="font-serif text-3xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Alertes KELIAA : questionnaires, messages et abonnements.
          </p>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <NotificationsList initial={notifications as never} />
      </div>
    </MemberPage>
  );
}
