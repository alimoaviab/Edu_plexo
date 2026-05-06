"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button, Input, Select } from "../../../components/ui";
import { ClassFormInput } from "../types/class.types";

const initialForm: ClassFormInput = {
    name: "",
    academy_care_id: "",
    teacher_ids: [],
    subjects: [""],
    room_number: "",
    description: ""
};

export function ClassForm({
    onCreate,
    academyCareOptions,
    teacherOptions,
    subjectOptions
}: {
    onCreate: (input: ClassFormInput) => Promise<unknown>;
    academyCareOptions: Array<{ id: string; label: string }>;
    teacherOptions: Array<{ id: string; label: string }>;
    subjectOptions: Array<{ id: string; label: string }>;
}) {
    const [form, setForm] = useState<ClassFormInput>({ ...initialForm, subjects: [] });
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    function validate() {
        const newErrors: Record<string, string> = {};
        if (!form.name.trim()) newErrors.name = "Class name is required";
        if (!form.academy_care_id.trim()) newErrors.academy_care_id = "Academy Care is required";
        if (form.subjects.filter((subject) => subject.trim()).length === 0) newErrors.subjects = "At least one subject is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!validate()) return;
        setSaving(true);
        await onCreate({
            ...form,
            subjects: form.subjects.map((subject) => subject.trim()).filter(Boolean)
        });
        setForm({ ...initialForm, subjects: [] });
        setSaving(false);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-10">
            {/* Section: Basic Information */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <span className="material-symbols-outlined text-[24px]">info</span>
                    </div>
                    <div>
                        <h3 className="text-[15px] font-bold text-slate-900">Basic Information</h3>
                        <p className="text-[11px] font-medium text-slate-400">Core identity and location of the class</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Class Name"
                        placeholder="e.g., Grade 10 - Alpha"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        error={errors.name}
                        className="font-bold text-slate-800"
                        required
                    />

                    <Input
                        label="Room Number"
                        placeholder="e.g., Room 101, Block B"
                        value={form.room_number || ""}
                        onChange={(e) => setForm({ ...form, room_number: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                        label="Linked Academy Year"
                        value={form.academy_care_id}
                        onChange={(event) => setForm({ ...form, academy_care_id: event.target.value })}
                        options={[
                            { label: "Select academic year", value: "" },
                            ...academyCareOptions.map(o => ({ label: o.label, value: o.id }))
                        ]}
                        error={errors.academy_care_id}
                        required
                    />

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Status</label>
                        <div className="flex items-center gap-4 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                    type="radio" 
                                    name="status" 
                                    checked={form.status === "active" || !form.status} 
                                    onChange={() => setForm({...form, status: "active"})}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-600/20"
                                />
                                <span className="text-sm font-bold text-slate-700">Active</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                    type="radio" 
                                    name="status" 
                                    checked={form.status === "inactive"} 
                                    onChange={() => setForm({...form, status: "inactive"})}
                                    className="h-4 w-4 text-slate-300 focus:ring-slate-600/20"
                                />
                                <span className="text-sm font-bold text-slate-400">Inactive</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Description</label>
                    <textarea
                        placeholder="Add operational notes or class description..."
                        value={form.description || ""}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        rows={3}
                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-600/5 transition-all"
                    />
                </div>
            </section>

            {/* Section: Faculty Assignment */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <span className="material-symbols-outlined text-[24px]">badge</span>
                    </div>
                    <div>
                        <h3 className="text-[15px] font-bold text-slate-900">Faculty Assignment</h3>
                        <p className="text-[11px] font-medium text-slate-400">Assign teachers and mentors to this section</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {teacherOptions.map((teacher) => {
                        const isChecked = form.teacher_ids.includes(teacher.id);
                        return (
                            <label
                                key={teacher.id}
                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isChecked ? "bg-blue-50 border-blue-200 shadow-sm" : "bg-white border-slate-100 hover:border-slate-200"}`}
                            >
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${isChecked ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                                    {teacher.label.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className={`text-xs font-bold truncate ${isChecked ? "text-blue-700" : "text-slate-700"}`}>{teacher.label}</div>
                                    <div className="text-[10px] text-slate-400">Faculty</div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                        const newIds = e.target.checked
                                            ? [...form.teacher_ids, teacher.id]
                                            : form.teacher_ids.filter((id) => id !== teacher.id);
                                        setForm({ ...form, teacher_ids: newIds });
                                    }}
                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600/20"
                                />
                            </label>
                        );
                    })}
                </div>
            </section>

            {/* Section: Subject Mapping */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                        <span className="material-symbols-outlined text-[24px]">menu_book</span>
                    </div>
                    <div>
                        <h3 className="text-[15px] font-bold text-slate-900">Subject Mapping</h3>
                        <p className="text-[11px] font-medium text-slate-400">Select curriculum subjects for this class</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                        {subjectOptions.map((subject) => {
                            const isChecked = form.subjects.includes(subject.label);
                            return (
                                <label
                                    key={subject.id}
                                    className={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${isChecked ? "bg-amber-50 border-amber-200" : "bg-white border-slate-50 hover:border-slate-100"}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(event) => {
                                            const nextSubjects = event.target.checked
                                                ? [...form.subjects, subject.label]
                                                : form.subjects.filter((name) => name !== subject.label);
                                            setForm({ ...form, subjects: nextSubjects });
                                        }}
                                        className="h-3.5 w-3.5 rounded border-slate-300 text-amber-600 focus:ring-amber-600/20"
                                    />
                                    <span className={`text-[11px] font-bold truncate ${isChecked ? "text-amber-800" : "text-slate-600"}`}>{subject.label}</span>
                                </label>
                            );
                        })}
                    </div>
                    {errors.subjects ? <p className="text-[10px] font-bold text-red-500">{errors.subjects}</p> : null}
                </div>
            </section>

            {/* Sticky Actions Bar */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 sticky bottom-0 bg-[#F8FAFF]/80 backdrop-blur-md py-4 z-10">
                <Link
                    href="/admin/classes"
                    className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                    Cancel
                </Link>
                <Button
                    type="submit"
                    disabled={saving}
                    className="min-w-[180px] h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all font-bold"
                >
                    {saving ? (
                        <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Creating...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">check_circle</span>
                            Initialize Class
                        </span>
                    )}
                </Button>
            </div>
        </form>
    );
}
