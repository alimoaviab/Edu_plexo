"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { SchoolShell } from "../../../../../layouts/SchoolShell";
import Link from "next/link";
import { useClasses } from "../../../../../modules/classes/hooks/useClasses";
import { useAcademyCare } from "../../../../../modules/academyCare/hooks/useAcademyCare";
import { useTeachers } from "../../../../../modules/teachers/hooks/useTeachers";
import { useSubjects } from "../../../../../modules/subjects/hooks/useSubjects";
import { ClassFormInput, ClassSubject, GradeThreshold } from "../../../../../modules/classes/types/class.types";
import { DataState } from "../../../../../components/ui/DataState";

export default function EditClassPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params.id as string;
  
  const { state: classesState, updateClass } = useClasses();
  const { state: academyCareState } = useAcademyCare();
  const { state: teachersState } = useTeachers();
  const { data: subjectsData } = useSubjects();

  const [form, setForm] = useState<Partial<ClassFormInput>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const academyCareOptions = (academyCareState.data || []).map((ac) => ({
    id: ac._id,
    label: (ac as any).name || ac.year,
  }));

  const teacherOptions = (teachersState.data || []).map((teacher) => ({
    id: teacher._id,
    label: `${teacher.first_name} ${teacher.last_name}`,
  }));

  const subjectOptions = (subjectsData || [])
    .filter((s: any) => s.status === "active")
    .map((s: any) => ({
      id: s._id,
      label: s.name,
    }));

  useEffect(() => {
    if (classesState.data && classesState.data.length > 0) {
      const classItem = classesState.data.find((c) => c._id === classId || (c as any).id === classId);
      if (classItem) {
        setForm({
          name: classItem.name ?? "",
          code: classItem.code ?? "",
          display_order: classItem.display_order ?? 1,
          passing_percentage: classItem.passing_percentage ?? 33,
          academy_care_id: classItem.academy_care_id ?? "",
          teacher_ids: classItem.teacher_ids ?? [],
          subjects: (Array.isArray(classItem.subjects) && typeof classItem.subjects[0] === "string" 
            ? (classItem.subjects as string[]).map(s => ({ name: s, total_marks: 100, passing_marks: 33 }))
            : (classItem.subjects as ClassSubject[]) ?? []) as ClassSubject[],
          grade_thresholds: (classItem.grade_thresholds ?? []) as GradeThreshold[],
          room_number: classItem.room_number ?? "",
          description: classItem.description ?? "",
        });
      } else {
        setNotFound(true);
      }
    }
  }, [classesState.data, classId]);

  const currentForm = {
    name: form.name ?? "",
    code: form.code ?? "",
    display_order: form.display_order ?? 1,
    passing_percentage: form.passing_percentage ?? 33,
    academy_care_id: form.academy_care_id ?? "",
    teacher_ids: form.teacher_ids ?? [],
    subjects: form.subjects ?? [],
    grade_thresholds: form.grade_thresholds ?? [],
    room_number: form.room_number ?? "",
    description: form.description ?? "",
  };

  function validate() {
      const newErrors: Record<string, string> = {};
      if (!currentForm.name.trim()) newErrors.name = "Class name is required";
      if (!currentForm.academy_care_id.trim()) newErrors.academy_care_id = "Session is required";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (!validate()) return;

      setIsSaving(true);
      try {
        await updateClass(classId, currentForm);
        router.push("/admin/classes");
      } catch (err) {
        console.error(err);
        alert("Failed to update class");
      } finally {
        setIsSaving(false);
      }
  }

  if (classesState.status === "loading") {
    return <SchoolShell title="Loading Class..." eyebrow="Class Management">
        <div className="flex items-center justify-center h-[50vh]">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600/30 border-t-indigo-600" />
        </div>
    </SchoolShell>;
  }

  if (notFound) {
    return <SchoolShell title="Class Not Found" eyebrow="Class Management">
        <div className="mx-auto max-w-3xl pt-12">
            <DataState variant="error" title="Class Not Found" message="The class you are trying to edit does not exist or has been deleted." />
            <div className="mt-8 flex justify-center">
                <Link href="/admin/classes" className="h-10 px-6 flex items-center bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition-colors">
                    Back to Classes
                </Link>
            </div>
        </div>
    </SchoolShell>;
  }

  return (
    <SchoolShell title="Edit Class" eyebrow="Class Management">
      <div className="mx-auto max-w-4xl space-y-6 pb-12">
        <div className="flex items-center gap-4">
          <Link href="/admin/classes" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Class Configuration</h1>
            <p className="text-sm text-slate-500 font-medium">Update settings for this academic node.</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Basic Info */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-indigo-600 text-sm font-black">badge</span>
                </div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                    Identity Profile
                </h3>
              </div>
              <div className="space-y-6 pl-11">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={currentForm.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Class 10-A"
                    className={`h-14 w-full px-4 text-base font-bold border rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all ${errors.name ? "border-red-500 bg-red-50/30" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400"}`}
                  />
                  {errors.name && <p className="text-xs font-bold text-red-500 mt-2">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Room Allocation</label>
                    <input
                      type="text"
                      value={currentForm.room_number}
                      onChange={(e) => setForm({ ...form, room_number: e.target.value })}
                      placeholder="Room #"
                      className="h-14 w-full px-4 text-base font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 bg-slate-50 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Session Cycle <span className="text-red-500">*</span></label>
                    <select
                      value={currentForm.academy_care_id}
                      onChange={(e) => setForm({ ...form, academy_care_id: e.target.value })}
                      className={`h-14 w-full px-4 text-base font-bold border rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all ${errors.academy_care_id ? "border-red-500 bg-red-50/30" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400"}`}
                    >
                      <option value="">Select Cycle</option>
                      {academyCareOptions.map((opt) => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Strategic Description</label>
                  <textarea
                    value={currentForm.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={4}
                    placeholder="Specify the group purpose and operational focus..."
                    className="w-full px-4 py-3 text-sm font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 bg-slate-50 focus:bg-white transition-all resize-none leading-relaxed"
                  />
                </div>
              </div>
            </section>

            {/* Faculty Assignment */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-600 text-sm font-black">school</span>
                </div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                    Faculty Assignment (Optional)
                </h3>
              </div>
              <div className="pl-11">
                <select
                  multiple
                  value={currentForm.teacher_ids}
                  onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      setForm({ ...form, teacher_ids: values });
                  }}
                  className="w-full min-h-[160px] rounded-xl border border-slate-200 bg-slate-50 focus:bg-white p-3 text-sm font-bold text-slate-800 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
                >
                  {teacherOptions.map(t => (
                      <option key={t.id} value={t.id} className="p-3 rounded-lg mb-1 checked:bg-indigo-600 checked:text-white">
                          {t.label}
                      </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-3 font-medium">Hold Ctrl/Cmd to select multiple faculty members</p>
              </div>
            </section>

            {/* Subjects Selection */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-purple-600 text-sm font-black">schema</span>
                </div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                    Academic Spectrum
                </h3>
              </div>
              <div className="pl-11">
                <select
                  multiple
                  value={currentForm.subjects.map(s => s.name)}
                  onChange={(e) => {
                      const selectedNames = Array.from(e.target.selectedOptions, option => option.value);
                      const updatedSubjects = selectedNames.map(name => {
                          const existing = currentForm.subjects.find(s => s.name === name);
                          return existing || { name, total_marks: 100, passing_marks: 33 };
                      });
                      setForm({ ...form, subjects: updatedSubjects });
                  }}
                  className="w-full min-h-[160px] rounded-xl border border-slate-200 bg-slate-50 focus:bg-white p-3 text-sm font-bold text-slate-800 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
                >
                  {subjectOptions.map(s => (
                      <option key={s.id} value={s.label} className="p-3 rounded-lg mb-1 checked:bg-purple-600 checked:text-white">
                          {s.label}
                      </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-3 font-medium">Hold Ctrl/Cmd to select multiple subjects</p>
              </div>
            </section>

            <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-slate-100">
                <Link
                    href="/admin/classes"
                    className="h-12 px-8 flex items-center text-sm font-bold text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"
                >
                    Discard
                </Link>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="h-12 px-8 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-lg shadow-slate-900/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
                >
                    {isSaving ? (
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                        <span className="material-symbols-outlined text-[20px]">task_alt</span>
                    )}
                    {isSaving ? "Syncing..." : "Commit Changes"}
                </button>
            </div>
          </form>
        </div>
      </div>
    </SchoolShell>
  );
}
