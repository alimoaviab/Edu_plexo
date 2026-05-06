"use client";

import Link from "next/link";
import { useState } from "react";
import { DataTable, DataTableColumn, RowAction, Badge, DataState, Skeleton, TableSkeleton } from "../../../components/ui";
import { useTeachers } from "../hooks/useTeachers";
import { useClasses } from "../../classes/hooks/useClasses";
import { useSubjects } from "../../subjects/hooks/useSubjects";
import { TeacherRow, TeacherFormInput } from "../types/teacher.types";
import { showToast } from "../../../utils/toast";
import { TeacherEditSidebar } from "../components/TeacherEditSidebar";

export function TeacherListPage() {
  const { state, updateTeacher, deleteTeacher } = useTeachers();
  const { state: classesState } = useClasses();
  const { data: subjectsData } = useSubjects();
  const [editingTeacher, setEditingTeacher] = useState<TeacherRow | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const classOptions = (classesState.data || []).map((cls) => ({
    id: cls._id,
    label: cls.name,
  }));

  const subjectOptions = subjectsData.map((subj) => ({ id: (subj as any)._id || (subj as any).id || subj.name, label: subj.name }));

  const columns: DataTableColumn<TeacherRow>[] = [
    {
      key: "employee_no",
      label: "Employee No",
      render: (row) => <span className="font-mono text-xs text-gray-500">{row.employee_no}</span>,
    },
    {
      key: "name",
      label: "Name",
      render: (row) => <span className="font-semibold text-gray-900">{row.first_name} {row.last_name}</span>,
      sortable: true,
      sortFn: (a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`),
    },
    {
      key: "email",
      label: "Email",
      render: (row) => <span className="text-sm text-gray-600">{row.email}</span>,
    },
    {
      key: "phone",
      label: "Phone",
      render: (row) => <span className="text-sm text-gray-600">{row.phone}</span>,
    },
    {
      key: "qualification",
      label: "Qualification",
      render: (row) => <span className="text-sm text-gray-600">{row.qualification || "—"}</span>,
    },
    {
      key: "subjects",
      label: "Subjects",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.subjects.slice(0, 2).map((s) => (
            <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
          ))}
          {row.subjects.length > 2 && (
            <Badge variant="secondary" className="text-[10px]">+{row.subjects.length - 2}</Badge>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge
          variant={row.status === "active" ? "success" : row.status === "on_leave" ? "warning" : "gray"}
          className="capitalize"
        >
          {row.status.replace("_", " ")}
        </Badge>
      ),
    },
  ];

  const rowActions: RowAction<TeacherRow>[] = [
    {
      icon: "visibility",
      label: "View Details",
      variant: "primary",
      onClick: (row) => {
        alert(`Teacher: ${row.first_name} ${row.last_name}\nEmployee No: ${row.employee_no}\nSubjects: ${row.subjects.join(", ")}\nClasses: ${row.class_ids?.join(", ") || "None"}`);
      },
    },
    {
      icon: "edit",
      label: "Edit Teacher",
      variant: "ghost",
      onClick: async (row) => {
        const phone = window.prompt("Phone", row.phone)?.trim();
        if (!phone) {
          return;
        }
        const qualification = window.prompt("Qualification", row.qualification || "")?.trim() || "";
        await updateTeacher(row._id, { phone, qualification });
      },
    },
    {
      icon: "delete",
      label: "Delete Teacher",
      variant: "danger",
      requireConfirm: true,
      confirmTitle: "Delete Teacher",
      confirmMessage: (row: TeacherRow) => `Are you sure you want to delete ${row.first_name} ${row.last_name}?`,
      onClick: async (row) => {
        const result = await deleteTeacher(row._id);
        if (!result.ok) {
          showToast(result.error.message || "Failed to delete teacher", "error");
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
    return <DataState variant="error" title="Failed to load teachers" message={state.error} />;
  }

  return (
    <div className="space-y-6">
      {/* Executive Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
             <span className="material-symbols-outlined text-[24px]">badge</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Faculty Management</p>
            <p className="text-sm font-bold text-slate-500">Global teaching staff records</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <Link
             href="/admin/teachers/create"
             className="flex h-10 items-center px-4 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
           >
             <span className="material-symbols-outlined mr-2 text-[18px]">person_add</span>
             Add Faculty
           </Link>
        </div>
      </div>

      {(state.data || []).length === 0 ? (
        <DataState variant="empty" title="No teachers found" message="Get started by adding your first teacher." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {(state.data || []).map((row) => (
            <div
              key={row._id}
              className="premium-card group flex flex-col p-0 overflow-hidden transition-all hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5"
            >
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 font-black text-xs border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                      {row.first_name.substring(0, 1)}{row.last_name.substring(0, 1)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-black text-slate-900 tracking-tight truncate leading-tight">{row.first_name} {row.last_name}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">#{row.employee_no}</span>
                        <div className="h-1 w-1 rounded-full bg-slate-200" />
                        <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${row.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {row.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                     <button 
                        onClick={() => setEditingTeacher(row)}
                        className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100 bg-white"
                     >
                        <span className="material-symbols-outlined text-[16px]">edit_square</span>
                     </button>
                     <button 
                        onClick={async () => {
                           if (window.confirm(`Delete ${row.first_name}?`)) {
                              await deleteTeacher(row._id);
                           }
                        }}
                        className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all border border-slate-100 bg-white"
                     >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                     </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                   <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-2.5">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Workload</span>
                      <div className="flex items-center gap-2">
                         <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: '75%' }} />
                         </div>
                         <span className="text-[10px] font-black text-slate-900">75%</span>
                      </div>
                   </div>
                   <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-2.5">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Capacity</span>
                      <p className="text-[11px] font-black text-slate-900">{(row.class_ids || []).length} / 12 Classes</p>
                   </div>
                </div>

                <div className="space-y-2">
                   <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Specialization</span>
                      <span className="text-[9px] font-black text-blue-600 uppercase">{row.qualification || "B.Ed"}</span>
                   </div>
                   <div className="flex flex-wrap gap-1.5">
                      {(row.subjects || []).slice(0, 4).map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-lg bg-blue-50/50 text-blue-700 text-[9px] font-black uppercase tracking-tighter border border-blue-100/50">
                          {s}
                        </span>
                      ))}
                      {(row.subjects || []).length > 4 && (
                        <span className="px-2 py-0.5 rounded-lg bg-white text-slate-400 text-[9px] font-bold border border-slate-100">
                          +{(row.subjects || []).length - 4}
                        </span>
                      )}
                   </div>
                </div>
              </div>

              <div className="mt-auto p-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="flex -space-x-1.5">
                       {[1, 2, 3].map(i => (
                         <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-slate-200" />
                       ))}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Schedule</span>
                 </div>
                 <Link href={`/admin/teachers/${row._id}`} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                    Faculty Hub
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                 </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <TeacherEditSidebar
        teacher={editingTeacher}
        isOpen={editingTeacher !== null}
        classOptions={classOptions}
        subjectOptions={subjectOptions}
        onClose={() => setEditingTeacher(null)}
        onSave={async (id, data) => {
          setIsSaving(true);
          try {
            await updateTeacher(id, data as Partial<TeacherFormInput>);
          } finally {
            setIsSaving(false);
          }
        }}
        isSaving={isSaving}
      />
    </div>
  );
}
