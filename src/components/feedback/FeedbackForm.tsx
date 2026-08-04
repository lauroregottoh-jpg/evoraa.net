"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { submitFeedbackAction } from "@/app/actions/feedback"
import { AlertCircle, CheckCircle, MessageSquareHeart } from "lucide-react"

const CATEGORIES = [
  { value: "signup_help", label: "Je n’arrive pas à m’inscrire" },
  { value: "complaint", label: "Plainte / difficulté sur le site" },
  { value: "suggestion", label: "Suggestion d’amélioration" },
  { value: "ux", label: "Expérience utilisateur" },
  { value: "other", label: "Autre" },
] as const

export function FeedbackForm({
  defaultName = "",
  defaultEmail = "",
  defaultCategory = "suggestion",
  pagePath = "",
  compact = false,
  title,
  subtitle,
}: {
  defaultName?: string
  defaultEmail?: string
  defaultCategory?: string
  pagePath?: string
  compact?: boolean
  title?: string
  subtitle?: string
}) {
  const [error, setError] = React.useState("")
  const [ok, setOk] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setOk(false)
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    try {
      const result = await submitFeedbackAction({
        name: String(fd.get("name") ?? ""),
        email: String(fd.get("email") ?? ""),
        category: String(fd.get("category") ?? defaultCategory),
        message: String(fd.get("message") ?? ""),
        pagePath: pagePath || String(fd.get("page_path") ?? ""),
      })
      if (result.error) setError(result.error)
      else {
        setOk(true)
        e.currentTarget.reset()
      }
    } catch {
      setError("Envoi impossible pour le moment. Réessayez.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={
        compact
          ? "rounded-xl border border-border bg-card/80 p-4 space-y-3"
          : "rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-sm"
      }
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-primary">
          <MessageSquareHeart className="h-5 w-5" />
          <h2 className="font-serif text-lg sm:text-xl font-bold text-foreground">
            {title || "Aidez-nous à améliorer Keliaa"}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {subtitle ||
            "Plus vous nous envoyez de retours, plus vite nous corrigeons les blocages et améliorons l’expérience pour toute la communauté."}
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="rounded-xl text-xs">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {ok && (
        <Alert className="rounded-xl border-emerald-500/40 bg-emerald-500/10 text-emerald-800 text-xs">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Merci — votre message est bien arrivé dans l’espace équipe. Nous le
            traitons sous peu.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
        <input type="hidden" name="page_path" value={pagePath} />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="fb_name" className="text-xs font-medium">
              Prénom / nom
            </label>
            <Input
              id="fb_name"
              name="name"
              required
              defaultValue={defaultName}
              className="h-10 rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="fb_email" className="text-xs font-medium">
              Email
            </label>
            <Input
              id="fb_email"
              name="email"
              type="email"
              required
              defaultValue={defaultEmail}
              className="h-10 rounded-xl"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label htmlFor="fb_category" className="text-xs font-medium">
            Type de retour
          </label>
          <select
            id="fb_category"
            name="category"
            defaultValue={defaultCategory}
            className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="fb_message" className="text-xs font-medium">
            Votre message
          </label>
          <textarea
            id="fb_message"
            name="message"
            required
            minLength={15}
            rows={compact ? 3 : 5}
            placeholder="Décrivez le problème ou votre idée…"
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm resize-y"
          />
        </div>
        <Button type="submit" disabled={loading || ok} className="w-full h-10 rounded-xl">
          {loading ? "Envoi…" : "Envoyer mon retour"}
        </Button>
      </form>
    </div>
  )
}
