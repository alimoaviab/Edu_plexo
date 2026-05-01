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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Teacher Directory</h2>
          <p className="text-sm text-gray-500">Manage all teaching staff</p>
        </div>
        <Link
          href="/admin/teachers/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Teacher
        </Link>
      </div>

      {(state.data || []).length === 0 ? (
        <DataState variant="empty" title="No teachers found" message="Get started by adding your first teacher." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(state.data || []).map((row) => (
            <div
              key={row._id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">
                <h3 className="font-bold text-lg text-gray-900">{row.first_name} {row.last_name}</h3>
                <p className="text-xs text-gray-500 mt-1 font-mono">{row.employee_no}</p>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div>
                  <span className="text-gray-500">Email:</span>
                  <p className="text-gray-900 font-medium truncate">{row.email}</p>
                </div>
                <div>
                  <span className="text-gray-500">Phone:</span>
                  <p className="text-gray-900 font-medium">{row.phone || "—"}</p>
                </div>
                <div>
                  <span className="text-gray-500">Qualification:</span>
                  <p className="text-gray-900 font-medium">{row.qualification || "—"}</p>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <p className="text-gray-900 font-medium capitalize">{row.status.replace("_", " ")}</p>
                </div>
                {row.subjects && row.subjects.length > 0 && (
                  <div>
                    <span className="text-gray-500">Subjects:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {row.subjects.slice(0, 2).map((s) => (
                        <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                      ))}
                      {row.subjects.length > 2 && (
                        <Badge variant="secondary" className="text-[10px]">+{row.subjects.length - 2}</Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditingTeacher(row)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-base">edit</span>
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm(`Delete ${row.first_name} ${row.last_name}?`)) {
                      const result = await deleteTeacher(row._id);
                      if (!result.ok) {
                        showToast(result.error.message || "Failed to delete", "error");
                      }
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                  Delete
                </button>
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
