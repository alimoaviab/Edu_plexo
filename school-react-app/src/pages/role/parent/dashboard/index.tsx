import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { SchoolShell } from "@/layouts/SchoolShell";
import { useSelectedChild } from "@/contexts/SelectedChildContext";
import { serviceRequest } from "@/services/service-client";
import { TimetablePreview } from "@/modules/timetable/components/TimetablePreview";
import { Skeleton } from "@/components/ui";
import { AppIcon } from "shared/ui/AppIcon";
import { motion } from "framer-motion";

interface DashboardOverview {
  student_id: string;
  name: string;
  class: string;
  current_grade: string;
  attendance_percentage: number;
  pending_fees: number;
  pending_assignments: number;
}

interface DashboardApiResponse {
  dashboard?: { children_overview?: DashboardOverview[] };
  attendance?: { present?: number; total?: number; percentage?: number };
  upcomingExams?: Array<{ _id: string; title: string; subject: string; starts_at: string; max_marks?: number }>;
  recentResults?: Array<{ _id: string; exam_id: string; obtained_marks: number; max_marks?: number; remarks?: string; exam_title?: string; grade?: string }>;
  feeDue?: { amount?: number; due_date?: string | null };
}

interface StudentInfo {
  roll_no: string;
  class: string;
  section: string;
}

