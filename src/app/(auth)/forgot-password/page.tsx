"use client";

import * as React from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { requestPasswordResetAction } from "@/app/actions/password";
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const result = await requestPasswordResetAction(new FormData(e.currentTarget));
      if (result.error) setError(result.error);
      else setSuccess(result.message || "Email envoyé.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout maxWidth="md" showFooter={false}>
      <div className="py-10 space-y-6">
        <Link href="/login" className="text-xs text-muted-foreground inline-flex items-center gap-1 hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Retour connexion
        </Link>
        <Card className="rounded-2xl border-border/60">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="font-serif text-3xl">Mot de passe oublié</CardTitle>
            <CardDescription>
              Indiquez votre email : KELLIA vous enverra un lien sécurisé de réinitialisation.
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
              {success && (
                <Alert className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 text-xs">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" /> Email
                </label>
                <Input id="email" name="email" type="email" required className="h-11 rounded-xl" />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading || Boolean(success)} className="w-full h-11 rounded-xl">
                {loading ? "Envoi…" : "Recevoir le lien"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
}
