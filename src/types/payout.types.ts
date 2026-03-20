export type PayoutStatus = 'auto_approved' | 'manual_review' | 'approved' | 'rejected' | 'processing' | 'completed'

export interface Payout {
  id: string
  workerId: string
  claimId: string
  disruptionEventId: string
  status: PayoutStatus
  expectedEarnings: number
  actualEarnings: number
  shortfall: number
  coveragePercent: number
  severityMultiplier: number
  payoutAmount: number
  fraudScore: number
  disruptionType: string
  zone: string
  createdAt: string
  completedAt?: string
  upiTransactionId?: string
}
