/**
 * SmartShiftPicker.tsx
 * AI-powered shift planner widget for the Home Tab.
 * Calls POST /predict/earnings (debounced 500ms) on platform or time slot change.
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts'
import { Sparkles, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'
import { kavachMlApi } from '@/services/api/kavachMlApi'
import { formatINR, hourBucketToApiHour } from '@/utils/formatRupee'
import { cn } from '@/utils/cn'

type HourBucket = 'morning' | 'afternoon' | 'evening' | 'night'
type PlatformKey = 'swiggy' | 'zomato' | 'zepto'

// Platform: maps to API numeric ids used by the backend
const PLATFORMS: { key: PlatformKey; label: string; emoji: string; apiId: number }[] = [
  { key: 'swiggy', label: 'Swiggy', emoji: '🍜', apiId: 0 },
  { key: 'zomato', label: 'Zomato', emoji: '🍕', apiId: 1 },
  { key: 'zepto',  label: 'Zepto',  emoji: '⚡', apiId: 2 },
]

const SLOTS: { key: HourBucket; label: string; icon: string }[] = [
  { key: 'morning',   label: 'Morning',   icon: '🌅' },
  { key: 'afternoon', label: 'Afternoon', icon: '☀️' },
  { key: 'evening',   label: 'Evening',   icon: '🌆' },
  { key: 'night',     label: 'Night',     icon: '🌙' },
]

interface EarningsResult {
  expected_earnings: number
  base_prediction: number
  deviation_factor: number
  message?: string | null
}

interface PlatformPrediction {
  key: PlatformKey
  earnings: number | null
  loading: boolean
}

interface Props {
  city?: string
  workerAvg?: number
  /** If truthy, show a warning on the evening slot */
  disruptionLikely?: boolean
}

