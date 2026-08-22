import { AppIcon } from "shared/ui/AppIcon";
import { Card } from "./Card";

type DataStateVariant = "loading" | "empty" | "error" | "success" | "info";

const variantTokens: Record<
  DataStateVariant,
  { icon: string; iconColor: string; iconBg: string; titleColor: string }
> = {
  loading: { icon: "progress_activity", iconColor: "text-primary", iconBg: "bg-primary/10", titleColor: "text-text-primary" },
  empty: { icon: "inbox", iconColor: "text-text-muted", iconBg: "bg-surface-muted", titleColor: "text-text-primary" },
  error: { icon: "error", iconColor: "text-error", iconBg: "bg-error/10", titleColor: "text-error" },
  success: { icon: "check_circle", iconColor: "text-success", iconBg: "bg-success/10", titleColor: "text-success" },
  info: { icon: "info", iconColor: "text-primary", iconBg: "bg-primary/10", titleColor: "text-text-primary" },
};

export interface DataStateProps {
  variant: DataStateVariant;
  title: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: string;
  inline?: boolean;
}

export function DataState({
  variant,
  title,
  message,
  onRetry,
  retryLabel = "Try again",
  icon,
  inline = false,
}: DataStateProps) {
  const tokens = variantTokens[variant];
  const iconName = icon ?? tokens.icon;
  const isSpinning = variant === "loading";

  const inner = (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-8 text-center md:px-6 md:py-10 text-text-primary">
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tokens.iconBg}`}>
        <AppIcon name={iconName} size={26} className={` text-[26px] ${tokens.iconColor} ${isSpinning ? "animate-spin" : ""}`}
          aria-hidden="true" />
      </div>
      <div className="space-y-1.5">
        <h3 className={`text-base font-bold tracking-tight ${tokens.titleColor}`}>{title}</h3>
        {message && (
          <p className="mx-auto max-w-md text-sm leading-relaxed text-text-secondary">{message}</p>
        )}
      </div>
      {variant === "error" && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-error/10 px-4 py-2 text-sm font-semibold text-error transition-colors hover:bg-error/20"
        >
          <AppIcon name="RefreshCw" size={18} />
          {retryLabel}
        </button>
      )}
    </div>
  );

  if (inline) return inner;

  return <Card className="border-dashed">{inner}</Card>;
}
