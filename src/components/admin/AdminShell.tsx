"use client"

import * as React from "react"
import Link from "next/link"
import {
  BarChart3,
  Users,
  Image as ImageIcon,
  ShieldAlert,
  DollarSign,
  TrendingUp,
  MessageCircle,
  Crown,
  Settings,
  Wrench,
  GraduationCap,
  Search,
  LogOut,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react"
import { cn } from "@/utils/cn"

export type AdminNavId =
  | "overview"
  | "members"
  | "photos"
  | "reports"
  | "subs"
  | "finance"
  | "retention"
  | "conversations"
  | "academy"
  | "settings"
  | "system"

export function buildAdminNav(badges: {
  photos: number
  reports: number
  renewals: number
}): { id: AdminNavId; label: string; icon: React.ElementType; badge?: number }[] {
  return [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "members", label: "Membres", icon: Users },
    { id: "photos", label: "Photos", icon: ImageIcon, badge: badges.photos || undefined },
    { id: "reports", label: "Signalements", icon: ShieldAlert, badge: badges.reports || undefined },
    { id: "subs", label: "Abonnements", icon: Crown },
    { id: "finance", label: "Finance", icon: DollarSign },
    { id: "retention", label: "Rétention", icon: TrendingUp, badge: badges.renewals || undefined },
    { id: "conversations", label: "Conversations", icon: MessageCircle },
    { id: "academy", label: "Académie", icon: GraduationCap },
    { id: "settings", label: "Paramètres", icon: Settings },
    { id: "system", label: "Système", icon: Wrench },
  ]
}

export function AdminShell({
  active,
  onNavigate,
  badges,
  viewerRole,
  search,
  onSearch,
  children,
}: {
  active: AdminNavId
  onNavigate: (id: AdminNavId) => void
  badges: { photos: number; reports: number; renewals: number }
  viewerRole: string | null
  search: string
  onSearch: (v: string) => void
  children: React.ReactNode
}) {
  const nav = buildAdminNav(badges)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const Sidebar = (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="px-5 py-5 border-b border-border">
        <p className="font-serif text-xl font-bold text-primary tracking-tight">KELIAA</p>
        <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
          <ShieldCheck className="h-3 w-3 text-emerald-600" /> Admin · {viewerRole || "—"}
        </p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
          Principal
        </p>
        {nav.slice(0, 9).map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onNavigate(item.id)
                setMobileOpen(false)
              }}
              className={cn(
                "w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span
                  className={cn(
                    "text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center",
                    isActive ? "bg-primary-foreground/20" : "bg-accent/20 text-accent-foreground"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
        <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-4 mb-2">
          Ops
        </p>
        {nav.slice(9).map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onNavigate(item.id)
                setMobileOpen(false)
              }}
              className={cn(
                "w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          )
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary"
        >
          <LogOut className="h-4 w-4" /> Espace membre
        </Link>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen bg-[#F4F6F5] text-foreground flex">
      <div className="hidden lg:block sticky top-0 h-screen">{Sidebar}</div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Fermer"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 z-10">{Sidebar}</div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            type="button"
            className="lg:hidden rounded-xl border border-border px-3 py-2 text-xs font-semibold"
            onClick={() => setMobileOpen(true)}
          >
            Menu
          </button>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Rechercher un membre, ville…"
              className="w-full h-10 rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <BarChart3 className="h-4 w-4 text-primary" />
            Console live
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  )
}

export function KpiCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string
  value: string | number
  hint?: string
  tone?: "default" | "green" | "gold" | "red"
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={cn(
          "font-serif text-3xl font-bold mt-1",
          tone === "green" && "text-emerald-700",
          tone === "gold" && "text-accent-foreground",
          tone === "red" && "text-red-600"
        )}
      >
        {value}
      </p>
      {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  )
}

export function ActivityItem({
  title,
  meta,
  badge,
  badgeTone = "gray",
}: {
  title: string
  meta: string
  badge: string
  badgeTone?: "blue" | "red" | "green" | "gold" | "gray"
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-3 border-b border-border/60 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{title}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{meta}</p>
      </div>
      <span
        className={cn(
          "shrink-0 text-[10px] font-bold uppercase tracking-wide rounded-full px-2 py-0.5",
          badgeTone === "blue" && "bg-sky-100 text-sky-800",
          badgeTone === "red" && "bg-red-100 text-red-700",
          badgeTone === "green" && "bg-emerald-100 text-emerald-800",
          badgeTone === "gold" && "bg-accent/20 text-accent-foreground",
          badgeTone === "gray" && "bg-secondary text-muted-foreground"
        )}
      >
        {badge}
      </span>
    </div>
  )
}
