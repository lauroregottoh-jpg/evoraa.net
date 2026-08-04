"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { submitSignupHelpAction } from "@/app/actions/feedback"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

async function fileToBase64(file: File): Promise<{
  base64: string
  contentType: string
} | null> {
  if (!file || file.size <= 0) return null
  if (file.size > 5 * 1024 * 1024) throw new Error("La capture doit faire moins de 5 Mo.")
  const buf = await file.arrayBuffer()
  let binary = ""
  const bytes = new Uint8Array(buf)
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return { base64: btoa(binary), contentType: file.type || "image/jpeg" }
}

export function SignupHelpForm() {
  const [error, setError] = React.useState("")
  const [ok, setOk] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setError("")
    setOk(false)
    setLoading(true)
    const form = e.currentTarget
    try {
      const fd = new FormData(form)
      const firstName = String(fd.get("first_name") ?? "")
      const lastName = String(fd.get("last_name") ?? "")
      const email = String(fd.get("email") ?? "")
      const message = String(fd.get("message") ?? "")
      const rawFile = fd.get("screenshot")
      let screenshotBase64: string | undefined
      let screenshotContentType: string | undefined
      if (rawFile instanceof File && rawFile.size > 0) {
        try {
          const converted = await fileToBase64(rawFile)
          if (converted) {
            screenshotBase64 = converted.base64
            screenshotContentType = converted.contentType
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Capture invalide.")
          return
        }
      }

      const result = await submitSignupHelpAction({
        firstName,
        lastName,
        email,
        message,
        screenshotBase64,
        screenshotContentType,
      })

      if (!result) {
        setError("Pas de réponse serveur. Vérifiez votre connexion et réessayez.")
        return
      }
      if (result.error) {
        setError(result.error)
        return
      }
      setOk(true)
      form.reset()
    } catch (err) {
      console.error("[signup-help]", err)
      setError("Envoi impossible pour le moment. Réessayez.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Aide inscription
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-foreground leading-tight">
          Décrivez votre problème
        </h1>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground leading-relaxed">
          Aucune connexion requise. L’équipe Keliaa vous répond rapidement.
        </p>
      </div>

      {error ? (
        <div
          className="rounded-xl border-2 border-red-500 bg-red-50 px-3 py-3 text-sm text-red-900"
          role="alert"
        >
          <p className="font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Envoi impossible
          </p>
          <p className="mt-1 text-xs leading-relaxed">{error}</p>
        </div>
      ) : null}

      {ok ? (
        <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50 px-3 py-3 text-sm text-emerald-900">
          <p className="font-semibold flex items-center gap-2">
            <CheckCircle className="h-4 w-4 shrink-0" />
            Message reçu
          </p>
          <p className="mt-1 text-xs leading-relaxed">
            Merci. Nous traitons votre demande sous peu.
          </p>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-4" noValidate={false}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="help-first">
              Prénom
            </label>
            <Input
              id="help-first"
              name="first_name"
              required
              maxLength={80}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="help-last">
              Nom
            </label>
            <Input
              id="help-last"
              name="last_name"
              required
              maxLength={80}
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="help-email">
            E-mail
          </label>
          <Input
            id="help-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="vous@exemple.com"
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="help-message">
            Problème à décrire
          </label>
          <textarea
            id="help-message"
            name="message"
            required
            minLength={8}
            maxLength={4000}
            rows={5}
            placeholder="Ex. : le bouton Google ne répond pas, message d’erreur…"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="help-shot">
            Capture d’écran (optionnel)
          </label>
          <Input
            id="help-shot"
            name="screenshot"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="h-11 rounded-xl file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs"
          />
          <p className="text-[11px] text-muted-foreground">
            PNG ou JPG, 5 Mo max. Vous pouvez envoyer sans image.
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-xl bg-primary text-primary-foreground"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {loading ? "Envoi…" : "Envoyer"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/register"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Retour à l’inscription
        </Link>
      </p>
    </div>
  )
}
