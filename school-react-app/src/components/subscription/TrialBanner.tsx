import { Link } from "react-router-dom";
import { AppIcon } from "shared/ui/AppIcon";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/modules/subscription/hooks/useSubscription";

export function TrialBanner() {
  const { user } = useAuth();
  const { current } = useSubscription();

  const sub = current?.subscription;
  const isTrial = sub?.status === "trial";
  const isAdmin = user?.role === "admin";
  const daysRemaining = current?.days_remaining ?? 0;

  if (!isTrial) return null;

  return (
    <div className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-4 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in-up">
      {/* Decorative background shapes */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/5 rounded-full pointer-events-none" />

      <div className="flex items-center gap-3">
        <div className="h-9 w-9 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
          <AppIcon name="Gift" size={20} className="text-yellow-300" />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-black tracking-wide uppercase text-blue-100">
            Free Trial Period
          </h4>
          <p className="text-[11px] md:text-xs font-semibold leading-normal mt-0.5">
            You are currently on a <strong className="text-white">Free Trial</strong> with all features unlocked. You have <strong className="text-yellow-300 font-extrabold">{daysRemaining} days remaining</strong>.
          </p>
        </div>
      </div>

      {isAdmin && (
        <Link
          to="/admin/subscription"
          className="self-start sm:self-auto h-9 px-5 bg-white text-blue-700 font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-black/10 hover:bg-slate-50 transition active:scale-95 cursor-pointer shrink-0"
        >
          <span>Upgrade Now</span>
          <AppIcon name="Zap" size={12} className="text-yellow-500 fill-yellow-500" />
        </Link>
      )}
    </div>
  );
}
