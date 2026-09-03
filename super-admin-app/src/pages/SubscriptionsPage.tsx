import { AppIcon } from "shared/ui/AppIcon";
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '@/lib/api'

interface Subscription {
  _id: string
  school_id: string
  school_name: string
  owner_name?: string
  owner_email?: string
  phone?: string
  plan_name: string
  student_limit: number
  price: number
  currency: string
  status: string
  is_trial: boolean
  start_date: string
  end_date: string
  days_remaining: number
  auto_renew: boolean
  approved_payments_count: number
  total_paid: number
  last_payment_at?: string
  created_at: string
}

interface PaymentRecord {
  id: string
  school_id: string
  plan_id: string
  plan_name: string
  transaction_id: string
  amount: number
  status: string
  screenshot_url: string
  submitted_at: string
  verified_at?: string
  notes?: string
}

export function SubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [extendingSub, setExtendingSub] = useState<Subscription | null>(null)
  const [extendDays, setExtendDays] = useState(30)
  const [submittingExtend, setSubmittingExtend] = useState(false)
  
  // History Modal State
  const [historySchool, setHistorySchool] = useState<{ id: string; name: string } | null>(null)
  const [schoolPayments, setSchoolPayments] = useState<PaymentRecord[]>([])
  const [loadingPayments, setLoadingPayments] = useState(false)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    setLoading(true)
    const res = await apiRequest('/api/super-admin/subscriptions')
    if (res.ok && res.data) {
      const d = res.data as any
      const items = Array.isArray(d) ? d : d.items || d.data || []
      setSubs(items)
    }
    setLoading(false)
  }

  const handleToggleAutoRenew = async (sub: Subscription) => {
    const updatedVal = !sub.auto_renew
    // Optimistic update
    setSubs(prev => prev.map(s => s._id === sub._id ? { ...s, auto_renew: updatedVal } : s))
    const res = await apiRequest(`/api/super-admin/subscriptions/${sub._id}/auto-renew`, {
      method: 'PATCH',
      body: JSON.stringify({ auto_renew: updatedVal })
    })
    if (!res.ok) {
      // Revert on error
      setSubs(prev => prev.map(s => s._id === sub._id ? { ...s, auto_renew: sub.auto_renew } : s))
      alert('Failed to update auto-renew status.')
    }
  }

  const handleExtendSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!extendingSub) return
    setSubmittingExtend(true)
    try {
      const res = await apiRequest('/api/super-admin/subscriptions/extend', {
        method: 'POST',
        body: JSON.stringify({
          school_id: extendingSub.school_id,
          days: Number(extendDays)
        })
      })
      if (res.ok) {
        setExtendingSub(null)
        await fetchSubscriptions()
      } else {
        alert(res.message || 'Failed to extend subscription.')
      }
    } finally {
      setSubmittingExtend(false)
    }
  }

  const openPaymentHistory = async (schoolId: string, schoolName: string) => {
    setHistorySchool({ id: schoolId, name: schoolName })
    setLoadingPayments(true)
    try {
      const res = await apiRequest(`/api/super-admin/schools/${schoolId}/payments`)
      if (res.ok && res.data) {
        const items = Array.isArray(res.data) ? res.data : (res.data as any).items || []
        setSchoolPayments(items)
      } else {
        setSchoolPayments([])
      }
    } finally {
      setLoadingPayments(false)
    }
  }

  const filtered = subs.filter((s) => {
    const matchesFilter = filter === 'all' || s.status === filter
    const matchesSearch = !search ||
      s.school_name.toLowerCase().includes(search.toLowerCase()) ||
      (s.owner_name && s.owner_name.toLowerCase().includes(search.toLowerCase())) ||
      (s.owner_email && s.owner_email.toLowerCase().includes(search.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const activeCount = subs.filter(s => s.status === 'active' && !s.is_trial).length
  const trialCount = subs.filter(s => s.is_trial || s.status === 'trial').length
  const expiredCount = subs.filter(s => s.status === 'expired' || s.days_remaining <= 0).length
  const totalRevenue = subs.reduce((acc, curr) => acc + (curr.total_paid || 0), 0)

  const statusBadge = (status: string, isTrial: boolean, daysRemaining: number) => {
    if (isTrial) {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-indigo-50 text-indigo-700 border-indigo-200">
          Trial ({daysRemaining}d left)
        </span>
      )
    }
    if (status === 'active') {
      if (daysRemaining <= 3) {
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200">
            Expiring ({daysRemaining}d)
          </span>
        )
      }
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
          Active ({daysRemaining}d)
        </span>
      )
    }
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-rose-50 text-rose-700 border-rose-200">
        Expired
      </span>
    )
  }

  const formatCleanPhone = (phone?: string) => {
    if (!phone) return ''
    return phone.replace(/[^0-9]/g, '')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Subscriptions & Renewals</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track customer subscription lifecycles, approval records, payment frequencies, and auto-renewals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchSubscriptions}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            <AppIcon name="RefreshCw" size={13} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Paid Plans</span>
            <AppIcon name="CheckCircle2" size={16} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{activeCount}</p>
          <span className="text-[10px] text-slate-400 font-medium">Paying subscriber institutions</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Free Trials</span>
            <AppIcon name="Award" size={16} className="text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{trialCount}</p>
          <span className="text-[10px] text-slate-400 font-medium">14-day evaluation accounts</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Expired / Past Due</span>
            <AppIcon name="AlertCircle" size={16} className="text-rose-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{expiredCount}</p>
          <span className="text-[10px] text-slate-400 font-medium">Require renewal confirmation</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Verified Revenue</span>
            <AppIcon name="TrendingUp" size={16} className="text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">Rs {totalRevenue.toLocaleString()}</p>
          <span className="text-[10px] text-slate-400 font-medium">Cumulative verified collections</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1 bg-slate-100/70 rounded-xl p-1 shrink-0 overflow-x-auto">
          {(['all', 'active', 'trial', 'expired'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`h-7 px-3 rounded-lg text-xs font-bold transition-all ${
                filter === f
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-sm">
          <AppIcon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search school or owner name..."
            className="w-full h-8 pl-9 pr-3 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs font-medium text-slate-400 flex flex-col items-center justify-center gap-2.5">
            <div className="h-7 w-7 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
            <span>Loading subscriber records...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-2.5">
              <AppIcon name="Award" size={24} />
            </div>
            <p className="text-sm font-bold text-slate-800">No subscriptions found</p>
            <p className="text-xs text-slate-400 mt-0.5">Try selecting a different filter tab or search keyword.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Institution & Owner</th>
                  <th className="px-5 py-3.5">Current Plan</th>
                  <th className="px-5 py-3.5 text-center">Status / Days Left</th>
                  <th className="px-5 py-3.5 text-center">Payment Approvals</th>
                  <th className="px-5 py-3.5 text-center">Auto-Renew</th>
                  <th className="px-5 py-3.5">Tenure</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((sub) => {
                  const cleanPhone = formatCleanPhone(sub.phone)
                  return (
                    <tr key={sub._id} className="hover:bg-slate-50/70 transition-colors">
                      {/* School & Owner */}
                      <td className="px-5 py-3.5">
                        <Link
                          to={`/schools/${sub.school_id}`}
                          className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors block"
                        >
                          {sub.school_name || "Owner Account"}
                        </Link>
                        {sub.owner_name && (
                          <span className="text-[11px] text-slate-500 font-medium block">
                            {sub.owner_name}
                          </span>
                        )}
                        {sub.phone && (
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-400 font-mono">{sub.phone}</span>
                            {cleanPhone && (
                              <a
                                href={`https://wa.me/${cleanPhone}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200 hover:text-emerald-700"
                              >
                                <AppIcon name="MessageSquare" size={10} />
                                <span>WhatsApp</span>
                              </a>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Current Plan & Limit */}
                      <td className="px-5 py-3.5">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-100 mb-1">
                          {sub.plan_name || "Starter Plan"}
                        </span>
                        <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5">
                          <span>Limit: {sub.student_limit} seats</span>
                          {sub.price > 0 && (
                            <span>· Rs {sub.price.toLocaleString()}/mo</span>
                          )}
                        </div>
                      </td>

                      {/* Status / Days Left */}
                      <td className="px-5 py-3.5 text-center">
                        {statusBadge(sub.status, sub.is_trial, sub.days_remaining)}
                        <span className="text-[10px] text-slate-400 block mt-1">
                          Renews: {new Date(sub.end_date).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Payment Approvals & Total LTV */}
                      <td className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => openPaymentHistory(sub.school_id, sub.school_name)}
                          className="group inline-flex flex-col items-center gap-0.5 p-1.5 rounded-xl hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-all text-center"
                          title="Click to view payment approval history"
                        >
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 group-hover:bg-emerald-100 text-emerald-700 font-black text-[11px] border border-emerald-200 flex items-center gap-1">
                            <AppIcon name="CheckCircle2" size={12} />
                            <span>{sub.approved_payments_count} Approved</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono font-bold group-hover:text-emerald-800">
                            Rs {(sub.total_paid || 0).toLocaleString()} LTV
                          </span>
                        </button>
                      </td>

                      {/* Auto-Renew Toggle */}
                      <td className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => handleToggleAutoRenew(sub)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            sub.auto_renew ? 'bg-blue-600' : 'bg-slate-200'
                          }`}
                          title={`Click to ${sub.auto_renew ? 'disable' : 'enable'} auto renewal`}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              sub.auto_renew ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span className="text-[9px] text-slate-400 font-bold block mt-0.5 uppercase">
                          {sub.auto_renew ? 'ON' : 'OFF'}
                        </span>
                      </td>

                      {/* Tenure */}
                      <td className="px-5 py-3.5 text-slate-500">
                        <p className="font-semibold text-slate-700">
                          {new Date(sub.start_date).toLocaleDateString()}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          to {new Date(sub.end_date).toLocaleDateString()}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setExtendingSub(sub)}
                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-xs font-bold text-slate-700 transition-all flex items-center gap-1 shadow-sm"
                            title="Grant days to this subscription"
                          >
                            <AppIcon name="CalendarPlus" size={13} />
                            <span>+Days</span>
                          </button>
                          <button
                            onClick={() => openPaymentHistory(sub.school_id, sub.school_name)}
                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all flex items-center gap-1 shadow-sm"
                            title="View all receipts"
                          >
                            <AppIcon name="Receipt" size={13} />
                            <span>Receipts</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grant / Extend Days Modal */}
      {extendingSub && (
        <div
          onClick={() => setExtendingSub(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">Extend Subscription</h3>
                <p className="text-xs text-slate-500 mt-0.5">{extendingSub.school_name}</p>
              </div>
              <button
                onClick={() => setExtendingSub(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
              >
                <AppIcon name="X" size={18} />
              </button>
            </div>

            <form onSubmit={handleExtendSubmit} className="space-y-4 pt-1">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Additional Days to Grant
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[7, 14, 30, 90].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setExtendDays(d)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        extendDays === d
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      +{d} Days
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={extendDays}
                  onChange={(e) => setExtendDays(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
                <div className="flex justify-between font-medium">
                  <span>Current Renewal Date:</span>
                  <span className="font-bold text-slate-900">{new Date(extendingSub.end_date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between font-medium text-blue-700">
                  <span>New Renewal Date:</span>
                  <span className="font-black">
                    {new Date(new Date(extendingSub.end_date).getTime() + extendDays * 86400000).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setExtendingSub(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingExtend}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submittingExtend ? 'Updating...' : 'Grant & Extend Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment History & Receipts Drawer / Modal */}
      {historySchool && (
        <div
          onClick={() => setHistorySchool(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden"
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <h3 className="text-base font-black text-slate-900">Payment Approval History</h3>
                <p className="text-xs text-slate-500">{historySchool.name}</p>
              </div>
              <button
                onClick={() => setHistorySchool(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
              >
                <AppIcon name="X" size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-3">
              {loadingPayments ? (
                <div className="p-12 text-center text-xs text-slate-400">Loading payment receipts...</div>
              ) : schoolPayments.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400 font-medium">
                  No payment records found for this institution.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                  {schoolPayments.map((p, idx) => (
                    <div key={p.id} className="p-4 bg-white flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            Rs {p.amount.toLocaleString()}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            p.status === 'verified'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : p.status === 'pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            {p.status === 'verified' ? 'Approved' : p.status}
                          </span>
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {p.plan_name}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-slate-500">
                          Ref: <span className="font-bold text-slate-800">{p.transaction_id}</span>
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Submitted on {new Date(p.submitted_at).toLocaleString()}
                          {p.verified_at && ` · Approved on ${new Date(p.verified_at).toLocaleDateString()}`}
                        </p>
                      </div>

                      <div>
                        {p.screenshot_url ? (
                          <a
                            href={p.screenshot_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors shadow-sm"
                          >
                            <AppIcon name="ExternalLink" size={13} />
                            <span>View Proof</span>
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">No screenshot</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex justify-end">
              <button
                onClick={() => setHistorySchool(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
