import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Download, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  AlertTriangle 
} from "lucide-react";
import { api } from "../lib/api";

export function ReportsPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [reportType, setReportType] = useState("enrollments");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [format, setFormat] = useState("pdf");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    api.get("/owner/schools")
      .then((data: any) => {
        setSchools(data || []);
        if (data && data.length > 0) {
          setSelectedSchool(data[0].school_id);
        }
      })
      .catch(() => {});
  }, []);

  const handleExport = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(`Your ${reportType.toUpperCase()} report in ${format.toUpperCase()} format has been compiled. Download starting...`);
      
      // Simulate file download by creating a virtual mock link
      const blob = new Blob([`Simulated ${reportType} report content for school ${selectedSchool}`], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `eduplexo-${reportType}-report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => setSuccess(""), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">System Reports</h1>
        <p className="text-slate-400 text-sm mt-1">Export structured institution and subscription logs</p>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      {/* Report Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-xl shadow-xl">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
          <FileText size={18} className="text-indigo-400" />
          Compile Export
        </h2>

        <form onSubmit={handleExport} className="space-y-5">
          <div>
            <label className="block text-slate-300 text-xs font-medium mb-1.5">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 px-3 text-slate-300 text-sm focus:outline-none transition-all"
            >
              <option value="enrollments">Student Enrollment Distribution</option>
              <option value="staff">Staff and Instructors Log</option>
              <option value="subscriptions">Platform Subscription Invoices</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-medium mb-1.5">Target Institution</label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 px-3 text-slate-300 text-sm focus:outline-none transition-all"
            >
              <option value="all">All Schools Combined</option>
              {schools.map(s => (
                <option key={s.school_id} value={s.school_id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-medium mb-1.5">Export Format</label>
            <div className="grid grid-cols-3 gap-3">
              {["pdf", "excel", "csv"].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  className={`py-3 px-4 border rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                    format === f 
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10" 
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/15 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:pointer-events-none mt-4 text-sm"
          >
            <Download size={16} />
            {loading ? "Compiling Report..." : "Generate and Download"}
          </button>
        </form>
      </div>
    </div>
  );
}
