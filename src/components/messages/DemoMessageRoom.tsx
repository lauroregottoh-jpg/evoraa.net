"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Crown,
  Heart,
  MapPin,
  Send,
  Sparkles,
} from "lucide-react"
import { cn } from "@/utils/cn"
import type { DemoMatchThread } from "@/lib/demo/sarahGandeSimulations"

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * Salon de messagerie démo — ouverture depuis « Ouvrir le message ».
 */
export function DemoMessageRoom({ thread }: { thread: DemoMatchThread }) {
  const [draft, setDraft] = React.useState("")
  const [local, setLocal] = React.useState(thread.messages)
  const bottomRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [local.length])

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setLocal((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        fromMe: true,
        text,
        at: new Date().toISOString(),
      },
    ])
    setDraft("")
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col overflow-hidden rounded-[1.5rem] border border-[#B8954A]/30 bg-[#FFFBF5] shadow-elevated">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-[#B8954A]/20 bg-white/80 px-4 py-3 backdrop-blur-sm">
        <Link
          href="/messages"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#B8954A]/25 text-[#2D1020] hover:bg-[#F7F0E0]"
          aria-label="Retour"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br font-serif text-lg font-bold text-white",
            thread.photoGradient
          )}
        >
          {thread.partnerFirstName.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate font-serif text-lg font-bold text-[#2D1020]">
              {thread.partnerFirstName}
            </h1>
            {thread.verified ? (
              <Crown className="h-3.5 w-3.5 shrink-0 text-[#B8954A]" />
            ) : null}
            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-600/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
              <Heart className="h-2.5 w-2.5 fill-current" /> {thread.score}%
            </span>
          </div>
          <p className="flex items-center gap-1 text-[11px] text-[#2D1020]/55">
            <MapPin className="h-3 w-3" />
            {thread.city} · {thread.community}
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-[#B8954A]/30 bg-[#F7F0E0] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#7A5F28]">
          <Sparkles className="h-3 w-3" /> Aperçu
        </span>
      </header>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-5">
        <p className="demo-msg-in mx-auto mb-4 max-w-sm rounded-2xl border border-[#B8954A]/20 bg-white/70 px-3 py-2 text-center text-[11px] text-[#2D1020]/55">
          {thread.matchedLabel} · Conversation simulée pour prévisualiser
          l’expérience KELIAA
        </p>

        {local.map((m, i) => (
          <div
            key={m.id}
            className={cn(
              "demo-msg-bubble flex",
              m.fromMe ? "justify-end" : "justify-start"
            )}
            style={{ animationDelay: `${Math.min(i, 8) * 80}ms` }}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
                m.fromMe
                  ? "rounded-br-md bg-[#2D1020] text-[#F2EBE0]"
                  : "rounded-bl-md border border-[#B8954A]/20 bg-white text-[#2D1020]"
              )}
            >
              <p>{m.text}</p>
              <p
                className={cn(
                  "mt-1 text-[10px]",
                  m.fromMe ? "text-white/55" : "text-[#2D1020]/40"
                )}
              >
                {formatTime(m.at)}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div className="border-t border-[#B8954A]/20 bg-white/90 p-3">
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            placeholder={`Écrire à ${thread.partnerFirstName}…`}
            className="h-11 flex-1 rounded-xl border border-[#B8954A]/30 bg-[#FFFBF5] px-3 text-sm outline-none focus:border-[#B8954A]"
          />
          <button
            type="button"
            onClick={send}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2D1020] text-[#F2EBE0] hover:bg-[#2D1020]/90"
            aria-label="Envoyer"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
