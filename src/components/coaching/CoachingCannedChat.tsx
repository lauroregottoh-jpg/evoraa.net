"use client"

import * as React from "react"
import {
  COACHING_CANNED_TEMPLATES,
  type CannedRole,
} from "@/lib/coaching/cannedMessages"
import {
  listCannedMessagesAction,
  sendCannedMessageAction,
} from "@/lib/coaching/actions"

export function CoachingCannedChat({
  role,
  bookingId,
  sessionId,
}: {
  role: CannedRole
  bookingId: string | null
  sessionId: string
}) {
  const [messages, setMessages] = React.useState<
    Array<{ id: string; fromRole: string; body: string; createdAt: string }>
  >([])
  const [sending, setSending] = React.useState(false)

  const refresh = React.useCallback(async () => {
    const r = await listCannedMessagesAction({ bookingId, sessionId })
    setMessages(r.messages || [])
  }, [bookingId, sessionId])

  React.useEffect(() => {
    void refresh()
    const t = window.setInterval(() => void refresh(), 12_000)
    return () => window.clearInterval(t)
  }, [refresh])

  const templates = COACHING_CANNED_TEMPLATES[role]

  return (
    <div className="rounded-2xl border bg-white p-5 space-y-3">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#D7B866]">
          Messages
        </p>
        <h3 className="font-serif text-lg font-bold text-[#641F2B]">
          Messages prédéfinis
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Communication limitée à KELIAA — pas d’échange hors app.
        </p>
      </div>

      <div className="space-y-2 max-h-40 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-xs text-muted-foreground">Aucun message encore.</p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-[#D7B866]/20 bg-[#FCFAF6] px-3 py-2 text-sm"
            >
              <p className="text-[10px] uppercase tracking-wider text-[#8A6A2E] font-semibold">
                {m.fromRole === "coach" ? "Coach" : "Coaché"}
              </p>
              <p className="mt-0.5">{m.body}</p>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {templates.map((t) => (
          <button
            key={t.id}
            type="button"
            disabled={sending}
            onClick={async () => {
              setSending(true)
              await sendCannedMessageAction({
                role,
                templateId: t.id,
                bookingId,
                sessionId,
              })
              setSending(false)
              void refresh()
            }}
            className="rounded-xl border border-[#641F2B]/25 px-3 py-2 text-xs font-semibold hover:bg-[#641F2B]/5 disabled:opacity-50"
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
