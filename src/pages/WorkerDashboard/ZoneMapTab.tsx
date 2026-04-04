import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Rectangle, Popup } from 'react-leaflet'
import type { LatLngBoundsExpression } from 'leaflet'
import { CITIES } from '@/constants/cities'
import type { City } from '@/types/zone.types'
import { cn } from '@/utils/cn'
import { kavachMlApi } from '@/services/api/kavachMlApi'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  CloudRain, Newspaper, Activity, TrendingUp,
  DollarSign, AlertTriangle, CheckCircle, RefreshCw, MapPin,
} from 'lucide-react'

type ZoneView = 'risk' | 'forecast' | 'historical'

interface MockZone {
  id: string; name: string; bounds: LatLngBoundsExpression
  riskScore: { risk: number; forecast: number; historical: number }
  primaryRisk: string; activeDisruption: boolean; shields: number
}

const bengaluruZones: MockZone[] = [
  { id: 'z1', name: 'Koramangala',    bounds: [[12.920, 77.607], [12.940, 77.638]], riskScore: { risk: 8, forecast: 7, historical: 6 }, primaryRisk: 'Flood', activeDisruption: true,  shields: 2 },
  { id: 'z2', name: 'Indiranagar',    bounds: [[12.970, 77.635], [12.988, 77.655]], riskScore: { risk: 5, forecast: 4, historical: 5 }, primaryRisk: 'Rain',  activeDisruption: false, shields: 3 },
  { id: 'z3', name: 'Whitefield',     bounds: [[12.955, 77.734], [12.975, 77.757]], riskScore: { risk: 3, forecast: 2, historical: 3 }, primaryRisk: 'Heat',  activeDisruption: false, shields: 4 },
  { id: 'z4', name: 'BTM Layout',     bounds: [[12.904, 77.608], [12.920, 77.630]], riskScore: { risk: 9, forecast: 8, historical: 7 }, primaryRisk: 'Flood', activeDisruption: true,  shields: 1 },
  { id: 'z5', name: 'JP Nagar',       bounds: [[12.888, 77.577], [12.908, 77.600]], riskScore: { risk: 6, forecast: 6, historical: 5 }, primaryRisk: 'Rain',  activeDisruption: false, shields: 3 },
  { id: 'z6', name: 'Hebbal',         bounds: [[13.024, 77.587], [13.044, 77.607]], riskScore: { risk: 2, forecast: 1, historical: 2 }, primaryRisk: 'AQI',   activeDisruption: false, shields: 5 },
  { id: 'z7', name: 'Marathahalli',   bounds: [[12.952, 77.690], [12.972, 77.713]], riskScore: { risk: 4, forecast: 3, historical: 4 }, primaryRisk: 'Rain',  activeDisruption: false, shields: 4 },
  { id: 'z8', name: 'Electronic City',bounds: [[12.842, 77.658], [12.867, 77.680]], riskScore: { risk: 3, forecast: 3, historical: 2 }, primaryRisk: 'Heat',  activeDisruption: false, shields: 4 },
]
const delhiZones: MockZone[] = [
  { id: 'd1', name: 'Connaught Place', bounds: [[28.625, 77.205], [28.640, 77.225]], riskScore: { risk: 9, forecast: 8, historical: 8 }, primaryRisk: 'AQI',  activeDisruption: true,  shields: 1 },
  { id: 'd2', name: 'Dwarka',          bounds: [[28.570, 77.020], [28.592, 77.052]], riskScore: { risk: 6, forecast: 5, historical: 6 }, primaryRisk: 'AQI',  activeDisruption: false, shields: 3 },
  { id: 'd3', name: 'Rohini',          bounds: [[28.720, 77.100], [28.742, 77.130]], riskScore: { risk: 5, forecast: 4, historical: 5 }, primaryRisk: 'Heat', activeDisruption: false, shields: 3 },
  { id: 'd4', name: 'Saket',           bounds: [[28.520, 77.206], [28.538, 77.226]], riskScore: { risk: 4, forecast: 4, historical: 3 }, primaryRisk: 'AQI',  activeDisruption: false, shields: 3 },
]
const zonesByCity: Record<string, MockZone[]> = {
  bengaluru: bengaluruZones,
  delhi_ncr: delhiZones,
  mumbai: [
    { id: 'm1', name: 'Andheri', bounds: [[19.110, 72.828], [19.135, 72.854]], riskScore: { risk: 7, forecast: 8, historical: 6 }, primaryRisk: 'Flood', activeDisruption: false, shields: 2 },
    { id: 'm2', name: 'Bandra',  bounds: [[19.045, 72.820], [19.065, 72.844]], riskScore: { risk: 5, forecast: 5, historical: 5 }, primaryRisk: 'Rain',  activeDisruption: false, shields: 3 },
  ],
}

