import React, { useState, useEffect } from "react";
import { 
  Compass, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  AlertCircle,
  Building2,
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Globe
} from "lucide-react";
import { api } from "../lib/api";

export function CampusesPage() {
  const [campuses, setCampuses] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCampus, setEditingCampus] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    school_id: "",
    name: "",
    code: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    website: "",
    principal_name: "",
    principal_phone: "",
    timezone: "Asia/Karachi",
    currency: "PKR"
  });

  useEffect(() => {
    fetchSchools();
    fetchCampuses();
  }, []);

  const fetchSchools = async () => {
    try {
      const data: any = await api.get("/owner/schools");
      setSchools(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCampuses = async () => {
    setLoading(true);
    try {
      const data: any = await api.get(`/owner/campuses?school_id=${schoolFilter}`);
      setCampuses(data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampuses();
  }, [schoolFilter]);

  const handleOpenCreate = () => {
    setEditingCampus(null);
    setFormData({
      school_id: schools[0]?.school_id || "",
      name: "",
      code: "",
      address: "",
      city: "",
      phone: "",
      email: "",
      website: "",
      principal_name: "",
      principal_phone: "",
      timezone: "Asia/Karachi",
      currency: "PKR"
    });
    setError("");
    setShowModal(true);
  };

  const handleOpenEdit = (campus: any) => {
    setEditingCampus(campus);
    setFormData({
      school_id: campus.school_id || "",
      name: campus.name || "",
      code: campus.code || "",
      address: campus.address || "",
      city: campus.city || "",
      phone: campus.phone || "",
      email: campus.email || "",
      website: campus.website || "",
      principal_name: campus.principal_name || "",
      principal_phone: campus.principal_phone || "",
      timezone: campus.timezone || "Asia/Karachi",
      currency: campus.currency || "PKR"
    });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.school_id || !formData.name) {
      setError("School and Campus Name are required.");
      return;
    }

    try {
      if (editingCampus) {
        await api.patch(`/owner/campuses/${editingCampus.ID}`, formData);
        setSuccess("Campus updated successfully!");
      } else {
        await api.post("/owner/campuses", formData);
        setSuccess("Campus onboarded successfully!");
      }
      setShowModal(false);
      fetchCampuses();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Operation failed.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this campus? All branch data will be permanently removed.")) {
      return;
    }
    try {
      await api.delete(`/owner/campuses/${id}`);
      setSuccess("Campus deleted successfully!");
      fetchCampuses();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      alert(err.message || "Delete failed.");
    }
  };

  const filteredCampuses = campuses.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Manage Campuses</h1>
          <p className="text-slate-400 text-sm mt-1">Onboard and manage school branches / campuses</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/15 transition-all text-sm self-start"
        >
          <Plus size={16} />
          Add Branch Campus
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
            placeholder="Search by campus name..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 pl-10 pr-4 text-slate-100 placeholder-slate-500 focus:outline-none transition-all text-sm"
          />
        </div>

        {/* School selector filter */}
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

      {/* Campuses List Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500" />
        </div>
      ) : filteredCampuses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCampuses.map((campus) => {
            const school = schools.find(s => s.school_id === campus.school_id);
            return (
              <div 
                key={campus.ID} 
                className="bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold">
                        <Compass size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base line-clamp-1">{campus.name}</h3>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-750 font-medium">
                          {school ? school.name : "Unknown School"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3.5 py-4 border-y border-slate-850 text-xs text-slate-400 mt-4">
                    {campus.address && (
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-slate-500 shrink-0 mt-0.5" />
                        <span className="text-slate-300 line-clamp-2">{campus.address}, {campus.city}</span>
                      </div>
                    )}
                    {campus.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-slate-500 shrink-0" />
                        <span className="text-slate-300">{campus.phone}</span>
                      </div>
                    )}
                    {campus.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-slate-500 shrink-0" />
                        <span className="text-slate-300 truncate">{campus.email}</span>
                      </div>
                    )}
                    {campus.principal_name && (
                      <div className="flex items-center justify-between border-t border-slate-850 pt-2.5 mt-2.5">
                        <span>Principal:</span>
                        <span className="text-slate-200 font-medium">{campus.principal_name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Operations */}
                <div className="flex items-center justify-between mt-5 pt-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(campus)}
                      className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700 transition-all"
                      title="Edit Campus"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(campus.ID)}
                      className="p-2 bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                      title="Delete Campus"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <span className="text-[10px] text-slate-500">
                    ID: {campus.ID.substring(0, 8)}...
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
          <Compass size={48} className="mx-auto mb-4 text-slate-600" />
          <p className="text-lg font-semibold text-slate-400">No campuses found</p>
          <p className="text-sm mt-1">Try onboarding a new branch campus to this school.</p>
        </div>
      )}

      {/* Create / Edit Campus Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-850 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Compass size={18} className="text-indigo-400" />
                {editingCampus ? "Edit Campus Info" : "Add Branch Campus"}
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
                <label className="block text-slate-300 text-xs font-medium mb-1.5">Parent Institution / School*</label>
                <select
                  value={formData.school_id}
                  onChange={(e) => setFormData({ ...formData, school_id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-slate-300 text-sm focus:outline-none transition-all"
                  required
                  disabled={!!editingCampus}
                >
                  {schools.map(s => (
                    <option key={s.school_id} value={s.school_id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1.5">Campus Name*</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-slate-100 placeholder-slate-700 text-sm focus:outline-none transition-all"
                    placeholder="e.g. Clifton Campus"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1.5">Campus Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-slate-100 placeholder-slate-700 text-sm focus:outline-none transition-all"
                    placeholder="e.g. CLIF"
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
                  <label className="block text-slate-300 text-xs font-medium mb-1.5">Campus Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-slate-100 placeholder-slate-700 text-sm focus:outline-none transition-all"
                    placeholder="clifton@school.com"
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
                  placeholder="Block 5, Clifton..."
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
                    placeholder="Mrs. Shaheen"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-slate-100 placeholder-slate-700 text-sm focus:outline-none transition-all"
                    placeholder="021-3456789"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1.5">Timezone</label>
                  <input
                    type="text"
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-slate-100 placeholder-slate-700 text-sm focus:outline-none transition-all"
                    placeholder="Asia/Karachi"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1.5">Currency</label>
                  <input
                    type="text"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-slate-100 placeholder-slate-700 text-sm focus:outline-none transition-all"
                    placeholder="PKR"
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
                  {editingCampus ? "Save Changes" : "Create Campus"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
