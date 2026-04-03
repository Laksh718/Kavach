import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { MapPin, Clock, TrendingUp, TrendingDown, Zap, Info } from 'lucide-react'
import { kavachMlApi } from '@/services/api/kavachMlApi'
import { formatRupee } from '@/utils/formatRupee'
import { cn } from '@/utils/cn'

// ── Constants (per API docs) ──────────────────────────────
// day_of_week: 0=Mon … 6=Sun
const DAYS = [
  { label: 'Mon', api: 0 }, { label: 'Tue', api: 1 }, { label: 'Wed', api: 2 },
  { label: 'Thu', api: 3 }, { label: 'Fri', api: 4 }, { label: 'Sat', api: 5 },
  { label: 'Sun', api: 6 },
]

// Platform: 0=Swiggy, 1=Zomato, 2=Porter, 3=Uber
const PLATFORMS = [
  { id: 0, label: 'Swiggy',  emoji: '🍜', color: '#FC8019' },
  { id: 1, label: 'Zomato',  emoji: '🍕', color: '#E23744' },
  { id: 2, label: 'Porter',  emoji: '📦', color: '#6366F1' },
  { id: 3, label: 'Uber',    emoji: '🚗', color: '#000000' },
]

const CITIES = ['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Kolkata']

// Peak hour ranges for annotations
const PEAK_HOURS = [
  { start: 8,  end: 10,  label: 'Morning Rush' },
  { start: 12, end: 14,  label: 'Lunch Peak' },
  { start: 18, end: 21,  label: 'Evening Peak' },
]

interface EarningsResult {
  expected_earnings: number
  base_prediction: number
  deviation_factor: number
  message?: string | null
}

// ── Recharts custom tooltip ───────────────────────────────
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-3 text-xs min-w-[130px]">
      <div className="font-semibold text-[#0F172A] mb-1">{label}:00</div>
      <div className="flex justify-between gap-3">
        <span className="text-[#64748B]">Predicted</span>
        <span className="font-mono font-bold text-[#1E1B4B]">{formatRupee(item?.value ?? 0)}</span>
      </div>
    </div>
  )
}

// ── Platform Comparison Row ───────────────────────────────
interface PlatformCompare { id: number; label: string; emoji: string; color: string; earnings: number | null; loading: boolean }

