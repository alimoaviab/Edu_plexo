import { AppIcon } from "shared/ui/AppIcon";
import type { Subscription } from "@/modules/subscription/services/subscription.service";

interface CurrentPlanCardProps {
  subscription: Subscription | null;
  studentsUsed: number;
}

export function CurrentPlanCard({ subscription, studentsUsed }: CurrentPlanCardProps) {
  const isTrial = subscription?.status === "trial";
  const isActive = subscription?.status === "active";
  const isExpired = subscription?.status === "expired" || subscription?.status === "cancelled";
  const planName = subscription?.plan_name ?? "";

  function getPlanDisplayName(name: string): string {
    const map: Record<string, string> = {
      plan_starter: "Starter Plan",
      starter: "Starter Plan",
      plan_growth: "Growth Plan",
      growth: "Growth Plan",
      plan_basic: "Basic Plan",
      basic: "Basic Plan",
      plan_standard: "Standard Plan",
      standard: "Standard Plan",
      plan_premium: "Premium Plan",
      premium: "Premium Plan",
      plan_enterprise: "Enterprise Plan",
      enterprise: "Enterprise Plan",
      plan_custom: "Custom Plan",
      custom: "Custom Plan",
    };
    if (map[name]) return map[name];
    if (name && name.includes(",")) return "Custom Built Plan";
    if (name) return name.charAt(0).toUpperCase() + name.slice(1);
    return "No Active Plan";
  }

  const daysRemaining = subscription?.end_date 
    ? Math.max(0, Math.ceil((new Date(subscription.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 14;

  const isGradient = isTrial || isActive;

  return (
    <div
      className={`rounded-2xl border p-6 sm:p-8 flex flex-col sm:flex-row sm:items-start justify-between gap-6 h-full transition-all relative overflow-hidden shadow-sm ${
        isTrial
          ? "bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 border-blue-500 text-white shadow-lg shadow-blue-600/20"
          : isActive
          ? "bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border-slate-700 text-white shadow-xl"
          : "bg-white border-slate-200/90 text-slate-900"
      }`}
    >
      {/* Subtle background glow for gradient cards */}
      {isGradient && (
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      )}

      {subscription ? (
        <div className="space-y-4 flex-1 text-left relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${isGradient ? "text-white" : "text-slate-900"}`}>
              {isTrial ? "14-Day Free Trial" : getPlanDisplayName(planName)}
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm ${
                isActive
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                  : isTrial
                  ? "bg-white/20 text-white border border-white/30 backdrop-blur-sm"
                  : "bg-rose-100 text-rose-700 border border-rose-200"
              }`}
            >
              {isTrial ? (
                <AppIcon name="Clock" size={13} className="text-amber-300" />
              ) : isActive ? (
                <AppIcon name="CheckCircle" size={13} className="text-emerald-400" />
              ) : (
                <AppIcon name="AlertCircle" size={13} className="text-rose-500" />
              )}
              <span>{isTrial ? `${daysRemaining} Days Remaining` : isActive ? "Active License" : "Expired / Suspended"}</span>
            </span>
          </div>

          {isTrial ? (
            <div className="space-y-3">
              <p className="text-blue-100 text-xs font-semibold flex items-center gap-2">
                <AppIcon name="ShieldCheck" size={14} className="text-blue-300" />
                <span>Full platform modules unlocked · No paid plan active</span>
              </p>
              {subscription.end_date && (
                <p className="text-blue-200 text-xs font-medium flex items-center gap-2">
                  <AppIcon name="Calendar" size={14} className="text-blue-300" />
                  <span>
                    Trial expires on:{" "}
                    <strong className="text-white font-bold">
                      {new Date(subscription.end_date).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}
                    </strong>
                  </span>
                </p>
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                {["All Modules Included", "Unlimited Teachers", "Parent Portal App", "Student LMS", "Analytics & Reports"].map((f) => (
                  <span
                    key={f}
                    className="text-[11px] font-semibold bg-white/15 text-white/95 px-3 py-1 rounded-full border border-white/15 flex items-center gap-1.5 shadow-sm"
                  >
                    <AppIcon name="Check" size={11} className="text-yellow-300" />
                    <span>{f}</span>
                  </span>
                ))}
              </div>
            </div>
          ) : isActive ? (
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {subscription.price === 0 ? "Free" : `PKR ${subscription.price.toLocaleString()}`}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-400">/month · Auto-renews</span>
              </div>
              {subscription.end_date && (
                <p className="text-xs text-slate-300 flex items-center gap-2">
                  <AppIcon name="Calendar" size={14} className="text-indigo-300" />
                  <span>
                    Next billing date:{" "}
                    <strong className="text-white font-bold">
                      {new Date(subscription.end_date).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}
                    </strong>
                  </span>
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-rose-600 font-semibold">
                Your subscription has lapsed. Please upgrade or renew your plan below to restore uninterrupted school access.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2 text-left relative z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">No Active License</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
              Pending Activation
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-md">
            Your school institution does not have an active subscription package. Choose a plan below to activate your free trial or licensed capacity.
          </p>
        </div>
      )}

      <div
        className={`h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 self-start sm:self-center shadow-sm relative z-10 ${
          isTrial
            ? "bg-white/20 text-white border border-white/25"
            : isActive
            ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30"
            : "bg-blue-50 text-blue-600 border border-blue-100"
        }`}
      >
        <AppIcon name={isTrial ? "Gift" : isActive ? "ShieldCheck" : "CreditCard"} size={28} />
      </div>
    </div>
  );
}
