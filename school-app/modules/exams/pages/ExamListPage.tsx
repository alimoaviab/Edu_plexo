"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DataTable, DataTableColumn, RowAction, Badge, DataState, Skeleton, TableSkeleton } from "../../../components/ui";
import { useExams } from "../hooks/useExams";
import { ExamRow } from "../types/exam.types";
import { showToast } from "../../../utils/toast";

export function ExamListPage({ filters }: { filters?: { class_id?: string; subject?: string } }) {
  const pathname = usePathname();
  const { state, updateExam, deleteExam } = useExams(filters);

  const columns: DataTableColumn<ExamRow>[] = [
    {
      key: "title",
      label: "Exam",
      render: (row) => (
        <div>
          <div className="font-semibold text-gray-900">{row.title}</div>
          <div className="text-xs text-gray-400">{row.subject}</div>
        </div>
      ),
      sortable: true,
      sortFn: (a, b) => a.title.localeCompare(b.title),
    },
    {
      key: "class",
      label: "Class",
      render: (row) => <span className="text-sm text-gray-600">{row.class_name || row.class_id}</span>,
    },
    {
      key: "date",
      label: "Date",
      render: (row) => <span className="text-sm text-gray-600">{row.starts_at}</span>,
    },
    {
      key: "marks",
      label: "Max Marks",
      render: (row) => <span className="text-sm font-medium text-gray-700">{row.max_marks}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge
          variant={
            row.status === "scheduled" ? "primary" : row.status === "completed" ? "success" : "error"
          }
          className="capitalize"
        >
          {row.status}
        </Badge>
      ),
    },
  ];

  const rowActions: RowAction<ExamRow>[] = [
    {
      icon: "visibility",
      label: "View Details",
      variant: "primary",
      onClick: (row) => {
        // Could navigate to detail page or show modal
        alert(`Exam: ${row.title}\nSubject: ${row.subject}\nDate: ${row.starts_at}\n\nDescription: ${row.description || "No description"}`);
      },
    },
    {
      icon: "edit",
      label: "Edit Exam",
      variant: "ghost",
      onClick: async (row) => {
        const title = window.prompt("Exam title", row.title)?.trim();
        if (!title) {
          return;
        }
        const status = window.prompt("Status (scheduled/completed/cancelled)", row.status)?.trim();
        if (!status) {
          return;
        }
        await updateExam(row._id, {
          title,
          status: status as ExamRow["status"]
        });
      },
    },
    {
      icon: "delete",
      label: "Delete Exam",
      variant: "danger",
      requireConfirm: true,
      confirmTitle: "Delete Exam",
      confirmMessage: (row: ExamRow) => `Are you sure you want to delete "${row.title}"? This action cannot be undone.`,
      onClick: async (row) => {
        const result = await deleteExam(row._id);
        if (!result.ok) {
          showToast(result.error.message || "Failed to delete exam", "error");
        }
      },
    },
  ];

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
    return <DataState variant="error" title="Failed to load exams" message={state.error} />;
  }

  return (
    <div className="space-y-6">
      {/* Operational Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Examination Schedule</h2>
          <p className="text-sm font-medium text-slate-500">Track, manage, and analyze student assessment cycles.</p>
        </div>
        {!pathname.includes("/parent") && (
          <Link
            href={pathname.includes("/teacher") ? "/teacher/exams/create" : "/admin/exams/create"}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[20px]">add_task</span>
            Create Examination
          </Link>
        )}
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Exams", value: state.data?.length || 0, icon: "analytics", color: "blue" },
          { label: "Scheduled", value: state.data?.filter(e => e.status === "scheduled").length || 0, icon: "event", color: "amber" },
          { label: "Completed", value: state.data?.filter(e => e.status === "completed").length || 0, icon: "task_alt", color: "emerald" },
          { label: "Avg. Marks", value: "85%", icon: "monitoring", color: "indigo" },
        ].map((stat, i) => (
          <div key={i} className="premium-card p-4 flex items-center gap-4">
             <div className={`h-10 w-10 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center`}>
                <span className="material-symbols-outlined text-[22px]">{stat.icon}</span>
             </div>
             <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-lg font-black text-slate-900">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Main List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(state.data || []).map((exam) => (
          <div key={exam._id} className="premium-card group hover:border-blue-300 transition-all">
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[24px]">description</span>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900 leading-tight">{exam.title}</h3>
                    <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest mt-0.5">{exam.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button 
                    onClick={() => deleteExam(exam._id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-slate-50 rounded-xl p-2.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Class</p>
                  <p className="text-xs font-bold text-slate-700">{exam.class_name || "Unassigned"}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-2.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Max Marks</p>
                  <p className="text-xs font-bold text-slate-700">{exam.max_marks} Points</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-[16px]">calendar_today</span>
                  <span className="text-[11px] font-bold text-slate-600">{exam.starts_at}</span>
                </div>
                <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                  exam.status === "scheduled" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                  exam.status === "completed" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                  "bg-slate-50 text-slate-500 border border-slate-100"
                }`}>
                  {exam.status}
                </div>
              </div>
            </div>
            
            <div className="px-5 py-3 bg-slate-50/50 flex items-center justify-between group-hover:bg-blue-50/50 transition-colors">
               <button className="text-[11px] font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  View Details
               </button>
               <button className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">assignment_turned_in</span>
                  Enter Results
               </button>
            </div>
          </div>
        ))}
      </div>

      {(state.data || []).length === 0 && (
        <div className="py-20 text-center premium-card border-dashed border-2">
           <div className="h-16 w-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px]">assignment_late</span>
           </div>
           <h3 className="text-lg font-bold text-slate-900">No Exams Found</h3>
           <p className="text-sm text-slate-500 max-w-xs mx-auto mb-6">Start by scheduling an examination for your classes.</p>
           <Link
              href={pathname.includes("/teacher") ? "/teacher/exams/create" : "/admin/exams/create"}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all"
            >
              Schedule First Exam
            </Link>
        </div>
      )}
    </div>
  );
}
