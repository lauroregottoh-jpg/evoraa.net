"use client";

import * as React from "react";
import { ShieldCheck, User, Crown, AlertTriangle, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type DevRole = "admin" | "laure" | "alexandre" | "suspect";

export interface DevUserSession {
  id: string;
  email: string;
  name: string;
  role: "admin" | "member";
  avatar: string;
  completion: number;
  status: "approved" | "pending" | "banned";
}

export const DEV_SESSIONS: Record<DevRole, DevUserSession> = {
  laure: {
    id: "22222222-2222-2222-2222-222222222222",
    email: "laure.regottoh@evoraa.net",
    name: "Laure Regottoh (Membre)",
    role: "member",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
    completion: 100,
    status: "approved",
  },
  admin: {
    id: "11111111-1111-1111-1111-111111111111",
    email: "admin@evoraa.net",
    name: "Modération EVA (Admin)",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop",
    completion: 100,
    status: "approved",
  },
  alexandre: {
    id: "33333333-3333-3333-3333-333333333333",
    email: "alexandre.dumas@evoraa.net",
    name: "Alexandre Dumas (Compat. 94%)",
    role: "member",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
    completion: 94,
    status: "approved",
  },
  suspect: {
    id: "55555555-5555-5555-5555-555555555555",
    email: "suspect.spam@evoraa.net",
    name: "Suspect Spam (En modération)",
    role: "member",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop",
    completion: 45,
    status: "pending",
  },
};

export function getActiveDevSession(): DevUserSession {
  if (typeof window === "undefined") return DEV_SESSIONS.laure;
  const savedKey = localStorage.getItem("evoraa_dev_active_role") as DevRole;
  return savedKey && DEV_SESSIONS[savedKey] ? DEV_SESSIONS[savedKey] : DEV_SESSIONS.laure;
}

export function DevSessionSwitcher() {
  const [activeRole, setActiveRole] = React.useState<DevRole>("laure");
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem("evoraa_dev_active_role") as DevRole;
    if (saved && DEV_SESSIONS[saved]) {
      setActiveRole(saved);
    }
  }, []);

  const handleSwitch = (roleKey: DevRole) => {
    localStorage.setItem("evoraa_dev_active_role", roleKey);
    setActiveRole(roleKey);
    setIsOpen(false);
    // Reload window slightly to trigger updates across pages
    window.location.reload();
  };

  const currentSession = DEV_SESSIONS[activeRole];

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 font-sans">
      {isOpen && (
        <div className="w-72 rounded-2xl border border-border/80 bg-background/95 backdrop-blur-xl p-4 shadow-2xl space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between border-b border-border/40 pb-2">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5 text-accent" /> Sélecteur de Session Dev
            </span>
            <Badge variant="outline" className="text-[10px] uppercase border-accent/40 text-accent">
              Mode Test V1
            </Badge>
          </div>

          <p className="text-[11px] text-muted-foreground leading-tight">
            Basculez de compte en 1 clic pour tester le parcours utilisateur ou l&apos;interface d&apos;administration :
          </p>

          <div className="space-y-1.5">
            {(Object.keys(DEV_SESSIONS) as DevRole[]).map((key) => {
              const session = DEV_SESSIONS[key];
              const isSelected = activeRole === key;
              return (
                <button
                  key={key}
                  onClick={() => handleSwitch(key)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all ${
                    isSelected
                      ? "bg-accent/15 border border-accent/40 text-foreground font-semibold"
                      : "hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="shrink-0 text-base">
                      {session.role === "admin" ? "👑" : session.status === "pending" ? "🚨" : "👩‍💼"}
                    </span>
                    <div className="truncate">
                      <p className="truncate text-foreground font-medium">{session.name}</p>
                      <p className="truncate text-[10px] text-muted-foreground">{session.email}</p>
                    </div>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-accent shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="pt-1 border-t border-border/40 text-[10px] text-muted-foreground text-center">
            Idéal avec <code className="text-accent bg-secondary px-1 py-0.5 rounded">supabase/seed.sql</code>
          </div>
        </div>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="sm"
        className="h-10 px-3.5 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground border border-accent/30 flex items-center gap-2 text-xs font-medium"
      >
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Session : <b>{currentSession.role === "admin" ? "👑 Admin" : "👩‍💼 Laure"}</b></span>
      </Button>
    </div>
  );
}
