import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  Building2,
  Lock,
  Mail,
  UserCheck,
  UserX
} from "lucide-react";
import { api } from "../lib/api";

export function AdminsPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    school_id: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: ""
  });

  useEffect(() => {
    fetchSchools();
    fetchAdmins();
  }, []);

  const fetchSchools = async () => {
    try {
      const data: any = await api.get("/owner/schools");
      setSchools(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const data: any = await api.get("/owner/admins");
      setAdmins(data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingAdmin(null);
    setFormData({
      school_id: schools[0]?.school_id || "",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      phone: ""
    });
    setError("");
    setShowModal(true);
  };

  const handleOpenEdit = (admin: any) => {
    setEditingAdmin(admin);
    setFormData({
      school_id: admin.school_id || "",
      email: admin.email || "",
      password: "", // Hide passwords
      first_name: admin.first_name || "",
      last_name: admin.last_name || "",
      phone: admin.phone || ""
    });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.school_id || !formData.email) {
      setError("School and Email are required.");
      return;
    }
    if (!editingAdmin && !formData.password) {
      setError("Password is required for new admins.");
      return;
    }

    try {
      if (editingAdmin) {
        // Only update profile details/status
        await api.patch(`/owner/admins/${editingAdmin.ID || editingAdmin._id}`, {
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone
        });
        setSuccess("Admin account updated successfully!");
      } else {
        await api.post("/owner/admins", formData);
        setSuccess("School Admin onboarded successfully!");
      }
      setShowModal(false);
      fetchAdmins();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Operation failed.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this administrator account?")) {
      return;
    }
    try {
      await api.delete(`/owner/admins/${id}`);
      setSuccess("Admin account deleted successfully!");
      fetchAdmins();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      alert(err.message || "Delete failed.");
    }
  };

  const handleToggleStatus = async (admin: any) => {
    const newStatus = admin.status === "active" ? "disabled" : "active";
    try {
      await api.patch(`/owner/admins/${admin.ID || admin._id}`, { status: newStatus });
      setSuccess(`Admin account successfully ${newStatus === "active" ? "enabled" : "disabled"}!`);
      fetchAdmins();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      alert(err.message || "Action failed.");
    }
  };

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = 
      admin.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.last_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSchool = !schoolFilter || admin.school_id === schoolFilter;

    return matchesSearch && matchesSchool;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">School Administrators</h1>
          <p className="text-slate-400 text-sm mt-1">Issue and manage credentials for School Admins</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/15 transition-all text-sm self-start"
        >
          <Plus size={16} />
          Create School Admin
        </button>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <Search size={18} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search admins by name or email..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 pl-10 pr-4 text-slate-100 placeholder-slate-500 focus:outline-none transition-all text-sm"
          />
        </div>

        {/* School filter */}
        <select
          value={schoolFilter}
          onChange={(e) => setSchoolFilter(e.target.value)}
          className="w-full sm:w-60 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3 text-slate-300 text-sm focus:outline-none transition-all"
        >
          <option value="">All Schools</option>
          {schools.map(s => (
            <option key={s.school_id} value={s.school_id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Admins Table / List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500" />
        </div>
      ) : filteredAdmins.length > 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-medium bg-slate-850/50">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email / Username</th>
                  <th className="py-4 px-6">Assigned Institution</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.ID || admin._id} className="hover:bg-slate-800/10 transition-all">
                    <td className="py-4 px-6 font-medium text-white">
                      {admin.first_name} {admin.last_name || ""}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-400">{admin.email}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-slate-500" />
                        <span>{admin.school_name || "Unknown School"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${
                        admin.status === "active" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {admin.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-1.5">
                      <button
                        onClick={() => handleToggleStatus(admin)}
                        className={`p-2 rounded-lg transition-all ${
                          admin.status === "active" 
                            ? "bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10" 
                            : "bg-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10"
                        }`}
                        title={admin.status === "active" ? "Deactivate Admin" : "Activate Admin"}
                      >
                        {admin.status === "active" ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                      <button
                        onClick={() => handleOpenEdit(admin)}
                        className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700 transition-all"
                        title="Edit Details"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(admin.ID || admin._id)}
                        className="p-2 bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                        title="Delete Credentials"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
          <Users size={48} className="mx-auto mb-4 text-slate-600" />
          <p className="text-lg font-semibold text-slate-400">No administrators found</p>
          <p className="text-sm mt-1">Try onboarding a new administrator account for your schools.</p>
        </div>
      )}

      {/* Create / Edit Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-850 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users size={18} className="text-indigo-400" />
                {editingAdmin ? "Edit Admin profile" : "Issue Admin Credentials"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <XCircle size={20} />
              </button>
            </div>

            {/* Error display inside Modal */}
            {error && (
              <div className="mx-6 mt-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-2.5 rounded-lg flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-slate-300 text-xs font-medium mb-1.5">Assign School*</label>
                <select
                  value={formData.school_id}
                  onChange={(e) => setFormData({ ...formData, school_id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-slate-300 text-sm focus:outline-none transition-all"
                  required
                  disabled={!!editingAdmin}
                >
                  {schools.map(s => (
                    <option key={s.school_id} value={s.school_id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1.5">First Name</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-slate-100 placeholder-slate-700 text-sm focus:outline-none transition-all"
                    placeholder="e.g. Tariq"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-slate-100 placeholder-slate-700 text-sm focus:outline-none transition-all"
                    placeholder="e.g. Mahmood"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-medium mb-1.5">Admin Email (Username)*</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-600">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 pl-9 pr-3 text-slate-100 placeholder-slate-700 text-sm focus:outline-none transition-all"
                    placeholder="admin@school.com"
                    required
                    disabled={!!editingAdmin}
                  />
                </div>
              </div>

              {!editingAdmin && (
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1.5">Security Password*</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-600">
                      <Lock size={16} />
                    </span>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 pl-9 pr-3 text-slate-100 placeholder-slate-700 text-sm focus:outline-none transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-300 text-xs font-medium mb-1.5">Contact Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-slate-100 placeholder-slate-700 text-sm focus:outline-none transition-all"
                  placeholder="0300-1234567"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold rounded-lg text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm shadow-lg shadow-indigo-600/15 transition-all"
                >
                  {editingAdmin ? "Save Changes" : "Issue Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
