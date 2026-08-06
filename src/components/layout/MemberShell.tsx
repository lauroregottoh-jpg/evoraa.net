"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Heart,
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
  Phone,
  Sun,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { DevSessionSwitcher } from "@/components/dev/DevSessionSwitcher";
import { MemberReminders } from "@/components/layout/MemberReminders";
import { logoutAction } from "@/app/actions/auth";
import { OpsAdminEntryBanner } from "@/components/admin/OpsAdminEntryBanner";

/** Nav principale — le reste est secondaire (sidebar bas / Compte). */
const PRIMARY = [
  { href: "/dashboard", label: "Accueil", icon: LayoutGrid },
  { href: "/compatibility", label: "Compatibilités", icon: Heart },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/assessments", label: "Tests", icon: ClipboardList },
  { href: "/premium", label: "Alliance", icon: Crown, accent: true },
] as const;

const SECONDARY = [
  { href: "/profile", label: "Profil", icon: User },
  { href: "/academie-mariage", label: "Académie", icon: GraduationCap },
  { href: "/coaching", label: "Coaching", icon: Phone },
  { href: "/inspiration", label: "Inspiration", icon: BookHeart },
  { href: "/dashboard#invite", label: "Recommander", icon: Share2 },
  { href: "/notifications", label: "Alertes", icon: Bell },
  { href: "/feedback", label: "Avis", icon: MessageSquareHeart },
  { href: "/help", label: "Aide", icon: HelpCircle },
  { href: "/settings", label: "Paramètres", icon: Settings },
] as const;

const BOTTOM_PRIMARY = [
  { href: "/dashboard", label: "Accueil", icon: LayoutGrid },
  { href: "/compatibility", label: "Matchs", icon: Heart },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/assessments", label: "Tests", icon: ClipboardList },
] as const;

const ACCOUNT_HREFS = [
  "/profile",
  "/notifications",
  "/inspiration",
  "/feedback",
  "/help",
  "/settings",
  "/academie-mariage",
  "/coaching",
];

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
  planLabel = "Alliance",
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
  }, [pathname]);

  React.useEffect(() => {
    if (!accountOpen) return;
    const onDoc = (e: PointerEvent) => {
      if (!accountRef.current?.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    const t = window.setTimeout(() => {
      document.addEventListener("pointerdown", onDoc);
    }, 0);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("pointerdown", onDoc);
    };
  }, [accountOpen]);

  const go = (href: string) => (e?: React.MouseEvent) => {
    e?.preventDefault();
    setMobileOpen(false);
    setAccountOpen(false);
    router.push(href);
  };

  const linkClass = (href: string, accent?: boolean) => {
    const active = isActive(href);
    return cn(
      "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors cursor-pointer",
      accent &&
        !active &&
        "text-accent border border-accent/35 bg-accent/10",
      accent && active && "bg-accent/20 text-accent border border-accent/40",
      !accent &&
        (active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/70")
    );
  };

  const sidebarNav = (
    <nav className="flex flex-col gap-1 flex-1 min-h-0" aria-label="Navigation membre">
      <p className="px-3 pt-1 pb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        Principale
      </p>
      {PRIMARY.map((item) => {
        const Icon = item.icon;
        const accent = "accent" in item && item.accent;
        return (
          <a
            key={item.href}
            href={item.href}
            onClick={go(item.href)}
            className={linkClass(item.href, accent)}
          >
            <Icon className={cn("h-4 w-4 shrink-0", accent && "text-accent")} />
            {item.label}
          </a>
        );
      })}

      <div className="mt-3 space-y-0.5 overflow-y-auto">
        {SECONDARY.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={`${item.href}-${item.label}`}
              href={item.href}
              onClick={go(item.href)}
              className={linkClass(item.href)}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </a>
          );
        })}
      </div>

      <div className="mt-auto pt-4 border-t border-border">
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </form>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-background text-foreground md:flex">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex md:w-56 lg:w-60 shrink-0 flex-col border-r border-border/60 bg-background sticky top-0 h-screen px-3 py-4 gap-4 z-40">
        <a
          href="/dashboard"
          onClick={go("/dashboard")}
          className="font-serif text-2xl font-bold text-primary tracking-tight px-2"
        >
          KELIAA
        </a>
        {sidebarNav}
      </aside>

      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <header className="sticky top-0 z-[60] border-b border-border/50 bg-background/95 backdrop-blur-md">
          <div className="flex h-14 sm:h-16 items-center justify-between gap-2 px-4 sm:px-6">
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
                className="md:hidden font-serif text-2xl font-bold text-primary tracking-tight shrink-0"
              >
                KELIAA
              </a>
              {firstName ? (
                <p className="hidden sm:block text-sm text-muted-foreground truncate">
                  Bonjour{firstName ? `, ${firstName}` : ""}
                </p>
              ) : null}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {isPaid ? (
                <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-accent/15 text-accent border-accent/30">
                  {planLabel || "Alliance"}
                </span>
              ) : (
                <a
                  href="/premium"
                  onClick={go("/premium")}
                  className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-accent/35 bg-accent/10 text-accent hover:bg-accent/20"
                >
                  Passer Alliance
                </a>
              )}
              {/* Soleil = menu compte / déconnexion */}
              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  className="inline-flex items-center justify-center rounded-full w-9 h-9 border border-border/60 bg-background/50 hover:bg-accent/10 transition-colors"
                  title="Compte"
                  aria-label="Menu compte"
                  aria-expanded={accountOpen}
                >
                  <Sun className="h-4 w-4 text-accent" />
                </button>
                {accountOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-card shadow-lg z-[70] overflow-hidden py-1"
                  >
                    <a
                      href="/profile"
                      onClick={go("/profile")}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium hover:bg-secondary"
                    >
                      <User className="h-4 w-4" />
                      Profil
                    </a>
                    <a
                      href="/settings"
                      onClick={go("/settings")}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium hover:bg-secondary"
                    >
                      <Settings className="h-4 w-4" />
                      Paramètres
                    </a>
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
                )}
              </div>
            </div>
          </div>

          {mobileOpen && (
            <div className="md:hidden border-t border-border bg-card px-3 py-3 max-h-[75vh] overflow-y-auto z-[70]">
              {sidebarNav}
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
            "mx-auto w-full max-w-3xl px-4 sm:px-6",
            dense ? "py-4 sm:py-6" : "py-6 sm:py-8",
            "pb-24 md:pb-10 flex-1"
          )}
        >
          {firstName ? <p className="sr-only">Espace de {firstName}</p> : null}
          <div className="mb-4">
            <OpsAdminEntryBanner />
          </div>
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
              onClick={() => setMobileOpen(true)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold",
                accountActive || mobileOpen ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Menu className="h-5 w-5" />
              Menu
            </button>
          </div>
        </nav>
      </div>

      {false && process.env.NODE_ENV === "development" && <DevSessionSwitcher />}
    </div>
  );
}
