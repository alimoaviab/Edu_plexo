import { AppIcon } from "shared/ui/AppIcon";
import { Link } from "react-router-dom";
import { SchoolShell } from "@/layouts/SchoolShell";
import { LiveClassList } from "@/components/live-classes/LiveClassList";

export function StudentLiveClassPage() {
  return (
    <SchoolShell title="Live Classes" eyebrow="Virtual Classroom">
      <div className="space-y-5 pb-10">

        {/* Hero Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-6 md:p-8 text-white shadow-xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest text-blue-100/90">Online Learning</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Live Classes</h1>
            <p className="mt-2 text-sm text-blue-100 max-w-lg">
              Join your scheduled online sessions and participate in interactive learning. Only classes for your enrolled section are shown.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          {/* Sessions List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Your Schedule</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">Upcoming and live sessions for you to join</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500">Live updates</span>
              </div>
            </div>
            <div className="p-5">
              <LiveClassList role="STUDENT" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Links */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-900">Quick Links</h3>
              </div>
              <div className="p-3 space-y-2">
                <Link
                  to="/student/timetable"
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                >
                  <div className="h-9 w-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                    <AppIcon name="Calendar" size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900">Weekly Timetable</p>
                    <p className="text-[10px] text-slate-400">View your full schedule</p>
                  </div>
                </Link>
                <Link
                  to="/student/attendance"
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all group"
                >
                  <div className="h-9 w-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                    <AppIcon name="UserCheck" size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900">My Attendance</p>
                    <p className="text-[10px] text-slate-400">Check attendance records</p>
                  </div>
                </Link>
                <Link
                  to="/student/homework"
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/50 transition-all group"
                >
                  <div className="h-9 w-9 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 group-hover:bg-violet-100 transition-colors">
                    <AppIcon name="FileText" size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900">Homework</p>
                    <p className="text-[10px] text-slate-400">View pending assignments</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Important Note */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-7 w-7 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center">
                  <AppIcon name="AlertTriangle" size={14} className="text-amber-600" />
                </div>
                <h3 className="text-xs font-bold text-amber-900">Important</h3>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                  Join within <span className="font-bold">5 minutes</span> of the start time. Your attendance is tracked automatically when you click "Join Session".
                </p>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Make sure your camera and microphone are ready before joining.
                </p>
              </div>
            </div>

            {/* Session Tips */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-900 mb-3">Session Tips</h3>
              <div className="space-y-2.5">
                {[
                  { icon: "Wifi", text: "Use a stable internet connection" },
                  { icon: "Headphones", text: "Use headphones for better audio" },
                  { icon: "Monitor", text: "Close unnecessary browser tabs" },
                  { icon: "MessageSquare", text: "Use chat for questions during class" },
                ].map((tip, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="h-6 w-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <AppIcon name={tip.icon} size={12} className="text-slate-500" />
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">{tip.text}</p>
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
