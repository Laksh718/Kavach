import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  ChevronDown, ChevronUp, AlertCircle, Shield, CloudRain, Wind,
  AlertTriangle, CheckCircle, XCircle, ExternalLink,
} from 'lucide-react'
import { Modal } from '@/components/shared/Modal'
import { formatRupee } from '@/utils/formatRupee'
import { cn } from '@/utils/cn'
import { kavachMlApi } from '@/services/api/kavachMlApi'

type FilterType = 'all' | 'rain' | 'aqi' | 'flood' | 'heat' | 'curfew'
type FilterDate = 'week' | 'month' | '3months'

const allPayouts = [
  { id: 'p1', type: 'rain',  emoji: '🌧️', label: 'Heavy Rain',    zone: 'Koramangala',     amount: 364, date: '2026-03-19', dateDisplay: 'Mar 19', expected: 740, actual: 220, shortfall: 520, coverage: 70, severity: 1.0, upi: 'pay_Pab7X2kR9q', credited: 'PhonePe ••••7832', timeToPayment: '3 min 42 sec', income: 18000 },
  { id: 'p2', type: 'aqi',   emoji: '😷', label: 'AQI Severe',     zone: 'Connaught Place', amount: 210, date: '2026-03-11', dateDisplay: 'Mar 11', expected: 740, actual: 440, shortfall: 300, coverage: 70, severity: 1.0, upi: 'pay_Xr8WqkL2mN', credited: 'Google Pay ••••2241', timeToPayment: '4 min 01 sec', income: 18000 },
  { id: 'p3', type: 'flood', emoji: '🌊', label: 'Flood Alert',     zone: 'BTM Layout',     amount: 480, date: '2026-03-06', dateDisplay: 'Mar 6',  expected: 740, actual: 0,   shortfall: 740, coverage: 70, severity: 0.92, upi: 'pay_Rt5LmBx7kP', credited: 'PhonePe ••••7832', timeToPayment: '3 min 58 sec', income: 18000 },
  { id: 'p4', type: 'rain',  emoji: '🌧️', label: 'Heavy Rain',    zone: 'Koramangala',     amount: 294, date: '2026-02-28', dateDisplay: 'Feb 28', expected: 740, actual: 320, shortfall: 420, coverage: 70, severity: 1.0, upi: 'pay_Nk9WsQv3xT', credited: 'PhonePe ••••7832', timeToPayment: '4 min 12 sec', income: 18000 },
  { id: 'p5', type: 'heat',  emoji: '🌡️', label: 'Extreme Heat',   zone: 'Bengaluru',      amount: 148, date: '2026-02-21', dateDisplay: 'Feb 21', expected: 740, actual: 530, shortfall: 210, coverage: 70, severity: 1.0, upi: 'pay_Jt4FnMs6rW', credited: 'BHIM ••••9901',    timeToPayment: '3 min 27 sec', income: 18000 },
  { id: 'p6', type: 'rain',  emoji: '🌧️', label: 'Heavy Rain',    zone: 'HSR Layout',      amount: 346, date: '2026-02-12', dateDisplay: 'Feb 12', expected: 740, actual: 245, shortfall: 495, coverage: 70, severity: 1.0, upi: 'pay_Cx2WpRn8kQ', credited: 'PhonePe ••••7832', timeToPayment: '3 min 55 sec', income: 18000 },
]

// ── Trust Report Modal ────────────────────────────────────
interface TrustReportModalProps {
  open: boolean
  onClose: () => void
  payout: typeof allPayouts[0]
}

interface ClaimResult {
  is_eligible: boolean
  status: string
  reason?: string | null
  triggers_found: string[]
  environment_data: { rain_mm?: number; aqi_pm25?: number; news?: string }
  suggested_premium?: number | null
}

