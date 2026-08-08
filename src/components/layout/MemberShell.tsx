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
  Phone,
  Library,
  PanelLeftClose,
  PanelLeftOpen,
  Route,
  Users,
  HeartHandshake,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { DevSessionSwitcher } from "@/components/dev/DevSessionSwitcher";
import { MemberReminders } from "@/components/layout/MemberReminders";
import { logoutAction } from "@/app/actions/auth";
import { OpsAdminEntryBanner } from "@/components/admin/OpsAdminEntryBanner";
import { PwaInstallHint } from "@/components/pwa/PwaInstallHint";
import { PwaMemberInstallCard } from "@/components/pwa/PwaMemberInstallCard";
import { PwaInstallButton } from "@/components/pwa/PwaInstallButton";

const SIDEBAR_KEY = "KELIAA_member_sidebar_open";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  /** CTA « Passer Alliance » */
  accent?: boolean;
  /** Entrée Alliance upgradée — icône / filet dorés */
  allianceGold?: boolean;
};

/** Découverte — ordre classique. */
const PRIMARY_FREE: NavItem[] = [
  { href: "/dashboard", label: "Accueil", icon: LayoutGrid },
  { href: "/communaute", label: "Communauté", icon: Users },
  { href: "/compatibility", label: "Compatibilités", icon: Heart },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/assessments", label: "Tests", icon: ClipboardList },
  { href: "/premium", label: "Alliance", icon: Crown, accent: true },
  { href: "/rapport", label: "Rapport", icon: ClipboardList },
  { href: "/coffre-premium", label: "Coffre Premium", icon: Library },
  { href: "/profile", label: "Profil", icon: User },
  { href: "/academie-mariage", label: "Académie", icon: GraduationCap },
  { href: "/coaching", label: "Coaching", icon: Phone },
  { href: "/couple", label: "KELYA Couple", icon: HeartHandshake },
];

/**
 * Alliance — Accueil, puis Communauté, puis bloc upgradé,
 * puis le reste comme avant.
 */
const PRIMARY_ALLIANCE: NavItem[] = [
  { href: "/dashboard", label: "Accueil", icon: LayoutGrid },
  { href: "/communaute", label: "Communauté", icon: Users },
  { href: "/alliance/parcours", label: "Parcours", icon: Route, allianceGold: true },
  { href: "/rapport", label: "Rapport", icon: ClipboardList, allianceGold: true },
  { href: "/coffre-premium", label: "Coffre Premium", icon: Library, allianceGold: true },
  { href: "/assessments", label: "Tests", icon: ClipboardList, allianceGold: true },
  { href: "/compatibility", label: "Compatibilités", icon: Heart },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/premium", label: "Alliance", icon: Crown, accent: true },
  { href: "/profile", label: "Profil", icon: User },
  { href: "/academie-mariage", label: "Académie", icon: GraduationCap },
  { href: "/coaching", label: "Coaching", icon: Phone },
  { href: "/couple", label: "KELYA Couple", icon: HeartHandshake },
];

const SECONDARY = [
  { href: "/inspiration", label: "Inspiration", icon: BookHeart },
  { href: "/dashboard#invite", label: "Recommander", icon: Share2 },
  { href: "/notifications", label: "Alertes & avis", icon: Bell },
  { href: "/help", label: "Aide", icon: HelpCircle },
  { href: "/settings", label: "Paramètres", icon: Settings },
] as const;

const BOTTOM_PRIMARY = [
  { href: "/dashboard", label: "Accueil", icon: LayoutGrid },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/assessments", label: "Tests", icon: ClipboardList },
  { href: "/couple", label: "Couple", icon: HeartHandshake },
] as const;

