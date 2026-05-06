"use client";

import { useState, FormEvent } from "react";
import { ClassRow, ClassFormInput } from "../types/class.types";

export function ClassEditSidebar({
    classItem,
    isOpen,
    academyCareOptions,
    teacherOptions,
    subjectOptions,
    onClose,
    onSave,
    isSaving,
}: {
    classItem: ClassRow | null;
    isOpen: boolean;
    academyCareOptions: Array<{ id: string; label: string }>;
    teacherOptions: Array<{ id: string; label: string }>;
    subjectOptions: Array<{ id: string; label: string }>;
    onClose: () => void;
    onSave: (id: string, data: Partial<ClassFormInput>) => Promise<void>;
    isSaving: boolean;
}) {
    const [form, setForm] = useState<Partial<ClassFormInput>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    if (!classItem) return null;

    const currentForm = {
        name: form.name ?? classItem.name ?? "",
        academy_care_id: form.academy_care_id ?? classItem.academy_care_id ?? "",
        teacher_ids: form.teacher_ids ?? classItem.teacher_ids ?? [],
        subjects: form.subjects ?? classItem.subjects ?? [],
        room_number: form.room_number ?? classItem.room_number ?? "",
        description: form.description ?? classItem.description ?? "",
    };

    function validate() {
        const newErrors: Record<string, string> = {};
        if (!currentForm.name.trim()) newErrors.name = "Class name is required";
        if (!currentForm.academy_care_id.trim())
            newErrors.academy_care_id = "Academy care is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!validate() || !classItem) return;
        await onSave(classItem._id, {
            name: currentForm.name,
            academy_care_id: currentForm.academy_care_id,
            teacher_ids: currentForm.teacher_ids,
            subjects: currentForm.subjects,
            room_number: currentForm.room_number,
            description: currentForm.description,
        });
        handleClose();
    }

    function handleClose() {
        setForm({});
        setErrors({});
        onClose();
    }

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-white/10 backdrop-blur-sm z-40 transition-opacity"
                onClick={handleClose}
            />

            <div className="fixed right-0 top-0 h-screen w-[400px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-right-full duration-300">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
                    <div>
                        <h2 className="text-[16px] font-bold text-slate-900">Edit Class</h2>
                        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Operational Configuration</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="h-8 w-8 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-full transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 pb-32">
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="h-1 w-4 rounded-full bg-blue-600" />
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                Basic Information
                            </h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Class Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={currentForm.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g., Class 10-A"
                                    className={`h-9 w-full px-3 text-sm border rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all ${errors.name ? "border-red-500 bg-red-50/30" : "border-slate-200 bg-white focus:border-blue-400"
                                        }`}
                                />
                                {errors.name && (
                                    <p className="text-[10px] font-bold text-red-500 mt-1">{errors.name}</p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Room Number
                                    </label>
                                    <input
                                        type="text"
                                        value={currentForm.room_number}
                                        onChange={(e) => setForm({ ...form, room_number: e.target.value })}
                                        placeholder="e.g., 201"
                                        className="h-9 w-full px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-400 bg-white transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Academy Care <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={currentForm.academy_care_id}
                                        onChange={(e) =>
                                            setForm({ ...form, academy_care_id: e.target.value })
                                        }
                                        className={`h-9 w-full px-3 text-sm border rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all ${errors.academy_care_id
                                            ? "border-red-500 bg-red-50/30"
                                            : "border-slate-200 bg-white focus:border-blue-400 font-bold text-slate-700"
                                            }`}
                                    >
                                        <option value="">Select Session</option>
                                        {academyCareOptions.map((opt) => (
                                            <option key={opt.id} value={opt.id}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    value={currentForm.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={3}
                                    placeholder="Brief class description..."
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-400 bg-white transition-all"
                                />
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="h-1 w-4 rounded-full bg-blue-600" />
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                Faculty Assignment
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
                            {teacherOptions.map((teacher) => {
                                const isChecked = currentForm.teacher_ids.includes(teacher.id);
                                return (
                                    <label
                                        key={teacher.id}
                                        className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${isChecked ? "bg-blue-50 border-blue-200" : "bg-white border-slate-100 hover:border-slate-200"}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={(e) => {
                                                const newIds = e.target.checked
                                                    ? [...currentForm.teacher_ids, teacher.id]
                                                    : currentForm.teacher_ids.filter(
                                                        (id) => id !== teacher.id
                                                    );
                                                setForm({ ...form, teacher_ids: newIds });
                                            }}
                                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600/20"
                                        />
                                        <span className={`text-[13px] font-bold ${isChecked ? "text-blue-700" : "text-slate-700"}`}>
                                            {teacher.label}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="h-1 w-4 rounded-full bg-blue-600" />
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                Academic Mapping
                            </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                            {subjectOptions.map((subject) => {
                                const isChecked = currentForm.subjects.includes(subject.label);
                                return (
                                    <label
                                        key={subject.id}
                                        className={`flex items-center gap-3 p-2 rounded-lg border transition-all cursor-pointer ${isChecked ? "bg-blue-50 border-blue-100" : "bg-white border-slate-50 hover:border-slate-200"}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={(e) => {
                                                const newSubjects = e.target.checked
                                                    ? [...currentForm.subjects, subject.label]
                                                    : currentForm.subjects.filter(
                                                        (name) => name !== subject.label
                                                    );
                                                setForm({ ...form, subjects: newSubjects });
                                            }}
                                            className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-600/20"
                                        />
                                        <span className={`text-[11px] font-bold truncate ${isChecked ? "text-blue-700" : "text-slate-600"}`}>
                                            {subject.label}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </section>
                </form>

                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-100 bg-white/80 backdrop-blur-md flex gap-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSaving}
                        className="flex-1 h-10 text-[13px] font-bold text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        onClick={handleSubmit}
                        className="flex-[1.5] h-10 text-[13px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
                             <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : (
                            <span className="material-symbols-outlined text-[18px]">save</span>
                        )}
                        {isSaving ? "Saving..." : "Apply Changes"}
                    </button>
                </div>
            </div>
        </>
    );
}
