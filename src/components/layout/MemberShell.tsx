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
  Settings,
  MoreHorizontal,
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
] as const;

const BOTTOM_NAV = [
  { href: "/dashboard", label: "Accueil", icon: LayoutGrid },
  { href: "/compatibility", label: "Découvrir", icon: Compass },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/assessments", label: "Tests", icon: ClipboardList },
  { href: "/more", label: "Plus", icon: MoreHorizontal, isMore: true },
] as const;

const MORE_LINKS = [
  { href: "/academie-mariage", label: "Académie", icon: GraduationCap },
  { href: "/billing", label: "Alliance", icon: Crown },
  { href: "/notifications", label: "Alertes", icon: Bell },
  { href: "/profile", label: "Profil", icon: User },
  { href: "/help", label: "Aide", icon: HelpCircle },
  { href: "/settings", label: "Paramètres", icon: Settings },
] as const;

type MemberShellProps = {
  children: React.ReactNode;
  firstName?: string;
  planLabel?: string;
  isPaid?: boolean;
  /** Réduit le padding (ex. salle de messages) */
  dense?: boolean;
};

export function MemberShell({
  children,
  firstName,
  planLabel = "Découverte",
  isPaid = false,
  dense = false,
}: MemberShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [moreOpen, setMoreOpen] = React.useState(false);

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === href || pathname.startsWith(`${href}/`);

  const moreActive = MORE_LINKS.some((l) => isActive(l.href));

  React.useEffect(() => {
    setOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg border border-border"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <Link
              href="/dashboard"
              className="font-serif text-2xl font-bold text-primary tracking-tight"
            >
              KELIAA
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-colors",
                    "accent" in item && item.accent && !active && "text-accent",
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

          <div className="flex items-center gap-1.5 sm:gap-2">
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
              href="/help"
              className="hidden md:inline-flex p-2 rounded-full hover:bg-secondary text-muted-foreground"
              aria-label="Aide"
              title="Aide"
            >
              <HelpCircle className="h-4 w-4" />
            </Link>
            <Link
              href="/settings"
              className="hidden md:inline-flex p-2 rounded-full hover:bg-secondary text-muted-foreground"
              aria-label="Paramètres"
              title="Paramètres"
            >
              <Settings className="h-4 w-4" />
            </Link>
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
          <div className="lg:hidden border-t border-border bg-card px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
            {[...NAV, ...MORE_LINKS.filter((l) => !NAV.some((n) => n.href === l.href))].map(
              (item) => {
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
              }
            )}
          </div>
        )}
      </header>

      <main
        className={cn(
          "mx-auto max-w-6xl px-4 sm:px-6",
          dense ? "py-4 sm:py-6" : "py-6 sm:py-8",
          "pb-24 lg:pb-10"
        )}
      >
        {firstName ? <p className="sr-only">Espace de {firstName}</p> : null}
        {children}
      </main>

      {/* Bottom nav — mobile */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 backdrop-blur-md safe-bottom"
        aria-label="Navigation principale"
      >
        <div className="mx-auto max-w-lg grid grid-cols-5 h-16">
          {BOTTOM_NAV.map((item) => {
            const Icon = item.icon;
            if ("isMore" in item && item.isMore) {
              return (
                <button
                  key="more"
                  type="button"
                  onClick={() => setMoreOpen((v) => !v)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold",
                    moreOpen || moreActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  Plus
                </button>
              );
            }
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {moreOpen && (
          <div className="absolute bottom-16 inset-x-0 mx-3 mb-2 rounded-2xl border border-border bg-card p-2 shadow-sm">
            <div className="grid grid-cols-3 gap-1">
              {MORE_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-[11px] font-medium",
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
            </div>
          </div>
        )}
      </nav>

      {process.env.NODE_ENV === "development" && <DevSessionSwitcher />}
    </div>
  );
}
