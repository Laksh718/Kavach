import { TRUST_KARMA_TIERS } from '@/constants/trustKarmaRules'
import { cn } from '@/utils/cn'

interface TrustKarmaBarProps {
  score: number
  showTierLabels?: boolean
  className?: string
}

export function TrustKarmaBar({ score, showTierLabels = true, className }: TrustKarmaBarProps) {
  const maxScore = 1000
  const percentage = (score / maxScore) * 100

  // Determine color based on tier
  const getBarColor = () => {
    if (score >= 950) return 'from-purple-500 to-purple-400'
    if (score >= 850) return 'from-blue-500 to-blue-400'
    if (score >= 700) return 'from-amber-500 to-amber-400'
    if (score >= 500) return 'from-gray-400 to-gray-300'
    return 'from-gray-600 to-gray-500'
  }

  // Find current tier
  const currentTier = TRUST_KARMA_TIERS.find(t => score >= t.minScore && score <= t.maxScore)
  const nextTier = TRUST_KARMA_TIERS.find(t => t.minScore > score)

  return (
    <div className={cn('space-y-2', className)}>
      {/* Score and tier */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-xl text-white">{score.toLocaleString()}</span>
          <span className="text-xs text-gray-400">pts</span>
          {currentTier && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                color: currentTier.color,
                backgroundColor: `${currentTier.color}22`,
                border: `1px solid ${currentTier.color}44`,
              }}
            >
              {currentTier.label}
            </span>
          )}
        </div>
        {nextTier && (
          <span className="text-xs text-gray-400">
            {nextTier.minScore - score} pts to {nextTier.label}
          </span>
        )}
      </div>

      {/* Bar */}
      <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-1000', getBarColor())}
          style={{ width: `${percentage}%` }}
        />

        {/* Tier markers */}
        {showTierLabels && TRUST_KARMA_TIERS.slice(1).map((tier) => {
          const markerPct = (tier.minScore / maxScore) * 100
          return (
            <div
              key={tier.tier}
              className="absolute top-0 bottom-0 w-0.5 bg-gray-700"
              style={{ left: `${markerPct}%` }}
            />
          )
        })}
      </div>

      {/* Tier labels */}
      {showTierLabels && (
        <div className="relative flex">
          {TRUST_KARMA_TIERS.map((tier, i) => {
            const leftPct = (tier.minScore / maxScore) * 100
            return (
              <div
                key={tier.tier}
                className="absolute text-[10px] font-medium transform -translate-x-1/2"
                style={{ left: `${leftPct}%`, color: tier.color }}
              >
                {i > 0 ? tier.label : ''}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
