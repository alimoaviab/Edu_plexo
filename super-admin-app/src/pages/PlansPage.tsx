import { useEffect, useState } from 'react'
import { apiRequest } from '@/lib/api'

interface Plan {
  id: string
  name: string
  slug: string
  billing_cycle: string
  price: number
  student_limit: number
  teacher_limit: number
  trial_days: number
  is_active: boolean
}

export function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'monthly' | 'yearly'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    apiRequest('/api/super-admin/plans').then((res) => {
      if (res.ok && res.data) setPlans(res.data as Plan[])
      setLoading(false)
    })
  }, [])

  const filtered = plans.filter((p) => {
    const matchFilter = filter === 'all' || p.billing_cycle === filter
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const totalPlans = plans.length
  const activePlans = plans.filter((p) => p.is_active).length
  const trialPlans = plans.filter((p) => p.trial_days > 0).length
  const enterprisePlans = plans.filter((p) => p.name.toLowerCase().includes('enterprise')).length

  const getBadge = (plan: Plan) => {
    if (plan.trial_days > 0 && plan.price === 0) return { label: 'Trial', color: 'bg-slate-100 text-slate-700 border-slate-200' }
    if (plan.name.toLowerCase().includes('enterprise')) return { label: 'Enterprise', color: 'bg-blue-100 text-blue-700 border-blue-200' }
    if (plan.name.toLowerCase().includes('pro')) return { label: 'Popular', color: 'bg-blue-50 text-blue-700 border-blue-100' }
    if (plan.name.toLowerCase().includes('basic')) return { label: 'Starter', color: 'bg-slate-50 text-slate-600 border-slate-100' }
    return { label: 'Standard', color: 'bg-slate-50 text-slate-600 border-slate-100' }
  }

  const statusBadge = (active: boolean) => {
    if (active) return 'bg-blue-50 text-blue-700 border-blue-100'
    return 'bg-slate-50 text-slate-500 border-slate-100'
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Subscription Plans</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage platform plans and pricing tiers</p>
        </div>
        <button className="h-8 px-4 rounded-lg bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[14px]">add</span>
          Create Plan
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1 max-w-xs">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search plans..."
            className="w-full h-8 pl-9 pr-3 rounded-lg border border-slate-200 text-[12px] outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-0.5">
          {(['all', 'monthly', 'yearly'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`h-7 px-3 rounded-md text-[11px] font-semibold transition-colors ${filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Plan Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-white rounded-xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((plan) => {
            const badge = getBadge(plan)
            return (
              <div key={plan.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-blue-200 transition-colors group">
                {/* Card Header */}
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">card_membership</span>
                    </div>
                    <div>
                      <h3 className="text-[13px] font-bold text-slate-900">{plan.name}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusBadge(plan.is_active)}`}>
                      {plan.is_active ? 'Active' : 'Draft'}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="px-5 py-4 border-b border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[11px] font-semibold text-slate-500">Rs</span>
                    <span className="text-2xl font-bold text-slate-900">{plan.price.toLocaleString()}</span>
                    <span className="text-[11px] text-slate-500">/{plan.billing_cycle}</span>
                  </div>
                  {plan.trial_days > 0 && (
                    <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      <span className="material-symbols-outlined text-[12px]">schedule</span>
                      {plan.trial_days} days free trial
                    </span>
                  )}
                </div>

                {/* Limits */}
                <div className="px-5 py-3 border-b border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px] text-slate-400">school</span>
                      <span className="text-[11px] text-slate-500">Students</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-900">{plan.student_limit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px] text-slate-400">badge</span>
                      <span className="text-[11px] text-slate-500">Teachers</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-900">{plan.teacher_limit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px] text-slate-400">calendar_month</span>
                      <span className="text-[11px] text-slate-500">Billing</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-900 capitalize">{plan.billing_cycle}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-5 py-3 bg-slate-50/50 flex items-center justify-end gap-2">
                  <button className="h-6 px-2.5 text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    View
                  </button>
                  <button className="h-6 px-2.5 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors">
                    Edit
                  </button>
                  {plan.is_active ? (
                    <button className="h-6 px-2.5 text-[10px] font-semibold text-red-700 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors">
                      Disable
                    </button>
                  ) : (
                    <button className="h-6 px-2.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-100 transition-colors">
                      Enable
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Summary Cards */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {[
            { label: 'Total Plans', value: totalPlans, icon: 'list_alt', color: 'text-blue-600' },
            { label: 'Active Plans', value: activePlans, icon: 'check_circle', color: 'text-blue-600' },
            { label: 'Trial Plans', value: trialPlans, icon: 'schedule', color: 'text-slate-600' },
            { label: 'Enterprise', value: enterprisePlans, icon: 'business', color: 'text-slate-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`material-symbols-outlined text-[16px] ${s.color}`}>{s.icon}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">{s.label}</span>
              </div>
              <p className="text-xl font-bold text-slate-900">{s.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
