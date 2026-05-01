"use client";

import Link from "next/link";
import { useState } from "react";
import { DataTable, DataTableColumn, RowAction, Badge, DataState, Skeleton, TableSkeleton } from "../../../components/ui";
import { useAcademicYears } from "../hooks/useAcademicYears";
import { AcademicYearRow, AcademicYearUpdateInput } from "../types/academicYear.types";
import { showToast } from "../../../utils/toast";
import { AcademicYearEditSidebar } from "../components/AcademicYearEditSidebar";

export function AcademicYearListPage() {
  const { state, updateAcademicYear, deleteAcademicYear } = useAcademicYears();
  const [editingYear, setEditingYear] = useState<AcademicYearRow | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const columns: DataTableColumn<AcademicYearRow>[] = [
    {
      key: "year",
      label: "Academic Year",
      render: (row) => <span className="font-semibold text-gray-900">{row.year}</span>,
      sortable: true,
      sortFn: (a, b) => a.year.localeCompare(b.year),
    },
    {
      key: "start_date",
      label: "Start Date",
      render: (row) => (
        <span className="text-sm text-gray-600">
          {row.start_date ? new Date(row.start_date).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "end_date",
      label: "End Date",
      render: (row) => (
        <span className="text-sm text-gray-600">
          {row.end_date ? new Date(row.end_date).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "active",
      label: "Active",
      render: (row) => (
        <Badge variant={row.is_active ? "success" : "gray"} className="capitalize">
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
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

  const rowActions: RowAction<AcademicYearRow>[] = [
    {
      icon: "visibility",
      label: "View Details",
      variant: "primary",
      onClick: (row) => {
        alert(`Year: ${row.year}\nStart: ${row.start_date || "N/A"}\nEnd: ${row.end_date || "N/A"}\nDescription: ${row.description || "No description"}`);
      },
    },
    {
      icon: "edit",
      label: "Edit Year",
      variant: "ghost",
      onClick: async (row) => {
        const description = window.prompt("Description", row.description || "")?.trim() || "";
        const activeChoice = window.prompt("Set active? (yes/no)", row.is_active ? "yes" : "no")?.trim().toLowerCase();
        if (!activeChoice) {
          return;
        }
        await updateAcademicYear(row._id, {
          description,
          is_active: activeChoice === "yes"
        });
      },
    },
    {
      icon: "delete",
      label: "Delete Year",
      variant: "danger",
      requireConfirm: true,
      confirmTitle: "Delete Academic Year",
      confirmMessage: (row: AcademicYearRow) => `Are you sure you want to delete ${row.year}?`,
      onClick: async (row) => {
        const result = await deleteAcademicYear(row._id);
        if (!result.ok) {
          showToast(result.error.message || "Failed to delete academic year", "error");
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
    return <DataState variant="error" title="Failed to load academic years" message={state.error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Academic Years</h2>
          <p className="text-sm text-gray-500">Manage school academic sessions</p>
        </div>
        <Link
          href="/admin/academic-years/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Year
        </Link>
      </div>

      {(state.data || []).length === 0 ? (
        <DataState
          variant="empty"
          title="No academic years found"
          message="Get started by creating the first academic year."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(state.data || []).map((row) => (
            <div
              key={row._id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">{row.year}</h3>
                  <p className="text-sm text-gray-500 mt-1">{row.description || "No description"}</p>
                </div>
                <Badge
                  variant={row.is_active ? "success" : "gray"}
                  className="capitalize flex-shrink-0 ml-2"
                >
                  {row.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div>
                  <span className="text-gray-500">Start Date:</span>
                  <p className="text-gray-900 font-medium">
                    {row.start_date ? new Date(row.start_date).toLocaleDateString() : "—"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">End Date:</span>
                  <p className="text-gray-900 font-medium">
                    {row.end_date ? new Date(row.end_date).toLocaleDateString() : "—"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <p className="text-gray-900 font-medium capitalize">{row.status}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditingYear(row)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-base">edit</span>
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm(`Delete ${row.year}?`)) {
                      const result = await deleteAcademicYear(row._id);
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

      <AcademicYearEditSidebar
        academicYear={editingYear}
        isOpen={editingYear !== null}
        onClose={() => setEditingYear(null)}
        onSave={async (id, data) => {
          setIsSaving(true);
          try {
            await updateAcademicYear(id, data as AcademicYearUpdateInput);
          } finally {
            setIsSaving(false);
          }
        }}
        isSaving={isSaving}
      />
    </div>
  );
}
