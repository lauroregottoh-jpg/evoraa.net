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
  MoreHorizontal,
  Share2,
  BookHeart,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { ThemeToggle } from "@/components/evoraa/ThemeToggle";
import { DevSessionSwitcher } from "@/components/dev/DevSessionSwitcher";
import { MemberReminders } from "@/components/layout/MemberReminders";

const NAV = [
  { href: "/dashboard", label: "Accueil", icon: LayoutGrid },
  { href: "/compatibility", label: "Découvrir", icon: Compass },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/assessments", label: "Tests", icon: ClipboardList },
  { href: "/academie-mariage", label: "Académie", icon: GraduationCap },
  { href: "/premium", label: "Alliance", icon: Crown, accent: true },
] as const;

const BOTTOM_PRIMARY = [
  { href: "/dashboard", label: "Accueil", icon: LayoutGrid },
  { href: "/compatibility", label: "Découvrir", icon: Compass },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/assessments", label: "Tests", icon: ClipboardList },
] as const;

const MORE_LINKS = [
  { href: "/inspiration", label: "Inspiration", icon: BookHeart },
  { href: "/academie-mariage", label: "Académie", icon: GraduationCap },
  { href: "/premium", label: "Alliance", icon: Crown },
  { href: "/dashboard#invite", label: "Inviter", icon: Share2 },
  { href: "/notifications", label: "Alertes", icon: Bell },
  { href: "/profile", label: "Profil", icon: User },
  { href: "/help", label: "Aide", icon: HelpCircle },
  { href: "/settings", label: "Paramètres", icon: Settings },
] as const;

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
  const [open, setOpen] = React.useState(false);
  const [moreOpen, setMoreOpen] = React.useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    if (href === "/premium") {
      return (
        pathname === "/premium" ||
        pathname.startsWith("/premium/") ||
        pathname === "/billing" ||
        pathname.startsWith("/billing/")
      )
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const moreActive = MORE_LINKS.some((l) => isActive(l.href));

  React.useEffect(() => {
    setOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  const go = (href: string) => (e?: React.MouseEvent) => {
    e?.preventDefault();
    setOpen(false);
    setMoreOpen(false);
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-[60] border-b border-border/50 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              className="md:hidden p-2 rounded-lg border border-border shrink-0"
              onClick={() => {
                setMoreOpen(false);
                setOpen((v) => !v);
              }}
              aria-label="Ouvrir le menu"
              aria-expanded={open}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
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
            {NAV.map((item) => {
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
          </nav>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
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
              href="/help"
              onClick={go("/help")}
              className="hidden md:inline-flex p-2 rounded-full hover:bg-secondary text-muted-foreground"
              aria-label="Aide"
              title="Aide"
            >
              <HelpCircle className="h-4 w-4" />
            </a>
            <a
              href="/settings"
              onClick={go("/settings")}
              className="hidden md:inline-flex p-2 rounded-full hover:bg-secondary text-muted-foreground"
              aria-label="Paramètres"
              title="Paramètres"
            >
              <Settings className="h-4 w-4" />
            </a>
            <a
              href="/notifications"
              onClick={go("/notifications")}
              className="p-2 rounded-full hover:bg-secondary text-muted-foreground"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </a>
            <a
              href="/profile"
              onClick={go("/profile")}
              className="p-2 rounded-full hover:bg-secondary text-muted-foreground"
              aria-label="Profil"
            >
              <User className="h-4 w-4" />
            </a>
            <ThemeToggle />
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto z-[70]">
            {[...NAV, ...MORE_LINKS.filter((l) => !NAV.some((n) => n.href === l.href))].map(
              (item) => {
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
              }
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
        {children}
      </main>

      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-[60] border-t border-border bg-background/95 backdrop-blur-md"
        aria-label="Navigation mobile"
      >
        <div className="mx-auto max-w-lg grid grid-cols-5 h-16">
          {BOTTOM_PRIMARY.map((item) => {
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
              setOpen(false);
              setMoreOpen((v) => !v);
            }}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold",
              moreOpen || moreActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <MoreHorizontal className="h-5 w-5" />
            Plus
          </button>
        </div>

        {moreOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-[55] bg-black/20"
              aria-label="Fermer"
              onClick={() => setMoreOpen(false)}
            />
            <div className="absolute bottom-16 inset-x-0 mx-3 mb-2 z-[65] rounded-2xl border border-border bg-card p-2">
              <div className="grid grid-cols-3 gap-1">
                {MORE_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={go(item.href)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-[11px] font-medium cursor-pointer",
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
              </div>
            </div>
          </>
        )}
      </nav>

      {process.env.NODE_ENV === "development" && <DevSessionSwitcher />}
    </div>
  );
}
