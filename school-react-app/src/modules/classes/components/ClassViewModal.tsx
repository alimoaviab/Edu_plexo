import { AppIcon } from "shared/ui/AppIcon";
import { ClassRow } from "../types/class.types";
import { Badge } from "@/components/ui/Badge";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ClassViewModalProps {
    classItem: ClassRow | null;
    open: boolean;
    onClose: () => void;
}

export function ClassViewModal({ classItem, open, onClose }: ClassViewModalProps) {
    // Handle escape key
    useEffect(() => {
        if (!open) return;
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [open, onClose]);

    // Prevent body scroll
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [open]);

    if (!open || !classItem) return null;

    const studentCount = classItem.enrolled_students || classItem.student_count || 0;
    const attendance = classItem.attendance_percentage || 0;
    const feeStatus = (classItem as any).fee_status || 0;

    const modalContent = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div 
                className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10 border-0 m-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto" 
                onClick={e => e.stopPropagation()}
            >
                <div className="bg-slate-50/80 p-6 border-b border-slate-100 flex items-start gap-4 relative">
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 h-8 w-8 rounded-full bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shadow-sm border border-slate-200"
                    >
                        <AppIcon name="X" size={16} />
                    </button>
                    <div className="h-14 w-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-blue-600">
                        <AppIcon name="DoorFront" size={32} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">{classItem.name}</h2>
                            <Badge variant={classItem.status === "active" ? "success" : "gray"}>
                                {classItem.status === "active" ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                        <p className="text-sm font-bold text-slate-500">
                            Academic Year: {classItem.academic_year || "2024-25"} • Section: {classItem.section || "General"}
                        </p>
                    </div>
                </div>

                <div className="p-6 space-y-8">
                    {/* Key Statistics */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col gap-2">
                            <div className="h-8 w-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                <AppIcon name="Users" size={16} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Students</p>
                                <p className="text-xl font-black text-blue-950">{studentCount}</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col gap-2">
                            <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <AppIcon name="CalendarCheck" size={16} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Attendance</p>
                                <p className="text-xl font-black text-emerald-950">{attendance}%</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-violet-50/50 border border-violet-100 flex flex-col gap-2">
                            <div className="h-8 w-8 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
                                <AppIcon name="Wallet" size={16} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">Fee Collection</p>
                                <p className="text-xl font-black text-violet-950">{feeStatus}%</p>
                            </div>
                        </div>
                    </div>

                    {/* Class Info */}
                    <div>
                        <h3 className="text-sm font-black text-slate-900 mb-4">Class Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <AppIcon name="User" size={16} className="text-slate-400" />
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Class Teacher</p>
                                    <p className="text-xs font-bold text-slate-700">{classItem.class_teacher?.name || "Unassigned"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <AppIcon name="DoorOpen" size={16} className="text-slate-400" />
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Room Number</p>
                                    <p className="text-xs font-bold text-slate-700">{classItem.room_number || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Curriculum */}
                    <div>
                        <h3 className="text-sm font-black text-slate-900 mb-4">Curriculum</h3>
                        <div className="space-y-2">
                            {classItem.subjects && classItem.subjects.length > 0 ? (
                                classItem.subjects.map((subject, idx) => {
                                    const subjectName = typeof subject === "string" ? subject : subject.name;
                                    const teacherName = typeof subject === "object" && subject.teacher_id ? "Assigned" : "Unassigned"; // Fallback, could look up teacher names from teacher_names array if we had exact mapping
                                    return (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100 transition-colors hover:bg-white">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                                                    <AppIcon name="BookOpen" size={14} />
                                                </div>
                                                <p className="text-sm font-bold text-slate-700">{subjectName}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-xs font-medium text-slate-500 italic">No subjects configured.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
