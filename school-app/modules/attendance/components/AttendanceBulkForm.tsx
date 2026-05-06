"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button, DataState, Input, Select, Skeleton } from "../../../components/ui";
import { useSafeAsync } from "../../../hooks/useSafeAsync";
import { showToast } from "../../../utils/toast";
import { serviceRequest } from "../../../services/service-client";
import { listAttendance, markAttendance } from "../services/attendance.service";
import { AttendanceBulkInput, AttendanceStatus, AttendanceRecordRow } from "../types/attendance.types";

interface ClassOption {
    id: string;
    label: string;
    academicYearId?: string;
}

interface StudentOption {
    _id: string;
    first_name: string;
    last_name: string;
    admission_no: string;
    class_id: string;
    status: "active" | "inactive" | "graduated" | "transferred";
}

interface AttendanceBulkFormProps {
    initialClassId?: string;
    onSaved?: () => void;
}

const statusOptions: Array<{ label: string; value: AttendanceStatus }> = [
    { label: "Present", value: "present" },
    { label: "Absent", value: "absent" },
    { label: "Late", value: "late" },
    { label: "Excused", value: "excused" }
];

function getToday() {
    return new Date().toISOString().split("T")[0];
}

export function AttendanceBulkForm({ initialClassId, onSaved }: AttendanceBulkFormProps) {
    const [selectedClassId, setSelectedClassId] = useState(initialClassId ?? "");
    const [selectedDate, setSelectedDate] = useState(getToday());
    const [statusByStudent, setStatusByStudent] = useState<Record<string, AttendanceStatus>>({});
    const [saving, setSaving] = useState(false);

    const { state: classState, run: runClasses } = useSafeAsync<ClassOption[]>();
    const { state: studentState, run: runStudents } = useSafeAsync<StudentOption[]>();
    const { state: attendanceState, run: runAttendance } = useSafeAsync<AttendanceRecordRow[]>();

    useEffect(() => {
        void runClasses(async () => {
            const result = await serviceRequest<Array<{ _id: string; name: string; academy_care_id?: string }>>("/api/classes");
            if (!result.ok) {
                throw new Error(result.error.message || "Failed to load classes");
            }

            return result.data.map((item) => ({
                id: item._id,
                label: item.name,
                academicYearId: item.academy_care_id
            }));
        }).catch(() => {
            // useSafeAsync already tracks the error state.
        });

        void runStudents(async () => {
            const result = await serviceRequest<StudentOption[]>("/api/students");
            if (!result.ok) {
                throw new Error(result.error.message || "Failed to load students");
            }

            return result.data;
        }).catch(() => {
            // useSafeAsync already tracks the error state.
        });
    }, [runClasses, runStudents]);

    useEffect(() => {
        if (!selectedClassId) {
            setStatusByStudent({});
            return;
        }

        void runAttendance(async () => {
            const result = await listAttendance({ class_id: selectedClassId, date: selectedDate });
            if (!result.ok) {
                throw new Error(result.error.message || "Failed to load attendance snapshot");
            }

            return result.data;
        }).catch(() => {
            // useSafeAsync already tracks the error state.
        });
    }, [runAttendance, selectedClassId, selectedDate]);

    const classOptions = classState.data ?? [];
    const classStudents = useMemo(
        () => (studentState.data ?? []).filter((student) => student.class_id === selectedClassId && student.status === "active"),
        [selectedClassId, studentState.data]
    );

    useEffect(() => {
        if (!selectedClassId || classStudents.length === 0) {
            setStatusByStudent({});
            return;
        }

        const nextStatusMap: Record<string, AttendanceStatus> = {};
        for (const student of classStudents) {
            nextStatusMap[student._id] = "present";
        }

        for (const row of attendanceState.data ?? []) {
            if (row.class_id === selectedClassId) {
                nextStatusMap[row.student_id] = row.status;
            }
        }

        setStatusByStudent(nextStatusMap);
    }, [attendanceState.data, classStudents, selectedClassId]);

    const markedCount = Object.keys(statusByStudent).length;
    const summaryCounts = useMemo(() => {
        const totals = { present: 0, absent: 0, late: 0, excused: 0 };
        for (const status of Object.values(statusByStudent)) {
            totals[status] += 1;
        }
        return totals;
    }, [statusByStudent]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!selectedClassId) {
            showToast("Select a class first.", "error");
            return;
        }

        if (classStudents.length === 0) {
            showToast("No active students found in this class.", "error");
            return;
        }

        setSaving(true);
        try {
            const payload: AttendanceBulkInput = {
                class_id: selectedClassId,
                date: selectedDate,
                records: classStudents.reduce<Record<string, AttendanceStatus>>((records, student) => {
                    records[student._id] = statusByStudent[student._id] ?? "present";
                    return records;
                }, {})
            };

            const result = await markAttendance(payload);
            if (!result.ok) {
                showToast(result.error.message || "Failed to save attendance", "error");
                return;
            }

            showToast(`Attendance saved for ${result.data.saved} students.`, "success");
            const refresh = await listAttendance({ class_id: selectedClassId, date: selectedDate });
            if (refresh.ok) {
                const refreshedMap: Record<string, AttendanceStatus> = {};
                for (const row of refresh.data) {
                    refreshedMap[row.student_id] = row.status;
                }
                setStatusByStudent((current) => ({ ...current, ...refreshedMap }));
            }
            onSaved?.();
        } finally {
            setSaving(false);
        }
    }

    if (classState.status === "loading" || studentState.status === "loading") {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (classState.status === "error") {
        return <DataState variant="error" title="Classes unavailable" message={classState.error} />;
    }

    if (studentState.status === "error") {
        return <DataState variant="error" title="Students unavailable" message={studentState.error} />;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-4 premium-card p-4 bg-slate-50/50 border-slate-200">
                <div className="flex-1 w-full">
                    <Select
                        label="Target Class"
                        value={selectedClassId}
                        onChange={(event) => setSelectedClassId(event.target.value)}
                        options={[{ label: "Select assigned class", value: "" }, ...classOptions.map((item) => ({ label: item.label, value: item.id }))]}
                        className="font-bold text-slate-800"
                    />
                </div>
                <div className="w-full md:w-64">
                    <Input
                        label="Tracking Date"
                        type="date"
                        value={selectedDate}
                        onChange={(event) => setSelectedDate(event.target.value)}
                        className="font-bold"
                    />
                </div>
            </div>

            {selectedClassId ? (
                classStudents.length > 0 ? (
                    <div className="space-y-4">
                        {/* Summary Header */}
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[24px]">group</span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Roster Management</h3>
                                    <p className="text-[11px] font-medium text-slate-500">Mark attendance for {classStudents.length} students</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[11px] font-bold text-emerald-700">Present: {summaryCounts.present}</span>
                                </div>
                                <div className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                    <span className="text-[11px] font-bold text-red-700">Absent: {summaryCounts.absent}</span>
                                </div>
                                <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                    <span className="text-[11px] font-bold text-amber-700">Late: {summaryCounts.late}</span>
                                </div>
                            </div>
                        </div>

                        {/* Student Grid/List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {classStudents.map((student) => {
                                const status = statusByStudent[student._id] ?? "present";
                                return (
                                    <div 
                                        key={student._id} 
                                        className={`premium-card p-4 transition-all flex flex-col gap-4 ${
                                            status === "present" ? "hover:border-emerald-200" :
                                            status === "absent" ? "border-red-100 bg-red-50/10" :
                                            status === "late" ? "border-amber-100 bg-amber-50/10" : ""
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                                                {student.first_name.substring(0, 1)}{student.last_name.substring(0, 1)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-bold text-slate-900 truncate">{student.first_name} {student.last_name}</p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{student.admission_no}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { label: "Present", value: "present", icon: "check_circle", activeClass: "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20", inactiveClass: "bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600" },
                                                { label: "Absent", value: "absent", icon: "cancel", activeClass: "bg-red-600 text-white shadow-lg shadow-red-600/20", inactiveClass: "bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-600" },
                                                { label: "Late", value: "late", icon: "schedule", activeClass: "bg-amber-500 text-white shadow-lg shadow-amber-500/20", inactiveClass: "bg-slate-50 text-slate-500 hover:bg-amber-50 hover:text-amber-600" },
                                            ].map((btn) => (
                                                <button
                                                    key={btn.value}
                                                    type="button"
                                                    onClick={() => setStatusByStudent(prev => ({ ...prev, [student._id]: btn.value as AttendanceStatus }))}
                                                    className={`flex flex-col items-center justify-center py-2 rounded-xl transition-all ${status === btn.value ? btn.activeClass : btn.inactiveClass}`}
                                                >
                                                    <span className="material-symbols-outlined text-[18px] mb-0.5">{btn.icon}</span>
                                                    <span className="text-[9px] font-black uppercase tracking-tighter">{btn.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="py-20 text-center premium-card border-dashed border-2">
                        <div className="h-16 w-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-[32px]">person_off</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Roster Empty</h3>
                        <p className="text-sm text-slate-500 max-w-xs mx-auto">No active students found in this class segment.</p>
                    </div>
                )
            ) : (
                <div className="py-20 text-center premium-card border-dashed border-2">
                    <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-[32px]">touch_app</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Select Target Class</h3>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto">Initialize the roster by picking a class from the selector above.</p>
                </div>
            )}

            {/* Sticky Actions Footer */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 sticky bottom-0 bg-white/80 backdrop-blur-md py-4 z-10">
                <div className="hidden sm:flex items-center gap-4 mr-auto px-4 border-r border-slate-100">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Marking Progress</p>
                        <p className="text-xs font-bold text-slate-700">{markedCount} / {classStudents.length} Verified</p>
                    </div>
                </div>
                
                <Button 
                    type="submit" 
                    disabled={saving || !selectedClassId || classStudents.length === 0} 
                    className="min-w-[220px] h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xl shadow-blue-600/20 transition-all font-bold"
                >
                    {saving ? (
                         <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Synchronizing...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
                            Commit Attendance
                        </span>
                    )}
                </Button>
            </div>
        </form>
    );
}
