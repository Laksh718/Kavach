import type { TrustKarmaTier } from '@/types/worker.types'

export interface TrustKarmaTierConfig {
  tier: TrustKarmaTier
  minScore: number
  maxScore: number
  discount: number
  label: string
  color: string
  borderColor: string
  benefits: string[]
}

export const TRUST_KARMA_TIERS: TrustKarmaTierConfig[] = [
  {
    tier: 'base',
    minScore: 0,
    maxScore: 499,
    discount: 0,
    label: 'Base',
    color: '#6B7280',
    borderColor: '#374151',
    benefits: ['Basic coverage', 'Weekly payouts', 'WhatsApp alerts'],
  },
  {
    tier: 'silver',
    minScore: 500,
    maxScore: 699,
    discount: 0,
    label: 'Silver',
    color: '#9CA3AF',
    borderColor: '#6B7280',
    benefits: ['All Base benefits', 'Priority payout processing', '"Kavach Verified" badge'],
  },
  {
    tier: 'gold',
    minScore: 700,
    maxScore: 849,
    discount: 5,
    label: 'Gold',
    color: '#F59E0B',
    borderColor: '#D97706',
    benefits: ['All Silver benefits', '5% premium discount', 'Dedicated support line'],
  },
  {
    tier: 'platinum',
    minScore: 850,
    maxScore: 949,
    discount: 10,
    label: 'Platinum',
    color: '#3B82F6',
    borderColor: '#2563EB',
    benefits: ['All Gold benefits', '10% premium discount', 'Auto claim fast-track'],
  },
  {
    tier: 'champion',
    minScore: 950,
    maxScore: 1000,
    discount: 15,
    label: 'Champion',
    color: '#8B5CF6',
    borderColor: '#7C3AED',
    benefits: ['All Platinum benefits', '15% premium discount', 'Featured on app'],
  },
]

export const TRUST_KARMA_EVENTS: Record<string, number> = {
  'Week maintained': 5,
  'Clean claim': 10,
  'Referral': 20,
  'Platform linked': 5,
  'AA consent given': 10,
  'Suspicious activity': -30,
  'Policy lapsed': -15,
}

export function getTierForScore(score: number): TrustKarmaTierConfig {
  return TRUST_KARMA_TIERS.find(t => score >= t.minScore && score <= t.maxScore) ?? TRUST_KARMA_TIERS[0]
}
