"use client";

import { useState, FormEvent } from "react";
import { AcademicYearRow, AcademicYearUpdateInput } from "../types/academicYear.types";
import { Button, Input } from "../../../components/ui";

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

    async function handleSubmit(e?: FormEvent) {
        e?.preventDefault();
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

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-slate-900/30 backdrop-blur-[1px] z-40 transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={handleClose}
            />

            {/* Drawer */}
            <aside
                className={`fixed top-0 right-0 z-50 flex h-screen w-full max-w-md transform flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-out ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3.5">
                    <div>
                        <h2 className="text-[17px] font-semibold tracking-tight text-slate-950">Edit Academic Year</h2>
                        <p className="mt-0.5 text-xs font-medium text-slate-500">Update session details and status</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-blue-50 hover:text-slate-900"
                    >
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-5 py-3.5 custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Basic Info */}
                        <div className="space-y-3.5">
                            <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
                                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                                    <span className="material-symbols-outlined text-base">info</span>
                                </div>
                                <h3 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">General Information</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <Input
                                    label="Academic Year"
                                    value={currentForm.year}
                                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                                    required
                                    placeholder="e.g. 2024-2025"
                                    error={errors.year}
                                    className="bg-white border-slate-200 focus:bg-white transition-all px-3 py-2"
                                />

                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Session status</span>
                                    <label className={`flex h-9 cursor-pointer items-center gap-3 rounded-lg border px-3 transition-all duration-200 ${currentForm.is_active ? 'border-blue-600 bg-blue-600 text-white shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300'}`}>
                                        <div className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${currentForm.is_active ? 'border-white bg-white/15' : 'border-slate-300 bg-white'}`}>
                                            {currentForm.is_active && <span className="material-symbols-outlined text-base font-black text-white">check</span>}
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={currentForm.is_active}
                                            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                            className="hidden"
                                        />
                                        <span className="text-xs font-semibold">Set as active academic year</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="space-y-3.5">
                            <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
                                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                                    <span className="material-symbols-outlined text-base">calendar_today</span>
                                </div>
                                <h3 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Duration</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                <Input
                                    label="Start Date"
                                    type="date"
                                    value={currentForm.start_date}
                                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                                    error={errors.start_date}
                                    required
                                    className="bg-white border-slate-200 focus:bg-white transition-all px-3 py-2"
                                />
                                <Input
                                    label="End Date"
                                    type="date"
                                    value={currentForm.end_date}
                                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                                    error={errors.end_date}
                                    required
                                    className="bg-white border-slate-200 focus:bg-white transition-all px-3 py-2"
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-3.5">
                            <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
                                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                                    <span className="material-symbols-outlined text-base">notes</span>
                                </div>
                                <h3 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Additional Notes</h3>
                            </div>
                            <Input
                                label="Description"
                                value={currentForm.description || ""}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Notes about this session..."
                                className="bg-white border-slate-200 focus:bg-white transition-all px-3 py-2"
                            />
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 border-t border-slate-200 bg-white/95 px-5 py-3.5 backdrop-blur-sm">
                    <button
                        onClick={handleClose}
                        className="flex-1 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600 transition-colors hover:text-slate-900"
                    >
                        Cancel
                    </button>
                    <Button
                        onClick={() => void handleSubmit()}
                        disabled={isSaving || !currentForm.year || !currentForm.start_date || !currentForm.end_date}
                        className="flex-[2] h-auto rounded-lg py-2 text-[10px] font-semibold shadow-sm transition-all active:scale-[0.98]"
                    >
                        {isSaving ? (
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                <span>Saving Changes...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-base font-black">save</span>
                                <span>Save Changes</span>
                            </div>
                        )}
                    </Button>
                </div>
            </aside>
        </>
    );
}