function PlatformComparisonRow({ city, day, hour, workerAvg }: { city: string; day: number; hour: number; workerAvg: number }) {
  const [platforms, setPlatforms] = useState<PlatformCompare[]>(
    PLATFORMS.map(p => ({ ...p, earnings: null, loading: true }))
  )
  const fetchToken = useRef(0)

  useEffect(() => {
    const token = ++fetchToken.current
    setPlatforms(PLATFORMS.map(p => ({ ...p, earnings: null, loading: true })))

    Promise.allSettled(
      PLATFORMS.map(p => kavachMlApi.predictEarnings(city, day, hour, p.id, workerAvg))
    ).then((results) => {
      if (fetchToken.current !== token) return
      setPlatforms(PLATFORMS.map((p, i) => ({
        ...p,
        earnings: results[i].status === 'fulfilled' ? (results[i] as PromiseFulfilledResult<EarningsResult>).value.expected_earnings : null,
        loading: false,
      })))
    })
  }, [city, day, hour, workerAvg])

  const maxEarnings = Math.max(...platforms.map(p => p.earnings ?? 0))

  return (
    <div className="k-card">
      <h3 className="font-syne font-semibold text-[#0F172A] text-sm mb-4">Platform Comparison · Same Shift</h3>
      <div className="space-y-3">
        {platforms.map(p => (
          <div key={p.id} className="flex items-center gap-3">
            <span className="text-xl w-7 flex-shrink-0">{p.emoji}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-[#0F172A]">{p.label}</span>
                {p.loading
                  ? <span className="text-xs text-[#94A3B8] animate-pulse">Loading...</span>
                  : <span className="font-mono font-bold text-sm text-[#1E1B4B]">
                      {p.earnings !== null ? formatRupee(p.earnings) : '—'}
                    </span>
                }
              </div>
              <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                {!p.loading && p.earnings !== null && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(p.earnings / maxEarnings) * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: p.color === '#000000' ? '#374151' : p.color }}
                  />
                )}
              </div>
            </div>
            {!p.loading && p.earnings === maxEarnings && p.earnings !== null && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex-shrink-0">Best</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Hour Slider Chart Data ────────────────────────────────
interface HourData { hour: number; earnings: number | null }

function EarningsChart({ city, day, platform, workerAvg, selectedHour }: {
  city: string; day: number; platform: number; workerAvg: number; selectedHour: number
}) {
  const [hourData, setHourData] = useState<HourData[]>(
    Array.from({ length: 24 }, (_, h) => ({ hour: h, earnings: null }))
  )
  const [loading, setLoading] = useState(false)
  const fetchToken = useRef(0)

  useEffect(() => {
    const token = ++fetchToken.current
    setLoading(true)

    // Batch: fetch peak hours (6-22) with staggered timing to avoid rate limits
    const hoursToFetch = Array.from({ length: 17 }, (_, i) => i + 6)
    setHourData(Array.from({ length: 24 }, (_, h) => ({ hour: h, earnings: null })))

    Promise.allSettled(
      hoursToFetch.map(h => kavachMlApi.predictEarnings(city, day, h, platform, workerAvg))
    ).then(results => {
      if (fetchToken.current !== token) return
      setHourData(prev => {
        const next = [...prev]
        hoursToFetch.forEach((h, i) => {
          if (results[i].status === 'fulfilled') {
            next[h] = { hour: h, earnings: (results[i] as PromiseFulfilledResult<EarningsResult>).value.expected_earnings }
          }
        })
        return next
      })
      setLoading(false)
    })
  }, [city, day, platform, workerAvg])

  const chartData = hourData.slice(6, 23).map(d => ({
    hour: `${d.hour}h`,
    earnings: d.earnings ?? 0,
    isSelected: d.hour === selectedHour,
    isPeak: PEAK_HOURS.some(p => d.hour >= p.start && d.hour <= p.end),
  }))

  return (
    <div className="k-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-syne font-semibold text-[#0F172A] text-sm">Predicted Earnings by Hour</h3>
        {loading && (
          <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
            <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Fetching...
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} barGap={2}>
          <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10 }} />
          <YAxis hide />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="earnings" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.isSelected ? '#1E1B4B' : entry.isPeak ? '#6366F1' : '#C7D2FE'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-4 mt-2">
        <span className="flex items-center gap-1.5 text-xs text-[#64748B]">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#1E1B4B] inline-block" /> Selected hour
        </span>
        <span className="flex items-center gap-1.5 text-xs text-[#64748B]">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#6366F1] inline-block" /> Peak hours
        </span>
        <span className="flex items-center gap-1.5 text-xs text-[#64748B]">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#C7D2FE] inline-block" /> Off-peak
        </span>
      </div>
    </div>
  )
}

// ── Main Earnings Planner ─────────────────────────────────
export function EarningsPlannerTab() {
  const now = new Date()
  // Convert JS getDay() [0=Sun] → API [0=Mon]
  const jsToApiDay = (d: number) => d === 0 ? 6 : d - 1

  const [city, setCity] = useState('Bangalore')
  const [day, setDay] = useState(jsToApiDay(now.getDay()))
  const [hour, setHour] = useState(now.getHours())
  const [platform, setPlatform] = useState(0)
  const [workerAvg, setWorkerAvg] = useState(250)
  const [result, setResult] = useState<EarningsResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [chartKey, setChartKey] = useState(0) // remounts chart on city/day/platform change

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchPrediction = useCallback(async (c: string, d: number, h: number, p: number, avg: number) => {
    setLoading(true)
    try {
      const res = await kavachMlApi.predictEarnings(c, d, h, p, avg)
      setResult(res)
    } catch {
      // silently skip in planner
    }
    setLoading(false)
  }, [])

  // Debounced auto-call on any input change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchPrediction(city, day, hour, platform, workerAvg), 400)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [city, day, hour, platform, workerAvg, fetchPrediction])

  // Remount chart when top-level params change
  useEffect(() => { setChartKey(k => k + 1) }, [city, day, platform, workerAvg])

  const deviationPct = result ? Math.abs((result.deviation_factor - 1) * 100).toFixed(1) : null
  const deviationPos = result ? result.deviation_factor >= 1 : true
  const peakInfo = PEAK_HOURS.find(p => hour >= p.start && hour <= p.end)

  const inputClass = 'w-full bg-white border border-[#E2E8F0] text-[#0F172A] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#6366F1] transition-colors'

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <TrendingUp size={26} className="text-[#6366F1]" />
          <h2 className="font-syne font-bold text-2xl text-[#0F172A]">Earnings Planner</h2>
          <span className="badge-blue text-xs px-2 py-0.5">What-If Tool</span>
        </div>
        <p className="text-sm text-[#64748B]">
          Simulate any shift to see how <span className="font-semibold text-[#6366F1]">weather, platform, and timing</span> affect your predicted earnings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT: Controls */}
        <div className="space-y-4">
          {/* City */}
          <div className="k-card">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={15} className="text-[#6366F1]" />
              <h3 className="font-syne font-semibold text-[#0F172A] text-sm">Your City</h3>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {CITIES.map(c => (
                <button key={c} onClick={() => setCity(c)}
                  className={cn('py-2.5 px-4 rounded-xl text-sm font-medium text-left transition-all border',
                    city === c
                      ? 'bg-[#1E1B4B] text-white border-[#1E1B4B]'
                      : 'bg-white text-[#0F172A] border-[#E2E8F0] hover:border-[#6366F1]'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div className="k-card">
            <h3 className="font-syne font-semibold text-[#0F172A] text-sm mb-4">Platform</h3>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map(p => (
                <button key={p.id} onClick={() => setPlatform(p.id)}
                  className={cn('py-3 px-3 rounded-xl text-sm font-semibold transition-all border-2 flex flex-col items-center gap-1',
                    platform === p.id ? 'border-[#6366F1] bg-[#EEF2FF]' : 'border-[#E2E8F0] bg-white hover:border-indigo-200'
                  )}
                >
                  <span className="text-xl">{p.emoji}</span>
                  <span className="text-xs text-[#0F172A]">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Day + Hourly avg */}
          <div className="k-card space-y-4">
            <div>
              <label className="text-[10px] font-semibold tracking-widest text-[#94A3B8] uppercase mb-2 block">Day of Week</label>
              <div className="grid grid-cols-7 gap-1">
                {DAYS.map(d => (
                  <button key={d.api} onClick={() => setDay(d.api)}
                    className={cn('py-2 rounded-lg text-[11px] font-bold transition-all',
                      day === d.api ? 'bg-[#1E1B4B] text-white' : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold tracking-widest text-[#94A3B8] uppercase mb-1 block">
                Historical Hourly Average (₹)
              </label>
              <input type="number" value={workerAvg} onChange={e => setWorkerAvg(Number(e.target.value))}
                className={inputClass} placeholder="250"
              />
              <p className="text-[10px] text-[#94A3B8] mt-1">Your average earnings per hour, from past shifts</p>
            </div>
          </div>
        </div>

        {/* RIGHT: Results */}
        <div className="lg:col-span-2 space-y-4">
          {/* Hour Slider */}
          <div className="k-card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-[#6366F1]" />
                <h3 className="font-syne font-semibold text-[#0F172A] text-sm">Shift Start Hour</h3>
              </div>
              <div className="flex items-center gap-2">
                {peakInfo && (
                  <span className="text-[10px] px-2 py-1 rounded-full bg-[#EEF2FF] text-[#6366F1] font-semibold">{peakInfo.label}</span>
                )}
                <span className="font-mono font-bold text-[#1E1B4B] text-lg">{String(hour).padStart(2, '0')}:00</span>
              </div>
            </div>
            <input
              type="range" min={0} max={23} value={hour} onChange={e => setHour(Number(e.target.value))}
              className="w-full accent-[#1E1B4B]"
            />
            <div className="flex justify-between text-[10px] text-[#94A3B8] mt-1">
              <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
            </div>
          </div>

          {/* Prediction result */}
          <AnimatePresence mode="wait">
            {(result || loading) && (
              <motion.div key={loading ? 'loading' : 'result'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                {loading ? (
                  <div className="k-card animate-pulse">
                    <div className="h-8 w-48 bg-[#E2E8F0] rounded mb-3" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-16 bg-[#E2E8F0] rounded-xl" />
                      <div className="h-16 bg-[#E2E8F0] rounded-xl" />
                    </div>
                  </div>
                ) : result ? (
                  <div className="k-card">
                    {/* Main result */}
                    <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-2xl p-5 mb-4 text-center">
                      <p className="text-xs text-[#6366F1] font-medium mb-1">Predicted Earnings · {PLATFORMS.find(p => p.id === platform)?.label} · {DAYS.find(d => d.api === day)?.label} {String(hour).padStart(2, '0')}:00 · {city}</p>
                      <p className="font-mono font-bold text-5xl text-[#1E1B4B]">{formatRupee(result.expected_earnings)}</p>
                      <p className="text-xs text-[#64748B] mt-1">for this shift</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-center">
                        <p className="text-[10px] text-[#94A3B8] mb-0.5">Base Model</p>
                        <p className="font-mono font-semibold text-[#0F172A]">{formatRupee(result.base_prediction)}</p>
                      </div>
                      <div className={cn('rounded-xl p-3 text-center border', deviationPos ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200')}>
                        <p className="text-[10px] text-[#94A3B8] mb-0.5">Weather Impact</p>
                        <div className={cn('flex items-center justify-center gap-1 font-mono font-semibold text-sm', deviationPos ? 'text-emerald-600' : 'text-red-500')}>
                          {deviationPos ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          {deviationPos ? '+' : '-'}{deviationPct}%
                        </div>
                      </div>
                    </div>

                    {/* Deviation copy per API docs */}
                    {deviationPct && Number(deviationPct) > 0 && (
                      <div className={cn('flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs font-medium leading-relaxed border',
                        deviationPos
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : 'bg-red-50 border-red-200 text-red-700'
                      )}>
                        {deviationPos ? <Zap size={13} className="flex-shrink-0 mt-0.5" /> : <Info size={13} className="flex-shrink-0 mt-0.5" />}
                        {deviationPos
                          ? `Rain/weather is boosting demand, increasing earnings by ${deviationPct}%!`
                          : `Adverse conditions (heat/AQI) are reducing earnings by ${deviationPct}%.`
                        }
                      </div>
                    )}

                    {result.message && (
                      <p className="text-xs text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 mt-3 leading-relaxed">💡 {result.message}</p>
                    )}
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hour-by-hour chart */}
          <EarningsChart key={chartKey} city={city} day={day} platform={platform} workerAvg={workerAvg} selectedHour={hour} />

          {/* Platform comparison */}
          <PlatformComparisonRow city={city} day={day} hour={hour} workerAvg={workerAvg} />
        </div>
      </div>
    </div>
  )
}
