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

            <div className="fixed right-0 top-0 h-screen w-96 bg-white shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-right-96">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-900">Edit Class</h2>
                    <button
                        onClick={handleClose}
                        className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            Class Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Class Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={currentForm.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Room Number
                                </label>
                                <input
                                    type="text"
                                    value={currentForm.room_number}
                                    onChange={(e) => setForm({ ...form, room_number: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={currentForm.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            Academic
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Academy Care <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={currentForm.academy_care_id}
                                    onChange={(e) =>
                                        setForm({ ...form, academy_care_id: e.target.value })
                                    }
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.academy_care_id
                                        ? "border-red-500"
                                        : "border-gray-300"
                                        }`}
                                >
                                    <option value="">Select academy care</option>
                                    {academyCareOptions.map((opt) => (
                                        <option key={opt.id} value={opt.id}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.academy_care_id && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.academy_care_id}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            Teachers & Subjects
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Teachers
                                </label>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                    {teacherOptions.map((teacher) => (
                                        <label
                                            key={teacher.id}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={currentForm.teacher_ids.includes(teacher.id)}
                                                onChange={(e) => {
                                                    const newIds = e.target.checked
                                                        ? [...currentForm.teacher_ids, teacher.id]
                                                        : currentForm.teacher_ids.filter(
                                                            (id) => id !== teacher.id
                                                        );
                                                    setForm({ ...form, teacher_ids: newIds });
                                                }}
                                                className="rounded border-gray-300"
                                            />
                                            <span className="text-sm text-gray-700">
                                                {teacher.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subjects
                                </label>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                    {subjectOptions.map((subject) => (
                                        <label
                                            key={subject.id}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={currentForm.subjects.includes(subject.id)}
                                                onChange={(e) => {
                                                    const newSubjects = e.target.checked
                                                        ? [...currentForm.subjects, subject.id]
                                                        : currentForm.subjects.filter(
                                                            (id) => id !== subject.id
                                                        );
                                                    setForm({ ...form, subjects: newSubjects });
                                                }}
                                                className="rounded border-gray-300"
                                            />
                                            <span className="text-sm text-gray-700">
                                                {subject.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSaving}
                        className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        onClick={handleSubmit}
                        className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">save</span>
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </>
    );
}
