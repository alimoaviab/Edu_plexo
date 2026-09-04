import { useEffect, useState } from "react";
import { AppIcon } from "shared/ui/AppIcon";

interface ToastItem {
  id: number;
  kind: "success" | "error" | "info";
  message: string;
}

let nextId = 1;
let listeners: Array<(t: ToastItem | null) => void> = [];

function emit(toast: ToastItem | null) {
  listeners.forEach((l) => l(toast));
}

export function showToast(message: string, kind: "success" | "error" | "info" = "info") {
  emit({ id: nextId++, kind, message });
}

/** Renders the toast stack. Mount once in the layout. */
export function ToastHost() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener = (t: ToastItem | null) => {
      if (!t) return;
      setToasts((prev) => [...prev.slice(-3), t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 4000);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const styles: Record<ToastItem["kind"], string> = {
    success: "bg-emerald-600 border-emerald-500",
    error: "bg-rose-600 border-rose-500",
    info: "bg-slate-800 border-slate-700",
  };
  const icons: Record<ToastItem["kind"], string> = {
    success: "CheckCircle",
    error: "XCircle",
    info: "Info",
  };

  return (
    <div className="fixed bottom-5 right-5 z-[100] space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${styles[t.kind]} text-white text-xs font-semibold px-4 py-3 rounded-xl border shadow-lg flex items-center gap-2 max-w-sm animate-fade-in-up`}
        >
          <AppIcon name={icons[t.kind]} size={15} className="shrink-0" />
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}