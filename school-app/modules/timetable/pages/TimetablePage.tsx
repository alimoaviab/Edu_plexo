"use client";

import { useTimetable } from "../hooks/useTimetable";
import { TimetableGrid } from "../components/TimetableGrid";
import { TimetableRecord, TimetableFormInput } from "../types/timetable.types";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { DataState, TableSkeleton, Badge } from "../../../components/ui";
import { useClasses } from "../../classes/hooks/useClasses";
import { useTeachers } from "../../teachers/hooks/useTeachers";
import { useSubjects } from "../../subjects/hooks/useSubjects";
import { TimetableForm } from "../components/TimetableForm";
import { useSearchParams, useRouter } from "next/navigation";

export function TimetablePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlClassId = searchParams.get("class_id") || "";
  const [classId, setClassId] = useState<string>(urlClassId);
  const [isAdding, setIsAdding] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TimetableRecord | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>(urlClassId);

  useEffect(() => {
    if (urlClassId) {
      setClassId(urlClassId);
      setSelectedClassId(urlClassId);
    }
  }, [urlClassId]);

  const { state, addTimetable, updateTimetable, deleteTimetable, refresh } = useTimetable(classId ? { class_id: classId } : undefined);
  const { state: classesState } = useClasses();
  const { state: teachersState } = useTeachers();
  const { data: subjectsData } = useSubjects();

  const classOptions = useMemo(() =>
    (classesState.data || []).map(c => ({ id: c._id, label: c.name })),
    [classesState.data]);

  const teacherOptions = useMemo(() =>
    (teachersState.data || []).map(t => ({ id: t._id, label: `${t.first_name} ${t.last_name || ""}`.trim() })),
    [teachersState.data]);

  const subjectOptions = useMemo(() =>
    (subjectsData || []).map(s => ({ id: s._id, label: s.name })),
    [subjectsData]);

  const selectedClass = classesState.data?.find(c => c._id === classId);
  const selectedClassForForm = classesState.data?.find(c => c._id === selectedClassId);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this timetable entry?")) {
      await deleteTimetable(id);
    }
  };

  const handleEdit = (record: TimetableRecord) => {
    setEditingRecord(record);
    setIsAdding(true);
  };

  const handleWatchClass = (classItemId: string) => {
    setClassId(classItemId);
    setSelectedClassId(classItemId);
    setEditingRecord(null);
    setIsAdding(true);
    router.push(`/admin/timetable?class_id=${classItemId}`);
  };

  const handleSave = async (data: TimetableFormInput) => {
    if (editingRecord) {
      await updateTimetable(editingRecord._id, data);
    } else {
      await addTimetable(data);
    }
    setIsAdding(false);
    setEditingRecord(null);
  };

  const handleBack = () => {
    router.push("/admin/classes");
  };

  return (
    <div className="space-y-6">
      {/* Premium Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm sticky top-0 z-30 backdrop-blur-md bg-white/90">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
             <span className="material-symbols-outlined text-[24px]">calendar_view_week</span>
          </div>
          <div className="min-w-[200px]">
             <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Active Schedule</p>
             <select
                value={classId}
                onChange={(e) => {
                  setClassId(e.target.value);
                  if (e.target.value) {
                    router.push(`/admin/timetable?class_id=${e.target.value}`);
                  } else {
                    router.push("/admin/timetable");
                  }
                }}
                className="w-full bg-transparent border-none p-0 text-lg font-black text-slate-900 focus:ring-0 cursor-pointer hover:text-blue-600 transition-colors"
              >
                <option value="">Select Class Section</option>
                {classOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="material-symbols-outlined text-slate-400 text-sm">info</span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                {selectedClass ? `${selectedClass.room_number || 'No Room'} • ${selectedClass.subjects.length} Subjects` : "Choose class to view timeline"}
              </span>
           </div>
           <button
              onClick={() => { setEditingRecord(null); setIsAdding(true); }}
              className="flex h-10 items-center gap-2 px-4 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
           >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              New Entry
           </button>
        </div>
      </div>

      {state.status === "loading" && <TableSkeleton />}
      {state.status === "error" && <DataState variant="error" title="Error" message={state.error} />}

      {state.status === "success" && (
        <TimetableGrid
          records={state.data || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editingRecord
                  ? "Edit Timetable Entry"
                  : selectedClassForForm
                    ? `Add Timetable Entry for ${selectedClassForForm.name}`
                    : "Add Timetable Entry"}
              </h3>
              <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6">
              <TimetableForm
                onCreate={handleSave}
                classOptions={classOptions}
                teacherOptions={teacherOptions}
                subjectOptions={subjectOptions}
                initialClassId={selectedClassId}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
