"use client";

import * as React from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { EvaCompanion } from "@/components/evoraa/EvaCompanion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, MessageCircle, Clock, CheckCircle2, ChevronRight } from "lucide-react";

interface ConversationItem {
  id: string;
  name: string;
  harmonyScore: number;
  lastMessage: string;
  timestamp: string;
  unread?: boolean;
}

const MOCK_CONVERSATIONS: ConversationItem[] = [
  {
    id: "1",
    name: "Alexandre",
    harmonyScore: 94,
    lastMessage: "Votre vision de l'hospitalité m'a beaucoup touché. Bonne méditation et à très bientôt en toute paix.",
    timestamp: "18:42",
    unread: true,
  },
  {
    id: "2",
    name: "Thomas",
    harmonyScore: 89,
    lastMessage: "Merci pour ce partage sur le rythme du culte dominical. Je partage entièrement cette priorité.",
    timestamp: "Hier",
    unread: false,
  },
];

export default function MessagesListPage() {
  return (
    <MainLayout maxWidth="4xl">
      <div className="space-y-8 py-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/40 pb-6">
          <div className="space-y-1">
            <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 font-sans uppercase tracking-wider text-xs">
              Sprint 5 : Espace des Échanges
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              Vos Dialogues Dignes
            </h1>
          </div>
          <Badge className="bg-primary/10 text-primary dark:text-accent border border-primary/20 rounded-full px-3 py-1">
            2 échanges actifs
          </Badge>
        </div>

        {/* EVA Guidance */}
        <EvaCompanion
          title="EVA - Veille & Sérénité"
          variant="reassurance"
          message="Je veille à ce que chacun de vos échanges reste fidèle à la Charte de Bienveillance. Vous pouvez à tout moment solliciter une question d'approfondissement spirituel dans votre salon de discussion."
        />

        {/* Conversations List */}
        <div className="space-y-3">
          {MOCK_CONVERSATIONS.map((conv) => (
            <Link key={conv.id} href={`/messages/${conv.id}`} className="block group">
              <Card className={`rounded-2xl border transition-all duration-300 ${conv.unread ? "border-accent/60 bg-accent/5 shadow-sm" : "border-border/60 bg-background/90 hover:border-border"}`}>
                <CardContent className="p-5 flex items-center justify-between gap-4">
                  
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 via-accent/20 to-secondary flex items-center justify-center font-serif text-xl font-bold text-primary dark:text-accent shadow-inner">
                        {conv.name[0]}
                      </div>
                      {conv.unread && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-accent border-2 border-background" />
                      )}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif font-bold text-lg text-foreground truncate">
                          {conv.name}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-accent/15 text-accent px-2 py-0.5 rounded-full border border-accent/30 shrink-0">
                          <Sparkles className="h-3 w-3 fill-accent" /> {conv.harmonyScore}%
                        </span>
                      </div>
                      <p className={`text-xs sm:text-sm truncate ${conv.unread ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-right">
                    <span className="text-xs text-muted-foreground font-sans">
                      {conv.timestamp}
                    </span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-1" />
                  </div>

                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

      </div>
    </MainLayout>
  );
}
