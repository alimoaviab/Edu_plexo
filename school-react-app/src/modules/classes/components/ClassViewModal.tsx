import { AppIcon } from "shared/ui/AppIcon";
import { ClassRow } from "../types/class.types";
import { Badge, DetailsPanel } from "@/components/ui";

interface ClassViewModalProps {
    classItem: ClassRow | null;
    open: boolean;
    onClose: () => void;
}

export function ClassViewModal({ classItem, open, onClose }: ClassViewModalProps) {
    if (!classItem) return null;

    const studentCount = classItem.enrolled_students || classItem.student_count || 0;
    const attendance = classItem.attendance_percentage || 0;
    const feeStatus = (classItem as any).fee_status || 0;

    return (
        <DetailsPanel
            isOpen={open}
            onClose={onClose}
            title={classItem.name}
            subtitle={`Academic Year: ${classItem.academic_year || "2024-25"} • Section: ${classItem.section || "General"}`}
        >
            <div className="space-y-8">
                {/* Key Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col gap-2">
                        <div className="h-8 w-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                            <AppIcon name="Users" size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Students</p>
                            <p className="text-lg font-black text-blue-950">{studentCount}</p>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col gap-2">
                        <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <AppIcon name="CalendarCheck" size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Attendance</p>
                            <p className="text-lg font-black text-emerald-950">{attendance}%</p>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-violet-50/50 border border-violet-100 flex flex-col gap-2">
                        <div className="h-8 w-8 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
                            <AppIcon name="Wallet" size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">Fee Collection</p>
                            <p className="text-lg font-black text-violet-950">{feeStatus}%</p>
                        </div>
                    </div>
                </div>

                {/* Class Info */}
                <div>
                    <h3 className="text-sm font-black text-slate-900 mb-4">Class Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </DetailsPanel>
    );
}
