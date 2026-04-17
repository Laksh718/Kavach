import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Activity, Brain, CloudRain, Wind, AlertTriangle,
  CheckCircle, XCircle, ChevronRight, Zap, Shield,
  TrendingUp, Clock, MapPin, Sparkles, Info, ArrowUpRight,
} from 'lucide-react'
import { kavachMlApi } from '@/services/api/kavachMlApi'
import { useDisruptionPrediction, useDynamicPricing, type EarningsResult } from '@/hooks/useKavachML'
import { formatRupee } from '@/utils/formatRupee'
import { cn } from '@/utils/cn'

// ─── Types ───────────────────────────────────────────────
interface ClaimResult {
  is_eligible: boolean
  status: string
  reason?: string | null
  triggers_found: string[]
  environment_data: { rain_mm?: number; aqi_pm25?: number; news?: string }
  suggested_premium?: number | null
}

// ─── API Constants (per docs) ─────────────────────────────
// day_of_week: 0=Mon, 1=Tue, ..., 6=Sun (different from JS Date.getDay())
// Convert JS getDay() [0=Sun..6=Sat] → API [0=Mon..6=Sun]
const jsToApiDay = (jsDay: number) => (jsDay === 0 ? 6 : jsDay - 1)

const DAYS = [
  { label: 'Monday', api: 0 },
  { label: 'Tuesday', api: 1 },
  { label: 'Wednesday', api: 2 },
  { label: 'Thursday', api: 3 },
  { label: 'Friday', api: 4 },
  { label: 'Saturday', api: 5 },
  { label: 'Sunday', api: 6 },
]

// Platform IDs per API docs: 0=Swiggy, 1=Zomato, 2=Porter, 3=Uber
const PLATFORMS = [
  { id: 0, label: 'Swiggy', emoji: '🍜' },
  { id: 1, label: 'Zomato', emoji: '🍕' },
  { id: 2, label: 'Porter', emoji: '📦' },
  { id: 3, label: 'Uber', emoji: '🚗' },
]

// Hyper-local city examples for dynamic pricing
const PRICING_CITY_HINTS = [
  'Mumbai_Island_City', 'Bangalore_South', 'Chennai_Central',
  'Delhi_NCR', 'Kolkata_North',
]

// ─── Shared UI helpers ────────────────────────────────────
function SectionHeader({ icon, title, subtitle, color = 'indigo' }: {
  icon: React.ReactNode
  title: string
  subtitle: string
  color?: 'indigo' | 'emerald' | 'purple' | 'cyan' | 'red' | 'amber'
}) {
  const bg: Record<string, string> = {
    indigo: 'bg-[#EEF2FF]', emerald: 'bg-emerald-50',
    purple: 'bg-purple-50', cyan: 'bg-cyan-50',
    red: 'bg-red-50', amber: 'bg-amber-50',
  }
  const text: Record<string, string> = {
    indigo: 'text-[#6366F1]', emerald: 'text-emerald-600',
    purple: 'text-purple-600', cyan: 'text-cyan-600',
    red: 'text-red-500', amber: 'text-amber-600',
  }
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', bg[color])}>
        <span className={text[color]}>{icon}</span>
      </div>
      <div>
        <h3 className="font-syne font-bold text-[#0F172A] text-base">{title}</h3>
        <p className={cn('text-xs font-mono', text[color])}>{subtitle}</p>
      </div>
    </div>
  )
}

function InputField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-semibold tracking-widest text-[#94A3B8] uppercase mb-1 block">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputClass = 'w-full bg-white border border-[#E2E8F0] text-[#0F172A] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#6366F1] transition-colors placeholder-[#94A3B8]'
const iconInputClass = 'flex items-center bg-white border border-[#E2E8F0] rounded-xl px-3 gap-2 focus-within:border-[#6366F1] transition-colors'

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  )
}

