import { AppIcon } from "shared/ui/AppIcon";
import { useEffect, useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { apiRequest, clearStoredSession } from '@/lib/api'
import { ThemeToggle } from '@/components/ThemeToggle'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { label: 'Schools', href: '/schools', icon: 'apartment' },
  { label: 'Question Bank', href: '/question-bank', icon: 'quiz' },
  { label: 'Moderation', href: '/moderation', icon: 'shield' },
  { label: 'Hierarchy', href: '/hierarchy', icon: 'schema' },
  { label: 'CSV Imports', href: '/csv-imports', icon: 'cloud_upload' },
  { label: 'Payments', href: '/payments', icon: 'payments' },
  { label: 'Packages', href: '/packages', icon: 'inventory_2' },
  { label: 'Subscriptions', href: '/subscriptions', icon: 'card_membership' },
  { label: 'AI Usage', href: '/ai-usage', icon: 'smart_toy' },
  { label: 'Users', href: '/users', icon: 'group' },
  { label: 'Settings', href: '/settings', icon: 'settings' },
]

interface SAUser {
  id: string
  email: string
  role: string
  school_id: string
}

export function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState<SAUser | null>(null)

  useEffect(() => {
    const hydrate = async () => {
      const userJson = sessionStorage.getItem('sa_user')
      if (userJson) {
        try {
          const parsed = JSON.parse(userJson) as SAUser
          if (parsed.role === 'super_admin') {
            setUser(parsed)
            return
          }
        } catch {
          clearStoredSession()
        }
      }

      const res = await apiRequest<{
        user_id: string
        email: string
        role: string
        school_id: string
      }>('/api/auth/session')
      if (!res.ok || res.data?.role !== 'super_admin') {
        clearStoredSession()
        navigate('/login', { replace: true })
        return
      }

      const sessionUser = {
        id: res.data.user_id,
        email: res.data.email,
        role: res.data.role,
        school_id: res.data.school_id,
      }
      sessionStorage.setItem('sa_user', JSON.stringify(sessionUser))
      setUser(sessionUser)
    }
    void hydrate()
  }, [navigate])

  const handleLogout = () => {
    void apiRequest('/api/auth/logout', { method: 'POST' })
    clearStoredSession()
    navigate('/login', { replace: true })
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background text-text-primary">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col">
        <div className="h-14 flex items-center justify-between px-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-sm shadow-primary/20">
              <AppIcon name="ShieldAlert" size={14} className="text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-text-primary block leading-none">Eduplexo</span>
              <span className="text-[10px] text-text-muted font-medium">Super Admin</span>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-sm shadow-primary/20'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }`}
              >
                <AppIcon name={item.icon} size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-border space-y-2">
          {/* User info */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-muted">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
              {(user.email || 'U').substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-text-primary truncate">{user.email}</p>
              <p className="text-[10px] text-text-muted capitalize">{user.role.replace('_', ' ')}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:bg-red-500/10 hover:text-red-500 transition-all w-full"
          >
            <AppIcon name="LogOut" size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
