/**
 * useKavachML.ts
 * Central React hooks for Kavach-ML API with 15-minute auto-polling.
 * These wrap kavachMlApi and add caching, polling, and stale-data tracking.
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { kavachMlApi } from '@/services/api/kavachMlApi'

// 15 minutes — matches WeatherUnion update cadence
const POLLING_INTERVAL_MS = 15 * 60 * 1000

// ── Real API response types (matching actual backend) ──────────

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

export interface DisruptionResult {
  disruption: number   // 0 or 1
  confidence: number   // 0–1
  message?: string | null
}

export interface EarningsResult {
  expected_earnings: number
  base_prediction: number
  deviation_factor: number
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

// ── Hook 1: Live city data with 15-min auto-polling ───────────

export function useRunLive(city: string) {
  const [data, setData] = useState<RunLiveResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await kavachMlApi.runLive(city)
      setData(res)
      setLastUpdated(new Date())
      setError(null)
    } catch {
      // Keep showing stale data — show warning chip instead of error screen
      setError('Live data unavailable — showing last known status')
    } finally {
      setLoading(false)
    }
  }, [city])

  useEffect(() => {
    setLoading(true)
    fetchData()
    intervalRef.current = setInterval(fetchData, POLLING_INTERVAL_MS)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [fetchData])

  return { data, loading, error, lastUpdated, refetch: fetchData }
}

// ── Hook 2: Disruption prediction ─────────────────────────────

export function useDisruptionPrediction(city: string) {
  const [data, setData] = useState<DisruptionResult | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const res = await kavachMlApi.predictDisruption(city)
      setData(res)
    } catch {
      // silently keep stale or null
    } finally {
      setLoading(false)
    }
  }, [city])

  useEffect(() => {
    setLoading(true)
    fetchData()
  }, [fetchData])

  return { data, loading, refetch: fetchData }
}

// ── Hook 3: Multi-city aggregation for Admin Dashboard ─────────

const CITIES = [
  'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad',
  'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur',
]

export interface CityLiveRow {
  city: string
  type: string
  riskProbability: number
  riskScore: string          // "78/100"
  status: 'active' | 'resolved'
  estimatedPayout: number
  rawData: RunLiveResponse | null
}

export function useAdminAllCities() {
  const [cityRows, setCityRows] = useState<CityLiveRow[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchAll = useCallback(async () => {
    try {
      const results = await Promise.allSettled(
        CITIES.map((city) => kavachMlApi.runLive(city))
      )

      const rows: CityLiveRow[] = results.map((result, i) => {
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
            city: d.city ?? CITIES[i],
            type: disruption,
            riskProbability: prob,
            riskScore: `${Math.round(prob * 100)}/100`,
            status: isActive ? 'active' : 'resolved',
            estimatedPayout: d.claims_management?.payout_inr ?? 0,
            rawData: d,
          }
        }
        // API failed for this city — placeholder row
        return {
          city: CITIES[i],
          type: '—',
          riskProbability: 0,
          riskScore: '—/100',
          status: 'resolved' as const,
          estimatedPayout: 0,
          rawData: null,
        }
      })

      setCityRows(rows)
      setLastUpdated(new Date())
    } catch {
      // keep stale rows
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
    intervalRef.current = setInterval(fetchAll, POLLING_INTERVAL_MS)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [fetchAll])

  return { cityRows, loading, lastUpdated, refetch: fetchAll }
}

// ── Hook 4: Dynamic pricing for onboarding ─────────────────────

export function useDynamicPricing(cityZone: string) {
  const [data, setData] = useState<PricingResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!cityZone) return
    setLoading(true)
    kavachMlApi.getDynamicPricing(cityZone)
      .then((res) => setData(res))
      .catch(() => { /* silently fall back to static PLANS */ })
      .finally(() => setLoading(false))
  }, [cityZone])

  return { data, loading }
}
