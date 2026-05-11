"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { SchoolShell } from "../../../../../layouts/SchoolShell";
import Link from "next/link";
import { useTeachers } from "../../../../../modules/teachers/hooks/useTeachers";
import { useClasses } from "../../../../../modules/classes/hooks/useClasses";
import { useSubjects } from "../../../../../modules/subjects/hooks/useSubjects";
import { TeacherFormInput } from "../../../../../modules/teachers/types/teacher.types";
import { DataState } from "../../../../../components/ui/DataState";

export default function EditTeacherPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = params.id as string;
  
  const { data: teachers, updateTeacher, isLoading: isLoadingTeachers } = useTeachers();
  const { state: classesState } = useClasses();
  const { data: subjectsData } = useSubjects();

  const [form, setForm] = useState<Partial<TeacherFormInput>>({});
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
    if (teachers && teachers.length > 0) {
      const teacher = teachers.find((t: any) => t._id === teacherId || t.id === teacherId);
      if (teacher) {
        setForm({
          first_name: teacher.first_name ?? "",
          last_name: teacher.last_name ?? "",
          email: teacher.email ?? "",
          phone: teacher.phone ?? "",
          qualification: teacher.qualification ?? "",
          subjects: teacher.subjects ?? [],
          class_ids: teacher.class_ids ?? [],
          password: "", // intentionally left blank for security
        });
      } else {
        setNotFound(true);
      }
    }
  }, [teachers, teacherId]);

  const currentForm = {
    first_name: form.first_name ?? "",
    last_name: form.last_name ?? "",
    email: form.email ?? "",
    phone: form.phone ?? "",
    qualification: form.qualification ?? "",
    subjects: form.subjects ?? [],
    class_ids: form.class_ids ?? [],
    password: form.password ?? "",
  };

  function validate() {
      const newErrors: Record<string, string> = {};
      if (!currentForm.first_name.trim()) newErrors.first_name = "First name is required";
      if (!currentForm.email.trim()) newErrors.email = "Email is required";
      if (!currentForm.phone.trim()) newErrors.phone = "Phone is required";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (!validate()) return;

      setIsSaving(true);
      try {
        await updateTeacher(teacherId, {
            ...currentForm,
            password: currentForm.password || undefined,
        });
        router.push("/admin/teachers");
      } catch (err) {
        console.error(err);
        alert("Failed to update teacher");
      } finally {
        setIsSaving(false);
      }
  }

  if (isLoadingTeachers || classesState.status === "loading") {
    return <SchoolShell title="Loading Teacher..." eyebrow="Faculty Management">
        <div className="flex items-center justify-center h-[50vh]">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600/30 border-t-emerald-600" />
        </div>
    </SchoolShell>;
  }

  if (notFound) {
    return <SchoolShell title="Teacher Not Found" eyebrow="Faculty Management">
        <div className="mx-auto max-w-3xl pt-12">
            <DataState variant="error" title="Faculty Not Found" message="The teacher you are trying to edit does not exist or has been removed." />
            <div className="mt-8 flex justify-center">
                <Link href="/admin/teachers" className="h-10 px-6 flex items-center bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 transition-colors">
                    Back to Faculty
                </Link>
            </div>
        </div>
    </SchoolShell>;
  }

  return (
    <SchoolShell title="Edit Faculty Profile" eyebrow="Faculty Management">
      <div className="mx-auto max-w-4xl space-y-6 pb-12">
        <div className="flex items-center gap-4">
          <Link href="/admin/teachers" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Modify Teacher Profile</h1>
            <p className="text-sm text-slate-500 font-medium">Update academic assignments and contact records.</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Personal Details */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-600 text-sm font-black">person</span>
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
                      className={`h-14 w-full px-4 text-base font-bold border rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all ${errors.first_name ? "border-red-500 bg-red-50/30" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-400"}`}
                    />
                    {errors.first_name && <p className="text-xs font-bold text-red-500 mt-2">{errors.first_name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Last Name</label>
                    <input
                      type="text"
                      value={currentForm.last_name}
                      onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                      className={`h-14 w-full px-4 text-base font-bold border rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all ${errors.last_name ? "border-red-500 bg-red-50/30" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-400"}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Qualification</label>
                  <input
                    type="text"
                    value={currentForm.qualification}
                    onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                    className="h-14 w-full px-4 text-base font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-400 bg-slate-50 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-indigo-600 text-sm font-black">contact_mail</span>
                </div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                    Contact Information
                </h3>
              </div>
              <div className="space-y-6 pl-11">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      value={currentForm.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={`h-14 w-full px-4 text-base font-bold border rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all ${errors.email ? "border-red-500 bg-red-50/30" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400"}`}
                    />
                    {errors.email && <p className="text-xs font-bold text-red-500 mt-2">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Phone Number <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      value={currentForm.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={`h-14 w-full px-4 text-base font-bold border rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all ${errors.phone ? "border-red-500 bg-red-50/30" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400"}`}
                    />
                    {errors.phone && <p className="text-xs font-bold text-red-500 mt-2">{errors.phone}</p>}
                  </div>
                </div>
              </div>
            </section>

            {/* Academic Assignment */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-amber-600 text-sm font-black">assignment</span>
                </div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                    Academic Assignment
                </h3>
              </div>
              <div className="pl-11 grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Assigned Subjects</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto p-4 border border-slate-200 rounded-xl bg-slate-50">
                      {subjectOptions.map(option => (
                          <label key={option.id} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-100 shadow-sm cursor-pointer hover:border-amber-300 transition-all">
                              <input
                                  type="checkbox"
                                  checked={currentForm.subjects.includes(option.id)}
                                  onChange={(e) => {
                                      const newSubjects = e.target.checked
                                          ? [...currentForm.subjects, option.id]
                                          : currentForm.subjects.filter(id => id !== option.id);
                                      setForm({ ...form, subjects: newSubjects });
                                  }}
                                  className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                              />
                              <span className="text-xs font-bold text-slate-700">{option.label}</span>
                          </label>
                      ))}
                      {subjectOptions.length === 0 && (
                          <p className="text-sm text-slate-500 italic col-span-full">No subjects available</p>
                      )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Assigned Classes</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto p-4 border border-slate-200 rounded-xl bg-slate-50">
                      {classOptions.map(cls => (
                          <label key={cls.id} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-100 shadow-sm cursor-pointer hover:border-amber-300 transition-all">
                              <input
                                  type="checkbox"
                                  checked={currentForm.class_ids.includes(cls.id)}
                                  onChange={(e) => {
                                      const newClassIds = e.target.checked
                                          ? [...currentForm.class_ids, cls.id]
                                          : currentForm.class_ids.filter(id => id !== cls.id);
                                      setForm({ ...form, class_ids: newClassIds });
                                  }}
                                  className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                              />
                              <span className="text-xs font-bold text-slate-700">{cls.label}</span>
                          </label>
                      ))}
                      {classOptions.length === 0 && (
                          <p className="text-sm text-slate-500 italic col-span-full">No classes available</p>
                      )}
                  </div>
                </div>
              </div>
            </section>

            {/* Security */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-600 text-sm font-black">lock</span>
                </div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                    Security Credentials
                </h3>
              </div>
              <div className="pl-11">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Reset Password</label>
                  <input
                    type="password"
                    value={currentForm.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Leave blank to keep current password"
                    className="h-14 w-full px-4 text-base font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-400 bg-slate-50 focus:bg-white transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-2 font-medium">Entering a new password here will immediately overwrite their existing credentials.</p>
                </div>
              </div>
            </section>

            <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-slate-100">
                <Link
                    href="/admin/teachers"
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
