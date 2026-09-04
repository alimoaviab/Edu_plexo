import { useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AppIcon } from "shared/ui/AppIcon";
import { serviceRequest } from "@/services/service-client";
import { STALE_TIME_DASHBOARD } from "@/lib/query-client";
import { SchoolShell } from "@/layouts/SchoolShell";
import { CompactBarChart } from "@/components/ui/charts/CompactBarChart";
import { CompactLineChart } from "@/components/ui/charts/CompactLineChart";

const pk = (n: number) => `PKR ${Math.round(Number(n) || 0).toLocaleString()}`;

type SchoolRow = {
  school_id: string;
  school_name: string;
  code?: string;
  city?: string;
  status?: string;
  students: number;
  teachers: number;
  classes: number;
  attendance_rate: number;
  attendance_records: number;
  revenue: number;
  revenue_30d: number;
  pending: number;
  collection_rate: number;
  new_students_30d: number;
};

const kpiTheme: Record<string, { icon: string; bg: string; accent: string }> = {
  students: { icon: "GraduationCap", bg: "bg-purple-50 text-purple-600 border-purple-100", accent: "from-purple-600 to-violet-600" },
  teachers: { icon: "BookOpen", bg: "bg-emerald-50 text-emerald-600 border-emerald-100", accent: "from-emerald-600 to-teal-600" },
  classes: { icon: "LayoutGrid", bg: "bg-amber-50 text-amber-600 border-amber-100", accent: "from-amber-500 to-orange-500" },
  revenue30: { icon: "Wallet", bg: "bg-blue-50 text-blue-600 border-blue-100", accent: "from-blue-600 to-indigo-600" },
  rate: { icon: "Percent", bg: "bg-cyan-50 text-cyan-600 border-cyan-100", accent: "from-cyan-600 to-sky-600" },
  pending: { icon: "Clock", bg: "bg-rose-50 text-rose-600 border-rose-100", accent: "from-rose-500 to-red-500" },
};

