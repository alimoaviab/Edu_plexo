import { FormEvent, useEffect, useState } from "react";
import { SubjectRow, SubjectFormInput } from "../types";

interface Props {
    isOpen: boolean;
    subject: SubjectRow | null;
    onClose: () => void;
    onSave: (id: string | null, data: SubjectFormInput) => Promise<void>;
    isSaving: boolean;
}

export function SubjectEditSidebar({ isOpen, subject, onClose, onSave, isSaving }: Props) {
    const [form, setForm] = useState<Partial<SubjectFormInput>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            if (subject) {
                setForm({
                    name: subject.name,
                    code: subject.code || "",
                    description: subject.description || "",
                    status: subject.status || "active",
                });
            } else {
                setForm({
                    name: "",
                    code: "",
                    description: "",
                    status: "active",
                });
            }
            setErrors({});
        }
    }, [isOpen, subject]);

    if (!isOpen) return null;

    const currentForm: SubjectFormInput = {
        name: form.name ?? "",
        code: form.code ?? "",
        description: form.description ?? "",
        status: form.status ?? "active",
    };

    function validate() {
        const newErrors: Record<string, string> = {};
        if (!currentForm.name.trim()) newErrors.name = "Name is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!validate()) return;

        await onSave(subject?._id || null, {
            name: currentForm.name,
            code: currentForm.code,
            description: currentForm.description,
            status: currentForm.status,
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
            <div
                className="fixed inset-0 bg-white/10 backdrop-blur-sm z-40 transition-opacity"
                onClick={handleClose}
            />

            <div className="fixed right-0 top-0 h-screen w-96 bg-white shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-right-96">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-900">
                        {subject ? "Edit Subject" : "Add Subject"}
                    </h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            Subject Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={currentForm.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="e.g. Mathematics"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Code
                                </label>
                                <input
                                    type="text"
                                    value={currentForm.code}
                                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. MAT101"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={currentForm.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                                    placeholder="Subject description..."
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900">
                                        Status
                                    </label>
                                    <p className="text-xs text-gray-500">Active subjects appear in dropdowns</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer mt-2">
                                    <input
                                        type="checkbox"
                                        checked={currentForm.status === "active"}
                                        onChange={(e) => setForm({ ...form, status: e.target.checked ? "active" : "inactive" })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center justify-center transition-colors"
                    >
                        {isSaving ? (
                            <div className="h-5 w-5 border-2 border-white border-t-transparent flex items-center justify-center rounded-full animate-spin" />
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}
