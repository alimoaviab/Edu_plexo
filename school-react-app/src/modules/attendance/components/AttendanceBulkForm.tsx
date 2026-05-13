import { FormEvent, useEffect, useMemo, useState, useCallback } from "react";
import { 
  Button, 
  DataState, 
  Input, 
  Select, 
  Skeleton,
  Badge
} from "@/components/ui";
import { useSafeAsync } from "@/hooks/useSafeAsync";
import { showToast } from "@/utils/toast";
import { serviceRequest } from "@/services/service-client";
import { listAttendance, markAttendance } from "../services/attendance.service";
import { AttendanceBulkInput, AttendanceStatus, AttendanceRecordRow } from "../types/attendance.types";
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  UserX, 
  UserCheck, 
  Calendar,
  Users,
  Search,
  Check,
  X,
  History,
  FileText,
  ChevronRight
} from "lucide-react";

interface ClassOption {
    id: string;
    label: string;
    section: string;
    academicYearId?: string;
}

interface StudentOption {
    _id: string;
    first_name: string;
    last_name: string;
    admission_no: string;
    class_id: string;
    section?: string;
    roll_no?: string;
    photo?: string;
    status: "active" | "inactive" | "graduated" | "transferred";
}

interface AttendanceBulkFormProps {
    initialClassId?: string;
    initialDate?: string;
    hideHeader?: boolean;
    viewMode?: "grid" | "list";
    onSaved?: () => void;
}

