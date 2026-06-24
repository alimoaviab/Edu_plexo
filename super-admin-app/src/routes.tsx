import { lazy, Suspense, type ComponentType } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { LoginPage } from './pages/LoginPage'

function lazyPage(importFn: () => Promise<any>, exportName: string) {
  const LazyComponent = lazy(async () => {
    const mod = await importFn()
    return { default: (mod as Record<string, ComponentType>)[exportName] }
  })

  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-500">Loading...</div>}>
      <LazyComponent />
    </Suspense>
  )
}

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      { path: '/dashboard', element: lazyPage(() => import('./pages/DashboardPage'), 'DashboardPage') },
      { path: '/schools', element: lazyPage(() => import('./pages/SchoolsPage'), 'SchoolsPage') },
      { path: '/schools/:id', element: lazyPage(() => import('./pages/SchoolDetailPage'), 'SchoolDetailPage') },
      { path: '/users', element: lazyPage(() => import('./pages/UsersPage'), 'UsersPage') },
      { path: '/payments', element: lazyPage(() => import('./pages/PaymentsPage'), 'PaymentsPage') },
      { path: '/packages', element: lazyPage(() => import('./pages/PackagesPage'), 'PackagesPage') },
      { path: '/subscriptions', element: lazyPage(() => import('./pages/SubscriptionsPage'), 'SubscriptionsPage') },
      { path: '/ai-usage', element: lazyPage(() => import('./pages/AIUsagePage'), 'AIUsagePage') },
      { path: '/settings', element: lazyPage(() => import('./pages/SettingsPage'), 'SettingsPage') },
      { path: '/moderation', element: lazyPage(() => import('./pages/ModerationPage'), 'ModerationPage') },
      { path: '/question-bank', element: lazyPage(() => import('./pages/GlobalQuestionBankPage'), 'GlobalQuestionBankPage') },
      { path: '/hierarchy', element: lazyPage(() => import('./pages/HierarchyPage'), 'HierarchyPage') },
      { path: '/csv-imports', element: lazyPage(() => import('./pages/CSVImportsPage'), 'CSVImportsPage') },
    ],
  },
])
