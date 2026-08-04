"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CharterModal } from "@/components/auth/CharterModal"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { loginAction, registerAction } from "@/app/actions/auth"
import { FeedbackForm } from "@/components/feedback/FeedbackForm"
import { isNextRedirectError } from "@/lib/auth/criticalPath"
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  User,
  MapPin,
  Home,
  Sparkles,
  LifeBuoy,
} from "lucide-react"

type Mode = "login" | "register"

type AuthActionResult = {
  error?: string | null
  needsEmailConfirmation?: boolean
  message?: string
} | undefined

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
            Utilisez le formulaire « Écrivez-nous » ci-dessous pour nous
            signaler le problème.
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

function AuthHelpPanel({
  mode,
  defaultEmail = "",
}: {
  mode: Mode
  defaultEmail?: string
}) {
  return (
    <div className="rounded-xl border-2 border-amber-400 bg-amber-50 p-4 space-y-3">
      <div className="space-y-1">
        <p className="text-sm font-bold text-amber-950 flex items-center gap-2">
          <LifeBuoy className="h-4 w-4" />
          {mode === "register"
            ? "Vous n’arrivez pas à vous inscrire ?"
            : "Vous n’arrivez pas à vous connecter ?"}
        </p>
        <p className="text-xs text-amber-900/90 leading-relaxed">
          Décrivez le problème (message affiché, étape bloquée). Votre message
          arrive directement à l’équipe Keliaa — onglet admin « Avis &
          plaintes ».
        </p>
        <a
          href="mailto:contact@keliaa.org?subject=Aide%20KELIAA%20auth"
          className="inline-block text-xs font-semibold text-primary underline"
        >
          Ou écrivez à contact@keliaa.org
        </a>
      </div>
      <FeedbackForm
        compact
        defaultEmail={defaultEmail}
        defaultCategory={mode === "register" ? "signup_help" : "complaint"}
        pagePath={mode === "register" ? "/register" : "/login"}
        title="Envoyer un message à l’équipe"
        subtitle="Plus vous donnez de détails, plus vite nous débloquons l’accès."
      />
    </div>
  )
}

