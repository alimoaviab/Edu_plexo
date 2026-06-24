import React, { useState, useEffect } from "react";
import { SchoolShell } from "@/layouts/SchoolShell";
import { Badge, Button, DataState, Skeleton } from "@/components/ui";
import { AppIcon } from "shared/ui/AppIcon";
import { serviceRequest } from "@/services/service-client";
import { useAuth } from "@/hooks/useAuth";

type AttendanceRecord = {
  _id: string;
  date: string;
  status: string;
  check_in_time?: string;
  check_out_time?: string;
  working_hours?: number;
};

export function TeacherMyAttendancePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendance = async () => {
    setLoading(true);
    const res = await serviceRequest<AttendanceRecord[]>("/api/teachers/attendance/history");
    if (res.ok) {
      setRecords(res.data || []);
      setError(null);
    } else {
      setError(res.error.message || "Failed to load attendance history");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleCheckIn = async () => {
    const res = await serviceRequest<AttendanceRecord>("/api/teachers/attendance/checkin", {
      method: "POST",
      body: JSON.stringify({ date: new Date().toISOString() })
    });
    if (res.ok) fetchAttendance();
  };

  const handleCheckOut = async () => {
    const res = await serviceRequest<AttendanceRecord>("/api/teachers/attendance/checkout", {
      method: "POST",
      body: JSON.stringify({ date: new Date().toISOString() })
    });
    if (res.ok) fetchAttendance();
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const todayRecord = records.find(r => r.date.startsWith(todayStr));

  return (
    <SchoolShell eyebrow="My Attendance" title="Attendance History">
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Today's Attendance</h2>
            <p className="text-sm text-slate-500 mt-1">
              {todayRecord ? (
                <>
                  Checked in at <strong className="text-slate-800">{todayRecord.check_in_time || "N/A"}</strong>
                  {todayRecord.check_out_time && <> and checked out at <strong className="text-slate-800">{todayRecord.check_out_time}</strong></>}
                </>
              ) : (
                "You haven't checked in today yet."
              )}
            </p>
          </div>
          <div className="flex gap-3">
            {!todayRecord ? (
              <Button onClick={handleCheckIn}>
                <AppIcon name="Login" className="mr-2 h-4 w-4" />
                Check In
              </Button>
            ) : !todayRecord.check_out_time ? (
              <Button variant="secondary" onClick={handleCheckOut} className="border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100">
                <AppIcon name="Logout" className="mr-2 h-4 w-4" />
                Check Out
              </Button>
            ) : (
              <Badge variant="success" className="px-4 py-2 text-sm bg-emerald-50 text-emerald-700 border-emerald-200">
                <AppIcon name="CheckCircle" className="mr-2 h-4 w-4" />
                Completed ({todayRecord.working_hours} hrs)
              </Badge>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : records.length === 0 ? (
            <DataState variant="empty" title="No Records" message="You don't have any attendance history." />
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Check In</th>
                  <th className="px-6 py-4 text-left">Check Out</th>
                  <th className="px-6 py-4 text-right">Working Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                      {new Date(r.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={r.status === "present" ? "success" : r.status === "late" ? "warning" : "error"} className="capitalize">
                        {r.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{r.check_in_time || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{r.check_out_time || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-medium text-right">
                      {r.working_hours ? `${r.working_hours} hrs` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </SchoolShell>
  );
}
