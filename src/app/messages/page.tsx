import { MainLayout } from "@/components/layout/MainLayout";
import { ConversationsList } from "@/components/messages/ConversationsList";
import { listConversations } from "@/app/actions/messaging";

export default async function MessagesListPage() {
  const result = await listConversations();

  return (
    <MainLayout maxWidth="4xl">
      <ConversationsList
        conversations={result.conversations}
        error={result.error}
      />
    </MainLayout>
  );
}
