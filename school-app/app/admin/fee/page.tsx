"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SchoolShell } from "@/layouts/SchoolShell";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { serviceRequest } from "@/services/service-client";
import { showToast } from "@/utils/toast";
import DataState from "@/components/DataState";

interface Student {
    id: string;
    name: string;
    admission_no: string;
    class_name: string;
    avatar: string;
}

interface Fee {
    id: string;
    amount: number;
    paid: number;
    status: string;
    components: any[];
}

interface LedgerEntry {
    student: Student;
    current_fee: Fee | null;
    carry_forward: number;
    total_payable: number;
    paid_total: number;
    remaining: number;
    status: string;
}

interface DashboardData {
    stats: {
        monthly_total: number;
        monthly_collection: number;
        pending_amount: number;
        defaulters: number;
        overdue_amount: number;
        collection_rate: number;
    };
    students: LedgerEntry[];
    pagination: {
        total: number;
        pages: number;
        current: number;
    };
}

export default function StudentFeeDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<DashboardData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPaying, setIsPaying] = useState<LedgerEntry | null>(null);

    // Filters state
    const [filters, setFilters] = useState({
        status: "all",
        class_id: "",
        month: new Date().toLocaleString('en-us', { month: 'long' }).toLowerCase(),
        year: new Date().getFullYear(),
        search: "",
        page: 1
    });

    const [paymentForm, setPaymentForm] = useState({
        amount: "",
        method: "Cash",
        reference: "",
        notes: ""
    });

    useEffect(() => {
        loadDashboard();
    }, [filters.status, filters.class_id, filters.month, filters.year, filters.page]);

    // Search debouncing
    useEffect(() => {
        const timer = setTimeout(() => {
            if (filters.search !== undefined) loadDashboard();
        }, 500);
        return () => clearTimeout(timer);
    }, [filters.search]);

    async function loadDashboard() {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                ...filters,
                page: String(filters.page),
                year: String(filters.year)
            });
            const res = await serviceRequest<DashboardData>(`/api/fees/ledger?${params.toString()}`);
            if (res.ok) setData(res.data);
            else setError(res.error.message);
        } catch (err) {
            setError("Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    }

    async function handleFullPayment(entry: LedgerEntry) {
        const feeId = entry.current_fee?.id;
        if (!feeId) return;
        if (!confirm(`Mark Rs ${entry.remaining.toLocaleString()} as Paid for ${entry.student.name}?`)) return;
        
        setSaving(true);
        try {
            const res = await serviceRequest(`/api/fees/${feeId}/pay`, {
                method: "POST",
                body: JSON.stringify({
                    amount: entry.remaining,
                    method: "Cash",
                    reference: "Direct ERP Action",
                    notes: "Full payment collected via quick dashboard action."
                })
            });
            if (res.ok) {
                showToast("Full payment recorded successfully", "success");
                loadDashboard();
            } else {
                showToast(res.error.message || "Payment failed", "error");
            }
        } finally {
            setSaving(false);
        }
    }

    async function handlePartialPayment() {
        if (!isPaying || !paymentForm.amount) return;
        setSaving(true);
        try {
            const feeId = isPaying.current_fee?.id;
            if (!feeId) {
                showToast("No active fee record found for this student month.", "error");
                return;
            }

            const res = await serviceRequest(`/api/fees/${feeId}/pay`, {
                method: "POST",
                body: JSON.stringify({
                    amount: Number(paymentForm.amount),
                    method: paymentForm.method,
                    reference: paymentForm.reference,
                    notes: paymentForm.notes
                })
            });

            if (res.ok) {
                showToast("Payment recorded successfully", "success");
                setIsPaying(null);
                setPaymentForm({ amount: "", method: "Cash", reference: "", notes: "" });
                loadDashboard();
            } else {
                showToast(res.error.message || "Payment failed", "error");
            }
        } finally {
            setSaving(false);
        }
    }

    function getStatusBadge(status: string) {
        switch (status) {
            case "paid": return <Badge variant="success" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold text-[9px] px-2 py-0.5">Paid</Badge>;
            case "partial": return <Badge variant="warning" className="bg-amber-50 text-amber-600 border-amber-100 font-bold text-[9px] px-2 py-0.5">Partial</Badge>;
            default: return <Badge variant="error" className="bg-rose-50 text-rose-600 border-rose-100 font-bold text-[9px] px-2 py-0.5">Overdue</Badge>;
        }
    }

    return (
        <SchoolShell eyebrow="Finance Management" title="Student Fee Collection">
            <div className="space-y-6 relative min-h-[80vh] pb-20 max-w-[1600px] mx-auto px-4">
                
                {/* ERP ANALYTICS HEADER */}
                <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    <StatCard label="Total Billed" value={`Rs ${(data?.stats.monthly_total || 0).toLocaleString()}`} icon="account_balance" color="text-slate-600" bg="bg-slate-100" />
                    <StatCard label="Collected" value={`Rs ${(data?.stats.monthly_collection || 0).toLocaleString()}`} icon="payments" color="text-emerald-600" bg="bg-emerald-50" />
                    <StatCard label="Pending" value={`Rs ${(data?.stats.pending_amount || 0).toLocaleString()}`} icon="pending_actions" color="text-blue-600" bg="bg-blue-50" />
                    <StatCard label="Defaulters" value={data?.stats.defaulters || 0} icon="group_off" color="text-rose-600" bg="bg-rose-50" />
                    <StatCard label="Col. Rate" value={`${data?.stats.collection_rate || 0}%`} icon="analytics" color="text-amber-600" bg="bg-amber-50" />
                </div>

                {/* ERP TOOLBAR */}
                <div className="premium-card p-3 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md sticky top-[72px] z-20 border-slate-200/60 shadow-sm rounded-2xl">
                    <div className="flex flex-1 items-center gap-3">
                        <div className="relative flex-1 max-w-[280px]">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xl text-slate-400">search</span>
                            <input
                                value={filters.search}
                                onChange={(e) => setFilters({...filters, search: e.target.value, page: 1})}
                                placeholder="Search admission or name..."
                                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-xs font-bold text-slate-700 outline-none transition-all focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 placeholder:text-slate-400"
                            />
                        </div>
                        
                        <div className="h-6 w-px bg-slate-200 mx-1" />

                        <div className="flex items-center rounded-xl bg-slate-100/80 p-1 border border-slate-200/50">
                            {[
                                { id: "all", label: "All" },
                                { id: "paid", label: "Paid" },
                                { id: "partial", label: "Partial" },
                                { id: "overdue", label: "Overdue" }
                            ].map(st => (
                                <button
                                    key={st.id}
                                    onClick={() => setFilters({...filters, status: st.id, page: 1})}
                                    className={`px-6 h-8 flex items-center rounded-lg text-xs font-black transition-all ${filters.status === st.id ? 'bg-white text-blue-600 shadow-sm border border-slate-200/30' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    {st.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <select 
                            value={filters.month} 
                            onChange={(e) => setFilters({...filters, month: e.target.value, page: 1})} 
                            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-black text-slate-600 outline-none focus:border-blue-400"
                        >
                            {["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"].map(m => (
                                <option key={m} value={m}>{m.toUpperCase()}</option>
                            ))}
                        </select>
                        <select 
                            value={filters.class_id} 
                            onChange={(e) => setFilters({...filters, class_id: e.target.value, page: 1})} 
                            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-black text-slate-600 outline-none focus:border-blue-400 max-w-[140px]"
                        >
                            <option value="">ALL CLASSES</option>
                            {/* Classes would normally be populated from API */}
                        </select>
                    </div>
                </div>

                {/* HIGH-DENSITY LEDGER GRID */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-3xl" />)}
                    </div>
                ) : data?.students.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-dashed border-slate-200">
                        <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-300">
                            <span className="material-symbols-outlined text-4xl">folder_off</span>
                        </div>
                        <h4 className="font-black text-slate-900 text-lg">No collections found</h4>
                        <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or searching for another student.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {data?.students.map((entry) => (
                            <div 
                                key={entry.student.id} 
                                className="premium-card bg-white p-6 border-slate-200/60 shadow-sm flex flex-col group hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer relative overflow-hidden" 
                                onClick={() => router.push(`/admin/fee/student/${entry.student.id}`)}
                            >
                                {/* CARD DECOR */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/30 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-150" />

                                {/* HEADER */}
                                <div className="flex items-center justify-between mb-6 relative z-10">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-lg flex-shrink-0 border border-blue-100/50 shadow-sm">
                                            {entry.student.name.substring(0, 1).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-black text-slate-900 text-[16px] truncate leading-tight mb-1">{entry.student.name}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md uppercase">{entry.student.class_name}</span>
                                                <span className="text-[10px] font-bold text-slate-400">#{entry.student.admission_no}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div onClick={(e) => e.stopPropagation()}>
                                        {getStatusBadge(entry.status)}
                                    </div>
                                </div>

                                {/* FINANCIAL PILLS */}
                                <div className="grid grid-cols-2 gap-2 mb-6">
                                    <CompactPill label="Billed" value={entry.current_fee?.amount || 0} />
                                    <CompactPill label="Previous" value={entry.carry_forward} color="text-amber-600" />
                                    <CompactPill label="Collected" value={entry.paid_total} color="text-emerald-600" />
                                    <CompactPill label="Balance" value={entry.remaining} color="text-blue-600" bg="bg-blue-50/50" />
                                </div>

                                {/* ACTIONS */}
                                <div className="flex items-center gap-3 mt-auto relative z-10" onClick={(e) => e.stopPropagation()}>
                                    <button 
                                        disabled={entry.status === "paid" || saving}
                                        onClick={() => handleFullPayment(entry)}
                                        className="flex-1 h-9 rounded-xl bg-blue-600 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 disabled:opacity-10 active:scale-95"
                                    >
                                        Full Paid
                                    </button>
                                    <button 
                                        disabled={entry.status === "paid" || saving}
                                        onClick={() => {
                                            setIsPaying(entry);
                                            setPaymentForm({...paymentForm, amount: String(entry.remaining)});
                                        }}
                                        className="flex-1 h-9 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                                    >
                                        Partial
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* PAGINATION */}
                {data && data.pagination.pages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-3">
                        <button 
                            disabled={filters.page === 1}
                            onClick={() => setFilters({...filters, page: filters.page - 1})}
                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-blue-600 transition-all shadow-sm disabled:opacity-30"
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-6 h-12 shadow-sm font-black text-xs text-slate-600">
                            PAGE {filters.page} OF {data.pagination.pages}
                        </div>
                        <button 
                            disabled={filters.page === data.pagination.pages}
                            onClick={() => setFilters({...filters, page: filters.page + 1})}
                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-blue-600 transition-all shadow-sm disabled:opacity-30"
                        >
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                )}
            </div>

            {/* PROFESSIONAL COLLECTION DRAWER */}
            {isPaying && (
                <div className="fixed inset-0 z-[100] flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="h-full w-full max-w-[420px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
                        {/* HEADER */}
                        <div className="p-8 border-b border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Record Payment</h3>
                                <button 
                                    onClick={() => setIsPaying(null)}
                                    className="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">close</span>
                                </button>
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{isPaying.student.name} • {isPaying.student.class_name}</p>
                        </div>

                        {/* SCROLLABLE CONTENT */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-10">
                            {/* SUMMARY CARDS */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Due</p>
                                    <p className="text-xl font-black text-slate-900">Rs {isPaying.total_payable.toLocaleString()}</p>
                                </div>
                                <div className="p-5 rounded-3xl bg-blue-600 text-white shadow-lg shadow-blue-200 flex flex-col items-center text-center">
                                    <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-2">Remaining</p>
                                    <p className="text-xl font-black">Rs {isPaying.remaining.toLocaleString()}</p>
                                </div>
                            </div>

                            {/* PAYMENT FORM */}
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Amount (Rs)</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg">Rs</span>
                                        <input 
                                            type="number"
                                            value={paymentForm.amount}
                                            onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                                            className="w-full h-16 pl-14 pr-6 rounded-3xl bg-slate-50 border-2 border-transparent text-slate-900 text-xl font-black focus:bg-white focus:border-blue-500 transition-all outline-none"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Mode</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['Cash', 'Bank', 'Online'].map(mode => (
                                            <button
                                                key={mode}
                                                onClick={() => setPaymentForm({...paymentForm, method: mode})}
                                                className={`h-14 rounded-2xl border-2 text-[11px] font-black uppercase tracking-widest transition-all ${paymentForm.method === mode ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                            >
                                                {mode}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reference (Optional)</label>
                                    <input 
                                        type="text"
                                        value={paymentForm.reference}
                                        onChange={(e) => setPaymentForm({...paymentForm, reference: e.target.value})}
                                        className="w-full h-16 px-6 rounded-3xl bg-slate-50 border-2 border-transparent text-slate-900 font-bold focus:bg-white focus:border-blue-500 transition-all outline-none"
                                        placeholder="Receipt No / Tx ID"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                            <button 
                                disabled={saving || !paymentForm.amount}
                                onClick={handlePartialPayment}
                                className="w-full h-16 rounded-3xl bg-blue-600 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-3"
                            >
                                {saving ? (
                                    <div className="h-6 w-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[24px]">verified</span>
                                        Confirm Collection
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </SchoolShell>
    );
}

function StatCard({ label, value, icon, color, bg }: { label: string; value: string | number; icon: string, color: string, bg: string }) {
    return (
        <div className="premium-card bg-white p-5 border-slate-200/60 shadow-sm flex items-center justify-between group hover:border-blue-300 transition-all">
            <div className="min-w-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
                <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-none truncate">{value}</h3>
            </div>
            <div className={`h-12 w-12 rounded-2xl ${bg} ${color} flex items-center justify-center transition-all group-hover:scale-110 shadow-sm border border-black/5`}>
                <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>
        </div>
    );
}

function CompactPill({ label, value, color = "text-slate-600", bg = "bg-slate-50/80" }: { label: string; value: number; color?: string, bg?: string }) {
    return (
        <div className={`rounded-xl p-2.5 border border-slate-100/50 ${bg} flex flex-col items-center text-center`}>
            <p className="text-[8px] font-black uppercase text-slate-400 mb-1 tracking-tighter">{label}</p>
            <p className={`text-[12px] font-black ${color} truncate w-full`}>{value > 0 ? `Rs ${value.toLocaleString()}` : "Rs 0"}</p>
        </div>
    );
}
