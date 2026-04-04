/**
 * Format a number as Indian Rupee with ₹ prefix and Indian number grouping
 * Example: 12345 → ₹12,345
 */
export function formatRupee(amount: number, decimals = 0): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount)
}

/**
 * Safe INR formatter — never shows NaN or decimals to workers.
 * Use this for all ML API rupee amounts.
 */
export function formatINR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0'
  return '₹' + Math.round(amount).toLocaleString('en-IN')
}

/**
 * Format as compact rupee: 1234567 → ₹12.3L
 */
export function formatRupeeCompact(amount: number): string {
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(1)}Cr`
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(1)}L`
  if (amount >= 1_000) return `₹${(amount / 1_000).toFixed(1)}K`
  return `₹${amount}`
}

/**
 * Map risk probability (0–1) → shield count (1–5).
 * 0.0–0.2  → 5 (Very Safe)
 * 0.2–0.4  → 4 (Safe)
 * 0.4–0.6  → 3 (Moderate)
 * 0.6–0.8  → 2 (Risky)
 * 0.8–1.0  → 1 (High Risk)
 */
export function riskToShields(probability: number): number {
  if (probability < 0.2) return 5
  if (probability < 0.4) return 4
  if (probability < 0.6) return 3
  if (probability < 0.8) return 2
  return 1
}

/**
 * Returns the current time-of-day bucket string.
 * morning: 05–11, afternoon: 12–16, evening: 17–21, night: 22–04
 */
export function getCurrentHourBucket(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'morning'
  if (h >= 12 && h < 17) return 'afternoon'
  if (h >= 17 && h < 22) return 'evening'
  return 'night'
}

/** Hour bucket → representative numeric hour for API call */
export function hourBucketToApiHour(bucket: 'morning' | 'afternoon' | 'evening' | 'night'): number {
  return { morning: 9, afternoon: 14, evening: 19, night: 23 }[bucket]
}

/**
 * Check if a Date is older than a given number of minutes.
 */
export function isDataStale(date: Date | null, minutes = 30): boolean {
  if (!date) return true
  return (Date.now() - date.getTime()) > minutes * 60 * 1000
}

/**
 * Format minutes-ago for stale data chips.
 * e.g. "Updated 3 min ago"
 */
export function minutesAgo(date: Date | null): string {
  if (!date) return ''
  const mins = Math.round((Date.now() - date.getTime()) / 60000)
  if (mins < 1) return 'just now'
  return `${mins} min ago`
}

