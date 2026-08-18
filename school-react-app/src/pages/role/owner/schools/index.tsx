import { useEffect, useState } from "react";
import { AppIcon } from "shared/ui/AppIcon";
import { serviceRequest } from "@/services/service-client";
import { SchoolShell } from "@/layouts/SchoolShell";
import { toast } from "@/utils/toast";

export default function OwnerSchoolsPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSchool, setNewSchool] = useState({ name: "", code: "", city: "", address: "", principal_name: "", email: "", password: "" });
  const [creating, setCreating] = useState(false);
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await serviceRequest<any[]>("/api/owner/schools");
        if (res.ok) {
          setSchools(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error("Failed to load schools", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isModalOpen]);

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
        setIsModalOpen(false);
        setModalError("");
        setNewSchool({ name: "", code: "", city: "", address: "", principal_name: "", email: "", password: "" });
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

  const handleImpersonate = (schoolId: string) => {
    window.localStorage.setItem("active_school_id", schoolId);
    window.location.href = "/admin/dashboard";
  };

  if (loading) {
    return (
      <SchoolShell eyebrow="Owner Portal" title="Portfolio">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
            <p className="text-slate-500 mt-1">Manage all your educational branches.</p>
          </div>
          <button 
            onClick={() => {
              setModalError("");
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <AppIcon name="Plus" size={16} />
            Onboard New Campus
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">School Name</th>
                <th className="px-6 py-4 font-medium">Branch Code</th>
                <th className="px-6 py-4 font-medium">City</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schools.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No schools found in your portfolio.
                  </td>
                </tr>
              ) : (
                schools.map(school => (
                  <tr key={school._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{school.name}</td>
                    <td className="px-6 py-4 text-slate-500">{school.school_id}</td>
                    <td className="px-6 py-4 text-slate-500">{school.city || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        school.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {school.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleImpersonate(school.school_id)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors"
                      >
                        Login as Admin
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Onboard Campus</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
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
                <input required type="text" value={newSchool.name} onChange={e => { setNewSchool({...newSchool, name: e.target.value}); setModalError(""); }} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. City Branch" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Campus Code (Unique)</label>
                <input required type="text" value={newSchool.code} onChange={e => { setNewSchool({...newSchool, code: e.target.value}); setModalError(""); }} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. CITY01" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                  <input required type="text" value={newSchool.city} onChange={e => { setNewSchool({...newSchool, city: e.target.value}); setModalError(""); }} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <input type="text" value={newSchool.address} onChange={e => { setNewSchool({...newSchool, address: e.target.value}); setModalError(""); }} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 mt-2">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Admin Account Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Principal / Admin Name</label>
                    <input required type="text" value={newSchool.principal_name} onChange={e => { setNewSchool({...newSchool, principal_name: e.target.value}); setModalError(""); }} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. John Doe" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Login Email</label>
                      <input required type="email" value={newSchool.email} onChange={e => { setNewSchool({...newSchool, email: e.target.value}); setModalError(""); }} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="admin@school.com" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Login Password</label>
                      <input required type="password" value={newSchool.password} onChange={e => { setNewSchool({...newSchool, password: e.target.value}); setModalError(""); }} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="••••••••" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
                <button type="submit" disabled={creating} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2">
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
