"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EvaMediator } from "@/components/messages/EvaMediator";
import { BenevolenceShield, checkBenevolence } from "@/components/messages/BenevolenceShield";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, Sparkles, Flag } from "lucide-react";
import {
  sendMessageAction,
  sendVoiceNoteAction,
  deleteOwnMessageAction,
  loadOlderMessagesAction,
  getVoicePlaybackUrlAction,
  type ChatMessageDTO,
  type ConversationRoomDTO,
} from "@/app/actions/messaging";
import { createClient } from "@/utils/supabase/client";
import { SafetyReportModal } from "@/components/safety/SafetyReportModal";
import { VoiceNotePlayer } from "@/components/messages/VoiceNotePlayer";
import { VoiceNoteRecorder } from "@/components/messages/VoiceNoteRecorder";

function formatMsgTime(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const DELETE_WINDOW_MS = 30_000;

function canDeleteMessage(createdAt: string) {
  return Date.now() - new Date(createdAt).getTime() <= DELETE_WINDOW_MS;
}

export function MessageRoom({ room: initialRoom }: { room: ConversationRoomDTO }) {
  const router = useRouter();
  const [room, setRoom] = React.useState(initialRoom);
  const [messages, setMessages] = React.useState(initialRoom.messages);
  const [input, setInput] = React.useState("");
  const [showShieldWarning, setShowShieldWarning] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [showReport, setShowReport] = React.useState(false);
  const [hasMoreOlder, setHasMoreOlder] = React.useState(
    Boolean(initialRoom.hasMoreOlder)
  );
  const [loadingOlder, setLoadingOlder] = React.useState(false);
  const [deleteTick, setDeleteTick] = React.useState(0);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const id = window.setInterval(() => setDeleteTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  React.useEffect(() => {
    setRoom(initialRoom);
    setMessages(initialRoom.messages);
    setHasMoreOlder(Boolean(initialRoom.hasMoreOlder));
  }, [initialRoom]);

  const loadOlder = async () => {
    if (!messages.length || loadingOlder) return;
    setLoadingOlder(true);
    try {
      const res = await loadOlderMessagesAction(room.id, messages[0].createdAt);
      if (res.error) {
        setError(res.error);
        return;
      }
      const older = res.messages ?? [];
      setMessages((prev) => {
        const ids = new Set(prev.map((m) => m.id));
        return [...older.filter((m) => !ids.has(m.id)), ...prev];
      });
      setHasMoreOlder(Boolean(res.hasMoreOlder));
    } finally {
      setLoadingOlder(false);
    }
  };

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  React.useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`conversation:${room.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${room.id}`,
        },
        (payload) => {
          const row = payload.new as {
            id: string
            sender_id: string
            message: string
            is_read: boolean | null
            created_at: string | null
            kind?: string | null
            audio_duration_ms?: number | null
          }
          setMessages((prev) => {
            if (prev.some((m) => m.id === row.id)) return prev
            const isMine = row.sender_id !== room.partnerUserId
            const next: ChatMessageDTO = {
              id: row.id,
              senderId: row.sender_id,
              text: row.message,
              createdAt: row.created_at ?? new Date().toISOString(),
              isRead: Boolean(row.is_read),
              isMine,
              kind: row.kind === "voice" ? "voice" : "text",
              durationMs: row.audio_duration_ms ?? null,
              audioUrl: null,
            }
            return [...prev, next]
          })
          setRoom((prev) => {
            const isMine = row.sender_id !== room.partnerUserId
            return {
              ...prev,
              messageCount: isMine ? prev.messageCount + 1 : prev.messageCount,
            }
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [room.id, room.partnerUserId])

  const doSend = async () => {
    if (!input.trim() || isSending) return
    setIsSending(true)
    setError("")
    try {
      const result = await sendMessageAction(room.id, input)
      if (result.error) {
        setError(result.error)
        return
      }
      if (result.message) {
        setMessages((prev) =>
          prev.some((m) => m.id === result.message!.id)
            ? prev
            : [...prev, result.message!]
        )
        setRoom((prev) => ({
          ...prev,
          messageCount: prev.messageCount + 1,
        }))
      }
      setInput("")
      setShowShieldWarning(false)
      router.refresh()
    } finally {
      setIsSending(false)
    }
  }

  const handleVoiceSend = async (
    blob: Blob,
    durationMs: number,
    transcript: string
  ) => {
    if (isSending) return
    setIsSending(true)
    setError("")
    try {
      const fd = new FormData()
      fd.append("conversationId", room.id)
      fd.append("durationMs", String(durationMs))
      if (transcript) fd.append("clientTranscript", transcript)
      const ext = blob.type.includes("mp4") ? "m4a" : "webm"
      fd.append("audio", blob, `vocal.${ext}`)
      const result = await sendVoiceNoteAction(fd)
      if (result.error) {
        setError(result.error)
        return
      }
      if (result.message) {
        setMessages((prev) =>
          prev.some((m) => m.id === result.message!.id)
            ? prev
            : [...prev, result.message!]
        )
        setRoom((prev) => ({
          ...prev,
          messageCount: prev.messageCount + 1,
        }))
      }
      router.refresh()
    } finally {
      setIsSending(false)
    }
  }

  const resolveVoiceUrl = async (messageId: string, current: string | null) => {
    if (current) return current
    const res = await getVoicePlaybackUrlAction(room.id, messageId)
    if (res.url) {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, audioUrl: res.url! } : m))
      )
      return res.url
    }
    if (res.error) setError(res.error)
    return null
  }

  const deleteMessage = async (messageId: string) => {
    setError("")
    const res = await deleteOwnMessageAction(room.id, messageId)
    if (res.error) {
      setError(res.error)
      return
    }
    setMessages((prev) => prev.filter((m) => m.id !== messageId))
    setRoom((prev) => ({
      ...prev,
      messageCount: Math.max(0, prev.messageCount - 1),
    }))
    router.refresh()
  }

  const handleSendTrigger = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    if (!checkBenevolence(input)) {
      setShowShieldWarning(true)
      return
    }
    await doSend()
  }

  const remaining = Math.max(
    0,
    room.freeLimit -
      room.messageCount +
      (room.bonusMessagesRemaining || 0) +
      (room.testCreditsRemaining || 0)
  )
  const messageQuotaReached = remaining <= 0
  const remainingLabel =
    remaining <= 0 ? "0 msg restants" : `${remaining} msg restants`

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/messages">
            <Button variant="ghost" size="sm" className="h-9 px-2.5 rounded-xl text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 via-accent/20 to-secondary flex items-center justify-center font-serif font-bold text-primary dark:text-accent shadow-xs">
              {room.partnerName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-lg text-foreground">{room.partnerName}</h2>
                {room.harmonyScore > 0 && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-accent/15 text-accent px-2 py-0.5 rounded-full border border-accent/30">
                    <Sparkles className="h-3 w-3 fill-accent" /> {room.harmonyScore}%
                  </span>
                )}
              </div>
              <span className="text-[11px] text-muted-foreground">
                {remainingLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {room.partnerUserId && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-xl text-xs text-destructive"
              onClick={() => setShowReport(true)}
            >
              <Flag className="h-3.5 w-3.5 mr-1" />
              Signaler
            </Button>
          )}
          {room.partnerProfileId && (
            <Link href={`/compatibility/${room.partnerProfileId}`}>
              <Button variant="outline" size="sm" className="rounded-xl text-xs border-border/80">
                Voir le diagnostic d&apos;EVA
              </Button>
            </Link>
          )}
        </div>
      </div>

      {showReport && (
        <SafetyReportModal
          partnerName={room.partnerName}
          reportedUserId={room.partnerUserId}
          onClose={() => setShowReport(false)}
        />
      )}

      <EvaMediator
        partnerName={room.partnerName}
        onSelectSuggestion={(text) => {
          setInput(text)
          setShowShieldWarning(false)
        }}
      />

      {/* Photo unlock productisé plus tard — on n’affiche plus un faux succès local */}

      <Card className="rounded-2xl border-border/60 bg-background/80 backdrop-blur-md shadow-xs min-h-[320px] max-h-[460px] overflow-y-auto p-5 space-y-4">
        {hasMoreOlder && (
          <div className="flex justify-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-xl text-xs"
              disabled={loadingOlder}
              onClick={loadOlder}
            >
              {loadingOlder ? "Chargement…" : "Messages plus anciens"}
            </Button>
          </div>
        )}
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-10">
            Premier message : posez une question respectueuse sur la foi, le foyer ou le rythme de vie.
          </p>
        )}
        {messages.map((m) => {
          const showDelete = m.isMine && canDeleteMessage(m.createdAt);

          return (
          <div
            key={m.id}
            className={`flex flex-col ${m.isMine ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed shadow-2xs ${
                m.isMine
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-secondary/90 text-foreground border border-border/60 rounded-bl-none"
              }`}
            >
              {m.kind === "voice" ? (
                <VoiceNotePlayer
                  src={m.audioUrl}
                  durationMs={m.durationMs}
                  mine={m.isMine}
                  onNeedSrc={() => resolveVoiceUrl(m.id, m.audioUrl)}
                />
              ) : (
                <p>{m.text}</p>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 px-1">
              <span className="text-[10px] text-muted-foreground font-sans">
                {formatMsgTime(m.createdAt)}
              </span>
              {showDelete ? (
                <button
                  type="button"
                  onClick={() => void deleteMessage(m.id)}
                  className="text-[10px] font-medium text-destructive hover:underline"
                >
                  Supprimer
                </button>
              ) : null}
            </div>
          </div>
        )})}
        <div ref={bottomRef} />
      </Card>

      {showShieldWarning && (
        <BenevolenceShield
          text={input}
          onSendAnyway={() => {
            void doSend()
          }}
          onModify={() => setShowShieldWarning(false)}
        />
      )}

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      <form onSubmit={handleSendTrigger} className="flex items-center gap-3 pt-2">
        <Input
          type="text"
          placeholder="Écrire un message…"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            if (showShieldWarning) setShowShieldWarning(false)
          }}
          disabled={messageQuotaReached || isSending}
          className="h-12 rounded-xl bg-background border-border/80 text-sm focus:ring-accent"
        />

        <VoiceNoteRecorder
          enabled={room.voiceNotesEnabled}
          disabled={messageQuotaReached}
          isSending={isSending}
          onSend={handleVoiceSend}
        />

        <Button
          type="submit"
          disabled={messageQuotaReached || isSending}
          className="h-12 px-6 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-medium shadow-sm shrink-0"
        >
          <span className="flex items-center gap-2">
            <span>{isSending ? "…" : "Envoyer"}</span>
            <Send className="h-4 w-4" />
          </span>
        </Button>
      </form>
    </div>
  );
}
