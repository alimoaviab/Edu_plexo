import { useEffect, useState } from 'react'
import { apiRequest } from '@/lib/api'

interface Expense {
  _id: string
  title: string
  amount: number
  expense_type: string
  note: string
  created_by: string
  created_at: string
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) return `Rs ${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `Rs ${(amount / 1000).toFixed(1)}K`
  return `Rs ${amount.toLocaleString()}`
}

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    expense_type: 'mutual',
    note: '',
  })

  useEffect(() => {
    fetchExpenses()
  }, [typeFilter])

  const fetchExpenses = async () => {
    setLoading(true)
    const url = typeFilter ? `/api/super-admin/expenses?type=${typeFilter}` : '/api/super-admin/expenses'
    const response = await apiRequest(url)
    if (response.ok && response.data) {
      setExpenses(response.data.items || [])
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await apiRequest('/api/super-admin/expenses', {
      method: 'POST',
      body: JSON.stringify({
        title: formData.title,
        amount: parseFloat(formData.amount),
        expense_type: formData.expense_type,
        note: formData.note,
      }),
    })
    if (response.ok) {
      setShowForm(false)
      setFormData({ title: '', amount: '', expense_type: 'mutual', note: '' })
      fetchExpenses()
    }
  }

  const expenseTypes = [
    { value: '', label: 'All' },
    { value: 'mutual', label: 'Mutual' },
    { value: 'ali', label: 'Ali' },
    { value: 'abdul_rehman', label: 'Abdul Rehman' },
  ]

  if (loading) return <div className="p-8 text-center text-sm text-slate-400">Loading expenses...</div>

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Expense Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">{expenses.length} expenses</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="h-8 px-3 rounded-lg bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700 transition-colors">
          + New Expense
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Add New Expense</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Title</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full h-8 px-2 rounded-md border border-slate-200 text-[12px] outline-none focus:border-blue-500" placeholder="AWS Server" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Amount (Rs)</label>
                <input type="number" step="0.01" required value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full h-8 px-2 rounded-md border border-slate-200 text-[12px] outline-none focus:border-blue-500" placeholder="5000" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Type</label>
                <select value={formData.expense_type} onChange={(e) => setFormData({ ...formData, expense_type: e.target.value })} className="w-full h-8 px-2 rounded-md border border-slate-200 text-[12px] outline-none focus:border-blue-500">
                  <option value="mutual">Mutual</option>
                  <option value="ali">Ali</option>
                  <option value="abdul_rehman">Abdul Rehman</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Notes</label>
                <input type="text" value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} className="w-full h-8 px-2 rounded-md border border-slate-200 text-[12px] outline-none focus:border-blue-500" placeholder="Details..." />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="h-8 px-4 rounded-md bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700 transition-colors">Add Expense</button>
              <button type="button" onClick={() => setShowForm(false)} className="h-8 px-4 rounded-md border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-1.5">
        {expenseTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setTypeFilter(type.value)}
            className={`h-7 px-3 rounded-md text-[11px] font-bold transition-colors ${typeFilter === type.value ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Title</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Notes</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {expenses.map((expense) => (
              <tr key={expense._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-2.5">
                  <span className="text-[12px] font-semibold text-slate-900">{expense.title}</span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="text-[10px] font-bold text-slate-600 capitalize">{expense.expense_type.replace('_', ' ')}</span>
                </td>
                <td className="px-4 py-2.5 text-[11px] text-slate-500">{expense.note || '—'}</td>
                <td className="px-4 py-2.5 text-[11px] font-bold text-slate-900 text-right">{formatCurrency(expense.amount)}</td>
                <td className="px-4 py-2.5 text-[10px] text-slate-500">{new Date(expense.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">No expenses found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
