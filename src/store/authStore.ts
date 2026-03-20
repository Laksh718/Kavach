import { create } from 'zustand'
import type { Worker } from '@/types/worker.types'

interface AuthState {
  worker: Worker | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean

  login: (token: string, worker: Worker) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  worker: null,
  token: localStorage.getItem('kavach_token'),
  isAuthenticated: !!localStorage.getItem('kavach_token'),
  isLoading: false,

  login: (token, worker) => {
    localStorage.setItem('kavach_token', token)
    set({ token, worker, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('kavach_token')
    set({ token: null, worker: null, isAuthenticated: false })
  },

  setLoading: (isLoading) => set({ isLoading }),
}))
