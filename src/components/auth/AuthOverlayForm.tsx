"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { loginAction } from "@/app/actions/auth"
import { isNextRedirectError } from "@/lib/auth/criticalPath"
import { startGoogleOAuth } from "@/lib/auth/oauthGoogle"
import { TurnstileField } from "@/components/auth/TurnstileField"
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react"

type AuthActionResult =
  | {
      error?: string | null
      needsEmailConfirmation?: boolean
      message?: string
    }
  | undefined

function StatusBanner({
  error,
  success,
}: {
  error: string
  success: string
}) {
  if (!error && !success) return null
  return (
    <div className="space-y-2" role="status" aria-live="polite">
      {error ? (
        <div className="rounded-xl border-2 border-red-500 bg-red-50 px-3 py-3 text-sm text-red-900">
          <p className="font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Impossible de continuer
          </p>
          <p className="mt-1 text-xs leading-relaxed">{error}</p>
          <p className="mt-2 text-[11px] font-medium text-red-800">
            Problème persistant ?{" "}
            <a href="/register/help" className="underline font-semibold">
              Cliquez ici
            </a>
            .
          </p>
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
    </div>
  )
}

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

export function AuthOverlayForm({
  initialMode = "login",
}: {
  initialMode?: "login" | "register"
}) {
  const searchParams = useSearchParams()
  const [error, setError] = React.useState("")
  const [successMessage, setSuccessMessage] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [loadingGoogle, setLoadingGoogle] = React.useState(false)
  const [typedEmail, setTypedEmail] = React.useState("")
  const [turnstileToken, setTurnstileToken] = React.useState("")

  // Legacy /register links that still mount this shell → push to new flow
  React.useEffect(() => {
    if (initialMode === "register" && typeof window !== "undefined") {
      window.location.replace("/register")
    }
  }, [initialMode])

  React.useEffect(() => {
    const err = searchParams.get("error")
    const msg = searchParams.get("msg")
    const confirmed =
      searchParams.get("confirmed") === "1" ||
      searchParams.get("welcome") === "1"

    if (confirmed) {
      setError("")
      setSuccessMessage(
        msg
          ? decodeURIComponent(msg)
          : "Bienvenue. Entrez votre email et mot de passe pour ouvrir votre espace membre."
      )
      return
    }

    if (err === "auth_callback") {
      setError(
        msg
          ? decodeURIComponent(msg)
          : "Le lien de confirmation a échoué. Connectez-vous avec votre mot de passe."
      )
    }
    if (searchParams.get("reset") === "1") {
      setSuccessMessage("Mot de passe mis à jour. Vous pouvez vous connecter.")
    }
  }, [searchParams])

  const handleGoogle = async () => {
    setError("")
    setLoadingGoogle(true)
    const next = searchParams.get("next") || "/onboarding"
    const result = await startGoogleOAuth({ next })
    if (result.error) {
      setError(result.error)
      setLoadingGoogle(false)
    }
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setError("")
    setSuccessMessage("")
    setIsLoading(true)
    try {
      const formData = new FormData(e.currentTarget)
      if (turnstileToken) {
        formData.set("cf-turnstile-response", turnstileToken)
      }
      const result = (await loginAction(formData)) as AuthActionResult & {
        next?: string
        success?: boolean
      }
      if (result?.error) {
        setError(result.error)
        return
      }
      if (result?.next) {
        window.location.assign(result.next)
        return
      }
      setError(
        "Aucune réponse du serveur. Réessayez, ou utilisez « Cliquez ici » pour nous écrire."
      )
    } catch (err) {
      if (isNextRedirectError(err)) {
        window.location.assign("/onboarding")
        return
      }
      setError(
        "Connexion interrompue. Réessayez, ou utilisez « Cliquez ici » pour nous écrire."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-16 overflow-hidden">
      <Image
        src="/auth-bg-african.png"
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-black/30 to-black/60" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center space-y-2">
          <Link
            href="/"
            className="font-serif text-3xl font-bold text-white drop-shadow-lg"
          >
            KELIAA
          </Link>
          <p className="text-sm text-white/85">Retrouvez votre espace sécurisé</p>
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/95 backdrop-blur-xl shadow-elevated p-6 sm:p-8 space-y-5">
          <StatusBanner error={error} success={successMessage} />

          <div className="text-center space-y-1">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent border border-accent/20 mb-2">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-foreground">
              Connexion
            </h1>
          </div>

          <Button
            type="button"
            onClick={handleGoogle}
            disabled={loadingGoogle || isLoading}
            className="h-11 w-full rounded-xl bg-white text-foreground border-2 border-border hover:bg-secondary/80 shadow-sm font-medium"
          >
            {loadingGoogle ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <GoogleIcon className="mr-3 h-5 w-5" />
            )}
            Continuer avec Google
          </Button>

          <div className="relative flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
              ou
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="hidden"
              name="next"
              value={searchParams.get("next") || ""}
            />

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Mail className="h-4 w-4 text-muted-foreground" /> Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="h-11 rounded-xl"
                onChange={(ev) => setTypedEmail(ev.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Lock className="h-4 w-4 text-muted-foreground" /> Mot de
                  passe
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-accent hover:underline"
                >
                  Oublié ?
                </Link>
              </div>
              <PasswordInput
                id="password"
                name="password"
                required
                autoComplete="current-password"
              />
            </div>

            <TurnstileField onToken={setTurnstileToken} />

            <Button
              type="submit"
              disabled={isLoading || loadingGoogle}
              className="w-full h-11 rounded-xl"
            >
              {isLoading ? (
                "Vérification…"
              ) : (
                <span className="flex items-center gap-2">
                  Accéder à mon espace <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Vous n&apos;êtes pas encore inscrit ?{" "}
              <Link
                href="/register"
                className="font-medium text-accent hover:underline"
              >
                Créer un compte
              </Link>
            </p>

            <p className="text-center text-xs text-muted-foreground leading-relaxed">
              Vous avez des problèmes pour vous connecter ?{" "}
              <Link
                href="/register/help"
                className="font-semibold text-primary underline underline-offset-2 hover:opacity-90"
              >
                Cliquez ici
              </Link>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
