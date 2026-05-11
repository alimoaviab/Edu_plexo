"use client";

import { useTimetable } from "../hooks/useTimetable";
import { TimetableGrid } from "../components/TimetableGrid";
import { TimetableRecord, TimetableFormInput, getDayLabel } from "../types/timetable.types";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { DataState, TableSkeleton, Badge } from "../../../components/ui";
import { useClasses } from "../../classes/hooks/useClasses";
import { useTeachers } from "../../teachers/hooks/useTeachers";
import { useSubjects } from "../../subjects/hooks/useSubjects";
import { TimetableForm } from "../components/TimetableForm";
import { useSearchParams, useRouter } from "next/navigation";

import { TimetableToolbar } from "../components/TimetableToolbar";
import { findTimetableConflicts } from "../utils/conflicts";
import { useEscapeKey } from "../../../hooks/useEscapeKey";

export function TimetablePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlClassId = searchParams.get("class_id") || "";
  const [classId, setClassId] = useState<string>(urlClassId);
  const [isCompact, setIsCompact] = useState(false);
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

  const conflictsCount = useMemo(() => {
    if (!state.data) return 0;
    let count = 0;
    state.data.forEach(record => {
      if (findTimetableConflicts(state.data!, record).length > 0) {
        count++;
      }
    });
    return count;
  }, [state.data]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this timetable entry?")) {
      await deleteTimetable(id);
    }
  };

  const handleEdit = (record: TimetableRecord) => {
    router.push(`/admin/timetable/entry?edit_id=${record._id}${classId ? `&class_id=${classId}` : ''}`);
  };

  const handleClassChange = (newId: string) => {
    setClassId(newId);
    setSelectedClassId(newId);
    if (newId) {
      router.push(`/admin/timetable?class_id=${newId}`);
    } else {
      router.push("/admin/timetable");
    }
  };



  return (
    <div className="space-y-8 pb-10">
      <TimetableToolbar 
        classId={classId}
        onClassChange={handleClassChange}
        classOptions={classOptions}
        onNewEntry={() => router.push(`/admin/timetable/entry${classId ? `?class_id=${classId}` : ''}`)}
        selectedClass={selectedClass}
        conflictsCount={conflictsCount}
        isCompact={isCompact}
        onCompactToggle={() => setIsCompact(!isCompact)}
      />

      {state.status === "loading" && <TableSkeleton />}
      {state.status === "error" && <DataState variant="error" title="Error" message={state.error} />}

      {state.status === "success" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <TimetableGrid
            records={state.data || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isCompact={isCompact}
          />
        </div>
      )}

    </div>
  );
}
