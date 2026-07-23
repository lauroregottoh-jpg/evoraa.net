"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { AdminStats } from "@/components/admin/AdminStats";
import { AdminUsersList } from "@/components/admin/AdminUsersList";
import { AdminPhotoQueue } from "@/components/admin/AdminPhotoQueue";
import { AdminReports } from "@/components/admin/AdminReports";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { AdminRevenue } from "@/components/admin/AdminRevenue";
import { Badge } from "@/components/ui/badge";
import { Crown, BarChart3, Users, Image as ImageIcon, ShieldAlert, Settings, DollarSign, ShieldCheck } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = React.useState<"stats" | "revenue" | "users" | "photos" | "reports" | "settings">("stats");

  return (
    <MainLayout maxWidth="7xl">
      <div className="space-y-8 py-6 font-sans">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-primary text-accent font-serif font-bold text-xl">👑</span>
              <h1 className="text-3xl font-serif font-bold text-foreground">
                Quartier Général & Modération (`/admin`)
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Console de pilotage de la plateforme KELIA : abonnements 2500/5000 F, modération des photos, surveillance de la Charte et gestion des comptes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-0 px-3 py-1 text-xs flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Sécurité RLS Active
            </Badge>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border/40 scrollbar-none">
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "stats"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-secondary/60 text-muted-foreground"
            }`}
          >
            <BarChart3 className="h-4 w-4 text-accent" />
            <span>📊 Statistiques & Santé</span>
          </button>

          <button
            onClick={() => setActiveTab("revenue")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "revenue"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-secondary/60 text-muted-foreground"
            }`}
          >
            <DollarSign className="h-4 w-4 text-emerald-500" />
            <span>💰 Abonnements & Revenus</span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "users"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-secondary/60 text-muted-foreground"
            }`}
          >
            <Users className="h-4 w-4 text-accent" />
            <span>👥 Annuaire & Audit EVA</span>
          </button>

          <button
            onClick={() => setActiveTab("photos")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "photos"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-secondary/60 text-muted-foreground"
            }`}
          >
            <ImageIcon className="h-4 w-4 text-amber-500" />
            <span>🖼️ File Photos (14)</span>
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "reports"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-secondary/60 text-muted-foreground"
            }`}
          >
            <ShieldAlert className="h-4 w-4 text-destructive" />
            <span>🚨 Signalements (1)</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "settings"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-secondary/60 text-muted-foreground"
            }`}
          >
            <Settings className="h-4 w-4 text-accent" />
            <span>⚙️ Paramètres de Plateforme</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-2">
          {activeTab === "stats" && <AdminStats />}
          {activeTab === "revenue" && <AdminRevenue />}
          {activeTab === "users" && <AdminUsersList />}
          {activeTab === "photos" && <AdminPhotoQueue />}
          {activeTab === "reports" && <AdminReports />}
          {activeTab === "settings" && <AdminSettings />}
        </div>

      </div>
    </MainLayout>
  );
}
