import { useEffect, useState } from 'react'
import { apiRequest } from '@/lib/api'

interface PaymentRequest {
  id: string
  school_name: string
  plan_name: string
  amount: number
  status: string
  transaction_id: string
  screenshot_url: string
  notes: string
  submitted_at: string
}

export function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    setLoading(true)
    const res = await apiRequest<PaymentRequest[]>('/api/admin/payments/pending')
    if (res.ok && res.data) {
      setPayments(res.data)
    }
    setLoading(false)
  }

  const handleVerify = async (id: string) => {
    const res = await apiRequest(`/api/admin/payments/${id}/verify`, { method: 'POST' })
    if (res.ok) fetchPayments()
  }

  const handleReject = async (id: string) => {
    const reason = prompt('Enter rejection reason:')
    if (reason === null) return
    const res = await apiRequest(`/api/admin/payments/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    })
    if (res.ok) fetchPayments()
  }

  if (loading) return <div className="p-8 text-center text-sm text-slate-400">Loading payments...</div>

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Subscription Payments</h1>
          <p className="text-xs text-slate-500 mt-0.5">{payments.length} pending verification</p>
        </div>
        <button onClick={fetchPayments} className="h-7 px-3 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">School</th>
              <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Plan / Amount</th>
              <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Proof</th>
              <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Submitted</th>
              <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-400">
                  No pending payments found.
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-2.5">
                    <p className="text-[12px] font-semibold text-slate-900">{p.school_name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{p.transaction_id}</p>
                  </td>
                  <td className="px-4 py-2.5">
                    <p className="text-[11px] font-semibold text-blue-600">{p.plan_name}</p>
                    <p className="text-[11px] font-bold text-slate-900">Rs {p.amount.toLocaleString()}</p>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="space-y-1">
                      {p.screenshot_url && (
                        <a href={p.screenshot_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:underline">
                          <span className="material-symbols-outlined text-sm">image</span>
                          Screenshot
                        </a>
                      )}
                      {p.notes && (
                        <p className="text-[10px] text-slate-500 italic line-clamp-2">"{p.notes}"</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-[10px] text-slate-500">
                    {new Date(p.submitted_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => handleReject(p.id)} className="h-6 px-2 text-[10px] font-semibold text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors">
                        Reject
                      </button>
                      <button onClick={() => handleVerify(p.id)} className="h-6 px-2 text-[10px] font-semibold text-white bg-emerald-600 rounded hover:bg-emerald-700 transition-colors">
                        Verify
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
