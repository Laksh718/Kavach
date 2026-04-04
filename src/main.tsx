import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { router } from '@/router'
import '@/i18n'
import '@/styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/lib/supabase'

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { setSession } = useAuthStore()
  const [initialized, setInitialized] = React.useState(false)

  React.useEffect(() => {
    // 1. Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setInitialized(true)
    })

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [setSession])

  if (!initialized) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
        <div className="loading-spinner w-12 h-12 border-4" />
      </div>
    )
  }

  return <>{children}</>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#0F172A',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(99,102,241,0.15)',
            fontSize: '14px',
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: '500',
          },
          success: {
            iconTheme: { primary: '#10B981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#fff' },
            duration: 5000,
          },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>
)
