"use client";

import * as React from "react";
import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/actions/auth";
import { cn } from "@/utils/cn";

/**
 * Soleil / lune → menu : bascule thème + Déconnexion.
 * Utilisé sur onboarding et pages MainLayout (pas MemberShell).
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
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className={cn("relative", className)} ref={rootRef}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-full w-9 h-9 border-border/60 bg-background/50 backdrop-blur-sm hover:bg-accent/10 transition-colors"
        title="Thème et compte"
        aria-label="Thème et compte"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-accent" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-accent" />
      </Button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-card shadow-lg z-[80] overflow-hidden py-1"
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
      )}
    </div>
  );
}
