"use client";

import * as React from "react";
import { Sparkles, X, Check, AlertCircle, Info } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";

export interface CompanionProps {
  title?: string;
  message: string | React.ReactNode;
  variant?: "default" | "suggestion" | "reflection" | "reassurance";
  onClose?: () => void;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  }[];
  className?: string;
}

export function EvaCompanion({
  title = "EVA",
  message,
  variant = "default",
  onClose,
  actions,
  className,
}: CompanionProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "suggestion":
        return "border-accent/40 bg-accent/5 dark:bg-accent/10";
      case "reflection":
        return "border-amber-500/40 bg-amber-500/5 dark:bg-amber-500/10";
      case "reassurance":
        return "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10";
      default:
        return "border-border/60 bg-background/80 backdrop-blur-md";
    }
  };

  const getIcon = () => {
    switch (variant) {
      case "suggestion":
        return <Sparkles className="h-5 w-5 text-accent animate-pulse" />;
      case "reflection":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "reassurance":
        return <Check className="h-5 w-5 text-emerald-500" />;
      default:
        return <Sparkles className="h-5 w-5 text-accent" />;
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl border p-5 shadow-sm transition-all duration-300",
        getVariantStyles(),
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background/80 shadow-xs border border-border/40">
          {getIcon()}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {title}
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="rounded-full p-1 text-muted-foreground hover:bg-accent/10 hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Fermer</span>
              </button>
            )}
          </div>
          <div className="text-sm leading-relaxed text-foreground font-normal">
            {message}
          </div>
          {actions && actions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 pt-1">
              {actions.map((action, idx) => (
                <Button
                  key={idx}
                  size="sm"
                  variant={action.variant || "outline"}
                  onClick={action.onClick}
                  className="rounded-lg text-xs h-8 px-3"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Alias to satisfy both names (EVA vs KELIAA) seamlessly
export const KeliaCompanion = EvaCompanion;