function PredictButton({ onClick, loading, label, color = 'indigo', fullWidth = true }: {
  onClick: () => void; loading: boolean; label: string
  color?: 'indigo' | 'emerald' | 'purple' | 'cyan'; fullWidth?: boolean
}) {
  const styles: Record<string, string> = {
    indigo: 'bg-[#1E1B4B] hover:bg-[#312e81]',
    emerald: 'bg-emerald-600 hover:bg-emerald-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    cyan: 'bg-[#0e7490] hover:bg-[#0c6782]',
  }
  return (
    <button
      onClick={onClick} disabled={loading}
      className={cn(
        'py-3 rounded-xl font-bold text-sm text-white transition-all active:scale-[.98] disabled:opacity-50',
        fullWidth ? 'w-full' : 'px-5',
        styles[color]
      )}
    >
      {loading
        ? <span className="flex items-center justify-center gap-2"><Spinner />{label}</span>
        : label}
    </button>
  )
}

// ─── Signal-Lost error banner ──────────────────────────────
function SignalLostBanner() {
  return (
    <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mt-3">
      <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-amber-700 leading-relaxed">
        <strong>Live signals temporarily unavailable.</strong> The external Weather/News provider may be down. Defaulting to standard processing.
      </p>
    </div>
  )
}

// ─── Earnings Predictor ───────────────────────────────────
function EarningsPredictor() {
  const now = new Date()
  const [city, setCity] = useState('Bangalore')
  // Default to current day in API format (0=Mon)
  const [day, setDay] = useState(jsToApiDay(now.getDay()))
  const [hour, setHour] = useState(now.getHours())
  const [platform, setPlatform] = useState(0) // 0 = Swiggy per API docs
  const [workerAvg, setWorkerAvg] = useState(250)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<EarningsResult | null>(null)
  const [signalLost, setSignalLost] = useState(false)

  const handlePredict = async () => {
    if (!city.trim()) { toast.error('Enter a city name'); return }
    setLoading(true); setSignalLost(false)
    try {
      const res = await kavachMlApi.predictEarnings(city, day, hour, platform, workerAvg)
      setResult(res)
      toast.success('Prediction ready!')
    } catch (err: any) {
      if (err?.response?.status >= 500 || !err?.response) {
        setSignalLost(true)
        toast.error('Live signals unavailable — using standard processing')
      } else {
        toast.error('Prediction failed — check city name')
      }
    }
    setLoading(false)
  }

  const deviationPct = result ? Math.abs((result.deviation_factor - 1) * 100).toFixed(1) : null
  const deviationPos = result ? result.deviation_factor >= 1 : true
  const deviationMsg = result
    ? deviationPos
      ? `Rain/weather is boosting demand, increasing earnings by ${deviationPct}%`
      : `Adverse conditions reducing earnings by ${deviationPct}%`
    : null

  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="k-card">
      <SectionHeader icon={<TrendingUp size={18} />} title="AI Earnings Predictor" subtitle="POST /predict/earnings" color="indigo" />

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="col-span-2">
          <InputField label="City">
            <div className={iconInputClass}>
              <MapPin size={14} className="text-[#6366F1] flex-shrink-0" />
              <input
                type="text" value={city}
                onChange={e => setCity(e.target.value)}
                className="bg-transparent text-[#0F172A] py-2.5 text-sm outline-none w-full placeholder-[#94A3B8]"
                placeholder="Bangalore, Mumbai, Delhi, Chennai, Kolkata"
                onKeyDown={e => e.key === 'Enter' && handlePredict()}
              />
            </div>
          </InputField>
        </div>

        <InputField label="Day of Week">
          <select value={day} onChange={e => setDay(Number(e.target.value))} className={inputClass}>
            {DAYS.map(d => <option key={d.api} value={d.api}>{d.label}</option>)}
          </select>
        </InputField>

        <InputField label="Hour (24h)">
          <div className={iconInputClass}>
            <Clock size={14} className="text-[#6366F1] flex-shrink-0" />
            <input
              type="number" value={hour} min={0} max={23}
              onChange={e => setHour(Number(e.target.value))}
              className="bg-transparent text-[#0F172A] py-2.5 text-sm outline-none w-full"
            />
          </div>
        </InputField>

        <InputField label="Platform">
          <select value={platform} onChange={e => setPlatform(Number(e.target.value))} className={inputClass}>
            {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.emoji} {p.label}</option>)}
          </select>
        </InputField>

        <InputField label="Hourly Average (₹)">
          <input
            type="number" value={workerAvg}
            onChange={e => setWorkerAvg(Number(e.target.value))}
            className={inputClass}
            placeholder="250"
          />
        </InputField>
      </div>

      <PredictButton onClick={handlePredict} loading={loading} label="Predict My Earnings ⚡" color="indigo" />
      {signalLost && <SignalLostBanner />}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mt-5 pt-5 border-t border-[#EDE9FE]"
          >
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-3 bg-[#EEF2FF] rounded-xl p-4 text-center border border-[#C7D2FE]">
                <p className="text-xs text-[#6366F1] mb-1 font-medium">Expected Earnings</p>
                <p className="font-mono font-bold text-4xl text-[#1E1B4B]">{formatRupee(result.expected_earnings)}</p>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-center">
                <p className="text-[10px] text-[#64748B] mb-1">Base Model</p>
                <p className="font-mono font-semibold text-sm text-[#0F172A]">{formatRupee(result.base_prediction)}</p>
              </div>

              <div className={cn('rounded-xl p-3 text-center col-span-2 border', deviationPos ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200')}>
                <p className="text-[10px] text-[#64748B] mb-1">Weather/AQI Impact</p>
                <p className={cn('font-mono font-semibold text-sm', deviationPos ? 'text-emerald-600' : 'text-red-500')}>
                  {deviationPos ? '+' : '-'}{deviationPct}% ({result.deviation_factor}×)
                </p>
              </div>

              {/* Smart deviation message per API docs */}
              {deviationMsg && (
                <div className={cn('col-span-3 flex items-start gap-2 rounded-xl p-3 text-xs leading-relaxed border',
                  deviationPos ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
                )}>
                  {deviationPos ? '🌧️' : '⚠️'} {deviationMsg}
                </div>
              )}

              {result.message && (
                <div className="col-span-3 text-xs text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 leading-relaxed">
                  💡 {result.message}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

// ─── Disruption Predictor ────────────────────────────────
function DisruptionPredictor() {
  const [city, setCity] = useState('Mumbai')
  const { data: result, loading, refetch } = useDisruptionPrediction(city)
  const [signalLost, setSignalLost] = useState(false)

  const handlePredict = async () => {
    if (!city.trim()) { toast.error('Enter a city name'); return }
    setSignalLost(false)
    try {
      await refetch()
      toast.success(`Scanned ${city}`)
    } catch (err: any) {
      setSignalLost(true)
    }
  }

  const confidence = result ? Math.round(result.confidence * 100) : 0
  const isDisruption = result?.disruption === 1

  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="k-card">
      <SectionHeader
        icon={<Activity size={18} />}
        title="Disruption ML Model"
        subtitle="POST /predict/disruption"
        color={isDisruption ? 'red' : 'emerald'}
      />

      <div className="flex gap-2 mb-4">
        <div className={cn(iconInputClass, 'flex-1')}>
          <MapPin size={14} className="text-[#94A3B8] flex-shrink-0" />
          <input
            type="text" value={city}
            onChange={e => setCity(e.target.value)}
            className="bg-transparent text-[#0F172A] py-2.5 text-sm outline-none w-full placeholder-[#94A3B8]"
            placeholder="Bangalore, Mumbai, Delhi..."
            onKeyDown={e => e.key === 'Enter' && handlePredict()}
          />
        </div>
        <button
          onClick={handlePredict} disabled={loading}
          className={cn('px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all active:scale-[.98] disabled:opacity-50 whitespace-nowrap',
            isDisruption ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-600 hover:bg-emerald-700'
          )}
        >
          {loading ? <Spinner /> : 'Scan City'}
        </button>
      </div>

      {signalLost && <SignalLostBanner />}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
            <div className={cn('rounded-2xl p-5 text-center border-2', isDisruption ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200')}>
              <div className={cn('font-mono font-bold text-5xl mb-1', isDisruption ? 'text-red-600' : 'text-emerald-600')}>
                {confidence}%
              </div>
              <div className={cn('text-base font-semibold mb-3', isDisruption ? 'text-red-500' : 'text-emerald-600')}>
                {isDisruption ? '⚠️ Disruption Likely' : '✅ Services Stable'}
              </div>
              <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden mx-4">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${confidence}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                  className={cn('h-full rounded-full', isDisruption ? 'bg-red-500' : 'bg-emerald-500')}
                />
              </div>
            </div>

            {/* Alert copy per API docs recommendation */}
            {isDisruption && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700 leading-relaxed font-medium">
                  High probability of route-wide disruptions. Take extra care and consider claiming if you're insured.
                </p>
              </div>
            )}

            {result.message && (
              <div className="text-xs text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 leading-relaxed">
                📡 {result.message}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!result && !signalLost && (
        <div className="text-center py-5 text-[#94A3B8] text-sm">
          Enter a city and click <span className="text-[#0F172A] font-semibold">Scan City</span> to check live disruption signals
        </div>
      )}
    </motion.section>
  )
}

// ─── Dynamic Pricing ──────────────────────────────────────
function DynamicPricingWidget() {
  const [city, setCity] = useState('Mumbai_Island_City')
  const { data: result, loading } = useDynamicPricing(city)
  const [signalLost, setSignalLost] = useState(false)

  const handleFetch = async () => {
    if (!city.trim()) { toast.error('Enter a city/zone name'); return }
    setSignalLost(false)
  }

  const riskLevel = result ? (result.risk_score > 0.6 ? 'HIGH' : result.risk_score > 0.3 ? 'MEDIUM' : 'LOW') : null
  const riskClass = riskLevel === 'HIGH' ? 'text-red-500' : riskLevel === 'MEDIUM' ? 'text-amber-500' : 'text-emerald-600'
  const riskBg = riskLevel === 'HIGH' ? 'bg-red-50 border-red-200' : riskLevel === 'MEDIUM' ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
  const barColor = riskLevel === 'HIGH' ? 'bg-red-500' : riskLevel === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'

  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="k-card">
      <SectionHeader icon={<Shield size={18} />} title="Hyper-Local AI Pricing" subtitle="GET /insurance/dynamic-pricing/{city}" color="purple" />

      <div className="flex gap-2 mb-2">
        <div className={cn(iconInputClass, 'flex-1')}>
          <MapPin size={14} className="text-[#94A3B8] flex-shrink-0" />
          <input
            type="text" value={city}
            onChange={e => setCity(e.target.value)}
            className="bg-transparent text-[#0F172A] py-2.5 text-sm outline-none w-full placeholder-[#94A3B8]"
            placeholder="Mumbai_Island_City, Bangalore_South..."
            onKeyDown={e => e.key === 'Enter' && handleFetch()}
          />
        </div>
        <button
          onClick={handleFetch} disabled={loading}
          className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-purple-600 hover:bg-purple-700 transition-all active:scale-[.98] disabled:opacity-50"
        >
          {loading ? <Spinner /> : 'Get Price'}
        </button>
      </div>

      {/* Hyper-local hint chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {PRICING_CITY_HINTS.map(hint => (
          <button
            key={hint}
            onClick={() => setCity(hint)}
            className={cn(
              'text-[10px] px-2 py-1 rounded-lg border font-mono transition-colors',
              city === hint
                ? 'bg-purple-100 border-purple-300 text-purple-700'
                : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:border-purple-200 hover:text-purple-600'
            )}
          >
            {hint}
          </button>
        ))}
      </div>

      {signalLost && <SignalLostBanner />}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-purple-600 font-medium mb-1">Weekly Premium · {result.city}</p>
                  <p className="font-mono font-bold text-4xl text-[#1E1B4B]">
                    {formatRupee(result.weekly_premium)}
                    <span className="text-base text-[#64748B] font-normal">/wk</span>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {result.is_safe_zone && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                      ✓ Safe Zone
                    </span>
                  )}
                  <span className={cn('px-2.5 py-1 rounded-full text-xs font-bold border', riskBg, riskClass)}>
                    {riskLevel} Risk
                  </span>
                </div>
              </div>

              {/* Safe zone discount copy per API docs */}
              {result.is_safe_zone && (
                <div className="mb-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                  <Zap size={13} className="text-emerald-600 flex-shrink-0" />
                  <p className="text-xs text-emerald-700 font-medium">Hyper-local Safety Discount Applied!</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-purple-200">
                <div>
                  <p className="text-[10px] text-purple-500 uppercase tracking-wider mb-0.5 font-semibold">Coverage</p>
                  <p className="font-mono text-[#0F172A] font-semibold text-sm">{result.coverage_hours} hrs/day</p>
                  {result.coverage_hours > 8 && (
                    <p className="text-[10px] text-emerald-600 mt-0.5">
                      Rain predicted: Auto-extended +{result.coverage_hours - 8}h protection
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] text-purple-500 uppercase tracking-wider mb-0.5 font-semibold">Risk Score</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-[#0F172A] font-semibold text-sm">{result.risk_score.toFixed(2)}</p>
                    <div className="flex-1 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${result.risk_score * 100}%` }}
                        className={cn('h-full rounded-full', barColor)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {result.adjustment_applied && (
              <div className="flex items-start gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
                <Zap size={14} className="text-[#6366F1] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#64748B]">{result.adjustment_applied}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!result && !signalLost && (
        <div className="text-center py-5 text-[#94A3B8] text-sm">
          Select a hyper-local zone above to see <span className="text-[#0F172A] font-semibold">AI-adjusted premiums</span>
        </div>
      )}
    </motion.section>
  )
}

// ─── Claim Checker ────────────────────────────────────────
function ClaimChecker() {
  const [location, setLocation] = useState('Chennai')
  const [income, setIncome] = useState(15000)
  const [avgHours, setAvgHours] = useState(8)
  const [premium, setPremium] = useState(100)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ClaimResult | null>(null)
  const [signalLost, setSignalLost] = useState(false)

  const handleCheck = async () => {
    if (!location.trim()) { toast.error('Enter a location'); return }
    setLoading(true); setSignalLost(false)
    try {
      const res = await kavachMlApi.checkClaim(premium, location, avgHours, income)
      setResult(res)
      if (res.is_eligible) toast.success('🎉 Claim triggers met — payout authorized!')
      else toast('No active environmental triggers right now.', { icon: 'ℹ️' })
    } catch (err: any) {
      if (err?.response?.status >= 500 || !err?.response) {
        setSignalLost(true)
      } else {
        toast.error('Failed to check claim eligibility')
      }
    }
    setLoading(false)
  }

  const isExcluded = result?.status === 'EXCLUDED'

  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="k-card">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: form */}
        <div className="flex-1">
          <SectionHeader icon={<Brain size={18} />} title="Automated Claim Checker" subtitle="POST /insurance/insurance-claim" color="cyan" />

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="col-span-2">
              <InputField label="Location">
                <div className={cn(iconInputClass, 'border-cyan-200 focus-within:border-cyan-400')}>
                  <MapPin size={14} className="text-cyan-500 flex-shrink-0" />
                  <input
                    type="text" value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="bg-transparent text-[#0F172A] py-2.5 text-sm outline-none w-full placeholder-[#94A3B8]"
                    placeholder="Chennai, Hyderabad, Mumbai..."
                  />
                </div>
              </InputField>
            </div>

            <InputField label="Monthly Income (₹)">
              <input type="number" value={income} onChange={e => setIncome(Number(e.target.value))} className={inputClass} />
            </InputField>

            <InputField label="Avg Daily Hours">
              <input type="number" value={avgHours} min={1} max={16} onChange={e => setAvgHours(Number(e.target.value))} className={inputClass} />
            </InputField>

            <div className="col-span-2">
              <InputField label="Monthly Premium Paid (₹)">
                <input type="number" value={premium} onChange={e => setPremium(Number(e.target.value))} className={inputClass} />
              </InputField>
            </div>
          </div>

          <PredictButton onClick={handleCheck} loading={loading} label="Check Claim Eligibility 🛡️" color="cyan" />
          {signalLost && <SignalLostBanner />}

          {/* Exclusion clause note */}
          <div className="flex items-start gap-2 mt-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
            <Info size={13} className="text-[#94A3B8] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Claims are automatically denied if news detects: <span className="font-mono">war, pandemic, terrorism, nuclear</span>
            </p>
          </div>
        </div>

        {/* Right: result */}
        <div className="flex-1 md:border-l border-[#EDE9FE] md:pl-6">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-8 gap-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center text-3xl">🛡️</div>
                <div>
                  <p className="text-[#0F172A] font-semibold mb-1">Parametric Claim Check</p>
                  <p className="text-[#64748B] text-xs max-w-xs">We fetch live Rain, AQI & News data. If triggers are met, you automatically qualify for a payout.</p>
                </div>
                <div className="flex flex-col gap-1.5 mt-2 text-left w-full max-w-xs">
                  {['Heavy Rain > 50mm', 'Toxic AQI > 200', 'Flood / Strike News'].map(t => (
                    <div key={t} className="flex items-center gap-2 text-xs text-[#64748B]">
                      <ChevronRight size={12} className="text-[#6366F1]" /> {t}
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="result" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                {/* Eligibility banner */}
                <div className={cn(
                  'rounded-2xl p-5 text-center border-2',
                  isExcluded
                    ? 'bg-amber-50 border-amber-300'
                    : result.is_eligible
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-[#F8FAFC] border-[#E2E8F0]'
                )}>
                  <div className="flex justify-center mb-2">
                    {isExcluded
                      ? <AlertTriangle size={36} className="text-amber-500" />
                      : result.is_eligible
                        ? <CheckCircle size={36} className="text-emerald-500" />
                        : <XCircle size={36} className="text-[#94A3B8]" />
                    }
                  </div>
                  <p className={cn('font-mono font-bold text-lg tracking-wider',
                    isExcluded ? 'text-amber-600' : result.is_eligible ? 'text-emerald-600' : 'text-[#64748B]'
                  )}>
                    {result.status}
                  </p>
                  {/* Show denial reason per API docs */}
                  {result.reason && (
                    <p className="text-[#64748B] text-xs mt-2 bg-white/60 rounded-lg px-3 py-1.5">
                      {result.reason}
                    </p>
                  )}
                  {!result.is_eligible && !result.reason && (
                    <p className="text-[#94A3B8] text-xs mt-1">No environmental triggers detected</p>
                  )}
                </div>

                {/* Env data */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[#EEF2FF] rounded-xl p-3 text-center">
                    <CloudRain size={16} className="text-blue-500 mx-auto mb-1" />
                    <p className="font-mono text-[#0F172A] text-sm font-semibold">{result.environment_data?.rain_mm ?? 0}mm</p>
                    <p className="text-[10px] text-[#94A3B8]">Rainfall</p>
                  </div>
                  <div className="bg-[#FFFBEB] rounded-xl p-3 text-center">
                    <Wind size={16} className="text-amber-500 mx-auto mb-1" />
                    <p className="font-mono text-[#0F172A] text-sm font-semibold">{result.environment_data?.aqi_pm25 ?? '—'}</p>
                    <p className="text-[10px] text-[#94A3B8]">AQI PM2.5</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-3 text-center">
                    <AlertTriangle size={16} className="text-red-500 mx-auto mb-1" />
                    <p className="font-mono text-[#0F172A] text-sm font-semibold">{result.triggers_found?.length ?? 0}</p>
                    <p className="text-[10px] text-[#94A3B8]">Triggers</p>
                  </div>
                </div>

                {/* Triggers list — verification proof per API docs */}
                {result.triggers_found?.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <p className="text-[10px] text-red-500 uppercase tracking-wider font-semibold mb-2">Verification Proof · Active Triggers</p>
                    {result.triggers_found.map((t, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-red-700">
                        <AlertTriangle size={12} className="text-red-500" /> {t}
                      </div>
                    ))}
                  </div>
                )}

                {/* Upsell per API docs: user is under-insured */}
                {result.suggested_premium && (
                  <div className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <div>
                      <p className="text-xs text-purple-600 font-semibold mb-0.5">⚠️ You may be under-insured</p>
                      <p className="text-[10px] text-[#64748B] mb-1">AI suggests upgrading to</p>
                      <p className="font-mono font-bold text-[#1E1B4B]">{formatRupee(result.suggested_premium)}/mo</p>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors">
                      Upgrade <ArrowUpRight size={12} />
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  )
}

// ─── Main Tab ─────────────────────────────────────────────
export function MlInsightsTab() {
  return (
    <div className="p-6 space-y-5">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Brain size={26} className="text-[#6366F1]" />
          <h2 className="font-syne font-bold text-2xl text-[#0F172A]">AI Insights</h2>
          <span className="badge-blue text-xs px-2 py-0.5">LIVE</span>
        </div>
        <p className="text-sm text-[#64748B]">
          Real-time ML predictions powered by <span className="font-semibold text-[#6366F1]">Kavach-ML</span>. All data fetched live from the API.
        </p>
      </div>

      <div className="flex items-center gap-2 bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl px-4 py-2.5">
        <Sparkles size={14} className="text-[#6366F1] flex-shrink-0" />
        <p className="text-xs text-[#4338CA] font-medium">
          API calls are logged in the browser console with request payloads and full responses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <EarningsPredictor />
        <DisruptionPredictor />
      </div>

      <DynamicPricingWidget />
      <ClaimChecker />
    </div>
  )
}
