import { AppIcon } from "shared/ui/AppIcon";
import type { CurrentSubscription } from "@/modules/subscription/services/subscription.service";

interface CurrentPlanCardProps {
  current?: CurrentSubscription | null;
  subscription: import("@/modules/subscription/services/subscription.service").Subscription | null;
  studentsUsed: number;
}

function planDisplayName(name: string): string {
  const map: Record<string, string> = {
    trial: "Free Trial",
    plan_starter: "Starter Plan",
    starter: "Starter Plan",
    plan_growth: "Growth Plan",
    growth: "Growth Plan",
    plan_premium: "Premium Plan",
    premium: "Premium Plan",
    plan_custom: "Custom Plan",
    custom: "Custom Plan",
  };
  if (map[name]) return map[name];
  if (name) return name.charAt(0).toUpperCase() + name.slice(1);
  return "No Active Plan";
}

function formatDate(value?: string): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" });
}

/**
 * CurrentPlanCard renders ONLY backend-derived state: `phase`,
 * `days_remaining`, `renews_at`, `trial_ends_at`, `grace_ends_at`,
 * `payment_status`, `next_plan`. No hardcoded durations or lifecycle text.
 */
export function CurrentPlanCard({ current, subscription, studentsUsed }: CurrentPlanCardProps) {
  const phase = current?.phase ?? (subscription?.status === "trial" ? "trial_active" : subscription?.status || "expired");
  const daysRemaining = current?.days_remaining ?? 0;
  const isTrialPhase = phase === "trial_active" || phase === "trial_expiring" || phase === "trial_expired";
  const isActivePhase = phase === "active";
  const isLapsed = phase === "expired" || phase === "grace" || phase === "suspended" || phase === "trial_expired";
  const planName = subscription?.plan_name ?? "";

  const isGradient = isTrialPhase || isActivePhase;
  const renewsAt = isTrialPhase ? current?.trial_ends_at || subscription?.end_date : current?.renews_at || subscription?.end_date;
  const scheduledPlan = current?.next_plan ? planDisplayName(current.next_plan) : "";
  const paymentApproved = current?.payment_status === "approved";

  const statusMeta: Record<string, { label: string; icon: string; cls: string }> = {
    trial_active: { label: `${daysRemaining} ${daysRemaining === 1 ? "Day" : "Days"} Trial Remaining`, icon: "Clock", cls: "bg-white/20 text-white border border-white/30" },
    trial_expiring: { label: `Trial ends in ${daysRemaining}d`, icon: "AlertTriangle", cls: "bg-amber-500/25 text-amber-200 border border-amber-400/40" },
    trial_expired: { label: "Trial Expired", icon: "AlertCircle", cls: "bg-rose-500/25 text-rose-300 border border-rose-400/40" },
    active: { label: `${daysRemaining} ${daysRemaining === 1 ? "Day" : "Days"} Remaining`, icon: "CheckCircle", cls: "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30" },
    expiring: { label: `Expires in ${daysRemaining}d — renew now`, icon: "AlertTriangle", cls: "bg-amber-500/25 text-amber-200 border border-amber-400/40" },
    grace: { label: `Grace ends ${formatDate(current?.grace_ends_at)}`, icon: "AlertTriangle", cls: "bg-rose-500/25 text-rose-300 border border-rose-400/40" },
    expired: { label: "Expired", icon: "AlertCircle", cls: "bg-rose-100 text-rose-700 border border-rose-200" },
    suspended: { label: "Suspended", icon: "Ban", cls: "bg-rose-100 text-rose-800 border border-rose-300" },
  };
  const meta = statusMeta[phase] || statusMeta.expired;

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-5 h-full transition-all relative overflow-hidden shadow-sm ${
        isTrialPhase
          ? "bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 border-blue-500 text-white shadow-lg shadow-blue-600/20"
          : isActivePhase
          ? "bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border-slate-700 text-white shadow-xl"
          : isLapsed
          ? "bg-gradient-to-br from-rose-950 via-slate-900 to-slate-900 border-rose-700/60 text-white shadow-xl"
          : "bg-white border-slate-200/90 text-slate-900"
      }`}
    >
      {isGradient && <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />}

      {subscription || current ? (
        <div className="space-y-3 flex-1 text-left relative z-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isGradient || isLapsed ? "text-white" : "text-slate-900"}`}>
              {isTrialPhase ? "Free Trial" : planDisplayName(planName)}
            </h2>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 shadow-sm ${meta.cls}`}>
              <AppIcon name={meta.icon} size={12} />
              <span>{meta.label}</span>
            </span>
            {paymentApproved && scheduledPlan && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/25 text-indigo-200 border border-indigo-400/40">
                {scheduledPlan} scheduled
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs">
            {subscription && subscription.price > 0 && (
              <span className={`font-black text-lg ${isGradient || isLapsed ? "text-white" : "text-slate-900"}`}>
                PKR {subscription.price.toLocaleString()}
                <span className="text-[11px] font-semibold text-slate-400">/month</span>
              </span>
            )}
            {renewsAt && daysRemaining > 0 && (
              <span className={`flex items-center gap-1.5 ${isGradient || isLapsed ? "text-slate-300" : "text-slate-500"}`}>
                <AppIcon name="Calendar" size={13} />
                {isTrialPhase ? "Trial ends: " : "Renews: "}
                <strong className={isGradient || isLapsed ? "text-white" : "text-slate-900"}>{formatDate(renewsAt)}</strong>
              </span>
            )}
            {isLapsed && current?.grace_ends_at && phase !== "suspended" && (
              <span className="text-rose-300 font-bold">
                Suspension in {Math.max(0, Math.ceil((new Date(current.grace_ends_at).getTime() - Date.now()) / 86400000))}d
              </span>
            )}
          </div>

          {paymentApproved && scheduledPlan && (
            <p className={`text-xs font-semibold ${isTrialPhase ? "text-blue-200" : "text-indigo-300"}`}>
              Payment approved — {scheduledPlan} will activate {isTrialPhase ? "after your trial ends" : "now"}.
            </p>
          )}
          {phase === "grace" && (
            <p className="text-xs font-semibold text-rose-300">
              Subscription expired. Your account will be suspended in{" "}
              {Math.max(0, Math.ceil((new Date(current?.grace_ends_at || "").getTime() - Date.now()) / 86400000))} day(s) unless renewed.
            </p>
          )}
          {phase === "suspended" && (
            <p className="text-xs font-semibold text-rose-300">
              Your subscription has been suspended. Renew your plan to restore access.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2 text-left relative z-10">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">No Active License</h2>
          <p className="text-xs text-slate-500 font-medium max-w-md">
            Choose a plan below to activate your free trial or licensed capacity.
          </p>
        </div>
      )}

      <div
        className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 self-start sm:self-center shadow-sm relative z-10 ${
          isTrialPhase
            ? "bg-white/20 text-white border border-white/25"
            : isActivePhase
            ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30"
            : isLapsed
            ? "bg-rose-500/20 text-rose-300 border border-rose-400/30"
            : "bg-blue-50 text-blue-600 border border-blue-100"
        }`}
      >
        <AppIcon name={isTrialPhase ? "Gift" : isActivePhase ? "ShieldCheck" : "CreditCard"} size={22} />
      </div>
    </div>
  );
}