import { useMemo } from "react";
import { AppIcon } from "shared/ui/AppIcon";
import { SchoolShell } from "@/layouts/SchoolShell";
import { DataState, Skeleton } from "@/components/ui";
import { useSelectedChild } from "@/contexts/SelectedChildContext";
import { useParentAttendance } from "@/modules/attendance/hooks/useParentAttendance";
import { motion } from "framer-motion";

export function ParentAttendancePage() {
  const { selectedChild, loading: childLoading } = useSelectedChild();
  
  // React Query hook with automatic cache invalidation from websocket
  const { data, isLoading, error } = useParentAttendance(selectedChild?.student_id);

  // Derived counts for statuses
  const view = useMemo(() => {
    if (!data) {
      return {
        student_id: selectedChild?.student_id || "",
        student_name: selectedChild?.student_name || "",
        class_name: selectedChild?.class_name || "",
        total_present: 0,
        total_absent: 0,
        percentage: 0,
        recent_records: [],
      };
    }
    return data;
  }, [data, selectedChild]);

  // Derived metrics from recent records
  const metrics = useMemo(() => {
    let present = view.total_present;
    let absent = view.total_absent;
    let late = 0;
    let leave = 0;

    view.recent_records.forEach((r) => {
      if (r.status === "late") late++;
      else if (r.status === "leave") leave++;
    });

    const total = present + absent + late + leave;
    return { present, absent, late, leave, total };
  }, [view]);

  // Streak calculations
  const streak = useMemo(() => {
    let currentStreak = 0;
    const sorted = [...view.recent_records].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    for (let i = sorted.length - 1; i >= 0; i--) {
      const r = sorted[i];
      if (r.status === "present" || r.status === "late") {
        currentStreak++;
      } else if (r.status === "leave") {
        continue; // Leaves don't break the streak
      } else {
        break;
      }
    }
    return currentStreak;
  }, [view.recent_records]);

  // Heatmap: last 30 calendar days
  const last30Days = useMemo(() => {
    const list = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      const record = view.recent_records.find(
        (r) => r.date.split("T")[0] === dateStr
      );

      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      list.push({
        date: d,
        dateStr,
        isWeekend,
        status: record ? record.status : isWeekend ? "weekend" : "no_record",
      });
    }
    return list;
  }, [view.recent_records]);

  // Smart insights generator
  const insights = useMemo(() => {
    const list = [];

    // Streak Insight
    if (streak >= 5) {
      list.push({
        type: "success",
        title: "Perfect Streak! 🔥",
        text: `${view.student_name} has attended class for ${streak} consecutive days. Excellent commitment!`,
        icon: "Sparkles",
        color: "bg-emerald-50 text-emerald-800 border-emerald-100",
        iconColor: "text-emerald-500",
      });
    } else if (streak > 0) {
      list.push({
        type: "info",
        title: "Attendance Streak",
        text: `Active streak of ${streak} consecutive days. Keep the momentum going!`,
        icon: "TrendingUp",
        color: "bg-indigo-50 text-indigo-800 border-indigo-100",
        iconColor: "text-indigo-500",
      });
    }

    // Historical comparative drop check
    const sorted = [...view.recent_records].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    if (sorted.length >= 8) {
      const mid = Math.floor(sorted.length / 2);
      const recentHalf = sorted.slice(0, mid);
      const olderHalf = sorted.slice(mid);

      const recentPct = (recentHalf.filter(r => r.status === "present" || r.status === "late").length / recentHalf.length) * 100;
      const olderPct = (olderHalf.filter(r => r.status === "present" || r.status === "late").length / olderHalf.length) * 100;

      if (recentPct < olderPct - 5) {
        list.push({
          type: "warning",
          title: "Attendance Dropping",
          text: `Participation dipped to ${Math.round(recentPct)}% recently, down from ${Math.round(olderPct)}% earlier this month.`,
          icon: "AlertTriangle",
          color: "bg-rose-50 text-rose-800 border-rose-100",
          iconColor: "text-rose-500",
        });
      }
    }

    // Default static fallback insights
    if (list.length === 0) {
      if (view.percentage >= 90) {
        list.push({
          type: "success",
          title: "Outstanding Record",
          text: `Attendance is solid at ${view.percentage}%. Your child is fully engaged in their classes.`,
          icon: "Sparkles",
          color: "bg-emerald-50 text-emerald-800 border-emerald-100",
          iconColor: "text-emerald-500",
        });
      } else if (view.percentage >= 75) {
        list.push({
          type: "info",
          title: "Steady Performance",
          text: `Participation rates are currently at ${view.percentage}%. Let's keep it above 85%.`,
          icon: "Info",
          color: "bg-blue-50 text-blue-800 border-blue-100",
          iconColor: "text-blue-500",
        });
      } else {
        list.push({
          type: "warning",
          title: "Action Recommended",
          text: `Critical alert: Attendance is at ${view.percentage}%. Lower attendance directly impacts academic performance.`,
          icon: "AlertTriangle",
          color: "bg-amber-50 text-amber-800 border-amber-100",
          iconColor: "text-amber-500",
        });
      }
    }

    return list;
  }, [streak, view, metrics]);

  if (childLoading || (isLoading && !data)) {
    return (
      <SchoolShell eyebrow="Guardian Portal" title="Attendance Tracking">
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            <div className="space-y-6">
              <Skeleton className="h-[240px] w-full rounded-2xl" />
              <Skeleton className="h-[180px] w-full rounded-2xl" />
            </div>
            <Skeleton className="h-[460px] w-full rounded-2xl" />
          </div>
        </div>
      </SchoolShell>
    );
  }

  if (!selectedChild) {
    return (
      <SchoolShell eyebrow="Guardian Portal" title="Attendance Tracking">
        <DataState
          variant="empty"
          title="No child selected"
          message="Pick a child from the header to view their attendance."
        />
      </SchoolShell>
    );
  }

  if (error) {
    return (
      <SchoolShell eyebrow="Guardian Portal" title="Attendance Tracking">
        <DataState
          variant="error"
          title="Failed to load attendance"
          message={(error as Error)?.message || "Please try again later."}
        />
      </SchoolShell>
    );
  }

  // Calculate circular progress geometry
  const radius = 56;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (view.percentage / 100) * circumference;

  return (
    <SchoolShell eyebrow="Guardian Portal" title="Attendance Tracking">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start pb-12">
        
        {/* LEFT COLUMN: Visual Summary & Heatmap */}
        <div className="space-y-6">
          
          {/* Circular Ring and Stats Panel */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              
              {/* SVG Radial Ring */}
              <div className="relative flex items-center justify-center shrink-0">
                <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
                  {/* Trail */}
                  <circle
                    stroke="#f1f5f9"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                  />
                  {/* Progress Arc */}
                  <motion.circle
                    stroke="url(#purpleGradient)"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + " " + circumference}
                    style={{ strokeDashoffset }}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                  />
                  {/* Gradients def */}
                  <defs>
                    <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Ring Text */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-[20px] font-black text-slate-800 tracking-tighter leading-none">
                    {view.percentage}%
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Rate
                  </span>
                </div>
              </div>

              {/* Stats Numerical Breakdowns */}
              <div className="flex-1 w-full space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">Attendance Performance</h3>
                    <p className="text-[11px] font-semibold text-slate-400">Class {view.class_name}</p>
                  </div>
                  <div className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-700">
                    Active Year
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Present", value: metrics.present, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Absent", value: metrics.absent, color: "text-rose-600", bg: "bg-rose-50" },
                    { label: "Late", value: metrics.late, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Leave", value: metrics.leave, color: "text-blue-600", bg: "bg-blue-50" },
                  ].map((stat) => (
                    <div key={stat.label} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                      <p className={`text-base font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Smart Insights Panel */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dynamic Insights</h4>
            <div className="grid grid-cols-1 gap-3">
              {insights.map((insight, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex gap-3 shadow-[0_1px_4px_rgba(0,0,0,0.01)] ${insight.color}`}
                >
                  <AppIcon name={insight.icon} size={20} className={`${insight.iconColor} shrink-0 mt-0.5`} />
                  <div>
                    <h5 className="text-[12px] font-bold">{insight.title}</h5>
                    <p className="text-[11px] font-semibold opacity-90 mt-0.5 leading-relaxed">{insight.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Heatmap Matrix */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
            <div>
              <h4 className="text-[13px] font-bold text-slate-900">30-Day Attendance Matrix</h4>
              <p className="text-[10px] font-medium text-slate-400 mt-0.5">Visual representation of the last 30 calendar days</p>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5">
              {last30Days.map((day, idx) => {
                let colorClass = "bg-slate-50 border border-dashed border-slate-200 text-slate-400"; // unmarked
                let tooltip = "Unmarked";
                
                if (day.status === "present") {
                  colorClass = "bg-emerald-500 text-white shadow-sm shadow-emerald-500/10";
                  tooltip = "Present";
                } else if (day.status === "absent") {
                  colorClass = "bg-rose-500 text-white shadow-sm shadow-rose-500/10";
                  tooltip = "Absent";
                } else if (day.status === "late") {
                  colorClass = "bg-amber-500 text-white shadow-sm shadow-amber-500/10";
                  tooltip = "Late Arrival";
                } else if (day.status === "leave") {
                  colorClass = "bg-blue-500 text-white shadow-sm shadow-blue-500/10";
                  tooltip = "On Leave";
                } else if (day.status === "weekend") {
                  colorClass = "bg-slate-100 text-slate-400/80";
                  tooltip = "Weekend";
                }

                return (
                  <div
                    key={idx}
                    title={`${day.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${tooltip}`}
                    className={`h-9 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all hover:scale-105 select-none ${colorClass}`}
                  >
                    {day.date.getDate()}
                  </div>
                );
              })}
            </div>

            {/* Heatmap Legend */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded bg-emerald-500" /> Present
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded bg-rose-500" /> Absent
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded bg-amber-500" /> Late
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded bg-blue-500" /> Leave
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded bg-slate-100 border border-slate-200" /> Weekend/Unmarked
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Recent Timeline Logs */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-[13px] font-bold text-slate-900">Activity Timeline Logs</h3>
            <AppIcon name="History" size={16} className="text-slate-400" />
          </div>

          <div className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto">
            {view.recent_records.length === 0 ? (
              <div className="p-10 text-center flex flex-col items-center justify-center text-slate-400">
                <AppIcon name="Calendar" size={32} className="text-slate-200 mb-3" />
                <p className="text-[12px] font-bold">No Records Found</p>
                <p className="text-[10px] font-medium text-slate-400 mt-1 max-w-[200px]">
                  No attendance history logged for this student yet.
                </p>
              </div>
            ) : (
              view.recent_records.map((record, idx) => {
                const dateObj = new Date(record.date);
                const day = dateObj.getDate();
                const monthYear = dateObj.toLocaleDateString("en-US", { month: "short", year: "numeric" });
                const weekday = dateObj.toLocaleDateString("en-US", { weekday: "long" });

                // Status pill styles
                let pillClass = "bg-slate-50 text-slate-600 border-slate-100";
                if (record.status === "present") pillClass = "bg-emerald-50 text-emerald-700 border-emerald-100";
                else if (record.status === "absent") pillClass = "bg-rose-50 text-rose-700 border-rose-100";
                else if (record.status === "late") pillClass = "bg-amber-50 text-amber-700 border-amber-100";
                else if (record.status === "leave") pillClass = "bg-blue-50 text-blue-700 border-blue-100";

                return (
                  <div
                    key={idx}
                    className="p-4 flex items-center justify-between hover:bg-slate-50/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Date block */}
                      <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col items-center justify-center text-center shrink-0">
                        <span className="text-[14px] font-bold text-slate-700 leading-none">{day}</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{dateObj.toLocaleDateString("en-US", { month: "short" })}</span>
                      </div>
                      
                      {/* Text info */}
                      <div className="min-w-0">
                        <p className="text-[12px] font-bold text-slate-800 truncate">
                          {monthYear}
                        </p>
                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                          {weekday}
                        </p>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border shrink-0 ${pillClass}`}>
                      {record.status}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </SchoolShell>
  );
}
