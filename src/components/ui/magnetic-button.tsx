"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function MagneticButton({
  children,
  href,
  onClick,
  className,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
}: MagneticButtonProps) {
  const sizeClasses = {
    sm: "px-5 py-2.5 text-xs rounded-md",
    md: "px-7 py-3.5 text-sm rounded-md",
    lg: "px-9 py-4 text-base rounded-md font-semibold",
  };

  const variantClasses = {
    primary:
      "bg-primary text-primary-foreground font-semibold shadow-premium border border-primary/20",
    secondary:
      "bg-secondary/80 backdrop-blur-md text-foreground font-medium border border-border/80 hover:border-border",
    outline:
      "bg-transparent border border-primary/40 text-primary font-medium hover:bg-primary/5 hover:border-primary",
    ghost: "bg-transparent text-foreground/80 font-medium hover:text-foreground hover:bg-secondary/50",
  };

  const content = (
    <span className="relative z-10 flex items-center justify-center gap-2">
      {children}
    </span>
  );

  const baseClassName = cn(
    "group relative inline-flex items-center justify-center overflow-hidden transition-all duration-500 select-none cursor-pointer",
    "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
    "[transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)]",
    sizeClasses[size],
    variantClasses[variant],
    disabled && "opacity-50 pointer-events-none cursor-not-allowed",
    className
  );

  if (href) {
    return (
      <Link href={href} className={baseClassName}>
        <span
          className={cn(
            "absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
            variant === "primary" ? "bg-white/10" : "bg-primary/5"
          )}
        />
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClassName}
    >
      <span
        className={cn(
          "absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          variant === "primary" ? "bg-white/10" : "bg-primary/5"
        )}
      />
      {content}
    </button>
  );
}