export function AuthOverlayForm({
  initialMode = "login",
}: {
  initialMode?: Mode
}) {
  const searchParams = useSearchParams()
  const [mode, setMode] = React.useState<Mode>(
    searchParams.get("mode") === "register" ? "register" : initialMode
  )
  const [error, setError] = React.useState("")
  const [successMessage, setSuccessMessage] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isCharterAccepted, setIsCharterAccepted] = React.useState(false)
  const [typedEmail, setTypedEmail] = React.useState("")

  React.useEffect(() => {
    const q = searchParams.get("mode")
    if (q === "register" || q === "login") setMode(q)
  }, [searchParams])

  React.useEffect(() => {
    const err = searchParams.get("error")
    const msg = searchParams.get("msg")
    const confirmed =
      searchParams.get("confirmed") === "1" ||
      searchParams.get("welcome") === "1"

    if (confirmed) {
      setMode("login")
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

  const switchMode = (next: Mode) => {
    setMode(next)
    setError("")
    setSuccessMessage("")
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      url.pathname = next === "login" ? "/login" : "/register"
      url.searchParams.delete("mode")
      window.history.replaceState({}, "", `${url.pathname}${url.search}`)
    }
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")
    setIsLoading(true)
    try {
      const formData = new FormData(e.currentTarget)
      const result = (await loginAction(formData)) as AuthActionResult
      if (result?.error) {
        setError(result.error)
        return
      }
      // Pas de redirect ni d’erreur = réponse anormale
      setError(
        "Aucune réponse du serveur. Réessayez, ou envoyez-nous un message ci-dessous."
      )
    } catch (err) {
      if (isNextRedirectError(err)) throw err
      setError(
        "Connexion interrompue. Réessayez, ou décrivez le problème dans « Écrivez-nous »."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")
    if (!isCharterAccepted) {
      setError(
        "Validez d’abord la Charte de Bienveillance ci-dessus, puis créez votre compte."
      )
      return
    }
    setIsLoading(true)
    try {
      const formData = new FormData(e.currentTarget)
      formData.set("charter_accepted", "true")
      const result = (await registerAction(formData)) as AuthActionResult

      if (result?.error) {
        setError(result.error)
        return
      }
      if (result?.needsEmailConfirmation || result?.message) {
        setMode("login")
        setSuccessMessage(
          result.message ??
            "Compte créé. Connectez-vous avec le même email et mot de passe."
        )
        return
      }
      setError(
        "Aucune réponse du serveur à l’inscription. Réessayez, ou écrivez-nous ci-dessous."
      )
    } catch (err) {
      if (isNextRedirectError(err)) throw err
      setError(
        "Inscription interrompue. Réessayez, ou envoyez le détail à l’équipe ci-dessous."
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
          <p className="text-sm text-white/85">
            {mode === "login"
              ? "Retrouvez votre espace sécurisé"
              : "Rejoignez une communauté de célibataires chrétiens sérieux, engagés à se marier"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/95 backdrop-blur-xl shadow-elevated p-6 sm:p-8 space-y-5">
          {/* Toujours en haut : erreurs / succès visibles */}
          <StatusBanner error={error} success={successMessage} />

          {mode === "register" && (
            <CharterModal
              isAccepted={isCharterAccepted}
              onAccept={() => {
                setIsCharterAccepted(true)
                setError("")
              }}
            />
          )}

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <input
                type="hidden"
                name="next"
                value={searchParams.get("next") || ""}
              />
              <div className="text-center space-y-1">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent border border-accent/20 mb-2">
                  <Lock className="h-5 w-5" />
                </div>
                <h1 className="font-serif text-2xl font-bold text-foreground">
                  Connexion
                </h1>
                <p className="text-xs text-muted-foreground">
                  Entrez vos identifiants Keliaa
                </p>
              </div>

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

              <Button
                type="submit"
                disabled={isLoading}
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
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className="font-medium text-accent hover:underline"
                >
                  Cliquez ici.
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 mb-2">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h1 className="font-serif text-2xl font-bold text-foreground">
                  Inscription
                </h1>
                <p className="text-xs text-muted-foreground">
                  {isCharterAccepted
                    ? "Renseignez vos informations"
                    : "Validez d’abord la charte ci-dessus, puis remplir le formulaire"}
                </p>
              </div>

              <div
                className={
                  !isCharterAccepted
                    ? "space-y-4 opacity-70"
                    : "space-y-4"
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="first_name"
                      className="text-xs font-medium flex items-center gap-1"
                    >
                      <User className="h-3.5 w-3.5" /> Prénom
                    </label>
                    <Input
                      id="first_name"
                      name="first_name"
                      required
                      disabled={!isCharterAccepted}
                      className="h-10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="last_name"
                      className="text-xs font-medium flex items-center gap-1"
                    >
                      <User className="h-3.5 w-3.5" /> Nom
                    </label>
                    <Input
                      id="last_name"
                      name="last_name"
                      disabled={!isCharterAccepted}
                      className="h-10 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="city"
                    className="text-xs font-medium flex items-center gap-1"
                  >
                    <MapPin className="h-3.5 w-3.5" /> Ville
                  </label>
                  <Input
                    id="city"
                    name="city"
                    disabled={!isCharterAccepted}
                    className="h-10 rounded-xl"
                    placeholder="Abidjan, Paris…"
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="address"
                    className="text-xs font-medium flex items-center gap-1"
                  >
                    <Home className="h-3.5 w-3.5" /> Adresse
                  </label>
                  <Input
                    id="address"
                    name="address"
                    disabled={!isCharterAccepted}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="reg_email"
                    className="text-xs font-medium flex items-center gap-1"
                  >
                    <Mail className="h-3.5 w-3.5" /> Email
                  </label>
                  <Input
                    id="reg_email"
                    name="email"
                    type="email"
                    required
                    disabled={!isCharterAccepted}
                    className="h-10 rounded-xl"
                    onChange={(ev) => setTypedEmail(ev.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="reg_password"
                    className="text-xs font-medium flex items-center gap-1"
                  >
                    <Lock className="h-3.5 w-3.5" /> Mot de passe
                  </label>
                  <PasswordInput
                    id="reg_password"
                    name="password"
                    minLength={8}
                    required
                    disabled={!isCharterAccepted}
                    className="h-10"
                    placeholder="8 caractères minimum"
                  />
                </div>
              </div>

              <input
                type="hidden"
                name="ref"
                value={searchParams.get("ref") || ""}
              />
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

              <Button
                type="submit"
                disabled={!isCharterAccepted || isLoading}
                className="w-full h-11 rounded-xl"
              >
                {isLoading ? (
                  "Création…"
                ) : !isCharterAccepted ? (
                  "Acceptez la charte pour continuer"
                ) : (
                  <span className="flex items-center gap-2">
                    Créer mon compte <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Vous avez déjà un compte ?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="font-medium text-accent hover:underline"
                >
                  Se connecter
                </button>
              </p>
            </form>
          )}

          {/* Toujours visible — login ET inscription */}
          <AuthHelpPanel mode={mode} defaultEmail={typedEmail} />
        </div>
      </div>
    </div>
  )
}
