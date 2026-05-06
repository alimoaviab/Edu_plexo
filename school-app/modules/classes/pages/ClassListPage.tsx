"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DataTable, DataTableColumn, RowAction, Badge, DataState, ListToolbar, Skeleton, TableSkeleton } from "../../../components/ui";
import { useClasses } from "../hooks/useClasses";
import { useAcademyCare } from "../../academyCare/hooks/useAcademyCare";
import { useTeachers } from "../../teachers/hooks/useTeachers";
import { ClassRow, ClassFormInput } from "../types/class.types";
import { showToast } from "../../../utils/toast";
import { ClassEditSidebar } from "../components/ClassEditSidebar";
import { generateTimetable } from "../../timetable/services/timetable.service";
import { useSafeAsync } from "../../../hooks/useSafeAsync";

export function ClassListPage() {
  const { state, updateClass, deleteClass } = useClasses();
  const { state: academyCareState } = useAcademyCare();
  const { state: teachersState } = useTeachers();
  const [editingClass, setEditingClass] = useState<ClassRow | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { state: generateState, run: runGenerate } = useSafeAsync<void>();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const academyCareOptions = (academyCareState.data || []).map((ac) => ({
    id: ac._id,
    label: (ac as any).name || ac.year,
  }));

  const teacherOptions = (teachersState.data || []).map((teacher) => ({
    id: teacher._id,
    label: `${teacher.first_name} ${teacher.last_name}`,
  }));

  const subjectOptions = [
    { id: "math", label: "Mathematics" },
    { id: "english", label: "English" },
    { id: "science", label: "Science" },
    { id: "social_studies", label: "Social Studies" },
    { id: "hindi", label: "Hindi" },
    { id: "sanskrit", label: "Sanskrit" },
    { id: "physical_education", label: "Physical Education" },
  ];

  const handleGenerateTimetable = async () => {
    await runGenerate(async () => {
      const result = await generateTimetable({
        startTime: "08:00",
        endTime: "16:00",
        slotDuration: 45,
      });

      if (!result.ok) {
        throw new Error(result.error.message || "Failed to generate timetable");
      }

      showToast(`Successfully generated ${result.data.generated} timetable entries`, "success");
    });
  };

  const filteredRows = useMemo(() => {
    const rows = state.data || [];
    const q = searchQuery.trim().toLowerCase();
    return rows.filter((row) => {
      const queryMatch =
        q.length === 0 ||
        row.name.toLowerCase().includes(q) ||
        (row.description || "").toLowerCase().includes(q) ||
        (row.academy_care_year || row.academy_care_id || "").toLowerCase().includes(q) ||
        (row.room_number || "").toLowerCase().includes(q) ||
        (row.teacher_names || row.teacher_ids || []).join(" ").toLowerCase().includes(q) ||
        row.subjects.join(" ").toLowerCase().includes(q);
      const statusMatch = statusFilter === "all" ? true : row.status === statusFilter;
      return queryMatch && statusMatch;
    });
  }, [state.data, searchQuery, statusFilter]);

  const columns: DataTableColumn<ClassRow>[] = [
    {
      key: "name",
      label: "Class Name",
      render: (row) => <span className="font-semibold text-gray-900">{row.name}</span>,
      sortable: true,
      sortFn: (a, b) => a.name.localeCompare(b.name),
    },
    {
      key: "academic_year",
      label: "Academic Year",
      render: (row) => <span className="text-sm text-gray-600">{row.academy_care_year || row.academy_care_id}</span>,
    },
    {
      key: "room",
      label: "Room",
      render: (row) => <span className="text-sm text-gray-600">{row.room_number || "—"}</span>,
    },
    {
      key: "teachers",
      label: "Teachers",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {(row.teacher_names || row.teacher_ids || []).slice(0, 2).map((t, i) => (
            <Badge key={i} variant="secondary" className="text-[10px]">{t}</Badge>
          ))}
          {(row.teacher_names || row.teacher_ids || []).length > 2 && (
            <Badge variant="secondary" className="text-[10px]">+{(row.teacher_names || row.teacher_ids || []).length - 2}</Badge>
          )}
        </div>
      ),
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
        <Badge variant={row.status === "active" ? "success" : "gray"} className="capitalize">
          {row.status}
        </Badge>
      ),
    },
  ];

  const rowActions: RowAction<ClassRow>[] = [
    {
      icon: "visibility",
      label: "View Details",
      variant: "primary",
      onClick: (row) => {
        alert(`Class: ${row.name}\nRoom: ${row.room_number || "N/A"}\nDescription: ${row.description || "No description"}`);
      },
    },
    {
      icon: "edit",
      label: "Edit Class",
      variant: "ghost",
      onClick: async (row) => {
        const room_number = window.prompt("Room number", row.room_number || "")?.trim() || "";
        const description = window.prompt("Description", row.description || "")?.trim() || "";
        await updateClass(row._id, { room_number, description });
      },
    },
    {
      icon: "delete",
      label: "Delete Class",
      variant: "danger",
      requireConfirm: true,
      confirmTitle: "Delete Class",
      confirmMessage: (row: ClassRow) => `Are you sure you want to delete ${row.name}?`,
      onClick: async (row) => {
        const result = await deleteClass(row._id);
        if (!result.ok) {
          showToast(result.error.message || "Failed to delete class", "error");
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
    return <DataState variant="error" title="Failed to load classes" message={state.error} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
             <span className="material-symbols-outlined text-[24px]">school</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Section Overview</p>
            <p className="text-sm font-bold text-slate-500">Manage all classrooms and sections</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleGenerateTimetable}
            disabled={generateState.status === "loading" || (state.data || []).length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 rounded-xl transition-all hover:shadow-lg hover:shadow-green-600/25 active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-lg">
              {generateState.status === "loading" ? "hourglass_empty" : "auto_awesome"}
            </span>
            {generateState.status === "loading" ? "Generating..." : "Generate Timetables"}
          </button>
          <Link
            href="/admin/classes/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Class
          </Link>
        </div>
      </div>

      <ListToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search class, year, teacher, subject"
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
        <DataState variant="empty" title="No classes found" message="Get started by creating your first class." />
      ) : filteredRows.length === 0 ? (
        <DataState variant="empty" title="No matching classes" message="Try adjusting search or status filters." />
      ) : (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredRows.map((row) => (
              <div
                key={row._id}
                className="premium-card group transition-all hover:border-blue-300 flex flex-col"
              >
                <div className="p-4 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[24px]">groups</span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-[15px] font-bold text-slate-900 leading-tight truncate">{row.name}</h3>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mt-0.5">{row.academy_care_year || "Current Session"}</p>
                      </div>
                    </div>
                    <Badge variant={row.status === "active" ? "success" : "gray"} className="capitalize px-2 py-0.5 text-[9px] font-black tracking-widest">
                      {row.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Enrollment</span>
                           <span className="text-[10px] font-black text-slate-900">{row.student_count || 0}</span>
                        </div>
                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500" style={{ width: `${Math.min(((row.student_count || 0) / 40) * 100, 100)}%` }} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Attendance</span>
                           <span className="text-[10px] font-black text-emerald-600">{row.attendance_percentage || 0}%</span>
                        </div>
                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500" style={{ width: `${row.attendance_percentage || 0}%` }} />
                        </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex flex-wrap gap-1">
                        {row.subjects.slice(0, 4).map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded-lg bg-slate-50 text-slate-600 text-[9px] font-bold border border-slate-100">{s}</span>
                        ))}
                        {row.subjects.length > 4 && (
                          <span className="px-2 py-0.5 rounded-lg bg-white text-slate-400 text-[9px] font-bold border border-slate-100">+{row.subjects.length - 4}</span>
                        )}
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between group-hover:bg-blue-50/50 transition-colors">
                  <div className="flex items-center gap-1">
                    <Link
                        href={`/admin/timetable?class_id=${row._id}`}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all shadow-sm shadow-transparent hover:shadow-slate-200/50"
                        title="Schedule"
                      >
                        <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                      </Link>
                      <button
                        onClick={() => setEditingClass(row)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all shadow-sm shadow-transparent hover:shadow-slate-200/50"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                  </div>
                  <button
                    onClick={async () => {
                      if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
                        const result = await deleteClass(row._id);
                        if (result.ok) showToast(`${row.name} archived.`, "success");
                      }
                    }}
                    className="p-1.5 text-slate-300 hover:text-red-600 transition-colors"
                    title="Archive"
                  >
                    <span className="material-symbols-outlined text-[18px]">archive</span>
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
              title: "No classes found",
              description: "Adjust filters or add a class.",
              action: { label: "Add Class", href: "/admin/classes/create" },
            }}
          />
        )
      )}

      <ClassEditSidebar
        classItem={editingClass}
        isOpen={editingClass !== null}
        academyCareOptions={academyCareOptions}
        teacherOptions={teacherOptions}
        subjectOptions={subjectOptions}
        onClose={() => setEditingClass(null)}
        onSave={async (id, data) => {
          setIsSaving(true);
          try {
            await updateClass(id, data as ClassFormInput);
          } finally {
            setIsSaving(false);
          }
        }}
        isSaving={isSaving}
      />
    </div>
  );
}
