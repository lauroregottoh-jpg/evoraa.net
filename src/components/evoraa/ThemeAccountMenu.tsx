"use client";

import * as React from "react";
import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { logoutAction } from "@/app/actions/auth";
import { cn } from "@/utils/cn";

/**
 * Soleil / lune → menu : thème + Déconnexion (onboarding / MainLayout).
 * Bouton natif (évite bugs Base UI sur le clic).
 */
export function ThemeAccountMenu({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    // pointerdown en capture après le toggle (évite fermeture immédiate)
    const t = window.setTimeout(() => {
      document.addEventListener("pointerdown", onDoc);
    }, 0);
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("pointerdown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className={cn("relative z-[90]", className)} ref={rootRef}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/50 text-accent backdrop-blur-sm hover:bg-accent/10 transition-colors"
        title="Thème et compte"
        aria-label="Thème et déconnexion"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card shadow-lg overflow-hidden py-1"
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
            onClick={() => {
              if (!mounted) return;
              setTheme(isDark ? "light" : "dark");
            }}
          >
            {isDark ? (
              <>
                <Sun className="h-4 w-4 text-accent" />
                Mode clair
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-accent" />
                Mode sombre
              </>
            )}
          </button>
          <div className="my-1 border-t border-border" />
          <form action={logoutAction}>
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2 px-3 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              Se déconnecter
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
