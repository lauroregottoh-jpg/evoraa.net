"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Compass,
  MessageCircle,
  ClipboardList,
  Crown,
  Bell,
  User,
  HelpCircle,
  Menu,
  X,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { ThemeToggle } from "@/components/evoraa/ThemeToggle";
import { DevSessionSwitcher } from "@/components/dev/DevSessionSwitcher";

const NAV = [
  { href: "/dashboard", label: "Accueil", icon: LayoutGrid },
  { href: "/compatibility", label: "Découvrir", icon: Compass },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/assessments", label: "Tests", icon: ClipboardList },
  { href: "/academie-mariage", label: "Académie", icon: GraduationCap },
  { href: "/billing", label: "Alliance", icon: Crown, accent: true },
];

const SECONDARY = [
  { href: "/notifications", label: "Alertes", icon: Bell },
  { href: "/profile", label: "Profil", icon: User },
  { href: "/help", label: "Aide", icon: HelpCircle },
];

type MemberShellProps = {
  children: React.ReactNode;
  firstName?: string;
  planLabel?: string;
  isPaid?: boolean;
};

export function MemberShell({
  children,
  firstName,
  planLabel = "Découverte",
  isPaid = false,
}: MemberShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg border border-border"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <Link href="/dashboard" className="font-serif text-2xl font-bold text-primary tracking-tight">
              KELIAA
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-colors",
                    item.accent && !active && "text-accent",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <span
              className={cn(
                "hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border",
                isPaid
                  ? "bg-accent/15 text-accent border-accent/30"
                  : "bg-secondary text-muted-foreground border-border"
              )}
            >
              {planLabel}
            </span>
            <Link
              href="/notifications"
              className="p-2 rounded-full hover:bg-secondary text-muted-foreground"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </Link>
            <Link
              href="/profile"
              className="p-2 rounded-full hover:bg-secondary text-muted-foreground"
              aria-label="Profil"
            >
              <User className="h-4 w-4" />
            </Link>
            <ThemeToggle />
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border bg-white px-4 py-3 space-y-1">
            {[...NAV, ...SECONDARY].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-secondary"
            >
              <CreditCard className="h-4 w-4" />
              Paramètres
            </Link>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
        {firstName ? (
          <p className="sr-only">Espace de {firstName}</p>
        ) : null}
        {children}
      </main>

      {process.env.NODE_ENV === "development" && <DevSessionSwitcher />}
    </div>
  );
}
