export type City = 'bengaluru' | 'delhi_ncr' | 'mumbai' | 'chennai' | 'hyderabad' | 'pune' | 'kolkata' | 'ahmedabad' | 'jaipur'

export interface WeatherSnapshot {
  rainfallMmPerHr?: number
  aqiValue?: number
  feelsLikeTemp?: number
  floodAlertLevel?: 'moderate' | 'severe' | 'red'
  timestamp: string
  sources: string[]
}

export interface Zone {
  id: string
  city: City
  centroidLat: number
  centroidLng: number
  hlrgScore: number
  shieldRating: number
  primaryRisk: string[]
  lastUpdated: string
}

export interface ZoneForecast {
  zoneId: string
  timestamp: string
  predictedScore: number
  confidence: number
  primaryThreat: string
}
