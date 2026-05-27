import { AppIcon } from "shared/ui/AppIcon";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { StatCardCompact } from "@/components/ui";
import { SchoolShell } from "@/layouts/SchoolShell";
import { useSelectedChild } from "@/contexts/SelectedChildContext";
import { serviceRequest } from "@/services/service-client";
import { showToast } from "@/utils/toast";

interface LiveClassItem {
  _id: string;
  title: string;
  subject: string;
  description?: string;
  teacher_name: string;
  class_name: string;
  starts_at: string;
  ends_at: string;
  join_url: string;
  provider: string;
  status: "live" | "upcoming" | "ended";
}

type StatusFilter = "all" | "live" | "upcoming" | "ended";

const getSubjectStyles = (subject: string) => {
  const sub = (subject || "").toLowerCase();
  if (sub.includes("math") || sub.includes("algebra") || sub.includes("calc")) {
    return { bg: "bg-blue-50/70 text-blue-600 border-blue-100", accent: "text-blue-500" };
  }
  if (sub.includes("science") || sub.includes("physic") || sub.includes("chem") || sub.includes("bio")) {
    return { bg: "bg-emerald-50/70 text-emerald-600 border-emerald-100", accent: "text-emerald-500" };
  }
  if (sub.includes("english") || sub.includes("literature") || sub.includes("lang")) {
    return { bg: "bg-indigo-50/70 text-indigo-600 border-indigo-100", accent: "text-indigo-500" };
  }
  if (sub.includes("history") || sub.includes("social") || sub.includes("civic")) {
    return { bg: "bg-amber-50/70 text-amber-700 border-amber-100", accent: "text-amber-600" };
  }
  if (sub.includes("computer") || sub.includes("coding") || sub.includes("prog")) {
    return { bg: "bg-purple-50/70 text-purple-600 border-purple-100", accent: "text-purple-500" };
  }
  return { bg: "bg-slate-50/70 text-slate-600 border-slate-100", accent: "text-slate-500" };
};

