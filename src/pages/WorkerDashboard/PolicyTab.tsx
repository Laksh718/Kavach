import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Shield, ChevronDown, ChevronUp, ToggleLeft, ToggleRight, Download } from 'lucide-react'
import { Modal } from '@/components/shared/Modal'
import { usePolicyStore } from '@/store/policyStore'
import { PLANS } from '@/constants/plans'
import { formatRupee } from '@/utils/formatRupee'
import { cn } from '@/utils/cn'
import type { PlanTier } from '@/types/worker.types'

const coverageItems = [
  { label: 'Rain trigger', detail: 'Zone-calibrated threshold (10mm/hr)', covered: true },
  { label: 'AQI Severe', detail: '>301 for 3+ consecutive hours', covered: true },
  { label: 'Extreme Heat', detail: 'Feels-like >46°C for 4+ hrs', covered: true },
  { label: 'Flood Alert', detail: 'NDMA/State authority red alert', covered: true },
  { label: 'Curfew/Bandh', detail: 'Verified by admin — manual trigger', covered: true },
]

const consentItems = [
  { id: 'earnings',  label: 'Earnings data (AA Framework)', desc: 'Required for coverage calculation', required: true,  defaultOn: true  },
  { id: 'location',  label: 'Location data',               desc: 'For zone-based safety alerts',        required: false, defaultOn: true  },
  { id: 'insurer',   label: 'Share with insurer',          desc: 'Required for active coverage',        required: true,  defaultOn: true  },
]

