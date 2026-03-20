import type { Platform } from '@/types/worker.types'

export interface PlatformConfig {
  id: Platform
  label: string
  color: string
  bgColor: string
  textColor: string
  icon: string
}

export const PLATFORMS: PlatformConfig[] = [
  { id: 'zomato',          label: 'Zomato',         color: '#E23744', bgColor: '#FEE2E2', textColor: '#991B1B', icon: '🍕' },
  { id: 'swiggy',          label: 'Swiggy',          color: '#FC8019', bgColor: '#FEF3C7', textColor: '#92400E', icon: '🍜' },
  { id: 'zepto',           label: 'Zepto',           color: '#9333EA', bgColor: '#F3E8FF', textColor: '#581C87', icon: '⚡' },
  { id: 'blinkit',         label: 'Blinkit',         color: '#F6C722', bgColor: '#FEFCE8', textColor: '#713F12', icon: '🛒' },
  { id: 'amazon_flex',     label: 'Amazon Flex',     color: '#FF9900', bgColor: '#FFF7ED', textColor: '#9A3412', icon: '📦' },
  { id: 'flipkart_quick',  label: 'Flipkart Quick',  color: '#2874F0', bgColor: '#EFF6FF', textColor: '#1E3A8A', icon: '🛍️' },
]

export const PLATFORM_MAP: Record<Platform, PlatformConfig> = PLATFORMS.reduce((acc, p) => {
  acc[p.id] = p
  return acc
}, {} as Record<Platform, PlatformConfig>)
