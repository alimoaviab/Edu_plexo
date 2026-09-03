import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppIcon } from "shared/ui/AppIcon";
import { serviceRequest } from "@/services/service-client";
import { SchoolShell } from "@/layouts/SchoolShell";
import { toast } from "@/utils/toast";

export default function OwnerSchoolsPage() {
  const queryClient = useQueryClient();
  
  const { data: schoolsData, isLoading: loading } = useQuery<any[]>({
    queryKey: ["owner-schools"],
    queryFn: async () => {
      const res = await serviceRequest<any[]>("/api/owner/schools");
      if (res.ok) {
        return Array.isArray(res.data) ? res.data : [];
      }
      return [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });


  const schools = schoolsData || [];
  
  // Onboard Modal State
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [newSchool, setNewSchool] = useState({ name: "", code: "", city: "", address: "", principal_name: "", email: "", password: "" });
  const [showModalPassword, setShowModalPassword] = useState(false);
  const [creating, setCreating] = useState(false);
  const [modalError, setModalError] = useState("");

  // Details Modal State
  const [selectedSchool, setSelectedSchool] = useState<any | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setModalError("");
    try {
      const res = await serviceRequest<any>("/api/owner/schools/create", {
        method: "POST",
        body: JSON.stringify(newSchool),
      });
      if (res.success || res.ok) {
        toast.success("Campus onboarded successfully!");
        setIsOnboardModalOpen(false);
        setModalError("");
        setShowModalPassword(false);
        setNewSchool({ name: "", code: "", city: "", address: "", principal_name: "", email: "", password: "" });
        void queryClient.invalidateQueries({ queryKey: ["owner-schools"] });
        void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      } else {
        const errMsg = res.error?.message || res.message || "A school with this code or email already exists.";
        setModalError(errMsg);
        toast.apiError(res, errMsg);
      }
    } catch (err: any) {
      const errMsg = err?.message || "An unexpected error occurred.";
      setModalError(errMsg);
      toast.error(errMsg);
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  if (loading) {
    return (
      <SchoolShell eyebrow="Owner Portal" title="Portfolio">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </SchoolShell>
    );
  }

  return (
    <SchoolShell eyebrow="Owner Portal" title="Portfolio">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Your Portfolio</h1>
            <p className="text-slate-500 mt-1">Manage all your educational campuses and view complete performance statistics.</p>
          </div>
          <button 
            onClick={() => {
              setModalError("");
              setShowModalPassword(false);
              setIsOnboardModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <AppIcon name="Plus" size={16} />
            Onboard New Campus
          </button>
        </div>

        {/* Schools Table */}
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Campus Name</th>
                <th className="px-6 py-4 font-medium">Branch Code</th>
                <th className="px-6 py-4 font-medium">City</th>
                <th className="px-6 py-4 font-medium text-center">Classes</th>
                <th className="px-6 py-4 font-medium text-center">Students</th>
                <th className="px-6 py-4 font-medium text-center">Teachers</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schools.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    No schools found in your portfolio. Click "Onboard New Campus" to add your first branch.
                  </td>
                </tr>
              ) : (
                schools.map(school => (
                  <tr key={school._id || school.id || school.school_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{school.name}</td>
                    <td className="px-6 py-4 font-mono text-slate-500">{school.school_id}</td>
                    <td className="px-6 py-4 text-slate-600">{school.city || "N/A"}</td>
                    <td className="px-6 py-4 text-center font-semibold text-slate-800">{school.class_count || 0}</td>
                    <td className="px-6 py-4 text-center font-semibold text-slate-800">{school.student_count || 0}</td>
                    <td className="px-6 py-4 text-center font-semibold text-slate-800">{school.teacher_count || 0}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        school.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {(school.status || "active").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => {
                          setSelectedSchool(school);
                          setShowPassword(false);
                        }}
                        className="text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 font-bold px-3.5 py-1.5 rounded-lg border border-blue-200 transition-colors shadow-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* CAMPUS DETAILS DRAWER */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {selectedSchool && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md md:max-w-2xl h-full shadow-2xl border-l border-slate-100 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-slate-900">{selectedSchool.name}</h2>
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    selectedSchool.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {(selectedSchool.status || "active").toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Branch Code: <span className="font-mono font-bold text-slate-700">{selectedSchool.school_id}</span> | City: <span className="font-semibold text-slate-700">{selectedSchool.city || "N/A"}</span>
                </p>
              </div>
              <button 
                onClick={() => setSelectedSchool(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <AppIcon name="X" size={20} />
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl text-center">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Total Classes</span>
                <span className="text-2xl font-black text-blue-950 mt-1 block">{selectedSchool.class_count || 0}</span>
              </div>
              <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl text-center">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Total Students</span>
                <span className="text-2xl font-black text-emerald-950 mt-1 block">{selectedSchool.student_count || 0}</span>
              </div>
              <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-2xl text-center">
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block">Total Faculty</span>
                <span className="text-2xl font-black text-purple-950 mt-1 block">{selectedSchool.teacher_count || 0}</span>
              </div>
              <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-2xl text-center">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Collected Fee</span>
                <span className="text-xl font-black text-amber-950 mt-1 block">Rs. {selectedSchool.total_fee_collected || 0}</span>
              </div>
            </div>

            {/* Credentials Card */}
            {(() => {
              const credRole = selectedSchool.admin_role || "admin";
              const credRoleLabel = credRole === "super_admin" ? "Super Admin" : credRole === "school_admin" ? "School Admin" : credRole.charAt(0).toUpperCase() + credRole.slice(1);
              return (
                <div className="p-5 bg-white border border-slate-200 text-slate-900 rounded-2xl shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                      <AppIcon name="Key" size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{credRoleLabel} Login Credentials</h3>
                      <p className="text-[11px] text-slate-500">Use these credentials to sign in as {credRoleLabel} for this campus.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Email Box */}
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 block font-medium">{credRoleLabel} Email</span>
                        <span className="font-bold text-slate-900 text-sm select-all mt-0.5 block">
                          {selectedSchool.admin_email || selectedSchool.email || "owner@school.com"}
                        </span>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(selectedSchool.admin_email || selectedSchool.email || "owner@school.com", `${credRoleLabel} Email`)}
                        className="p-2 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors shadow-sm"
                        title="Copy Email"
                      >
                        <AppIcon name="Copy" size={16} />
                      </button>
                    </div>

                    {/* Password Box */}
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 block font-medium">{credRoleLabel} Password</span>
                        <span className="font-mono font-bold text-emerald-600 text-sm select-all mt-0.5 block">
                          {showPassword ? (selectedSchool.admin_password || "Test@123") : "••••••••••••"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => setShowPassword(!showPassword)}
                          className="p-2 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors shadow-sm"
                          title={showPassword ? "Hide Password" : "Show Password"}
                        >
                          <AppIcon name={showPassword ? "EyeOff" : "Eye"} size={16} />
                        </button>
                        <button 
                          onClick={() => copyToClipboard(selectedSchool.admin_password || "Test@123", `${credRoleLabel} Password`)}
                          className="p-2 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors shadow-sm"
                          title="Copy Password"
                        >
                          <AppIcon name="Copy" size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Class Breakdown Table */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AppIcon name="School" size={18} className="text-blue-600" />
                Class-wise Performance & Fee Breakdown
              </h3>
              
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <tr>
                      <th className="px-4 py-3">Class Name</th>
                      <th className="px-4 py-3">Section</th>
                      <th className="px-4 py-3 text-center">Enrolled Students</th>
                      <th className="px-4 py-3 text-right">Fee Collected</th>
                      <th className="px-4 py-3 text-right">Fee Pending</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {!selectedSchool.classes_breakdown || selectedSchool.classes_breakdown.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-400 font-medium">
                          No active classes configured for this campus yet.
                        </td>
                      </tr>
                    ) : (
                      selectedSchool.classes_breakdown.map((c: any) => (
                        <tr key={c.class_id || c.name} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-bold text-slate-900">{c.name}</td>
                          <td className="px-4 py-3 font-medium text-slate-500">{c.section || "-"}</td>
                          <td className="px-4 py-3 text-center font-bold text-slate-800">{c.student_count || 0}</td>
                          <td className="px-4 py-3 text-right font-bold text-emerald-600">Rs. {c.collected_fee || 0}</td>
                          <td className="px-4 py-3 text-right font-bold text-rose-600">Rs. {c.pending_fee || 0}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            </div>
            {/* Footer */}
            <div className="p-4 md:p-6 border-t border-slate-100 flex justify-end bg-white">
              <button 
                onClick={() => setSelectedSchool(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* ONBOARD NEW CAMPUS MODAL */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {isOnboardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Onboard Campus</h2>
              <button 
                onClick={() => {
                  setIsOnboardModalOpen(false);
                  setShowModalPassword(false);
                }} 
                className="text-slate-400 hover:text-slate-600"
              >
                <AppIcon name="X" size={20} />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-bold text-red-600 mb-4">
                <AppIcon name="AlertCircle" size={16} className="flex-shrink-0 text-red-500" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSchool} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Campus Name</label>
                <input required type="text" value={newSchool.name} onChange={e => { setNewSchool({...newSchool, name: e.target.value}); setModalError(""); }} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600" placeholder="e.g. City Branch" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Campus Code (Unique)</label>
                <input required type="text" value={newSchool.code} onChange={e => { setNewSchool({...newSchool, code: e.target.value}); setModalError(""); }} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600" placeholder="e.g. CITY01" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                  <input required type="text" value={newSchool.city} onChange={e => { setNewSchool({...newSchool, city: e.target.value}); setModalError(""); }} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <input type="text" value={newSchool.address} onChange={e => { setNewSchool({...newSchool, address: e.target.value}); setModalError(""); }} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600" />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 mt-2">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Admin Account Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Principal / Admin Name</label>
                    <input required type="text" value={newSchool.principal_name} onChange={e => { setNewSchool({...newSchool, principal_name: e.target.value}); setModalError(""); }} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600" placeholder="e.g. John Doe" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Login Email</label>
                      <input required type="email" value={newSchool.email} onChange={e => { setNewSchool({...newSchool, email: e.target.value}); setModalError(""); }} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600" placeholder="admin@school.com" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Login Password</label>
                      <div className="relative">
                        <input 
                          required 
                          type={showModalPassword ? "text" : "password"} 
                          value={newSchool.password} 
                          onChange={e => { setNewSchool({...newSchool, password: e.target.value}); setModalError(""); }} 
                          className="w-full rounded-lg border border-slate-200 pl-3 pr-10 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600" 
                          placeholder="••••••••" 
                        />
                        <button
                          type="button"
                          onClick={() => setShowModalPassword(prev => !prev)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition-colors"
                          title={showModalPassword ? "Hide Password" : "Show Password"}
                          tabIndex={-1}
                        >
                          <AppIcon name={showModalPassword ? "EyeOff" : "Eye"} size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => { 
                    setIsOnboardModalOpen(false); 
                    setShowModalPassword(false); 
                  }} 
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                  {creating && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {creating ? "Creating..." : "Create Campus"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SchoolShell>
  );
}
