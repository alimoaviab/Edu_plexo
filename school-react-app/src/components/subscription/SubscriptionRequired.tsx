import { useNavigate } from "react-router-dom";
import { AppIcon } from "shared/ui/AppIcon";
import { useAuth } from "@/hooks/useAuth";
import type { CurrentSubscription } from "@/modules/subscription/services/subscription.service";

interface SubscriptionRequiredProps {
  current?: CurrentSubscription | null;
}

export function SubscriptionRequired({ current }: SubscriptionRequiredProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const sub = current?.subscription;
  // If sub is null or has status pending, they never trialed. If status is expired/cancelled, they did.
  const isExpired = sub?.status === "expired" || sub?.status === "cancelled";
  const isAdmin = user?.role === "admin";

  const title = isExpired 
    ? "Your Free Trial Has Expired" 
    : "Please Choose Your Plan";

  const description = isExpired
    ? "Please choose a subscription plan to continue using Eduplexo."
    : "You have not activated your Free Trial or Subscription. Please choose a plan to continue.";

  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[70vh] bg-slate-50/50 p-6 md:p-12 animate-fade-in-up">
      <div className="w-full max-w-md text-center bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md ${
          isExpired ? "bg-rose-50 text-rose-500" : "bg-blue-50 text-blue-600"
        }`}>
          <AppIcon name={isExpired ? "AlertTriangle" : "Lock"} size={32} />
        </div>

        <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mb-3">
          {title}
        </h1>
        
        <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed mb-8">
          {description}
        </p>

        {isAdmin ? (
          <button
            onClick={() => navigate("/admin/subscription")}
            className="w-full h-11 md:h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs md:text-sm tracking-wide shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Choose Plan</span>
            <AppIcon name="ChevronRight" size={16} />
          </button>
        ) : (
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <p className="text-[11px] font-semibold text-slate-500 leading-normal flex items-center gap-1.5 justify-center">
              <AppIcon name="Lock" size={12} className="text-slate-400 shrink-0" />
              <span>Please contact your school administrator to activate or renew the subscription.</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
