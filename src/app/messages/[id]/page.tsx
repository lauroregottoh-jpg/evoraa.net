import { MemberPage } from "@/components/layout/MemberPage";
import { MessageRoom } from "@/components/messages/MessageRoom";
import { getConversationRoom } from "@/app/actions/messaging";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function MessageRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getConversationRoom(id);

  if (result.error || !result.room) {
    return (
      <MemberPage dense>
        <div className="space-y-6 py-2">
          <Link href="/messages">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux dialogues
            </Button>
          </Link>
          <div className="rounded-2xl border border-border/60 bg-secondary/30 p-8 text-center">
            <p className="font-serif text-xl text-foreground">Conversation indisponible</p>
            <p className="text-sm text-muted-foreground mt-2">{result.error}</p>
          </div>
        </div>
      </MemberPage>
    );
  }

  return (
    <MemberPage dense>
      <MessageRoom room={result.room} />
    </MemberPage>
  );
}
