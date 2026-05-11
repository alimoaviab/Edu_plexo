"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button, Input } from "../../../components/ui";
import { AcademicYearFormInput } from "../types/academicYear.types";

const initialForm: AcademicYearFormInput = {
    year: "",
    start_date: "",
    end_date: "",
    is_active: false,
    description: ""
};

export function AcademicYearForm({ 
    onCreate,
    showFooter = true 
}: { 
    onCreate: (input: AcademicYearFormInput) => Promise<unknown>,
    showFooter?: boolean
}) {
    const [form, setForm] = useState<AcademicYearFormInput>(initialForm);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    function validate() {
        const newErrors: Record<string, string> = {};
        if (!form.year.trim()) newErrors.year = "Academic year name is required";
        if (!form.start_date) newErrors.start_date = "Start date is required";
        if (!form.end_date) newErrors.end_date = "End date is required";
        if (form.start_date && form.end_date && new Date(form.start_date) >= new Date(form.end_date)) {
            newErrors.end_date = "End date must be after start date";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const isValid = form.year.trim() && form.start_date && form.end_date;

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!validate()) return;
        setSaving(true);
        await onCreate(form);
        setForm(initialForm);
        setSaving(false);
        setErrors({});
    }

    return (
        <form id="academic-year-form-quick" onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
                {/* Row 1: General Configuration */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8">
                        <Input
                            label="Academic Session Name"
                            placeholder="e.g., 2025-2026 Academic Year"
                            value={form.year}
                            onChange={(e) => setForm({ ...form, year: e.target.value })}
                            error={errors.year}
                            required
                            leftIcon={<span className="material-symbols-outlined text-[16px]">badge</span>}
                            className="bg-white border-slate-200 h-9.5 focus:border-slate-900 focus:ring-slate-900/5 transition-all text-sm"
                        />
                    </div>

                    <div className="lg:col-span-4 h-full flex flex-col justify-end">
                        <div className="flex items-center justify-between p-3 rounded-[16px] border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all duration-300 h-[60px]">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-bold normal-case  text-slate-900 leading-tight">Current Active</span>
                                <span className="text-[9px] font-medium text-slate-500 leading-tight">Mark as system default</span>
                            </div>
                            <label className="relative inline-flex cursor-pointer items-center">
                                <input
                                    type="checkbox"
                                    checked={form.is_active}
                                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                    className="peer sr-only"
                                />
                                <div className="peer h-4.5 w-8 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-3.5 after:w-3.5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-slate-900 peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-slate-900/10" />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Row 2: Operational Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input
                        label="Session Start Date"
                        type="date"
                        value={form.start_date}
                        onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                        error={errors.start_date}
                        required
                        leftIcon={<span className="material-symbols-outlined text-[18px]">calendar_today</span>}
                        className="bg-white border-slate-200 h-9.5 focus:border-slate-900 focus:ring-slate-900/5 transition-all"
                    />

                    <Input
                        label="Session End Date"
                        type="date"
                        value={form.end_date}
                        onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                        error={errors.end_date}
                        required
                        leftIcon={<span className="material-symbols-outlined text-[18px]">event_busy</span>}
                        className="bg-white border-slate-200 h-9.5 focus:border-slate-900 focus:ring-slate-900/5 transition-all"
                    />
                </div>

                {/* Row 3: Narrative Context */}
                <div className="pt-1">
                    <Input
                        label="Administrative Notes (Optional)"
                        placeholder="Add details regarding academic holidays..."
                        value={form.description || ""}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        leftIcon={<span className="material-symbols-outlined text-[18px]">notes</span>}
                        className="bg-white border-slate-200 h-9.5 focus:border-slate-900 focus:ring-slate-900/5 transition-all"
                    />
                </div>
            </div>

            {/* Premium Action Row */}
            {showFooter && (
                <div className="-mx-6 -mb-6 mt-12 flex items-center justify-between border-t border-slate-100 bg-slate-50/40 px-8 py-4">
                    <Link
                        href="/admin/academic-years"
                        className="flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-bold normal-case  text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900"
                    >
                        Discard Changes
                    </Link>
                    <Button
                        type="submit"
                        disabled={saving || !isValid}
                        className="h-9.5 px-8 text-[10px] font-bold normal-case  shadow-xl shadow-slate-900/10 active:scale-[0.98] transition-all bg-slate-900 hover:bg-slate-800 text-white rounded-lg"
                    >
                        {saving ? "Deploying..." : "Publish Session"}
                    </Button>
                </div>
            )}
        </form>
    );
}
