"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  adminModeratePhoto,
  adminResolveReport,
  adminUpdateModerationStatus,
} from "@/app/actions/admin";
import {
  BarChart3,
  Users,
  Image as ImageIcon,
  ShieldAlert,
  DollarSign,
  ShieldCheck,
} from "lucide-react";

type Tab = "stats" | "revenue" | "users" | "photos" | "reports";

type Props = {
  stats: {
    users: number;
    activeSubscriptions: number;
    openReports: number;
    pendingPhotos: number;
    revenueXof: number;
  };
  users: Array<{
    id: string;
    name: string;
    city: string;
    completion: number;
    role: string;
    status: string;
    verified: boolean;
  }>;
  reports: Array<{
    id: string;
    reason: string;
    status: string | null;
    created_at: string | null;
    reported_user_id: string;
  }>;
  payments: Array<{
    id: string;
    amount: number;
    currency: string;
    status: string | null;
    transaction_reference: string | null;
    created_at: string | null;
  }>;
  photos: Array<{
    id: string;
    photo_url: string;
    status: string | null;
    profile_id: string;
  }>;
};

export function AdminConsole(props: Props) {
  const [tab, setTab] = React.useState<Tab>("stats");
  const [search, setSearch] = React.useState("");
  const [busy, setBusy] = React.useState("");

  const filteredUsers = props.users.filter(
    (u) =>
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.city.toLowerCase().includes(search.toLowerCase())
  );

  const run = async (key: string, fn: () => Promise<{ error?: string }>) => {
    setBusy(key);
    try {
      await fn();
    } finally {
      setBusy("");
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "stats", label: "Statistiques", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "revenue", label: "Revenus", icon: <DollarSign className="h-4 w-4" /> },
    { id: "users", label: "Utilisateurs", icon: <Users className="h-4 w-4" /> },
    { id: "photos", label: "Photos", icon: <ImageIcon className="h-4 w-4" /> },
    { id: "reports", label: "Signalements", icon: <ShieldAlert className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-8 py-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Quartier Général KELIAA
          </h1>
          <p className="text-sm text-muted-foreground">
            Données réelles Supabase — modération, revenus et santé plateforme.
          </p>
        </div>
        <Badge className="bg-emerald-500/15 text-emerald-600 border-0 px-3 py-1 text-xs flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" /> RLS active
        </Badge>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border/40">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap ${
              tab === t.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary/60 text-muted-foreground"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {tab === "stats" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            ["Membres", props.stats.users],
            ["Abonnements actifs", props.stats.activeSubscriptions],
            ["Signalements ouverts", props.stats.openReports],
            ["Photos en attente", props.stats.pendingPhotos],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-2xl border border-border/60 p-5">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="font-serif text-3xl font-bold mt-1">{value}</p>
            </div>
          ))}
          <div className="rounded-2xl border border-border/60 p-5 sm:col-span-2">
            <p className="text-xs text-muted-foreground">Revenus encaissés (XOF)</p>
            <p className="font-serif text-3xl font-bold mt-1">
              {props.stats.revenueXof.toLocaleString("fr-FR")} FCFA
            </p>
          </div>
        </div>
      )}

      {tab === "revenue" && (
        <div className="space-y-3">
          {props.payments.length === 0 && (
            <p className="text-sm text-muted-foreground">Aucun paiement enregistré.</p>
          )}
          {props.payments.map((p) => (
            <div key={p.id} className="rounded-xl border border-border/60 p-4 flex justify-between gap-3 text-sm">
              <div>
                <p className="font-medium">
                  {Number(p.amount).toLocaleString("fr-FR")} {p.currency === "XOF" ? "FCFA" : p.currency}
                </p>
                <p className="text-xs text-muted-foreground font-mono">{p.transaction_reference}</p>
              </div>
              <Badge variant="outline">{p.status || "—"}</Badge>
            </div>
          ))}
        </div>
      )}

      {tab === "users" && (
        <div className="space-y-4">
          <Input
            placeholder="Rechercher nom ou ville…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm rounded-xl"
          />
          <div className="space-y-2">
            {filteredUsers.map((u) => (
              <div key={u.id} className="rounded-xl border border-border/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-serif font-bold">{u.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {u.city} · {u.completion}% · {u.role} · {u.status}
                    {u.verified ? " · vérifié" : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy === u.id}
                    onClick={() =>
                      run(u.id, () => adminUpdateModerationStatus(u.id, "approved"))
                    }
                  >
                    Approuver
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy === u.id}
                    onClick={() =>
                      run(u.id, () => adminUpdateModerationStatus(u.id, "rejected"))
                    }
                  >
                    Rejeter
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "photos" && (
        <div className="space-y-3">
          {props.photos.length === 0 && (
            <p className="text-sm text-muted-foreground">Aucune photo en attente.</p>
          )}
          {props.photos.map((ph) => (
            <div key={ph.id} className="rounded-xl border border-border/60 p-4 flex items-center justify-between gap-3">
              <a href={ph.photo_url} target="_blank" rel="noreferrer" className="text-sm text-accent underline truncate max-w-md">
                Voir la photo
              </a>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  disabled={busy === ph.id}
                  onClick={() => run(ph.id, () => adminModeratePhoto(ph.id, "approved"))}
                >
                  OK
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busy === ph.id}
                  onClick={() => run(ph.id, () => adminModeratePhoto(ph.id, "rejected"))}
                >
                  Refuser
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "reports" && (
        <div className="space-y-3">
          {props.reports.length === 0 && (
            <p className="text-sm text-muted-foreground">Aucun signalement.</p>
          )}
          {props.reports.map((r) => (
            <div key={r.id} className="rounded-xl border border-border/60 p-4 space-y-2">
              <div className="flex justify-between gap-2">
                <p className="text-sm">{r.reason}</p>
                <Badge variant="outline">{r.status || "pending"}</Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  disabled={busy === r.id}
                  onClick={() => run(r.id, () => adminResolveReport(r.id, "resolved"))}
                >
                  Résolu
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busy === r.id}
                  onClick={() => run(r.id, () => adminResolveReport(r.id, "dismissed"))}
                >
                  Ignorer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
