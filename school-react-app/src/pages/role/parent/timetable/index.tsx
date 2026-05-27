import { useMemo, useState, useEffect } from "react";
import { SchoolShell } from "@/layouts/SchoolShell";
import { DataState, Skeleton, StatCardCompact } from "@/components/ui";
import { useTimetable } from "@/modules/timetable/hooks/useTimetable";
import type { TimetableRecord } from "@/modules/timetable/types/timetable.types";
import { useSelectedChild } from "@/contexts/SelectedChildContext";
import { AppIcon } from "shared/ui/AppIcon";
import { motion, AnimatePresence } from "framer-motion";

// Day helpers
const DAYS = [
  { iso: 1, key: "mon", label: "Monday", short: "Mon" },
  { iso: 2, key: "tue", label: "Tuesday", short: "Tue" },
  { iso: 3, key: "wed", label: "Wednesday", short: "Wed" },
  { iso: 4, key: "thu", label: "Thursday", short: "Thu" },
  { iso: 5, key: "fri", label: "Friday", short: "Fri" },
  { iso: 6, key: "sat", label: "Saturday", short: "Sat" },
  { iso: 7, key: "sun", label: "Sunday", short: "Sun" },
] as const;

type DayIso = (typeof DAYS)[number]["iso"];

function todayIso(): DayIso {
  const js = new Date().getDay();
  return (js === 0 ? 7 : js) as DayIso;
}

