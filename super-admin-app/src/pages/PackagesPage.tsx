import { useEffect, useState } from 'react'
import { apiRequest } from '@/lib/api'

interface Package {
  _id: string
  school_id: string
  package_name: string
  allowed_students: number
  current_students: number
  price: number
  duration_type: string
  start_date: string
  expiry_date: string
  payment_status: string
  is_active: boolean
  is_expired: boolean
  created_at: string
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) return `Rs ${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `Rs ${(amount / 1000).toFixed(1)}K`
  return `Rs ${amount.toLocaleString()}`
}

export function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    school_id: '',
    package_name: '',
    allowed_students: '',
    price: '',
    duration_type: 'yearly',
    start_date: new Date().toISOString().split('T')[0],
    expiry_date: '',
    notes: '',
    is_active: true,
  })

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    setLoading(true)
    const response = await apiRequest('/api/super-admin/packages')
    if (response.ok && response.data) {
      setPackages(response.data.items || [])
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await apiRequest(
      `/api/super-admin/packages?school_id=${formData.school_id}`,
      {
        method: 'POST',
        body: JSON.stringify({
          package_name: formData.package_name,
          allowed_students: parseInt(formData.allowed_students),
          price: parseFloat(formData.price),
          duration_type: formData.duration_type,
          start_date: formData.start_date,
          expiry_date: formData.expiry_date,
          notes: formData.notes,
          is_active: formData.is_active,
        }),
      }
    )
    if (response.ok) {
      setShowForm(false)
      setFormData({
        school_id: '',
        package_name: '',
        allowed_students: '',
        price: '',
        duration_type: 'yearly',
        start_date: new Date().toISOString().split('T')[0],
        expiry_date: '',
        notes: '',
        is_active: true,
      })
      fetchPackages()
    }
  }

  const handleDelete = async (id: string) => {
    const response = await apiRequest(`/api/super-admin/packages/${id}`, { method: 'DELETE' })
    if (response.ok) fetchPackages()
  }

  if (loading) return <div className="p-8 text-center text-sm text-slate-400">Loading packages...</div>

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">School Packages</h1>
          <p className="text-xs text-slate-500 mt-0.5">{packages.length} packages</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="h-8 px-3 rounded-lg bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700 transition-colors">
          + New Package
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Create New Package</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">School ID</label>
                <input type="text" required value={formData.school_id} onChange={(e) => setFormData({ ...formData, school_id: e.target.value })} className="w-full h-8 px-2 rounded-md border border-slate-200 text-[12px] outline-none focus:border-blue-500" placeholder="school_default" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Package Name</label>
                <input type="text" required value={formData.package_name} onChange={(e) => setFormData({ ...formData, package_name: e.target.value })} className="w-full h-8 px-2 rounded-md border border-slate-200 text-[12px] outline-none focus:border-blue-500" placeholder="Premium" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Students</label>
                <input type="number" required value={formData.allowed_students} onChange={(e) => setFormData({ ...formData, allowed_students: e.target.value })} className="w-full h-8 px-2 rounded-md border border-slate-200 text-[12px] outline-none focus:border-blue-500" placeholder="500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Price (Rs)</label>
                <input type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full h-8 px-2 rounded-md border border-slate-200 text-[12px] outline-none focus:border-blue-500" placeholder="9999" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Duration</label>
                <select value={formData.duration_type} onChange={(e) => setFormData({ ...formData, duration_type: e.target.value })} className="w-full h-8 px-2 rounded-md border border-slate-200 text-[12px] outline-none focus:border-blue-500">
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                  <option value="lifetime">Lifetime</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Start Date</label>
                <input type="date" required value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className="w-full h-8 px-2 rounded-md border border-slate-200 text-[12px] outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Expiry Date</label>
                <input type="date" value={formData.expiry_date} onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })} className="w-full h-8 px-2 rounded-md border border-slate-200 text-[12px] outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="h-8 px-4 rounded-md bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700 transition-colors">Create Package</button>
              <button type="button" onClick={() => setShowForm(false)} className="h-8 px-4 rounded-md border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Package</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">School</th>
              <th className="text-center px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Students</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Price</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Duration</th>
              <th className="text-center px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {packages.map((pkg) => (
              <tr key={pkg._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-2.5">
                  <span className="text-[12px] font-semibold text-slate-900">{pkg.package_name}</span>
                </td>
                <td className="px-4 py-2.5 text-[11px] text-slate-600">{pkg.school_id}</td>
                <td className="px-4 py-2.5 text-[11px] text-slate-600 text-center">{pkg.current_students}/{pkg.allowed_students}</td>
                <td className="px-4 py-2.5 text-[11px] font-bold text-slate-900 text-right">{formatCurrency(pkg.price)}</td>
                <td className="px-4 py-2.5 text-[11px] text-slate-600 capitalize">{pkg.duration_type}</td>
                <td className="px-4 py-2.5 text-center">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${pkg.is_expired ? 'bg-red-50 text-red-700' : pkg.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {pkg.is_expired ? 'Expired' : pkg.payment_status}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button onClick={() => handleDelete(pkg._id)} className="h-6 px-2 text-[10px] font-semibold text-red-600 hover:bg-red-50 rounded transition-colors">Delete</button>
                </td>
              </tr>
            ))}
            {packages.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">No packages found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
