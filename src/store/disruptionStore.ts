import { create } from 'zustand'
import type { DisruptionEvent } from '@/types/disruption.types'

interface DisruptionState {
  activeEvents: DisruptionEvent[]
  setActiveEvents: (events: DisruptionEvent[]) => void
  addEvent: (event: DisruptionEvent) => void
  clearEvents: () => void
}

export const useDisruptionStore = create<DisruptionState>((set) => ({
  activeEvents: [],

  setActiveEvents: (events) => set({ activeEvents: events }),

  addEvent: (event) =>
    set((state) => ({
      activeEvents: [...state.activeEvents.filter((e) => e.id !== event.id), event],
    })),

  clearEvents: () => set({ activeEvents: [] }),
}))

// Selector for active disruption in current zone
export const selectActiveDisruptionInZone = (zoneId: string) =>
  (state: DisruptionState) =>
    state.activeEvents.find((e) => e.zoneId === zoneId) ?? null
