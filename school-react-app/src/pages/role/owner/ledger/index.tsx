import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppIcon } from "shared/ui/AppIcon";
import { serviceRequest } from "@/services/service-client";
import { STALE_TIME_DASHBOARD } from "@/lib/query-client";
import { SchoolShell } from "@/layouts/SchoolShell";

const pk = (n: number) => `PKR ${Math.round(Number(n) || 0).toLocaleString()}`;

const inputCls =
  "h-9 px-2.5 rounded-lg border border-slate-200 text-[12px] font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500";

type LedgerItem = {
  id: string;
  date: string;
  kind: "income" | "expense";
  category: string;
  school_id: string;
  school_name: string;
  reference?: string;
  description: string;
  method?: string;
  debit: number;
  credit: number;
  status: string;
};

export default function OwnerLedgerPage() {
  const [kind, setKind] = useState("");
  const [school, setSchool] = useState("");
  const [category, setCategory] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [q, setQ] = useState("");
  const [applied, setApplied] = useState("");
  const [page, setPage] = useState(1);

  const params = new URLSearchParams();
  if (kind) params.set("type", kind);
  if (school) params.set("school", school);
  if (category) params.set("category", category);
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  if (applied) params.set("q", applied);
  params.set("page", String(page));
  params.set("limit", "25");

  const { data, isLoading, isFetching } = useQuery<any>({
    queryKey: ["owner", "ledger", params.toString()],
    queryFn: async () => {
      const res = await serviceRequest<any>(`/api/owner/ledger?${params.toString()}`);
      if (!res.ok) throw new Error(res.error?.message || "Failed to load ledger");
      return res.data;
    },
    staleTime: STALE_TIME_DASHBOARD,
  });

  const { data: schools } = useQuery<any[]>({
    queryKey: ["owner-schools", "ledger"],
    queryFn: async () => {
      const res = await serviceRequest<any[]>("/api/owner/schools");
      return res.ok && Array.isArray(res.data) ? res.data : [];
    },
    staleTime: STALE_TIME_DASHBOARD,
  });

  const applyFilters = () => {
    setPage(1);
    setApplied(q.trim());
  };
  const resetFilters = () => {
    setKind(""); setSchool(""); setCategory(""); setFrom(""); setTo(""); setQ(""); setApplied(""); setPage(1);
  };

  const summary = data?.summary || { income: 0, expense: 0, net: 0, income_count: 0, expense_count: 0 };
  const items: LedgerItem[] = data?.items || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };
  const loading = (isLoading || isFetching) && !data;

  return (
    <SchoolShell
      eyebrow="Owner Portal"
      title="Ledger"
      description="Business-level money movement across all your campuses — fee collections and expenses from the same records your school teams maintain."
    >
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Income", value: pk(summary.income), cls: "text-emerald-700", icon: "TrendingUp", bg: "bg-emerald-50 text-emerald-600 border-emerald-100" },
          { label: "Expenses", value: pk(summary.expense), cls: "text-rose-600", icon: "TrendingDown", bg: "bg-rose-50 text-rose-600 border-rose-100" },
          { label: "Net Movement", value: pk(summary.net), cls: Number(summary.net) >= 0 ? "text-blue-700" : "text-rose-600", icon: "Scale", bg: "bg-blue-50 text-blue-600 border-blue-100" },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border ${k.bg}`}>
                <AppIcon name={k.icon} size={14} />
              </div>
              <span className="text-[11px] font-bold text-slate-500">{k.label}</span>
            </div>
            <div className={`mt-2 text-[18px] font-black leading-tight ${k.cls}`}>{k.value}</div>
            <div className="text-[10px] font-medium text-slate-400">
              {summary.income_count} collections · {summary.expense_count} expenses
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm mb-4">
        <div className="flex flex-wrap items-end gap-2">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">Type</label>
            <select className={`${inputCls} block mt-1`} value={kind} onChange={(e) => setKind(e.target.value)}>
              <option value="">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">Campus</label>
            <select className={`${inputCls} block mt-1`} value={school} onChange={(e) => setSchool(e.target.value)}>
              <option value="">All schools</option>
              {(schools || []).map((s: any) => (
                <option key={s.school_id} value={s.school_id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
            <input className={`${inputCls} block mt-1 w-36`} value={category} placeholder="e.g. Utilities" onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">From</label>
            <input type="date" className={`${inputCls} block mt-1`} value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">To</label>
            <input type="date" className={`${inputCls} block mt-1`} value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Search</label>
            <input
              className={`${inputCls} block mt-1 w-full`}
              placeholder="Reference, receipt no. or description"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={applyFilters} className="h-9 px-4 rounded-lg bg-blue-600 text-white text-[12px] font-bold hover:bg-blue-700">
              Apply
            </button>
            <button onClick={resetFilters} className="h-9 px-3 rounded-lg border border-slate-200 text-[12px] font-bold text-slate-500 hover:bg-slate-50">
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
                {["Date", "Reference", "School", "Type", "Category", "Description", "Debit", "Credit", "Status"].map((h) => (
                  <th key={h} className="px-4 py-2 font-extrabold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-[12px] text-slate-400">Loading ledger…</td>
                </tr>
              )}
              {!loading && items.map((it) => (
                <tr key={it.id} className="border-t border-slate-100 hover:bg-slate-50/60 text-[12px]">
                  <td className="px-4 py-2.5 whitespace-nowrap font-medium text-slate-600">
                    {new Date(it.date).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-slate-500">{it.reference || "—"}</td>
                  <td className="px-4 py-2.5 font-bold text-slate-700">{it.school_name}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                      it.kind === "income" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    }`}>{it.kind}</span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{it.category}</td>
                  <td className="px-4 py-2.5 text-slate-600 max-w-[220px] truncate">{it.description}</td>
                  <td className="px-4 py-2.5 font-bold text-rose-600">{it.debit ? pk(it.debit) : "—"}</td>
                  <td className="px-4 py-2.5 font-bold text-emerald-700">{it.credit ? pk(it.credit) : "—"}</td>
                  <td className="px-4 py-2.5 text-[10px] font-bold uppercase text-slate-400">{it.status}</td>
                </tr>
              ))}
              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-[12px] text-slate-400">
                    No ledger entries match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {pagination.total > 0 && (
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100">
            <span className="text-[11px] font-medium text-slate-400">
              {pagination.total} entr{pagination.total === 1 ? "y" : "ies"} · page {pagination.page} of {pagination.pages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-bold disabled:opacity-40 hover:bg-slate-50"
              >
                Previous
              </button>
              <button
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-bold disabled:opacity-40 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </SchoolShell>
  );
}