export function ParentDashboardPage() {
  const { selectedChild, loading: contextLoading } = useSelectedChild();
  
  // States
  const [stats, setStats] = useState<DashboardOverview | null>(null);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState<DashboardApiResponse | null>(null);
  const [homeworkList, setHomeworkList] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    if (!selectedChild) return;
    const studentId = selectedChild.student_id;
    const studentName = selectedChild.student_name;
    const className = selectedChild.class_name;
    let cancelled = false;

    async function fetchDashboardData() {
      setLoading(true);
      try {
        const [statsRes, infoRes, hwRes, annRes] = await Promise.all([
          serviceRequest<DashboardApiResponse>(
            `/api/parent/dashboard/stats?student_id=${encodeURIComponent(studentId)}`
          ),
          serviceRequest<{ student?: StudentInfo }>(
            `/api/parent/student-info?student_id=${encodeURIComponent(studentId)}`
          ),
          serviceRequest<any>(
            `/api/parent/child/homework?student_id=${encodeURIComponent(studentId)}`
          ),
          serviceRequest<any>(
            `/api/parent/child/announcements`
          ),
        ]);

        if (cancelled) return;

        // Parse apiData
        if (statsRes.ok && statsRes.data) {
          setApiData(statsRes.data);
          const overview = statsRes.data?.dashboard?.children_overview?.[0];
          const fallback: DashboardOverview = {
            student_id: studentId,
            name: studentName,
            class: className,
            current_grade: "—",
            attendance_percentage: statsRes.data?.attendance?.percentage || 0,
            pending_fees: statsRes.data?.feeDue?.amount || 0,
            pending_assignments: 0,
          };
          setStats(overview ?? fallback);
        }

        // Parse studentInfo
        if (infoRes.ok && infoRes.data?.student) {
          setStudentInfo(infoRes.data.student);
        }

        // Parse homework list
        if (hwRes.ok && hwRes.data) {
          const hw = Array.isArray(hwRes.data)
            ? hwRes.data
            : hwRes.data.homework_list || hwRes.data.data || [];
          setHomeworkList(hw);
          
          // Update stats assignments counter dynamically
          setStats((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              pending_assignments: hw.length,
            };
          });
        }

        // Parse announcements
        if (annRes.ok && annRes.data) {
          const anns = Array.isArray(annRes.data) ? annRes.data : [];
          setAnnouncements(anns.slice(0, 2)); // Grab latest 2
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchDashboardData();
    return () => {
      cancelled = true;
    };
  }, [selectedChild]);

  // Exam Countdown helper
  function getExamDaysLeft(startsAtStr: string) {
    const now = new Date();
    const startsAt = new Date(startsAtStr);
    const diffTime = startsAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Completed";
    if (diffDays === 0) return "Starts Today";
    if (diffDays === 1) return "Starts Tomorrow";
    return `In ${diffDays} days`;
  }

  // Formatting due dates
  function formatDueDate(dateStr?: string) {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  }

  if (contextLoading || (loading && !stats)) {
    return (
      <SchoolShell eyebrow="Guardian Portal" title="Academic Oversight">
        <div className="space-y-6">
          <Skeleton className="h-28 w-full rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl animate-pulse" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 lg:col-span-2 rounded-2xl animate-pulse" />
            <Skeleton className="h-64 rounded-2xl animate-pulse" />
          </div>
        </div>
      </SchoolShell>
    );
  }

  if (!selectedChild) {
    return (
      <SchoolShell eyebrow="Guardian Portal" title="Academic Oversight">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <AppIcon name="Users" size={36} className="text-slate-200 mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No student selected</h3>
          <p className="text-[11px] text-slate-400 mt-1">
            Pick a child from the header to load their dashboard.
          </p>
        </div>
      </SchoolShell>
    );
  }

  const data: DashboardOverview = stats ?? {
    student_id: selectedChild.student_id,
    name: selectedChild.student_name,
    class: selectedChild.class_name,
    current_grade: "—",
    attendance_percentage: 0,
    pending_fees: 0,
    pending_assignments: 0,
  };

  const hasOutstandingFees = data.pending_fees > 0;

  return (
    <SchoolShell eyebrow="Guardian Portal" title="Academic Oversight">
      <div className="space-y-6 pb-12">
        
        {/* Fee Alert Banner */}
        {hasOutstandingFees && (
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center justify-between shadow-sm animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-rose-100 text-rose-700 rounded-lg flex items-center justify-center">
                <AppIcon name="Payments" size={18} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-rose-800">Outstanding Balance Pending</p>
                <p className="text-[10px] text-rose-600 font-semibold mt-0.5">
                  An amount of Rs. {Number(data.pending_fees).toLocaleString()} is outstanding. Please clear dues soon.
                </p>
              </div>
            </div>
            <Link
              to="/parent/fees"
              className="h-8 px-4 rounded-lg bg-rose-600 text-white hover:bg-rose-700 font-bold text-[11px] flex items-center justify-center transition-colors"
            >
              Pay Now
            </Link>
          </div>
        )}

        {/* Hero Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[9px] font-bold text-indigo-700 uppercase tracking-wider">
                Guardian View
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                Roll No: {studentInfo?.roll_no || selectedChild.admission_no || "EDP/4819"}
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              {selectedChild.student_name}
            </h2>
            <div className="flex items-center gap-4 text-slate-500 font-semibold text-[12px]">
              <div className="flex items-center gap-1.5">
                <AppIcon name="GraduationCap" size={14} className="text-slate-400" />
                <span>
                  {studentInfo?.class || selectedChild.class_name}
                  {studentInfo?.section
                    ? ` - ${studentInfo.section}`
                    : selectedChild.class_section
                      ? ` - ${selectedChild.class_section}`
                      : ""}
                </span>
              </div>
              <div className="h-1 w-1 rounded-full bg-slate-300" />
              <div className="flex items-center gap-1.5">
                <AppIcon name="Calendar" size={14} className="text-slate-400" />
                <span>Term {selectedChild.academic_year || "2025-2026"}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics columns on the right */}
          <div className="grid grid-cols-3 gap-6 md:border-l md:border-slate-100 md:pl-6 shrink-0 z-10">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Attendance</p>
              <p className="text-lg font-black text-slate-800 tracking-tight mt-0.5">{data.attendance_percentage}%</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tasks Left</p>
              <p className="text-lg font-black text-slate-800 tracking-tight mt-0.5">{data.pending_assignments}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Latest Grade</p>
              <p className="text-lg font-black text-indigo-600 tracking-tight mt-0.5">{data.current_grade}</p>
            </div>
          </div>

          <AppIcon name="Award" size={120} className="absolute right-[-10px] bottom-[-20px] text-slate-50 opacity-40 select-none pointer-events-none" />
        </div>

        {/* Grid widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT AREA: Schedule, Homework */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Daily Schedule Preview Widget */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/40">
                <div>
                  <h3 className="text-[13px] font-bold text-slate-800 tracking-tight">Today's Schedule</h3>
                  <p className="text-[10px] font-medium text-slate-400 mt-0.5">Classes running today</p>
                </div>
                <Link
                  to="/parent/timetable"
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider"
                >
                  Full Timetable
                </Link>
              </div>
              <div className="p-5">
                <TimetablePreview classId={selectedChild.class_id} />
              </div>
            </div>

            {/* Pending Homework Tasks Widget */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/40">
                <div>
                  <h3 className="text-[13px] font-bold text-slate-800 tracking-tight">Pending Tasks & Homework</h3>
                  <p className="text-[10px] font-medium text-slate-400 mt-0.5">Assigned coursework</p>
                </div>
                <Link
                  to="/parent/homework"
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider"
                >
                  See All Tasks ({homeworkList.length})
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {homeworkList.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs font-semibold">
                    No pending homework. Child is all caught up!
                  </div>
                ) : (
                  homeworkList.slice(0, 3).map((hw) => (
                    <div key={hw._id || hw.id} className="p-4 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
                      <div className="min-w-0">
                        <h4 className="text-[12px] font-bold text-slate-800 truncate pr-2">{hw.title}</h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{hw.subject_name || hw.subject}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200/60 text-[9px] font-bold text-slate-500">
                          Due: {formatDueDate(hw.due_at)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* RIGHT AREA: Upcoming Exams, Latest results, Announcements */}
          <div className="space-y-6">
            
            {/* Upcoming Exams Widget */}
            {apiData?.upcomingExams && apiData.upcomingExams.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/40">
                  <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-wider">Upcoming Exams</h3>
                  <Link to="/parent/exams" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700">
                    Schedules
                  </Link>
                </div>
                <div className="p-4 space-y-3">
                  {apiData.upcomingExams.slice(0, 2).map((ex) => (
                    <div key={ex._id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="text-[12px] font-bold text-slate-800 truncate">{ex.title}</h4>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">{ex.subject}</p>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded shrink-0">
                        {getExamDaysLeft(ex.starts_at)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Latest Grades / Results Snapshot */}
            {apiData?.recentResults && apiData.recentResults.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/40">
                  <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-wider">Latest Grades</h3>
                  <Link to="/parent/results" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700">
                    Report Cards
                  </Link>
                </div>
                <div className="p-4 space-y-3">
                  {apiData.recentResults.slice(0, 2).map((res) => (
                    <div key={res._id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="text-[12px] font-bold text-slate-800 truncate">{res.remarks || "Class Exam Result"}</h4>
                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Score: {res.obtained_marks} marks</p>
                      </div>
                      <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full shrink-0">
                        {res.grade || "A"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* School Bulletins / Announcements */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/40">
                <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-wider">School Notices</h3>
                <Link to="/parent/announcements" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700">
                  Feed
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {announcements.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs font-semibold">
                    No recent school notices.
                  </div>
                ) : (
                  announcements.map((ann) => (
                    <div key={ann._id} className="p-4 space-y-1 hover:bg-slate-50/40 transition-colors">
                      <h4 className="text-[12px] font-bold text-slate-800 line-clamp-1">{ann.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
                        {ann.body}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </SchoolShell>
  );
}
