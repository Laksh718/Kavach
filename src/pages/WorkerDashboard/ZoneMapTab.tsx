import { useState } from 'react'
import { MapContainer, TileLayer, Rectangle, Popup } from 'react-leaflet'
import type { LatLngBoundsExpression } from 'leaflet'
import { CITIES } from '@/constants/cities'
import type { City } from '@/types/zone.types'
import { cn } from '@/utils/cn'

// Zone data per city
type ZoneView = 'risk' | 'forecast' | 'historical'

interface MockZone {
  id: string
  name: string
  bounds: LatLngBoundsExpression
  riskScore: { risk: number; forecast: number; historical: number }
  primaryRisk: string
  activeDisruption: boolean
  shields: number
}

const bengaluruZones: MockZone[] = [
  { id: 'z1', name: 'Koramangala',  bounds: [[12.920, 77.607], [12.940, 77.638]], riskScore: { risk: 8, forecast: 7, historical: 6 }, primaryRisk: 'Flood',  activeDisruption: true,  shields: 2 },
  { id: 'z2', name: 'Indiranagar',  bounds: [[12.970, 77.635], [12.988, 77.655]], riskScore: { risk: 5, forecast: 4, historical: 5 }, primaryRisk: 'Rain',   activeDisruption: false, shields: 3 },
  { id: 'z3', name: 'Whitefield',   bounds: [[12.955, 77.734], [12.975, 77.757]], riskScore: { risk: 3, forecast: 2, historical: 3 }, primaryRisk: 'Heat',   activeDisruption: false, shields: 4 },
  { id: 'z4', name: 'BTM Layout',   bounds: [[12.904, 77.608], [12.920, 77.630]], riskScore: { risk: 9, forecast: 8, historical: 7 }, primaryRisk: 'Flood',  activeDisruption: true,  shields: 1 },
  { id: 'z5', name: 'JP Nagar',     bounds: [[12.888, 77.577], [12.908, 77.600]], riskScore: { risk: 6, forecast: 6, historical: 5 }, primaryRisk: 'Rain',   activeDisruption: false, shields: 3 },
  { id: 'z6', name: 'Hebbal',       bounds: [[13.024, 77.587], [13.044, 77.607]], riskScore: { risk: 2, forecast: 1, historical: 2 }, primaryRisk: 'AQI',    activeDisruption: false, shields: 5 },
  { id: 'z7', name: 'Marathahalli', bounds: [[12.952, 77.690], [12.972, 77.713]], riskScore: { risk: 4, forecast: 3, historical: 4 }, primaryRisk: 'Rain',   activeDisruption: false, shields: 4 },
  { id: 'z8', name: 'Electronic City', bounds: [[12.842, 77.658], [12.867, 77.680]], riskScore: { risk: 3, forecast: 3, historical: 2 }, primaryRisk: 'Heat', activeDisruption: false, shields: 4 },
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
    { id: 'm1', name: 'Andheri',  bounds: [[19.110, 72.828], [19.135, 72.854]], riskScore: { risk: 7, forecast: 8, historical: 6 }, primaryRisk: 'Flood', activeDisruption: false, shields: 2 },
    { id: 'm2', name: 'Bandra',   bounds: [[19.045, 72.820], [19.065, 72.844]], riskScore: { risk: 5, forecast: 5, historical: 5 }, primaryRisk: 'Rain',  activeDisruption: false, shields: 3 },
  ],
}

function scoreToColor(score: number): string {
  if (score <= 2) return '#10B981'
  if (score <= 4) return '#6366F1'
  if (score <= 6) return '#F59E0B'
  if (score <= 8) return '#F97316'
  return '#EF4444'
}

export function ZoneMapTab() {
  const [city, setCity] = useState<City>('bengaluru')
  const [view, setView] = useState<ZoneView>('risk')
  const zones = zonesByCity[city] ?? bengaluruZones
  const cityConfig = CITIES.find(c => c.id === city) ?? CITIES[0]
  const activeDisruptions = zones.filter(z => z.activeDisruption)

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-syne font-bold text-2xl text-[#0F172A]">Zone Risk Map</h2>
        <select
          className="k-input !w-auto !py-2 !px-3 text-sm"
          value={city}
          onChange={e => setCity(e.target.value as City)}
        >
          {CITIES.map(c => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Active disruption alert */}
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
          key={city}
          center={[cityConfig.lat, cityConfig.lng]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© OpenStreetMap contributors'
          />
          {zones.map(zone => {
            const score = zone.riskScore[view]
            const color = scoreToColor(score)
            return (
              <Rectangle
                key={zone.id}
                bounds={zone.bounds as LatLngBoundsExpression}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.4,
                  weight: zone.activeDisruption ? 3 : 1.5,
                  dashArray: zone.activeDisruption ? undefined : '4 4',
                }}
              >
                <Popup>
                  <div style={{ minWidth: 160, fontFamily: 'DM Sans, sans-serif' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{zone.name}</div>
                    <div style={{ fontSize: 12, color: '#64748B', marginBottom: 2 }}>Shield rating: {'⭐'.repeat(zone.shields)}{'☆'.repeat(5 - zone.shields)}</div>
                    <div style={{ fontSize: 12, color: '#64748B', marginBottom: 2 }}>Primary risk: {zone.primaryRisk}</div>
                    <div style={{ fontSize: 12 }}>
                      Active disruption: <span style={{ color: zone.activeDisruption ? '#EF4444' : '#10B981', fontWeight: 600 }}>
                        {zone.activeDisruption ? 'YES 🔴' : 'No ✓'}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Rectangle>
            )
          })}
        </MapContainer>
      </div>

      {/* Toggle + Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="k-toggle-group">
          {([['risk','Current Risk'],['forecast','7-Day Forecast'],['historical','Historical']] as [ZoneView,string][]).map(([v,l]) => (
            <button key={v} className={cn('k-toggle-btn', view === v && 'active')} onClick={() => setView(v)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="k-card">
        <h3 className="font-syne font-semibold text-[#0F172A] text-sm mb-3">Risk Legend</h3>
        <div className="space-y-2">
          {[
            { shields: 5, label: 'Very Safe',  color: '#10B981' },
            { shields: 4, label: 'Safe',       color: '#6366F1' },
            { shields: 3, label: 'Moderate',   color: '#F59E0B' },
            { shields: 2, label: 'Risky',      color: '#F97316' },
            { shields: 1, label: 'High Risk',  color: '#EF4444' },
          ].map(({ shields, label, color }) => (
            <div key={shields} className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-sm text-[#0F172A]">{'⭐'.repeat(shields)}{'☆'.repeat(5-shields)} — {label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
