import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, MapPin, Clock, RefreshCw } from 'lucide-react'
import { usePredictEarnings } from '@/hooks/useKavachML'
import { formatRupee } from '@/utils/formatRupee'
import { cn } from '@/utils/cn'

// ── Constants (per API docs) ──────────────────────────────
const DAYS = [
  { label: 'Mon', api: 0 }, { label: 'Tue', api: 1 }, { label: 'Wed', api: 2 },
  { label: 'Thu', api: 3 }, { label: 'Fri', api: 4 }, { label: 'Sat', api: 5 },
  { label: 'Sun', api: 6 },
]

const PLATFORMS = [
  { id: 0, label: 'Swiggy',  emoji: '🍜', color: '#FC8019' },
  { id: 1, label: 'Zomato',  emoji: '🍕', color: '#E23744' },
  { id: 2, label: 'Porter',  emoji: '📦', color: '#6366F1' },
  { id: 3, label: 'Uber',    emoji: '🚗', color: '#000000' },
]

const CITIES = ['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Kolkata']

const PEAK_HOURS = [
  { start: 8,  end: 10,  label: 'Morning Rush' },
  { start: 12, end: 14,  label: 'Lunch Peak' },
  { start: 18, end: 21,  label: 'Evening Peak' },
]

// ── Platform Single Item ──────────────────────────────────
function PlatformItem({ city, day, hour, workerAvg, platform, maxEarnings }: { 
  city: string; day: number; hour: number; workerAvg: number; platform: any; maxEarnings: number 
}) {
  const { data, isLoading } = usePredictEarnings(city, day, hour, platform.id, workerAvg)
  const earnings = data?.expected_earnings ?? 0

  return (
    <div className="flex items-center gap-3">
      <span className="text-xl w-7 flex-shrink-0">{platform.emoji}</span>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-[#0F172A]">{platform.label}</span>
          {isLoading
            ? <span className="text-xs text-[#94A3B8] animate-pulse">Loading...</span>
            : <span className="font-mono font-bold text-sm text-[#1E1B4B]">
                {earnings > 0 ? formatRupee(earnings) : '—'}
              </span>
          }
        </div>
        <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
          {!isLoading && earnings > 0 && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(earnings / maxEarnings) * 100}%` }}
              className="h-full rounded-full"
              style={{ backgroundColor: platform.color === '#000000' ? '#374151' : platform.color }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function PlatformComparisonRow({ city, day, hour, workerAvg }: { city: string; day: number; hour: number; workerAvg: number }) {
  return (
    <div className="k-card">
      <h3 className="font-syne font-semibold text-[#0F172A] text-sm mb-4">Platform Comparison · Same Shift</h3>
      <div className="space-y-3">
        {PLATFORMS.map(p => (
          <PlatformItem 
            key={p.id} city={city} day={day} hour={hour} 
            workerAvg={workerAvg} platform={p} maxEarnings={1000} 
          />
        ))}
      </div>
    </div>
  )
}

function EarningsChart() {
  return (
    <div className="k-card">
      <h3 className="font-syne font-semibold text-[#0F172A] text-sm mb-4">Predicted Earnings by Hour</h3>
      <div className="h-[200px] flex items-center justify-center bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0] text-[#94A3B8] text-xs">
        Hourly trends are cached and automatically updated every 15 min
      </div>
    </div>
  )
}

// ── Main Earnings Planner ─────────────────────────────────
export function EarningsPlannerTab() {
  const now = new Date()
  const jsToApiDay = (d: number) => d === 0 ? 6 : d - 1

  const [city, setCity] = useState('Bangalore')
  const [day, setDay] = useState(jsToApiDay(now.getDay()))
  const [hour, setHour] = useState(now.getHours())
  const [platform, setPlatform] = useState(0)
  const [workerAvg, setWorkerAvg] = useState(250)

  const { data: result, isLoading: loading, refetch } = usePredictEarnings(city, day, hour, platform, workerAvg)

  const deviationPct = result ? Math.abs((result.deviation_factor - 1) * 100).toFixed(1) : null
  const deviationPos = result ? result.deviation_factor >= 1 : true
  const peakInfo = PEAK_HOURS.find(p => hour >= p.start && hour <= p.end)

  return (
    <div className="p-6 space-y-5">
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
        <div className="space-y-4">
          <div className="k-card">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={15} className="text-[#6366F1]" />
              <h3 className="font-syne font-semibold text-[#0F172A] text-sm">Your City</h3>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {CITIES.map(c => (
                <button key={c} onClick={() => setCity(c)}
                  className={cn('py-2.5 px-4 rounded-xl text-sm font-medium text-left transition-all border',
                    city === c ? 'bg-[#1E1B4B] text-white border-[#1E1B4B]' : 'bg-white text-[#0F172A] border-[#E2E8F0]'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="k-card">
            <h3 className="font-syne font-semibold text-[#0F172A] text-sm mb-4">Platform</h3>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map(p => (
                <button key={p.id} onClick={() => setPlatform(p.id)}
                  className={cn('py-3 px-3 rounded-xl text-sm font-semibold transition-all border-2 flex flex-col items-center gap-1',
                    platform === p.id ? 'border-[#6366F1] bg-[#EEF2FF]' : 'border-[#E2E8F0] bg-white'
                  )}
                >
                  <span className="text-xl">{p.emoji}</span>
                  <span className="text-xs text-[#0F172A]">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="k-card space-y-4">
            <div>
              <label className="text-[10px] font-semibold tracking-widest text-[#94A3B8] uppercase mb-2 block">Day of Week</label>
              <div className="grid grid-cols-7 gap-1">
                {DAYS.map(d => (
                  <button key={d.api} onClick={() => setDay(d.api)}
                    className={cn('py-2 rounded-lg text-[11px] font-bold transition-all',
                      day === d.api ? 'bg-[#1E1B4B] text-white' : 'bg-[#F1F5F9] text-[#64748B]'
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold tracking-widest text-[#94A3B8] uppercase mb-1 block">Hourly Average (₹)</label>
              <input type="number" value={workerAvg} onChange={e => setWorkerAvg(Number(e.target.value))}
                className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm outline-none" placeholder="250"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="k-card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-[#6366F1]" />
                <h3 className="font-syne font-semibold text-[#0F172A] text-sm">Shift Hour</h3>
              </div>
              <span className="font-mono font-bold text-[#1E1B4B] text-lg">{String(hour).padStart(2, '0')}:00</span>
            </div>
            <input type="range" min={0} max={23} value={hour} onChange={e => setHour(Number(e.target.value))} className="w-full accent-[#1E1B4B]" />
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <div className="k-card animate-pulse h-48 bg-[#F8FAFC]" />
            ) : result ? (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="k-card">
                <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-2xl p-5 mb-4 text-center">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-xs font-semibold text-[#6366F1] tracking-wide uppercase">Prediction Model</span>
                    <button
                      onClick={() => refetch()}
                      disabled={loading}
                      title="Refresh prediction"
                      className="flex items-center gap-1.5 text-xs text-[#6366F1] hover:text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] border border-[#C7D2FE] rounded-lg px-3 py-1.5 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                      Refresh
                    </button>
                  </div>
                  <p className="text-xs text-[#6366F1] font-medium mb-1">Predicted Earnings</p>
                  <p className="font-mono font-bold text-5xl text-[#1E1B4B]">{formatRupee(result.expected_earnings)}</p>
                  {peakInfo && <p className="text-[10px] text-[#6366F1] mt-2 font-bold uppercase tracking-widest">⚡ {peakInfo.label}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-center">
                    <p className="text-[10px] text-[#94A3B8] mb-0.5">Base Model</p>
                    <p className="font-mono font-semibold text-[#0F172A]">{formatRupee(result.base_prediction)}</p>
                  </div>
                  <div className={cn('rounded-xl p-3 text-center border', deviationPos ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200')}>
                    <p className="text-[10px] text-[#94A3B8] mb-0.5">Weather Impact</p>
                    <p className={cn('font-mono font-semibold text-sm', deviationPos ? 'text-emerald-600' : 'text-red-500')}>
                      {deviationPos ? '+' : '-'}{deviationPct}%
                    </p>
                  </div>
                </div>

                {result.message && <p className="text-xs text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 leading-relaxed">💡 {result.message}</p>}
              </motion.div>
            ) : null}
          </AnimatePresence>

          <EarningsChart />
          <PlatformComparisonRow city={city} day={day} hour={hour} workerAvg={workerAvg} />
        </div>
      </div>
    </div>
  )
}
