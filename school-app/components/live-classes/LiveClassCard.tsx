"use client";

import React from "react";

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
  const timeString = `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const statusColors = {
    SCHEDULED: "bg-blue-100 text-blue-800",
    LIVE: "bg-red-100 text-red-800 animate-pulse",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${statusColors[status]}`}>
            {status}
          </span>
          <h3 className="mt-2 text-lg font-bold text-slate-900">{title}</h3>
          <p className="text-sm font-medium text-indigo-600">{subjectName}</p>
          {teacherName && <p className="mt-1 text-sm text-slate-500">Teacher: {teacherName}</p>}
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">{start.toLocaleDateString()}</p>
          <p className="text-sm text-slate-500">{timeString}</p>
        </div>
      </div>

      <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4">
        {status === "SCHEDULED" || status === "LIVE" ? (
          <button
            onClick={() => meetingLink && onJoin && onJoin(id, meetingLink)}
            disabled={!meetingLink}
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
              meetingLink ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-300 cursor-not-allowed"
            }`}
          >
            Join Meeting
          </button>
        ) : null}

        {role === "TEACHER" && status === "SCHEDULED" && onUpdateStatus && (
          <button
            onClick={() => onUpdateStatus(id, "LIVE")}
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
          >
            Start Class
          </button>
        )}
        {role === "TEACHER" && status === "LIVE" && onUpdateStatus && (
          <button
            onClick={() => onUpdateStatus(id, "COMPLETED")}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            End Class
          </button>
        )}
      </div>
    </div>
  );
};
