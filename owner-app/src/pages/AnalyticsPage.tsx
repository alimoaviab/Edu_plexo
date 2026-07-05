import React, { useState, useEffect } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { BarChart3, TrendingUp, Users, PieChart as PieIcon } from "lucide-react";
import { api } from "../lib/api";

const COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

export function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const analyticsData = await api.get("/owner/analytics");
      setData(analyticsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  // Hydrate gender chart data
  const genderData = data?.gender_distribution ? [
    { name: "Male", value: data.gender_distribution.male || 0 },
    { name: "Female", value: data.gender_distribution.female || 0 },
    { name: "Other", value: data.gender_distribution.other || 0 },
  ].filter(g => g.value > 0) : [];

  // Hydrate per school chart data
  const schoolData = data?.per_school || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Ecosystem Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">Unified charts and student-teacher ratio comparisons</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gender Distribution Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between lg:col-span-1">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <PieIcon size={18} className="text-indigo-400" />
              Gender Distribution
            </h2>
            
            <div className="h-64 flex justify-center items-center">
              {genderData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", color: "#f8fafc" }}
                      itemStyle={{ color: "#f8fafc" }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-slate-500">No student gender records found</p>
              )}
            </div>
          </div>
        </div>

        {/* School Enrollments Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between lg:col-span-2">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <BarChart3 size={18} className="text-indigo-400" />
              Student-Teacher Distribution
            </h2>

            <div className="h-64">
              {schoolData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={schoolData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="school_name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", color: "#f8fafc" }}
                    />
                    <Legend />
                    <Bar dataKey="students" name="Students" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="teachers" name="Teachers" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-sm text-slate-500">No registration records found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
