"use client";

import * as React from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EvaCompanion } from "@/components/evoraa/EvaCompanion";
import { loginAction } from "@/app/actions/auth";
import { Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await loginAction(formData);
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
    <MainLayout maxWidth="md" showFooter={false}>
      <div className="space-y-8 py-8">
        
        {/* Reassuring EVA welcome */}
        <EvaCompanion
          title="EVA"
          message="Heureuse de vous retrouver. Votre espace est sécurisé et vos préférences de discernement sont préservées."
          variant="default"
        />

        <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-sm">
          <CardHeader className="space-y-2 text-center pb-6 border-b border-border/40">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent border border-accent/20">
              <Lock className="h-5 w-5" />
            </div>
            <CardTitle className="font-serif text-3xl text-foreground">Connexion à votre Espace</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Entrez vos identifiants pour continuer votre parcours de rencontre chrétienne.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-5 pt-6">
              {error && (
                <Alert variant="destructive" className="rounded-xl border-destructive/40 bg-destructive/10 text-destructive text-xs">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

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
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" /> Mot de passe
                  </label>
                  <Link href="#" className="text-xs text-accent hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-11 rounded-xl bg-background border-border/80"
                  required
                  autoComplete="current-password"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-4 pb-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
              >
                {isLoading ? "Vérification en cours..." : (
                  <span className="flex items-center justify-center gap-2">
                    Accéder à mon espace <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>

              <div className="text-center text-xs text-muted-foreground pt-2">
                Vous n&apos;avez pas encore de compte ?{" "}
                <Link href="/register" className="font-medium text-accent hover:underline">
                  Signer la charte et s&apos;inscrire
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

      </div>
    </MainLayout>
  );
}
