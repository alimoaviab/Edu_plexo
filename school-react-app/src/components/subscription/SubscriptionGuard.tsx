import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/modules/subscription/hooks/useSubscription";
import { SubscriptionRequired } from "./SubscriptionRequired";

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const { current, isLoading } = useSubscription();
  const { user } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  // Exempt auth routes and subscription setup page routes
  const isExempt = 
    pathname.startsWith("/auth") || 
    pathname.startsWith("/admin/subscription");

  const isSuperAdmin = user?.role === "super_admin";

  if (isLoading && !isExempt && !isSuperAdmin) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  const sub = current?.subscription;
  const isActive = sub?.status === "active";
  const isTrial = sub?.status === "trial";

  const showLockScreen = !isSuperAdmin && !isExempt && !isActive && !isTrial;

  if (showLockScreen) {
    return <SubscriptionRequired current={current} />;
  }

  return <>{children}</>;
}