export function PolicyTab() {
  const navigate = useNavigate()
  const { tier, status, weeklyPremium, pausesUsedThisYear, pause, cancel, setTier } = usePolicyStore()
  const plan = PLANS[tier]

  const [coverageOpen, setCoverageOpen] = useState(false)
  const [switchModal, setSwitchModal] = useState<{ target: PlanTier } | null>(null)
  const [pauseModal, setPauseModal] = useState(false)
  const [cancelModal, setCancelModal] = useState(false)
  const [pauseWeeks, setPauseWeeks] = useState<1|2>(1)
  const [consents, setConsents] = useState<Record<string, boolean>>({ earnings: true, location: true, insurer: true })
  const [loading, setLoading] = useState(false)

  const handlePlanSwitch = async () => {
    if (!switchModal) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setTier(switchModal.target)
    setSwitchModal(null)
    setLoading(false)
    toast.success(`Plan updated to ${PLANS[switchModal.target].label} ✓`)
  }

  const handlePause = () => {
    pause()
    toast.success(`Policy paused for ${pauseWeeks} week${pauseWeeks > 1 ? 's' : ''}`)
    setPauseModal(false)
  }

  const handleCancel = () => {
    cancel()
    toast(`Policy cancelled. Redirecting...`, { icon: '⚠️' })
    setCancelModal(false)
    setTimeout(() => navigate('/onboard'), 1500)
  }

  const handleConsent = (id: string, val: boolean, required: boolean) => {
    if (required && !val) {
      toast.error('This consent is required for active coverage')
      return
    }
    setConsents(c => ({ ...c, [id]: val }))
    toast.success('Consent updated')
  }

  const handleDownloadPDF = () => {
    const content = `KAVACH POLICY DOCUMENT\nPlan: ${plan.label}\nWeekly Premium: ₹${weeklyPremium}\nCoverage: ${plan.coveragePercent}%\nMax Weekly Payout: ₹${plan.maxWeeklyPayout}\nStatus: ${status}\nGenerated: ${new Date().toLocaleString('en-IN')}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'kavach-policy.txt'; a.click()
    URL.revokeObjectURL(url)
    toast.success('Policy document downloaded')
  }

  return (
    <div className="p-6 max-w-2xl space-y-5">
      {/* Plan switch modal */}
      <Modal open={!!switchModal} onClose={() => setSwitchModal(null)} title={`Switch to ${switchModal ? PLANS[switchModal.target].label : ''}`}>
        <p className="text-[#64748B] text-sm mb-4">
          Week premium will change to <strong>{switchModal ? formatRupee(PLANS[switchModal.target].basePrice) : ''}</strong>/week.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setSwitchModal(null)} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handlePlanSwitch} className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={loading}>
            {loading && <span className="spinner-white w-4 h-4" />}Confirm
          </button>
        </div>
      </Modal>

      {/* Pause modal */}
      <Modal open={pauseModal} onClose={() => setPauseModal(false)} title="Pause Policy">
        <p className="text-sm text-[#64748B] mb-4">{2 - pausesUsedThisYear} of 2 pauses remaining this year.</p>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {([1,2] as const).map(n => (
            <button key={n} onClick={() => setPauseWeeks(n)}
              className={cn('border-2 rounded-2xl py-4 text-center', pauseWeeks === n ? 'border-[#6366F1] bg-indigo-50' : 'border-[#E2E8F0]')}>
              <div className="font-syne font-bold text-2xl text-[#0F172A]">{n}</div>
              <div className="text-sm text-[#64748B]">week{n > 1 ? 's' : ''}</div>
            </button>
          ))}
        </div>
        <button onClick={handlePause} className="btn-primary w-full">Pause for {pauseWeeks} week{pauseWeeks > 1 ? 's' : ''}</button>
      </Modal>

      {/* Cancel modal */}
      <Modal open={cancelModal} onClose={() => setCancelModal(false)} title="Cancel Policy">
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
          <p className="text-red-700 text-sm font-medium">⚠️ Your protection ends immediately upon cancellation.</p>
          <p className="text-red-600 text-xs mt-1">Any active disruption payouts will still be processed.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setCancelModal(false)} className="btn-secondary flex-1">Keep Policy</button>
          <button onClick={handleCancel} className="flex-1 bg-red-500 text-white rounded-xl py-3 font-semibold text-sm">Yes, Cancel</button>
        </div>
      </Modal>

      <h2 className="font-syne font-bold text-2xl text-[#0F172A]">My Policy</h2>

      {/* Active plan card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="k-card-hero">
        <div className="flex items-start justify-between">
          <div>
            <div className="badge-blue mb-3">{plan.label} Plan</div>
            <div className="font-syne font-bold text-3xl text-[#1E1B4B]">{formatRupee(weeklyPremium)}<span className="text-base font-dm font-normal text-indigo-600">/week</span></div>
          </div>
          <Shield size={36} className="text-[#1E1B4B]" />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[
            { l: 'Coverage', v: `${plan.coveragePercent}%` },
            { l: 'Max weekly', v: formatRupee(plan.maxWeeklyPayout) },
            { l: 'Next renewal', v: 'Mar 23' },
          ].map(({ l, v }) => (
            <div key={l}>
              <div className="text-[#4338CA] text-xs">{l}</div>
              <div className="font-mono font-semibold text-[#1E1B4B] text-sm">{v}</div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="text-sm text-[#065F46] font-medium capitalize">{status}</span>
          </div>
        </div>
      </motion.div>

      {/* Coverage details accordion */}
      <div className="k-card">
        <button
          onClick={() => setCoverageOpen(!coverageOpen)}
          className="w-full flex items-center justify-between"
        >
          <h3 className="font-syne font-semibold text-[#0F172A]">Coverage Details</h3>
          {coverageOpen ? <ChevronUp size={18} className="text-[#64748B]" /> : <ChevronDown size={18} className="text-[#64748B]" />}
        </button>
        {coverageOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 space-y-3">
            {coverageItems.map(({ label, detail, covered }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-[#10B981] font-bold text-sm flex-shrink-0">{covered ? '✓' : '✗'}</span>
                <div>
                  <div className="text-sm font-medium text-[#0F172A]">{label}</div>
                  <div className="text-xs text-[#64748B]">{detail}</div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Plan switch */}
      <div className="k-card">
        <h3 className="font-syne font-semibold text-[#0F172A] mb-4">Switch Plan</h3>
        <div className="space-y-3">
          {(Object.values(PLANS) as typeof PLANS[PlanTier][]).map((p) => (
            <div key={p.id}
              onClick={() => p.id !== tier && setSwitchModal({ target: p.id as PlanTier })}
              className={cn(
                'flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all',
                p.id === tier ? 'border-[#6366F1] bg-indigo-50' : 'border-[#E2E8F0] hover:border-indigo-200'
              )}
            >
              <div>
                <div className="font-semibold text-[#0F172A] text-sm">{p.label}</div>
                <div className="text-xs text-[#64748B]">{p.coveragePercent}% coverage · max {formatRupee(p.maxWeeklyPayout)}/wk</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#0F172A]">{formatRupee(p.basePrice)}/wk</span>
                {p.id === tier && <span className="badge-blue text-[10px]">Current</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-3">
        <button onClick={() => setPauseModal(true)} className="k-card-sm flex flex-col items-center gap-2 text-center interactive py-4">
          <span className="text-2xl">⏸</span><span className="text-xs text-[#64748B]">Pause Policy</span>
        </button>
        <button onClick={handleDownloadPDF} className="k-card-sm flex flex-col items-center gap-2 text-center interactive py-4">
          <Download size={24} className="text-[#6366F1]" /><span className="text-xs text-[#64748B]">Download PDF</span>
        </button>
        <button onClick={() => setCancelModal(true)} className="k-card-sm flex flex-col items-center gap-2 text-center interactive py-4">
          <span className="text-2xl">❌</span><span className="text-xs text-red-500">Cancel</span>
        </button>
      </div>

      {/* DPDP consent toggles */}
      <div className="k-card">
        <h3 className="font-syne font-semibold text-[#0F172A] mb-4">Data Consent (DPDP Act)</h3>
        <div className="space-y-4">
          {consentItems.map(({ id, label, desc, required }) => (
            <div key={id} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-[#0F172A]">{label}</div>
                <div className="text-xs text-[#64748B]">{desc} {required && <span className="text-[#6366F1]">(Required)</span>}</div>
              </div>
              <button onClick={() => handleConsent(id, !consents[id], required)}>
                {consents[id]
                  ? <ToggleRight size={28} className="text-[#6366F1]" />
                  : <ToggleLeft size={28} className="text-[#94A3B8]" />
                }
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