export function ParentTimetablePage() {
  const { selectedChild, loading: childLoading } = useSelectedChild();
  
  const filters = useMemo(() => {
    return selectedChild?.class_id ? { class_id: selectedChild.class_id } : undefined;
  }, [selectedChild]);

  const { state } = useTimetable(filters);
  const [viewMode, setViewMode] = useState<"today" | "week">("today");
  const [selectedWeekDay, setSelectedWeekDay] = useState<DayIso>(todayIso());
  const [time, setTime] = useState(() => new Date());

  // Clock to trigger live highlights
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 15 * 1000);
    return () => clearInterval(id);
  }, []);

  const records = useMemo<TimetableRecord[]>(() => {
    if (state.status === "success" && Array.isArray(state.data)) {
      return state.data as TimetableRecord[];
    }
    return [];
  }, [state]);

  const currentStr = useMemo(() => {
    return time.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
  }, [time]);

  // Check if class is currently running
  const activePeriod = useMemo(() => {
    const today = todayIso();
    const todayPeriods = records.filter((r) => Number(r.day_of_week) === today);
    return todayPeriods.find((r) => {
      const start = r.start_time;
      const end = r.end_time;
      return currentStr >= start && currentStr <= end;
    }) || null;
  }, [records, currentStr]);

  // Check what class is next
  const nextPeriod = useMemo(() => {
    const today = todayIso();
    const todayPeriods = records.filter((r) => Number(r.day_of_week) === today);
    const sorted = [...todayPeriods].sort((a, b) => a.start_time.localeCompare(b.start_time));
    return sorted.find((r) => r.start_time > currentStr) || null;
  }, [records, currentStr]);

  // Compute timetable statistics
  const stats = useMemo(() => {
    const today = todayIso();
    const subjects = new Set<string>();
    const days = new Set<number>();
    let todayCount = 0;
    
    records.forEach((rec) => {
      const day = Number(rec.day_of_week);
      if (Number.isFinite(day)) days.add(day);
      if (day === today) todayCount += 1;
      subjects.add(rec.subject_name || "—");
    });
    
    return {
      total: records.length,
      subjects: subjects.size,
      todayCount,
      activeDays: days.size,
    };
  }, [records]);

  // List of active classes for the currently selected weekday (Week view tab)
  const selectedDayRecords = useMemo(() => {
    return records
      .filter((rec) => Number(rec.day_of_week) === selectedWeekDay)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  }, [records, selectedWeekDay]);

  // List of active classes for today
  const todayRecords = useMemo(() => {
    const today = todayIso();
    return records
      .filter((rec) => Number(rec.day_of_week) === today)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  }, [records]);

  // Subject Colors Theme helper
  function getSubjectColor(subjectName: string) {
    const name = (subjectName || "").toLowerCase();
    if (name.includes("math") || name.includes("algebra") || name.includes("calc")) {
      return {
        bg: "bg-indigo-50 border-indigo-100",
        text: "text-indigo-700",
        badge: "bg-indigo-100 text-indigo-800",
        border: "border-indigo-200",
        glow: "shadow-indigo-500/10",
      };
    }
    if (name.includes("science") || name.includes("phys") || name.includes("chem") || name.includes("bio")) {
      return {
        bg: "bg-emerald-50 border-emerald-100",
        text: "text-emerald-700",
        badge: "bg-emerald-100 text-emerald-800",
        border: "border-emerald-200",
        glow: "shadow-emerald-500/10",
      };
    }
    if (name.includes("history") || name.includes("social") || name.includes("geo")) {
      return {
        bg: "bg-amber-50 border-amber-100",
        text: "text-amber-700",
        badge: "bg-amber-100 text-amber-800",
        border: "border-amber-200",
        glow: "shadow-amber-500/10",
      };
    }
    if (name.includes("english") || name.includes("lit") || name.includes("lang")) {
      return {
        bg: "bg-sky-50 border-sky-100",
        text: "text-sky-700",
        badge: "bg-sky-100 text-sky-800",
        border: "border-sky-200",
        glow: "shadow-sky-500/10",
      };
    }
    if (name.includes("art") || name.includes("music") || name.includes("design")) {
      return {
        bg: "bg-rose-50 border-rose-100",
        text: "text-rose-700",
        badge: "bg-rose-100 text-rose-800",
        border: "border-rose-200",
        glow: "shadow-rose-500/10",
      };
    }
    return {
      bg: "bg-slate-50 border-slate-200/60",
      text: "text-slate-700",
      badge: "bg-slate-100 text-slate-800",
      border: "border-slate-200",
      glow: "shadow-slate-500/5",
    };
  }

  if (childLoading || state.status === "loading") {
    return (
      <SchoolShell eyebrow="Guardian Portal" title="Timetable & Periods">
        <div className="space-y-4">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </SchoolShell>
    );
  }

  if (!selectedChild) {
    return (
      <SchoolShell eyebrow="Guardian Portal" title="Timetable & Periods">
        <DataState
          variant="empty"
          title="No child selected"
          message="Pick a child from the header to view their academic schedule."
        />
      </SchoolShell>
    );
  }

  if (state.status === "error") {
    return (
      <SchoolShell eyebrow="Guardian Portal" title="Timetable & Periods">
        <DataState
          variant="error"
          title="Schedule sync error"
          message={state.error}
        />
      </SchoolShell>
    );
  }

  if (records.length === 0) {
    return (
      <SchoolShell eyebrow="Guardian Portal" title="Timetable & Periods">
        <DataState
          variant="empty"
          title="No Timetable Published"
          message="The school administrator has not published a weekly schedule for this child's class yet."
        />
      </SchoolShell>
    );
  }

  const isWeekend = todayIso() === 7 || todayIso() === 6; // Sunday or Saturday

  return (
    <SchoolShell eyebrow="Guardian Portal" title="Timetable & Periods">
      <div className="space-y-6 pb-12">
        
        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCardCompact
            label="Total Periods"
            value={stats.total}
            icon="event_note"
            accent="blue"
            hint="Across the week"
          />
          <StatCardCompact
            label="Subjects"
            value={stats.subjects}
            icon="menu_book"
            accent="purple"
            hint="Unique subjects"
          />
          <StatCardCompact
            label="Today"
            value={stats.todayCount}
            icon="today"
            accent="emerald"
            hint="Periods scheduled"
          />
          <StatCardCompact
            label="Active Days"
            value={stats.activeDays}
            icon="calendar_today"
            accent="amber"
            hint="Days with classes"
          />
        </div>

        {/* View Mode Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <AppIcon name="Clock" size={18} />
            </div>
            <div>
              <h3 className="text-[13px] font-bold text-slate-800">
                Class Schedule for {selectedChild.student_name}
              </h3>
              <p className="text-[10px] font-semibold text-slate-400">Class {selectedChild.class_name}</p>
            </div>
          </div>

          {/* Toggle Pills */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg shrink-0">
            <button
              onClick={() => setViewMode("today")}
              className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                viewMode === "today"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Today's Focus
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                viewMode === "week"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Full Week Grid
            </button>
          </div>
        </div>

        {/* TIMETABLE CONTENT */}
        <AnimatePresence mode="wait">
          {viewMode === "today" ? (
            
            // TODAY FOCUS MODE
            <motion.div
              key="today-focus"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start"
            >
              
              {/* Left Column: Today Periods List */}
              <div className="space-y-4">
                
                {/* Active Period / Next Class preview widget */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Current Active Class */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] relative overflow-hidden">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Currently Happening</p>
                    {activePeriod ? (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                          </span>
                          <h4 className="text-[14px] font-black text-slate-800 truncate">{activePeriod.subject_name}</h4>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-500">Room: {activePeriod.room || "Lab 2"}</p>
                        <p className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded px-2 py-0.5 inline-block">
                          {activePeriod.start_time} - {activePeriod.end_time}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 flex flex-col justify-center text-slate-400 h-20 text-center border border-dashed border-slate-200 rounded-xl">
                        <AppIcon name="Coffee" size={24} className="mx-auto text-slate-300 mb-1" />
                        <p className="text-[11px] font-bold">No Active Class</p>
                        <p className="text-[9px] font-medium mt-0.5">Currently a break or free period</p>
                      </div>
                    )}
                  </div>

                  {/* Next Class Preview */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] relative overflow-hidden">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Up Next</p>
                    {nextPeriod ? (
                      <div className="mt-3 space-y-2">
                        <h4 className="text-[14px] font-black text-slate-800 truncate">{nextPeriod.subject_name}</h4>
                        <p className="text-[11px] font-semibold text-slate-500">Instructor: {nextPeriod.teacher_name || "Teacher"}</p>
                        <p className="text-[10px] font-bold text-slate-600 bg-slate-100 rounded px-2 py-0.5 inline-block">
                          Starts at {nextPeriod.start_time}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 flex flex-col justify-center text-slate-400 h-20 text-center border border-dashed border-slate-200 rounded-xl">
                        <AppIcon name="CheckCircle" size={24} className="mx-auto text-slate-300 mb-1" />
                        <p className="text-[11px] font-bold">All Classes Completed</p>
                        <p className="text-[9px] font-medium mt-0.5">Nothing scheduled for today</p>
                      </div>
                    )}
                  </div>

                </div>

                {/* Vertical periods checklist */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
                  <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-wider">Daily Schedule Timeline</h4>
                  
                  {isWeekend ? (
                    <div className="py-12 text-center flex flex-col items-center justify-center text-slate-400">
                      <AppIcon name="Smile" size={40} className="text-slate-300 mb-3" />
                      <p className="text-[13px] font-bold text-slate-700">Weekend Relaxation</p>
                      <p className="text-[10px] font-medium text-slate-400 mt-1 max-w-xs">
                        No periods scheduled for Saturday or Sunday. Enjoy the break!
                      </p>
                    </div>
                  ) : todayRecords.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs">No periods scheduled for today.</div>
                  ) : (
                    <div className="space-y-4 relative pl-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                      {todayRecords.map((rec) => {
                        const isActive = activePeriod?._id === rec._id;
                        const isPast = rec.end_time < currentStr;
                        const theme = getSubjectColor(rec.subject_name);
                        
                        return (
                          <div
                            key={rec._id}
                            className={`relative p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-300 ${
                              isActive
                                ? `bg-white ${theme.border} ring-2 ring-indigo-500/20 shadow-md ${theme.glow} -translate-x-1`
                                : isPast
                                  ? "bg-slate-50 border-slate-200/60 opacity-60"
                                  : "bg-white border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:border-slate-300"
                            }`}
                          >
                            {/* Dot indicator */}
                            <div className={`absolute left-[-17px] top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full border-2 bg-white z-10 flex items-center justify-center ${
                              isActive
                                ? "border-indigo-600"
                                : isPast
                                  ? "border-slate-300 bg-slate-200"
                                  : "border-slate-300"
                            }`}>
                              {isActive && <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-ping" />}
                            </div>

                            {/* Details */}
                            <div className="flex items-center gap-3">
                              <div className={`h-10 w-10 rounded-lg flex flex-col items-center justify-center font-bold shrink-0 text-center ${
                                isActive ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/25" : "bg-slate-100 text-slate-500"
                              }`}>
                                <span className="text-[9px] leading-none uppercase">Per</span>
                                <span className="text-sm font-black leading-none mt-0.5">{rec.period_number}</span>
                              </div>

                              <div>
                                <h4 className="text-[13px] font-black text-slate-800">{rec.subject_name}</h4>
                                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                                  {rec.teacher_name || "Instructor"} • Room {rec.room || "—"}
                                </p>
                              </div>
                            </div>

                            {/* Time badge */}
                            <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                              <AppIcon name="Clock" size={13} className="text-slate-400" />
                              <span className={`text-[11px] font-bold ${isActive ? "text-indigo-600" : "text-slate-500"}`}>
                                {rec.start_time} - {rec.end_time}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>

              </div>

              {/* Right Column: Weekly Breakdown Overview */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
                <div>
                  <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-tight">Today's Quick Insights</h4>
                  <p className="text-[10px] font-medium text-slate-400 mt-0.5">Useful metrics about today's schedule</p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">First Period Starts:</span>
                    <span className="text-[11px] font-black text-slate-700">
                      {todayRecords[0]?.start_time || "—"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">Last Period Ends:</span>
                    <span className="text-[11px] font-black text-slate-700">
                      {todayRecords[todayRecords.length - 1]?.end_time || "—"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">Weekly Active Days:</span>
                    <span className="text-[11px] font-black text-slate-700">{stats.activeDays} days</span>
                  </div>
                </div>

                {/* Visual Guidelines */}
                <div className="pt-4 border-t border-slate-100 text-[10px] font-semibold text-slate-500 space-y-2">
                  <p className="uppercase tracking-wider font-bold">Legend:</p>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Active Class Period
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded bg-slate-200" /> Completed Period
                  </div>
                </div>
              </div>

            </motion.div>
          ) : (
            
            // WEEK GRID VIEW
            <motion.div
              key="week-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Day filter pills */}
              <div className="flex flex-wrap items-center gap-2 px-1">
                {DAYS.map((d) => {
                  const count = records.filter(
                    (r) => Number(r.day_of_week) === d.iso
                  ).length;
                  const isToday = d.iso === todayIso();
                  const isSelected = selectedWeekDay === d.iso;
                  return (
                    <button
                      key={d.iso}
                      type="button"
                      onClick={() => setSelectedWeekDay(d.iso)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-bold transition-all border ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/15"
                          : "bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:text-indigo-600 shadow-sm"
                      }`}
                    >
                      {isToday && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isSelected ? "bg-white/70" : "bg-emerald-400"} opacity-75`} />
                          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isSelected ? "bg-white" : "bg-emerald-500"}`} />
                        </span>
                      )}
                      {d.label}
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                        isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Day records rendering */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                {selectedDayRecords.length === 0 ? (
                  <div className="py-16 text-center flex flex-col items-center justify-center text-slate-400">
                    <AppIcon name="Coffee" size={40} className="text-slate-200 mb-3" />
                    <p className="text-[13px] font-bold text-slate-700">No periods scheduled for this day</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-1">
                      Pick another day from the filter tabs above.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedDayRecords.map((rec) => {
                      const isActive = activePeriod?._id === rec._id;
                      const theme = getSubjectColor(rec.subject_name);
                      
                      return (
                        <div
                          key={rec._id}
                          className={`p-4 rounded-xl border flex gap-3 transition-all duration-200 ${
                            isActive
                              ? "bg-white ring-2 ring-indigo-500/25 border-indigo-400 shadow-md"
                              : "bg-white border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:border-slate-300"
                          }`}
                        >
                          <div className={`h-10 w-10 rounded-lg flex flex-col items-center justify-center shrink-0 ${
                            isActive ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                          }`}>
                            <span className="text-[8px] uppercase font-bold leading-none">Per</span>
                            <span className="text-sm font-black leading-none mt-0.5">{rec.period_number}</span>
                          </div>

                          <div className="min-w-0 flex-1 space-y-1">
                            <h4 className="text-[12px] font-black text-slate-800 truncate">{rec.subject_name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 truncate">
                              Room {rec.room || "—"} • {rec.teacher_name || "Instructor"}
                            </p>
                            <p className={`text-[10px] font-bold mt-1 inline-block ${isActive ? "text-indigo-600" : "text-slate-500"}`}>
                              {rec.start_time} - {rec.end_time}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </SchoolShell>
  );
}
