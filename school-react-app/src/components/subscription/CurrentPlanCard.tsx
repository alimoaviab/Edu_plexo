import { AppIcon } from "shared/ui/AppIcon";
import type { Subscription } from "@/modules/subscription/services/subscription.service";

interface CurrentPlanCardProps {
  subscription: Subscription | null;
  studentsUsed: number;
}

export function CurrentPlanCard({ subscription, studentsUsed }: CurrentPlanCardProps) {
  const isTrial = subscription?.status === "trial";
  const planName = subscription?.plan_name ?? "";

  function getPlanDisplayName(name: string): string {
    const map: Record<string, string> = {
      basic: "Basic Plan",
      standard: "Standard Plan",
      premium: "Premium Plan",
      enterprise: "Enterprise Plan",
    };
    if (map[name]) return map[name];
    if (name && name.includes(",")) return "Custom Built Plan";
    if (name) return name.charAt(0).toUpperCase() + name.slice(1);
    return "—";
  }

  return (
    <div className={`rounded-2xl border p-8 flex items-start justify-between h-full ${
      isTrial ? "bg-gradient-to-br from-blue-600 to-indigo-700 border-blue-500 text-white shadow-lg shadow-blue-600/15" : "bg-white border-gray-200"
    }`}>
      {subscription ? (
        <div className="space-y-3 flex-1 text-left">
          <div className="flex items-center gap-3">
            <h2 className={`text-2xl font-black tracking-tight ${isTrial ? "text-white" : "text-gray-900"}`}>
              {isTrial ? "14-Day Free Trial" : getPlanDisplayName(planName)}
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
              subscription.status === "active" ? "bg-green-100 text-green-700" :
              isTrial ? "bg-white/20 text-white border border-white/30" :
              "bg-red-100 text-red-700"
            }`}>
              {isTrial && <AppIcon name="PartyPopper" size={12} className="text-white" />}
              <span>{isTrial ? "Active Trial" : subscription.status.toUpperCase()}</span>
            </span>
          </div>

          {isTrial && (
            <div className="space-y-2">
              <p className="text-blue-100 text-xs font-semibold">
                All features unlocked · Up to <strong className="text-white">200 students</strong>
              </p>
              <p className="text-blue-200 text-xs font-semibold">
                Trial ends: <strong className="text-white">{new Date(subscription.end_date).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}</strong>
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {["All Modules", "Unlimited Teachers", "Parent Portal", "Student Portal", "Reports & Analytics"].map((f) => (
                  <span key={f} className="text-[10px] font-bold bg-white/15 text-white/95 px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1 shadow-sm">
                    <AppIcon name="Check" size={10} className="text-yellow-300" />
                    <span>{f}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {!isTrial && (
            <div className="text-3xl font-black text-gray-900 flex items-baseline gap-1">
              <span>{subscription.price === 0 ? "Free" : `PKR ${subscription.price.toLocaleString()}`}</span>
              <span className="text-sm font-semibold text-gray-400">/month</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2 text-left">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">No Active Plan</h2>
          <p className="text-xs text-gray-500 font-semibold leading-relaxed">
            Subscribe to a plan or start your Free Trial to get started managing your school.
          </p>
        </div>
      )}

      <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 ml-4 ${
        isTrial ? "bg-white/15 text-white border border-white/20" : "bg-blue-50 text-blue-600 border border-blue-100"
      }`}>
        <AppIcon name={isTrial ? "Gift" : "Shield"} size={28} />
      </div>
    </div>
  );
}
