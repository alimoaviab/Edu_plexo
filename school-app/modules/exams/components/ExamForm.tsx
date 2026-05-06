"use client";

import { FormEvent, useState } from "react";
import { Button, Input, Select } from "../../../components/ui";
import { ServiceResult } from "@edu/shared/types/core";
import { ExamFormInput, ExamOption } from "../types/exam.types";

export function ExamForm({
  classOptions,
  onCreate
}: {
  classOptions: ExamOption[];
  onCreate: (input: ExamFormInput) => Promise<ServiceResult<unknown>>;
}) {
    const [form, setForm] = useState<ExamFormInput>({
        academy_care_id: typeof window !== "undefined" ? window.localStorage.getItem("academy_care_id") || "" : "",
        class_id: classOptions[0]?.id ?? "",
        subject: "",
        title: "",
        starts_at: "",
        max_marks: 100,
        status: "scheduled",
        description: ""
    });
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    function validate() {
        const newErrors: Record<string, string> = {};
        if (!form.title.trim()) newErrors.title = "Exam title is required";
        if (!form.subject.trim()) newErrors.subject = "Subject is required";
        if (!form.class_id.trim()) newErrors.class_id = "Class is required";
        if (!form.starts_at) newErrors.starts_at = "Date is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!validate()) return;
        setSaving(true);
        try {
            const result = await onCreate(form);
            if (result.ok) {
                setForm({
                    academy_care_id: typeof window !== "undefined" ? window.localStorage.getItem("academy_care_id") || "" : "",
                    class_id: classOptions[0]?.id ?? "",
                    subject: "",
                    title: "",
                    starts_at: "",
                    max_marks: 100,
                    status: "scheduled",
                    description: ""
                });
            }
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-10">
            {/* Section: Basic Details */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <span className="material-symbols-outlined text-[24px]">description</span>
                    </div>
                    <div>
                        <h3 className="text-[15px] font-bold text-slate-900">Exam Details</h3>
                        <p className="text-[11px] font-medium text-slate-400">Define the assessment title and academic subject</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Examination Title"
                        placeholder="e.g., Q1 Periodical Assessment"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        error={errors.title}
                        className="font-bold text-slate-800"
                        required
                    />

                    <Select
                        label="Academic Subject"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        options={[
                            { label: "Select subject", value: "" },
                            { label: "Mathematics", value: "Mathematics" },
                            { label: "English", value: "English" },
                            { label: "Science", value: "Science" },
                            { label: "History", value: "History" },
                            { label: "Geography", value: "Geography" },
                            { label: "Physics", value: "Physics" },
                            { label: "Chemistry", value: "Chemistry" }
                        ]}
                        error={errors.subject}
                        required
                    />
                </div>
            </section>

            {/* Section: Logistics */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                        <span className="material-symbols-outlined text-[24px]">event_note</span>
                    </div>
                    <div>
                        <h3 className="text-[15px] font-bold text-slate-900">Logistics & Schedule</h3>
                        <p className="text-[11px] font-medium text-slate-400">Set the target class and examination date</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                        label="Target Class"
                        value={form.class_id}
                        onChange={(e) => setForm({ ...form, class_id: e.target.value })}
                        options={[
                            { label: "Select target class", value: "" },
                            ...classOptions.map(o => ({ label: o.label, value: o.id }))
                        ]}
                        error={errors.class_id}
                        required
                    />

                    <Input
                        label="Examination Date"
                        type="date"
                        value={form.starts_at}
                        onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
                        error={errors.starts_at}
                        required
                    />
                </div>
            </section>

            {/* Section: Assessment Parameters */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <span className="material-symbols-outlined text-[24px]">analytics</span>
                    </div>
                    <div>
                        <h3 className="text-[15px] font-bold text-slate-900">Assessment Parameters</h3>
                        <p className="text-[11px] font-medium text-slate-400">Set grading scales and operational status</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Maximum Possible Marks"
                        type="number"
                        min="1"
                        value={form.max_marks}
                        onChange={(e) => setForm({ ...form, max_marks: parseInt(e.target.value) || 100 })}
                        className="font-bold"
                    />

                    <Select
                        label="Current Status"
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value as ExamFormInput["status"] })}
                        options={[
                            { label: "Scheduled", value: "scheduled" },
                            { label: "Completed", value: "completed" },
                            { label: "Cancelled", value: "cancelled" }
                        ]}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Exam Description & Instructions</label>
                    <textarea
                        placeholder="Add syllabus coverage or student instructions..."
                        value={form.description || ""}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        rows={3}
                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-600/5 transition-all"
                    />
                </div>
            </section>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 sticky bottom-0 bg-white/80 backdrop-blur-md py-4 z-10">
                <Button
                    type="submit"
                    disabled={saving}
                    className="min-w-[200px] h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all font-bold"
                >
                    {saving ? (
                         <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Scheduling...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">check_circle</span>
                            Commit Exam Schedule
                        </span>
                    )}
                </Button>
            </div>
        </form>
    );
}
