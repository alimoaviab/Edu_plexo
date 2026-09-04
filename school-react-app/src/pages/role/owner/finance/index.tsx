import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppIcon } from "shared/ui/AppIcon";
import { serviceRequest } from "@/services/service-client";
import { STALE_TIME_DASHBOARD } from "@/lib/query-client";
import { SchoolShell } from "@/layouts/SchoolShell";
import { CompactLineChart } from "@/components/ui/charts/CompactLineChart";
import { CompactBarChart } from "@/components/ui/charts/CompactBarChart";

const pk = (n: number) => `PKR ${Math.round(Number(n) || 0).toLocaleString()}`;
const inputCls =
  "h-9 px-2.5 rounded-lg border border-slate-200 text-[12px] font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full";

type Budget = {
  id: string;
  school_id?: string;
  school_name: string;
  name: string;
  period_label: string;
  start_date: string;
  end_date: string;
  planned_amount: number;
  notes: string;
  actual_amount: number;
  remaining: number;
  utilization: number;
};

type FinanceRow = {
  school_id: string;
  school_name: string;
  collected: number;
  pending: number;
  collection_rate: number;
  expenses: number;
  net_position: number;
};

const emptyForm = {
  id: "", name: "Operating Budget", school_id: "", period_label: "",
  start_date: "", end_date: "", planned_amount: "", notes: "",
};

