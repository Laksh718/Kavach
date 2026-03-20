import { Routes, Route, NavLink } from 'react-router-dom'
import { FileText, TrendingUp, Shield, Download } from 'lucide-react'
import { KavachLogo } from '@/components/shared/KavachLogo'
import { formatRupee } from '@/utils/formatRupee'
import { cn } from '@/utils/cn'

function PremiumSettlement() {
  const settlements = [
    { city: 'Bengaluru',  starter: 124500, standard: 843000, shield: 297000, total: 1264500 },
    { city: 'Delhi-NCR',  starter: 98000,  standard: 612000, shield: 231000, total: 941000 },
    { city: 'Mumbai',     starter: 156000, standard: 924000, shield: 378000, total: 1458000 },
    { city: 'Chennai',    starter: 67200,  standard: 412000, shield: 148000, total: 627200 },
    { city: 'Hyderabad',  starter: 89400,  standard: 534000, shield: 196000, total: 819400 },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-syne font-bold text-2xl text-white">Weekly Premium Settlement</h2>
        <button className="flex items-center gap-2 text-sm text-blue-400 border border-blue-500/30 rounded-xl px-4 py-2 hover:bg-blue-500/10 transition-all">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="kavach-card p-4 flex gap-6 text-sm">
        <div>
          <div className="text-gray-400 font-dm">KAVACH share (40%)</div>
          <div className="font-mono font-bold text-blue-400 text-xl">{formatRupee(2044440)}</div>
        </div>
        <div>
          <div className="text-gray-400 font-dm">Your share (60%)</div>
          <div className="font-mono font-bold text-emerald-400 text-xl">{formatRupee(3066660)}</div>
        </div>
        <div>
          <div className="text-gray-400 font-dm">Gross total</div>
          <div className="font-mono font-bold text-white text-xl">{formatRupee(5111100)}</div>
        </div>
      </div>

      <div className="kavach-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              {['City', 'Starter', 'Standard', 'Shield', 'Total', 'Insurer (60%)'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-gray-400 font-dm font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {settlements.map((row) => (
              <tr key={row.city} className="border-t border-[#1F2937] hover:bg-white/3 transition-colors">
                <td className="px-4 py-3 text-white font-dm">{row.city}</td>
                <td className="px-4 py-3 font-mono text-gray-300">{formatRupee(row.starter)}</td>
                <td className="px-4 py-3 font-mono text-gray-300">{formatRupee(row.standard)}</td>
                <td className="px-4 py-3 font-mono text-gray-300">{formatRupee(row.shield)}</td>
                <td className="px-4 py-3 font-mono font-bold text-white">{formatRupee(row.total)}</td>
                <td className="px-4 py-3 font-mono text-emerald-400">{formatRupee(Math.round(row.total * 0.6))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const insurerNav = [
  { to: '/insurer', icon: TrendingUp, label: 'Settlement', end: true },
  { to: '/insurer/claims', icon: Shield, label: 'Claims Liability' },
  { to: '/insurer/reinsurance', icon: TrendingUp, label: 'Reinsurance' },
  { to: '/insurer/irdai', icon: FileText, label: 'IRDAI Reports' },
]

export default function InsurerPortal() {
  return (
    <div className="flex h-screen bg-[#0A0E1A] overflow-hidden">
      <aside className="hidden md:flex flex-col w-56 bg-[#111827] border-r border-[#1F2937]">
        <div className="p-4 border-b border-[#1F2937]">
          <KavachLogo size="sm" />
          <div className="mt-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2 py-1 font-mono">
            INSURER PORTAL
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {insurerNav.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 overflow-y-auto">
        <header className="h-14 bg-[#111827] border-b border-[#1F2937] flex items-center px-6">
          <h1 className="font-syne font-semibold text-white">Insurer Partner Portal</h1>
          <div className="ml-auto text-xs text-gray-500 font-dm">Read-only access · Digit Insurance</div>
        </header>
        <Routes>
          <Route index element={<PremiumSettlement />} />
          <Route path="claims" element={<div className="p-6 text-gray-400">Claims Liability — coming soon</div>} />
          <Route path="reinsurance" element={<div className="p-6 text-gray-400">Reinsurance Hedge Report — coming soon</div>} />
          <Route path="irdai" element={<div className="p-6 text-gray-400">IRDAI Parametric Reports — coming soon</div>} />
        </Routes>
      </div>
    </div>
  )
}
