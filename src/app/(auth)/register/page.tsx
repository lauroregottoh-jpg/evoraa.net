"use client";

import * as React from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EvaCompanion } from "@/components/evoraa/EvaCompanion";
import { CharterModal } from "@/components/auth/CharterModal";
import { registerAction } from "@/app/actions/auth";
import { Sparkles, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const [isCharterAccepted, setIsCharterAccepted] = React.useState(false);
  const [error, setError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!isCharterAccepted) {
      setError("Vous devez impérativement lire et accepter la Charte de Bienveillance avant de créer votre espace.");
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

      if (result?.error) {
        setError(result.error);
      }
    } catch {
      // redirect() from the Server Action throws; ignore navigation errors
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout maxWidth="lg" showFooter={false}>
      <div className="space-y-8 py-6">
        
        {/* EVA Guidance explaining the Charter */}
        <EvaCompanion
          title="EVA - Ouverture de votre Espace"
          variant="suggestion"
          message={
            <span>
              Bienvenue sur Evoraa. Avant de créer votre profil, nous vous demandons de lire et signer notre <b>Charte de Bienveillance & Dignité</b>. C&apos;est ce filtre rigoureux qui garantit que chaque rencontre ici est fondée sur le respect.
            </span>
          }
        />

        {/* 1. Mandatory Charter Section */}
        <CharterModal
          isAccepted={isCharterAccepted}
          onAccept={() => {
            setIsCharterAccepted(true);
            setError("");
          }}
        />

        {/* 2. Registration Form */}
        <Card className={`rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-sm transition-all duration-300 ${!isCharterAccepted ? "opacity-60 pointer-events-none filter grayscale-[30%]" : "opacity-100"}`}>
          <CardHeader className="space-y-2 text-center pb-6 border-b border-border/40">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary dark:text-accent border border-primary/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <CardTitle className="font-serif text-3xl text-foreground">Créer votre Espace</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {isCharterAccepted
                ? "Charte signée avec succès. Renseignez vos informations pour entamer votre profil."
                : "Veuillez d'abord valider la Charte ci-dessus pour déverrouiller ce formulaire."}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleRegister}>
            <CardContent className="space-y-5 pt-6">
              {error && (
                <Alert variant="destructive" className="rounded-xl border-destructive/40 bg-destructive/10 text-destructive text-xs">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {successMessage && (
                <Alert className="rounded-xl border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="first_name" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" /> Prénom
                  </label>
                  <Input
                    id="first_name"
                    name="first_name"
                    type="text"
                    placeholder="Laure"
                    className="h-11 rounded-xl bg-background border-border/80"
                    required={isCharterAccepted}
                    autoComplete="given-name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="last_name" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" /> Nom
                  </label>
                  <Input
                    id="last_name"
                    name="last_name"
                    type="text"
                    placeholder="Dupont"
                    className="h-11 rounded-xl bg-background border-border/80"
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" /> Adresse email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="laure@exemple.com"
                  className="h-11 rounded-xl bg-background border-border/80"
                  required={isCharterAccepted}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" /> Mot de passe
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="8 caractères minimum, sécurisé"
                  className="h-11 rounded-xl bg-background border-border/80"
                  required={isCharterAccepted}
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>

              {isCharterAccepted && (
                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span>En cliquant ci-dessous, votre engagement éthique sera associé à votre profil d&apos;accueil.</span>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-4 pb-6">
              <Button
                type="submit"
                disabled={!isCharterAccepted || isLoading || Boolean(successMessage)}
                className="w-full h-11 rounded-xl font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
              >
                {isLoading ? "Création en cours..." : (
                  <span className="flex items-center justify-center gap-2">
                    Démarrer mon questionnaire d&apos;accueil <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>

              <div className="text-center text-xs text-muted-foreground pt-2">
                Vous avez déjà un compte ?{" "}
                <Link href="/login" className="font-medium text-accent hover:underline">
                  Se connecter
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

      </div>
    </MainLayout>
  );
}
