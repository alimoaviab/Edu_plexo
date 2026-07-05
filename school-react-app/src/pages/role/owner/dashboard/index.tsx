import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppIcon } from "shared/ui/AppIcon";
import { serviceRequest } from "@/services/service-client";
import { SchoolShell } from "@/layouts/SchoolShell";

export default function OwnerDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await serviceRequest<any>("/api/owner/dashboard");
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <SchoolShell eyebrow="Owner Portal" title="Executive Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </SchoolShell>
    );
  }

  const schools = stats?.schools || [];
  
  const kpis = [
    { title: "Total Schools", value: stats?.total_schools ?? 0, icon: "domain", color: "text-blue-600 bg-blue-50" },
    { title: "Active Branches", value: stats?.total_campuses ?? 0, icon: "business", color: "text-emerald-600 bg-emerald-50" },
    { title: "Total Students", value: stats?.total_students ?? 0, icon: "school", color: "text-purple-600 bg-purple-50" },
    { title: "Total Teachers", value: stats?.total_teachers ?? 0, icon: "badge", color: "text-orange-600 bg-orange-50" },
    { title: "Total Staff", value: stats?.total_staff ?? 0, icon: "groups", color: "text-cyan-600 bg-cyan-50" },
    { title: "Active Subs", value: stats?.active_subscriptions ?? 0, icon: "check_circle", color: "text-rose-600 bg-rose-50" },
  ];

  return (
    <SchoolShell eyebrow="Owner Portal" title="Executive Dashboard">
      <div className="max-w-7xl mx-auto">

        {/* 1. KPI Cards Row - Matching Admin Dashboard Style */}
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6">
          {kpis.map((stat) => (
            <div key={stat.title} className="premium-card relative flex items-center gap-2.5 p-2.5 transition-all hover:border-blue-200/60 hover:shadow-sm">
              <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${stat.color} border border-current/5 shadow-sm`}>
                <AppIcon name={stat.icon} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold normal-case text-slate-400">{stat.title}</p>
                <h3 className="text-lg font-bold text-slate-900 tabular-nums leading-tight">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Portfolio List */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mt-6 shadow-sm">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <AppIcon name="domain" size={14} />
              </div>
              <h2 className="font-semibold text-slate-900">Your Portfolio</h2>
            </div>
            <Link to="/owner/schools" className="text-[10px] font-bold text-blue-600 hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {schools.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No schools assigned yet.
              </div>
            ) : (
              schools.slice(0, 5).map((school: any) => (
                <div key={school._id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900">{school.name}</h4>
                    <p className="text-sm text-slate-500">{school.school_id} • {school.city || "No City"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      school.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {school.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </SchoolShell>
  );
}