function scoreToColor(score: number) {
  if (score <= 2) return '#10B981'
  if (score <= 4) return '#6366F1'
  if (score <= 6) return '#F59E0B'
  if (score <= 8) return '#F97316'
  return '#EF4444'
}

// ─── Live Analysis result types (per API docs) ─────────────
interface LiveResult {
  city: string
  parametric_signals: {
    weather: { precip_mm: number; is_heavy_rain: boolean; is_toxic_aqi: boolean; aqi_pm25?: number }
    news: { news_trigger: boolean; news_description: string }
  }
  actuarial_pricing: {
    risk_probability: number
    weekly_gross_premium: string
  }
  claims_management: {
    status: 'TRIGGERED' | 'NO_TRIGGER' | 'EXCLUDED'
    payout_inr: number
    recommendation: string
  }
}

interface DisruptionResult {
  disruption: number
  confidence: number
  message?: string | null
}

function StatCell({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-0.5">{label}</p>
      <p className="font-mono font-bold text-sm text-[#0F172A]">{value}</p>
      {sub && <p className="text-[10px] text-[#64748B] mt-0.5">{sub}</p>}
    </div>
  )
}

export function ZoneMapTab() {
  const [city, setCity] = useState<City>('bengaluru')
  const [view, setView] = useState<ZoneView>('risk')
  const zones = zonesByCity[city] ?? bengaluruZones
  const cityConfig = CITIES.find(c => c.id === city) ?? CITIES[0]
  const activeDisruptions = zones.filter(z => z.activeDisruption)

  const [mlLoading, setMlLoading] = useState(false)
  const [liveData, setLiveData] = useState<LiveResult | null>(null)
  const [disruptionData, setDisruptionData] = useState<DisruptionResult | null>(null)

  // City name mapping for ML API
  const cityNameMap: Record<string, string> = {
    bengaluru: 'Bangalore',
    mumbai: 'Mumbai',
    delhi_ncr: 'Delhi',
  }
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const runLiveAnalysis = async () => {
    setMlLoading(true)
    const cityName = cityNameMap[city] ?? 'Bangalore'
    try {
      const [liveRes, disRes] = await Promise.all([
        kavachMlApi.runLive(cityName).catch(() => null),
        kavachMlApi.predictDisruption(cityName).catch(() => null),
      ])
      setLiveData(liveRes)
      setDisruptionData(disRes)
      setLastUpdated(new Date())

      // Per API docs: if claims_management.status === 'TRIGGERED', show payout notification
      if (liveRes?.claims_management?.status === 'TRIGGERED') {
        toast.success(
          `🎉 Payout Authorized! ₹${liveRes.claims_management.payout_inr} for ${cityName}`,
          { duration: 6000 }
        )
      } else {
        toast.success('Live analysis complete!')
      }
    } catch {
      toast.error('Live environmental signals temporarily unavailable. Defaulting to standard processing.')
    }
    setMlLoading(false)
  }

  // Auto-run on mount and whenever the city changes
  useEffect(() => {
    runLiveAnalysis()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city])

  const claimStatus = liveData?.claims_management?.status
  const isTriggered = claimStatus === 'TRIGGERED'
  const isExcluded = claimStatus === 'EXCLUDED'

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-syne font-bold text-2xl text-[#0F172A]">Zone Risk Map</h2>
          <p className="text-sm text-[#64748B] mt-0.5">Live risk overlays + parametric insurance signals</p>
        </div>
        <select
          className="k-input !w-auto !py-2 !px-3 text-sm"
          value={city}
          onChange={e => { setCity(e.target.value as City); setLiveData(null); setDisruptionData(null) }}
        >
          {CITIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>

      {/* Disruption alert */}
      {activeDisruptions.length > 0 && (
        <div className="disruption-alert">
          <div className="flex items-center gap-2">
            <span className="badge-live">LIVE</span>
            <span className="text-sm font-medium text-[#0F172A]">
              {activeDisruptions[0].name} zone — {activeDisruptions[0].primaryRisk} alert
            </span>
            <span className="text-xs text-[#64748B]">· {activeDisruptions.length} zones affected</span>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="k-card p-0 overflow-hidden" style={{ height: 380 }}>
        <MapContainer
          key={city} center={[cityConfig.lat, cityConfig.lng]} zoom={12}
          style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
          {zones.map(zone => {
            const score = zone.riskScore[view]
            const color = scoreToColor(score)
            return (
              <Rectangle
                key={zone.id}
                bounds={zone.bounds as LatLngBoundsExpression}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.4, weight: zone.activeDisruption ? 3 : 1.5, dashArray: zone.activeDisruption ? undefined : '4 4' }}
              >
                <Popup>
                  <div style={{ minWidth: 160, fontFamily: 'DM Sans, sans-serif' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{zone.name}</div>
                    <div style={{ fontSize: 12, color: '#64748B', marginBottom: 2 }}>Shield: {'⭐'.repeat(zone.shields)}{'☆'.repeat(5 - zone.shields)}</div>
                    <div style={{ fontSize: 12, color: '#64748B', marginBottom: 2 }}>Primary risk: {zone.primaryRisk}</div>
                    <div style={{ fontSize: 12 }}>
                      Disruption:{' '}
                      <span style={{ color: zone.activeDisruption ? '#EF4444' : '#10B981', fontWeight: 600 }}>
                        {zone.activeDisruption ? 'YES 🔴' : 'None ✓'}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Rectangle>
            )
          })}
        </MapContainer>
      </div>

      {/* Toggle + Legend row */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="k-toggle-group">
          {([['risk', 'Current Risk'], ['forecast', '7-Day Forecast'], ['historical', 'Historical']] as [ZoneView, string][]).map(([v, l]) => (
            <button key={v} className={cn('k-toggle-btn', view === v && 'active')} onClick={() => setView(v)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="k-card">
        <h3 className="font-syne font-semibold text-[#0F172A] text-sm mb-3">Risk Legend</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { s: 5, label: 'Very Safe', color: '#10B981' },
            { s: 4, label: 'Safe',      color: '#6366F1' },
            { s: 3, label: 'Moderate', color: '#F59E0B' },
            { s: 2, label: 'Risky',    color: '#F97316' },
            { s: 1, label: 'High Risk', color: '#EF4444' },
          ].map(({ s, label, color }) => (
            <div key={s} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-xs text-[#0F172A]">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Live Parametric Analysis ── */}
      <div className="border-t border-[#E2E8F0] pt-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={18} className="text-[#6366F1]" />
              <h3 className="font-syne font-bold text-xl text-[#0F172A]">Zero-Touch Parametric Check</h3>
            </div>
            <p className="text-sm text-[#64748B]">
              Runs <span className="font-mono text-xs text-[#6366F1]">GET /run-live/{cityConfig.label}</span> + disruption model in parallel to sync environmental data with actuarial pricing.
            </p>
          </div>
          <button
            onClick={runLiveAnalysis} disabled={mlLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-[#1E1B4B] hover:bg-[#312e81] transition-all active:scale-[.98] disabled:opacity-60 whitespace-nowrap flex-shrink-0"
          >
            {mlLoading
              ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Extracting Signals...</>
              : <><RefreshCw size={16} /> Refresh Analysis</>
            }
          </button>
          {lastUpdated && !mlLoading && (
            <p className="text-[10px] text-[#94A3B8] flex items-center gap-1">
              ✓ Last run {Math.round((Date.now() - lastUpdated.getTime()) / 60000) < 1 ? 'just now' : `${Math.round((Date.now() - lastUpdated.getTime()) / 60000)} min ago`}
            </p>
          )}
        </div>

        <AnimatePresence>
          {(liveData || disruptionData) && (
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Disruption Prediction */}
              {disruptionData && (
                <div className={cn('k-card border-2', disruptionData.disruption === 1 ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50')}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', disruptionData.disruption === 1 ? 'bg-red-100' : 'bg-emerald-100')}>
                      <Activity size={18} className={disruptionData.disruption === 1 ? 'text-red-600' : 'text-emerald-600'} />
                    </div>
                    <div>
                      <p className="font-syne font-bold text-[#0F172A] text-sm">Disruption Prediction ML</p>
                      <p className="text-xs text-[#64748B] font-mono">POST /predict/disruption</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className={cn('font-mono font-bold text-3xl', disruptionData.disruption === 1 ? 'text-red-600' : 'text-emerald-600')}>
                        {(disruptionData.confidence * 100).toFixed(1)}%
                      </p>
                      <p className="text-xs text-[#64748B]">confidence</p>
                    </div>
                  </div>

                  <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-3',
                    disruptionData.disruption === 1 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                  )}>
                    {disruptionData.disruption === 1 ? '⚠️ High Disruption Probability' : '✅ Services Stable'}
                  </div>

                  {disruptionData.disruption === 1 && (
                    <p className="text-xs text-red-700 bg-red-100 rounded-xl px-3 py-2 mb-3">
                      High probability of route-wide disruptions in {cityConfig.label}. Payout may be triggering.
                    </p>
                  )}

                  {disruptionData.message && (
                    <p className="text-xs text-[#64748B] bg-white/60 border border-[#E2E8F0] rounded-xl px-3 py-2">
                      📡 {disruptionData.message}
                    </p>
                  )}
                </div>
              )}

              {/* Live Parametric Signals + Pricing + Claims */}
              {liveData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Parametric Signals */}
                  <div className="k-card md:col-span-2 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <CloudRain size={16} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="font-syne font-bold text-[#0F172A] text-sm">Parametric Signals · {liveData.city}</p>
                        <p className="text-xs text-[#64748B] font-mono">GET /run-live/{cityConfig.label}</p>
                      </div>
                    </div>

                    {/* Weather */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                      <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-3">🌦️ Weather Signals</p>
                      <div className="grid grid-cols-3 gap-4">
                        <StatCell
                          label="Precipitation"
                          value={`${liveData.parametric_signals?.weather?.precip_mm ?? 0} mm`}
                        />
                        <StatCell
                          label="Heavy Rain"
                          value={liveData.parametric_signals?.weather?.is_heavy_rain
                            ? <span className="text-red-600">YES ⚠️</span>
                            : <span className="text-emerald-600">No ✓</span>
                          }
                        />
                        <StatCell
                          label="Toxic AQI"
                          value={liveData.parametric_signals?.weather?.is_toxic_aqi
                            ? <span className="text-amber-600">YES ⚠️</span>
                            : <span className="text-emerald-600">No ✓</span>
                          }
                        />
                      </div>
                    </div>

                    {/* News */}
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
                          <Newspaper size={11} /> News Trigger
                        </p>
                        <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full',
                          liveData.parametric_signals?.news?.news_trigger
                            ? 'bg-red-100 text-red-700'
                            : 'bg-emerald-100 text-emerald-700'
                        )}>
                          {liveData.parametric_signals?.news?.news_trigger ? 'TRIGGERED' : 'Clear'}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] leading-relaxed">
                        {liveData.parametric_signals?.news?.news_description ?? 'No news signals detected'}
                      </p>
                    </div>
                  </div>

                  {/* Claims Management — key panel per API docs */}
                  <div className={cn('k-card border-2 flex flex-col',
                    isTriggered ? 'border-emerald-300 bg-emerald-50'
                    : isExcluded ? 'border-amber-300 bg-amber-50'
                    : 'border-[#E2E8F0]'
                  )}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center',
                        isTriggered ? 'bg-emerald-100' : isExcluded ? 'bg-amber-100' : 'bg-[#EEF2FF]'
                      )}>
                        {isTriggered
                          ? <CheckCircle size={16} className="text-emerald-600" />
                          : isExcluded
                            ? <AlertTriangle size={16} className="text-amber-500" />
                            : <DollarSign size={16} className="text-[#6366F1]" />
                        }
                      </div>
                      <div>
                        <p className="font-syne font-bold text-[#0F172A] text-sm">Claims Management</p>
                        <p className="text-xs text-[#64748B] font-mono">actuarial output</p>
                      </div>
                    </div>

                    <div className={cn('text-center py-4 px-3 rounded-xl mb-4 border-2',
                      isTriggered ? 'bg-emerald-100 border-emerald-300'
                      : isExcluded ? 'bg-amber-100 border-amber-300'
                      : 'bg-[#F8FAFC] border-[#E2E8F0]'
                    )}>
                      <p className={cn('font-mono font-bold text-lg tracking-wider',
                        isTriggered ? 'text-emerald-700' : isExcluded ? 'text-amber-700' : 'text-[#64748B]'
                      )}>
                        {claimStatus ?? '—'}
                      </p>
                      {isTriggered && (
                        <p className="font-mono font-bold text-3xl text-emerald-700 mt-1">
                          ₹{liveData.claims_management.payout_inr}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 flex-1">
                      <StatCell label="Recommendation" value={<span className="text-xs">{liveData.claims_management?.recommendation ?? '—'}</span>} />

                      <div className="border-t border-[#E2E8F0] pt-3">
                        <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">Actuarial Pricing</p>
                        <div className="flex items-center gap-2">
                          <TrendingUp size={13} className="text-[#6366F1]" />
                          <span className="font-mono text-sm font-bold text-[#0F172A]">
                            {liveData.actuarial_pricing?.weekly_gross_premium ?? '—'}
                          </span>
                          <span className="text-xs text-[#64748B]">/ week</span>
                        </div>
                        <p className="text-[11px] text-[#94A3B8] mt-1">
                          Risk probability: {((liveData.actuarial_pricing?.risk_probability ?? 0) * 100).toFixed(2)}%
                        </p>
                      </div>
                    </div>

                    {isTriggered && (
                      <div className="mt-4 bg-emerald-600 text-white text-xs font-bold text-center py-2.5 rounded-xl">
                        🎉 Payout Authorized Automatically
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!liveData && !disruptionData && !mlLoading && (
          <div className="k-card text-center py-8 text-[#94A3B8] text-sm">
            Click <span className="text-[#0F172A] font-semibold">Run Live Analysis</span> to fetch real-time parametric signals for {cityConfig.label}
          </div>
        )}
      </div>
    </div>
  )
}