export function ParentLiveClassesPage() {
  const { selectedChild } = useSelectedChild();
  const studentId = selectedChild?.student_id || "";

  const {
    data: meetings = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery<LiveClassItem[]>({
    queryKey: ["parent-live-classes", studentId],
    queryFn: async () => {
      const params = studentId ? `?student_id=${studentId}` : "";
      const res = await serviceRequest<LiveClassItem[]>(
        `/api/parent/live-classes${params}`,
      );
      if (!res.ok) throw new Error(res.error?.message || "Failed to load");
      return res.data ?? [];
    },
    staleTime: 60 * 1000,
    refetchInterval: 30 * 1000, // Speed up refresh interval for better responsiveness
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const liveMeetings = meetings.filter((m) => m.status === "live");
  const upcomingMeetings = meetings.filter((m) => m.status === "upcoming");
  const endedMeetings = meetings.filter((m) => m.status === "ended");

  const todayMeetings = useMemo(() => {
    const today = new Date();
    return meetings.filter((m) => {
      const d = new Date(m.starts_at);
      return (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate()
      );
    });
  }, [meetings]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return meetings
      .filter((m) =>
        statusFilter === "all" ? true : m.status === statusFilter,
      )
      .filter((m) => {
        if (!q) return true;
        return (
          m.title.toLowerCase().includes(q) ||
          (m.subject || "").toLowerCase().includes(q) ||
          (m.teacher_name || "").toLowerCase().includes(q)
        );
      })
      .sort(
        (a, b) =>
          new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
      );
  }, [meetings, search, statusFilter]);

  const hasLiveNow = liveMeetings.length > 0;

  return (
    <SchoolShell title="Live Classes" eyebrow="Academic">
      {/* Hero Strip */}
      <div className="mb-6 p-5 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden relative">
        <div className="relative z-10 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-[9px] font-black text-blue-600 uppercase tracking-wider border border-blue-100">
              Live Sessions
            </span>
            {selectedChild && (
              <span className="text-[10px] font-black text-slate-400 uppercase">
                Viewing: {selectedChild.student_name}
              </span>
            )}
            {hasLiveNow && (
              <span className="px-2.5 py-0.5 rounded-lg bg-rose-50 text-[9px] font-black text-rose-600 uppercase tracking-wider border border-rose-100 inline-flex items-center gap-1.5 animate-pulse">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500" />
                </span>
                {liveMeetings.length} live now
              </span>
            )}
          </div>

          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Online Classroom Schedule
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5">
            {selectedChild && (
              <div className="flex items-center gap-1.5 text-slate-500">
                <AppIcon name="GraduationCap" size={14} />
                <span className="text-[11px] font-bold">
                  {selectedChild.class_name}
                  {selectedChild.class_section ? ` - ${selectedChild.class_section}` : ""}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-slate-500">
              <AppIcon name="Calendar" size={14} />
              <span className="text-[11px] font-bold">
                {new Date().toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <AppIcon name="RefreshCw" size={14} />
              <span className="text-[11px] font-bold">Autorefreshes dynamically</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="shrink-0 inline-flex items-center gap-1.5 px-4 h-9 rounded-xl border border-slate-200 text-slate-600 text-[11px] font-bold hover:bg-slate-50 transition-all"
        >
          <AppIcon name="RefreshCw" size={14} className={isFetching ? "animate-spin text-blue-600" : ""} />
          Refresh Feed
        </button>

        <AppIcon name="Video" size={120} className="absolute right-[-10px] bottom-[-20px] text-slate-50 opacity-40 select-none pointer-events-none" />
      </div>

      {/* KPI Tiles */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCardCompact
          label="Live Now"
          value={liveMeetings.length}
          icon="videocam"
          accent="rose"
          hint={hasLiveNow ? "Active now" : "No active sessions"}
        />
        <StatCardCompact
          label="Today"
          value={todayMeetings.length}
          icon="today"
          accent="blue"
          hint="Scheduled today"
        />
        <StatCardCompact
          label="Upcoming"
          value={upcomingMeetings.length}
          icon="event"
          accent="purple"
          hint="Future sessions"
        />
        <StatCardCompact
          label="Completed"
          value={endedMeetings.length}
          icon="task_alt"
          accent="emerald"
          hint="Archived recordings"
        />
      </div>

      {/* Live Now Banner */}
      {hasLiveNow && (
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-rose-50 via-rose-50/50 to-white border border-rose-100 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-r from-transparent to-rose-100/10 pointer-events-none" />
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="h-11 w-11 rounded-2xl bg-rose-100/80 border border-rose-200/50 flex items-center justify-center text-rose-600 shrink-0">
              <AppIcon name="Video" size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest">
                  Live now
                </span>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500" />
                </span>
              </div>
              <p className="text-[14px] font-black text-slate-900 truncate">
                {liveMeetings[0].title}
              </p>
              <p className="text-[11px] font-bold text-slate-500 truncate mt-0.5">
                {liveMeetings[0].subject ? `${liveMeetings[0].subject} • ` : ""}
                Hosted by: {liveMeetings[0].teacher_name}
              </p>
            </div>
          </div>
          {liveMeetings[0].join_url && (
            <a
              href={liveMeetings[0].join_url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider hover:bg-rose-700 transition-colors shadow-sm"
            >
              <AppIcon name="PhoneCall" size={15} />
              Join Lecture
            </a>
          )}
        </div>
      )}

      {/* Filter and search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <AppIcon name="Search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search classes by title, subject or teacher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 h-10 rounded-xl bg-slate-50 border border-slate-200 text-[12px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="relative sm:w-48 shrink-0">
          <AppIcon name="SlidersHorizontal" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="w-full pl-10 pr-9 h-10 rounded-xl bg-slate-50 border border-slate-200 text-[12px] font-bold text-slate-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          >
            <option value="all">All Sessions</option>
            <option value="live">Live Now</option>
            <option value="upcoming">Upcoming</option>
            <option value="ended">Completed</option>
          </select>
          <AppIcon name="ChevronDown" size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Listings */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : meetings.length === 0 ? (
        <EmptyState />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
            <AppIcon name="SearchX" size={22} className="text-slate-300" />
          </div>
          <p className="text-[12px] font-black text-slate-700">No matching sessions</p>
          <p className="text-[11px] text-slate-500 mt-1 max-w-sm">
            Try adjusting your search criteria or filter category.
          </p>
        </div>
      ) : (
        <Timeline meetings={filtered} />
      )}
    </SchoolShell>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Timeline
// ────────────────────────────────────────────────────────────────────────

function Timeline({ meetings }: { meetings: LiveClassItem[] }) {
  return (
    <div className="relative">
      <div className="absolute left-[24px] top-6 bottom-6 w-px bg-slate-200 hidden md:block" />
      <div className="space-y-4 relative z-10">
        {meetings.map((m) => (
          <div key={m._id} className="relative flex items-stretch gap-4">
            {/* Timeline node dot */}
            <div className="hidden md:flex mt-6 h-12 w-12 shrink-0 items-center justify-center">
              <div
                className={`h-3.5 w-3.5 rounded-full border-2 ring-4 ring-slate-50 ${
                  m.status === "live"
                    ? "bg-rose-500 border-rose-500 animate-pulse"
                    : m.status === "upcoming"
                      ? "bg-white border-blue-500"
                      : "bg-white border-emerald-500"
                }`}
              />
            </div>
            <MeetingCard meeting={m} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Countdown timer component (live ticking!)
// ────────────────────────────────────────────────────────────────────────

function CountdownTimer({ startsAt }: { startsAt: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const target = new Date(startsAt).getTime();
    
    function update() {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft("Starting now");
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      const hStr = hours > 0 ? `${hours}h ` : "";
      setTimeLeft(`Starts in: ${hStr}${minutes}m ${seconds}s`);
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startsAt]);

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase">
      <AppIcon name="Clock" size={11} className="animate-pulse" />
      {timeLeft}
    </span>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Meeting card
// ────────────────────────────────────────────────────────────────────────

function MeetingCard({ meeting }: { meeting: LiveClassItem }) {
  const startTime = new Date(meeting.starts_at);
  const endTime = new Date(meeting.ends_at);
  const subjectColors = getSubjectStyles(meeting.subject);

  const statusBadgeColor = {
    live: "bg-rose-50 text-rose-600 border-rose-100",
    upcoming: "bg-purple-50 text-purple-600 border-purple-100",
    ended: "bg-slate-100 text-slate-500 border-slate-200",
  }[meeting.status];

  // Calendar sync link
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    meeting.title
  )}&dates=${new Date(meeting.starts_at)
    .toISOString()
    .replace(/-|:|\.\d\d\d/g, "")}/${new Date(meeting.ends_at)
    .toISOString()
    .replace(/-|:|\.\d\d\d/g, "")}&details=${encodeURIComponent(
    meeting.description || ""
  )}&location=${encodeURIComponent(meeting.join_url || "Online")}`;

  return (
    <div className="flex-1 premium-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl hover:shadow-[0_4px_18px_rgb(0,0,0,0.04)] transition-all">
      <div className="flex items-start md:items-center gap-3.5 min-w-0 flex-1">
        {/* Subject colored icon wrapper */}
        <div
          className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 border ${subjectColors.bg}`}
        >
          <AppIcon name="Video" size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-black text-slate-900 truncate">
              {meeting.title}
            </h3>
            <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-wider ${statusBadgeColor}`}>
              {meeting.status}
            </span>
            {meeting.status === "upcoming" && (
              <CountdownTimer startsAt={meeting.starts_at} />
            )}
            {meeting.status === "ended" && (
              <span className="px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-black uppercase tracking-wider inline-flex items-center gap-0.5">
                <AppIcon name="PlayCircle" size={11} />
                Recording Ready
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
            {meeting.subject && (
              <span className={`font-black ${subjectColors.accent}`}>{meeting.subject}</span>
            )}
            <span className="text-slate-300">•</span>
            {/* Teacher avatar circle */}
            <div className="flex items-center gap-1.5">
              <div className="h-4.5 w-4.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center text-[9px] font-black uppercase">
                {(meeting.teacher_name || "T").substring(0, 1)}
              </div>
              <span className="font-bold text-slate-600">{meeting.teacher_name}</span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="font-bold">
              {startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
              {endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>

          <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wide">
            {startTime.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })}
            {meeting.class_name ? ` • ${meeting.class_name}` : ""}
            {meeting.provider ? ` • provider: ${meeting.provider}` : ""}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t md:border-t-0 border-slate-50 pt-3 md:pt-0 shrink-0 justify-between md:justify-start">
        {/* Calendar Sync */}
        {meeting.status === "upcoming" && (
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 w-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50/20 hover:border-blue-200 transition-all"
            title="Sync to Google Calendar"
          >
            <AppIcon name="CalendarPlus" size={16} />
          </a>
        )}

        <JoinAction meeting={meeting} />
      </div>
    </div>
  );
}

function JoinAction({ meeting }: { meeting: LiveClassItem }) {
  if (meeting.status === "live" && meeting.join_url) {
    return (
      <a
        href={meeting.join_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-1.5 h-10 px-4.5 rounded-xl bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider hover:bg-rose-700 transition-colors shadow-sm"
      >
        <AppIcon name="PhoneCall" size={14} />
        Join Lecture
      </a>
    );
  }
  if (meeting.status === "upcoming") {
    return (
      <span className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-slate-50 text-slate-400 text-[11px] font-black uppercase border border-slate-100">
        <AppIcon name="Clock" size={14} />
        Waiting
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={() => showToast("Loading mock lecture recording player...", "success")}
      className="inline-flex items-center justify-center gap-1.5 h-10 px-4.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px] font-black uppercase hover:bg-emerald-100 transition-all"
    >
      <AppIcon name="PlayCircle" size={14} />
      Play Recording
    </button>
  );
}

// ────────────────────────────────────────────────────────────────────────
// States
// ────────────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center flex flex-col items-center justify-center">
      <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
        <AppIcon name="VideoOff" size={24} className="text-slate-300" />
      </div>
      <p className="text-[13px] font-black text-slate-700">No live classes scheduled</p>
      <p className="text-[11px] text-slate-500 mt-1 max-w-sm leading-relaxed">
        Live lectures for this student will appear here as soon as their teacher
        schedules a session.
      </p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="premium-card p-4 flex items-center gap-3.5 animate-pulse bg-white border border-slate-100 rounded-2xl"
        >
          <div className="h-11 w-11 bg-slate-100 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-40 bg-slate-100 rounded" />
            <div className="h-2.5 w-56 bg-slate-50 rounded" />
            <div className="h-2 w-32 bg-slate-50 rounded" />
          </div>
          <div className="h-10 w-24 bg-slate-100 rounded-xl shrink-0" />
        </div>
      ))}
    </div>
  );
}
