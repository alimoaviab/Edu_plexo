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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-950">Student Directory</h2>
          <p className="text-sm text-slate-600">Manage all student records</p>
        </div>
        <Link
          href="/admin/students/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Student
        </Link>
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
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-600">
              {filteredRows.length} visible
            </span>
            <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-semibold transition-all ${
                  viewMode === "grid" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">grid_view</span>
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-semibold transition-all ${
                  viewMode === "list" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">view_list</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRows.map((row) => (
            <div
              key={row._id}
              className="premium-card p-3.5"
            >
              <div className="mb-3">
                <h3 className="text-base font-semibold tracking-tight text-slate-950">{row.first_name} {row.last_name}</h3>
                <p className="mt-1 font-mono text-xs text-slate-500">Admission: {row.admission_no}</p>
              </div>

              <div className="mb-4 space-y-2.5 text-sm">
                <div>
                  <span className="text-slate-500">Class/Section:</span>
                  <p className="font-medium text-slate-900">{row.class_id} / {row.section}</p>
                </div>
                <div>
                  <span className="text-slate-500">Guardian:</span>
                  <p className="font-medium text-slate-900">{row.guardian?.name || "—"}</p>
                  <p className="text-xs text-slate-500">{row.guardian?.phone || ""}</p>
                </div>
                <div>
                  <span className="text-slate-500">Status:</span>
                  <p className="font-medium capitalize text-slate-900">{row.status}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingStudent(row)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100"
                >
                  <span className="material-symbols-outlined text-base">edit</span>
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm(`Delete ${row.first_name} ${row.last_name}?`)) {
                      const result = await deleteStudent(row._id);
                      if (!result.ok) {
                        showToast(result.error.message || "Failed to delete", "error");
                      }
                    }
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                  Delete
                </button>
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
