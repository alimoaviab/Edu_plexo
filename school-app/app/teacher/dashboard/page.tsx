"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Badge, Card, DataState, Skeleton, Button } from "../../../components/ui";
import { SchoolShell } from "../../../layouts/SchoolShell";
import { useAuth } from "../../../hooks/useAuth";
import { useSafeAsync } from "../../../hooks/useSafeAsync";
import { serviceRequest } from "../../../services/service-client";
import {
  Users,
  BookOpen,
  ClipboardCheck,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Plus,
  ArrowUpRight,
  Bell,
  GraduationCap
} from "lucide-react";

type TeacherPortalResponse = {
  teacher: {
    id: string;
    employee_no: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    qualification: string;
    status: string;
  };
  classes: Array<{
    id: string;
    name: string;
    section: string;
    capacity: number;
    academic_year: string;
    enrolled_students: number;
  }>;
  subjects: Array<{ id: string; name: string; code: string }>;
  stats: {
    todayLectures: number;
    pendingAttendance: number;
    upcomingExams: number;
    pendingResults: number;
    assignedClasses: number;
    totalStudents: number;
  };
  todaySchedule: Array<{
    id: string;
    start_time: string;
    end_time: string;
    class_name: string;
    subject_name: string;
    room: string;
    attendance_marked: boolean;
  }>;
  upcomingExams: Array<{
    id: string;
    title: string;
    date: string;
    class_name: string;
    status: string;
  }>;
  announcements: Array<{
    id: string;
    title: string;
    message: string;
    date: string;
  }>;
};

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const { state, run } = useSafeAsync<TeacherPortalResponse>();

  const fetchDashboard = () => {
    void run(async () => {
      if (!user?.profileId) {
        throw new Error("PROFILE_MISSING");
      }

      const result = await serviceRequest<TeacherPortalResponse>(`/api/teachers/${user.profileId}`);
      if (!result.ok) {
        throw new Error(result.error.message || "Failed to load teacher dashboard");
      }

      return result.data;
    }).catch(() => { });
  };

  useEffect(() => {
    fetchDashboard();
  }, [user?.profileId]);

  if (state.status === "idle" || state.status === "loading") {
    return (
      <SchoolShell eyebrow="Teacher Portal" title="Teaching Workspace">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
          <div className="grid gap-6 xl:grid-cols-3">
            <Skeleton className="h-[500px] xl:col-span-2 rounded-[2rem]" />
            <Skeleton className="h-[500px] rounded-[2rem]" />
          </div>
        </div>
      </SchoolShell>
    );
  }

  if (state.status === "error") {
    if (state.error === "PROFILE_MISSING") {
      return (
        <SchoolShell eyebrow="Onboarding" title="Teacher Profile">
          <div className="flex min-h-[60vh] items-center justify-center p-6">
            <Card className="max-w-md border-0 bg-white shadow-2xl shadow-slate-200/50 p-8 text-center rounded-[2.5rem]">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
                <GraduationCap className="h-10 w-10 text-amber-600" />
              </div>
              <h2 className="mt-6 text-2xl font-black text-slate-900">Profile Setup Incomplete</h2>
              <p className="mt-3 text-slate-500 leading-relaxed">
                Your teaching profile has not been assigned yet. This might happen if your account was just created or your role is pending verification.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <Button onClick={() => fetchDashboard()} variant="primary" className="w-full rounded-2xl py-6">
                  Refresh Profile
                </Button>
                <Button variant="secondary" className="w-full rounded-2xl py-6 border-slate-200">
                  Contact School Administration
                </Button>
              </div>
            </Card>
          </div>
        </SchoolShell>
      );
    }

    return (
      <SchoolShell eyebrow="Error" title="Teacher Workspace">
        <DataState variant="error" title="Dashboard Unavailable" message={state.error} />
      </SchoolShell>
    );
  }

  const { teacher, stats, todaySchedule, upcomingExams, announcements } = state.data;
  const teacherName = `${teacher.first_name} ${teacher.last_name}`.trim();

  return (
    <SchoolShell eyebrow="Teacher Portal" title="Teaching Workspace">
      <div className="space-y-8">
        <section className="rounded-[2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-900 p-8 text-white shadow-2xl shadow-slate-950/20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold normal-case tracking-[0.35em] text-cyan-200/80">Welcome back</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">{teacherName}</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-200 md:text-base">
                {state.data.teacher.qualification || "Teacher portal"} · Employee No {state.data.teacher.employee_no}
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-md">
              <p className="text-xs font-semibold normal-case tracking-[0.25em] text-cyan-100/70">Status</p>
              <div className="mt-2 flex items-center gap-3">
                <Badge variant="success" className="bg-emerald-400/15 text-emerald-100 border-emerald-300/20">
                  {state.data.teacher.status}
                </Badge>
                <span className="text-sm text-slate-200">{state.data.teacher.email}</span>
              </div>
            </Card>

            {/* Upcoming Exams & Tasks Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Upcoming Exams */}
              <Card className="border-0 bg-white shadow-xl shadow-slate-200/40 p-6 rounded-[2rem]">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-indigo-500" />
                  Upcoming Exams
                </h3>
                <div className="space-y-3">
                  {upcomingExams.length > 0 ? upcomingExams.map((exam) => (
                    <div key={exam.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{exam.title}</p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{exam.class_name} • {new Date(exam.date).toLocaleDateString()}</p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-slate-300" />
                    </div>
                  )) : (
                    <p className="text-sm text-slate-400 text-center py-4 italic">No upcoming exams scheduled</p>
                  )}
                </div>
              </Card>

              {/* Class Performance Snapshot */}
              <Card className="border-0 bg-white shadow-xl shadow-slate-200/40 p-6 rounded-[2rem]">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Class Snapshot
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <span>Daily Attendance</span>
                      <span className="text-indigo-600">88%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '88%' }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <span>Curriculum Progress</span>
                      <span className="text-emerald-600">62%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '62%' }} />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <p className="text-xs font-semibold normal-case tracking-[0.2em] text-slate-500">Assigned Classes</p>
            <p className="mt-3 text-3xl font-bold text-cyan-700">{state.data.classes.length}</p>
          </Card>
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <p className="text-xs font-semibold normal-case tracking-[0.2em] text-slate-500">Students</p>
            <p className="mt-3 text-3xl font-bold text-emerald-700">{assignedStudents}</p>
          </Card>
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <p className="text-xs font-semibold normal-case tracking-[0.2em] text-slate-500">Subjects</p>
            <p className="mt-3 text-3xl font-bold text-indigo-700">{state.data.subjects.length}</p>
          </Card>
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <p className="text-xs font-semibold normal-case tracking-[0.2em] text-slate-500">Quick Tasks</p>
            <p className="mt-3 text-3xl font-bold text-amber-700">4</p>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card>
            <h2 className="text-xl font-bold text-slate-900">Quick actions</h2>
            <p className="text-sm text-slate-500">Jump directly to the daily teaching workflows.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["Live Class", "/teacher/live-class", "videocam"],
                ["Live Exam", "/teacher/live-exam", "live_tv"],
                ["Mark Attendance", "/teacher/attendance/create", "fact_check"],
                ["Create Homework", "/teacher/homework/create", "assignment"],
                ["Schedule Exam", "/teacher/exams/create", "quiz"],
                ["Enter Results", "/teacher/results/create", "leaderboard"],
                ["My Classes", "/teacher/classes", "groups"],
                ["Timetable", "/teacher/timetable", "schedule"]
              ].map(([label, href, icon]) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{label}</p>
                    <p className="text-xs text-slate-500">Open {label.toLowerCase()}</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 transition-transform group-hover:translate-x-1">{icon}</span>
                </Link>
              ))}
            </div>
          </Card>

          {/* Announcements */}
          <Card className="border-0 bg-white shadow-xl shadow-slate-200/40 p-6 rounded-[2rem]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-500" />
                Notices
              </h3>
            </div>
            <div className="space-y-4">
              {announcements.length > 0 ? announcements.map((a) => (
                <div key={a.id} className="group cursor-pointer">
                  <p className="text-xs font-bold text-indigo-600 mb-1">{new Date(a.date).toLocaleDateString()}</p>
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{a.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{a.message}</p>
                </div>
              )) : (
                <p className="text-sm text-slate-400 italic">No new announcements</p>
              )}
            </div>
          </Card>
      </div>
    </div>
      </div >
    </SchoolShell >
  );
}

function StatCard({ label, value, icon, color, bgColor, showWarning }: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  showWarning?: boolean;
}) {
  return (
    <Card className={`border border-white/60 bg-white/70 backdrop-blur-md shadow-lg shadow-slate-200/20 p-4 rounded-[1.5rem] flex flex-col justify-between group transition-all hover:-translate-y-1 hover:shadow-xl hover:bg-white/90`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${bgColor} ${color} shadow-sm group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        {showWarning && (
          <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
        )}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 truncate">{label}</p>
        <p className={`text-2xl font-black mt-1 tracking-tight ${color}`}>{value}</p>
      </div>
    </Card>
  );
}