export function SmartShiftPicker({ city = 'Bangalore', workerAvg = 250, disruptionLikely = false }: Props) {
  const [open, setOpen] = useState(false)
  const [platform, setPlatform] = useState<PlatformKey>('swiggy')
  const [slot, setSlot] = useState<HourBucket>('evening')
  const [result, setResult] = useState<EarningsResult | null>(null)
  const [loading, setLoading] = useState(false)

  // Per-platform comparison (all slots for selected platform)
  const [slotPredictions, setSlotPredictions] = useState<Record<HourBucket, number | null>>({
    morning: null, afternoon: null, evening: null, night: null,
  })
  const [slotsLoading, setSlotsLoading] = useState(false)

  // Platform comparison row
  const [platformComps, setPlatformComps] = useState<PlatformPrediction[]>(
    PLATFORMS.map(p => ({ key: p.key, earnings: null, loading: false }))
  )

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const slotFetchRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Fetch single prediction (debounced) ───────────────────
  const fetchPrediction = useCallback(async (plt: PlatformKey, s: HourBucket) => {
    setLoading(true)
    const p = PLATFORMS.find(x => x.key === plt)!
    const hour = hourBucketToApiHour(s)
    const dayOfWeek = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
    try {
      const res = await kavachMlApi.predictEarnings(city, dayOfWeek, hour, p.apiId, workerAvg)
      setResult(res)
    } catch {
      // silently keep stale
    } finally {
      setLoading(false)
    }
  }, [city, workerAvg])

  // ── Fetch all 4 slots for the selected platform ────────────
  const fetchAllSlots = useCallback(async (plt: PlatformKey) => {
    setSlotsLoading(true)
    const p = PLATFORMS.find(x => x.key === plt)!
    const dayOfWeek = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
    try {
      const results = await Promise.allSettled(
        SLOTS.map(s =>
          kavachMlApi.predictEarnings(city, dayOfWeek, hourBucketToApiHour(s.key), p.apiId, workerAvg)
        )
      )
      const next: Record<HourBucket, number | null> = { morning: null, afternoon: null, evening: null, night: null }
      SLOTS.forEach((s, i) => {
        if (results[i].status === 'fulfilled') {
          next[s.key] = (results[i] as PromiseFulfilledResult<EarningsResult>).value.expected_earnings
        }
      })
      setSlotPredictions(next)
    } catch { /* ignore */ }
    setSlotsLoading(false)
  }, [city, workerAvg])

  // ── Fetch platform comparison for current slot ─────────────
  const fetchPlatformComparison = useCallback(async (s: HourBucket) => {
    setPlatformComps(PLATFORMS.map(p => ({ key: p.key, earnings: null, loading: true })))
    const dayOfWeek = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
    const results = await Promise.allSettled(
      PLATFORMS.map(p =>
        kavachMlApi.predictEarnings(city, dayOfWeek, hourBucketToApiHour(s), p.apiId, workerAvg)
      )
    )
    setPlatformComps(PLATFORMS.map((p, i) => ({
      key: p.key,
      earnings: results[i].status === 'fulfilled'
        ? (results[i] as PromiseFulfilledResult<EarningsResult>).value.expected_earnings
        : null,
      loading: false,
    })))
  }, [city, workerAvg])

  // When picker opens: fetch everything
  useEffect(() => {
    if (!open) return
    fetchAllSlots(platform)
    fetchPrediction(platform, slot)
    fetchPlatformComparison(slot)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // On platform change: debounced fetch + re-fetch all slots
  const handlePlatformChange = (key: PlatformKey) => {
    setPlatform(key)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (slotFetchRef.current) clearTimeout(slotFetchRef.current)
    debounceRef.current = setTimeout(() => fetchPrediction(key, slot), 500)
    slotFetchRef.current = setTimeout(() => fetchAllSlots(key), 500)
  }

  // On slot change: debounced fetch + re-fetch platform comparison
  const handleSlotChange = (key: HourBucket) => {
    setSlot(key)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchPrediction(platform, key)
      fetchPlatformComparison(key)
    }, 500)
  }

  // Best platform for current slot
  const bestPlatform = platformComps.reduce<PlatformPrediction | null>((best, cur) => {
    if (cur.earnings === null) return best
    if (!best || (best.earnings ?? 0) < cur.earnings) return cur
    return best
  }, null)

  // Best slot
  const bestSlot = (Object.entries(slotPredictions) as [HourBucket, number | null][]).reduce<HourBucket | null>(
    (best, [key, val]) => {
      if (val === null) return best
      if (!best || (slotPredictions[best] ?? 0) < val) return key
      return best
    }, null
  )

  // Chart data
  const chartData = SLOTS.map(s => ({
    name: s.label,
    earnings: slotPredictions[s.key] ?? 0,
    isSelected: s.key === slot,
  }))

  const deviationPos = result ? result.deviation_factor >= 1 : true
  const baseline = workerAvg * 8 // rough daily baseline
  const pct = result ? Math.round((result.expected_earnings / baseline) * 100) : 0

  return (
    <div className="k-card overflow-hidden">
      {/* Header / toggle */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
            <Sparkles size={15} className="text-violet-600" />
          </div>
          <div>
            <div className="font-syne font-bold text-[#0F172A] text-sm">Smart Shift Picker</div>
            <div className="text-[10px] text-[#94A3B8]">AI-powered earnings forecast ✨</div>
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-[#64748B]" /> : <ChevronDown size={16} className="text-[#64748B]" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4">
              {/* Platform pills */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#94A3B8] mb-2">Platform</p>
                <div className="flex gap-2">
                  {PLATFORMS.map(p => (
                    <button
                      key={p.key}
                      onClick={() => handlePlatformChange(p.key)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all',
                        platform === p.key
                          ? 'border-[#6366F1] bg-[#EEF2FF] text-[#4338CA]'
                          : 'border-[#E2E8F0] text-[#64748B] hover:border-indigo-200'
                      )}
                    >
                      <span>{p.emoji}</span> {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time slot pills */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#94A3B8] mb-2">Time of Day</p>
                <div className="flex gap-2">
                  {SLOTS.map(s => (
                    <button
                      key={s.key}
                      onClick={() => handleSlotChange(s.key)}
                      className={cn(
                        'relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-xs font-medium border-2 transition-all flex-1',
                        slot === s.key
                          ? 'border-[#6366F1] bg-[#EEF2FF] text-[#4338CA]'
                          : 'border-[#E2E8F0] text-[#64748B] hover:border-indigo-200'
                      )}
                    >
                      {disruptionLikely && s.key === 'evening' && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <AlertTriangle size={8} className="text-white" />
                        </span>
                      )}
                      <span>{s.icon}</span>
                      <span>{s.label}</span>
                      {!slotsLoading && slotPredictions[s.key] !== null && (
                        <span className={cn('text-[10px] font-mono font-bold', slot === s.key ? 'text-[#4338CA]' : 'text-[#94A3B8]')}>
                          {formatINR(slotPredictions[s.key]!)}
                        </span>
                      )}
                      {slotsLoading && (
                        <span className="text-[10px] text-[#C7D2FE] animate-pulse">···</span>
                      )}
                      {bestSlot === s.key && !slotsLoading && (
                        <span className="text-[8px] px-1 rounded-full bg-emerald-100 text-emerald-700 font-bold">Best</span>
                      )}
                    </button>
                  ))}
                </div>
                {disruptionLikely && (
                  <p className="text-[10px] text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertTriangle size={10} /> Disruption likely 5–10 PM — consider avoiding Evening shift
                  </p>
                )}
              </div>

              {/* Predicted earnings result */}
              <AnimatePresence mode="wait">
                {(loading || result) && (
                  <motion.div
                    key={loading ? 'loading' : 'result'}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      'rounded-2xl p-4 border-2',
                      loading
                        ? 'bg-[#F8FAFC] border-[#E2E8F0] animate-pulse'
                        : deviationPos
                          ? 'bg-[#EEF2FF] border-[#C7D2FE]'
                          : 'bg-amber-50 border-amber-200'
                    )}
                  >
                    {loading ? (
                      <div className="space-y-2">
                        <div className="h-8 w-32 bg-[#E2E8F0] rounded" />
                        <div className="h-4 w-48 bg-[#E2E8F0] rounded" />
                      </div>
                    ) : result ? (
                      <>
                        <div className="flex items-end justify-between mb-1">
                          <div>
                            <p className="text-[10px] text-[#6366F1] font-semibold uppercase tracking-wider">Predicted Earnings</p>
                            <p className="font-mono font-bold text-3xl text-[#1E1B4B]">{formatINR(result.expected_earnings)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-[#94A3B8]">vs baseline</p>
                            <p className={cn('text-sm font-bold font-mono', deviationPos ? 'text-emerald-600' : 'text-amber-600')}>
                              {pct}% of target
                            </p>
                          </div>
                        </div>
                        {bestSlot && (
                          <p className="text-[10px] text-[#6366F1]">
                            ⭐ Best time today: <strong>{SLOTS.find(s => s.key === bestSlot)?.label}</strong>
                          </p>
                        )}
                        {result.message && (
                          <p className="text-[10px] text-[#64748B] mt-1">💡 {result.message}</p>
                        )}
                      </>
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mini bar chart — all 4 slots */}
              {!slotsLoading && Object.values(slotPredictions).some(v => v !== null) && (
                <div className="h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barGap={2}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 9 }} />
                      <Bar dataKey="earnings" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, i) => (
                          <Cell key={i} fill={entry.isSelected ? '#1E1B4B' : '#C7D2FE'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Platform comparison footer */}
              {platformComps.some(p => !p.loading && p.earnings !== null) && (
                <div className="border-t border-[#EDE9FE] pt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#94A3B8] mb-2">Platform Comparison · {SLOTS.find(s => s.key === slot)?.label}</p>
                  <div className="space-y-2">
                    {platformComps.map(p => {
                      const meta = PLATFORMS.find(x => x.key === p.key)!
                      const isBest = bestPlatform?.key === p.key
                      const maxEarnings = Math.max(...platformComps.map(x => x.earnings ?? 0))
                      return (
                        <div key={p.key} className="flex items-center gap-2">
                          <span className="text-base w-5 flex-shrink-0">{meta.emoji}</span>
                          <div className="flex-1">
                            <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                              {!p.loading && p.earnings !== null && (
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(p.earnings / maxEarnings) * 100}%` }}
                                  className="h-full rounded-full bg-[#6366F1]"
                                />
                              )}
                            </div>
                          </div>
                          <span className="font-mono text-xs font-bold text-[#0F172A] w-16 text-right">
                            {p.loading ? '···' : p.earnings !== null ? formatINR(p.earnings) : '—'}
                          </span>
                          {isBest && !p.loading && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">Best</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
