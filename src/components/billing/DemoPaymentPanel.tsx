"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { confirmDemoPaymentAction } from "@/app/actions/billing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Shield } from "lucide-react";

export function DemoPaymentPanel({
  paymentId,
  amount,
  currency,
  planName,
  transactionReference,
}: {
  paymentId: string;
  amount: number;
  currency: string;
  planName: string;
  transactionReference: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await confirmDemoPaymentAction(paymentId);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push(`/checkout/success?payment=${paymentId}`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-2xl border-border/60 max-w-lg mx-auto">
      <CardHeader className="border-b border-border/40">
        <CardTitle className="font-serif text-2xl">Paiement {planName}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Mode démo / préparation CinetPay. En production, vous serez redirigé vers Mobile Money (TMoney, Flooz, Wave…).
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        <div className="rounded-xl bg-secondary/40 border border-border/50 p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Montant</span>
            <span className="font-semibold">
              {amount.toLocaleString("fr-FR")} {currency === "XOF" ? "FCFA" : currency}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Référence</span>
            <span className="font-mono text-xs break-all">{transactionReference}</span>
          </div>
        </div>

        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Shield className="h-4 w-4 text-accent shrink-0 mt-0.5" />
          <span>
            Durée : 30 jours, renouvellement manuel. Aucun prélèvement automatique.
          </span>
        </div>

        <Button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full h-11 rounded-xl"
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          {loading ? "Activation…" : "Simuler un paiement réussi"}
        </Button>

        {error && <p className="text-xs text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}
