"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SchoolShell } from "../../../../layouts/SchoolShell";
import Link from "next/link";
import { TimetableForm } from "../../../../modules/timetable/components/TimetableForm";
import { useClasses } from "../../../../modules/classes/hooks/useClasses";
import { useTeachers } from "../../../../modules/teachers/hooks/useTeachers";
import { useSubjects } from "../../../../modules/subjects/hooks/useSubjects";
import { useTimetable } from "../../../../modules/timetable/hooks/useTimetable";
import { TimetableFormInput, getDayLabel } from "../../../../modules/timetable/types/timetable.types";

export default function TimetableEntryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classIdParam = searchParams.get("class_id") || "";
  const editId = searchParams.get("edit_id");

  const { state: classesState } = useClasses();
  const { state: teachersState } = useTeachers();
  const { data: subjectsData } = useSubjects();
  
  // fetch the timetable state to get the specific record if editing
  const classIdToFetch = editId ? undefined : (classIdParam || undefined);
  // Wait, useTimetable fetches for a specific class. If editing, we might need all or just the class.
  // Assuming the user knows the class if editing, but actually edit_id could be anywhere.
  // Actually, we can fetch all or we can just fetch if we have a class_id.
  const { state: timetableState, addTimetable, updateTimetable } = useTimetable();

  const classOptions = useMemo(() =>
    (classesState.data || []).map((c) => ({ id: c._id, label: c.name })),
    [classesState.data]
  );

  const teacherOptions = useMemo(() =>
    (teachersState.data || []).map((t) => ({ id: t._id, label: `${t.first_name} ${t.last_name || ""}`.trim() })),
    [teachersState.data]
  );

  const subjectOptions = useMemo(() =>
    (subjectsData || []).map((s) => ({ id: s._id, label: s.name })),
    [subjectsData]
  );

  const [initialValues, setInitialValues] = useState<TimetableFormInput | undefined>(undefined);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (editId) {
      if (timetableState.data && timetableState.data.length > 0) {
        const recordToEdit = timetableState.data.find(r => r._id === editId);
        if (recordToEdit) {
          setInitialValues({
            class_id: recordToEdit.class_id,
            subject_id: recordToEdit.subject_id,
            teacher_id: recordToEdit.teacher_id,
            day_of_week: getDayLabel(recordToEdit.day_of_week) as any,
            period_number: recordToEdit.period_number,
            start_time: recordToEdit.start_time,
            end_time: recordToEdit.end_time,
            room: recordToEdit.room,
            section: recordToEdit.section
          });
        }
        setIsInitializing(false);
      } else if (timetableState.status !== "loading") {
        // If not found in data and not loading, maybe it's not fetched. 
        // We might need to fetch all or we can just end loading.
        setIsInitializing(false);
      }
    } else {
      setIsInitializing(false);
    }
  }, [editId, timetableState.data, timetableState.status]);

  const handleSave = async (data: TimetableFormInput) => {
    if (editId) {
      await updateTimetable(editId, data);
    } else {
      await addTimetable(data);
    }
    const returnClassId = data.class_id || classIdParam;
    if (returnClassId) {
      router.push(`/admin/timetable?class_id=${returnClassId}`);
    } else {
      router.push("/admin/timetable");
    }
  };

  return (
    <SchoolShell title={editId ? "Edit Schedule Entry" : "New Schedule Entry"} eyebrow="Academic Scheduling">
      <div className="mx-auto max-w-5xl space-y-6 pb-12">
        <div className="flex items-center gap-4">
          <Link href={`/admin/timetable${classIdParam ? `?class_id=${classIdParam}` : ''}`} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{editId ? "Modify Schedule" : "Create Schedule Entry"}</h1>
            <p className="text-sm text-slate-500 font-medium">Assign a teacher, subject, and time period to a class.</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          {isInitializing ? (
            <div className="flex items-center justify-center h-48">
              <span className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600/30 border-t-blue-600" />
            </div>
          ) : (
            <TimetableForm
              onCreate={handleSave}
              classOptions={classOptions}
              teacherOptions={teacherOptions}
              subjectOptions={subjectOptions}
              initialClassId={classIdParam}
              initialValues={initialValues}
            />
          )}
        </div>
      </div>
    </SchoolShell>
  );
}
