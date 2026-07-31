import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  AlertCircle,
  Eye,
  Compass,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import { api } from "../lib/api";

export function SchoolsPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSchool, setEditingSchool] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    city: "",
    address: "",
    phone: "",
    email: "",
    principal_name: "",
    website: "",
    logo_url: ""
  });

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const data: any = await api.get("/owner/schools");
      setSchools(data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingSchool(null);
    setFormData({
      name: "",
      code: "",
      city: "",
      address: "",
      phone: "",
      email: "",
      principal_name: "",
      website: "",
      logo_url: ""
    });
    setError("");
    setShowModal(true);
  };

  const handleOpenEdit = (school: any) => {
    setEditingSchool(school);
    setFormData({
      name: school.name || "",
      code: school.code || "",
      city: school.city || "",
      address: school.address || "",
      phone: school.phone || "",
      email: school.email || "",
      principal_name: school.principal_name || "",
      website: school.website || "",
      logo_url: school.logo_url || ""
    });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      setError("School name is required.");
      return;
    }

    try {
      if (editingSchool) {
        await api.patch(`/owner/schools/${editingSchool.ID}`, formData);
        setSuccess("School updated successfully!");
      } else {
        await api.post("/owner/schools", formData);
        setSuccess("School registered successfully!");
      }
      setShowModal(false);
      fetchSchools();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Operation failed.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this school? All associated campus and tenant data will be permanently removed.")) {
      return;
    }
    try {
      await api.delete(`/owner/schools/${id}`);
      setSuccess("School deleted successfully!");
      fetchSchools();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      alert(err.message || "Delete failed.");
    }
  };

  const handleAction = async (id: string, action: "activate" | "suspend" | "archive") => {
    try {
      await api.post(`/owner/schools/${id}/${action}`);
      setSuccess(`School successfully ${action}d!`);
      fetchSchools();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      alert(err.message || "Action failed.");
    }
  };

  const filteredSchools = schools.filter(s => 
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Manage Schools</h1>
          <p className="text-slate-400 text-sm mt-1">Onboard and manage schools in your platform</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/15 transition-all text-sm self-start"
        >
          <Plus size={16} />
          Register New School
        </button>
      </div>

      {/* Success/Error Alerts */}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      {/* Search Filter */}
      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
          <Search size={18} />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by school name, code or city..."
          className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 pl-10 pr-4 text-slate-100 placeholder-slate-500 focus:outline-none transition-all text-sm"
        />
      </div>

      {/* Schools List Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500" />
        </div>
      ) : filteredSchools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSchools.map((school) => {
            const isSuspended = school.status === "suspended";
            const isActive = school.status === "active";
            return (
              <div 
                key={school.school_id} 
                className="bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      {school.logo_url ? (
                        <img src={school.logo_url} alt="Logo" className="w-12 h-12 rounded-xl object-cover border border-slate-800" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-lg">
                          <Building2 size={24} />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-white text-lg line-clamp-1">{school.name}</h3>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Code: {school.code}</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                      isActive 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : isSuspended 
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {school.status}
                    </span>
                  </div>

                  {/* School details */}
                  <div className="space-y-2.5 py-4 border-y border-slate-850 text-sm text-slate-400">
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="text-slate-200">{school.city || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Students:</span>
                      <span className="text-slate-200 font-medium">{school.student_count || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Teachers:</span>
                      <span className="text-slate-200 font-medium">{school.teacher_count || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subscription status:</span>
                      <span className={`font-semibold capitalize ${
                        school.subscription_status === "active" || school.subscription_status === "trial"
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}>{school.subscription_status}</span>
                    </div>
                  </div>
                </div>

                {/* Operations / Actions */}
                <div className="flex items-center justify-between gap-2 mt-5">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(school)}
                      className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700 transition-all"
                      title="Edit School"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(school.ID)}
                      className="p-2 bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                      title="Delete School"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <button
                        onClick={() => handleAction(school.ID, "suspend")}
                        className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold px-3 py-1.5 rounded-lg border border-red-500/20 transition-all"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction(school.ID, "activate")}
                        className="text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-all"
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
          <Building2 size={48} className="mx-auto mb-4 text-slate-600" />
          <p className="text-lg font-semibold text-slate-400">No schools found</p>
          <p className="text-sm mt-1">Try refining your search or add a new school to get started.</p>
        </div>
      )}

      {/* Create / Edit School Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-850 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 size={18} className="text-indigo-400" />
                {editingSchool ? "Edit School Info" : "Register New School"}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1.5">School Name*</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-slate-100 placeholder-slate-700 text-sm focus:outline-none transition-all"
                    placeholder="e.g. Eduplexo High School"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1.5">Short Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-slate-100 placeholder-slate-700 text-sm focus:outline-none transition-all"
                    placeholder="e.g. EHS (Autogenerated if blank)"
                    maxLength={6}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1.5">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-slate-100 placeholder-slate-700 text-sm focus:outline-none transition-all"
                    placeholder="e.g. Karachi"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1.5">Contact Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-slate-100 placeholder-slate-700 text-sm focus:outline-none transition-all"
                    placeholder="contact@school.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-medium mb-1.5">Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-slate-100 placeholder-slate-700 text-sm focus:outline-none transition-all"
                  placeholder="Street 10, Sector G-10..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1.5">Principal Name</label>
                  <input
                    type="text"
                    value={formData.principal_name}
                    onChange={(e) => setFormData({ ...formData, principal_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-slate-100 placeholder-slate-700 text-sm focus:outline-none transition-all"
                    placeholder="Prof. Tariq"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-slate-100 placeholder-slate-700 text-sm focus:outline-none transition-all"
                    placeholder="0300-1234567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1.5">Website URL</label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-slate-100 placeholder-slate-700 text-sm focus:outline-none transition-all"
                    placeholder="www.school.com"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1.5">Logo URL</label>
                  <input
                    type="text"
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-slate-100 placeholder-slate-700 text-sm focus:outline-none transition-all"
                    placeholder="https://image-url.com"
                  />
                </div>
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
                  {editingSchool ? "Save Changes" : "Register School"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
