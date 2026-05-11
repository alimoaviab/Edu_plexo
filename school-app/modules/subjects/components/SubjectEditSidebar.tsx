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

            <div className="fixed right-0 top-0 h-screen w-[400px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-right-full duration-300">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
                    <div>
                        <h2 className="text-[16px] font-bold text-slate-900">{subject ? "Modify Subject" : "New Subject Entry"}</h2>
                        <p className="text-[11px] font-medium text-slate-400 normal-case ">Curriculum Inventory</p>
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
                            <h3 className="text-[11px] font-bold text-slate-400 normal-case ">
                                Basic Information
                            </h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 normal-case  mb-1.5">
                                    Subject Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={currentForm.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g., Mathematics"
                                    className={`h-10 w-full px-3 text-sm border rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all ${errors.name ? "border-red-500 bg-red-50/30" : "border-slate-200 bg-white focus:border-blue-400"
                                        }`}
                                />
                                {errors.name && (
                                    <p className="text-[10px] font-bold text-red-500 mt-1">{errors.name}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 normal-case  mb-1.5">
                                    Subject Code
                                </label>
                                <input
                                    type="text"
                                    value={currentForm.code}
                                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                                    placeholder="e.g., MAT-01"
                                    className="h-10 w-full px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-400 bg-white transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 normal-case  mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    value={currentForm.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={4}
                                    placeholder="Subject curriculum overview..."
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-400 bg-white transition-all"
                                />
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="h-1 w-4 rounded-full bg-blue-600" />
                            <h3 className="text-[11px] font-bold text-slate-400 normal-case ">
                                Operational Status
                            </h3>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                            <div>
                                <p className="text-[13px] font-bold text-slate-700">Available for enrollment</p>
                                <p className="text-[10px] text-slate-400">Determines visibility in class mapping</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={currentForm.status === "active"}
                                    onChange={(e) => setForm({ ...form, status: e.target.checked ? "active" : "inactive" })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-600/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 transition-all"></div>
                            </label>
                        </div>
                    </section>
                </form>

                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-100 bg-white/80 backdrop-blur-md flex gap-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSaving}
                        className="flex-1 h-11 text-[13px] font-bold text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        onClick={handleSubmit}
                        className="flex-[1.5] h-11 text-[13px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
                             <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : (
                            <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        )}
                        {isSaving ? "Saving..." : "Save Subject"}
                    </button>
                </div>
            </div>
        </>
    );
}
