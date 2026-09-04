import { useMemo } from "react";
import { Link } from "react-router-dom";
import { SchoolShell } from "@/layouts/SchoolShell";
import { useSubscription } from "@/modules/subscription/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { CurrentPlanCard } from "@/components/subscription/CurrentPlanCard";
import { AppIcon } from "shared/ui/AppIcon";

export function AdminSubscriptionPage() {
  const { current, isLoading } = useSubscription();
  const { user } = useAuth();

  const sub = current?.subscription;
  const studentsUsed = current?.students_used ?? 0;
  const isOwner = user?.role === "owner";

  const isExpired = sub?.status === "expired" || sub?.status === "cancelled" || sub?.status === "suspended";
  const isActive = sub?.status === "active" || sub?.status === "trial";

  const allowedModulesList = useMemo(() => {
    if (!current?.allowed_modules) return [];
    return Object.entries(current.allowed_modules)
      .filter(([_, allowed]) => allowed)
      .map(([mod]) => mod);
  }, [current?.allowed_modules]);

  if (isLoading) {
    return (
      <SchoolShell eyebrow="Administration" title="Subscription Status">
        <div className="space-y-6 max-w-5xl mx-auto animate-pulse p-4">
          <div className="h-8 w-64 bg-slate-200 rounded-lg" />
          <div className="h-36 bg-white border border-slate-200 rounded-2xl p-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-white border border-slate-200 rounded-2xl" />
            <div className="h-48 bg-white border border-slate-200 rounded-2xl" />
          </div>
        </div>
      </SchoolShell>
    );
  }

  return (
    <SchoolShell eyebrow="Administration" title="Subscription Status">
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              School Subscription
            </h1>
            <p className="mt-1 text-sm text-slate-500 font-medium">
              View your school's current plan status, student seat allocation, and enabled modules.
            </p>
          </div>

          {isOwner && (
            <Link
              to="/owner/subscription"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all active:scale-95"
            >
              <span>Manage Billing as Owner</span>
              <AppIcon name="ChevronRight" size={14} />
            </Link>
          )}
        </div>

        {/* Central Owner Governance Notice */}
        <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/70 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex items-start gap-4 relative z-10">
            <div className="h-11 w-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
              <AppIcon name="ShieldCheck" size={22} />
            </div>
            <div className="space-y-1.5 flex-1 min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Subscription Managed by School Owner</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700">
                  Centralized
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Your school's subscription plan, student capacity limit, billing renewals, and feature packages are managed centrally by the <strong>School Owner</strong>.
              </p>
              <p className="text-xs text-slate-500 font-medium pt-1">
                Need to add more students or unlock additional premium modules? Please contact your School Owner or administrator.
              </p>
            </div>
          </div>
        </div>

        {/* Current Plan & Student Usage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CurrentPlanCard current={current} subscription={sub ?? null} studentsUsed={studentsUsed} />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-center shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student Capacity</h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isActive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
              }`}>
                {isActive ? "Active Plan" : "Inactive"}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-extrabold text-slate-900 tabular-nums">{studentsUsed}</span>
              <span className="text-xs font-semibold text-slate-400">/ {sub?.student_limit || 0} students</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3 mb-2.5 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  !sub
                    ? "bg-slate-200"
                    : studentsUsed >= (sub.student_limit || 0)
                    ? "bg-rose-500"
                    : studentsUsed >= (sub.student_limit || 0) * 0.85
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${Math.min(100, sub?.student_limit ? (studentsUsed / sub.student_limit) * 100 : 0)}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>{sub?.student_limit ? Math.round((studentsUsed / sub.student_limit) * 100) : 0}% capacity used</span>
              <span>{sub?.student_limit ? Math.max(0, sub.student_limit - studentsUsed) : 0} seats left</span>
            </div>
          </div>
        </div>

        {/* Enabled Features Summary */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <AppIcon name="Layers" size={16} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Included Modules & Features</h3>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {allowedModulesList.length > 0 ? `${allowedModulesList.length} Modules Active` : "All Core Modules Active"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              "Student Directory",
              "Teacher Management",
              "Classes & Timetable",
              "Attendance Tracking",
              "Homework & Exams",
              "Results & Marksheets",
              "Fee Collection",
              "Announcements",
              "Parent & Student Portals",
              "Certificates",
              "Question Bank",
              "Live Classes",
            ].map((moduleName) => (
              <div
                key={moduleName}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-700"
              >
                <AppIcon name="CheckCircle" size={14} className="text-emerald-600 shrink-0" />
                <span className="truncate">{moduleName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SchoolShell>
  );
}

export default AdminSubscriptionPage;