export default function OwnerFinancePage() {
  const [budgetFilter, setBudgetFilter] = useState("");
  const [form, setForm] = useState({ ...emptyForm });
  const [formOpen, setFormOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [confirmDelete, setConfirmDelete] = useState("");

  const { data, isLoading } = useQuery<any>({
    queryKey: ["owner", "finance"],
    queryFn: async () => {
      const res = await serviceRequest<any>("/api/owner/finance");
      if (!res.ok) throw new Error(res.error?.message || "Failed to load finance");
      return res.data;
    },
    staleTime: STALE_TIME_DASHBOARD,
  });

  const { data: budgetsRes, refetch: refetchBudgets } = useQuery<any>({
    queryKey: ["owner", "budgets", budgetFilter],
    queryFn: async () => {
      const res = await serviceRequest<any>(`/api/owner/budgets${budgetFilter ? `?school=${budgetFilter}` : ""}`);
      if (!res.ok) throw new Error(res.error?.message || "Failed to load budgets");
      return res.data;
    },
    staleTime: STALE_TIME_DASHBOARD,
  });

  const { data: schools } = useQuery<any[]>({
    queryKey: ["owner-schools", "finance"],
    queryFn: async () => {
      const res = await serviceRequest<any[]>("/api/owner/schools");
      return res.ok && Array.isArray(res.data) ? res.data : [];
    },
    staleTime: STALE_TIME_DASHBOARD,
  });

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  const summary = data?.summary || { collected: 0, pending: 0, collection_rate: 0, expenses: 0, net_position: 0 };
  const trend: any[] = data?.trend || [];
  const finRows: FinanceRow[] = data?.schools || [];
  const budgets: Budget[] = (budgetsRes?.budgets || []).filter((b: Budget) => !budgetFilter || b.school_id === budgetFilter);

  const trendData = useMemo(
    () =>
      trend.map((t) => ({
        label: t.month.replace(/^\d{4}-/, ""),
        value: Math.round(t.income || 0),
      })),
    [trend]
  );
  const expenseTrend = useMemo(
    () =>
      trend.map((t) => ({
        label: t.month.replace(/^\d{4}-/, ""),
        value: Math.round(t.expense || 0),
      })),
    [trend]
  );
  const netBySchool = finRows.map((r) => ({
    label: r.school_name.length > 13 ? r.school_name.slice(0, 11) + "…" : r.school_name,
    value1: Math.round(r.net_position),
  }));

  const kpis = [
    { label: "Total Revenue", value: pk(summary.collected), sub: "Fee collections across campuses", icon: "TrendingUp", bg: "bg-emerald-50 text-emerald-600 border-emerald-100", cls: "text-emerald-700" },
    { label: "Total Expenses", value: pk(summary.expenses), sub: "School expense records", icon: "TrendingDown", bg: "bg-rose-50 text-rose-600 border-rose-100", cls: "text-rose-600" },
    { label: "Net Position", value: pk(summary.net_position), sub: "Revenue minus expenses", icon: "Scale", bg: "bg-blue-50 text-blue-600 border-blue-100", cls: "text-blue-700" },
    { label: "Pending Fees", value: pk(summary.pending), sub: "Outstanding invoices", icon: "Hourglass", bg: "bg-amber-50 text-amber-600 border-amber-100", cls: "text-amber-700" },
    { label: "Collection Rate", value: `${summary.collection_rate}%`, sub: "Collected ÷ billed", icon: "Percent", bg: "bg-cyan-50 text-cyan-600 border-cyan-100", cls: "text-cyan-700" },
  ];

  const openCreate = () => {
    setForm({ ...emptyForm });
    setFormOpen(true);
  };
  const openEdit = (b: Budget) => {
    setForm({
      id: b.id, name: b.name, school_id: b.school_id || "",
      period_label: b.period_label,
      start_date: (b.start_date || "").slice(0, 10),
      end_date: (b.end_date || "").slice(0, 10),
      planned_amount: String(b.planned_amount ?? 0),
      notes: b.notes || "",
    });
    setFormOpen(true);
  };

  const saveBudget = async () => {
    if (!form.start_date || !form.end_date) {
      setNotice("Start and end dates are required.");
      return;
    }
    const body = {
      name: form.name,
      school_id: form.school_id,
      period_label: form.period_label,
      start_date: form.start_date,
      end_date: form.end_date,
      planned_amount: Number(form.planned_amount) || 0,
      notes: form.notes,
    };
    setBusy(true);
    try {
      const res = form.id
        ? await serviceRequest<any>(`/api/owner/budgets/${form.id}`, { method: "PATCH", body: JSON.stringify(body) })
        : await serviceRequest<any>("/api/owner/budgets", { method: "POST", body: JSON.stringify(body) });
      if (!res.ok) {
        setNotice(res.error?.message || "Unable to save budget.");
      } else {
        setNotice("Budget saved.");
        setFormOpen(false);
        refetchBudgets();
      }
    } finally {
      setBusy(false);
    }
  };

  const removeBudget = async (b: Budget) => {
    if (confirmDelete !== b.id) {
      setConfirmDelete(b.id);
      return;
    }
    setBusy(true);
    try {
      const res = await serviceRequest<any>(`/api/owner/budgets/${b.id}`, { method: "DELETE" });
      if (!res.ok) {
        setNotice(res.error?.message || "Unable to delete budget.");
      } else {
        setNotice("Budget removed.");
        refetchBudgets();
      }
    } finally {
      setBusy(false);
      setConfirmDelete("");
    }
  };

  const budgetsAvailable = budgetsRes?.available !== false;

  return (
    <SchoolShell
      eyebrow="Owner Portal"
      title="Finance & Budgets"
      description="Revenue, expenses, net position and budget utilization across your portfolio — every number comes from the same backend records."
    >
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border ${k.bg}`}>
                <AppIcon name={k.icon} size={14} />
              </div>
              <span className="text-[11px] font-bold text-slate-500">{k.label}</span>
            </div>
            <div className={`mt-2 text-[15px] font-black leading-tight ${k.cls}`}>{k.value}</div>
            <div className="text-[10px] font-medium text-slate-400 leading-snug">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 mb-2">Revenue trend (monthly)</div>
          <CompactLineChart data={trendData} color="#059669" height={140} />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 mb-2">Expense trend (monthly)</div>
          <CompactLineChart data={expenseTrend} color="#e11d48" height={140} />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 mb-2">Net position by campus</div>
          <CompactBarChart data={netBySchool} color1="#2563eb" height={140} />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-4">
        <div className="px-4 py-2.5 border-b border-slate-100 text-[13px] font-bold text-slate-800">
          Campus financial position
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
                {["School", "Revenue", "Pending", "Collection", "Expenses", "Net Position"].map((h) => (
                  <th key={h} className="px-4 py-2 font-extrabold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {finRows.map((r) => (
                <tr key={r.school_id} className="border-t border-slate-100 hover:bg-slate-50/60 text-[12px]">
                  <td className="px-4 py-2.5 font-extrabold text-slate-800">{r.school_name}</td>
                  <td className="px-4 py-2.5 font-bold text-emerald-700">{pk(r.collected)}</td>
                  <td className="px-4 py-2.5 font-bold text-rose-600">{pk(r.pending)}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-black ${
                      r.collection_rate >= 65 ? "bg-emerald-50 text-emerald-700" : r.collection_rate >= 40 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"
                    }`}>{r.collection_rate}%</span>
                  </td>
                  <td className="px-4 py-2.5">{pk(r.expenses)}</td>
                  <td className={`px-4 py-2.5 font-black ${r.net_position >= 0 ? "text-blue-700" : "text-rose-600"}`}>{pk(r.net_position)}</td>
                </tr>
              ))}
              {finRows.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-[12px] text-slate-400">No schools yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 border-b border-slate-100 flex flex-wrap items-center gap-2">
          <div className="text-[13px] font-bold text-slate-800">Budgets</div>
          <div className="text-[10px] font-medium text-slate-400">Planned spend vs actual (from school expense records)</div>
          <div className="ml-auto flex items-center gap-2">
            <select className="h-8 px-2 rounded-lg border border-slate-200 text-[11px] font-semibold bg-white focus:outline-none" value={budgetFilter} onChange={(e) => setBudgetFilter(e.target.value)}>
              <option value="">All campuses</option>
              {(schools || []).map((s: any) => (
                <option key={s.school_id} value={s.school_id}>{s.name}</option>
              ))}
            </select>
            {budgetsAvailable && (
              <button onClick={openCreate} className="h-8 px-3 rounded-lg bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700">
                + New budget
              </button>
            )}
          </div>
        </div>

        {notice && (
          <div className="px-4 py-2 bg-blue-50 text-blue-700 text-[11px] font-bold border-b border-blue-100">{notice}</div>
        )}

        {!budgetsAvailable && (
          <div className="px-4 py-6 text-center text-[12px] text-slate-400">
            Budget planning is not enabled on this backend. Budgets are stored in the managed database.
          </div>
        )}

        {budgetsAvailable && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
                  {["Budget", "Period", "School", "Planned", "Actual", "Remaining", "Utilization", ""].map((h) => (
                    <th key={h} className="px-4 py-2 font-extrabold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {budgets.map((b) => (
                  <tr key={b.id} className="border-t border-slate-100 hover:bg-slate-50/60 text-[12px] align-middle">
                    <td className="px-4 py-2.5">
                      <div className="font-extrabold text-slate-800">{b.name}</div>
                      {b.notes && <div className="text-[10px] text-slate-400 max-w-[200px] truncate">{b.notes}</div>}
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">{b.period_label || `${(b.start_date || "").slice(0, 10)} → ${(b.end_date || "").slice(0, 10)}`}</td>
                    <td className="px-4 py-2.5 font-bold text-slate-700">{b.school_name}</td>
                    <td className="px-4 py-2.5 font-bold">{pk(b.planned_amount)}</td>
                    <td className="px-4 py-2.5 font-bold text-rose-600">{pk(b.actual_amount)}</td>
                    <td className="px-4 py-2.5 font-bold text-emerald-700">{pk(b.remaining)}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${b.utilization >= 90 ? "bg-rose-500" : b.utilization >= 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                            style={{ width: `${b.utilization}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-black text-slate-500">{b.utilization}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <button onClick={() => openEdit(b)} className="px-2 py-1 rounded-md text-[10px] font-bold text-blue-600 hover:bg-blue-50">
                        Edit
                      </button>
                      <button
                        onClick={() => removeBudget(b)}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold ${confirmDelete === b.id ? "bg-rose-600 text-white" : "text-rose-500 hover:bg-rose-50"}`}
                      >
                        {confirmDelete === b.id ? "Confirm?" : "Remove"}
                      </button>
                    </td>
                  </tr>
                ))}
                {budgets.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-[12px] text-slate-400">
                      No budgets yet. Create one to track planned vs actual spend.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {formOpen && budgetsAvailable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={() => setFormOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-[14px] font-black text-slate-900">{form.id ? "Edit budget" : "New budget"}</div>
              <button onClick={() => setFormOpen(false)} className="w-7 h-7 rounded-lg text-slate-400 hover:bg-slate-100">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <label className="col-span-2 text-[10px] font-bold text-slate-500 uppercase">
                Budget name
                <input className={`${inputCls} mt-1`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label className="text-[10px] font-bold text-slate-500 uppercase">
                Campus
                <select className={`${inputCls} mt-1`} value={form.school_id} onChange={(e) => setForm({ ...form, school_id: e.target.value })}>
                  <option value="">All schools (portfolio-wide)</option>
                  {(schools || []).map((s: any) => (
                    <option key={s.school_id} value={s.school_id}>{s.name}</option>
                  ))}
                </select>
              </label>
              <label className="text-[10px] font-bold text-slate-500 uppercase">
                Period label
                <input className={`${inputCls} mt-1`} value={form.period_label} placeholder="e.g. 2026-2027" onChange={(e) => setForm({ ...form, period_label: e.target.value })} />
              </label>
              <label className="text-[10px] font-bold text-slate-500 uppercase">
                Start date
                <input type="date" className={`${inputCls} mt-1`} value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
              </label>
              <label className="text-[10px] font-bold text-slate-500 uppercase">
                End date
                <input type="date" className={`${inputCls} mt-1`} value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
              </label>
              <label className="col-span-2 text-[10px] font-bold text-slate-500 uppercase">
                Planned amount (PKR / month)
                <input type="number" min="0" className={`${inputCls} mt-1`} value={form.planned_amount} onChange={(e) => setForm({ ...form, planned_amount: e.target.value })} />
              </label>
              <label className="col-span-2 text-[10px] font-bold text-slate-500 uppercase">
                Notes
                <textarea rows={2} className={`${inputCls} h-auto py-2 mt-1`} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </label>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setFormOpen(false)} className="h-9 px-4 rounded-lg border border-slate-200 text-[12px] font-bold text-slate-500 hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={saveBudget} disabled={busy} className="h-9 px-4 rounded-lg bg-blue-600 text-white text-[12px] font-bold hover:bg-blue-700 disabled:opacity-50">
                {busy ? "Saving…" : form.id ? "Save changes" : "Create budget"}
              </button>
            </div>
          </div>
        </div>
      )}
    </SchoolShell>
  );
}
