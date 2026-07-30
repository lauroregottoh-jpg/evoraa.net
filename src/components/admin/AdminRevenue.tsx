"use client";

import * as React from "react";
import { CreditCard, TrendingUp, AlertCircle, CheckCircle2, DollarSign, Users, Award, Sparkles, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SubscriptionRow {
  id: string;
  userName: string;
  userEmail: string;
  planName: "Essentiel legacy (2 500 FCFA)" | "Alliance (5 000 FCFA)" | "Découverte";
  amount: number;
  status: "active" | "canceled" | "pending";
  renewDate: string;
}

const SUB_DATA: SubscriptionRow[] = [
  {
    id: "sub-1",
    userName: "Laure Regottoh",
    userEmail: "laure.regottoh@keliaa.net",
    planName: "Alliance (5 000 FCFA)",
    amount: 5000,
    status: "active",
    renewDate: "21 Août 2026",
  },
  {
    id: "sub-2",
    userName: "Alexandre Dumas",
    userEmail: "alexandre.dumas@keliaa.net",
    planName: "Alliance (5 000 FCFA)",
    amount: 5000,
    status: "active",
    renewDate: "14 Août 2026",
  },
  {
    id: "sub-3",
    userName: "Thomas Bernard",
    userEmail: "thomas.bernard@keliaa.net",
    planName: "Essentiel legacy (2 500 FCFA)",
    amount: 2500,
    status: "active",
    renewDate: "02 Août 2026",
  },
  {
    id: "sub-4",
    userName: "Marc Inconnu",
    userEmail: "suspect.spam@keliaa.net",
    planName: "Essentiel legacy (2 500 FCFA)",
    amount: 2500,
    status: "canceled",
    renewDate: "Expiré (Churn)",
  },
];

export function AdminRevenue() {
  const [period, setPeriod] = React.useState("month");

  return (
    <div className="space-y-6 font-sans">
      
      {/* Financial KPIs */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Revenu Mensuel (MRR)
            </CardTitle>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-serif font-bold text-foreground">3,705,000 FCFA</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500 font-medium">+18.5%</span> ce mois-ci
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Formule Or (5 000 F)
            </CardTitle>
            <div className="p-2 rounded-xl bg-accent/15 text-accent">
              <Award className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-serif font-bold text-foreground">582 membres</div>
            <p className="text-xs text-muted-foreground mt-1">
              78% du chiffre d&apos;affaires global
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Formule Base (2 500 F)
            </CardTitle>
            <div className="p-2 rounded-xl bg-primary/10 text-primary dark:text-accent">
              <CreditCard className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-serif font-bold text-foreground">318 membres</div>
            <p className="text-xs text-muted-foreground mt-1">
              22% du chiffre d&apos;affaires global
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Taux d&apos;Attrition (Churn)
            </CardTitle>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <RefreshCcw className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-serif font-bold text-amber-600">2.4%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Très bonne fidélité communautaire
            </p>
          </CardContent>
        </Card>

      </div>

      {/* Subscriptions Table */}
      <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs">
        <CardHeader className="border-b border-border/40 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-accent" /> Suivi des Abonnements & Paiements (`subscriptions`)
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Consultez les membres payants, les formules souscrites et les profils en désabonnement (churn).
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="h-9 px-3 text-xs rounded-xl bg-background border border-border/80 text-foreground font-medium"
            >
              <option value="month">Ce mois-ci (Juillet 2026)</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Année 2026</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-secondary/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/40">
              <tr>
                <th className="py-3 px-4 font-semibold">Membre Payant</th>
                <th className="py-3 px-4 font-semibold">Formule Souscrite</th>
                <th className="py-3 px-4 font-semibold">Montant</th>
                <th className="py-3 px-4 font-semibold">Statut & Échéance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {SUB_DATA.map((sub) => (
                <tr key={sub.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-foreground text-sm block">{sub.userName}</span>
                    <span className="text-[11px] text-muted-foreground">{sub.userEmail}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant="outline" className={`text-[11px] font-medium ${sub.planName.includes("Or") ? "border-accent text-accent bg-accent/5" : "border-primary/40 text-primary dark:text-accent bg-primary/5"}`}>
                      {sub.planName}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 font-serif font-bold text-foreground text-sm">
                    {sub.amount.toLocaleString("fr-FR")} FCFA
                  </td>

                  <td className="py-3.5 px-4">
                    {sub.status === "active" ? (
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>Actif • {sub.renewDate}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-600 font-medium">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>Désabonné (Churn)</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

    </div>
  );
}
