"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { EvaMediator } from "@/components/messages/EvaMediator";
import { BenevolenceShield, checkBenevolence } from "@/components/messages/BenevolenceShield";
import { PhotoAccessCard } from "@/components/messages/PhotoAccessCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Sparkles, ShieldCheck, Eye, Lock } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "me" | "partner";
  text: string;
  time: string;
}

export default function MessageRoomPage() {
  const params = useParams();
  const id = params?.id || "1";

  const partnerName = id === "2" ? "Thomas" : "Alexandre";
  const harmonyScore = id === "2" ? 89 : 94;

  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "m1",
      sender: "partner",
      text: "Bonjour Laure, ravi de faire votre connaissance. Votre vision d'un foyer ancré dans la prière commune m'a beaucoup parlé en lisant votre profil.",
      time: "14:20",
    },
    {
      id: "m2",
      sender: "me",
      text: "Bonjour Alexandre, merci pour cet accueil chaleureux. C'est en effet une dimension fondamentale pour moi.",
      time: "15:10",
    },
  ]);

  const [input, setInput] = React.useState("");
  const [photoStatus, setPhotoStatus] = React.useState<"pending" | "granted" | "postponed">("pending");
  const [showShieldWarning, setShowShieldWarning] = React.useState(false);

  const handleSendTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!checkBenevolence(input)) {
      setShowShieldWarning(true);
      return;
    }

    doSend();
  };

  const doSend = () => {
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "me",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setShowShieldWarning(false);
  };

  return (
    <MainLayout maxWidth="4xl">
      <div className="space-y-6 py-4">
        
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-3">
            <Link href="/messages">
              <Button variant="ghost" size="sm" className="h-9 px-2.5 rounded-xl text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 via-accent/20 to-secondary flex items-center justify-center font-serif font-bold text-primary dark:text-accent shadow-xs">
                {partnerName[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif font-bold text-lg text-foreground">{partnerName}</h2>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-accent/15 text-accent px-2 py-0.5 rounded-full border border-accent/30">
                    <Sparkles className="h-3 w-3 fill-accent" /> {harmonyScore}%
                  </span>
                </div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Espace modéré en paix
                </span>
              </div>
            </div>
          </div>

          <Link href={`/compatibility/${id}`}>
            <Button variant="outline" size="sm" className="rounded-xl text-xs border-border/80">
              Voir le diagnostic d&apos;EVA
            </Button>
          </Link>
        </div>

        {/* EVA Mediator Block */}
        <EvaMediator
          partnerName={partnerName}
          onSelectSuggestion={(text) => {
            setInput(text);
            setShowShieldWarning(false);
          }}
        />

        {/* Photo Access Flow Card inside the conversation */}
        <PhotoAccessCard
          requesterName={partnerName}
          status={photoStatus}
          onGrant={() => setPhotoStatus("granted")}
          onPostpone={() => setPhotoStatus("postponed")}
        />

        {/* Messages Container */}
        <Card className="rounded-2xl border-border/60 bg-background/80 backdrop-blur-md shadow-xs min-h-[320px] max-h-[460px] overflow-y-auto p-5 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === "me" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed shadow-2xs ${
                  m.sender === "me"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-secondary/90 text-foreground border border-border/60 rounded-bl-none"
                }`}
              >
                <p>{m.text}</p>
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 px-1 font-sans">
                {m.time}
              </span>
            </div>
          ))}
        </Card>

        {/* Benevolence Shield Warning (Real-time check trigger) */}
        {showShieldWarning && (
          <BenevolenceShield
            text={input}
            onSendAnyway={doSend}
            onModify={() => setShowShieldWarning(false)}
          />
        )}

        {/* Message Input Bar */}
        <form onSubmit={handleSendTrigger} className="flex items-center gap-3 pt-2">
          <Input
            type="text"
            placeholder={`Écrire un message digne à ${partnerName}... (mot-clé test: 'vite' pour bouclier)`}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (showShieldWarning) setShowShieldWarning(false);
            }}
            className="h-12 rounded-xl bg-background border-border/80 text-sm focus:ring-accent"
          />

          <Button
            type="submit"
            className="h-12 px-6 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-medium shadow-sm shrink-0"
          >
            <span className="flex items-center gap-2">
              <span>Envoyer</span>
              <Send className="h-4 w-4" />
            </span>
          </Button>
        </form>

      </div>
    </MainLayout>
  );
}
