"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { SchoolShell } from "../../../../../layouts/SchoolShell";
import Link from "next/link";
import { useStudents } from "../../../../../modules/students/hooks/useStudents";
import { useClasses } from "../../../../../modules/classes/hooks/useClasses";
import { useSubjects } from "../../../../../modules/subjects/hooks/useSubjects";
import { StudentFormInput } from "../../../../../modules/students/types/student.types";
import { DataState } from "../../../../../components/ui/DataState";

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;
  
  const { data: students, updateStudent, isLoading: isLoadingStudents } = useStudents();
  const { state: classesState } = useClasses();
  const { data: subjectsData } = useSubjects();

  const [form, setForm] = useState<Partial<StudentFormInput>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const classOptions = (classesState.data || []).map((c) => ({
    id: c._id,
    label: c.name,
  }));

  const subjectOptions = (subjectsData || [])
    .filter(s => s.status === "active")
    .map((s) => ({
      id: s._id,
      label: s.name,
    }));

  useEffect(() => {
    if (students && students.length > 0) {
      const student = students.find((s: any) => s._id === studentId || s.id === studentId);
      if (student) {
        setForm({
          first_name: student.first_name ?? "",
          last_name: student.last_name ?? "",
          class_id: student.class_id ?? "",
          subjects: student.subjects ?? [],
          section: student.section ?? "",
          admission_no: student.admission_no ?? "",
          guardian: {
            name: student.guardian?.name ?? "",
            phone: student.guardian?.phone ?? "",
            email: student.guardian?.email ?? "",
          },
        });
      } else {
        setNotFound(true);
      }
    }
  }, [students, studentId]);

  const currentForm = {
    first_name: form.first_name ?? "",
    last_name: form.last_name ?? "",
    class_id: form.class_id ?? "",
    subjects: form.subjects ?? [],
    section: form.section ?? "",
    admission_no: form.admission_no ?? "",
    guardian: {
        name: form.guardian?.name ?? "",
        phone: form.guardian?.phone ?? "",
        email: form.guardian?.email ?? "",
    },
  };

  function validate() {
      const newErrors: Record<string, string> = {};
      if (!currentForm.first_name.trim()) newErrors.first_name = "First name is required";
      if (!currentForm.last_name.trim()) newErrors.last_name = "Last name is required";
      if (!currentForm.class_id.trim()) newErrors.class_id = "Class is required";
      if (!currentForm.section.trim()) newErrors.section = "Section is required";
      if (!currentForm.guardian.name.trim()) newErrors.guardian_name = "Guardian name is required";
      if (!currentForm.guardian.phone.trim()) newErrors.guardian_phone = "Guardian phone is required";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (!validate()) return;

      setIsSaving(true);
      try {
        await updateStudent(studentId, currentForm);
        router.push("/admin/students");
      } catch (err) {
        console.error(err);
        alert("Failed to update student");
      } finally {
        setIsSaving(false);
      }
  }

  if (isLoadingStudents || classesState.status === "loading") {
    return <SchoolShell title="Loading Student..." eyebrow="Student Management">
        <div className="flex items-center justify-center h-[50vh]">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600/30 border-t-blue-600" />
        </div>
    </SchoolShell>;
  }

  if (notFound) {
    return <SchoolShell title="Student Not Found" eyebrow="Student Management">
        <div className="mx-auto max-w-3xl pt-12">
            <DataState variant="error" title="Student Not Found" message="The student you are trying to edit does not exist or has been deleted." />
            <div className="mt-8 flex justify-center">
                <Link href="/admin/students" className="h-10 px-6 flex items-center bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors">
                    Back to Students
                </Link>
            </div>
        </div>
    </SchoolShell>;
  }

  return (
    <SchoolShell title="Edit Student" eyebrow="Student Management">
      <div className="mx-auto max-w-4xl space-y-6 pb-12">
        <div className="flex items-center gap-4">
          <Link href="/admin/students" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Modify Student Details</h1>
            <p className="text-sm text-slate-500 font-medium">Update academic and personal records.</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Personal Details */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600 text-sm font-black">person</span>
                </div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                    Personal Details
                </h3>
              </div>
              <div className="space-y-6 pl-11">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">First Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={currentForm.first_name}
                      onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                      className={`h-14 w-full px-4 text-base font-bold border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all ${errors.first_name ? "border-red-500 bg-red-50/30" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400"}`}
                    />
                    {errors.first_name && <p className="text-xs font-bold text-red-500 mt-2">{errors.first_name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Last Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={currentForm.last_name}
                      onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                      className={`h-14 w-full px-4 text-base font-bold border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all ${errors.last_name ? "border-red-500 bg-red-50/30" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400"}`}
                    />
                    {errors.last_name && <p className="text-xs font-bold text-red-500 mt-2">{errors.last_name}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Admission Number</label>
                  <input
                    type="text"
                    value={currentForm.admission_no}
                    onChange={(e) => setForm({ ...form, admission_no: e.target.value })}
                    className="h-14 w-full px-4 text-base font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 bg-slate-50 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Academic Placement */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-600 text-sm font-black">school</span>
                </div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                    Academic Placement
                </h3>
              </div>
              <div className="space-y-6 pl-11">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Class <span className="text-red-500">*</span></label>
                    <select
                      value={currentForm.class_id}
                      onChange={(e) => setForm({ ...form, class_id: e.target.value })}
                      className={`h-14 w-full px-4 text-base font-bold border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all ${errors.class_id ? "border-red-500 bg-red-50/30" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400"}`}
                    >
                      <option value="">Select class</option>
                      {classOptions.map((opt) => (
                          <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))}
                    </select>
                    {errors.class_id && <p className="text-xs font-bold text-red-500 mt-2">{errors.class_id}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Section <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={currentForm.section}
                      onChange={(e) => setForm({ ...form, section: e.target.value })}
                      placeholder="e.g., A"
                      className={`h-14 w-full px-4 text-base font-bold border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all ${errors.section ? "border-red-500 bg-red-50/30" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400"}`}
                    />
                    {errors.section && <p className="text-xs font-bold text-red-500 mt-2">{errors.section}</p>}
                  </div>
                </div>
              </div>
            </section>

            {/* Guardian Details */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-purple-600 text-sm font-black">family_restroom</span>
                </div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                    Guardian Details
                </h3>
              </div>
              <div className="space-y-6 pl-11">
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Guardian Name <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        value={currentForm.guardian.name}
                        onChange={(e) => setForm({ ...form, guardian: { ...currentForm.guardian, name: e.target.value } })}
                        className={`h-14 w-full px-4 text-base font-bold border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all ${errors.guardian_name ? "border-red-500 bg-red-50/30" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400"}`}
                    />
                    {errors.guardian_name && <p className="text-xs font-bold text-red-500 mt-2">{errors.guardian_name}</p>}
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Phone Number <span className="text-red-500">*</span></label>
                        <input
                            type="tel"
                            value={currentForm.guardian.phone}
                            onChange={(e) => setForm({ ...form, guardian: { ...currentForm.guardian, phone: e.target.value } })}
                            className={`h-14 w-full px-4 text-base font-bold border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all ${errors.guardian_phone ? "border-red-500 bg-red-50/30" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400"}`}
                        />
                        {errors.guardian_phone && <p className="text-xs font-bold text-red-500 mt-2">{errors.guardian_phone}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
                        <input
                            type="email"
                            value={currentForm.guardian.email || ""}
                            onChange={(e) => setForm({ ...form, guardian: { ...currentForm.guardian, email: e.target.value } })}
                            className="h-14 w-full px-4 text-base font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 bg-slate-50 focus:bg-white transition-all"
                        />
                    </div>
                </div>
              </div>
            </section>

            {/* Enrolled Subjects */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-amber-600 text-sm font-black">library_books</span>
                </div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                    Enrolled Subjects
                </h3>
              </div>
              <div className="pl-11">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-slate-200 rounded-xl bg-slate-50 max-h-64 overflow-y-auto">
                    {subjectOptions.map(option => (
                        <label key={option.id} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-100 shadow-sm cursor-pointer hover:border-blue-300 transition-all">
                            <input
                                type="checkbox"
                                checked={form.subjects?.includes(option.id) || currentForm.subjects?.includes(option.id)}
                                onChange={(e) => {
                                    const current = form.subjects ?? currentForm.subjects ?? [];
                                    const newSubjects = e.target.checked
                                        ? [...current, option.id]
                                        : current.filter(id => id !== option.id);
                                    setForm({ ...form, subjects: newSubjects });
                                }}
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-xs font-bold text-slate-700">{option.label}</span>
                        </label>
                    ))}
                    {subjectOptions.length === 0 && (
                        <p className="text-sm text-slate-500 italic col-span-full">No subjects available</p>
                    )}
                </div>
              </div>
            </section>

            <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-slate-100">
                <Link
                    href="/admin/students"
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
