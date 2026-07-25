"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  adminModeratePhoto,
  adminResolveReport,
  adminSetVerified,
  adminUpdateModerationStatus,
  type AdminRetention,
} from "@/app/actions/admin";
import {
  BarChart3,
  Users,
  Image as ImageIcon,
  ShieldAlert,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  MessageCircle,
  Crown,
} from "lucide-react";
import { cn } from "@/utils/cn";

type Tab = "stats" | "retention" | "revenue" | "users" | "subs" | "photos" | "reports";

type Props = {
  stats: {
    users: number;
    activeSubscriptions: number;
    openReports: number;
    pendingPhotos: number;
    revenueXof: number;
  };
  retention: AdminRetention;
  users: Array<{
    id: string;
    userId: string;
    name: string;
    city: string;
    completion: number;
    role: string;
    status: string;
    onboarding: string | null;
    verified: boolean;
    hasAvatar: boolean;
    createdAt: string | null;
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
  subscriptions: Array<{
    id: string;
    userId: string;
    plan: string;
    status: string;
    startsAt: string | null;
    endsAt: string | null;
    createdAt: string | null;
  }>;
};

function planLabel(plan: string) {
  if (plan === "premium_plus") return "Alliance";
  if (plan === "premium") return "Essentiel (legacy)";
  return plan;
}

export function AdminConsole(props: Props) {
  const [tab, setTab] = React.useState<Tab>("stats");
  const [search, setSearch] = React.useState("");
  const [busy, setBusy] = React.useState("");
  const [selectedUser, setSelectedUser] = React.useState<string | null>(null);

  const filteredUsers = props.users.filter(
    (u) =>
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.city.toLowerCase().includes(search.toLowerCase()) ||
      u.userId.toLowerCase().includes(search.toLowerCase())
  );

  const selected = props.users.find((u) => u.id === selectedUser) ?? null;
  const userSubs = selected
    ? props.subscriptions.filter((s) => s.userId === selected.userId)
    : [];

  const run = async (key: string, fn: () => Promise<{ error?: string }>) => {
    setBusy(key);
    try {
      await fn();
    } finally {
      setBusy("");
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "stats", label: "Vue d'ensemble", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "retention", label: "Rétention", icon: <TrendingUp className="h-4 w-4" /> },
    { id: "revenue", label: "Finance", icon: <DollarSign className="h-4 w-4" /> },
    { id: "subs", label: "Abonnements", icon: <Crown className="h-4 w-4" /> },
    { id: "users", label: "Utilisateurs", icon: <Users className="h-4 w-4" /> },
    { id: "photos", label: "Photos", icon: <ImageIcon className="h-4 w-4" /> },
    { id: "reports", label: "Signalements", icon: <ShieldAlert className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-8 py-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Administration KELIAA
          </h1>
          <p className="text-sm text-muted-foreground">
            Membres, Alliance, modération, finance et rétention — données Supabase live.
          </p>
        </div>
        <Badge className="bg-emerald-500/15 text-emerald-700 border-0 px-3 py-1 text-xs flex items-center gap-1.5 w-fit">
          <ShieldCheck className="h-3.5 w-3.5" /> Accès sécurisé
        </Badge>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border/40">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors",
              tab === t.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary/60 text-muted-foreground"
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {tab === "stats" && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              ["Membres", props.stats.users],
              ["Abonnements actifs", props.stats.activeSubscriptions],
              ["Signalements ouverts", props.stats.openReports],
              ["Photos en attente", props.stats.pendingPhotos],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-2xl border border-border bg-white p-5">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-serif text-3xl font-bold mt-1">{value}</p>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border bg-white p-5 sm:col-span-2">
              <p className="text-xs text-muted-foreground">Revenus encaissés (completed)</p>
              <p className="font-serif text-3xl font-bold mt-1">
                {props.stats.revenueXof.toLocaleString("fr-FR")} FCFA
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-5">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" /> Conversations 30j
              </p>
              <p className="font-serif text-3xl font-bold mt-1">
                {props.retention.conversations30d}
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-accent/40 bg-accent/5 p-5">
              <p className="text-xs text-muted-foreground">Alliance actives</p>
              <p className="font-serif text-3xl font-bold mt-1 text-primary">
                {props.retention.activeAlliance}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-5">
              <p className="text-xs text-muted-foreground">Legacy 2 500 actives</p>
              <p className="font-serif text-3xl font-bold mt-1">
                {props.retention.activeLegacyPremium}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-5">
              <p className="text-xs text-muted-foreground">Conversion payante</p>
              <p className="font-serif text-3xl font-bold mt-1">
                {props.retention.conversionPaidPct}%
              </p>
            </div>
          </div>
        </div>
      )}

      {tab === "retention" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ["Nouveaux membres (30j)", props.retention.newMembers30d],
            ["Profils ≥ 70%", props.retention.profilesComplete70],
            ["3 tests complétés (échantillon)", props.retention.assessmentsDoneAll],
            ["Estim. Free actifs", props.retention.activeFreeEstimate],
            ["Expirés (ends_at 30j)", props.retention.expiredSubs30d],
            ["Annulés (créés 30j)", props.retention.cancelledSubs30d],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-2xl border border-border bg-white p-5">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="font-serif text-3xl font-bold mt-1">{value}</p>
            </div>
          ))}
          <div className="rounded-2xl border border-border bg-secondary/40 p-5 sm:col-span-2 lg:col-span-3 text-sm text-muted-foreground leading-relaxed">
            Lecture : la conversion payante = (Alliance + legacy actifs) / membres. Les
            « tests complétés » portent sur les 150 derniers profils chargés — suffisant pour
            le soft launch, à affiner avec une vue SQL dédiée ensuite.
          </div>
        </div>
      )}

      {tab === "revenue" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-white p-5">
            <p className="text-xs text-muted-foreground">Total completed</p>
            <p className="font-serif text-3xl font-bold">
              {props.stats.revenueXof.toLocaleString("fr-FR")} FCFA
            </p>
          </div>
          <div className="space-y-2">
            {props.payments.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucun paiement enregistré.</p>
            )}
            {props.payments.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-border bg-white p-4 flex justify-between gap-3 text-sm"
              >
                <div>
                  <p className="font-medium">
                    {Number(p.amount).toLocaleString("fr-FR")}{" "}
                    {p.currency === "XOF" ? "FCFA" : p.currency}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {p.transaction_reference || "—"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {p.created_at
                      ? new Date(p.created_at).toLocaleString("fr-FR")
                      : ""}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    p.status === "completed" && "border-emerald-500/40 text-emerald-700"
                  )}
                >
                  {p.status || "—"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "subs" && (
        <div className="space-y-2">
          {props.subscriptions.length === 0 && (
            <p className="text-sm text-muted-foreground">Aucun abonnement.</p>
          )}
          {props.subscriptions.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-border bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm"
            >
              <div>
                <p className="font-semibold">{planLabel(s.plan)}</p>
                <p className="text-xs text-muted-foreground font-mono truncate max-w-md">
                  {s.userId}
                </p>
              </div>
              <div className="text-xs text-muted-foreground sm:text-right">
                <Badge variant="outline">{s.status}</Badge>
                <p className="mt-1">
                  {s.startsAt ? new Date(s.startsAt).toLocaleDateString("fr-FR") : "—"} →{" "}
                  {s.endsAt ? new Date(s.endsAt).toLocaleDateString("fr-FR") : "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "users" && (
        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 space-y-4">
            <Input
              placeholder="Rechercher nom, ville ou user id…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm rounded-xl"
            />
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
              {filteredUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setSelectedUser(u.id)}
                  className={cn(
                    "w-full text-left rounded-xl border p-4 transition-colors",
                    selectedUser === u.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-white hover:border-primary/30"
                  )}
                >
                  <p className="font-serif font-bold">{u.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {u.city} · {u.completion}% · {u.status}
                    {u.verified ? " · vérifié" : ""}
                    {u.hasAvatar ? "" : " · sans photo"}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-border bg-white p-5 space-y-4 sticky top-20 h-fit">
            {!selected ? (
              <p className="text-sm text-muted-foreground">
                Sélectionnez un membre pour voir le détail et les actions.
              </p>
            ) : (
              <>
                <div>
                  <h3 className="font-serif text-xl font-bold">{selected.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono break-all mt-1">
                    {selected.userId}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {selected.city} · onboarding {selected.onboarding || "—"} · rôle{" "}
                    {selected.role}
                  </p>
                  {selected.createdAt && (
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Inscrit le {new Date(selected.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy === selected.id}
                    onClick={() =>
                      run(selected.id, () =>
                        adminUpdateModerationStatus(selected.id, "approved")
                      )
                    }
                  >
                    Approuver
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy === selected.id}
                    onClick={() =>
                      run(selected.id, () =>
                        adminUpdateModerationStatus(selected.id, "rejected")
                      )
                    }
                  >
                    Suspendre / rejeter
                  </Button>
                  <Button
                    size="sm"
                    disabled={busy === `v-${selected.id}`}
                    onClick={() =>
                      run(`v-${selected.id}`, () =>
                        adminSetVerified(selected.id, !selected.verified)
                      )
                    }
                  >
                    {selected.verified ? "Retirer vérif." : "Vérifier"}
                  </Button>
                </div>
                <div className="space-y-2 border-t border-border pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Abonnements
                  </p>
                  {userSubs.length === 0 && (
                    <p className="text-xs text-muted-foreground">Aucun</p>
                  )}
                  {userSubs.map((s) => (
                    <p key={s.id} className="text-xs">
                      {planLabel(s.plan)} · {s.status}
                      {s.endsAt
                        ? ` · fin ${new Date(s.endsAt).toLocaleDateString("fr-FR")}`
                        : ""}
                    </p>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {tab === "photos" && (
        <div className="space-y-3">
          {props.photos.length === 0 && (
            <p className="text-sm text-muted-foreground">Aucune photo en attente.</p>
          )}
          {props.photos.map((ph) => (
            <div
              key={ph.id}
              className="rounded-xl border border-border bg-white p-4 flex items-center justify-between gap-3"
            >
              <a
                href={ph.photo_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-accent underline truncate max-w-md"
              >
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
            <div key={r.id} className="rounded-xl border border-border bg-white p-4 space-y-2">
              <div className="flex justify-between gap-2">
                <p className="text-sm">{r.reason}</p>
                <Badge variant="outline">{r.status || "pending"}</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground font-mono">
                signalé : {r.reported_user_id}
              </p>
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
