"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { updatePasswordAction } from "@/app/actions/password"
import { createClient } from "@/utils/supabase/client"
import { Lock, AlertCircle, CheckCircle } from "lucide-react"

/**
 * Mot de passe oublié : consomme aussi #access_token (liens Supabase)
 * avant d’afficher le formulaire — sinon middleware / session manquante
 * renvoient vers l’accueil ou l’inscription.
 */
export default function ResetPasswordPage() {
  const router = useRouter()
  const [error, setError] = React.useState("")
  const [ready, setReady] = React.useState(false)
  const [booting, setBooting] = React.useState(true)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false

    async function boot() {
      const supabase = createClient()
      const hash = window.location.hash.replace(/^#/, "")
      const query = window.location.search.replace(/^\?/, "")
      const params = new URLSearchParams(hash || query)

      const access_token = params.get("access_token")
      const refresh_token = params.get("refresh_token")
      const code = params.get("code")
      const token_hash = params.get("token_hash")
      const type = params.get("type")
      const linkError = params.get("error_description") || params.get("error")

      if (linkError) {
        if (!cancelled) {
          setError(linkError)
          setBooting(false)
        }
        return
      }

      try {
        if (access_token && refresh_token) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          })
          if (sessionError) throw sessionError
          // Clean hash from URL
          window.history.replaceState({}, "", "/reset-password")
        } else if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) throw exchangeError
          window.history.replaceState({}, "", "/reset-password")
        } else if (token_hash && (type === "recovery" || type === "email")) {
          const { error: otpError } = await supabase.auth.verifyOtp({
            type: type as "recovery" | "email",
            token_hash,
          })
          if (otpError) throw otpError
          window.history.replaceState({}, "", "/reset-password")
        }

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!cancelled) {
          if (!user) {
            setError(
              "Lien expiré ou invalide. Demandez un nouveau lien « Mot de passe oublié »."
            )
            setReady(false)
          } else {
            setReady(true)
          }
          setBooting(false)
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error
              ? e.message
              : "Impossible d’ouvrir le lien de réinitialisation."
          )
          setBooting(false)
          setReady(false)
        }
      }
    }

    void boot()
    return () => {
      cancelled = true
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const result = await updatePasswordAction(new FormData(e.currentTarget))
      if (result?.error) setError(result.error)
    } catch {
      /* redirect */
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="text-center space-y-2">
          <Link href="/" className="font-serif text-2xl font-bold text-primary">
            KELIAA
          </Link>
          <h1 className="font-serif text-2xl font-bold">Nouveau mot de passe</h1>
          <p className="text-sm text-muted-foreground">
            Choisissez un mot de passe pour retrouver votre espace membre.
          </p>
        </div>

        {booting && (
          <p className="text-sm text-center text-muted-foreground">
            Vérification du lien sécurisé…
          </p>
        )}

        {!booting && error && (
          <Alert variant="destructive" className="text-xs">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <p>{error}</p>
              <Link href="/forgot-password" className="underline font-semibold">
                Demander un nouveau lien
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {!booting && ready && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                <Lock className="h-4 w-4" /> Nouveau mot de passe
              </label>
              <PasswordInput id="password" name="password" minLength={8} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirm" className="text-sm font-medium">
                Confirmation
              </label>
              <PasswordInput id="confirm" name="confirm" minLength={8} required />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl">
              {loading ? "Enregistrement…" : "Enregistrer et me connecter"}
            </Button>
          </form>
        )}

        {!booting && !ready && !error && (
          <Alert className="text-xs border-emerald-500/30 bg-emerald-500/10">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Session introuvable.{" "}
              <button
                type="button"
                className="underline font-semibold"
                onClick={() => router.push("/forgot-password")}
              >
                Renvoyer un lien
              </button>
            </AlertDescription>
          </Alert>
        )}

        <p className="text-center text-xs text-muted-foreground">
          <Link href="/login" className="underline-offset-2 hover:underline">
            Retour connexion
          </Link>
        </p>
      </div>
    </div>
  )
}
