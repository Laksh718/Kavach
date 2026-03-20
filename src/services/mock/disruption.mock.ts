import type { DisruptionEvent } from '@/types/disruption.types'
import type { Zone } from '@/types/zone.types'

export const mockActiveDisruption: DisruptionEvent = {
  id: 'evt_001',
  zoneId: 'zone_blr_01',
  city: 'bengaluru',
  type: 'rain',
  score: 78,
  severityMultiplier: 1.0,
  triggerType: 'hard',
  startTime: '2026-03-20T14:00:00Z',
  sourcesConfirming: 3,
  workersAffected: 1243,
  totalPayoutAmount: 452360,
  weatherData: {
    rainfallMmPerHr: 18.5,
    feelsLikeTemp: 24,
    timestamp: '2026-03-20T15:00:00Z',
    sources: ['WeatherUnion', 'IMD', 'NDMA'],
  },
}

export const mockZones: Zone[] = [
  {
    id: 'zone_blr_01',
    city: 'bengaluru',
    centroidLat: 12.9352,
    centroidLng: 77.6245,
    hlrgScore: 7,
    shieldRating: 2,
    primaryRisk: ['rain', 'flood'],
    lastUpdated: '2026-03-20T15:00:00Z',
  },
  {
    id: 'zone_blr_02',
    city: 'bengaluru',
    centroidLat: 12.9716,
    centroidLng: 77.5946,
    hlrgScore: 4,
    shieldRating: 4,
    primaryRisk: ['rain'],
    lastUpdated: '2026-03-20T15:00:00Z',
  },
  {
    id: 'zone_blr_03',
    city: 'bengaluru',
    centroidLat: 12.9950,
    centroidLng: 77.6100,
    hlrgScore: 2,
    shieldRating: 5,
    primaryRisk: ['heat'],
    lastUpdated: '2026-03-20T15:00:00Z',
  },
  {
    id: 'zone_blr_04',
    city: 'bengaluru',
    centroidLat: 12.9141,
    centroidLng: 77.6460,
    hlrgScore: 9,
    shieldRating: 1,
    primaryRisk: ['flood', 'rain'],
    lastUpdated: '2026-03-20T15:00:00Z',
  },
  {
    id: 'zone_blr_05',
    city: 'bengaluru',
    centroidLat: 12.9800,
    centroidLng: 77.5700,
    hlrgScore: 5,
    shieldRating: 3,
    primaryRisk: ['rain'],
    lastUpdated: '2026-03-20T15:00:00Z',
  },
]

export const mockAdminLiveOps = {
  activePoliciesThisWeek: 24831,
  activePoliciesChange: 2.3,
  activeDisruptionEvents: 3,
  payoutsProcessing: 847,
  payoutLiabilityThisWeek: 1842000,
  payoutLiabilityForecast: 2100000,
  fraudReviewQueue: 12,
  fraudOldestMinutes: 102,
  lossRatio: 58.3,
  aaConsentRateToday: 82,
}

export const mockPipelineHealth = [
  { name: 'WeatherUnion API', status: 'live' as const, lastUpdated: '8 min ago', latency: '340ms', uptime: 99.8 },
  { name: 'IMD API',          status: 'live' as const, lastUpdated: '2h 12m ago', latency: '1.2s', uptime: 99.1 },
  { name: 'CPCB AQI',         status: 'live' as const, lastUpdated: '47 min ago', latency: '820ms', uptime: 98.5 },
  { name: 'NDMA Alerts',      status: 'live' as const, lastUpdated: '6 min ago', latency: '210ms', uptime: 99.9 },
  { name: 'AA Framework',     status: 'live' as const, lastUpdated: '1 min ago', latency: '450ms', uptime: 99.7, consentRate: '84%' },
  { name: 'OCR Service',      status: 'live' as const, lastUpdated: '3 min ago', latency: '1.8s', uptime: 97.2, parseSuccess: '91%' },
  { name: 'Kafka Consumer',   status: 'ok' as const, lastUpdated: 'real-time', latency: '12ms lag', uptime: 100 },
]
