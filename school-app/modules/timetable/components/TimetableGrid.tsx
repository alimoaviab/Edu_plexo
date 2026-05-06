"use client";

import { TimetableRecord, DayOfWeek, getDayLabel } from "../types/timetable.types";
import { Card } from "../../../components/ui";

const DAYS: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"
];

// Curated palette for subjects
const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Mathematics: { bg: "bg-blue-50/50", text: "text-blue-700", border: "border-blue-100", dot: "bg-blue-500" },
  English: { bg: "bg-purple-50/50", text: "text-purple-700", border: "border-purple-100", dot: "bg-purple-500" },
  Science: { bg: "bg-emerald-50/50", text: "text-emerald-700", border: "border-emerald-100", dot: "bg-emerald-500" },
  History: { bg: "bg-amber-50/50", text: "text-amber-700", border: "border-amber-100", dot: "bg-amber-500" },
  Geography: { bg: "bg-indigo-50/50", text: "text-indigo-700", border: "border-indigo-100", dot: "bg-indigo-500" },
  Physics: { bg: "bg-cyan-50/50", text: "text-cyan-700", border: "border-cyan-100", dot: "bg-cyan-500" },
  Chemistry: { bg: "bg-rose-50/50", text: "text-rose-700", border: "border-rose-100", dot: "bg-rose-500" },
  Default: { bg: "bg-slate-50/50", text: "text-slate-700", border: "border-slate-100", dot: "bg-slate-500" }
};

interface TimetableGridProps {
  records: TimetableRecord[];
  onEdit?: (record: TimetableRecord) => void;
  onDelete?: (id: string) => void;
}

export function TimetableGrid({ records, onEdit, onDelete }: TimetableGridProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          {/* Header */}
          <div className="grid grid-cols-[100px_repeat(6,1fr)] bg-slate-50/50 border-b border-slate-200">
            <div className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center justify-center border-r border-slate-200/60">
              Time
            </div>
            {DAYS.map(day => (
              <div key={day} className="p-4 text-center border-r border-slate-200/60 last:border-r-0">
                <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{day}</span>
              </div>
            ))}
          </div>

          {/* Time Rows */}
          <div className="divide-y divide-slate-100">
            {TIME_SLOTS.map((time) => (
              <div key={time} className="grid grid-cols-[100px_repeat(6,1fr)] min-h-[120px]">
                {/* Time Indicator */}
                <div className="bg-slate-50/30 border-r border-slate-200/60 flex flex-col items-center justify-center gap-1">
                  <span className="text-xs font-black text-slate-900 tracking-tight">{time}</span>
                  <div className="h-1 w-1 rounded-full bg-slate-300" />
                </div>

                {/* Day Columns */}
                {DAYS.map((day, dayIdx) => {
                  const dayNumber = dayIdx + 1;
                  const slots = records.filter(r => 
                    r.day_of_week === dayNumber && 
                    r.start_time.startsWith(time.substring(0, 2))
                  );

                  return (
                    <div key={`${day}-${time}`} className="p-2 border-r border-slate-200/60 last:border-r-0 relative hover:bg-blue-50/20 transition-colors">
                      {slots.map(slot => {
                        const style = SUBJECT_COLORS[slot.subject_name] || SUBJECT_COLORS.Default;
                        return (
                          <div
                            key={slot._id}
                            className={`${style.bg} ${style.border} border rounded-xl p-3 mb-2 group/item relative overflow-hidden backdrop-blur-[2px] transition-all hover:shadow-lg hover:shadow-slate-200/50 hover:scale-[1.02]`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className={`h-1.5 w-1.5 rounded-full ${style.dot} shrink-0`} />
                                <p className={`text-[12px] font-black leading-none uppercase tracking-tight truncate ${style.text}`}>
                                  {slot.subject_name}
                                </p>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-all">
                                {onEdit && (
                                  <button onClick={() => onEdit(slot)} className="h-6 w-6 flex items-center justify-center rounded-lg bg-white/80 text-slate-400 hover:text-blue-600 shadow-sm transition-colors">
                                    <span className="material-symbols-outlined text-[14px]">edit</span>
                                  </button>
                                )}
                                {onDelete && (
                                  <button onClick={() => onDelete(slot._id)} className="h-6 w-6 flex items-center justify-center rounded-lg bg-white/80 text-slate-400 hover:text-red-600 shadow-sm transition-colors">
                                    <span className="material-symbols-outlined text-[14px]">delete</span>
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-slate-600">
                                <span className="material-symbols-outlined text-[14px] text-slate-400">badge</span>
                                <span className="text-[10px] font-bold truncate">{slot.teacher_name}</span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-slate-500">
                                <span className="material-symbols-outlined text-[14px] text-slate-400">meeting_room</span>
                                <span className="text-[10px] font-medium uppercase tracking-wider">{slot.room || "Room TBA"}</span>
                              </div>

                              <div className="flex items-center gap-2 text-slate-400">
                                <span className="material-symbols-outlined text-[14px]">schedule</span>
                                <span className="text-[9px] font-black tabular-nums">{slot.start_time} - {slot.end_time}</span>
                              </div>
                            </div>
                            
                            {/* Decorative line */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.dot} opacity-20`} />
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
