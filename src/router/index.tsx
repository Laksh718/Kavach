import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

// Lazy imports for code splitting
const Landing = lazy(() => import('@/pages/Landing'))
const Onboarding = lazy(() => import('@/pages/Onboarding'))
const WorkerDashboard = lazy(() => import('@/pages/WorkerDashboard'))
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'))
const InsurerPortal = lazy(() => import('@/pages/InsurerPortal'))

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="loading-spinner w-12 h-12 border-4" />
        <p className="text-gray-500 text-sm font-dm">Loading...</p>
      </div>
    </div>
  )
}

function withSuspense(Component: React.ComponentType) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) return <PageLoader />
  if (!isAuthenticated) return <Navigate to="/onboard" replace />

  return <>{children}</>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: withSuspense(Landing),
  },
  {
    path: '/onboard',
    element: withSuspense(Onboarding),
  },
  {
    path: '/onboarding',
    element: <Navigate to="/onboard" replace />,
  },
  {
    path: '/dashboard/*',
    element: (
      <ProtectedRoute>
        {withSuspense(WorkerDashboard)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/worker/*',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/admin/*',
    element: (
      <ProtectedRoute>
        {withSuspense(AdminDashboard)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin-dashboard/*',
    element: <Navigate to="/admin" replace />,
  },
  {
    path: '/insurer/*',
    element: (
      <ProtectedRoute>
        {withSuspense(InsurerPortal)}
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
