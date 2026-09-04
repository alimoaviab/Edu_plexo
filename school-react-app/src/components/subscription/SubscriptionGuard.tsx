import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/modules/subscription/hooks/useSubscription";
import { SubscriptionRequired } from "./SubscriptionRequired";

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

/**
 * SubscriptionGuard gates the app on the BACKEND-derived subscription state
 * (`phase`). Grace periods stay operational (strong warning); suspension
 * shows the lock screen with a recovery path for owners.
 */
export function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const { current, isLoading } = useSubscription();
  const { user } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  // Exempt auth routes, subscription setup routes, and school onboarding routes
  const isExempt =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/owner/subscription") ||
    pathname.startsWith("/admin/subscription") ||
    pathname.startsWith("/owner/schools");

  const isSuperAdmin = user?.role === "super_admin";

  if (isLoading && !isExempt && !isSuperAdmin) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  const phase = current?.phase ?? (current?.subscription?.status === "trial" ? "trial_active" : current?.subscription?.status);
  // Open: active, trial, expiring, grace (warning banner shown separately).
  const isOpen = phase === "active" || phase === "trial_active" || phase === "trial_expiring" || phase === "expiring" || phase === "grace";
  // Locked: expired (outside grace), suspended, no subscription at all.
  const isLocked = !isOpen && phase !== undefined && phase !== "";

  if (!isSuperAdmin && !isExempt && isLocked) {
    return <SubscriptionRequired current={current} />;
  }

  return <>{children}</>;
}