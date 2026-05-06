"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DataTable, DataTableColumn, RowAction, Badge, DataState, ListToolbar, Skeleton, TableSkeleton } from "../../../components/ui";
import { useStudents } from "../hooks/useStudents";
import { useClasses } from "../../classes/hooks/useClasses";
import { useSubjects } from "../../subjects/hooks/useSubjects";
import { StudentRow, StudentPatchInput } from "../types/student.types";
import { showToast } from "../../../utils/toast";
import { StudentEditSidebar } from "../components/StudentEditSidebar";

export function StudentListPage() {
  const { state, updateStudent, deleteStudent } = useStudents();
  const { state: classesState } = useClasses();
  const { data: subjectsData } = useSubjects();
  const [editingStudent, setEditingStudent] = useState<StudentRow | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const subjectOptions = subjectsData.map((subj) => ({ id: (subj as any)._id || (subj as any).id || subj.name, label: subj.name }));
  const classOptions = (classesState.data || []).map((cls) => ({
    id: cls._id,
    label: cls.name,
  }));

  const filteredRows = useMemo(() => {
    const rows = state.data || [];
    const q = searchQuery.trim().toLowerCase();
    return rows.filter((row) => {
      const queryMatch =
        q.length === 0 ||
        row.admission_no.toLowerCase().includes(q) ||
        `${row.first_name} ${row.last_name}`.toLowerCase().includes(q) ||
        (row.guardian?.name || "").toLowerCase().includes(q) ||
        (row.class_id || "").toLowerCase().includes(q);
      const statusMatch = statusFilter === "all" ? true : row.status === statusFilter;
      return queryMatch && statusMatch;
    });
  }, [state.data, searchQuery, statusFilter]);

  const columns: DataTableColumn<StudentRow>[] = [
    {
      key: "admission_no",
      label: "Admission No",
      render: (row) => <span className="font-mono text-xs text-gray-500">{row.admission_no}</span>,
    },
    {
      key: "name",
      label: "Name",
      render: (row) => <span className="font-semibold text-gray-900">{row.first_name} {row.last_name}</span>,
      sortable: true,
      sortFn: (a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`),
    },
    {
      key: "class",
      label: "Class / Section",
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-700">{row.class_id}</span>
          <Badge variant="secondary">{row.section}</Badge>
        </div>
      ),
    },
    {
      key: "guardian",
      label: "Guardian",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">{row.guardian.name}</span>
          <span className="text-xs text-gray-400">{row.guardian.phone}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge variant={row.status === "active" ? "success" : "gray"} className="capitalize">
          {row.status}
        </Badge>
      ),
    },
  ];

  const rowActions: RowAction<StudentRow>[] = [
    {
      icon: "visibility",
      label: "View Details",
      variant: "primary",
      onClick: (row) => {
        alert(`Student: ${row.first_name} ${row.last_name}\nAdmission: ${row.admission_no}\nGuardian: ${row.guardian.name} (${row.guardian.phone})`);
      },
    },
    {
      icon: "edit",
      label: "Edit Student",
      variant: "ghost",
      onClick: async (row) => {
        const first_name = window.prompt("First name", row.first_name)?.trim();
        if (!first_name) {
          return;
        }
        const last_name = window.prompt("Last name", row.last_name)?.trim();
        if (!last_name) {
          return;
        }
        await updateStudent(row._id, { first_name, last_name });
      },
    },
    {
      icon: "delete",
      label: "Delete Student",
      variant: "danger",
      requireConfirm: true,
      confirmTitle: "Delete Student",
      confirmMessage: (row: StudentRow) => `Are you sure you want to delete ${row.first_name} ${row.last_name}?`,
      onClick: async (row) => {
        const result = await deleteStudent(row._id);
        if (!result.ok) {
          showToast(result.error.message || "Failed to delete student", "error");
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
    return <DataState variant="error" title="Failed to load students" message={state.error} />;
  }

  return (
    <div className="space-y-6">
      {/* Executive Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
             <span className="material-symbols-outlined text-[24px]">person_search</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Student Directory</p>
            <p className="text-sm font-bold text-slate-500">Global records for {filteredRows.length} students</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <Link
             href="/admin/students/create"
             className="flex h-10 items-center px-4 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
           >
             <span className="material-symbols-outlined mr-2 text-[18px]">person_add</span>
             Register Student
           </Link>
        </div>
      </div>

      <ListToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by name, admission no, class, guardian"
        filterValue={statusFilter}
        onFilterChange={(value) => setStatusFilter(value as "all" | "active" | "inactive")}
        filterOptions={[
          { value: "all", label: "All statuses" },
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ]}
        rightSlot={
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`inline-flex h-8 items-center gap-1 rounded-md px-2 text-[10px] font-black uppercase transition-all ${
                  viewMode === "grid" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">grid_view</span>
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`inline-flex h-8 items-center gap-1 rounded-md px-2 text-[10px] font-black uppercase transition-all ${
                  viewMode === "list" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">view_list</span>
                List
              </button>
            </div>
          </div>
        }
      />

      {(state.data || []).length === 0 ? (
        <DataState variant="empty" title="No students found" message="Get started by adding your first student record." />
      ) : filteredRows.length === 0 ? (
        <DataState variant="empty" title="No matching students" message="Try adjusting search or status filters." />
      ) : (
        viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filteredRows.map((row) => (
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
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">ID-{row.admission_no}</span>
                        <div className="h-1 w-1 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{row.class_id || "UNASSIGNED"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                     <button 
                        onClick={() => setEditingStudent(row)}
                        className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100 bg-white"
                     >
                        <span className="material-symbols-outlined text-[16px]">edit_square</span>
                     </button>
                     <button 
                        onClick={async () => {
                           if (window.confirm(`Delete ${row.first_name}?`)) {
                              await deleteStudent(row._id);
                           }
                        }}
                        className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all border border-slate-100 bg-white"
                     >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                     </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-5">
                   <div className="flex flex-col items-center justify-center py-2 rounded-xl bg-slate-50/50 border border-slate-100">
                      <span className="text-[14px] font-black text-slate-900 tracking-tight">92%</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Attendance</span>
                   </div>
                   <div className="flex flex-col items-center justify-center py-2 rounded-xl bg-slate-50/50 border border-slate-100">
                      <span className="text-[14px] font-black text-blue-600 tracking-tight">A+</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">GPA</span>
                   </div>
                   <div className="flex flex-col items-center justify-center py-2 rounded-xl bg-slate-50/50 border border-slate-100">
                      <span className="text-[14px] font-black text-emerald-600 tracking-tight">85</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Behavior</span>
                   </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/30 border border-blue-100/30">
                   <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-400 text-[18px]">verified_user</span>
                      <div>
                         <p className="text-[9px] font-black text-blue-900 uppercase leading-none">{row.guardian?.name || "No Guardian"}</p>
                         <p className="text-[8px] font-bold text-blue-400 mt-0.5 leading-none">{row.guardian?.phone || "No Contact"}</p>
                      </div>
                   </div>
                   <div className={`h-2 w-2 rounded-full ${row.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'}`} />
                </div>
              </div>

              <div className="mt-auto p-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
                 <div className="flex -space-x-1.5">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-slate-200" />
                    ))}
                 </div>
                 <Link href={`/admin/students/${row._id}`} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                    View Dossier
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                 </Link>
              </div>
            </div>
          ))}
        </div>
        ) : (
          <DataTable
            columns={columns}
            rows={filteredRows}
            rowKey={(row) => row._id}
            sortable
            paginated={10}
            rowActions={rowActions}
            emptyState={{
              title: "No students found",
              description: "Adjust filters or add a student.",
              action: { label: "Add Student", href: "/admin/students/create" },
            }}
          />
        )
      )}

      <StudentEditSidebar
        student={editingStudent}
        isOpen={editingStudent !== null}
        classOptions={classOptions}
        subjectOptions={subjectOptions}
        onClose={() => setEditingStudent(null)}
        onSave={async (id, data) => {
          setIsSaving(true);
          try {
            await updateStudent(id, data as StudentPatchInput);
          } finally {
            setIsSaving(false);
          }
        }}
        isSaving={isSaving}
      />
    </div>
  );
}
