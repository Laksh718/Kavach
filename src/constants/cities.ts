import type { City } from '@/types/zone.types'

export interface CityConfig {
  id: City
  label: string
  lat: number
  lng: number
  risks: string[]
}

export const CITIES: CityConfig[] = [
  { id: 'bengaluru',  label: 'Bengaluru',  lat: 12.9716, lng: 77.5946, risks: ['Flood', 'Heat'] },
  { id: 'delhi_ncr',  label: 'Delhi-NCR',  lat: 28.6139, lng: 77.2090, risks: ['AQI', 'Flood', 'Heat'] },
  { id: 'mumbai',     label: 'Mumbai',     lat: 19.0760, lng: 72.8777, risks: ['Flood', 'Cyclone'] },
  { id: 'chennai',    label: 'Chennai',    lat: 13.0827, lng: 80.2707, risks: ['Cyclone', 'Monsoon'] },
  { id: 'hyderabad',  label: 'Hyderabad',  lat: 17.3850, lng: 78.4867, risks: ['Flood', 'Heat'] },
  { id: 'pune',       label: 'Pune',       lat: 18.5204, lng: 73.8567, risks: ['Flood'] },
  { id: 'kolkata',    label: 'Kolkata',    lat: 22.5726, lng: 88.3639, risks: ['Flood', 'Cyclone'] },
  { id: 'ahmedabad',  label: 'Ahmedabad',  lat: 23.0225, lng: 72.5714, risks: ['Heat', 'Flood'] },
  { id: 'jaipur',     label: 'Jaipur',     lat: 26.9124, lng: 75.7873, risks: ['Heat', 'Flood'] },
]

export const CITY_MAP: Record<City, CityConfig> = CITIES.reduce((acc, city) => {
  acc[city.id] = city
  return acc
}, {} as Record<City, CityConfig>)
