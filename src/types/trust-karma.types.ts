import type { TrustKarmaTier } from './worker.types'

export interface TrustKarma {
  workerId: string
  score: number
  tier: TrustKarmaTier
  history: TrustKarmaEvent[]
}

export interface TrustKarmaEvent {
  date: string
  action: string
  pointChange: number
  balanceAfter: number
}