const statusOptions: Array<{ label: string; value: AttendanceStatus; icon: any; color: string; bg: string }> = [
    { label: "Present", value: "present", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Absent", value: "absent", icon: UserX, color: "text-red-600", bg: "bg-red-50" },
    { label: "Late", value: "late", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Excused", value: "excused", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" }
];

export function AttendanceBulkForm({ initialClassId, initialDate, viewMode = "list", onSaved }: AttendanceBulkFormProps) {
    const [statusByStudent, setStatusByStudent] = useState<Record<string, AttendanceStatus>>({});
    const [remarksByStudent, setRemarksByStudent] = useState<Record<string, string>>({});

    const { state: studentState, run: runStudents } = useSafeAsync<StudentOption[]>();
    const { state: attendanceState, run: runAttendance } = useSafeAsync<AttendanceRecordRow[]>();

    useEffect(() => {
        void runStudents(async () => {
            const query = initialClassId ? `?class_id=${initialClassId}&status=active` : "?status=active";
            const result = await serviceRequest<StudentOption[]>(`/api/students${query}`);
            if (!result.ok) throw new Error(result.error.message || "Failed to load students");
            return result.data;
        });
    }, [runStudents, initialClassId]);

    const refreshAttendanceSnapshot = useCallback(() => {
        void runAttendance(async () => {
            const result = await listAttendance({ 
              class_id: initialClassId || undefined, 
              date: initialDate,
              period: 1 
            });
            if (!result.ok) throw new Error(result.error.message || "Failed to load attendance snapshot");
            return result.data;
        });
    }, [runAttendance, initialClassId, initialDate]);

    useEffect(() => {
        refreshAttendanceSnapshot();
    }, [refreshAttendanceSnapshot]);

    const classStudents = studentState.data ?? [];

    useEffect(() => {
        if (!studentState.data) return;

        const nextStatusMap: Record<string, AttendanceStatus> = {};
        const nextRemarksMap: Record<string, string> = {};
        
        const hexify = (id: string) => {
            if (/^[0-9a-fA-F]{24}$/.test(id)) return id.toLowerCase();
            let hex = "";
            for (let i = 0; i < id.length; i++) {
                hex += id.charCodeAt(i).toString(16);
            }
            return hex.padEnd(24, '0').substring(0, 24).toLowerCase();
        };

        for (const student of studentState.data) {
            nextStatusMap[student._id] = "present";
            nextRemarksMap[student._id] = "";
        }

        for (const row of attendanceState.data ?? []) {
            const targetStudent = studentState.data.find(s => 
                s._id === row.student_id || 
                hexify(s._id) === row.student_id.toLowerCase()
            );

            if (targetStudent) {
                nextStatusMap[targetStudent._id] = row.status as AttendanceStatus;
                nextRemarksMap[targetStudent._id] = row.note || "";
            }
        }

        setStatusByStudent(nextStatusMap);
        setRemarksByStudent(nextRemarksMap);
    }, [attendanceState.data, studentState.data]);

    return (
        <form className="p-6 space-y-6" onSubmit={(e) => e.preventDefault()}>

            {studentState.status === "loading" ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
              </div>
            ) : classStudents.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {classStudents.map((student) => {
                    const status = statusByStudent[student._id] || "present";
                    return (
                      <div key={student._id} className="premium-card bg-white p-5 border-slate-200/60 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-600/5 transition-all group">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center text-xs font-black uppercase tracking-widest group-hover:scale-110 transition-transform">
                            {student.first_name.substring(0, 1)}{student.last_name.substring(0, 1)}
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-900 leading-tight">{student.first_name} {student.last_name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">Roll: {student.admission_no || 'N/A'}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                          {statusOptions.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={async () => {
                                const nextStatus = opt.value;
                                setStatusByStudent(p => ({ ...p, [student._id]: nextStatus }));
                                try {
                                  await markAttendance({
                                    class_id: initialClassId || student.class_id,
                                    date: initialDate || new Date().toISOString().split('T')[0],
                                    period: 1, 
                                    records: { [student._id]: nextStatus },
                                    remarks: { [student._id]: remarksByStudent[student._id] || "" }
                                  });
                                  onSaved?.();
                                  refreshAttendanceSnapshot();
                                } catch (err) { console.error("Auto-save failed", err); }
                              }}
                              className={`flex flex-1 items-center justify-center gap-1.5 px-2 py-2 rounded-xl border transition-all text-[9px] font-black uppercase tracking-tight ${
                                status === opt.value 
                                  ? `${opt.bg} ${opt.color} border-${opt.color.split('-')[1]}-200 shadow-sm` 
                                  : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
                              }`}
                            >
                              <opt.icon className="h-3 w-3" />
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Info</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Attendance Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {classStudents.map((student) => {
                          const status = statusByStudent[student._id] || "present";
                          return (
                            <tr key={student._id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center text-[10px] font-black uppercase tracking-widest group-hover:scale-110 transition-transform">
                                    {student.first_name.substring(0, 1)}{student.last_name.substring(0, 1)}
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-black text-slate-900">{student.first_name} {student.last_name}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Roll: {student.admission_no || 'N/A'} • {student.section || '1'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-end gap-2">
                                  {statusOptions.map((opt) => (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={async () => {
                                        const nextStatus = opt.value;
                                        setStatusByStudent(p => ({ ...p, [student._id]: nextStatus }));
                                        try {
                                          await markAttendance({
                                            class_id: initialClassId || student.class_id,
                                            date: initialDate || new Date().toISOString().split('T')[0],
                                            period: 1, 
                                            records: { [student._id]: nextStatus },
                                            remarks: { [student._id]: remarksByStudent[student._id] || "" }
                                          });
                                          onSaved?.();
                                          refreshAttendanceSnapshot();
                                        } catch (err) { console.error("Auto-save failed", err); }
                                      }}
                                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-[10px] font-black uppercase tracking-tight ${
                                        status === opt.value 
                                          ? `${opt.bg} ${opt.color} border-${opt.color.split('-')[1]}-200 shadow-sm` 
                                          : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
                                      }`}
                                    >
                                      <opt.icon className="h-3.5 w-3.5" />
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            ) : (
              <div className="py-24 flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-slate-100">
                <div className="h-16 w-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                  <UserX className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-black text-slate-900">No Students Found</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">Check class assignments or try a different search.</p>
              </div>
            )}

            {/* STICKY SUBMIT FOOTER - Removed as per user request for direct marking */}
        </form>
    );
}

function StatBadge({ label, count, color }: { label: string; count: number; color: "emerald" | "red" | "amber" }) {
  const styles = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    red: "bg-red-50 text-red-700 border-red-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
  };
  return (
    <div className={`px-3 py-1.5 rounded-xl border font-black text-[10px] flex items-center gap-2 shadow-sm ${styles[color]}`}>
      <span className="opacity-60">{label}:</span>
      <span className="text-xs">{count}</span>
    </div>
  );
}

function StatBox({ label, value, icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
        {icon}
      </div>
      <div>
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-[10px] font-black text-slate-700">{value}</p>
      </div>
    </div>
  );
}
