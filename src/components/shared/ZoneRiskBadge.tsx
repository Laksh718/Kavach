import { ShieldRating } from './ShieldIcon'
import { cn } from '@/utils/cn'

interface ZoneRiskBadgeProps {
  score: number // HLRG score 1-10
  size?: number
  showLabel?: boolean
  className?: string
}

// Convert HLRG score (1-10) to shield rating (1-5)
export function hlrgToShields(hlrgScore: number): 1 | 2 | 3 | 4 | 5 {
  if (hlrgScore <= 2) return 5
  if (hlrgScore <= 4) return 4
  if (hlrgScore <= 6) return 3
  if (hlrgScore <= 8) return 2
  return 1
}

const ratingLabels: Record<number, { label: string; color: string }> = {
  5: { label: 'Very Safe', color: 'text-emerald-400' },
  4: { label: 'Safe', color: 'text-teal-400' },
  3: { label: 'Moderate', color: 'text-yellow-400' },
  2: { label: 'Risky', color: 'text-orange-400' },
  1: { label: 'High Risk', color: 'text-red-400' },
}

export function ZoneRiskBadge({ score, size = 20, showLabel = true, className }: ZoneRiskBadgeProps) {
  const shields = hlrgToShields(score)
  const { label, color } = ratingLabels[shields]

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <ShieldRating rating={shields} size={size} />
      {showLabel && (
        <span className={cn('text-sm font-medium', color)}>
          {shields}/5 — {label}
        </span>
      )}
    </div>
  )
}
