/**
 * useKavachML.ts
 *
 * Behaviour:
 *  1. On every fetch, /health is checked first. If unhealthy, the query throws
 *     and no main API call is made.
 *  2. Each hook fetches ONCE per page load (first mount / empty cache).
 *     staleTime: Infinity means cached data is never considered stale, so React
 *     Query never triggers a background refetch.
 *  3. No auto-polling (refetchInterval: false), no window-focus refetch, no
 *     reconnect refetch.
 *  4. Manual refresh is exposed as `refetch()` — this bypasses the cache and
 *     runs the health-check → API call flow again.
 */
import { useQuery } from '@tanstack/react-query'
import { kavachMlApi } from '@/services/api/kavachMlApi'

// ── Types ──────────────────────────────────────────────────────

export interface RunLiveResponse {
  city: string
  parametric_signals: {
    weather: {
      precip_mm: number
      is_heavy_rain: boolean
      is_toxic_aqi: boolean
      aqi_pm25?: number
    }
    news: {
      news_trigger: boolean
      news_description: string
    }
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

export interface EarningsResult {
  expected_earnings: number
  base_prediction: number
  deviation_factor: number
  message?: string | null
}

export interface DisruptionResult {
  disruption: number
  confidence: number
  message?: string | null
}

export interface PricingResult {
  city: string
  weekly_premium: number
  coverage_hours: number
  risk_score: number
  is_safe_zone: boolean
  adjustment_applied: string
}

// ── Shared query config — once-per-load, no auto-refetch ───────
const ONCE_PER_LOAD = {
  staleTime: Infinity,       // cached data never goes stale → no background refetch
  refetchInterval: false as const,
  refetchOnWindowFocus: false,
  refetchOnMount: true,      // fetch on first mount (no cache); skip if cache exists
  refetchOnReconnect: false,
  retry: 1,
}

// ── Hook 1: Live city data ─────────────────────────────────────
export function useRunLive(city: string) {
  const { data, isLoading, error, dataUpdatedAt, refetch } = useQuery({
    queryKey: ['ml', 'run-live', city],
    queryFn: async () => {
      const healthy = await kavachMlApi.checkHealth()
      if (!healthy) throw new Error('API Health Check Failed — server may be starting up')
      return kavachMlApi.runLive(city)
    },
    ...ONCE_PER_LOAD,
  })

  return {
    data: data as RunLiveResponse | undefined,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    lastUpdated: dataUpdatedAt ? new Date(dataUpdatedAt) : null,
    refetch,
  }
}

// ── Hook 2: Disruption prediction ─────────────────────────────
export function useDisruptionPrediction(city: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['ml', 'disruption', city],
    queryFn: async () => {
      const healthy = await kavachMlApi.checkHealth()
      if (!healthy) throw new Error('API Health Check Failed')
      return kavachMlApi.predictDisruption(city)
    },
    ...ONCE_PER_LOAD,
  })

  return {
    data: data as DisruptionResult | undefined,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  }
}

// ── Hook 3: Multi-city aggregation for Admin Dashboard ─────────
const ADMIN_CITIES = [
  'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad',
  'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur',
]

export interface CityLiveRow {
  city: string
  type: string
  riskProbability: number
  riskScore: string
  status: 'active' | 'resolved'
  estimatedPayout: number
  rawData: RunLiveResponse | null
}

export function useAdminAllCities() {
  const { data, isLoading, dataUpdatedAt, refetch } = useQuery({
    queryKey: ['ml', 'admin', 'all-cities'],
    queryFn: async () => {
      const healthy = await kavachMlApi.checkHealth()
      if (!healthy) throw new Error('API Health Check Failed')

      const results = await Promise.allSettled(
        ADMIN_CITIES.map((city) => kavachMlApi.runLive(city))
      )

      return results.map((result, i) => {
        if (result.status === 'fulfilled') {
          const d = result.value as RunLiveResponse
          const prob = d.actuarial_pricing?.risk_probability ?? 0
          const claimStatus = d.claims_management?.status ?? 'NO_TRIGGER'
          const isActive = claimStatus === 'TRIGGERED'
          const disruption = d.parametric_signals?.weather?.is_heavy_rain
            ? 'Rain'
            : d.parametric_signals?.weather?.is_toxic_aqi
              ? 'AQI'
              : d.parametric_signals?.news?.news_trigger
                ? 'Event'
                : 'Weather'
          return {
            city: d.city ?? ADMIN_CITIES[i],
            type: disruption,
            riskProbability: prob,
            riskScore: `${Math.round(prob * 100)}/100`,
            status: isActive ? 'active' as const : 'resolved' as const,
            estimatedPayout: d.claims_management?.payout_inr ?? 0,
            rawData: d,
          }
        }
        return {
          city: ADMIN_CITIES[i],
          type: '—',
          riskProbability: 0,
          riskScore: '—/100',
          status: 'resolved' as const,
          estimatedPayout: 0,
          rawData: null,
        }
      })
    },
    ...ONCE_PER_LOAD,
  })

  return {
    cityRows: (data ?? []) as CityLiveRow[],
    loading: isLoading,
    lastUpdated: dataUpdatedAt ? new Date(dataUpdatedAt) : null,
    refetch,
  }
}

// ── Hook 4: Dynamic pricing for onboarding ─────────────────────
export function useDynamicPricing(cityZone: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['ml', 'pricing', cityZone],
    queryFn: async () => {
      const healthy = await kavachMlApi.checkHealth()
      if (!healthy) throw new Error('API Health Check Failed')
      return kavachMlApi.getDynamicPricing(cityZone)
    },
    enabled: !!cityZone,
    ...ONCE_PER_LOAD,
  })

  return {
    data: data as PricingResult | undefined,
    loading: isLoading,
  }
}

// ── Hook 5: Earnings prediction ────────────────────────────────
export function usePredictEarnings(
  city: string,
  day: number,
  hour: number,
  platform: number,
  workerAvg: number,
) {
  return useQuery({
    queryKey: ['ml', 'earnings', city, day, hour, platform, workerAvg],
    queryFn: async () => {
      const healthy = await kavachMlApi.checkHealth()
      if (!healthy) throw new Error('API Health Check Failed')
      return kavachMlApi.predictEarnings(city, day, hour, platform, workerAvg)
    },
    ...ONCE_PER_LOAD,
  })
}
