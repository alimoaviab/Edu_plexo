"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge, Button, Card, DataState, PageHeader, Skeleton, TableSkeleton } from "../../../components/ui";
import { useAcademicYears } from "../hooks/useAcademicYears";
import { AcademicYearRow, AcademicYearUpdateInput } from "../types/academicYear.types";
import { showToast } from "../../../utils/toast";
import { AcademicYearEditSidebar } from "../components/AcademicYearEditSidebar";
import { AcademicYearTable } from "../components/AcademicYearTable";

type ViewMode = "grid" | "list";

export function AcademicYearListPage() {
  const { state, updateAcademicYear, deleteAcademicYear } = useAcademicYears();
  const [editingYear, setEditingYear] = useState<AcademicYearRow | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed" | "cancelled">("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const years = state.data ?? [];
  const activeYear = years.find((year) => year.is_active);

  const filteredYears = years.filter((row) => {
    const q = searchQuery.trim().toLowerCase();
    const queryMatch =
      q.length === 0 ||
      row.year.toLowerCase().includes(q) ||
      (row.description || "").toLowerCase().includes(q);
    const statusMatch = statusFilter === "all" ? true : row.status === statusFilter;
    return queryMatch && statusMatch;
  });

  const formatDate = (value?: string) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const durationInDays = (startDate?: string, endDate?: string) => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.max(end.getTime() - start.getTime(), 0);
    return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
  };

  if (state.status === "loading" || state.status === "idle") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <TableSkeleton />
      </div>
    );
  }

  if (state.status === "error") {
    return <DataState variant="error" title="Failed to load academic years" message={state.error} />;
  }

  return (
    <div className="space-y-4">
      {/* Stats Section - More Compact */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="premium-card p-3 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Sessions</span>
          <div className="flex items-end justify-between mt-1">
            <span className="text-xl font-bold text-slate-900">{years.length}</span>
            <span className="material-symbols-outlined text-slate-200">calendar_month</span>
          </div>
        </div>
        <div className="premium-card p-3 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Year</span>
          <div className="flex items-end justify-between mt-1">
            <span className="text-xl font-bold text-blue-600">{activeYear?.year || "None"}</span>
            <span className="material-symbols-outlined text-blue-100">verified</span>
          </div>
        </div>
        <div className="premium-card p-3 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Completed</span>
          <div className="flex items-end justify-between mt-1">
            <span className="text-xl font-bold text-emerald-600">{years.filter(y => y.status === "completed").length}</span>
            <span className="material-symbols-outlined text-emerald-100">check_circle</span>
          </div>
        </div>
        <div className="md:flex hidden premium-card p-3 flex-col justify-between border-blue-100 bg-blue-50/30">
          <Link href="/admin/academic-years/create" className="flex items-center justify-between h-full group">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Quick Action</span>
              <span className="text-[13px] font-bold text-blue-700 mt-1">Create New Session</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-lg">add</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Operational Toolbar */}
      <div className="premium-card p-2 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white/50 backdrop-blur-sm sticky top-14 z-10 border-slate-200/60 shadow-sm">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-base text-slate-400">search</span>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search academic years..."
              className="h-8 w-full rounded-md border border-slate-200 bg-white pl-8 pr-2.5 text-xs text-slate-700 outline-none transition-all focus:border-blue-300 focus:ring-4 focus:ring-blue-600/5"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as any)}
            className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs font-bold text-slate-600 outline-none transition-all focus:border-blue-300"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border border-slate-200 bg-white p-0.5 shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex h-7 items-center gap-1.5 rounded px-2.5 text-[11px] font-bold transition-all ${
                viewMode === "grid" ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <span className="material-symbols-outlined text-sm">grid_view</span>
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex h-7 items-center gap-1.5 rounded px-2.5 text-[11px] font-bold transition-all ${
                viewMode === "list" ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <span className="material-symbols-outlined text-sm">view_list</span>
              List
            </button>
          </div>
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <Link
            href="/admin/academic-years/create"
            className="md:hidden flex h-8 items-center gap-1.5 rounded-md bg-blue-600 px-3 text-[11px] font-bold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            New
          </Link>
        </div>
      </div>

      {years.length === 0 ? (
        <DataState
          variant="empty"
          title="No academic years found"
          message="Get started by creating the first academic year for your school."
        />
      ) : filteredYears.length === 0 ? (
        <DataState
          variant="empty"
          title="No matching sessions"
          message="Try changing your search or status filter."
        />
      ) : (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredYears.map((row) => {
              const days = durationInDays(row.start_date, row.end_date);
              const isActive = row.is_active;
              const statusColor = row.status === "active" ? "text-emerald-600 bg-emerald-50 border-emerald-100" : row.status === "completed" ? "text-blue-600 bg-blue-50 border-blue-100" : "text-slate-500 bg-slate-50 border-slate-100";
              
              return (
                <div
                  key={row._id}
                  className={`premium-card group relative flex flex-col p-0 overflow-hidden transition-all hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 ${isActive ? "border-blue-200 ring-1 ring-blue-100 shadow-lg shadow-blue-900/5" : ""}`}
                >
                  {/* Status Strip */}
                  <div className={`h-1.5 w-full ${isActive ? 'bg-blue-600' : 'bg-slate-100'}`} />
                  
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                           <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusColor}`}>
                             {row.status}
                           </span>
                           {isActive && (
                             <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-blue-600">
                               <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                               Primary Session
                             </span>
                           )}
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">{row.year}</h3>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => setEditingYear(row)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100 bg-white shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit_square</span>
                        </button>
                        <button 
                          onClick={async () => {
                            if (window.confirm(`Terminate ${row.year}?`)) {
                              const result = await deleteAcademicYear(row._id);
                              if (result.ok) showToast(`${row.year} deleted`, "success");
                            }
                          }}
                          className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all border border-slate-100 bg-white shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                       {/* Timeline Component */}
                       <div className="relative flex items-center justify-between">
                          <div className="absolute left-0 right-0 h-0.5 bg-slate-100 top-1/2 -translate-y-1/2" />
                          <div className="relative z-10 bg-white pr-2">
                             <div className="h-6 w-6 rounded-full border-2 border-slate-100 bg-white flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-slate-300" />
                             </div>
                             <p className="mt-1 text-[9px] font-black text-slate-400 uppercase">{formatDate(row.start_date)}</p>
                          </div>
                          {days && (
                             <div className="relative z-10 bg-white px-2 py-0.5 rounded-full border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-black text-slate-900">{days}d</p>
                             </div>
                          )}
                          <div className="relative z-10 bg-white pl-2 text-right">
                             <div className="h-6 w-6 rounded-full border-2 border-slate-100 bg-white flex items-center justify-center ml-auto">
                                <div className="h-2 w-2 rounded-full bg-slate-300" />
                             </div>
                             <p className="mt-1 text-[9px] font-black text-slate-400 uppercase">{formatDate(row.end_date)}</p>
                          </div>
                       </div>

                       <div className="flex items-center justify-between py-3 px-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                          <div className="flex items-center gap-2">
                             <span className="material-symbols-outlined text-slate-400 text-lg">description</span>
                             <span className="text-[11px] font-bold text-slate-600 truncate max-w-[120px]">
                               {row.description || "No session notes"}
                             </span>
                          </div>
                          <div className="flex -space-x-2">
                             {[1,2,3].map(i => (
                               <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center">
                                  <span className="text-[8px] font-bold text-slate-400">{i}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="mt-auto p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                     <div className="flex items-center gap-2 text-emerald-600">
                        <span className="material-symbols-outlined text-[16px] font-black">sync_saved_locally</span>
                        <span className="text-[10px] font-black uppercase tracking-wider">Synchronized</span>
                     </div>
                     <button 
                        onClick={() => setEditingYear(row)}
                        className="text-[11px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1"
                     >
                        Configuration
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                     </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="premium-card overflow-hidden">
            <AcademicYearTable years={filteredYears} />
          </div>
        )
      )}

      <AcademicYearEditSidebar
        academicYear={editingYear}
        isOpen={editingYear !== null}
        onClose={() => setEditingYear(null)}
        onSave={async (id, data) => {
          setIsSaving(true);
          try {
            await updateAcademicYear(id, data as AcademicYearUpdateInput);
            setEditingYear(null);
            showToast("Academic year updated", "success");
          } finally {
            setIsSaving(false);
          }
        }}
        isSaving={isSaving}
      />
    </div>
  );
}
