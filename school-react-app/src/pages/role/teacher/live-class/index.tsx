import { AppIcon } from "shared/ui/AppIcon";
import { Link, useNavigate } from "react-router-dom";
import { SchoolShell } from "@/layouts/SchoolShell";
import { LiveClassList } from "@/components/live-classes/LiveClassList";
import { useState, useEffect } from "react";

export function TeacherLiveClassPage() {
  const navigate = useNavigate();
  const [listKey, setListKey] = useState(0);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      navigate("/auth/login");
      return;
    }
    setAuthChecked(true);
  }, [navigate]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <SchoolShell title="Live Classes" eyebrow="Virtual Classroom">
      <div className="space-y-5 pb-10">

        {/* Hero Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-6 md:p-8 text-white shadow-xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest text-emerald-300/90">Live Teaching Portal</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Manage Live Sessions</h1>
              <p className="mt-2 text-sm text-slate-300 max-w-lg">
                Schedule, launch, and monitor your virtual classroom sessions. Students join with one click from their portal.
              </p>
            </div>
            <button
              onClick={() => navigate("/teacher/live-class/create")}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-lg hover:bg-blue-50 transition-all active:scale-95 self-start md:self-center"
            >
              <AppIcon name="Plus" size={16} />
              Schedule New Class
            </button>
          </div>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Scheduled", value: "—", icon: "calendar_month", color: "text-blue-600 bg-blue-50 border-blue-100" },
            { label: "Live Now", value: "—", icon: "sensors", color: "text-red-600 bg-red-50 border-red-100" },
            { label: "Completed", value: "—", icon: "task_alt", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
            { label: "Total Hours", value: "—", icon: "schedule", color: "text-violet-600 bg-violet-50 border-violet-100" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className={`h-9 w-9 rounded-lg border flex items-center justify-center ${stat.color}`}>
                  <AppIcon name={stat.icon} size={18} />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 tracking-wider">{stat.label}</p>
                  <p className="text-lg font-bold text-slate-900 leading-tight">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Main Content */}
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          {/* Sessions Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Session Timeline</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">Your scheduled and completed live sessions</p>
              </div>
              <button
                onClick={() => setListKey(prev => prev + 1)}
                className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-colors"
              >
                <AppIcon name="RefreshCcw" size={14} />
              </button>
            </div>
            <div className="p-5">
              <LiveClassList key={listKey} role="TEACHER" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-900">Quick Actions</h3>
              </div>
              <div className="p-3 space-y-2">
                <button
                  onClick={() => navigate("/teacher/live-class/create")}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                >
                  <div className="h-9 w-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                    <AppIcon name="Plus" size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900">Create Live Class</p>
                    <p className="text-[10px] text-slate-400">Schedule a new session</p>
                  </div>
                </button>
                <Link
                  to="/teacher/timetable"
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all group"
                >
                  <div className="h-9 w-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                    <AppIcon name="Calendar" size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900">View Timetable</p>
                    <p className="text-[10px] text-slate-400">Check your weekly schedule</p>
                  </div>
                </Link>
                <Link
                  to="/teacher/classes"
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/50 transition-all group"
                >
                  <div className="h-9 w-9 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 group-hover:bg-violet-100 transition-colors">
                    <AppIcon name="BookOpen" size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900">My Classes</p>
                    <p className="text-[10px] text-slate-400">View assigned classes</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <AppIcon name="Lightbulb" size={16} className="text-blue-600" />
                <h3 className="text-xs font-bold text-blue-900">How it works</h3>
              </div>
              <div className="space-y-2.5">
                {[
                  "Schedule a session with class, subject & time",
                  "A unique meeting link is auto-generated",
                  "Students see it in their portal and join with one click",
                  "Attendance is tracked automatically on join",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-[11px] text-blue-800 font-medium leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SchoolShell>
  );
}
