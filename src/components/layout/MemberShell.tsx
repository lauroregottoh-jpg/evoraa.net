"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
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
  Share2,
  BookHeart,
  LogOut,
  MessageSquareHeart,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { ThemeToggle } from "@/components/evoraa/ThemeToggle";
import { DevSessionSwitcher } from "@/components/dev/DevSessionSwitcher";
import { MemberReminders } from "@/components/layout/MemberReminders";
import { logoutAction } from "@/app/actions/auth";
import { OpsAdminEntryBanner } from "@/components/admin/OpsAdminEntryBanner";

const PRIMARY = [
  { href: "/dashboard", label: "Accueil", icon: LayoutGrid },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/compatibility", label: "Découvrir", icon: Compass },
  { href: "/premium", label: "Alliance", icon: Crown, accent: true },
] as const;

const ACCOUNT_LINKS = [
  { href: "/profile", label: "Profil", icon: User },
  { href: "/notifications", label: "Alertes", icon: Bell },
  { href: "/assessments", label: "Tests", icon: ClipboardList },
  { href: "/academie-mariage", label: "Académie", icon: GraduationCap },
  { href: "/inspiration", label: "Inspiration", icon: BookHeart },
  { href: "/feedback", label: "Avis", icon: MessageSquareHeart },
  { href: "/help", label: "Aide", icon: HelpCircle },
  { href: "/dashboard#invite", label: "Inviter", icon: Share2 },
  { href: "/settings", label: "Paramètres", icon: Settings },
] as const;

const ACCOUNT_HREFS = ACCOUNT_LINKS.map((l) => l.href.split("#")[0]);

export type MemberShellProps = {
  children: React.ReactNode;
  firstName?: string;
  planLabel?: string;
  isPaid?: boolean;
  dense?: boolean;
  completionPercentage?: number;
  hasAvatar?: boolean;
  assessmentsDone?: number;
  assessmentsTotal?: number;
  renewSoon?: boolean;
  daysRemaining?: number | null;
  trialDaysRemaining?: number | null;
  isTrialBoost?: boolean;
};

export function MemberShell({
  children,
  firstName,
  planLabel = "Découverte",
  isPaid = false,
  dense = false,
  completionPercentage = 0,
  hasAvatar = true,
  assessmentsDone = 0,
  assessmentsTotal = 5,
  renewSoon = false,
  daysRemaining = null,
  trialDaysRemaining = null,
  isTrialBoost = false,
}: MemberShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [accountOpen, setAccountOpen] = React.useState(false);
  const [mobileAccountOpen, setMobileAccountOpen] = React.useState(false);
  const accountRef = React.useRef<HTMLDivElement>(null);

  const isActive = (href: string) => {
    const base = href.split("#")[0];
    if (base === "/dashboard") return pathname === "/dashboard";
    if (base === "/premium") {
      return (
        pathname === "/premium" ||
        pathname.startsWith("/premium/") ||
        pathname === "/billing" ||
        pathname.startsWith("/billing/")
      );
    }
    return pathname === base || pathname.startsWith(`${base}/`);
  };

  const accountActive = ACCOUNT_HREFS.some((href) => isActive(href));

  React.useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
    setMobileAccountOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (!accountOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!accountRef.current?.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [accountOpen]);

  const go = (href: string) => (e?: React.MouseEvent) => {
    e?.preventDefault();
    setMobileOpen(false);
    setAccountOpen(false);
    setMobileAccountOpen(false);
    router.push(href);
  };

  const navLinkClass = (href: string, accent?: boolean) => {
    const active = isActive(href);
    return cn(
      "inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer",
      accent && !active && "text-accent",
      active
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
    );
  };

  const accountMenu = (
    <div className="py-1">
      {ACCOUNT_LINKS.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={`${item.href}-${item.label}`}
            href={item.href}
            onClick={go(item.href)}
            className={cn(
              "flex items-center gap-2 px-3 py-2.5 text-sm font-medium cursor-pointer",
              isActive(item.href)
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-secondary"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </a>
        );
      })}
      <div className="my-1 border-t border-border" />
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex w-full items-center gap-2 px-3 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-[60] border-b border-border/50 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              className="md:hidden p-2 rounded-lg border border-border shrink-0"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Ouvrir le menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <a
              href="/dashboard"
              onClick={go("/dashboard")}
              className="font-serif text-2xl font-bold text-primary tracking-tight shrink-0"
            >
              KELIAA
            </a>
          </div>

          <nav
            className="hidden md:flex items-center gap-0.5 flex-1 justify-center"
            aria-label="Navigation principale"
          >
            {PRIMARY.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={go(item.href)}
                  className={navLinkClass(item.href, "accent" in item && item.accent)}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden lg:inline">{item.label}</span>
                </a>
              );
            })}

            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-colors",
                  accountActive || accountOpen
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                )}
                aria-expanded={accountOpen}
                aria-haspopup="menu"
              >
                <User className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">Compte</span>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform",
                    accountOpen && "rotate-180"
                  )}
                />
              </button>
              {accountOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-lg z-[70] overflow-hidden"
                >
                  {accountMenu}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0">
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
            <a
              href="/notifications"
              onClick={go("/notifications")}
              className="p-2 rounded-full hover:bg-secondary text-muted-foreground"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </a>
            <ThemeToggle />
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto z-[70]">
            {PRIMARY.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={go(item.href)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </a>
              );
            })}
            <button
              type="button"
              onClick={() => setMobileAccountOpen((v) => !v)}
              className={cn(
                "flex w-full items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium",
                accountActive
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-secondary"
              )}
            >
              <span className="inline-flex items-center gap-2">
                <User className="h-4 w-4" />
                Compte
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  mobileAccountOpen && "rotate-180"
                )}
              />
            </button>
            {mobileAccountOpen && (
              <div className="ml-2 border-l border-border pl-2">{accountMenu}</div>
            )}
          </div>
        )}

        <MemberReminders
          completionPercentage={completionPercentage}
          hasAvatar={hasAvatar}
          assessmentsDone={assessmentsDone}
          assessmentsTotal={assessmentsTotal}
          renewSoon={renewSoon}
          daysRemaining={daysRemaining}
          trialDaysRemaining={trialDaysRemaining}
          isTrialBoost={isTrialBoost}
          isPaid={isPaid}
          onNavigate={go}
        />
      </header>

      <main
        className={cn(
          "mx-auto max-w-6xl px-4 sm:px-6",
          dense ? "py-4 sm:py-6" : "py-6 sm:py-8",
          "pb-24 md:pb-10"
        )}
      >
        {firstName ? <p className="sr-only">Espace de {firstName}</p> : null}
        <div className="mb-4 max-w-3xl mx-auto">
          <OpsAdminEntryBanner />
        </div>
        {children}
      </main>

      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-[60] border-t border-border bg-background/95 backdrop-blur-md"
        aria-label="Navigation mobile"
      >
        <div className="mx-auto max-w-lg grid grid-cols-5 h-16">
          {PRIMARY.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={go(item.href)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold cursor-pointer",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </a>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(true);
              setMobileAccountOpen(true);
            }}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold",
              accountActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <User className="h-5 w-5" />
            Compte
          </button>
        </div>
      </nav>

      {false && process.env.NODE_ENV === "development" && <DevSessionSwitcher />}
    </div>
  );
}
