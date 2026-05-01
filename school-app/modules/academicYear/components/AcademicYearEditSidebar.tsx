"use client";

import { useState, FormEvent } from "react";
import { AcademicYearRow, AcademicYearUpdateInput } from "../types/academicYear.types";

export function AcademicYearEditSidebar({
    academicYear,
    isOpen,
    onClose,
    onSave,
    isSaving,
}: {
    academicYear: AcademicYearRow | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string, data: AcademicYearUpdateInput) => Promise<void>;
    isSaving: boolean;
}) {
    const [form, setForm] = useState<Partial<AcademicYearUpdateInput>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    if (!academicYear) return null;

    const currentForm = {
        year: form.year ?? academicYear.year ?? "",
        start_date: form.start_date ?? academicYear.start_date?.split("T")[0] ?? "",
        end_date: form.end_date ?? academicYear.end_date?.split("T")[0] ?? "",
        is_active: form.is_active ?? academicYear.is_active ?? false,
        description: form.description ?? academicYear.description ?? "",
    };

    function validate() {
        const newErrors: Record<string, string> = {};
        if (!currentForm.year.trim()) newErrors.year = "Year is required";
        if (!currentForm.start_date) newErrors.start_date = "Start date is required";
        if (!currentForm.end_date) newErrors.end_date = "End date is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!validate() || !academicYear) return;
        await onSave(academicYear._id, {
            year: currentForm.year,
            start_date: currentForm.start_date,
            end_date: currentForm.end_date,
            is_active: currentForm.is_active,
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
                    <h2 className="text-lg font-bold text-gray-900">Edit Academic Year</h2>
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
                            Academic Year Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Year Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={currentForm.year}
                                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                                    placeholder="e.g., 2024-2025"
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.year ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.year && (
                                    <p className="text-sm text-red-600 mt-1">{errors.year}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={currentForm.description}
                                    onChange={(e) =>
                                        setForm({ ...form, description: e.target.value })
                                    }
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            Duration
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={currentForm.start_date}
                                    onChange={(e) =>
                                        setForm({ ...form, start_date: e.target.value })
                                    }
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.start_date ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.start_date && (
                                    <p className="text-sm text-red-600 mt-1">{errors.start_date}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={currentForm.end_date}
                                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.end_date ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.end_date && (
                                    <p className="text-sm text-red-600 mt-1">{errors.end_date}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            Status
                        </h3>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={currentForm.is_active}
                                onChange={(e) =>
                                    setForm({ ...form, is_active: e.target.checked })
                                }
                                className="rounded border-gray-300 w-4 h-4"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Mark as Active Year
                            </span>
                        </label>
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