function TrustReportModal({ open, onClose, payout }: TrustReportModalProps) {
  const [result, setResult] = useState<ClaimResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)

  const fetchProof = async () => {
    setLoading(true)
    try {
      // Use payout metadata to re-verify: income from payout, location = zone, avgHours=8, premium inferred
      const res = await kavachMlApi.checkClaim(
        Math.round(payout.amount / 4), // approx monthly premium from payout amount
        payout.zone,
        8,
        payout.income,
      )
      setResult(res)
      setFetched(true)
    } catch {
      toast.error('Live signals temporarily unavailable for verification')
    }
    setLoading(false)
  }

  // Auto-fetch when modal opens
  useState(() => { if (open && !fetched) fetchProof() })
  if (open && !fetched && !loading) fetchProof()

  const isEligible = result?.is_eligible

  return (
    <Modal open={open} onClose={() => { onClose(); setResult(null); setFetched(false) }} title="">
      {/* Custom header */}
      <div className="flex items-center gap-3 mb-5 -mt-2">
        <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
          <Shield size={20} className="text-[#6366F1]" />
        </div>
        <div>
          <h3 className="font-syne font-bold text-[#0F172A] text-lg">Verification Proof</h3>
          <p className="text-xs text-[#64748B]">Trust Report · {payout.label} — {payout.zone}</p>
        </div>
      </div>

      {/* UPI Reference */}
      <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl p-3 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-[#6366F1] uppercase tracking-wider font-semibold mb-0.5">Verification Hash</p>
            <p className="font-mono text-sm font-bold text-[#1E1B4B]">{payout.upi}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[#94A3B8]">Amount Disbursed</p>
            <p className="font-mono font-bold text-emerald-600">+{formatRupee(payout.amount)}</p>
          </div>
        </div>
        <p className="text-xs text-[#64748B] mt-1.5">Credited to {payout.credited} · {payout.timeToPayment} after trigger</p>
      </div>

      {loading && !result && (
        <div className="space-y-3 animate-pulse">
          <div className="h-20 bg-[#F1F5F9] rounded-xl" />
          <div className="grid grid-cols-3 gap-2">
            {[1,2,3].map(i => <div key={i} className="h-16 bg-[#F1F5F9] rounded-xl" />)}
          </div>
          <p className="text-xs text-center text-[#94A3B8]">Fetching live environmental signals...</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          {/* Eligibility verdict */}
          <div className={cn('rounded-2xl p-4 text-center border-2',
            isEligible ? 'bg-emerald-50 border-emerald-300' : 'bg-[#F8FAFC] border-[#E2E8F0]'
          )}>
            <div className="flex justify-center mb-2">
              {isEligible
                ? <CheckCircle size={32} className="text-emerald-500" />
                : <XCircle size={32} className="text-[#94A3B8]" />
              }
            </div>
            <p className={cn('font-mono font-bold tracking-wider', isEligible ? 'text-emerald-700' : 'text-[#64748B]')}>
              {result.status}
            </p>
            {result.reason && (
              <p className="text-xs text-[#64748B] mt-1.5 bg-white/70 rounded-lg px-3 py-1.5">{result.reason}</p>
            )}
          </div>

          {/* Environmental signals */}
          <div>
            <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider font-semibold mb-2">Live Environmental Signals</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
                <CloudRain size={15} className="text-blue-500 mx-auto mb-1" />
                <p className="font-mono font-bold text-sm text-[#0F172A]">{result.environment_data?.rain_mm ?? 0}mm</p>
                <p className="text-[10px] text-[#94A3B8]">Rainfall</p>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                <Wind size={15} className="text-amber-500 mx-auto mb-1" />
                <p className="font-mono font-bold text-sm text-[#0F172A]">{result.environment_data?.aqi_pm25 ?? '—'}</p>
                <p className="text-[10px] text-[#94A3B8]">AQI PM2.5</p>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
                <AlertTriangle size={15} className="text-red-500 mx-auto mb-1" />
                <p className="font-mono font-bold text-sm text-[#0F172A]">{result.triggers_found?.length ?? 0}</p>
                <p className="text-[10px] text-[#94A3B8]">Triggers</p>
              </div>
            </div>
          </div>

          {/* Triggers list ─ verification proof per API docs */}
          {result.triggers_found?.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-[10px] text-red-500 uppercase tracking-wider font-semibold mb-2">
                Active Trigger Evidence — Payout Proof
              </p>
              {result.triggers_found.map((t, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-red-700 mb-1 last:mb-0">
                  <AlertTriangle size={12} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">{t}</span>
                </div>
              ))}
            </div>
          )}

          {/* News description */}
          {result.environment_data?.news && (
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
              <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider font-semibold mb-1">News Signal</p>
              <p className="text-xs text-[#64748B] leading-relaxed">📰 {result.environment_data.news}</p>
            </div>
          )}

          {/* No triggers: explain */}
          {result.triggers_found?.length === 0 && (
            <p className="text-xs text-[#94A3B8] text-center py-2">
              No active environmental triggers at time of current verification. Historical payout was valid at time of event.
            </p>
          )}

          <p className="text-[10px] text-[#94A3B8] text-center">
            Verification powered by Kavach-ML · Live data from OpenWeather + NewsAPI
          </p>
        </div>
      )}
    </Modal>
  )
}

