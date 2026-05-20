import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '@/lib/api'

interface School {
  _id: string
  school_id: string
  name: string
  code: string
  status: string
  owner_email: string
  student_count: number
  teacher_count: number
  class_count: number
  plan: string
  revenue: number
  expiry: string
  created_at: string
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) return `Rs ${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `Rs ${(amount / 1000).toFixed(1)}K`
  return `Rs ${amount.toLocaleString()}`
}

export function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  const loadSchools = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (search) params.set('search', search)
    const res = await apiRequest(`/api/super-admin/schools?${params}`)
    if (res.ok && res.data) {
      const d = res.data as any
      setSchools(d.items || d.data || [])
    }
    setLoading(false)
  }

  useEffect(() => { loadSchools() }, [statusFilter])

  const handleAction = async (schoolId: string, action: 'approve' | 'suspend' | 'renew') => {
    const endpoint = action === 'renew' ? 'approve' : action
    const res = await apiRequest(`/api/super-admin/schools/${schoolId}/${endpoint}`, {
      method: 'POST',
      body: JSON.stringify({ reason: action === 'suspend' ? 'Admin action' : 'Subscription renewal' }),
    })
    if (res.ok) loadSchools()
  }

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700',
    suspended: 'bg-red-50 text-red-700',
    pending: 'bg-amber-50 text-amber-700',
    expired: 'bg-slate-50 text-slate-600',
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Schools</h1>
          <p className="text-xs text-slate-500 mt-0.5">{schools.length} schools on the platform</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200">
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadSchools()}
            placeholder="Search schools..."
            className="w-full h-8 pl-9 pr-3 rounded-md border border-slate-200 text-[12px] outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-8 px-3 rounded-md border border-slate-200 text-[12px] font-semibold text-slate-600 outline-none"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
          <option value="expired">Expired</option>
        </select>
        <button onClick={loadSchools} className="h-8 px-3 rounded-md border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-400">Loading schools...</div>
        ) : schools.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-3xl text-slate-300 mb-2">apartment</span>
            <p className="text-sm font-medium text-slate-500">No schools found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">School</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Plan</th>
                <th className="text-center px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Students</th>
                <th className="text-center px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Revenue</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Expiry</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {schools.map((school) => (
                <tr key={school._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-2.5">
                    <Link to={`/schools/${school._id}`} className="block group">
                      <p className="text-[12px] font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{school.name}</p>
                      <p className="text-[10px] text-slate-400">{school.code}</p>
                    </Link>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-[11px] font-semibold text-slate-700">{school.plan || 'Free'}</span>
                  </td>
                  <td className="px-4 py-2.5 text-[11px] text-slate-600 text-center">{school.student_count}</td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${statusColors[school.status] || statusColors.expired}`}>
                      {school.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="text-[11px] font-bold text-slate-900">{formatCurrency(school.revenue || 0)}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-[10px] text-slate-500">
                      {school.expiry ? new Date(school.expiry).toLocaleDateString() : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link to={`/schools/${school._id}`} className="h-6 px-2 text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 transition-colors">
                        View
                      </Link>
                      {school.status === 'pending' && (
                        <button onClick={() => handleAction(school._id, 'approve')} className="h-6 px-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded hover:bg-emerald-100 transition-colors">
                          Approve
                        </button>
                      )}
                      {school.status === 'active' && (
                        <button onClick={() => handleAction(school._id, 'suspend')} className="h-6 px-2 text-[10px] font-semibold text-red-700 bg-red-50 rounded hover:bg-red-100 transition-colors">
                          Suspend
                        </button>
                      )}
                      {(school.status === 'suspended' || school.status === 'expired') && (
                        <button onClick={() => handleAction(school._id, 'approve')} className="h-6 px-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded hover:bg-emerald-100 transition-colors">
                          Activate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
