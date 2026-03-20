import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import { Modal } from '@/components/shared/Modal'
import { formatRupee } from '@/utils/formatRupee'
import { cn } from '@/utils/cn'

type FilterType = 'all' | 'rain' | 'aqi' | 'flood' | 'heat' | 'curfew'
type FilterDate = 'week' | 'month' | '3months'

const allPayouts = [
  { id: 'p1', type: 'rain',  emoji: '🌧️', label: 'Heavy Rain',    zone: 'Koramangala', amount: 364, date: '2026-03-19', dateDisplay: 'Mar 19', expected: 740, actual: 220, shortfall: 520, coverage: 70, severity: 1.0, upi: 'pay_Pab7X2kR9q', credited: 'PhonePe ••••7832', timeToPayment: '3 min 42 sec' },
  { id: 'p2', type: 'aqi',   emoji: '😷', label: 'AQI Severe',     zone: 'Connaught Place', amount: 210, date: '2026-03-11', dateDisplay: 'Mar 11', expected: 740, actual: 440, shortfall: 300, coverage: 70, severity: 1.0, upi: 'pay_Xr8WqkL2mN', credited: 'Google Pay ••••2241', timeToPayment: '4 min 01 sec' },
  { id: 'p3', type: 'flood', emoji: '🌊', label: 'Flood Alert',     zone: 'BTM Layout',   amount: 480, date: '2026-03-06', dateDisplay: 'Mar 6',  expected: 740, actual: 0,   shortfall: 740, coverage: 70, severity: 0.92, upi: 'pay_Rt5LmBx7kP', credited: 'PhonePe ••••7832', timeToPayment: '3 min 58 sec' },
  { id: 'p4', type: 'rain',  emoji: '🌧️', label: 'Heavy Rain',    zone: 'Koramangala', amount: 294, date: '2026-02-28', dateDisplay: 'Feb 28', expected: 740, actual: 320, shortfall: 420, coverage: 70, severity: 1.0, upi: 'pay_Nk9WsQv3xT', credited: 'PhonePe ••••7832', timeToPayment: '4 min 12 sec' },
  { id: 'p5', type: 'heat',  emoji: '🌡️', label: 'Extreme Heat',   zone: 'Bengaluru',   amount: 148, date: '2026-02-21', dateDisplay: 'Feb 21', expected: 740, actual: 530, shortfall: 210, coverage: 70, severity: 1.0, upi: 'pay_Jt4FnMs6rW', credited: 'BHIM ••••9901',    timeToPayment: '3 min 27 sec' },
  { id: 'p6', type: 'rain',  emoji: '🌧️', label: 'Heavy Rain',    zone: 'HSR Layout',  amount: 346, date: '2026-02-12', dateDisplay: 'Feb 12', expected: 740, actual: 245, shortfall: 495, coverage: 70, severity: 1.0, upi: 'pay_Cx2WpRn8kQ', credited: 'PhonePe ••••7832', timeToPayment: '3 min 55 sec' },
]

function PayoutRow({ payout }: { payout: typeof allPayouts[0] }) {
  const [expanded, setExpanded] = useState(false)
  const [disputeOpen, setDisputeOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDispute = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setDisputeOpen(false)
    toast.success('Dispute logged. We\'ll review within 48 hours.')
    setReason('')
  }

  return (
    <>
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
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-[#EDE9FE]"
            >
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  {[
                    { l: 'Expected earnings', v: formatRupee(payout.expected),  c: 'text-[#64748B]' },
                    { l: 'Actual earnings',   v: formatRupee(payout.actual),    c: 'text-[#F97316]' },
                    { l: 'Shortfall',         v: formatRupee(payout.shortfall), c: 'text-[#EF4444]' },
                    { l: `Plan covers (${payout.coverage}%)`, v: formatRupee(payout.amount), c: 'text-[#10B981]' },
                    { l: 'Disruption severity', v: `×${payout.severity}`,        c: 'text-[#6366F1]' },
                    { l: 'Time to payout',    v: payout.timeToPayment,           c: 'text-[#0F172A]' },
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
    if (dateFilter === 'week') result = result.filter(p => (now.getTime() - new Date(p.date).getTime()) < 7 * 86400000)
    if (dateFilter === 'month') result = result.filter(p => (now.getTime() - new Date(p.date).getTime()) < 30 * 86400000)
    return result
  }, [typeFilter, dateFilter])

  const total = allPayouts.reduce((s, p) => s + p.amount, 0)
  const thisMonth = allPayouts.filter(p => new Date(p.date) >= new Date('2026-03-01')).reduce((s, p) => s + p.amount, 0)

  return (
    <div className="p-6 max-w-2xl space-y-5">
      <h2 className="font-syne font-bold text-2xl text-[#0F172A]">Payouts</h2>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total received', value: formatRupee(total) },
          { label: 'This month', value: formatRupee(thisMonth) },
          { label: 'Claims', value: `${allPayouts.length}` },
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