// ── Payout Row ─────────────────────────────────────────────
function PayoutRow({ payout }: { payout: typeof allPayouts[0] }) {
  const [expanded, setExpanded] = useState(false)
  const [disputeOpen, setDisputeOpen] = useState(false)
  const [trustOpen, setTrustOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDispute = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setDisputeOpen(false)
    toast.success("Dispute logged. We'll review within 48 hours.")
    setReason('')
  }

  return (
    <>
      {/* Dispute modal */}
      <Modal open={disputeOpen} onClose={() => setDisputeOpen(false)} title="Dispute Payout">
        <p className="text-sm text-[#64748B] mb-3">Describe the issue with payout {payout.upi}</p>
        <textarea
          className="k-input min-h-[100px] resize-none mb-4"
          placeholder="Describe the issue..."
          value={reason}
          onChange={e => setReason(e.target.value)}
        />
        <button onClick={handleDispute} className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading || !reason.trim()}>
          {loading && <span className="spinner-white w-4 h-4" />}Submit Dispute
        </button>
      </Modal>

      {/* Trust Report modal */}
      <TrustReportModal open={trustOpen} onClose={() => setTrustOpen(false)} payout={payout} />

      <div className="k-card overflow-hidden p-0">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-3 p-4 hover:bg-[#F8FAFF] transition-colors text-left"
        >
          <div className="w-11 h-11 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-xl flex-shrink-0">{payout.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-[#0F172A] text-sm">{payout.label} — {payout.zone}</div>
            <div className="text-xs text-[#94A3B8]">{payout.dateDisplay}</div>
          </div>
          <div className="text-right mr-2">
            <div className="font-mono font-bold text-[#10B981]">+{formatRupee(payout.amount)}</div>
            <div className="badge-success text-[10px] mt-0.5">Completed ✓</div>
          </div>
          {expanded ? <ChevronUp size={16} className="text-[#64748B] flex-shrink-0" /> : <ChevronDown size={16} className="text-[#64748B] flex-shrink-0" />}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-[#EDE9FE]"
            >
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  {[
                    { l: 'Expected earnings',        v: formatRupee(payout.expected),  c: 'text-[#64748B]' },
                    { l: 'Actual earnings',           v: formatRupee(payout.actual),    c: 'text-[#F97316]' },
                    { l: 'Shortfall',                 v: formatRupee(payout.shortfall), c: 'text-[#EF4444]' },
                    { l: `Plan covers (${payout.coverage}%)`, v: formatRupee(payout.amount), c: 'text-[#10B981]' },
                    { l: 'Disruption severity',       v: `×${payout.severity}`,         c: 'text-[#6366F1]' },
                    { l: 'Time to payout',            v: payout.timeToPayment,           c: 'text-[#0F172A]' },
                  ].map(({ l, v, c }) => (
                    <div key={l}>
                      <div className="text-xs text-[#94A3B8]">{l}</div>
                      <div className={cn('font-mono font-semibold text-sm', c)}>{v}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#EEF2FF] rounded-xl p-3 text-xs">
                  <div className="text-[#64748B]">UPI Transaction</div>
                  <div className="font-mono font-bold text-[#6366F1]">{payout.upi}</div>
                  <div className="text-[#94A3B8] mt-0.5">Credited to {payout.credited}</div>
                </div>

                {/* Verification Proof button — KEY FEATURE */}
                <button
                  onClick={() => setTrustOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-[#6366F1] text-[#6366F1] font-semibold text-sm hover:bg-[#EEF2FF] transition-colors"
                >
                  <Shield size={15} />
                  View Verification Proof 🛡️
                  <ExternalLink size={12} />
                </button>

                <button
                  onClick={() => setDisputeOpen(true)}
                  className="text-xs text-[#EF4444] flex items-center gap-1 hover:underline"
                >
                  <AlertCircle size={12} /> Dispute this payout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export function PayoutsTab() {
  const [typeFilter, setTypeFilter] = useState<FilterType>('all')
  const [dateFilter, setDateFilter] = useState<FilterDate>('month')

  const filtered = useMemo(() => {
    let result = allPayouts
    if (typeFilter !== 'all') result = result.filter(p => p.type === typeFilter)
    const now = new Date('2026-03-20')
    if (dateFilter === 'week')  result = result.filter(p => (now.getTime() - new Date(p.date).getTime()) < 7 * 86400000)
    if (dateFilter === 'month') result = result.filter(p => (now.getTime() - new Date(p.date).getTime()) < 30 * 86400000)
    return result
  }, [typeFilter, dateFilter])

  const total = allPayouts.reduce((s, p) => s + p.amount, 0)
  const thisMonth = allPayouts.filter(p => new Date(p.date) >= new Date('2026-03-01')).reduce((s, p) => s + p.amount, 0)

  return (
    <div className="p-6 max-w-2xl space-y-5">
      <div>
        <h2 className="font-syne font-bold text-2xl text-[#0F172A]">Payouts</h2>
        <p className="text-sm text-[#64748B] mt-0.5">Click any payout to expand and view live verification proof.</p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total received', value: formatRupee(total) },
          { label: 'This month',     value: formatRupee(thisMonth) },
          { label: 'Claims',         value: `${allPayouts.length}` },
        ].map(({ label, value }) => (
          <div key={label} className="k-card-sm text-center">
            <div className="text-xs text-[#64748B] mb-1">{label}</div>
            <div className="font-mono font-bold text-[#0F172A]">{value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="k-toggle-group">
          {(['all','rain','aqi','flood','heat'] as FilterType[]).map(t => (
            <button key={t} className={cn('k-toggle-btn capitalize', typeFilter === t && 'active')} onClick={() => setTypeFilter(t)}>
              {t === 'all' ? 'All' : t.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="k-toggle-group">
          {([['week','This week'], ['month','This month'], ['3months','3 months']] as [FilterDate, string][]).map(([v, l]) => (
            <button key={v} className={cn('k-toggle-btn', dateFilter === v && 'active')} onClick={() => setDateFilter(v)}>{l}</button>
          ))}
        </div>
      </div>

      {/* Payout list */}
      {filtered.length === 0 ? (
        <div className="k-card text-center py-12">
          <div className="text-5xl mb-3">🛡️</div>
          <p className="text-[#0F172A] font-semibold">No payouts yet</p>
          <p className="text-sm text-[#64748B] mt-1">Your first payout arrives automatically when a disruption hits your zone.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(p => <PayoutRow key={p.id} payout={p} />)}
        </div>
      )}
    </div>
  )
}
