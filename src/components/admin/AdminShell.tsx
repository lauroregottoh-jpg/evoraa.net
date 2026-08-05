"use client"

import * as React from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  BarChart3,
  Users,
  ShieldAlert,
  Crown,
  MessageCircle,
  GraduationCap,
  Sparkles,
  Megaphone,
  Settings,
  Search,
  LogOut,
  ShieldCheck,
  Bell,
  UserCircle2,
  Home,
  UsersRound,
  MessageSquareHeart,
} from "lucide-react"
import { cn } from "@/utils/cn"
import { logoutAction } from "@/app/actions/auth"

export type AdminNavId =
  | "dashboard"
  | "analytics"
  | "members"
  | "profiles"
  | "moderation"
  | "feedback"
  | "alliance"
  | "matching"
  | "academy"
  | "eva"
  | "marketing"
  | "team"
  | "settings"

type NavItem = {
  id: AdminNavId
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
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
  badges: {
    moderation: number
    renewals: number
    pendingProfiles?: number
    feedback?: number
  }
  viewerRole: string | null
  search: string
  onSearch: (v: string) => void
  children: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const menuMain: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "analytics", label: "Analytique", icon: BarChart3 },
    {
      id: "members",
      label: "Utilisateurs",
      icon: Users,
      badge: badges.pendingProfiles || undefined,
    },
    {
      id: "profiles",
      label: "Profils & reco",
      icon: UserCircle2,
    },
    {
      id: "moderation",
      label: "Modération",
      icon: ShieldAlert,
      badge: badges.moderation || undefined,
    },
    {
      id: "feedback",
      label: "Avis & plaintes",
      icon: MessageSquareHeart,
      badge: badges.feedback || undefined,
    },
  ]

  const menuOps: NavItem[] = [
    {
      id: "alliance",
      label: "Alliance & paiements",
      icon: Crown,
      badge: badges.renewals || undefined,
    },
    { id: "matching", label: "Matching Intelligence", icon: MessageCircle },
    { id: "academy", label: "Académie", icon: GraduationCap },
    { id: "eva", label: "Coach EVA", icon: Sparkles },
    { id: "marketing", label: "Contenu & marketing", icon: Megaphone },
  ]

  const menuGeneral: NavItem[] = [
    { id: "team", label: "Équipe & rôles", icon: UsersRound },
    { id: "settings", label: "Paramètres", icon: Settings },
  ]

  const NavGroup = ({ title, items }: { title: string; items: NavItem[] }) => (
    <div className="mb-4">
      <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40">
        {title}
      </p>
      <div className="space-y-0.5">
        {items.map((item) => {
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
                  ? "bg-[#C4A35A] text-[#0F1F1A] shadow-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left truncate">{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span
                  className={cn(
                    "text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center",
                    isActive
                      ? "bg-[#0F1F1A]/15 text-[#0F1F1A]"
                      : "bg-red-500 text-white"
                  )}
                >
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )

  const Sidebar = (
    <aside className="flex h-full w-[280px] flex-col border-r border-white/10 bg-[#0F1F1A] text-white">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-[#C4A35A] text-[#0F1F1A] flex items-center justify-center font-serif font-bold">
            A
          </div>
          <div>
            <p className="font-serif text-lg font-bold leading-none tracking-wide">
              CONSOLE OPS
            </p>
            <p className="text-[11px] text-white/60 mt-1 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              Admin · {viewerRole || "—"} · pas l&apos;espace membre
            </p>
          </div>
        </div>
        <p className="mt-3 rounded-lg bg-white/5 px-2.5 py-1.5 text-[10px] font-mono text-[#C4A35A]">
          /ops-keliaa-hx7
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <NavGroup title="Menu" items={menuMain} />
        <NavGroup title="Ops" items={menuOps} />
        <NavGroup title="Général" items={menuGeneral} />
      </nav>

      <div className="p-3 border-t border-white/10 space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/70 hover:bg-white/10"
        >
          <Home className="h-4 w-4" /> Quitter → espace membre
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-red-300 hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" /> Se déconnecter
          </button>
        </form>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen bg-[#E8EDE9] text-foreground flex">
      <div className="hidden lg:block sticky top-0 h-screen shrink-0">{Sidebar}</div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Fermer"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 z-10 shadow-xl">{Sidebar}</div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="bg-[#0F1F1A] text-white px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold tracking-wide">
            Bienvenue Admin — console opérationnelle KELIAA
          </p>
          <span className="hidden sm:inline text-[11px] text-white/60 font-mono">
            ≠ espace membre
          </span>
        </div>
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            type="button"
            className="lg:hidden rounded-xl border border-border px-3 py-2 text-xs font-semibold"
            onClick={() => setMobileOpen(true)}
          >
            Menu ops
          </button>
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Rechercher un membre, ville, user id…"
              className="w-full h-11 rounded-full border border-border bg-background pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#C4A35A]/40"
            />
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="relative h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground">
              <Bell className="h-4 w-4" />
              {(badges.moderation > 0 || badges.renewals > 0) && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-accent text-[9px] font-bold text-accent-foreground flex items-center justify-center">
                  {badges.moderation + badges.renewals}
                </span>
              )}
            </span>
            <div className="rounded-full border border-[#0F1F1A]/20 bg-[#0F1F1A] text-white pl-1 pr-2 py-1 flex items-center gap-2">
              <span className="h-8 w-8 rounded-full bg-[#C4A35A] text-[#0F1F1A] text-xs font-bold flex items-center justify-center">
                A
              </span>
              <div className="hidden md:block leading-tight pr-1">
                <p className="text-xs font-semibold">Admin KELIAA</p>
                <p className="text-[10px] text-white/60 capitalize">
                  {viewerRole || "admin"}
                </p>
              </div>
              <form action={logoutAction} className="hidden sm:block">
                <button
                  type="submit"
                  title="Se déconnecter"
                  className="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-red-300 hover:bg-white/10"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export function KpiCard({
  label,
  value,
  hint,
  trend,
  tone = "default",
}: {
  label: string
  value: string | number
  hint?: string
  trend?: string
  tone?: "default" | "green" | "gold" | "red"
}) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        {trend && (
          <span
            className={cn(
              "text-[10px] font-bold rounded-full px-2 py-0.5",
              trend.startsWith("-")
                ? "bg-red-100 text-red-700"
                : "bg-emerald-100 text-emerald-700"
            )}
          >
            {trend}
          </span>
        )}
      </div>
      <p
        className={cn(
          "font-serif text-3xl font-bold mt-2 tracking-tight",
          tone === "green" && "text-emerald-700",
          tone === "gold" && "text-[#8B6914]",
          tone === "red" && "text-red-600"
        )}
      >
        {value}
      </p>
      {hint && <p className="text-[11px] text-muted-foreground mt-1.5">{hint}</p>}
    </div>
  )
}

export function SectionCard({
  title,
  action,
  children,
  className,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-5 shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="font-semibold text-base">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

export function FunnelBar({
  label,
  value,
  max,
}: {
  label: string
  value: number
  max: number
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">
          {value} · {pct}%
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${Math.max(pct, value > 0 ? 3 : 0)}%` }}
        />
      </div>
    </div>
  )
}
