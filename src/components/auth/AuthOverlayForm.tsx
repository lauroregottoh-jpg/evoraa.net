"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CharterModal } from "@/components/auth/CharterModal";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { loginAction, registerAction } from "@/app/actions/auth";
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
} from "lucide-react";

type Mode = "login" | "register";

export function AuthOverlayForm({ initialMode = "login" }: { initialMode?: Mode }) {
  const searchParams = useSearchParams();
  const [mode, setMode] = React.useState<Mode>(
    searchParams.get("mode") === "register" ? "register" : initialMode
  );
  const [error, setError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isCharterAccepted, setIsCharterAccepted] = React.useState(false);

  React.useEffect(() => {
    const q = searchParams.get("mode");
    if (q === "register" || q === "login") setMode(q);
  }, [searchParams]);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError("");
    setSuccessMessage("");
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.pathname = next === "login" ? "/login" : "/register";
      url.searchParams.delete("mode");
      // Preserve growth attribution when switching login ↔ register
      window.history.replaceState({}, "", `${url.pathname}${url.search}`);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const result = await loginAction(formData);
      if (result?.error) setError(result.error);
    } catch {
      /* redirect */
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    if (!isCharterAccepted) {
      setError("Vous devez lire et accepter la Charte avant de créer votre espace.");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.set("charter_accepted", "true");
      const result = await registerAction(formData);
      if (result?.needsEmailConfirmation) {
        setSuccessMessage(result.message ?? "Vérifiez votre email pour confirmer votre compte.");
        return;
      }
      if (result?.error) setError(result.error);
    } catch {
      /* redirect */
    } finally {
      setIsLoading(false);
    }
  };

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
          <Link href="/" className="font-serif text-3xl font-bold text-white drop-shadow-lg">
            KELLIA
          </Link>
          <p className="text-sm text-white/85">
            {mode === "login"
              ? "Retrouvez votre espace sécurisé"
              : "Rejoignez une communauté de discernement"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/95 backdrop-blur-xl shadow-elevated p-6 sm:p-8 space-y-6">
          {mode === "register" && (
            <CharterModal
              isAccepted={isCharterAccepted}
              onAccept={() => {
                setIsCharterAccepted(true);
                setError("");
              }}
            />
          )}

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="text-center space-y-1">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent border border-accent/20 mb-2">
                  <Lock className="h-5 w-5" />
                </div>
                <h1 className="font-serif text-2xl font-bold text-foreground">Connexion</h1>
                <p className="text-xs text-muted-foreground">Entrez vos identifiants Kellia</p>
              </div>

              {error && (
                <Alert variant="destructive" className="rounded-xl text-xs">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" /> Email
                </label>
                <Input id="email" name="email" type="email" required autoComplete="email" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" /> Mot de passe
                  </label>
                  <Link href="/forgot-password" className="text-xs text-accent hover:underline">
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

              <Button type="submit" disabled={isLoading} className="w-full h-11 rounded-xl">
                {isLoading ? "Vérification…" : (
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
            <form
              onSubmit={handleRegister}
              className={`space-y-4 ${!isCharterAccepted ? "opacity-60 pointer-events-none" : ""}`}
            >
              <div className="text-center space-y-1">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 mb-2">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h1 className="font-serif text-2xl font-bold text-foreground">Inscription</h1>
                <p className="text-xs text-muted-foreground">
                  {isCharterAccepted
                    ? "Renseignez vos informations"
                    : "Validez d'abord la charte ci-dessus"}
                </p>
              </div>

              {error && (
                <Alert variant="destructive" className="rounded-xl text-xs">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {successMessage && (
                <Alert className="rounded-xl border-emerald-500/40 bg-emerald-500/10 text-emerald-700 text-xs">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="first_name" className="text-xs font-medium flex items-center gap-1">
                    <User className="h-3.5 w-3.5" /> Prénom
                  </label>
                  <Input id="first_name" name="first_name" required={isCharterAccepted} className="h-10 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="last_name" className="text-xs font-medium flex items-center gap-1">
                    <User className="h-3.5 w-3.5" /> Nom
                  </label>
                  <Input id="last_name" name="last_name" className="h-10 rounded-xl" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="city" className="text-xs font-medium flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> Ville
                </label>
                <Input id="city" name="city" className="h-10 rounded-xl" placeholder="Abidjan, Paris…" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="address" className="text-xs font-medium flex items-center gap-1">
                  <Home className="h-3.5 w-3.5" /> Adresse
                </label>
                <Input id="address" name="address" className="h-10 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="reg_email" className="text-xs font-medium flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> Email
                </label>
                <Input id="reg_email" name="email" type="email" required={isCharterAccepted} className="h-10 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="reg_password" className="text-xs font-medium flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5" /> Mot de passe
                </label>
                <PasswordInput
                  id="reg_password"
                  name="password"
                  minLength={8}
                  required={isCharterAccepted}
                  className="h-10"
                  placeholder="8 caractères minimum"
                />
              </div>

              <input type="hidden" name="ref" value={searchParams.get("ref") || ""} />
              <input type="hidden" name="utm_source" value={searchParams.get("utm_source") || ""} />
              <input type="hidden" name="utm_medium" value={searchParams.get("utm_medium") || ""} />
              <input type="hidden" name="utm_campaign" value={searchParams.get("utm_campaign") || ""} />

              <Button
                type="submit"
                disabled={!isCharterAccepted || isLoading || Boolean(successMessage)}
                className="w-full h-11 rounded-xl"
              >
                {isLoading ? "Création…" : (
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
        </div>
      </div>
    </div>
  );
}
