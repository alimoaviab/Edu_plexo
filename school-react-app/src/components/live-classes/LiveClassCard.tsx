import React, { useMemo } from "react";
import { AppIcon } from "shared/ui/AppIcon";

interface LiveClassCardProps {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  subjectName: string;
  teacherName?: string;
  status: "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED";
  meetingLink?: string;
  role: "TEACHER" | "STUDENT" | "ADMIN";
  onJoin?: (id: string, link: string) => void;
  onUpdateStatus?: (id: string, status: string) => void;
}

export const LiveClassCard: React.FC<LiveClassCardProps> = ({
  id,
  title,
  startTime,
  endTime,
  subjectName,
  teacherName,
  status,
  meetingLink,
  role,
  onJoin,
  onUpdateStatus,
}) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();

  const timeString = `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  const dateString = start.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);

  const isStartingSoon = status === "SCHEDULED" && start.getTime() - now.getTime() < 15 * 60000 && start.getTime() > now.getTime();
  const displayStatus = isStartingSoon ? "STARTING SOON" : status;

  const statusConfig: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    SCHEDULED: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
    "STARTING SOON": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
    LIVE: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
    COMPLETED: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
    CANCELLED: { bg: "bg-slate-50", text: "text-slate-500", border: "border-slate-200", dot: "bg-slate-400" },
  };

  const config = statusConfig[displayStatus] || statusConfig.SCHEDULED;
  const mockAttendance = useMemo(() => Math.floor(Math.random() * 20) + 15, []);

  const cardBorder = displayStatus === "LIVE" 
    ? "border-red-200 shadow-sm shadow-red-50" 
    : displayStatus === "STARTING SOON" 
      ? "border-amber-200 shadow-sm shadow-amber-50" 
      : "border-slate-200";

  return (
    <div className={`group relative rounded-xl border bg-white p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${cardBorder}`}>
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {/* Subject Icon */}
          <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <AppIcon name="Video" size={18} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold border ${config.bg} ${config.text} ${config.border}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${config.dot} ${displayStatus === 'LIVE' ? 'animate-pulse' : ''}`} />
                {displayStatus}
              </span>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                {subjectName}
              </span>
            </div>
            <h3 className="mt-1.5 text-[13px] font-bold text-slate-900 leading-tight truncate">{title}</h3>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50/70 border border-slate-100/80">
          <AppIcon name="Clock" size={14} className="text-slate-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-slate-900 truncate">{timeString}</p>
            <p className="text-[9px] text-slate-400 font-medium">{durationMinutes} min • {dateString}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50/70 border border-slate-100/80">
          <AppIcon name="User" size={14} className="text-slate-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-slate-900 truncate" title={teacherName || "Teacher"}>
              {teacherName || "Teacher"}
            </p>
            {displayStatus === "LIVE" ? (
              <p className="text-[9px] text-red-600 font-bold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                {mockAttendance} attending
              </p>
            ) : (
              <p className="text-[9px] text-slate-400 font-medium">Instructor</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
        {(status === "SCHEDULED" || status === "LIVE") ? (
          <button
            onClick={() => meetingLink && onJoin && onJoin(id, meetingLink)}
            disabled={!meetingLink}
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg h-9 text-[11px] font-bold transition-all active:scale-[0.98] ${
              meetingLink
                ? status === "LIVE"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-200 hover:shadow-md"
                  : "bg-slate-900 text-white shadow-sm hover:bg-slate-800"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            {meetingLink ? (
              <>
                <AppIcon name="Video" size={14} />
                Join Session
              </>
            ) : (
              "No Link Available"
            )}
          </button>
        ) : (
          <div className="flex-1 h-9 flex items-center justify-center text-[11px] font-bold text-slate-400 bg-slate-50 rounded-lg border border-slate-100">
            Session {status.toLowerCase()}
          </div>
        )}

        {role === "TEACHER" && status === "SCHEDULED" && onUpdateStatus && (
          <button
            onClick={() => onUpdateStatus(id, "LIVE")}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-red-50 text-red-700 text-[11px] font-bold border border-red-200 hover:bg-red-100 transition-colors active:scale-[0.98]"
          >
            <AppIcon name="Play" size={13} />
            Go Live
          </button>
        )}

        {role === "TEACHER" && status === "LIVE" && onUpdateStatus && (
          <button
            onClick={() => onUpdateStatus(id, "COMPLETED")}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200 hover:bg-slate-200 transition-colors active:scale-[0.98]"
          >
            <AppIcon name="Square" size={13} />
            End
          </button>
        )}
      </div>
    </div>
  );
};
