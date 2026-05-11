"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { SchoolShell } from "../../../../../layouts/SchoolShell";
import Link from "next/link";
import { useSubjects } from "../../../../../modules/subjects/hooks/useSubjects";
import { SubjectFormInput, SubjectRow } from "../../../../../modules/subjects/types";
import { DataState } from "../../../../../components/ui/DataState";

export default function EditSubjectPage() {
  const router = useRouter();
  const params = useParams();
  const subjectId = params.id as string;
  const { data: subjects, updateSubject, isLoading } = useSubjects();
  
  const [form, setForm] = useState<SubjectFormInput>({
    name: "",
    code: "",
    description: "",
    status: "active",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (subjects && subjects.length > 0) {
      const subject = subjects.find((s: any) => s._id === subjectId || s.id === subjectId);
      if (subject) {
        setForm({
          name: subject.name,
          code: subject.code || "",
          description: subject.description || "",
          status: subject.status || "active",
        });
      } else {
        setNotFound(true);
      }
    }
  }, [subjects, subjectId]);

  function validate() {
      const newErrors: Record<string, string> = {};
      if (!form.name.trim()) newErrors.name = "Name is required";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (!validate()) return;

      setIsSaving(true);
      try {
        await updateSubject(subjectId, form);
        router.push("/admin/subjects");
      } catch (err) {
        console.error(err);
        alert("Failed to update subject");
      } finally {
        setIsSaving(false);
      }
  }

  if (isLoading) {
    return <SchoolShell title="Loading Subject..." eyebrow="Curriculum Management">
        <div className="flex items-center justify-center h-[50vh]">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600/30 border-t-blue-600" />
        </div>
    </SchoolShell>;
  }

  if (notFound) {
    return <SchoolShell title="Subject Not Found" eyebrow="Curriculum Management">
        <div className="mx-auto max-w-3xl pt-12">
            <DataState variant="error" title="Subject Not Found" message="The subject you are trying to edit does not exist or has been deleted." />
            <div className="mt-8 flex justify-center">
                <Link href="/admin/subjects" className="h-10 px-6 flex items-center bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors">
                    Back to Subjects
                </Link>
            </div>
        </div>
    </SchoolShell>;
  }

  return (
    <SchoolShell title="Edit Subject" eyebrow="Curriculum Management">
      <div className="mx-auto max-w-3xl space-y-6 pb-12">
        <div className="flex items-center gap-4">
          <Link href="/admin/subjects" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Modify Subject</h1>
            <p className="text-sm text-slate-500 font-medium">Update details for this curriculum entry.</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <span className="h-1.5 w-6 rounded-full bg-blue-600" />
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                        Basic Information
                    </h3>
                </div>
                <div className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Subject Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g., Mathematics"
                            className={`h-14 w-full px-4 text-base font-bold border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all ${errors.name ? "border-red-500 bg-red-50/30" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400"
                                }`}
                        />
                        {errors.name && (
                            <p className="text-xs font-bold text-red-500 mt-2">{errors.name}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Subject Code
                        </label>
                        <input
                            type="text"
                            value={form.code}
                            onChange={(e) => setForm({ ...form, code: e.target.value })}
                            placeholder="e.g., MAT-01"
                            className="h-14 w-full px-4 text-base font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-400 bg-slate-50 focus:bg-white transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Description
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={5}
                            placeholder="Subject curriculum overview..."
                            className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-400 bg-slate-50 focus:bg-white transition-all"
                        />
                    </div>
                </div>
            </section>

            <section>
                <div className="flex items-center gap-2 mb-6">
                    <span className="h-1.5 w-6 rounded-full bg-blue-600" />
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                        Operational Status
                    </h3>
                </div>
                <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-slate-50">
                    <div>
                        <p className="text-sm font-bold text-slate-900">Available for enrollment</p>
                        <p className="text-xs text-slate-500 mt-1">Determines visibility in class mapping</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.status === "active"}
                            onChange={(e) => setForm({ ...form, status: e.target.checked ? "active" : "inactive" })}
                            className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-600/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 transition-all"></div>
                    </label>
                </div>
            </section>

            <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-slate-100">
                <Link
                    href="/admin/subjects"
                    className="h-12 px-8 flex items-center text-sm font-bold text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="h-12 px-8 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
                >
                    {isSaving ? (
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    )}
                    {isSaving ? "Saving..." : "Save Subject"}
                </button>
            </div>
          </form>
        </div>
      </div>
    </SchoolShell>
  );
}
