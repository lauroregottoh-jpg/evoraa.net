"use client";

import * as React from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { updatePasswordAction } from "@/app/actions/password";
import { Lock, AlertCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await updatePasswordAction(new FormData(e.currentTarget));
      if (result?.error) setError(result.error);
    } catch {
      // redirect throws
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout maxWidth="md" showFooter={false}>
      <div className="py-10">
        <Card className="rounded-2xl border-border/60">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="font-serif text-3xl">Nouveau mot de passe</CardTitle>
            <CardDescription>
              Choisissez un mot de passe robuste pour sécuriser votre espace KELIA.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive" className="text-xs">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Nouveau mot de passe
                </label>
                <Input id="password" name="password" type="password" minLength={8} required className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirm" className="text-sm font-medium">Confirmation</label>
                <Input id="confirm" name="confirm" type="password" minLength={8} required className="h-11 rounded-xl" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl">
                {loading ? "Enregistrement…" : "Enregistrer"}
              </Button>
              <Link href="/login" className="text-xs text-muted-foreground hover:underline">
                Retour connexion
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
}