export default function OwnerAnalyticsPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const schoolParam = params.get("school") || "";

  const { data, isLoading } = useQuery<any>({
    queryKey: ["owner", "analytics"],
    queryFn: async () => {
      const res = await serviceRequest<any>("/api/owner/analytics");
      if (!res.ok) throw new Error(res.error?.message || "Failed to load analytics");
      return res.data;
    },
    staleTime: STALE_TIME_DASHBOARD,
    gcTime: 30 * 60 * 1000,
  });

  const rows: SchoolRow[] = (data?.per_school || []).filter(
    (r: SchoolRow) => !schoolParam || r.school_id === schoolParam
  );

  const totals = useMemo(() => {
    if (!rows.length) {
      return {
        students: 0, teachers: 0, classes: 0, revenue: 0,
        pending: 0, collection_rate: 0, revenue_30d: 0, schools: 0,
      };
    }
    return rows.reduce<any>(
      (acc, r) => {
        acc.students += r.students;
        acc.teachers += r.teachers;
        acc.classes += r.classes;
        acc.revenue += r.revenue;
        acc.revenue_30d += r.revenue_30d;
        acc.pending += r.pending;
        return acc;
      },
      { students: 0, teachers: 0, classes: 0, revenue: 0, revenue_30d: 0, pending: 0 }
    );
  }, [rows]);

  const rate =
    totals.revenue + totals.pending > 0
      ? Math.round((totals.revenue * 100) / (totals.revenue + totals.pending))
      : 0;

  const kpis = [
    { key: "Students", value: totals.students.toLocaleString(), sub: `${schoolParam ? "At this campus" : "Across all owned campuses"}`, theme: kpiTheme.students },
    { key: "Teachers", value: totals.teachers.toLocaleString(), sub: "Active faculty", theme: kpiTheme.teachers },
    { key: "Classes", value: totals.classes.toLocaleString(), sub: "Configured classes", theme: kpiTheme.classes },
    { key: "Collected (30d)", value: pk(totals.revenue_30d), sub: "Fee collections, last 30 days", theme: kpiTheme.revenue30 },
    { key: "Collection Rate", value: `${rate}%`, sub: pk(totals.revenue) + " collected · " + pk(totals.pending) + " pending", theme: kpiTheme.rate },
    { key: "Pending Fees", value: pk(totals.pending), sub: "Outstanding across invoices", theme: kpiTheme.pending },
  ];

  if (isLoading && !data) {
    return (
      <SchoolShell eyebrow="Owner Portal" title="Portfolio Analytics">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      </SchoolShell>
    );
  }

  const chartData = rows.map((r) => ({
    label: r.school_name.length > 14 ? r.school_name.slice(0, 12) + "…" : r.school_name,
    value1: Math.round(r.revenue),
  }));
  const studentData = rows.map((r) => ({
    label: r.school_name.length > 14 ? r.school_name.slice(0, 12) + "…" : r.school_name,
    value1: r.students,
  }));
  const attData = rows.map((r) => ({
    label: r.school_name.length > 14 ? r.school_name.slice(0, 12) + "…" : r.school_name,
    value: Math.round(r.attendance_rate),
  }));

  return (
    <SchoolShell
      eyebrow="Owner Portal"
      title="Portfolio Analytics"
      description="Compare every campus you own — enrollment, staffing, collections and attendance health from live backend data."
    >
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Campus</label>
          <select
            className="mt-1 h-9 px-3 pr-8 rounded-lg border border-slate-200 text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={schoolParam}
            onChange={(e) => navigate(e.target.value ? `/owner/analytics?school=${e.target.value}` : "/owner/analytics")}
          >
            <option value="">All schools</option>
            {(data?.per_school || []).map((r: SchoolRow) => (
              <option key={r.school_id} value={r.school_id}>{r.school_name}</option>
            ))}
          </select>
        </div>
        <span className="text-[11px] font-medium text-slate-400">
          {rows.length} of {(data?.per_school || []).length} owned campuses shown
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-4">
        {kpis.map((k) => (
          <div key={k.key} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border ${k.theme.bg}`}>
              <AppIcon name={k.theme.icon} size={14} />
            </div>
            <div className="mt-2 text-[11px] font-bold text-slate-500">{k.key}</div>
            <div className="text-[16px] font-black text-slate-900 leading-tight">{k.value}</div>
            <div className="text-[10px] font-medium text-slate-400 leading-snug mt-0.5">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 mb-2">Collections by campus</div>
          <CompactBarChart data={chartData} height={140} />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 mb-2">Enrollment by campus</div>
          <CompactBarChart data={studentData} color1="#7c3aed" height={140} />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 mb-2">Attendance (last 30 days) %</div>
          <CompactLineChart data={attData} color="#0891b2" height={140} />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
          <div className="text-[13px] font-bold text-slate-800">Campus comparison</div>
          <Link to="/owner/schools" className="text-[11px] font-bold text-blue-600 hover:text-blue-700">
            Manage campuses →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
                {["School", "Students", "Teachers", "Classes", "Attendance", "Revenue", "Pending", "Collection", "New (30d)"].map((h) => (
                  <th key={h} className="px-4 py-2 font-extrabold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.school_id} className="border-t border-slate-100 hover:bg-slate-50/60 text-[12px]">
                  <td className="px-4 py-2.5">
                    <div className="font-extrabold text-slate-800">{r.school_name}</div>
                    <div className="text-[10px] font-medium text-slate-400">{r.code || r.school_id}</div>
                  </td>
                  <td className="px-4 py-2.5 font-bold">{r.students.toLocaleString()}</td>
                  <td className="px-4 py-2.5">{r.teachers}</td>
                  <td className="px-4 py-2.5">{r.classes}</td>
                  <td className="px-4 py-2.5">
                    {r.attendance_records > 0 ? `${Math.round(r.attendance_rate)}%` : "—"}
                  </td>
                  <td className="px-4 py-2.5 font-bold text-emerald-700">{pk(r.revenue)}</td>
                  <td className="px-4 py-2.5 font-bold text-rose-600">{pk(r.pending)}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-black ${
                      r.collection_rate >= 65 ? "bg-emerald-50 text-emerald-700" :
                      r.collection_rate >= 40 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"
                    }`}>{r.collection_rate}%</span>
                  </td>
                  <td className="px-4 py-2.5">{r.new_students_30d}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-[12px] text-slate-400">
                    No owned schools to compare yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SchoolShell>
  );
}
