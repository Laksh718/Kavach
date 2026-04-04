/**
 * useKavachML.ts
 * Central React hooks for Kavach-ML API using TanStack Query.
 * Provides automatic caching, stale-while-revalidate, and background polling.
 */
import { useQuery } from '@tanstack/react-query'
import { kavachMlApi } from '@/services/api/kavachMlApi'

// 15 minutes — matches WeatherUnion update cadence
const POLLING_INTERVAL_MS = 15 * 60 * 1000

// ── Types ─────────────────────────────────────────────────────

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

// ── Hooks ──────────────────────────────────────────────────────

/**
 * Hook 1: Live city data with 15-min auto-polling.
 * Uses TanStack Query for caching and background updates.
 */
export function useRunLive(city: string) {
  const { data, isLoading, error, dataUpdatedAt, refetch } = useQuery({
    queryKey: ['ml', 'run-live', city],
    queryFn: () => kavachMlApi.runLive(city),
    refetchInterval: POLLING_INTERVAL_MS,
    staleTime: POLLING_INTERVAL_MS - 1000,
  })

  return { 
    data: data as RunLiveResponse | null, 
    loading: isLoading, 
    error: error ? String(error) : null, 
    lastUpdated: dataUpdatedAt ? new Date(dataUpdatedAt) : null, 
    refetch 
  }
}

/**
 * Hook 2: Disruption prediction.
 */
export function useDisruptionPrediction(city: string) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['ml', 'disruption', city],
    queryFn: () => kavachMlApi.predictDisruption(city),
    staleTime: POLLING_INTERVAL_MS,
  })

  return { 
    data: data as DisruptionResult | null, 
    loading: isLoading, 
    refetch 
  }
}

/**
 * Hook 3: Multi-city aggregation for Admin Dashboard.
 */
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
  // Note: For simplicity on multi-city, we use a single query that Promise.all's.
  // In a more complex app, we'd use useQueries() but this is cleaner for the current Admin Dashboard.
  const { data, isLoading, dataUpdatedAt, refetch } = useQuery({
    queryKey: ['ml', 'admin', 'all-cities'],
    queryFn: async () => {
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
            status: isActive ? 'active' : 'resolved',
            estimatedPayout: d.claims_management?.payout_inr ?? 0,
            rawData: d,
          }
        }
        return {
          city: ADMIN_CITIES[i],
          type: '—',
          riskProbability: 0,
          riskScore: '—/100',
          status: 'resolved',
          estimatedPayout: 0,
          rawData: null,
        } as CityLiveRow
      })
    },
    refetchInterval: POLLING_INTERVAL_MS,
    staleTime: POLLING_INTERVAL_MS - 1000,
  })

  return { 
    cityRows: (data ?? []) as CityLiveRow[], 
    loading: isLoading, 
    lastUpdated: dataUpdatedAt ? new Date(dataUpdatedAt) : null, 
    refetch 
  }
}

/**
 * Hook 4: Dynamic pricing for onboarding.
 * Caches results per cityZone to prevent redundant calls.
 */
export function useDynamicPricing(cityZone: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['ml', 'pricing', cityZone],
    queryFn: () => kavachMlApi.getDynamicPricing(cityZone),
    enabled: !!cityZone,
    staleTime: Infinity, // Pricing doesn't change during a single onboarding session
  })

  return { 
    data: data as PricingResult | null, 
    loading: isLoading 
  }
}

/**
 * Hook 5: Earnings prediction with caching.
 */
export function usePredictEarnings(city: string, day: number, hour: number, platform: number, workerAvg: number) {
  return useQuery({
    queryKey: ['ml', 'earnings', city, day, hour, platform, workerAvg],
    queryFn: () => kavachMlApi.predictEarnings(city, day, hour, platform, workerAvg),
    staleTime: 5 * 60 * 1000, // 5 minute cache for planner results
  })
}
