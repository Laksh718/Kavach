import { create } from 'zustand'
import type { PlanTier, PolicyStatus } from '@/types/worker.types'

interface PolicyState {
  tier: PlanTier
  status: PolicyStatus
  weeklyPremium: number
  pausesUsedThisYear: number
  nextRenewalDate: string
  
  setTier: (tier: PlanTier) => void
  setStatus: (status: PolicyStatus) => void
  pause: () => void
  cancel: () => void
  reset: () => void
}

export const usePolicyStore = create<PolicyState>((set) => ({
  tier: 'standard',
  status: 'active',
  weeklyPremium: 500,
  pausesUsedThisYear: 0,
  nextRenewalDate: '2026-03-23T00:00:00Z',

  setTier: (tier) => {
    const premiums: Record<PlanTier, number> = { starter: 350, standard: 500, shield: 700 }
    set({ tier, weeklyPremium: premiums[tier] })
  },

  setStatus: (status) => set({ status }),

  pause: () => set((s) => ({
    status: 'paused',
    pausesUsedThisYear: s.pausesUsedThisYear + 1,
  })),

  cancel: () => set({ status: 'lapsed' }),

  reset: () => set({
    tier: 'standard',
    status: 'active',
    weeklyPremium: 500,
    pausesUsedThisYear: 0,
  }),
}))
