import React, { useState, useEffect } from "react";
import { SchoolShell } from "@/layouts/SchoolShell";
import { Card, DataState, Skeleton } from "@/components/ui";
import { serviceRequest } from "@/services/service-client";
import { AppIcon } from "shared/ui/AppIcon";

type TeacherStat = {
  teacher_id: string;
  teacher_name: string;
  total_days: number;
  present_days: number;
  percentage: number;
};

export function AdminTeacherAttendanceAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TeacherStat[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    const res = await serviceRequest<{ teacher_stats: TeacherStat[] }>("/api/admin/attendance/teachers/analytics");
    if (res.ok) {
      setStats(res.data?.teacher_stats || []);
      setError(null);
    } else {
      setError(res.error.message || "Failed to load analytics");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const sortedStats = [...stats].sort((a, b) => b.percentage - a.percentage);
  const topTeachers = sortedStats.slice(0, 5);
  const lowTeachers = [...sortedStats].reverse().slice(0, 5);

  return (
    <SchoolShell eyebrow="Analytics" title="Teacher Attendance Trends">
      <div className="space-y-6">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        ) : error ? (
          <DataState variant="error" title="Error" message={error} />
        ) : stats.length === 0 ? (
          <DataState variant="empty" title="No Data" message="Not enough attendance data to generate analytics." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-0 overflow-hidden shadow-sm border-emerald-100">
              <div className="bg-emerald-50 p-4 border-b border-emerald-100 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <AppIcon name="TrendingUp" className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-900">Top Attendance</h3>
                  <p className="text-xs text-emerald-700">Highest presence rate</p>
                </div>
              </div>
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-emerald-50">
                  {topTeachers.map(s => (
                    <tr key={s.teacher_id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800 text-sm">{s.teacher_name || "Unknown"}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700 text-xs font-bold">
                          {s.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <Card className="p-0 overflow-hidden shadow-sm border-orange-100">
              <div className="bg-orange-50 p-4 border-b border-orange-100 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <AppIcon name="TrendingDown" className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-orange-900">Low Attendance</h3>
                  <p className="text-xs text-orange-700">Requires attention</p>
                </div>
              </div>
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-orange-50">
                  {lowTeachers.map(s => (
                    <tr key={s.teacher_id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800 text-sm">{s.teacher_name || "Unknown"}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-100 text-orange-700 text-xs font-bold">
                          {s.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}
      </div>
    </SchoolShell>
  );
}
