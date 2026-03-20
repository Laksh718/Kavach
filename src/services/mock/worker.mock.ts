import type { Worker, Policy, EarningsBaseline } from '@/types/worker.types'
import type { TrustKarma } from '@/types/trust-karma.types'
import type { Payout } from '@/types/payout.types'

export const mockWorker: Worker = {
  id: 'wkr_001',
  mobile: '+919876543210',
  name: 'Rajan Kumar',
  city: 'bengaluru',
  platforms: ['zomato', 'swiggy'],
  kycStatus: 'verified',
  language: 'hi',
  createdAt: '2024-01-15T10:00:00Z',
}

export const mockPolicy: Policy = {
  id: 'pol_001',
  workerId: 'wkr_001',
  tier: 'standard',
  status: 'active',
  weeklyPremium: 65,
  basePremium: 65,
  coveragePercent: 70,
  maxWeeklyPayout: 2500,
  startDate: '2024-01-15T00:00:00Z',
  nextRenewalDate: '2026-03-23T00:00:00Z',
  pausesUsedThisYear: 0,
}

export const mockEarningsBaseline: EarningsBaseline[] = [
  {
    workerId: 'wkr_001',
    platformId: 'zomato',
    dailyExpected: 520,
    thirtyDayAverage: 498,
    deviationFactor: 1.04,
    lastUpdated: '2026-03-20T06:00:00Z',
    source: 'aa_framework',
  },
  {
    workerId: 'wkr_001',
    platformId: 'swiggy',
    dailyExpected: 280,
    thirtyDayAverage: 265,
    deviationFactor: 1.06,
    lastUpdated: '2026-03-20T06:00:00Z',
    source: 'aa_framework',
  },
]

export const mockPayouts: Payout[] = [
  {
    id: 'pay_001',
    workerId: 'wkr_001',
    claimId: 'clm_001',
    disruptionEventId: 'evt_001',
    status: 'completed',
    expectedEarnings: 740,
    actualEarnings: 220,
    shortfall: 520,
    coveragePercent: 70,
    severityMultiplier: 1.0,
    payoutAmount: 364,
    fraudScore: 8,
    disruptionType: 'Heavy Rain',
    zone: 'Koramangala',
    createdAt: '2026-03-19T14:30:00Z',
    completedAt: '2026-03-19T14:34:00Z',
    upiTransactionId: 'UPI20260319143412BLR',
  },
  {
    id: 'pay_002',
    workerId: 'wkr_001',
    claimId: 'clm_002',
    disruptionEventId: 'evt_003',
    status: 'completed',
    expectedEarnings: 740,
    actualEarnings: 440,
    shortfall: 300,
    coveragePercent: 70,
    severityMultiplier: 1.0,
    payoutAmount: 210,
    fraudScore: 12,
    disruptionType: 'AQI Severe',
    zone: 'Connaught Place',
    createdAt: '2026-03-11T10:15:00Z',
    completedAt: '2026-03-11T10:19:00Z',
    upiTransactionId: 'UPI20260311101921DEL',
  },
  {
    id: 'pay_003',
    workerId: 'wkr_001',
    claimId: 'clm_003',
    disruptionEventId: 'evt_006',
    status: 'completed',
    expectedEarnings: 740,
    actualEarnings: 0,
    shortfall: 740,
    coveragePercent: 70,
    severityMultiplier: 0.8,
    payoutAmount: 415,
    fraudScore: 5,
    disruptionType: 'Cyclone Alert',
    zone: 'Anna Nagar',
    createdAt: '2026-03-05T08:00:00Z',
    completedAt: '2026-03-05T08:04:00Z',
    upiTransactionId: 'UPI20260305080423CHE',
  },
]

export const mockTrustKarma: TrustKarma = {
  workerId: 'wkr_001',
  score: 347,
  tier: 'base',
  history: [
    { date: '2026-03-20T00:00:00Z', action: 'Week maintained', pointChange: 5, balanceAfter: 347 },
    { date: '2026-03-19T14:34:00Z', action: 'Clean claim', pointChange: 10, balanceAfter: 342 },
    { date: '2026-03-13T00:00:00Z', action: 'Week maintained', pointChange: 5, balanceAfter: 332 },
    { date: '2026-03-06T00:00:00Z', action: 'Week maintained', pointChange: 5, balanceAfter: 327 },
    { date: '2026-03-05T08:04:00Z', action: 'Clean claim', pointChange: 10, balanceAfter: 322 },
    { date: '2026-02-27T00:00:00Z', action: 'Week maintained', pointChange: 5, balanceAfter: 312 },
    { date: '2026-02-20T00:00:00Z', action: 'Week maintained', pointChange: 5, balanceAfter: 307 },
    { date: '2026-02-15T00:00:00Z', action: 'Platform linked', pointChange: 5, balanceAfter: 302 },
    { date: '2026-02-13T00:00:00Z', action: 'Week maintained', pointChange: 5, balanceAfter: 297 },
  ],
}

export const mockEarningsToday = {
  expected: 740,
  actual: 320,
  shortfall: 420,
}

export const mockWeeklyEarnings = [
  { day: 'Mon', earned: 680, expected: 740, payout: 0 },
  { day: 'Tue', earned: 720, expected: 740, payout: 0 },
  { day: 'Wed', earned: 340, expected: 740, payout: 280 },
  { day: 'Thu', earned: 220, expected: 740, payout: 364 },
  { day: 'Fri', earned: 760, expected: 740, payout: 0 },
  { day: 'Sat', earned: 820, expected: 740, payout: 0 },
  { day: 'Sun', earned: 320, expected: 740, payout: 0 },
]
