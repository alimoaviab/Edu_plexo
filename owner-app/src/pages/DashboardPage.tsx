import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Compass, 
  Users, 
  GraduationCap, 
  CreditCard,
  Plus,
  ArrowRight,
  TrendingUp,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

interface Stats {
  total_schools: number;
  total_campuses: number;
  total_students: number;
  total_teachers: number;
  total_staff: number;
  active_subscriptions: number;
  expiring_subscriptions: number;
  schools: any[];
}

export function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    window.addEventListener("school-switched", fetchData);
    return () => window.removeEventListener("school-switched", fetchData);
  }, []);

  const fetchData = () => {
    setLoading(true);
    api.get<Stats>("/owner/dashboard")
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  const statItems = [
    { label: "Total Schools", value: stats?.total_schools || 0, icon: Building2, color: "from-blue-600/20 to-cyan-500/10 text-blue-400 border-blue-500/20" },
    { label: "Total Campuses", value: stats?.total_campuses || 0, icon: Compass, color: "from-indigo-600/20 to-purple-500/10 text-indigo-400 border-indigo-500/20" },
    { label: "Active Students", value: stats?.total_students || 0, icon: GraduationCap, color: "from-emerald-600/20 to-teal-500/10 text-emerald-400 border-emerald-500/20" },
    { label: "Active Teachers", value: stats?.total_teachers || 0, icon: Users, color: "from-amber-600/20 to-orange-500/10 text-amber-400 border-amber-500/20" },
    { label: "Subscriptions Active", value: stats?.active_subscriptions || 0, icon: CreditCard, color: "from-pink-600/20 to-rose-500/10 text-pink-400 border-pink-500/20" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Overview Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Cross-institutional monitoring and analytics</p>
        </div>
        <Link 
          to="/schools" 
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/15 transition-all text-sm self-start"
        >
          <Plus size={16} />
          Register New School
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div 
              key={index}
              className={`bg-gradient-to-br ${item.color} border p-6 rounded-2xl flex flex-col justify-between h-36 relative overflow-hidden group hover:scale-[1.02] transition-all`}
            >
              <div className="flex justify-between items-start">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{item.label}</span>
                <Icon size={20} />
              </div>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-3xl font-bold text-white">{item.value}</span>
                {/* Micro trend indicator */}
                <span className="text-[10px] bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-400 flex items-center gap-0.5">
                  <Activity size={10} className="text-indigo-400 animate-pulse" />
                  Live
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Panel grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Schools List Card */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 size={18} className="text-indigo-400" />
                Schools Overview
              </h2>
              <Link to="/schools" className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold flex items-center gap-1 transition-all">
                Manage all
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 font-medium">
                    <th className="py-3.5">School Name</th>
                    <th className="py-3.5">Code</th>
                    <th className="py-3.5">City</th>
                    <th className="py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {stats?.schools && stats.schools.length > 0 ? (
                    stats.schools.slice(0, 5).map((school: any) => (
                      <tr key={school.school_id} className="hover:bg-slate-800/20 transition-all">
                        <td className="py-3.5 font-medium text-white">{school.name}</td>
                        <td className="py-3.5">{school.code}</td>
                        <td className="py-3.5">{school.city || "N/A"}</td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            school.status === "active" 
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}>
                            {school.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500">
                        No registered schools yet. Get started by registering one!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Info Card / Quick Actions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <TrendingUp size={18} className="text-indigo-400" />
              Quick Actions
            </h2>
            
            <div className="space-y-4">
              <Link 
                to="/campuses"
                className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl hover:bg-slate-800/40 hover:border-slate-700 transition-all group"
              >
                <div>
                  <h4 className="font-semibold text-slate-200 text-sm">Add Branch Campus</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Scale a school into multiple branches</p>
                </div>
                <Compass size={18} className="text-slate-500 group-hover:text-indigo-400 transition-all" />
              </Link>

              <Link 
                to="/admins"
                className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl hover:bg-slate-800/40 hover:border-slate-700 transition-all group"
              >
                <div>
                  <h4 className="font-semibold text-slate-200 text-sm">Issue School Admin</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Authorize administrators for new schools</p>
                </div>
                <Users size={18} className="text-slate-500 group-hover:text-indigo-400 transition-all" />
              </Link>

              <Link 
                to="/subscriptions"
                className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl hover:bg-slate-800/40 hover:border-slate-700 transition-all group"
              >
                <div>
                  <h4 className="font-semibold text-slate-200 text-sm">Modify Billing Plan</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Renew or scale student caps per school</p>
                </div>
                <CreditCard size={18} className="text-slate-500 group-hover:text-indigo-400 transition-all" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
