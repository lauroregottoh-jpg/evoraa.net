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
  Video,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { DevSessionSwitcher } from "@/components/dev/DevSessionSwitcher";
import { MemberReminders } from "@/components/layout/MemberReminders";
import { logoutAction } from "@/app/actions/auth";
import { OpsAdminEntryBanner } from "@/components/admin/OpsAdminEntryBanner";
import { PwaInstallButton } from "@/components/pwa/PwaInstallButton";
import { CoachingSessionReminders } from "@/components/coaching/CoachingSessionReminders";

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

/** Découverte — liens directs (hors groupes déroulants). */
const PRIMARY_FREE: NavItem[] = [
  { href: "/dashboard", label: "Accueil", icon: LayoutGrid },
  { href: "/communaute", label: "Communauté", icon: Users },
  { href: "/compatibility", label: "Compatibilités", icon: Heart },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/assessments", label: "Tests", icon: ClipboardList },
  { href: "/profile", label: "Profil", icon: User },
  { href: "/academie-mariage", label: "Académie", icon: GraduationCap },
  { href: "/couple", label: "KELYA Couple", icon: HeartHandshake },
];

/**
 * Alliance — liens directs (Premium / Coaching en groupes).
 */
const PRIMARY_ALLIANCE: NavItem[] = [
  { href: "/dashboard", label: "Accueil", icon: LayoutGrid },
  { href: "/communaute", label: "Communauté", icon: Users },
  { href: "/compatibility", label: "Compatibilités", icon: Heart },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/assessments", label: "Tests", icon: ClipboardList, allianceGold: true },
  { href: "/profile", label: "Profil", icon: User },
  { href: "/academie-mariage", label: "Académie", icon: GraduationCap },
  { href: "/couple", label: "KELYA Couple", icon: HeartHandshake },
];

const PREMIUM_FREE: NavItem[] = [
  { href: "/premium", label: "Passer Alliance", icon: Crown, accent: true },
  { href: "/rapport", label: "Rapport", icon: ClipboardList },
  { href: "/coffre-premium", label: "Coffre Premium", icon: Library },
];

const PREMIUM_ALLIANCE: NavItem[] = [
  { href: "/alliance/parcours", label: "Parcours", icon: Route, allianceGold: true },
  { href: "/rapport", label: "Rapport", icon: ClipboardList, allianceGold: true },
  { href: "/coffre-premium", label: "Coffre Premium", icon: Library, allianceGold: true },
  { href: "/premium", label: "Gérer Alliance", icon: Crown, accent: true },
];

const COACHING_NAV: NavItem[] = [
  { href: "/coaching", label: "Coaching", icon: Phone },
  { href: "/coaching/session", label: "Faire votre session", icon: Video },
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
  { href: "/couple", label: "KELYA", icon: HeartHandshake },
] as const;

const ACCOUNT_HREFS = [
  "/profile",
  "/notifications",
  "/inspiration",
  "/help",
  "/settings",
  "/academie-mariage",
  "/coaching",
  "/coaching/session",
  "/coffre-premium",
  "/rapport",
  "/alliance",
  "/couple",
];

