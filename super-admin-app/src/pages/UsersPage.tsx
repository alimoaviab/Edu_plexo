import { useEffect, useState } from 'react'
import { apiRequest } from '@/lib/api'

interface User {
  _id: string
  email: string
  role: string
  school_id: string
  status: string
  name: string
  created_at: string
}

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState('')
  const [search, setSearch] = useState('')

  const loadUsers = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (roleFilter) params.set('role', roleFilter)
    if (search) params.set('search', search)
    const res = await apiRequest(`/api/super-admin/users?${params}`)
    if (res.ok && res.data) {
      const d = res.data as any
      setUsers(d.items || d.data || [])
    }
    setLoading(false)
  }

  useEffect(() => { loadUsers() }, [roleFilter])

  const roleColors: Record<string, string> = {
    admin: 'bg-blue-50 text-blue-700',
    teacher: 'bg-indigo-50 text-indigo-700',
    student: 'bg-emerald-50 text-emerald-700',
    parent: 'bg-amber-50 text-amber-700',
    super_admin: 'bg-red-50 text-red-700',
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Platform Users</h1>
          <p className="text-xs text-slate-500 mt-0.5">{users.length} users across all schools</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200">
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
            placeholder="Search by name or email..."
            className="w-full h-8 pl-9 pr-3 rounded-md border border-slate-200 text-[12px] outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-8 px-3 rounded-md border border-slate-200 text-[12px] font-semibold text-slate-600 outline-none"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
          <option value="parent">Parent</option>
          <option value="super_admin">Super Admin</option>
        </select>
        <button onClick={loadUsers} className="h-8 px-3 rounded-md border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-400">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-3xl text-slate-300 mb-2">group</span>
            <p className="text-sm font-medium text-slate-500">No users found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="text-center px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="text-center px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">School</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-md bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                        {(user.name || user.email).substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[12px] font-semibold text-slate-900">{user.name || '—'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-[11px] text-slate-600">{user.email}</td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${roleColors[user.role] || 'bg-slate-50 text-slate-600'}`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${user.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-500'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-[10px] text-slate-400 font-mono">{user.school_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
