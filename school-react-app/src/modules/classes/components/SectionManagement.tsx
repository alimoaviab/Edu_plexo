import { AppIcon } from "shared/ui/AppIcon";
import { useState } from "react";
import { useSections } from "../hooks/useSections";
import { Button, Input, Drawer, DataState } from "@/components/ui";
import { useDialog } from "@/components/ui/DialogContext";

interface SectionManagementProps {
    isOpen: boolean;
    onClose: () => void;
    academicYearId?: string;
}

export function SectionManagement({ isOpen, onClose, academicYearId }: SectionManagementProps) {
    const { state, addSection, updateSection, deleteSection } = useSections();
    const { confirm } = useDialog();
    const [newSectionName, setNewSectionName] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const sections = (state.data as any)?.data || [];
    const isLoading = state.status === "loading" || state.status === "idle";

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSectionName.trim() || isSaving) return;
        setIsSaving(true);
        const result = await addSection({ name: newSectionName.trim(), academic_year_id: academicYearId });
        if (result.success) {
            setNewSectionName("");
        }
        setIsSaving(false);
    };

    const handleUpdate = async () => {
        if (!editingId || !editingName.trim() || isSaving) return;
        setIsSaving(true);
        const result = await updateSection(editingId, { name: editingName.trim() });
        if (result.success) {
            setEditingId(null);
            setEditingName("");
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (await confirm("Delete Section", "Are you sure you want to delete this section? This action cannot be undone.")) {
            setIsSaving(true);
            await deleteSection(id);
            setIsSaving(false);
        }
    };

    return (
        <Drawer isOpen={isOpen} onClose={onClose} width="max-w-md">
            <div className="h-full flex flex-col bg-slate-50">
                <div className="flex items-center justify-between p-6 bg-white border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-black text-slate-900 tracking-tight">Manage Sections</h2>
                        <p className="text-xs font-bold text-slate-500">Configure institutional sections</p>
                    </div>
                    <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                        <AppIcon name="Close" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <form onSubmit={handleAdd} className="flex items-end gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex-1">
                            <Input
                                label="New Section Name"
                                placeholder="e.g. A, B, Gold, Silver"
                                value={newSectionName}
                                onChange={(e) => setNewSectionName(e.target.value)}
                            />
                        </div>
                        <Button type="submit" variant="primary" disabled={!newSectionName.trim() || isSaving || !academicYearId} className="h-[44px]">
                            <AppIcon name="Plus" size={16} className="mr-1" />
                            Add
                        </Button>
                    </form>

                    {!academicYearId && (
                        <div className="p-3 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium flex items-center gap-2">
                            <AppIcon name="AlertTriangle" size={16} />
                            Please select an active academic year to manage sections.
                        </div>
                    )}

                    <div className="space-y-3">
                        <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">
                            Active Sections ({sections.length})
                        </h4>
                        
                        {isLoading ? (
                            <div className="h-32 flex items-center justify-center text-slate-400">
                                <AppIcon name="RefreshCw" className="animate-spin" />
                            </div>
                        ) : sections.length === 0 ? (
                            <DataState
                                variant="empty"
                                title="No sections found"
                                message="Add your first section above to get started."
                            />
                        ) : (
                            <div className="grid grid-cols-1 gap-3 p-1">
                                {sections.map((section: any) => {
                                    const isEditing = editingId === section._id;
                                    
                                    return (
                                        <div
                                            key={section._id}
                                            className="group p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-md transition-all flex items-center min-h-[54px]"
                                        >
                                            {isEditing ? (
                                                <div className="flex-1 flex items-center gap-2">
                                                    <input
                                                        autoFocus
                                                        value={editingName}
                                                        onChange={(e) => setEditingName(e.target.value)}
                                                        className="w-full bg-slate-50 border border-blue-200 rounded px-2 py-1 text-sm font-bold text-slate-900 outline-none"
                                                        onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                                                    />
                                                    <button onClick={handleUpdate} disabled={isSaving} className="text-blue-600 hover:scale-110">
                                                        <AppIcon name="Check" size={16} />
                                                    </button>
                                                    <button onClick={() => setEditingId(null)} className="text-slate-400 hover:scale-110">
                                                        <AppIcon name="X" size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex-1 truncate">
                                                        <p className="text-sm font-bold text-slate-900">{section.name}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => {
                                                                setEditingId(section._id);
                                                                setEditingName(section.name);
                                                            }}
                                                            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                                                        >
                                                            <AppIcon name="Edit" size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(section._id)}
                                                            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                                        >
                                                            <AppIcon name="Trash2" size={14} />
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Drawer>
    );
}
