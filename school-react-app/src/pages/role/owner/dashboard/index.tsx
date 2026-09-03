import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AppIcon } from "shared/ui/AppIcon";
import { serviceRequest } from "@/services/service-client";
import { SchoolShell } from "@/layouts/SchoolShell";
import { STALE_TIME_DASHBOARD } from "@/lib/query-client";
import { useTenantContext } from "@/hooks/useTenantContext";
import { toast } from "@/utils/toast";

export default function OwnerDashboardPage() {
  const { schoolId } = useTenantContext();
  const navigate = useNavigate();

  // 1. Fetch dashboard top-level stats
  const { data: stats, isLoading: statsLoading } = useQuery<any>({
    queryKey: ["dashboard", "owner", schoolId],
    queryFn: async () => {
      const res = await serviceRequest<any>("/api/owner/dashboard");
      if (!res.ok) {
        throw new Error(res.error?.message || "Failed to load dashboard stats");
      }
      return res.data;
    },
    staleTime: STALE_TIME_DASHBOARD,
    gcTime: 30 * 60 * 1000,
  });

  // 2. Fetch detailed school portfolio metrics (classes, students, fees)
  const { data: schoolsData } = useQuery<any[]>({
    queryKey: ["owner-schools"],
    queryFn: async () => {
      const res = await serviceRequest<any[]>("/api/owner/schools");
      if (res.ok && Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    },
    staleTime: STALE_TIME_DASHBOARD,
    gcTime: 30 * 60 * 1000,
  });

  const loading = statsLoading && !stats;
  const schools = schoolsData && schoolsData.length > 0 ? schoolsData : (stats?.schools || []);

  const totalFeeCollected = schools.reduce(
    (sum: number, s: any) => sum + (Number(s.total_fee_collected) || 0),
    0
  );
  const totalFeePending = schools.reduce(
    (sum: number, s: any) => sum + (Number(s.total_fee_pending) || 0),
    0
  );

  const totalCampuses = stats?.total_campuses || schools.length || 0;
  const totalStudents = stats?.total_students || schools.reduce((sum: number, s: any) => sum + (Number(s.student_count) || 0), 0);
  const totalTeachers = stats?.total_teachers || schools.reduce((sum: number, s: any) => sum + (Number(s.teacher_count) || 0), 0);
  const totalStaff = stats?.total_staff || 0;
  const activeSubs = stats?.active_subscriptions ?? (schools.length > 0 ? schools.length : 0);

  const handleSwitchToCampus = (school: any) => {
    const sId = school.school_id || school._id || school.id;
    if (sId) {
      localStorage.setItem("active_school_id", sId);
      localStorage.setItem("active_branch_id", `cmp_${sId}`);
      window.dispatchEvent(new Event("auth-changed"));
      toast.success(`Switched active context to ${school.name}`);
      navigate("/admin/dashboard");
    }
  };

  if (loading) {
    return (
      <SchoolShell eyebrow="Owner Portal" title="Executive Command Center">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      </SchoolShell>
    );
  }

  const kpis = [
    {
      title: "Educational Campuses",
      value: totalCampuses,
      subtitle: `${schools.length} Active Institutions`,
      icon: "Building2",
      iconBg: "bg-blue-50 text-blue-600 border-blue-100",
      accent: "from-blue-600 to-indigo-600",
      href: "/owner/schools",
    },
    {
      title: "Enrolled Students",
      value: totalStudents.toLocaleString(),
      subtitle: totalCampuses > 0 ? `Avg ${Math.round(totalStudents / totalCampuses)} / branch` : "Across all branches",
      icon: "GraduationCap",
      iconBg: "bg-purple-50 text-purple-600 border-purple-100",
      accent: "from-purple-600 to-violet-600",
      href: "/owner/schools",
    },
    {
      title: "Academic Faculty",
      value: totalTeachers.toLocaleString(),
      subtitle: totalTeachers > 0 ? `${Math.round(totalStudents / Math.max(1, totalTeachers))}:1 Student Ratio` : "Teaching Staff",
      icon: "BookOpen",
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
      accent: "from-emerald-600 to-teal-600",
      href: "/owner/schools",
    },
    {
      title: "Staff & Admins",
      value: (totalStaff || totalTeachers + schools.length).toLocaleString(),
      subtitle: "Operations & Admin",
      icon: "Users",
      iconBg: "bg-amber-50 text-amber-600 border-amber-100",
      accent: "from-amber-600 to-orange-600",
    },
    {
      title: "Active Licenses",
      value: activeSubs,
      subtitle: stats?.expiring_subscriptions ? `${stats.expiring_subscriptions} renewal due` : "All tiers healthy",
      icon: "ShieldCheck",
      iconBg: "bg-cyan-50 text-cyan-600 border-cyan-100",
      accent: "from-cyan-600 to-blue-600",
      href: "/owner/subscription",
    },
    {
      title: "Total Fee Collected",
      value: `Rs. ${totalFeeCollected.toLocaleString()}`,
      subtitle: totalFeePending > 0 ? `Rs. ${totalFeePending.toLocaleString()} pending` : "Portfolio Revenue",
      icon: "Wallet",
      iconBg: "bg-rose-50 text-rose-600 border-rose-100",
      accent: "from-rose-600 to-pink-600",
      href: "/owner/subscription",
    },
  ];

  return (
    <SchoolShell eyebrow="Owner Portal" title="Executive Command Center">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 1. Executive Welcome & Quick Action Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-7 sm:p-9 text-white shadow-xl shadow-slate-900/10 border border-slate-800">
          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold backdrop-blur-sm border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Multi-Campus Network • Executive Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Institution Portfolio Overview
              </h1>
              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                Oversee admissions, academic performance, administrator credentials, and institutional revenue across all educational branches in real time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/owner/schools"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center gap-2"
              >
                <AppIcon name="Plus" size={16} />
                <span>Onboard Campus</span>
              </Link>
              <Link
                to="/owner/subscription"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm backdrop-blur-sm border border-white/10 transition-all flex items-center gap-2"
              >
                <AppIcon name="CreditCard" size={16} />
                <span>Subscription Ledger</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Executive KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpis.map((kpi) => {
            const CardWrapper = kpi.href ? Link : "div";
            return (
              <CardWrapper
                key={kpi.title}
                to={kpi.href || ""}
                className={`group relative rounded-2xl bg-white border border-slate-200/90 p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300 flex flex-col justify-between ${
                  kpi.href ? "cursor-pointer" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${kpi.iconBg}`}
                  >
                    <AppIcon name={kpi.icon} size={20} />
                  </div>
                  {kpi.href && (
                    <span className="text-slate-300 group-hover:text-blue-600 transition-colors">
                      <AppIcon name="ArrowUpRight" size={16} />
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {kpi.title}
                  </p>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5 tabular-nums">
                    {kpi.value}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500 mt-1 truncate">
                    {kpi.subtitle}
                  </p>
                </div>
              </CardWrapper>
            );
          })}
        </div>

        {/* 3. Campus Portfolio Performance Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <AppIcon name="Building2" size={18} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Campus Branches & Health Metrics
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Direct operational status and quick administrative workspace switching.
                </p>
              </div>
            </div>
            <Link
              to="/owner/schools"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 transition flex items-center gap-1"
            >
              <span>Manage All ({schools.length})</span>
              <AppIcon name="ChevronRight" size={14} />
            </Link>
          </div>

          {schools.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
                <AppIcon name="Building2" size={28} />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-bold text-slate-900">No campuses registered yet</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Onboard your primary educational branch to configure classes, assign an administrator, and enroll students.
                </p>
              </div>
              <Link
                to="/owner/schools"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
              >
                <AppIcon name="Plus" size={16} />
                <span>Onboard Your First Campus</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {schools.map((school: any) => {
                const sId = school.school_id || school._id || school.id;
                const studentCount = school.student_count || 0;
                const teacherCount = school.teacher_count || 0;
                const classCount = school.class_count || 0;
                const feeCollected = Number(school.total_fee_collected) || 0;
                const feePending = Number(school.total_fee_pending) || 0;

                return (
                  <div
                    key={sId}
                    className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-200 flex flex-col justify-between space-y-5"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                            {sId}
                          </span>
                          {school.city && (
                            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                              <AppIcon name="MapPin" size={11} className="text-slate-400" />
                              {school.city}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-black text-slate-900 tracking-tight mt-2">
                          {school.name}
                        </h3>
                        {school.principal_name && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            Principal: <span className="font-semibold text-slate-700">{school.principal_name}</span>
                          </p>
                        )}
                      </div>

                      <span
                        className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${
                          school.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {school.status || "active"}
                      </span>
                    </div>

                    {/* Operational Stats Row */}
                    <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 text-center">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Students</span>
                        <span className="text-base font-black text-slate-900 mt-0.5 block">{studentCount}</span>
                      </div>
                      <div className="border-x border-slate-200/60">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Teachers</span>
                        <span className="text-base font-black text-slate-900 mt-0.5 block">{teacherCount}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Classes</span>
                        <span className="text-base font-black text-slate-900 mt-0.5 block">{classCount}</span>
                      </div>
                    </div>

                    {/* Fee Summary Bar */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-slate-500">Collected Fee</span>
                        <span className="text-emerald-600 font-bold">Rs. {feeCollected.toLocaleString()}</span>
                      </div>
                      {feePending > 0 && (
                        <div className="flex items-center justify-between font-semibold">
                          <span className="text-slate-500">Pending Fee</span>
                          <span className="text-rose-600 font-bold">Rs. {feePending.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => handleSwitchToCampus(school)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <AppIcon name="ExternalLink" size={14} />
                        <span>Open Workspace</span>
                      </button>
                      <Link
                        to="/owner/schools"
                        className="py-2.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                        title="View Full Details"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Quick Nav & Administrative Shortcuts */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 md:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <AppIcon name="Compass" size={18} className="text-blue-600" />
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Executive Shortcuts
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/owner/schools"
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-blue-50/50 hover:border-blue-200 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 mb-2 shadow-sm group-hover:scale-105 transition-transform">
                <AppIcon name="Building2" size={16} />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Campuses & Branches
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Onboard branches, inspect credentials, and manage capacity.
              </p>
            </Link>

            <Link
              to="/owner/subscription"
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-emerald-50/50 hover:border-emerald-200 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-emerald-600 mb-2 shadow-sm group-hover:scale-105 transition-transform">
                <AppIcon name="CreditCard" size={16} />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Subscriptions & Billing
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Inspect institutional plans, billing history, and upgrades.
              </p>
            </Link>

            <Link
              to="/owner/schools"
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-purple-50/50 hover:border-purple-200 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-purple-600 mb-2 shadow-sm group-hover:scale-105 transition-transform">
                <AppIcon name="Key" size={16} />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                Administrator Logins
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                View principal credentials with instant copy tools.
              </p>
            </Link>

            <Link
              to="/owner/subscription"
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-amber-50/50 hover:border-amber-200 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-amber-600 mb-2 shadow-sm group-hover:scale-105 transition-transform">
                <AppIcon name="FileText" size={16} />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                Invoices & Receipts
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Audit complete history of billing activations and receipts.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </SchoolShell>
  );
}
