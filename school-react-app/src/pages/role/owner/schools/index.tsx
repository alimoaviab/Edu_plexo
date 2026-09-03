import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppIcon } from "shared/ui/AppIcon";
import { serviceRequest } from "@/services/service-client";
import { SchoolShell } from "@/layouts/SchoolShell";
import { toast } from "@/utils/toast";

export default function OwnerSchoolsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
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
  
  const INITIAL_SCHOOL_STATE = { name: "", code: "", city: "", address: "", principal_name: "", email: "", password: "" };

  // Onboard Modal State
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [newSchool, setNewSchool] = useState(INITIAL_SCHOOL_STATE);
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
        setNewSchool(INITIAL_SCHOOL_STATE);
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

  const [deleting, setDeleting] = useState(false);

  const handleDeleteSchool = async (schoolId: string) => {
    setDeleting(true);
    try {
      const res = await serviceRequest<any>(`/api/owner/schools/${schoolId}`, {
        method: "DELETE",
      });
      if (res.success || res.ok) {
        toast.success("Campus deleted successfully!");
        setSelectedSchool(null);
        void queryClient.invalidateQueries({ queryKey: ["owner-schools"] });
        void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      } else {
        toast.error(res.error?.message || res.message || "Failed to delete campus.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete campus.");
    } finally {
      setDeleting(false);
    }
  };

  const handleSwitchToCampus = (school: any) => {
    const sId = school.school_id || school._id || school.id;
    if (sId) {
      localStorage.setItem("active_school_id", sId);
      localStorage.setItem("active_branch_id", `cmp_${sId}`);
      window.dispatchEvent(new Event("auth-changed"));
      toast.success(`Active campus switched to ${school.name}`);
      navigate("/admin/dashboard");
    }
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
              setNewSchool(INITIAL_SCHOOL_STATE);
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
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleSwitchToCampus(school)}
                          className="text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-bold px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors shadow-sm flex items-center gap-1.5"
                          title="Open campus admin workspace"
                        >
                          <AppIcon name="ExternalLink" size={13} />
                          <span>Switch Context</span>
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedSchool(school);
                            setShowPassword(false);
                          }}
                          className="text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 font-bold px-3.5 py-1.5 rounded-lg border border-blue-200 transition-colors shadow-sm"
                        >
                          View Details
                        </button>
                      </div>
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
            <div className="p-5 bg-white border border-slate-200 text-slate-900 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                  <AppIcon name="Key" size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">School Admin Login Credentials</h3>
                  <p className="text-[11px] text-slate-500">Use these credentials to sign in as School Admin for this campus.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Email Box */}
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block font-medium">Admin Email</span>
                    <span className="font-bold text-slate-900 text-sm select-all mt-0.5 block">
                      {selectedSchool.admin_email || selectedSchool.email || "admin@school.com"}
                    </span>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(selectedSchool.admin_email || selectedSchool.email || "admin@school.com", "Admin Email")}
                    className="p-2 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors shadow-sm"
                    title="Copy Email"
                  >
                    <AppIcon name="Copy" size={16} />
                  </button>
                </div>

                {/* Password Box */}
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block font-medium">Admin Password</span>
                    <span className="font-mono font-bold text-emerald-600 text-sm select-all mt-0.5 block">
                      {showPassword
                        ? (selectedSchool.admin_password || "Configured on campus creation")
                        : "••••••••••••"}
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
                      onClick={() => {
                        if (selectedSchool.admin_password) {
                          copyToClipboard(selectedSchool.admin_password, "Admin Password");
                        } else {
                          toast.info("Password was configured during campus creation.");
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors shadow-sm"
                      title="Copy Password"
                    >
                      <AppIcon name="Copy" size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

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
            <div className="p-4 md:p-6 border-t border-slate-100 flex items-center justify-between bg-white">
              <button 
                onClick={async () => {
                  if (window.confirm(`Are you sure you want to delete campus "${selectedSchool.name}"? This action cannot be undone.`)) {
                    await handleDeleteSchool(selectedSchool.id || selectedSchool.school_id);
                  }
                }}
                disabled={deleting}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <AppIcon name="Trash2" size={14} />
                <span>{deleting ? "Deleting..." : "Delete Campus"}</span>
              </button>
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
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* ONBOARD NEW CAMPUS SLIDE-OVER DRAWER */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {isOnboardModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md md:max-w-xl h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                    <AppIcon name="Plus" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Onboard New Campus</h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Provision a new educational branch and administrative account.
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsOnboardModalOpen(false);
                  setShowModalPassword(false);
                  setNewSchool(INITIAL_SCHOOL_STATE);
                }} 
                className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
                title="Close"
              >
                <AppIcon name="X" size={20} />
              </button>
            </div>

            {/* Form & Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              {modalError && (
                <div className="p-4 bg-red-50/80 border border-red-200 rounded-2xl flex items-center gap-3 text-xs font-bold text-red-600">
                  <AppIcon name="AlertCircle" size={18} className="flex-shrink-0 text-red-500" />
                  <span>{modalError}</span>
                </div>
              )}

              <form id="onboard-campus-form" onSubmit={handleCreateSchool} className="space-y-6" autoComplete="off">
                {/* Prevent browser password managers autofill */}
                <input type="text" name="decoy_username_prevent_autofill" style={{ display: "none" }} tabIndex={-1} aria-hidden="true" autoComplete="off" />
                <input type="password" name="decoy_password_prevent_autofill" style={{ display: "none" }} tabIndex={-1} aria-hidden="true" autoComplete="off" />

                {/* Section 1: Campus Identification */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                    <AppIcon name="Building2" size={16} className="text-blue-600" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Campus Identification</h3>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Campus / Branch Name *</label>
                    <input 
                      required 
                      type="text" 
                      autoComplete="off" 
                      value={newSchool.name} 
                      onChange={e => { setNewSchool({...newSchool, name: e.target.value}); setModalError(""); }} 
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all placeholder:text-slate-400" 
                      placeholder="e.g. City Campus (Model Town)" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Branch Code (Unique Identifier) *</label>
                    <input 
                      required 
                      type="text" 
                      autoComplete="off" 
                      value={newSchool.code} 
                      onChange={e => { setNewSchool({...newSchool, code: e.target.value.toUpperCase()}); setModalError(""); }} 
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all placeholder:text-slate-400" 
                      placeholder="e.g. LHR-MT01" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">City *</label>
                      <input 
                        required 
                        type="text" 
                        autoComplete="off" 
                        value={newSchool.city} 
                        onChange={e => { setNewSchool({...newSchool, city: e.target.value}); setModalError(""); }} 
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all placeholder:text-slate-400" 
                        placeholder="e.g. Lahore" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Campus Address</label>
                      <input 
                        type="text" 
                        autoComplete="off" 
                        value={newSchool.address} 
                        onChange={e => { setNewSchool({...newSchool, address: e.target.value}); setModalError(""); }} 
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all placeholder:text-slate-400" 
                        placeholder="e.g. Sector B, Block 4" 
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Campus Administrator Account */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                    <AppIcon name="Shield" size={16} className="text-indigo-600" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Campus Administrator</h3>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Principal / Administrator Name *</label>
                    <input 
                      required 
                      type="text" 
                      autoComplete="off" 
                      value={newSchool.principal_name} 
                      onChange={e => { setNewSchool({...newSchool, principal_name: e.target.value}); setModalError(""); }} 
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all placeholder:text-slate-400" 
                      placeholder="e.g. Muhammad Aslam" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Administrator Login Email *</label>
                    <input 
                      required 
                      type="email" 
                      name="campus_admin_email"
                      id="campus_admin_email"
                      autoComplete="new-password"
                      value={newSchool.email} 
                      onChange={e => { setNewSchool({...newSchool, email: e.target.value}); setModalError(""); }} 
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all placeholder:text-slate-400" 
                      placeholder="admin@school.com" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Administrator Login Password *</label>
                    <div className="relative">
                      <input 
                        required 
                        type={showModalPassword ? "text" : "password"} 
                        name="campus_admin_password"
                        id="campus_admin_password"
                        autoComplete="new-password"
                        value={newSchool.password} 
                        onChange={e => { setNewSchool({...newSchool, password: e.target.value}); setModalError(""); }} 
                        className="w-full rounded-xl border border-slate-200 pl-3.5 pr-11 py-2.5 text-sm font-mono font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all placeholder:text-slate-400" 
                        placeholder="••••••••••••" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowModalPassword(prev => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
                        title={showModalPassword ? "Hide Password" : "Show Password"}
                        tabIndex={-1}
                      >
                        <AppIcon name={showModalPassword ? "EyeOff" : "Eye"} size={16} />
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      The principal will use this to sign in to their administrative portal.
                    </span>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-4 md:p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <button 
                type="button" 
                onClick={() => { 
                  setIsOnboardModalOpen(false); 
                  setShowModalPassword(false); 
                  setNewSchool(INITIAL_SCHOOL_STATE);
                }} 
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="onboard-campus-form"
                disabled={creating} 
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {creating && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                <span>{creating ? "Onboarding Campus..." : "Confirm & Onboard"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </SchoolShell>
  );
}
