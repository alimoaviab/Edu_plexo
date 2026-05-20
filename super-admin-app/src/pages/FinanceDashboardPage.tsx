import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '@/lib/api'

interface FinanceStats {
  total_revenue: number
  monthly_revenue: number
  total_expenses: number
  net_profit: number
  expense_breakdown: Record<string, number>
  total_schools: number
  active_packages: number
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) return `Rs ${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `Rs ${(amount / 1000).toFixed(1)}K`
  return `Rs ${amount.toLocaleString()}`
}

export function FinanceDashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<FinanceStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    setLoading(true)
    const response = await apiRequest('/api/super-admin/finance/dashboard')
    if (response.ok && response.data) {
      setStats(response.data)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="h-8 w-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!stats) return null

  const profitMargin = stats.total_revenue > 0 ? ((stats.net_profit / stats.total_revenue) * 100).toFixed(1) : '0'

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Finance Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">Revenue, expenses, and profitability overview</p>
        </div>
        <button onClick={loadStats} className="h-7 px-3 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-sm text-blue-600">trending_up</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Revenue</span>
          </div>
          <p className="text-xl font-bold text-slate-900">{formatCurrency(stats.total_revenue)}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-sm text-blue-600">calendar_month</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Monthly Revenue</span>
          </div>
          <p className="text-xl font-bold text-slate-900">{formatCurrency(stats.monthly_revenue)}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-sm text-blue-600">trending_down</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Expenses</span>
          </div>
          <p className="text-xl font-bold text-slate-900">{formatCurrency(stats.total_expenses)}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-sm text-blue-600">account_balance</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Net Profit</span>
          </div>
          <p className={`text-xl font-bold ${stats.net_profit >= 0 ? 'text-slate-900' : 'text-red-600'}`}>{formatCurrency(stats.net_profit)}</p>
        </div>
      </div>

      {/* Expense Breakdown + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Expense Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(stats.expense_breakdown).map(([type, amount]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                  <span className="text-[11px] font-medium text-slate-600 capitalize">{type.replace('_', ' ')} Expenses</span>
                </div>
                <span className="text-[11px] font-bold text-slate-900">{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-600">Total Schools</span>
              <span className="text-[11px] font-bold text-slate-900">{stats.total_schools}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-600">Active Packages</span>
              <span className="text-[11px] font-bold text-slate-900">{stats.active_packages}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-700">Profit Margin</span>
              <span className="text-[11px] font-bold text-slate-900">{profitMargin}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button onClick={() => navigate('/packages')} className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors text-left">
            <span className="material-symbols-outlined text-sm text-blue-600">inventory_2</span>
            <span className="text-[11px] font-semibold text-slate-700">Manage Packages</span>
          </button>
          <button onClick={() => navigate('/expenses')} className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors text-left">
            <span className="material-symbols-outlined text-sm text-blue-600">receipt_long</span>
            <span className="text-[11px] font-semibold text-slate-700">Add Expense</span>
          </button>
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors text-left">
            <span className="material-symbols-outlined text-sm text-blue-600">dashboard</span>
            <span className="text-[11px] font-semibold text-slate-700">Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  )
}
