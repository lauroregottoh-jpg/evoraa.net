"use client";

import * as React from "react";
import { Search, Shield, Ban, CheckCircle2, UserCheck, Filter, Award, MessageSquare, CreditCard, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UserRow {
  id: string;
  name: string;
  email: string;
  city: string;
  completion: number;
  role: "admin" | "moderator" | "member";
  status: "active" | "pending_review" | "banned";
  verified: boolean;
  endorsement: boolean;
  plan: "Or (5000 F)" | "Base (2500 F)" | "Gratuit";
  lastEvaTopic: string;
}

const INITIAL_USERS: UserRow[] = [
  {
    id: "1",
    name: "Laure Regottoh",
    email: "laure.regottoh@kellia.org",
    city: "Lyon",
    completion: 100,
    role: "member",
    status: "active",
    verified: true,
    endorsement: true,
    plan: "Or (5000 F)",
    lastEvaTopic: "Discerner la paix de Dieu avant le mariage",
  },
  {
    id: "2",
    name: "Alexandre Dumas",
    email: "alexandre.dumas@kellia.org",
    city: "Lyon",
    completion: 94,
    role: "member",
    status: "active",
    verified: true,
    endorsement: false,
    plan: "Or (5000 F)",
    lastEvaTopic: "Comment concilier vocation professionnelle et vie conjugale ?",
  },
  {
    id: "3",
    name: "Thomas Bernard",
    email: "thomas.bernard@kellia.org",
    city: "Grenoble",
    completion: 89,
    role: "member",
    status: "active",
    verified: true,
    endorsement: true,
    plan: "Base (2500 F)",
    lastEvaTopic: "Les 4 piliers de la charte de respect",
  },
  {
    id: "4",
    name: "Suspect Spam",
    email: "suspect.spam@kellia.org",
    city: "Marseille",
    completion: 45,
    role: "member",
    status: "pending_review",
    verified: false,
    endorsement: false,
    plan: "Gratuit",
    lastEvaTopic: "Tentative d'envoi de numéro WhatsApp dans le chat",
  },
  {
    id: "5",
    name: "Modération EVA",
    email: "admin@kellia.org",
    city: "Paris",
    completion: 100,
    role: "admin",
    status: "active",
    verified: true,
    endorsement: true,
    plan: "Or (5000 F)",
    lastEvaTopic: "Supervision globale de la plateforme",
  },
];

export function AdminUsersList() {
  const [users, setUsers] = React.useState<UserRow[]>(INITIAL_USERS);
  const [search, setSearch] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [selectedAuditUser, setSelectedAuditUser] = React.useState<UserRow | null>(null);

  const handleToggleBan = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        return {
          ...u,
          status: u.status === "banned" ? "active" : "banned",
        };
      })
    );
  };

  const handleVerify = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        return {
          ...u,
          verified: true,
          status: "active",
        };
      })
    );
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.city.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filterStatus === "all") return true;
    return u.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs">
        <CardHeader className="border-b border-border/40 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-accent" /> Annuaire Complet & Audit des Activités (`profiles`)
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Consultez les membres, leurs abonnements payants et auditez leurs échanges avec l&apos;IA EVA.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher nom, email, ville..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs rounded-xl bg-background"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-9 px-3 text-xs rounded-xl bg-background border border-border/80 text-foreground"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs (Vérifiés)</option>
              <option value="pending_review">En attente (Modération)</option>
              <option value="banned">Suspendus / Bannis</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-secondary/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/40">
              <tr>
                <th className="py-3 px-4 font-semibold">Membre</th>
                <th className="py-3 px-4 font-semibold">Abonnement</th>
                <th className="py-3 px-4 font-semibold">Profil & Caution</th>
                <th className="py-3 px-4 font-semibold">Dernier Échange EVA</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="py-3.5 px-4 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground text-sm">{user.name}</span>
                      {user.role === "admin" && (
                        <Badge className="bg-primary text-primary-foreground text-[9px] px-1.5 py-0">Admin</Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">{user.email}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant="outline" className={`text-[10px] font-medium ${user.plan.includes("Or") ? "border-accent text-accent bg-accent/5" : user.plan.includes("Base") ? "border-primary/40 text-primary dark:text-accent bg-primary/5" : "border-border text-muted-foreground"}`}>
                      <CreditCard className="h-3 w-3 mr-1 inline" /> {user.plan}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 bg-secondary h-1.5 rounded-full overflow-hidden">
                        <div className="bg-accent h-full rounded-full" style={{ width: `${user.completion}%` }} />
                      </div>
                      <span className="text-[11px] font-semibold">{user.completion}%</span>
                    </div>
                    {user.endorsement && (
                      <Badge variant="outline" className="text-[9px] border-emerald-500/40 text-emerald-600 bg-emerald-500/5 px-1.5 py-0 flex items-center gap-1 w-fit">
                        <Award className="h-2.5 w-2.5" /> Caution ⭐⭐⭐
                      </Badge>
                    )}
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="truncate text-foreground/90 italic font-serif text-[11px]">
                      « {user.lastEvaTopic} »
                    </p>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <Button
                      onClick={() => setSelectedAuditUser(user)}
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-primary hover:bg-primary/10 border-primary/30 text-[11px]"
                      title="Auditer les conversations avec l'IA EVA"
                    >
                      <MessageSquare className="h-3.5 w-3.5 mr-1" /> Audit EVA
                    </Button>

                    {user.status === "pending_review" && (
                      <Button
                        onClick={() => handleVerify(user.id)}
                        size="sm"
                        variant="outline"
                        className="h-7 px-2.5 text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/30 text-[11px]"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Valider
                      </Button>
                    )}

                    {user.role !== "admin" && (
                      <Button
                        onClick={() => handleToggleBan(user.id)}
                        size="sm"
                        variant="outline"
                        className={`h-7 px-2 text-[11px] ${
                          user.status === "banned"
                            ? "text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/30"
                            : "text-destructive hover:bg-destructive/10 border-destructive/30"
                        }`}
                      >
                        <Ban className="h-3.5 w-3.5 mr-1" />
                        <span>{user.status === "banned" ? "Réactiver" : "Bannir"}</span>
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Audit Modal for Conversations with EVA */}
      {selectedAuditUser && (
        <Card className="rounded-2xl border-2 border-accent/40 bg-background p-6 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-accent/15 text-accent">💬</span>
              <div>
                <h4 className="font-serif font-bold text-lg text-foreground">
                  Audit d&apos;activité & de dialogue EVA : {selectedAuditUser.name}
                </h4>
                <p className="text-xs text-muted-foreground">{selectedAuditUser.email} • Formule {selectedAuditUser.plan}</p>
              </div>
            </div>
            <Button onClick={() => setSelectedAuditUser(null)} variant="ghost" size="sm" className="text-xs">
              Fermer
            </Button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-secondary/40 border border-border/40">
              <p className="font-semibold text-foreground flex items-center gap-1.5 mb-1">
                <MessageSquare className="h-3.5 w-3.5 text-accent" /> Dernier thème abordé avec l&apos;IA EVA :
              </p>
              <p className="font-serif italic text-foreground/90">« {selectedAuditUser.lastEvaTopic} »</p>
            </div>

            <div className="p-3.5 rounded-xl bg-secondary/40 border border-border/40">
              <p className="font-semibold text-foreground mb-1">Résumé spirituel de l&apos;accompagnatrice EVA :</p>
              <p className="text-muted-foreground leading-relaxed">
                Ce membre démontre une excellente régularité de prière et un grand sérieux conjugal. Ses questions se concentrent sur la construction d&apos;un foyer équilibré et le respect des valeurs chrétiennes de notre charte.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
