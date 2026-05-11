"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { SchoolShell } from "../../../../../layouts/SchoolShell";
import Link from "next/link";
import { useAcademicYears } from "../../../../../modules/academicYear/hooks/useAcademicYears";
import { AcademicYearUpdateInput } from "../../../../../modules/academicYear/types/academicYear.types";
import { DataState, Input } from "../../../../../components/ui";

export default function EditAcademicYearPage() {
  const router = useRouter();
  const params = useParams();
  const yearId = params.id as string;
  
  const { state: academicYearsState, updateAcademicYear } = useAcademicYears();

  const [form, setForm] = useState<Partial<AcademicYearUpdateInput>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (academicYearsState.data?.data && academicYearsState.data.data.length > 0) {
      const yearItem = academicYearsState.data.data.find((y: any) => y._id === yearId || y.id === yearId);
      if (yearItem) {
        setForm({
            year: yearItem.year ?? "",
            start_date: yearItem.start_date?.split("T")[0] ?? "",
            end_date: yearItem.end_date?.split("T")[0] ?? "",
            is_active: yearItem.is_active ?? false,
            description: yearItem.description ?? "",
        });
      } else {
        setNotFound(true);
      }
    }
  }, [academicYearsState.data, yearId]);

  const currentForm = {
      year: form.year ?? "",
      start_date: form.start_date ?? "",
      end_date: form.end_date ?? "",
      is_active: form.is_active ?? false,
      description: form.description ?? "",
  };

  function validate() {
      const newErrors: Record<string, string> = {};
      if (!currentForm.year.trim()) newErrors.year = "Year is required";
      if (!currentForm.start_date) newErrors.start_date = "Start date is required";
      if (!currentForm.end_date) newErrors.end_date = "End date is required";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (!validate()) return;

      setIsSaving(true);
      try {
        await updateAcademicYear(yearId, {
            year: currentForm.year,
            start_date: currentForm.start_date,
            end_date: currentForm.end_date,
            is_active: currentForm.is_active,
            description: currentForm.description,
        });
        router.push("/admin/academic-years");
      } catch (err) {
        console.error(err);
        alert("Failed to update academic year");
      } finally {
        setIsSaving(false);
      }
  }

  if (academicYearsState.status === "loading") {
    return <SchoolShell title="Loading Session..." eyebrow="Academic Timeline">
        <div className="flex items-center justify-center h-[50vh]">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600/30 border-t-blue-600" />
        </div>
    </SchoolShell>;
  }

  if (notFound) {
    return <SchoolShell title="Session Not Found" eyebrow="Academic Timeline">
        <div className="mx-auto max-w-3xl pt-12">
            <DataState variant="error" title="Session Not Found" message="The academic year you are trying to edit does not exist or has been removed." />
            <div className="mt-8 flex justify-center">
                <Link href="/admin/academic-years" className="h-10 px-6 flex items-center bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors">
                    Back to Timeline
                </Link>
            </div>
        </div>
    </SchoolShell>;
  }

  return (
    <SchoolShell title="Edit Academic Session" eyebrow="Academic Timeline">
      <div className="mx-auto max-w-3xl space-y-6 pb-12">
        <div className="flex items-center gap-4">
          <Link href="/admin/academic-years" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Configure Session</h1>
            <p className="text-sm text-slate-500 font-medium">Update duration and status settings.</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* 01. Session Identity */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-600 text-sm font-black">fingerprint</span>
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-slate-400">01. Session Identity</span>
                </div>

                <div className="space-y-6 pl-11">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Session Label <span className="text-red-500">*</span></label>
                        <Input
                            value={currentForm.year}
                            onChange={(e) => setForm({ ...form, year: e.target.value })}
                            placeholder="e.g. 2024-2025"
                            error={errors.year}
                            className="h-14 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 transition-all text-base font-bold rounded-xl"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Visibility Status</label>
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, is_active: !currentForm.is_active })}
                            className={`flex w-full items-center justify-between rounded-xl border p-4 transition-all duration-300 ${currentForm.is_active ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-white'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all ${currentForm.is_active ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                                    {currentForm.is_active && <span className="material-symbols-outlined text-[12px] font-black text-white">check</span>}
                                </div>
                                <div className="text-left">
                                    <p className="text-[12px] font-black uppercase tracking-tight">Active Stream</p>
                                    <p className="text-[10px] font-bold text-slate-400">Set as the primary school session</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </section>

            {/* 02. Operational Timeline */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <span className="material-symbols-outlined text-emerald-600 text-sm font-black">schedule</span>
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-slate-400">02. Operational Timeline</span>
                </div>
                <div className="grid grid-cols-2 gap-6 pl-11">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Commences <span className="text-red-500">*</span></label>
                        <Input
                            type="date"
                            value={currentForm.start_date}
                            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                            error={errors.start_date}
                            className="h-14 bg-slate-50 border-slate-200 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/5 transition-all text-base font-bold rounded-xl"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Concludes <span className="text-red-500">*</span></label>
                        <Input
                            type="date"
                            value={currentForm.end_date}
                            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                            error={errors.end_date}
                            className="h-14 bg-slate-50 border-slate-200 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/5 transition-all text-base font-bold rounded-xl"
                        />
                    </div>
                </div>
            </section>

            {/* 03. Contextual Notes */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center">
                        <span className="material-symbols-outlined text-purple-600 text-sm font-black">notes</span>
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-slate-400">03. Contextual Notes</span>
                </div>
                <div className="pl-11">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Internal Description</label>
                    <textarea
                        value={currentForm.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Operational notes..."
                        className="w-full h-32 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white p-4 text-sm font-bold text-slate-700 outline-none transition-all focus:border-purple-400 focus:ring-4 focus:ring-purple-500/5 placeholder:text-slate-400 resize-none leading-relaxed"
                    />
                </div>
            </section>

            <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-slate-100">
                <Link
                    href="/admin/academic-years"
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