const ACCOUNT_HREFS = [
  "/profile",
  "/notifications",
  "/inspiration",
  "/help",
  "/settings",
  "/academie-mariage",
  "/coaching",
  "/coffre-premium",
  "/rapport",
  "/alliance",
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
  suggestionsLimit?: number;
  evaQuestionsLimit?: number;
  coffreUnlocked?: number;
  coffreQuota?: number;
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
  suggestionsLimit = 15,
  evaQuestionsLimit = 20,
  coffreUnlocked = 0,
  coffreQuota = 3,
}: MemberShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [accountOpen, setAccountOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [sidebarReady, setSidebarReady] = React.useState(false);
  const accountRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(SIDEBAR_KEY);
      if (raw === "0") setSidebarOpen(false);
      if (raw === "1") setSidebarOpen(true);
    } catch {
      /* ignore */
    }
    setSidebarReady(true);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((v) => {
      const next = !v;
      try {
        localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

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
    if (base === "/alliance/parcours") {
      return pathname === "/alliance/parcours" || pathname.startsWith("/alliance/");
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

  const navLinkClass = (
    href: string,
    opts?: { accent?: boolean; allianceGold?: boolean; compact?: boolean }
  ) => {
    const active = isActive(href);
    const accent = Boolean(opts?.accent);
    const gold = Boolean(opts?.allianceGold);
    const compact = Boolean(opts?.compact);
    return cn(
      "group relative flex items-center rounded-xl text-sm font-semibold cursor-pointer",
      "transition-all duration-300 ease-out",
      compact ? "justify-center px-0 py-2.5" : "gap-2.5 px-3 py-2",
      accent &&
        !active &&
        "text-[#F3D9A4] bg-white/10 border border-[#B8954A]/35 hover:bg-white/15",
      accent &&
        active &&
        "bg-[#B8954A] text-[#1C1412] border border-[#B8954A] shadow-sm",
      gold &&
        !accent &&
        !active &&
        "text-[#F3D9A4]/95 hover:text-[#F8E7C0] hover:bg-[#B8954A]/15",
      gold &&
        !accent &&
        active &&
        "bg-[#B8954A]/25 text-[#F3D9A4] shadow-[inset_0_0_0_1px_rgba(184,149,74,0.45)]",
      !accent &&
        !gold &&
        active &&
        "bg-white/18 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]",
      !accent &&
        !gold &&
        !active &&
        "text-white/72 hover:text-white hover:bg-white/10"
    );
  };

  const primaryItems = isPaid ? PRIMARY_ALLIANCE : PRIMARY_FREE;

  const renderNavLinks = (compact: boolean) => (
    <>
      {!compact ? (
        <p className="px-3 pt-1 pb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
          Principale
        </p>
      ) : (
        <div className="h-3" />
      )}
      {primaryItems.map((item) => {
        const Icon = item.icon;
        const accent = Boolean(item.accent);
        const gold = Boolean(item.allianceGold);
        return (
          <a
            key={item.href}
            href={item.href}
            onClick={go(item.href)}
            title={compact ? item.label : undefined}
            className={navLinkClass(item.href, {
              accent,
              allianceGold: gold,
              compact,
            })}
          >
            <Icon
              className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110",
                (accent || gold) && !isActive(item.href) && "text-[#F3D9A4]",
                gold && isActive(item.href) && "text-[#F3D9A4]"
              )}
            />
            <span
              className={cn(
                "truncate transition-all duration-300",
                compact
                  ? "w-0 opacity-0 overflow-hidden"
                  : "w-auto opacity-100"
              )}
            >
              {item.label}
            </span>
            {compact && isActive(item.href) ? (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-[#B8954A]" />
            ) : null}
            {!compact && gold && !accent ? (
              <span
                className="ml-auto text-[9px] font-bold uppercase tracking-wider text-[#B8954A]/90"
                aria-hidden
              >
                ★
              </span>
            ) : null}
          </a>
        );
      })}

      {!compact ? (
        <p className="px-3 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
          Compte
        </p>
      ) : (
        <div className="my-2 mx-2 border-t border-white/15" />
      )}
      <div className="space-y-0.5 pb-2">
        {SECONDARY.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={`${item.href}-${item.label}`}
              href={item.href}
              onClick={go(item.href)}
              title={compact ? item.label : undefined}
              className={cn(
                navLinkClass(item.href, { compact }),
                "text-[13px]"
              )}
            >
              <Icon className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110" />
              <span
                className={cn(
                  "truncate transition-all duration-300",
                  compact
                    ? "w-0 opacity-0 overflow-hidden"
                    : "w-auto opacity-100"
                )}
              >
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </>
  );

  const logoutButton = (compact: boolean) => (
    <form action={logoutAction} className="shrink-0 pt-3 border-t border-white/15">
      <button
        type="submit"
        title={compact ? "Déconnexion" : undefined}
        className={cn(
          "flex w-full items-center rounded-xl text-sm font-bold transition-all duration-300",
          "bg-white/12 text-white hover:bg-white/20 border border-white/15",
          compact ? "justify-center px-0 py-2.5" : "gap-2.5 px-3 py-2.5"
        )}
      >
        <LogOut className="h-4 w-4 shrink-0" />
        {!compact ? <span>Déconnexion</span> : null}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-background text-foreground md:flex">
      {/* Sidebar desktop — bordeaux unifié, repliable */}
      <aside
        className={cn(
          "hidden md:flex shrink-0 flex-col sticky top-0 h-screen z-40",
          "bg-[#5C1F28] text-[#F8F4EE]",
          "border-r border-[#3D141A]/80 shadow-[4px_0_24px_-12px_rgba(92,31,40,0.35)]",
          "transition-[width] duration-300 ease-out",
          sidebarReady ? (sidebarOpen ? "md:w-56 lg:w-60" : "md:w-[4.25rem]") : "md:w-56 lg:w-60",
          sidebarOpen ? "px-3 py-4 gap-3" : "px-2 py-4 gap-3"
        )}
      >
        <div
          className={cn(
            "flex items-center shrink-0",
            sidebarOpen ? "justify-between gap-2 px-1" : "flex-col gap-2"
          )}
        >
          <a
            href="/dashboard"
            onClick={go("/dashboard")}
            className={cn(
              "font-serif font-bold tracking-tight text-[#F8F4EE] transition-all duration-300",
              sidebarOpen ? "text-2xl px-1" : "text-lg"
            )}
            title="KELIAA"
          >
            {sidebarOpen ? "KELIAA" : "K"}
          </a>
          <button
            type="button"
            onClick={toggleSidebar}
            className={cn(
              "inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10",
              "text-white/85 hover:text-white hover:bg-white/18 transition-all duration-300",
              "hover:scale-105 active:scale-95 h-9 w-9"
            )}
            aria-label={sidebarOpen ? "Masquer le menu" : "Afficher le menu"}
            title={sidebarOpen ? "Masquer le menu" : "Afficher le menu"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </button>
        </div>

        <div
          className="pointer-events-none h-px w-full shrink-0 bg-gradient-to-r from-transparent via-[#B8954A]/50 to-transparent opacity-80"
          aria-hidden
        />

        <nav
          className="flex flex-col gap-0.5 flex-1 min-h-0 overflow-y-auto overflow-x-hidden member-sidebar-scroll pr-0.5"
          aria-label="Navigation membre"
        >
          {renderNavLinks(!sidebarOpen)}
        </nav>

        {logoutButton(!sidebarOpen)}
      </aside>

      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <header className="sticky top-0 z-[60] isolate border-b border-border/50 bg-background/95 backdrop-blur-md">
          <div className="relative z-[80] flex h-14 sm:h-16 items-center justify-between gap-2 px-4 sm:px-6 bg-background/95">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                className="md:hidden p-2 rounded-lg border border-border shrink-0 bg-[#5C1F28] text-white border-[#5C1F28]"
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
              <PwaInstallButton
                variant={isPaid ? "alliance" : "discovery"}
                size="sm"
                label="App"
              />
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
              <div className="relative z-[120]" ref={accountRef}>
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  className="inline-flex items-center justify-center rounded-full w-9 h-9 border border-[#5C1F28]/25 bg-[#5C1F28]/[0.08] hover:bg-[#5C1F28]/15 transition-colors"
                  title="Compte"
                  aria-label="Menu compte"
                  aria-expanded={accountOpen}
                >
                  <User className="h-4 w-4 text-[#5C1F28]" />
                </button>
                {accountOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#3D141A]/80 bg-[#5C1F28] text-[#F8F4EE] shadow-2xl z-[200] overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-200"
                  >
                    <a
                      href="/profile"
                      onClick={go("/profile")}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-[#F8F4EE]/90 hover:bg-white/12 hover:text-white transition-colors"
                    >
                      <User className="h-4 w-4 text-[#F3D9A4]" />
                      Profil
                    </a>
                    <a
                      href="/settings"
                      onClick={go("/settings")}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-[#F8F4EE]/90 hover:bg-white/12 hover:text-white transition-colors"
                    >
                      <Settings className="h-4 w-4 text-[#F3D9A4]" />
                      Paramètres
                    </a>
                    <div className="my-1.5 mx-3 h-px bg-gradient-to-r from-transparent via-[#B8954A]/55 to-transparent" />
                    <form action={logoutAction} className="px-1.5 pb-0.5">
                      <button
                        type="submit"
                        className="flex w-full items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#F8F4EE]/90 hover:bg-white/12 hover:text-white transition-colors"
                      >
                        <LogOut className="h-4 w-4 text-[#F3D9A4]" />
                        Déconnexion
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>

          {mobileOpen && (
            <div className="md:hidden border-t border-[#3D141A] bg-[#5C1F28] px-3 py-3 max-h-[75vh] overflow-y-auto z-[70] animate-in slide-in-from-top-2 fade-in duration-300 member-sidebar-scroll">
              <nav className="flex flex-col gap-0.5 text-[#F8F4EE]" aria-label="Navigation membre">
                {renderNavLinks(false)}
              </nav>
              <div className="mt-3">{logoutButton(false)}</div>
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
            dimmed={accountOpen}
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
          <div className="mb-4 space-y-3">
            <OpsAdminEntryBanner />
            <PwaMemberInstallCard isPaid={Boolean(isPaid)} />
            <PwaInstallHint />
          </div>
          {children}
        </main>

        <nav
          className="md:hidden fixed bottom-0 inset-x-0 z-[60] border-t border-[#3D141A]/40 bg-[#5C1F28] text-white backdrop-blur-md"
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
                    "flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold cursor-pointer transition-colors",
                    active ? "text-[#F3D9A4]" : "text-white/65"
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
                "flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors",
                accountActive || mobileOpen ? "text-[#F3D9A4]" : "text-white/65"
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
