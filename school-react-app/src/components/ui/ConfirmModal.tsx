import { AppIcon } from "shared/ui/AppIcon";
import { useEffect, useState } from "react";

export type ConfirmVariant = "danger" | "primary" | "warning";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  note?: string;
  itemName?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ConfirmVariant;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const variantTokens: Record<
  ConfirmVariant,
  { iconBg: string; iconColor: string; iconName: string; button: string }
> = {
  danger: {
    iconBg: "bg-error/10",
    iconColor: "text-error",
    iconName: "delete_forever",
    button:
      "bg-error hover:opacity-90 hover:shadow-lg hover:shadow-error/20 focus-visible:ring-2 focus-visible:ring-error/30 text-white",
  },
  primary: {
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    iconName: "help",
    button:
      "bg-primary hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/20 focus-visible:ring-2 focus-visible:ring-primary/30 text-white",
  },
  warning: {
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    iconName: "warning",
    button:
      "bg-warning hover:opacity-90 hover:shadow-lg hover:shadow-warning/20 focus-visible:ring-2 focus-visible:ring-warning/30 text-white",
  },
};

export function ConfirmModal({
  isOpen,
  title,
  message,
  note,
  itemName,
  confirmLabel,
  cancelLabel = "Cancel",
  confirmVariant = "danger",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [show, setShow] = useState(false);
  const tokens = variantTokens[confirmVariant];
  const finalConfirmLabel =
    confirmLabel ?? (confirmVariant === "danger" ? "Delete" : "Continue");

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onCancel();
    };
    if (isOpen) {
      setIsAnimating(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setShow(true));
      });
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      setShow(false);
      const timer = setTimeout(() => setIsAnimating(false), 200);
      document.body.style.overflow = "";
      return () => {
        clearTimeout(timer);
        document.removeEventListener("keydown", handleEscape);
      };
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-description"
    >
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
          show ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => !isLoading && onCancel()}
      />
      <div
        className={`relative bg-surface border border-border text-text-primary rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-200 ${
          show ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${tokens.iconBg}`}
          >
            <AppIcon name={tokens.iconName} size={24} className={` ${tokens.iconColor} `} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 id="confirm-modal-title" className="text-lg font-bold text-text-primary leading-tight">
              {title}
            </h3>
            <p
              id="confirm-modal-description"
              className="text-sm text-text-secondary mt-1.5 leading-relaxed break-words"
            >
              {message}
            </p>
            {itemName && (
              <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-lg border border-border bg-surface-muted px-3 py-1.5">
                <AppIcon name="Label" size={15} className="text-text-muted" />
                <span className="text-[13px] font-semibold text-text-primary truncate">{itemName}</span>
              </div>
            )}
            {note && (
              <p className="mt-3 text-xs text-text-muted leading-relaxed">{note}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-border">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2.5 text-sm font-semibold text-text-secondary bg-surface-muted hover:bg-surface-hover hover:text-text-primary rounded-xl transition-colors disabled:opacity-50 border border-border/60"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed ${tokens.button}`}
          >
            {isLoading && (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {isLoading ? "Working…" : finalConfirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
