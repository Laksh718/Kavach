import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Share2 } from 'lucide-react'
import { TRUST_KARMA_TIERS } from '@/constants/trustKarmaRules'
import { mockTrustKarma } from '@/services/mock/worker.mock'
import { cn } from '@/utils/cn'

const { score, tier, history } = mockTrustKarma
const currentTier = TRUST_KARMA_TIERS.find(t => t.tier === tier)!
const nextTier = TRUST_KARMA_TIERS.find(t => t.minScore > score)
const MAX_SCORE = 1000

export function TrustKarmaTab() {
  const [historyPage, setHistoryPage] = useState(10)

  return (
    <div className="p-6 max-w-2xl space-y-5">
      <h2 className="font-syne font-bold text-2xl text-[#0F172A]">TrustKarma</h2>

      {/* Score hero */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="k-card text-center py-8">
        <div className="font-syne font-bold text-6xl text-[#0F172A] mb-1">{score.toLocaleString()}</div>
        <div className="text-[#64748B] text-sm mb-3">TrustKarma Score</div>
        <span
          className={cn('badge-blue text-sm')}
          style={{ backgroundColor: `${currentTier.color}20`, color: currentTier.color, border: `1px solid ${currentTier.color}44` }}
        >
          {currentTier.label} Tier
        </span>

        {/* Progress bar */}
        <div className="mt-6 px-2">
          <div className="relative h-3 bg-[#EEF2FF] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(score / MAX_SCORE) * 100}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, #6366F1, ${currentTier.color})` }}
            />
          </div>

          {/* Tier markers */}
          <div className="relative mt-1 h-4">
            {TRUST_KARMA_TIERS.slice(1).map((t) => {
              const pct = (t.minScore / MAX_SCORE) * 100
              return (
                <div key={t.tier} className="absolute flex flex-col items-center" style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}>
                  <div className="w-0.5 h-2 bg-[#C7D2FE]" />
                  <span className="text-[9px] text-[#94A3B8] whitespace-nowrap">{t.minScore}</span>
                </div>
              )
            })}
          </div>

          <div className="flex justify-between text-[10px] text-[#94A3B8] mt-2">
            {TRUST_KARMA_TIERS.map((t, i) => (
              <span key={t.tier} className={cn(score >= t.minScore ? 'text-[#6366F1] font-semibold' : '')} style={i > 0 ? {} : {}}>
                {t.label}
              </span>
            ))}
          </div>
        </div>

        {nextTier && (
          <p className="mt-4 text-sm text-[#64748B]">
            <span className="font-bold text-[#0F172A]">{nextTier.minScore - score} pts</span> to {nextTier.label}
          </p>
        )}
      </motion.div>

      {/* Next milestone */}
      {nextTier && (
        <div className="k-card bg-[#EEF2FF] border-[#C7D2FE]">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            <div>
              <div className="font-syne font-bold text-[#0F172A]">{nextTier.minScore - score} pts to {nextTier.label}</div>
              <div className="text-xs text-[#64748B] mt-0.5">~{Math.ceil((nextTier.minScore - score) / 5)} weeks at current pace · or faster with clean payouts</div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {nextTier.benefits.map(b => (
              <div key={b} className="text-sm text-[#4338CA] flex items-center gap-2">
                <span className="text-[#6366F1]">→</span> {b}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tier benefits grid */}
      <div className="k-card">
        <h3 className="font-syne font-semibold text-[#0F172A] mb-4">All Tier Rewards</h3>
        <div className="grid grid-cols-2 gap-3">
          {TRUST_KARMA_TIERS.map(t => {
            const unlocked = score >= t.minScore
            return (
              <div
                key={t.tier}
                className={cn(
                  'rounded-2xl p-4 border-2 transition-all',
                  unlocked ? 'border-[#C7D2FE] bg-[#EEF2FF]' : 'border-[#E2E8F0] bg-[#F8FAFF] opacity-60'
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className="text-sm font-semibold text-[#0F172A]">{t.label}</span>
                  {unlocked && <span className="text-[10px] text-[#10B981] font-bold ml-auto">✓ Unlocked</span>}
                </div>
                <div className="space-y-1">
                  {t.benefits.slice(0, 2).map(b => (
                    <div key={b} className={cn('text-[11px] text-[#64748B]', !unlocked && 'blur-sm select-none')}>{b}</div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Share button */}
      <div className="flex justify-center">
        {tier === 'base' ? (
          <button className="btn-secondary flex items-center gap-2 opacity-50 cursor-not-allowed" disabled title="Reach Silver tier to share">
            <Share2 size={16} /> Share Achievement (Silver+ only)
          </button>
        ) : (
          <button
            className="btn-primary flex items-center gap-2"
            onClick={() => toast.success('Achievement card copied to clipboard!')}
          >
            <Share2 size={16} /> Share My {currentTier.label} Badge
          </button>
        )}
      </div>

      {/* History */}
      <div className="k-card">
        <h3 className="font-syne font-semibold text-[#0F172A] mb-4">Points History</h3>
        <div className="space-y-0">
          {history.slice(0, historyPage).map((event, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-[#EDE9FE] last:border-0">
              <div>
                <div className="text-sm font-medium text-[#0F172A]">{event.action}</div>
                <div className="text-xs text-[#94A3B8]">
                  {new Date(event.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <div className="text-right">
                <div className={cn('font-mono font-bold text-sm', event.pointChange > 0 ? 'text-[#10B981]' : 'text-[#EF4444]')}>
                  {event.pointChange > 0 ? '+' : ''}{event.pointChange} pts
                </div>
                <div className="text-xs text-[#94A3B8]">{event.balanceAfter} total</div>
              </div>
            </div>
          ))}
        </div>
        {historyPage < history.length && (
          <button onClick={() => setHistoryPage(p => p + 10)} className="text-sm text-[#6366F1] font-medium mt-3 w-full text-center">
            Load more
          </button>
        )}
      </div>
    </div>
  )
}
