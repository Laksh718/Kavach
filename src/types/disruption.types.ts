import type { City } from './zone.types'
import type { WeatherSnapshot } from './zone.types'

export type DisruptionType = 'rain' | 'aqi' | 'heat' | 'flood' | 'curfew'
export type TriggerType = 'soft' | 'hard'

export interface DisruptionEvent {
  id: string
  zoneId: string
  city: City
  type: DisruptionType
  score: number
  severityMultiplier: number
  triggerType: TriggerType
  startTime: string
  endTime?: string
  sourcesConfirming: number
  workersAffected: number
  totalPayoutAmount: number
  weatherData: WeatherSnapshot
}
