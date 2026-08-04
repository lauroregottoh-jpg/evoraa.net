"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { registerAction } from "@/app/actions/auth"
import { isNextRedirectError } from "@/lib/auth/criticalPath"
import { startGoogleOAuth } from "@/lib/auth/oauthGoogle"
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Mail,
} from "lucide-react"

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-5.96-4.87H2.18v2.86A10.97 10.97 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M6.04 15.76A6.6 6.6 0 0 1 5.7 12c0-1.34.24-2.63.67-3.76V5.38H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.96l3.86-1.2z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.9 10.9 0 0 0 12 1 10.97 10.97 0 0 0 2.18 5.38l3.86 3C7.18 6.38 9.38 5.38 12 5.38z"
      />
    </svg>
  )
}

export function StepAccount({ onBack }: { onBack: () => void }) {
  const searchParams = useSearchParams()
  const [showEmail, setShowEmail] = React.useState(false)
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState("")
  const [loadingGoogle, setLoadingGoogle] = React.useState(false)
  const [loadingEmail, setLoadingEmail] = React.useState(false)
  const [email, setEmail] = React.useState("")

  const handleGoogle = async () => {
    setError("")
    setLoadingGoogle(true)
    const result = await startGoogleOAuth({
      next: "/onboarding",
      charterAccepted: false,
    })
    if (result.error) {
      setError(result.error)
      setLoadingGoogle(false)
    }
  }

  const handleEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setError("")
    setSuccess("")
    setLoadingEmail(true)
    try {
      const fd = new FormData(e.currentTarget)
      fd.set("charter_accepted", "false")
      const result = await registerAction(fd)
      if (!result) {
        setError(
          "Réponse serveur vide. Vérifiez votre connexion, puis réessayez."
        )
        return
      }
      if (result.error) {
        setError(result.error)
        return
      }
      if ("next" in result && typeof result.next === "string" && result.next) {
        setSuccess(result.message || "Compte créé — redirection…")
        window.location.assign(result.next)
        return
      }
      if (result.message) {
        setSuccess(result.message)
      }
    } catch (err) {
      if (isNextRedirectError(err)) {
        window.location.assign("/onboarding")
        return
      }
      console.error("[register/email]", err)
      setError("Une erreur est survenue. Réessayez, ou demandez de l’aide.")
    } finally {
      setLoadingEmail(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Créer votre compte
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-foreground leading-tight">
          Google ou e-mail
        </h1>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground leading-relaxed">
          Créez d’abord votre accès. La charte et votre profil suivront juste
          après.
        </p>
      </div>

      {error ? (
        <div
          className="rounded-xl border-2 border-red-500 bg-red-50 px-3 py-3 text-sm text-red-900"
          role="alert"
        >
          <p className="font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Impossible de continuer
          </p>
          <p className="mt-1 text-xs leading-relaxed">{error}</p>
        </div>
      ) : null}
      {success ? (
        <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50 px-3 py-3 text-sm text-emerald-900">
          <p className="font-semibold flex items-center gap-2">
            <CheckCircle className="h-4 w-4 shrink-0" />
            C’est bon
          </p>
          <p className="mt-1 text-xs leading-relaxed">{success}</p>
        </div>
      ) : null}

      <div className="space-y-3">
        <Button
          type="button"
          onClick={handleGoogle}
          disabled={loadingGoogle || loadingEmail}
          className="h-12 w-full rounded-xl bg-white text-foreground border-2 border-border hover:bg-secondary/80 shadow-sm font-medium text-[15px]"
        >
          {loadingGoogle ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <GoogleIcon className="mr-3 h-5 w-5" />
          )}
          Continuer avec Google
        </Button>
      </div>

      <div className="relative flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
          ou
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {!showEmail ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowEmail(true)}
          className="h-11 w-full rounded-xl border-border/80"
        >
          <Mail className="mr-2 h-4 w-4" />
          Continuer avec un e-mail
        </Button>
      ) : (
        <form onSubmit={handleEmail} className="space-y-4">
          <input type="hidden" name="ref" value={searchParams.get("ref") || ""} />
          <input
            type="hidden"
            name="utm_source"
            value={searchParams.get("utm_source") || ""}
          />
          <input
            type="hidden"
            name="utm_medium"
            value={searchParams.get("utm_medium") || ""}
          />
          <input
            type="hidden"
            name="utm_campaign"
            value={searchParams.get("utm_campaign") || ""}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="reg-email">
              E-mail
            </label>
            <Input
              id="reg-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="reg-password">
              Mot de passe
            </label>
            <PasswordInput
              id="reg-password"
              name="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="Au moins 8 caractères"
              className="h-11 rounded-xl"
            />
          </div>
          <Button
            type="submit"
            disabled={loadingEmail || loadingGoogle}
            className="h-11 w-full rounded-xl bg-primary text-primary-foreground"
          >
            {loadingEmail ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Créer mon compte
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Déjà membre ?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Se connecter
        </Link>
      </p>

      <div className="flex justify-start">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="h-10 rounded-xl"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground leading-relaxed">
        Vous avez des problèmes pour vous inscrire ?{" "}
        <Link
          href="/register/help"
          className="font-semibold text-primary underline underline-offset-2 hover:opacity-90"
        >
          Cliquez ici
        </Link>
        .
      </p>
    </div>
  )
}
