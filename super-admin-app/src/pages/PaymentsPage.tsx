import { AppIcon } from "shared/ui/AppIcon";
import { useEffect, useState } from 'react'
import { apiRequest } from '@/lib/api'
import { showToast } from '@/utils/toast'

interface PaymentRequest {
  id: string
  school_id: string
  school_name: string
  owner_name?: string
  phone?: string
  whatsapp?: string
  plan_name: string
  amount: number
  status: string
  transaction_id: string
  screenshot_url: string
  notes: string
  submitted_at: string
  verified_at?: string
  rejection_reason?: string
}

export function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<{ type: 'verify' | 'reject'; payment: PaymentRequest } | null>(null)
  const [rejectReason, setRejectReason] = useState('Payment could not be verified with bank.')

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    setLoading(true)
    const res = await apiRequest('/api/admin/payments/all')
    if (res.ok && res.data) {
      const raw = Array.isArray(res.data) 
        ? res.data 
        : (res.data as any).items || (res.data as any).data || []
      const seen = new Set<string>()
      const items = raw.filter((p: PaymentRequest) => {
        if (!p.id || seen.has(p.id)) return false
        seen.add(p.id)
        return true
      })
      setPayments(items)
    }
    setLoading(false)
  }

  const handleVerify = async (id: string) => {
    setActionLoading(id)
    try {
      const res = await apiRequest(`/api/admin/payments/${id}/verify`, { method: 'POST' })
      if (res.ok) {
        const body = res.data as any
        if (body?.already_processed) {
          showToast('This payment was already processed.', 'info')
        } else if (body?.scheduled) {
          showToast(`Payment approved. ${body.plan || 'Plan'} will activate after the current trial ends.`, 'success')
        } else {
          showToast(`Payment approved. ${body?.plan || 'Plan'} is now active.`, 'success')
        }
        await fetchPayments()
      } else {
        showToast(res.message || 'Failed to verify payment.', 'error')
      }
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (id: string, reason: string) => {
    setActionLoading(id)
    try {
      const res = await apiRequest(`/api/admin/payments/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason: reason.trim() || 'Payment not verified' }),
      })
      if (res.ok) {
        showToast('Payment rejected. The Owner will see the reason and can resubmit.', 'success')
        await fetchPayments()
      } else {
        showToast(res.message || 'Failed to reject payment.', 'error')
      }
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = payments.filter((p) => {
    if (tab === 'pending') return p.status === 'pending'
    if (tab === 'approved') return p.status === 'verified'
    return p.status === 'rejected'
  })

  const pendingCount = payments.filter(p => p.status === 'pending').length
  const approvedCount = payments.filter(p => p.status === 'verified').length
  const rejectedCount = payments.filter(p => p.status === 'rejected').length

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      rejected: 'bg-rose-50 text-rose-700 border-rose-200',
    }
    return `text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${map[s] || map.pending}`
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
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Subscription Payments</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review manual bank transfers & mobile wallet payment proofs submitted by school owners.
          </p>
        </div>
        <button
          onClick={fetchPayments}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all active:scale-95 disabled:opacity-50"
        >
          <AppIcon name="RefreshCw" size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metric Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Pending Verification', value: pendingCount, icon: 'Clock', color: 'text-amber-500', activeBorder: 'border-amber-500 bg-amber-50/20', tab: 'pending' as const },
          { label: 'Approved & Active', value: approvedCount, icon: 'CheckCircle2', color: 'text-emerald-500', activeBorder: 'border-emerald-500 bg-emerald-50/20', tab: 'approved' as const },
          { label: 'Rejected', value: rejectedCount, icon: 'XCircle', color: 'text-rose-500', activeBorder: 'border-rose-500 bg-rose-50/20', tab: 'rejected' as const },
        ].map((s) => (
          <button
            key={s.label}
            onClick={() => setTab(s.tab)}
            className={`bg-white rounded-2xl border p-4 text-left transition-all shadow-sm ${
              tab === s.tab ? `${s.activeBorder} shadow-md` : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</span>
              <AppIcon name={s.icon} size={18} className={s.color} />
            </div>
            <p className="text-2xl font-black text-slate-900">{s.value}</p>
          </button>
        ))}
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-sm font-medium text-slate-400 flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
            <span>Loading payment proofs...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-3 shadow-sm">
              <AppIcon name="CreditCard" size={26} />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No {tab} payments found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {tab === 'pending'
                ? "There are currently no new payment requests awaiting your review."
                : `No payments currently marked as ${tab}.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">School & Owner</th>
                  <th className="px-5 py-3.5">Plan & Amount</th>
                  <th className="px-5 py-3.5">Tx ID / Reference</th>
                  <th className="px-5 py-3.5">Payment Proof</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => {
                  const cleanPhone = formatCleanPhone(p.phone || p.whatsapp)
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* School & Owner */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900 text-sm">{p.school_name || "Owner Account"}</p>
                        {p.owner_name && (
                          <p className="text-[11px] text-slate-500 font-medium">{p.owner_name}</p>
                        )}
                        {p.phone && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-slate-500 font-mono">{p.phone}</span>
                            {cleanPhone && (
                              <a
                                href={`https://wa.me/${cleanPhone}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200"
                                title="Chat on WhatsApp"
                              >
                                <AppIcon name="MessageSquare" size={11} />
                                <span>WhatsApp</span>
                              </a>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Plan & Amount */}
                      <td className="px-5 py-4">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[11px] mb-1">
                          {p.plan_name || "Subscription"}
                        </span>
                        <p className="font-mono font-black text-slate-900 text-sm">
                          Rs {p.amount.toLocaleString()}
                        </p>
                      </td>

                      {/* Reference No */}
                      <td className="px-5 py-4">
                        <div className="space-y-1 max-w-[200px]">
                          <span className="font-mono font-bold text-slate-900 text-xs block select-all bg-slate-100 px-2 py-1 rounded border border-slate-200">
                            {p.transaction_id || "—"}
                          </span>
                          {p.notes && (
                            <p className="text-[10px] text-slate-500 italic line-clamp-2 bg-slate-50 p-1.5 rounded border border-slate-100">
                              "{p.notes}"
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Proof Screenshot */}
                      <td className="px-5 py-4">
                        {p.screenshot_url ? (
                          <div className="flex items-center gap-2.5">
                            {p.screenshot_url.startsWith("data:image") || p.screenshot_url.startsWith("http") ? (
                              <button
                                onClick={() => setSelectedImage(p.screenshot_url)}
                                className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0 hover:ring-2 hover:ring-blue-500 transition-all shadow-sm group relative"
                                title="Click to enlarge"
                              >
                                <img
                                  src={p.screenshot_url}
                                  alt="Proof thumbnail"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              </button>
                            ) : null}

                            <div className="flex flex-col gap-1">
                              <a
                                href={p.screenshot_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg border border-blue-200 transition-colors shadow-sm"
                              >
                                <AppIcon name="ExternalLink" size={13} />
                                <span>Open in New Tab</span>
                              </a>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">No screenshot (SMS reference)</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 text-center">
                        <span className={statusBadge(p.status)}>
                          {p.status === 'verified' ? 'Approved' : p.status}
                        </span>
                        {p.rejection_reason && (
                          <p className="text-[10px] text-rose-600 font-medium mt-1 max-w-[150px] mx-auto line-clamp-2">
                            {p.rejection_reason}
                          </p>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-slate-500 font-medium whitespace-nowrap">
                        <p className="font-semibold text-slate-700">
                          {new Date(p.submitted_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(p.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        {p.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => { setRejectReason('Payment could not be verified with bank.'); setConfirmAction({ type: 'reject', payment: p }) }}
                              disabled={actionLoading === p.id}
                              className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 flex items-center gap-1"
                            >
                              <AppIcon name="X" size={13} />
                              <span>Reject</span>
                            </button>
                            <button
                              onClick={() => setConfirmAction({ type: 'verify', payment: p })}
                              disabled={actionLoading === p.id}
                              className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm shadow-emerald-600/30 active:scale-95 disabled:opacity-50 flex items-center gap-1"
                            >
                              <AppIcon name="Check" size={13} />
                              <span>{actionLoading === p.id ? "Activating..." : "Approve Plan"}</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-mono">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm Action Modal */}
      {confirmAction && (
        <div
          onClick={() => setConfirmAction(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {confirmAction.type === 'verify' ? 'Approve Payment' : 'Reject Payment'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {confirmAction.payment.school_name || 'Owner Account'} · Rs {confirmAction.payment.amount.toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setConfirmAction(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
              >
                <AppIcon name="X" size={18} />
              </button>
            </div>

            {confirmAction.type === 'verify' ? (
              <p className="text-xs text-slate-600 leading-relaxed">
                Approving this payment verifies the transaction and updates the subscription lifecycle. If the Owner is on trial, the plan is scheduled to activate when the trial ends. Double approval is safe — the second click reports the payment as already processed.
              </p>
            ) : (
              <div>
                <p className="text-xs text-slate-600 mb-2">
                  Enter the rejection reason — the Owner will see it and can resubmit.
                </p>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-rose-400 transition-colors resize-none"
                  placeholder="Reason for rejection..."
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const p = confirmAction.payment
                  setConfirmAction(null)
                  if (confirmAction.type === 'verify') {
                    await handleVerify(p.id)
                  } else {
                    await handleReject(p.id, rejectReason)
                  }
                }}
                disabled={actionLoading === confirmAction.payment.id}
                className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-md transition-all disabled:opacity-50 ${
                  confirmAction.type === 'verify'
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                    : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
                }`}
              >
                {actionLoading === confirmAction.payment.id
                  ? 'Processing...'
                  : confirmAction.type === 'verify'
                  ? 'Confirm Approval'
                  : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Image Preview Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-800"
          >
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AppIcon name="Image" size={18} className="text-blue-400" />
                <span className="text-sm font-bold">Payment Proof Screenshot</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={selectedImage}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <AppIcon name="ExternalLink" size={13} />
                  <span>Open Full Size</span>
                </a>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <AppIcon name="X" size={18} />
                </button>
              </div>
            </div>
            <div className="p-4 bg-slate-100 overflow-auto flex items-center justify-center flex-1">
              <img
                src={selectedImage}
                alt="Enlarged Proof"
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
