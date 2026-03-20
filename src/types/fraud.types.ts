export interface FraudScore {
  claimId: string
  das: number
  wbs: number
  nfs: number
  finalScore: number
  routing: 'auto_approve' | 'approve_audit' | 'manual_review' | 'escalate'
  shapValues: ShapFeature[]
}

export interface ShapFeature {
  feature: string
  value: number
  impact: number
}

export interface FraudQueueItem {
  id: string
  workerIdMasked: string
  fraudScore: FraudScore
  claimAmount: number
  createdAt: string
  slaDeadline: string
  zone: string
  city: string
}
