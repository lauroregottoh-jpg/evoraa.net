"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  adminGrantAlliance,
  adminModeratePhoto,
  adminPingServiceRole,
  adminResolveReport,
  adminSetRole,
  adminSetVerified,
  adminUpdateModerationStatus,
  adminUpdatePlatformSetting,
  type AdminOpsFlags,
  type AdminRetention,
  type PlatformSettingRow,
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
  Settings,
  Wrench,
  Code2,
} from "lucide-react";
import { cn } from "@/utils/cn";

type Zone = "utilisateur" | "optimiseur" | "developpeur";
type UserTab = "users" | "photos" | "reports";
type OptTab = "stats" | "retention" | "revenue" | "subs";
type DevTab = "settings" | "conversations" | "systeme";

type Props = {
  stats: {
    users: number;
    activeSubscriptions: number;
    openReports: number;
    pendingPhotos: number;
    revenueXof: number;
  };
  retention: AdminRetention;
  ops: AdminOpsFlags;
  viewerRole: string | null;
  settings: PlatformSettingRow[];
  users: Array<{
    id: string;
    userId: string;
    name: string;
    city: string;
    gender: string;
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
  conversations: Array<{
    id: string;
    matchId: string;
    createdAt: string | null;
  }>;
};

function planLabel(plan: string) {
  if (plan === "premium_plus") return "Alliance";
  if (plan === "premium") return "Essentiel (legacy)";
  return plan;
}

function settingBool(settings: PlatformSettingRow[], key: string, fallback = false) {
  const row = settings.find((s) => s.key === key);
  if (!row) return fallback;
  return row.value === true || row.value === "true";
}

function settingNum(settings: PlatformSettingRow[], key: string, fallback: number) {
  const row = settings.find((s) => s.key === key);
  if (row == null || row.value == null) return fallback;
  const n = Number(row.value);
  return Number.isFinite(n) ? n : fallback;
}

export function AdminConsole(props: Props) {
  const isFullAdmin = props.viewerRole === "admin";
  const [zone, setZone] = React.useState<Zone>("utilisateur");
  const [userTab, setUserTab] = React.useState<UserTab>("users");
  const [optTab, setOptTab] = React.useState<OptTab>("stats");
  const [devTab, setDevTab] = React.useState<DevTab>("settings");
  const [search, setSearch] = React.useState("");
  const [busy, setBusy] = React.useState("");
  const [selectedUser, setSelectedUser] = React.useState<string | null>(null);
  const [msg, setMsg] = React.useState<string | null>(null);
  const [threshold, setThreshold] = React.useState(() =>
    settingNum(props.settings, "min_compatibility_threshold", 85)
  );
  const [maintenance, setMaintenance] = React.useState(() =>
    settingBool(props.settings, "maintenance_mode", false)
  );
  const [blur, setBlur] = React.useState(() =>
    settingBool(props.settings, "default_photo_blur", true)
  );
  const [charter, setCharter] = React.useState(() =>
    settingBool(props.settings, "require_charter", true)
  );

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

  const run = async (key: string, fn: () => Promise<{ error?: string; success?: boolean }>) => {
    setBusy(key);
    setMsg(null);
    try {
      const res = await fn();
      if (res.error) setMsg(res.error);
      else setMsg("Enregistré.");
    } finally {
      setBusy("");
    }
  };

  const zones: { id: Zone; label: string; hint: string; icon: React.ReactNode }[] = [
    {
      id: "utilisateur",
      label: "Utilisateur",
      hint: "Membres, photos, signalements",
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: "optimiseur",
      label: "Optimiseur",
      hint: "Croissance, finance, Alliance",
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      id: "developpeur",
      label: "Développeur",
      hint: "Paramètres, convos, système",
      icon: <Code2 className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-6 py-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Administration KELIAA
          </h1>
          <p className="text-sm text-muted-foreground">
            3 espaces : Utilisateur · Optimiseur · Développeur. Rôle :{" "}
            <span className="font-semibold text-foreground">{props.viewerRole || "—"}</span>
          </p>
        </div>
        <Badge className="bg-emerald-500/15 text-emerald-700 border-0 px-3 py-1 text-xs flex items-center gap-1.5 w-fit">
          <ShieldCheck className="h-3.5 w-3.5" /> Accès sécurisé
        </Badge>
      </div>

      {msg && (
        <p className="text-xs rounded-xl border border-border bg-secondary/40 px-3 py-2">{msg}</p>
      )}

      <div className="grid sm:grid-cols-3 gap-3">
        {zones.map((z) => (
          <button
            key={z.id}
            type="button"
            onClick={() => setZone(z.id)}
            className={cn(
              "text-left rounded-2xl border p-4 transition-colors",
              zone === z.id
                ? "border-primary bg-primary/5"
                : "border-border bg-white hover:border-primary/30"
            )}
          >
            <p className="text-sm font-semibold flex items-center gap-2">
              {z.icon} {z.label}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{z.hint}</p>
          </button>
        ))}
      </div>

      {zone === "utilisateur" && (
        <>
          <SubTabs
            tabs={[
              { id: "users", label: "Membres", icon: <Users className="h-3.5 w-3.5" /> },
              { id: "photos", label: "Photos", icon: <ImageIcon className="h-3.5 w-3.5" /> },
              { id: "reports", label: "Signalements", icon: <ShieldAlert className="h-3.5 w-3.5" /> },
            ]}
            value={userTab}
            onChange={(id) => setUserTab(id as UserTab)}
          />

          {userTab === "users" && (
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
                        {u.gender === "M" ? "H" : u.gender === "F" ? "F" : "?"} · {u.city} ·{" "}
                        {u.completion}% · {u.status}
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
                        Suspendre
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
                      {isFullAdmin && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy === `g-${selected.id}`}
                          onClick={() =>
                            run(`g-${selected.id}`, () =>
                              adminGrantAlliance(selected.userId, 30)
                            )
                          }
                        >
                          +30j Alliance
                        </Button>
                      )}
                    </div>
                    {isFullAdmin && (
                      <div className="space-y-2 border-t border-border pt-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Rôle
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(["member", "moderator", "admin"] as const).map((r) => (
                            <Button
                              key={r}
                              size="sm"
                              variant={selected.role === r ? "default" : "outline"}
                              disabled={busy === `role-${selected.id}`}
                              onClick={() =>
                                run(`role-${selected.id}`, () => adminSetRole(selected.id, r))
                              }
                            >
                              {r}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
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

          {userTab === "photos" && (
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

          {userTab === "reports" && (
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
        </>
      )}

      {zone === "optimiseur" && (
        <>
          <SubTabs
            tabs={[
              { id: "stats", label: "Vue d'ensemble", icon: <BarChart3 className="h-3.5 w-3.5" /> },
              { id: "retention", label: "Rétention", icon: <TrendingUp className="h-3.5 w-3.5" /> },
              { id: "revenue", label: "Finance", icon: <DollarSign className="h-3.5 w-3.5" /> },
              { id: "subs", label: "Abonnements", icon: <Crown className="h-3.5 w-3.5" /> },
            ]}
            value={optTab}
            onChange={(id) => setOptTab(id as OptTab)}
          />

          {optTab === "stats" && (
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
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-border bg-white p-5">
                  <p className="text-xs text-muted-foreground">Hommes / Femmes</p>
                  <p className="font-serif text-3xl font-bold mt-1">
                    {props.retention.menCount} / {props.retention.womenCount}
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
                <div className="rounded-2xl border border-border bg-white p-5">
                  <p className="text-xs text-muted-foreground">Matches 30j</p>
                  <p className="font-serif text-3xl font-bold mt-1">
                    {props.retention.matches30d}
                  </p>
                </div>
                <div className="rounded-2xl border border-accent/40 bg-accent/5 p-5">
                  <p className="text-xs text-muted-foreground">Renouvellements J-7</p>
                  <p className="font-serif text-3xl font-bold mt-1 text-primary">
                    {props.retention.renewalsDue7d}
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-border bg-white p-5 sm:col-span-1">
                  <p className="text-xs text-muted-foreground">Revenus completed</p>
                  <p className="font-serif text-3xl font-bold mt-1">
                    {props.stats.revenueXof.toLocaleString("fr-FR")} FCFA
                  </p>
                </div>
                <div className="rounded-2xl border border-accent/40 bg-accent/5 p-5">
                  <p className="text-xs text-muted-foreground">Alliance actives</p>
                  <p className="font-serif text-3xl font-bold mt-1 text-primary">
                    {props.retention.activeAlliance}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-white p-5">
                  <p className="text-xs text-muted-foreground">Conversion payante</p>
                  <p className="font-serif text-3xl font-bold mt-1">
                    {props.retention.conversionPaidPct}%
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-secondary/40 p-5 text-sm text-muted-foreground space-y-2">
                <p className="font-semibold text-foreground">Actions soft launch</p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>
                    Équilibre H/F : visez un pool mixte (sinon matching vide pour un côté).
                  </li>
                  <li>Photos en attente → zone Utilisateur → Photos (approuver vite).</li>
                  <li>
                    Renouvellements J-7 : contacter / rappeler via billing avant expiration.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {optTab === "retention" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                ["Nouveaux membres (30j)", props.retention.newMembers30d],
                ["Profils ≥ 70%", props.retention.profilesComplete70],
                ["5 tests (échantillon)", props.retention.assessmentsDoneAll],
                ["Estim. Free actifs", props.retention.activeFreeEstimate],
                ["Expirés (ends_at 30j)", props.retention.expiredSubs30d],
                ["Annulés (créés 30j)", props.retention.cancelledSubs30d],
                ["Legacy 2 500 actives", props.retention.activeLegacyPremium],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-2xl border border-border bg-white p-5">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-serif text-3xl font-bold mt-1">{value}</p>
                </div>
              ))}
            </div>
          )}

          {optTab === "revenue" && (
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
                    </div>
                    <Badge variant="outline">{p.status || "—"}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {optTab === "subs" && (
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
        </>
      )}

      {zone === "developpeur" && (
        <>
          <SubTabs
            tabs={[
              { id: "settings", label: "Paramètres", icon: <Settings className="h-3.5 w-3.5" /> },
              {
                id: "conversations",
                label: "Conversations",
                icon: <MessageCircle className="h-3.5 w-3.5" />,
              },
              { id: "systeme", label: "Système", icon: <Wrench className="h-3.5 w-3.5" /> },
            ]}
            value={devTab}
            onChange={(id) => setDevTab(id as DevTab)}
          />

          {devTab === "settings" && (
            <div className="space-y-4">
              {!isFullAdmin && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                  Lecture seule pour les modérateurs. Seul un admin peut modifier.
                </p>
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                <SettingCard
                  title="Seuil compatibilité EVA"
                  desc="Score minimal pour proposer un profil."
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={70}
                      max={95}
                      value={threshold}
                      disabled={!isFullAdmin}
                      onChange={(e) => setThreshold(Number(e.target.value))}
                      className="flex-1 accent-primary"
                    />
                    <span className="font-serif font-bold w-10 text-right">{threshold}%</span>
                  </div>
                  {isFullAdmin && (
                    <Button
                      size="sm"
                      className="mt-3"
                      disabled={busy === "thr"}
                      onClick={() =>
                        run("thr", () =>
                          adminUpdatePlatformSetting("min_compatibility_threshold", threshold)
                        )
                      }
                    >
                      Enregistrer
                    </Button>
                  )}
                </SettingCard>

                <ToggleCard
                  title="Mode maintenance"
                  desc="Pause globale (à brancher côté middleware ensuite)."
                  value={maintenance}
                  disabled={!isFullAdmin}
                  onToggle={() => {
                    const next = !maintenance;
                    setMaintenance(next);
                    if (isFullAdmin) {
                      void run("maint", () =>
                        adminUpdatePlatformSetting("maintenance_mode", next)
                      );
                    }
                  }}
                />

                <ToggleCard
                  title="Floutage photos par défaut"
                  desc="Respect / pudeur V1."
                  value={blur}
                  disabled={!isFullAdmin}
                  onToggle={() => {
                    const next = !blur;
                    setBlur(next);
                    if (isFullAdmin) {
                      void run("blur", () =>
                        adminUpdatePlatformSetting("default_photo_blur", next)
                      );
                    }
                  }}
                />

                <ToggleCard
                  title="Charte obligatoire"
                  desc="Exiger la signature des piliers."
                  value={charter}
                  disabled={!isFullAdmin}
                  onToggle={() => {
                    const next = !charter;
                    setCharter(next);
                    if (isFullAdmin) {
                      void run("charter", () =>
                        adminUpdatePlatformSetting("require_charter", next)
                      );
                    }
                  }}
                />
              </div>
            </div>
          )}

          {devTab === "conversations" && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground mb-2">
                Audit ops — dernières conversations (pas le contenu message ici).
              </p>
              {props.conversations.length === 0 && (
                <p className="text-sm text-muted-foreground">Aucune conversation.</p>
              )}
              {props.conversations.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-border bg-white p-4 text-xs font-mono space-y-1"
                >
                  <p>convo {c.id}</p>
                  <p className="text-muted-foreground">match {c.matchId}</p>
                  <p className="text-muted-foreground">
                    {c.createdAt ? new Date(c.createdAt).toLocaleString("fr-FR") : "—"}
                  </p>
                </div>
              ))}
            </div>
          )}

          {devTab === "systeme" && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <FlagRow label="URL app" value={props.ops.appUrl || "—"} ok={Boolean(props.ops.appUrl)} />
                <FlagRow
                  label="Paiements démo"
                  value={props.ops.paymentsDemoMode ? "ON (pas de vrai débit)" : "OFF (live)"}
                  ok={!props.ops.paymentsDemoMode}
                />
                <FlagRow
                  label="CinetPay configuré"
                  value={props.ops.hasCinetPay ? "Oui" : "Non"}
                  ok={props.ops.hasCinetPay}
                />
                <FlagRow
                  label="Resend (emails)"
                  value={props.ops.hasResend ? "Oui" : "Non"}
                  ok={props.ops.hasResend}
                />
                <FlagRow
                  label="CRON_SECRET"
                  value={props.ops.hasCronSecret ? "Oui" : "Non"}
                  ok={props.ops.hasCronSecret}
                />
                <FlagRow
                  label="SERVICE_ROLE"
                  value={props.ops.hasServiceRole ? "Oui" : "Non"}
                  ok={props.ops.hasServiceRole}
                />
              </div>
              {isFullAdmin && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busy === "ping"}
                  onClick={() =>
                    run("ping", async () => {
                      const r = await adminPingServiceRole();
                      if (!r.ok) return { error: r.error || "Échec" };
                      return { success: true };
                    })
                  }
                >
                  Tester service role
                </Button>
              )}
              <div className="rounded-2xl border border-border bg-secondary/40 p-4 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Liens utiles</p>
                <p>
                  Admin :{" "}
                  <a className="underline" href="https://evoraa-net.vercel.app/admin">
                    /admin
                  </a>
                </p>
                <p>
                  Santé config :{" "}
                  <a className="underline" href="/api/health/config">
                    /api/health/config
                  </a>
                </p>
                <p>
                  Migration à appliquer dans Supabase :{" "}
                  <code>20240101000012_admin_ops_policies.sql</code>
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SubTabs({
  tabs,
  value,
  onChange,
}: {
  tabs: { id: string; label: string; icon: React.ReactNode }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border/40">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors",
            value === t.id
              ? "bg-primary text-primary-foreground"
              : "hover:bg-secondary/60 text-muted-foreground"
          )}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </div>
  );
}

function SettingCard({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 space-y-2">
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
      {children}
    </div>
  );
}

function ToggleCard({
  title,
  desc,
  value,
  disabled,
  onToggle,
}: {
  title: string;
  desc: string;
  value: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        className={cn(
          "h-8 px-3 rounded-lg text-xs font-semibold shrink-0",
          value ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
          disabled && "opacity-50"
        )}
      >
        {value ? "ON" : "OFF"}
      </button>
    </div>
  );
}

function FlagRow({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4 flex justify-between gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-medium", ok ? "text-emerald-700" : "text-amber-700")}>{value}</span>
    </div>
  );
}