export type MemberShellProps = {
  children: React.ReactNode;
  firstName?: string;
  planLabel?: string;
  isPaid?: boolean;
  dense?: boolean;
  /** Largeur du contenu principal (Couple présentation = wide). */
  contentWidth?: "default" | "wide" | "full";
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
  contentWidth = "default",
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
  const [navCompteOpen, setNavCompteOpen] = React.useState(false);
  /** Premium + Coaching ouverts par défaut pour rester trouvables. */
  const [navPremiumOpen, setNavPremiumOpen] = React.useState(true);
  const [navCoachingOpen, setNavCoachingOpen] = React.useState(true);
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
    if (base === "/coaching") {
      return pathname === "/coaching" || pathname === "/coaching/form";
    }
    if (base === "/couple") {
      return pathname === "/couple" || pathname.startsWith("/couple/");
    }
    return pathname === base || pathname.startsWith(`${base}/`);
  };

  const accountActive = ACCOUNT_HREFS.some((href) => isActive(href));

  React.useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    const premiumHrefs = (isPaid ? PREMIUM_ALLIANCE : PREMIUM_FREE).map(
      (i) => i.href
    );
    if (SECONDARY.some((i) => isActive(i.href))) setNavCompteOpen(true);
    if (premiumHrefs.some((h) => isActive(h))) setNavPremiumOpen(true);
    if (COACHING_NAV.some((i) => isActive(i.href))) setNavCoachingOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync groups on route
  }, [pathname, isPaid]);

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
        "text-[#F7F1EA] bg-[#B8954A]/20 border border-[#B8954A]/45 hover:bg-[#B8954A]/30",
      accent &&
        active &&
        "bg-[#B8954A] text-[#2F2424] border border-[#B8954A] shadow-sm",
      gold &&
        !accent &&
        !active &&
        "text-[#F3E6C8] hover:text-[#F7F1EA] hover:bg-white/12",
      gold &&
        !accent &&
        active &&
        "bg-[#F7F1EA] text-[#7A4F55] shadow-[inset_0_0_0_1px_rgba(184,149,74,0.65)]",
      !accent &&
        !gold &&
        active &&
        "bg-[#F7F1EA] text-[#2F2424] shadow-[inset_0_0_0_1px_rgba(184,149,74,0.5)]",
      !accent &&
        !gold &&
        !active &&
        "text-[#F7F1EA]/88 hover:text-white hover:bg-white/12"
    );
  };

  const primaryItems = isPaid ? PRIMARY_ALLIANCE : PRIMARY_FREE;
  const premiumItems = isPaid ? PREMIUM_ALLIANCE : PREMIUM_FREE;

  const renderItem = (item: NavItem, compact: boolean) => {
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
            (accent || gold) && !isActive(item.href) && "text-[#B8954A]",
            gold && isActive(item.href) && "text-[#B8954A]"
          )}
        />
        <span
          className={cn(
            "truncate transition-all duration-300",
            compact ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
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
  };

  const renderGroup = (opts: {
    compact: boolean;
    label: string;
    open: boolean;
    setOpen: (v: boolean | ((p: boolean) => boolean)) => void;
    items: NavItem[];
    icon: React.ComponentType<{ className?: string }>;
    active: boolean;
  }) => {
    const Icon = opts.icon;
    if (opts.compact) {
      return (
        <div className="space-y-0.5">
          <button
            type="button"
            title={opts.label}
            onClick={() => opts.setOpen((v) => !v)}
            className={cn(
              "relative flex w-full items-center justify-center rounded-xl py-2.5",
              opts.active
                ? "bg-[#F7F1EA] text-[#2F2424]"
                : "text-[#F7F1EA]/80 hover:text-white hover:bg-white/12"
            )}
          >
            <Icon className="h-4 w-4" />
            {opts.active ? (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-[#B8954A]" />
            ) : null}
          </button>
          {opts.open
            ? opts.items.map((item) => renderItem(item, true))
            : null}
        </div>
      );
    }
    return (
      <div className="space-y-0.5">
        <button
          type="button"
          onClick={() => opts.setOpen((v) => !v)}
          aria-expanded={opts.open}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
            "border border-[#B8954A]/35",
            opts.active || opts.open
              ? "bg-[#F7F1EA] text-[#2F2424] border-[#B8954A]/55"
              : "text-[#F7F1EA]/90 hover:text-white hover:bg-white/12"
          )}
        >
          <Icon className="h-4 w-4 shrink-0 text-[#B8954A]" />
          <span className="truncate flex-1 text-left">{opts.label}</span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#F7F1EA]/55 mr-0.5">
            {opts.open ? "Réduire" : "Ouvrir"}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 opacity-70 transition-transform",
              opts.open && "rotate-180"
            )}
          />
        </button>
        {opts.open ? (
          <div className="ml-2 pl-2 border-l border-[#B8954A]/35 space-y-0.5">
            {opts.items.map((item) => renderItem(item, false))}
          </div>
        ) : null}
      </div>
    );
  };

  const renderNavLinks = (compact: boolean) => (
    <>
      {!compact ? (
        <p className="px-3 pt-1 pb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#F3E6C8]">
          Principale
        </p>
      ) : (
        <div className="h-3" />
      )}
      {primaryItems.map((item) => renderItem(item, compact))}

      {renderGroup({
        compact,
        label: isPaid ? "Premium" : "Premium",
        open: navPremiumOpen,
        setOpen: setNavPremiumOpen,
        items: premiumItems,
        icon: Crown,
        active: premiumItems.some((i) => isActive(i.href)),
      })}

      {renderGroup({
        compact,
        label: "Coaching",
        open: navCoachingOpen,
        setOpen: setNavCoachingOpen,
        items: COACHING_NAV,
        icon: Phone,
        active: COACHING_NAV.some((i) => isActive(i.href)),
      })}

      {renderGroup({
        compact,
        label: "Compte",
        open: navCompteOpen,
        setOpen: setNavCompteOpen,
        items: SECONDARY.map((s) => ({
          href: s.href,
          label: s.label,
          icon: s.icon,
        })),
        icon: Settings,
        active: SECONDARY.some((i) => isActive(i.href)),
      })}
    </>
  );

  const logoutButton = (compact: boolean) => (
    <form action={logoutAction} className="shrink-0 pt-3 border-t border-[#B8954A]/30">
      <button
        type="submit"
        title={compact ? "Déconnexion" : undefined}
        className={cn(
          "flex w-full items-center rounded-xl text-sm font-bold transition-all duration-300",
          "bg-[#F7F1EA]/18 text-[#F7F1EA] hover:bg-[#F7F1EA]/28 border border-[#B8954A]/40",
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
      {/* Sidebar — roseâtre pastel + or Farata */}
      <aside
        className={cn(
          "hidden md:flex shrink-0 flex-col sticky top-0 h-screen z-40",
          "bg-[#AC7D79] text-[#F7F1EA]",
          "border-r border-[#B8954A]/35 shadow-[4px_0_24px_-10px_rgba(122,79,85,0.28)]",
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
              "font-serif font-bold tracking-tight text-[#F7F1EA] transition-all duration-300",
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
              "inline-flex items-center justify-center rounded-xl border border-[#B8954A]/40 bg-[#F7F1EA]/15",
              "text-[#F7F1EA] hover:bg-[#F7F1EA]/25 transition-all duration-300",
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
          className="pointer-events-none h-px w-full shrink-0 bg-gradient-to-r from-transparent via-[#B8954A] to-transparent opacity-80"
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
                className="md:hidden p-2 rounded-lg shrink-0 bg-[#AC7D79] text-[#F7F1EA] border border-[#B8954A]/40"
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
                size="md"
                label="Télécharger l’app"
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
                  className="inline-flex items-center justify-center rounded-full w-9 h-9 border border-[#B8954A]/40 bg-[#AC7D79]/15 hover:bg-[#AC7D79]/25 transition-colors"
                  title="Compte"
                  aria-label="Menu compte"
                  aria-expanded={accountOpen}
                >
                  <User className="h-4 w-4 text-[#7A4F55]" />
                </button>
                {accountOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#B8954A]/40 bg-[#F7EDE8] text-[#3D2B2B] shadow-2xl z-[200] overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-200"
                  >
                    <a
                      href="/profile"
                      onClick={go("/profile")}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-[#3D2B2B] hover:bg-white/80 transition-colors"
                    >
                      <User className="h-4 w-4 text-[#B8954A]" />
                      Profil
                    </a>
                    <a
                      href="/settings"
                      onClick={go("/settings")}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-[#3D2B2B] hover:bg-white/80 transition-colors"
                    >
                      <Settings className="h-4 w-4 text-[#B8954A]" />
                      Paramètres
                    </a>
                    <div className="my-1.5 mx-3 h-px bg-gradient-to-r from-transparent via-[#B8954A]/55 to-transparent" />
                    <form action={logoutAction} className="px-1.5 pb-0.5">
                      <button
                        type="submit"
                        className="flex w-full items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#7A4F55] hover:bg-white/80 transition-colors"
                      >
                        <LogOut className="h-4 w-4 text-[#B8954A]" />
                        Déconnexion
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>

          {mobileOpen && (
            <div className="md:hidden border-t border-[#B8954A]/30 bg-[#AC7D79] px-3 py-3 max-h-[75vh] overflow-y-auto z-[70] animate-in slide-in-from-top-2 fade-in duration-300 member-sidebar-scroll">
              <nav className="flex flex-col gap-0.5 text-[#F7F1EA]" aria-label="Navigation membre">
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
            "mx-auto w-full px-4 sm:px-6",
            contentWidth === "full"
              ? "max-w-none"
              : contentWidth === "wide"
                ? "max-w-5xl"
                : "max-w-3xl",
            dense ? "py-4 sm:py-6" : "py-6 sm:py-8",
            "pb-24 md:pb-10 flex-1"
          )}
        >
          {firstName ? <p className="sr-only">Espace de {firstName}</p> : null}
          <div className="mb-4">
            <OpsAdminEntryBanner />
            <CoachingSessionReminders />
          </div>
          {children}
        </main>

        <nav
          className="md:hidden fixed bottom-0 inset-x-0 z-[60] border-t border-[#B8954A]/30 bg-[#AC7D79] text-[#F7F1EA] backdrop-blur-md"
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
                    active ? "text-[#F3E6C8]" : "text-[#F7F1EA]/75"
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
                accountActive || mobileOpen ? "text-[#F3E6C8]" : "text-[#F7F1EA]/75"
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
