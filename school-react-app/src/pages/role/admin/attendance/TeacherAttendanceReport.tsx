import React, { useState, useEffect } from "react";
import { SchoolShell } from "@/layouts/SchoolShell";
import { Badge, Button, DataState, Skeleton, Input } from "@/components/ui";
import { AppIcon } from "shared/ui/AppIcon";
import { serviceRequest } from "@/services/service-client";

type TeacherAttendanceRecord = {
  _id: string;
  teacher_id: string;
  teacher_name: string;
  date: string;
  status: string;
  check_in_time?: string;
  check_out_time?: string;
  working_hours?: number;
};

export function AdminTeacherAttendanceReport() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<TeacherAttendanceRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAttendance = async () => {
    setLoading(true);
    let url = "/api/admin/attendance/teachers?";
    if (dateFilter) url += `start_date=${dateFilter}&end_date=${dateFilter}&`;
    if (statusFilter) url += `status=${statusFilter}&`;

    const res = await serviceRequest<TeacherAttendanceRecord[]>(url);
    if (res.ok) {
      setRecords(res.data || []);
      setError(null);
    } else {
      setError(res.error.message || "Failed to load report");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAttendance();
  }, [dateFilter, statusFilter]);

  const filteredRecords = records.filter(r => 
    r.teacher_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = ["Date", "Teacher", "Status", "Check In", "Check Out", "Working Hours"];
    const rows = filteredRecords.map(r => [
      new Date(r.date).toLocaleDateString(),
      r.teacher_name || "Unknown",
      r.status,
      r.check_in_time || "-",
      r.check_out_time || "-",
      r.working_hours || "-"
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `teacher_attendance_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <SchoolShell eyebrow="Reports" title="Teacher Attendance">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex gap-3 w-full md:w-auto">
            <Input 
              type="date" 
              value={dateFilter} 
              onChange={e => setDateFilter(e.target.value)} 
              className="w-40" 
            />
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="w-40 flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Statuses</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
              <option value="excused">Excused</option>
            </select>
            <Input 
              placeholder="Search teacher..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-48"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleExportCSV}>
              <AppIcon name="Download" className="mr-2 h-4 w-4" /> Export CSV
            </Button>
            <Button variant="secondary" onClick={handlePrint}>
              <AppIcon name="Print" className="mr-2 h-4 w-4" /> Print
            </Button>
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
          ) : filteredRecords.length === 0 ? (
            <DataState variant="empty" title="No Records" message="No attendance records match your filters." />
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Teacher</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Check In</th>
                  <th className="px-6 py-4 text-left">Check Out</th>
                  <th className="px-6 py-4 text-right">Working Hrs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                      {new Date(r.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                      {r.teacher_name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={r.status === "present" ? "success" : r.status === "late" ? "warning" : "error"} className="capitalize">
                        {r.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{r.check_in_time || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{r.check_out_time || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800 text-right">
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
