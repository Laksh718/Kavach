import { create } from 'zustand'
import type { Worker } from '@/types/worker.types'
import { supabase } from '@/lib/supabase'
import type { Session, User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  worker: Worker | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean

  setSession: (session: Session | null) => void
  setWorker: (worker: Worker | null) => void
  logout: () => Promise<void>
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  worker: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,

  setSession: (session) => {
    set({ 
      session, 
      user: session?.user ?? null, 
      isAuthenticated: !!session,
      isLoading: false 
    })
  },

  setWorker: (worker) => set({ worker }),

  logout: async () => {
    await supabase.auth.signOut()
    set({ session: null, user: null, worker: null, isAuthenticated: false })
  },

  setLoading: (isLoading) => set({ isLoading }),
}))

// Initialize auth listener
// Removed from module scope to prevent HMR loops. 
// Now managed in src/main.tsx lifecycle.
