import type { HTMLAttributes } from "react";

type BadgeVariant = "primary" | "secondary" | "success" | "error" | "warning" | "gray";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = "gray", className = "", ...props }: BadgeProps) {
  const variants = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-surface-muted text-text-secondary border-border",
    success: "bg-success/10 text-success border-success/20",
    error: "bg-error/10 text-error border-error/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    gray: "bg-surface-muted text-text-muted border-border",
  };

  return (
    <span
      {...props}
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold normal-case tracking-[0.08em] ${variants[variant]} ${className}`}
    />
  );
}
