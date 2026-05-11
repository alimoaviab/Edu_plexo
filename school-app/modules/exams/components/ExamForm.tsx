"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button, Input, Select } from "../../../components/ui";
import { ServiceResult } from "@edu/shared/types/core";
import { serviceRequest } from "../../../services/service-client";
import { ExamFormInput } from "../types/exam.types";

export function ExamForm({
  classes,
  onCreate
}: {
  classes: any[];
  onCreate: (input: ExamFormInput) => Promise<ServiceResult<unknown>>;
}) {
    const [form, setForm] = useState<ExamFormInput>({
        academy_care_id: typeof window !== "undefined" ? window.localStorage.getItem("academy_care_id") || "" : "",
        class_id: "",
        subject: "",
        teacher_id: "",
        title: "",
        starts_at: "",
        max_marks: 100,
        status: "scheduled",
        description: ""
    });
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [classSubjectOptions, setClassSubjectOptions] = useState<Array<{ label: string; value: string }>>([]);
    const [loadingSubjects, setLoadingSubjects] = useState(false);

    const selectedClass = classes.find(c => c.id === form.class_id || c._id === form.class_id);
    const classTeacher = selectedClass?.class_teacher;

    useEffect(() => {
        let cancelled = false;

        async function loadClassSubjects(classId: string) {
            if (!classId) {
                setClassSubjectOptions([]);
                return;
            }

            setLoadingSubjects(true);
            try {
                const result = await serviceRequest<{ subjects?: any[] }>(`/api/classes/${classId}/subjects`);
                if (!result.ok) {
                    throw new Error(result.error.message || "Failed to load class subjects");
                }

                const subjects = (result.data?.subjects ?? [])
                    .map((subject: any) => ({
                        label: subject.name || String(subject._id),
                        value: subject.name || String(subject._id)
                    }))
                    .filter((option: { label: string; value: string }) => Boolean(option.value));

                if (!cancelled) {
                    setClassSubjectOptions(subjects);
                }
            } catch {
                if (!cancelled) {
                    setClassSubjectOptions([]);
                }
            } finally {
                if (!cancelled) {
                    setLoadingSubjects(false);
                }
            }
        }

        void loadClassSubjects(form.class_id);

        return () => {
            cancelled = true;
        };
    }, [form.class_id]);

    const availableSubjects = classSubjectOptions.length > 0
        ? classSubjectOptions
        : (selectedClass?.subjects || []).map((s: any) => {
            if (typeof s === "string") {
                return { label: s, value: s };
            }

            const value = s.name || s.subject || s.id || s._id;
            return {
                label: s.name || String(value),
                value: String(value)
            };
        }).filter((option: any) => Boolean(option?.value));

    function validate() {
        const newErrors: Record<string, string> = {};
        if (!form.title.trim()) newErrors.title = "Exam title is required";
        if (!form.class_id.trim()) newErrors.class_id = "Class is required";
        if (!form.subject.trim()) newErrors.subject = "Subject is required";
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
                    class_id: "",
                    subject: "",
                    teacher_id: "",
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
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section: Academic Context */}
            <section className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                        label="Target Class"
                        value={form.class_id}
                        onChange={(e) => {
                            const classId = e.target.value;
                            const cls = classes.find(c => c.id === classId || c._id === classId);
                            setForm({ 
                                ...form, 
                                class_id: classId, 
                                subject: "", // Reset subject on class change
                                teacher_id: cls?.class_teacher?.id || "" // Auto-assign class teacher
                            });
                        }}
                        options={[
                            { label: "Select target class", value: "" },
                            ...classes.map(o => ({ label: o.name, value: o.id || o._id }))
                        ]}
                        error={errors.class_id}
                        required
                    />

                    <Select
                        label="Class Subject"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        options={[
                            { label: loadingSubjects ? "Loading subjects..." : "Select subject", value: "" },
                            ...availableSubjects
                        ]}
                        disabled={!form.class_id || loadingSubjects}
                        error={errors.subject}
                        required
                    />
                </div>


            </section>

            {/* Section: Basic Details */}
            <section className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Examination Title"
                        placeholder="e.g., Mid-Term Mathematics Assessment"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        error={errors.title}
                        className="font-bold text-slate-800"
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
            <section className="space-y-4">

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
                    <label className="text-[11px] font-bold text-slate-700 normal-case ">Exam Description & Instructions</label>
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
