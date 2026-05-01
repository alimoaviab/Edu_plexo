"use client";

import Link from "next/link";
import { useState } from "react";
import { DataTable, DataTableColumn, RowAction, Badge, DataState, Skeleton, TableSkeleton } from "../../../components/ui";
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

  const subjectOptions = subjectsData.map((subj) => ({ id: (subj as any)._id || (subj as any).id || subj.name, label: subj.name }));
  const classOptions = (classesState.data || []).map((cls) => ({
    id: cls._id,
    label: cls.name,
  }));

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Student Directory</h2>
          <p className="text-sm text-gray-500">Manage all student records</p>
        </div>
        <Link
          href="/admin/students/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Student
        </Link>
      </div>

      {(state.data || []).length === 0 ? (
        <DataState variant="empty" title="No students found" message="Get started by adding your first student record." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(state.data || []).map((row) => (
            <div
              key={row._id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">
                <h3 className="font-bold text-lg text-gray-900">{row.first_name} {row.last_name}</h3>
                <p className="text-xs text-gray-500 mt-1 font-mono">Admission: {row.admission_no}</p>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div>
                  <span className="text-gray-500">Class/Section:</span>
                  <p className="text-gray-900 font-medium">{row.class_id} / {row.section}</p>
                </div>
                <div>
                  <span className="text-gray-500">Guardian:</span>
                  <p className="text-gray-900 font-medium">{row.guardian?.name || "—"}</p>
                  <p className="text-xs text-gray-500">{row.guardian?.phone || ""}</p>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <p className="text-gray-900 font-medium capitalize">{row.status}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditingStudent(row)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
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
