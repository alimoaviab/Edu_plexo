import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AppIcon } from "shared/ui/AppIcon";
import { serviceRequest } from "@/services/service-client";
import { STALE_TIME_DASHBOARD } from "@/lib/query-client";
import { SchoolShell } from "@/layouts/SchoolShell";

type OwnerAlert = {
  id: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  category: "financial" | "academic" | "operational" | "subscription";
  title: string;
  message: string;
  school_id?: string;
  school_name?: string;
  metric?: string;
  action: { label: string; href: string };
  created_at: string;
};

const sevTheme: Record<string, { badge: string; dot: string; icon: string }> = {
  CRITICAL: { badge: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-500", icon: "AlertTriangle" },
  WARNING: { badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500", icon: "AlertCircle" },
  INFO: { badge: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500", icon: "Info" },
};

const catTheme: Record<string, { icon: string; label: string }> = {
  financial: { icon: "Landmark", label: "Financial" },
  academic: { icon: "GraduationCap", label: "Academic" },
  operational: { icon: "Building2", label: "Operational" },
  subscription: { icon: "CreditCard", label: "Subscription" },
};

export default function OwnerAlertsPage() {
  const [sevFilter, setSevFilter] = useState("");
  const [catFilter, setCatFilter] = useState("");

  const { data, isLoading } = useQuery<any>({
    queryKey: ["owner", "alerts"],
    queryFn: async () => {
      const res = await serviceRequest<any>("/api/owner/alerts");
      if (!res.ok) throw new Error(res.error?.message || "Failed to load alerts");
      return res.data;
    },
    staleTime: STALE_TIME_DASHBOARD,
  });

  const alerts: OwnerAlert[] = (data?.alerts || []).filter(
    (a: OwnerAlert) => (!sevFilter || a.severity === sevFilter) && (!catFilter || a.category === catFilter)
  );

  const counts = useMemo(() => {
    const all: OwnerAlert[] = data?.alerts || [];
    return {
      CRITICAL: all.filter((a) => a.severity === "CRITICAL").length,
      WARNING: all.filter((a) => a.severity === "WARNING").length,
      INFO: all.filter((a) => a.severity === "INFO").length,
      total: all.length,
    };
  }, [data]);

  if (isLoading && !data) {
    return (
      <SchoolShell eyebrow="Owner Portal" title="Alerts & Insights">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      </SchoolShell>
    );
  }

  const chips: { value: string; label: string; count?: number }[] = [
    { value: "", label: "All" },
    { value: "CRITICAL", label: "Critical", count: counts.CRITICAL },
    { value: "WARNING", label: "Warnings", count: counts.WARNING },
    { value: "INFO", label: "Info", count: counts.INFO },
  ];
  const cats: { value: string; label: string }[] = [
    { value: "", label: "All categories" },
    { value: "financial", label: "Financial" },
    { value: "academic", label: "Academic" },
    { value: "operational", label: "Operational" },
    { value: "subscription", label: "Subscription" },
  ];

  return (
    <SchoolShell
      eyebrow="Owner Portal"
      title="Alerts & Insights"
      description="Business issues surfaced from real backend data — collections health, attendance, campus activity and your subscription lifecycle."
    >
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Critical", value: counts.CRITICAL, icon: "AlertTriangle", bg: "bg-rose-50 text-rose-600 border-rose-100", cls: "text-rose-600" },
          { label: "Warnings", value: counts.WARNING, icon: "AlertCircle", bg: "bg-amber-50 text-amber-600 border-amber-100", cls: "text-amber-600" },
          { label: "Info", value: counts.INFO, icon: "Info", bg: "bg-blue-50 text-blue-600 border-blue-100", cls: "text-blue-600" },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border ${k.bg}`}>
                <AppIcon name={k.icon} size={14} />
              </div>
              <span className="text-[11px] font-bold text-slate-500">{k.label}</span>
            </div>
            <div className={`mt-2 text-[18px] font-black leading-tight ${k.cls}`}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {chips.map((c) => (
          <button
            key={c.value}
            onClick={() => setSevFilter(c.value)}
            className={`h-8 px-3 rounded-lg text-[11px] font-bold border transition-colors ${
              sevFilter === c.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {c.label}
            {typeof c.count === "number" && c.value !== "" && (
              <span className={`ml-1.5 ${sevFilter === c.value ? "text-blue-100" : "text-slate-400"}`}>{c.count}</span>
            )}
          </button>
        ))}
        <div className="ml-auto">
          <select
            className="h-8 px-2 rounded-lg border border-slate-200 text-[11px] font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
          >
            {cats.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        {alerts.map((a) => {
          const sev = sevTheme[a.severity];
          const cat = catTheme[a.category] || catTheme.operational;
          return (
            <div key={a.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm flex gap-3 items-start">
              <div className={`shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg border ${sev.badge}`}>
                <AppIcon name={sev.icon} size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[13px] font-extrabold text-slate-900">{a.title}</span>
                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-black uppercase border ${sev.badge}`}>{a.severity}</span>
                  <span className="inline-flex px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-black uppercase items-center gap-1">
                    <AppIcon name={cat.icon} size={10} />
                    {cat.label}
                  </span>
                </div>
                <p className="mt-1 text-[12px] text-slate-600 leading-relaxed">{a.message}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[10px] font-semibold text-slate-400">
                  {a.school_name && (
                    <span className="inline-flex items-center gap-1">
                      <AppIcon name="Building2" size={11} /> {a.school_name}
                    </span>
                  )}
                  {a.metric && <span>{a.metric}</span>}
                  {a.action.href && (
                    <Link to={a.action.href} className="ml-auto text-blue-600 font-bold hover:text-blue-700">
                      {a.action.label} →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {alerts.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="text-3xl mb-2">🎉</div>
            <div className="text-[13px] font-bold text-slate-700">All clear</div>
            <div className="text-[11px] text-slate-400 mt-1">No {sevFilter.toLowerCase() || ""} {catFilter ? `${catFilter} ` : ""}alerts right now.</div>
          </div>
        )}
      </div>
    </SchoolShell>
  );
}
