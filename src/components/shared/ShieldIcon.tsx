import { cn } from '@/utils/cn'

interface ShieldIconProps {
  size?: number
  glowing?: boolean
  rating?: 1 | 2 | 3 | 4 | 5
  className?: string
  variant?: 'full' | 'outline'
}

const ratingColors: Record<number, { fill: string; glow: string }> = {
  5: { fill: '#10B981', glow: 'rgba(16, 185, 129, 0.7)' },
  4: { fill: '#14B8A6', glow: 'rgba(20, 184, 166, 0.7)' },
  3: { fill: '#F59E0B', glow: 'rgba(245, 158, 11, 0.7)' },
  2: { fill: '#F97316', glow: 'rgba(249, 115, 22, 0.7)' },
  1: { fill: '#EF4444', glow: 'rgba(239, 68, 68, 0.7)' },
}

export function ShieldIcon({
  size = 48,
  glowing = false,
  rating,
  className,
  variant = 'full',
}: ShieldIconProps) {
  const colorConfig = rating ? ratingColors[rating] : { fill: '#3B82F6', glow: 'rgba(59, 130, 246, 0.7)' }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(glowing && 'shield-glow', className)}
      style={
        glowing
          ? { filter: `drop-shadow(0 0 ${size * 0.25}px ${colorConfig.glow})` }
          : undefined
      }
    >
      <path
        d="M24 2L4 10V26C4 37.4 12.8 48 24 51C35.2 48 44 37.4 44 26V10L24 2Z"
        fill={variant === 'full' ? colorConfig.fill : 'transparent'}
        stroke={colorConfig.fill}
        strokeWidth={variant === 'outline' ? 2.5 : 0}
        fillOpacity={variant === 'full' ? 1 : 0}
      />
      {variant === 'full' && (
        <>
          {/* Inner lighter overlay for depth */}
          <path
            d="M24 8L10 14.5V26C10 34.5 16.5 42.5 24 45C31.5 42.5 38 34.5 38 26V14.5L24 8Z"
            fill="rgba(255,255,255,0.12)"
          />
          {/* Checkmark / K mark */}
          <path
            d="M18 28L21.5 31.5L30 22"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  )
}

/** Row of N shield icons for zone rating display */
export function ShieldRating({ rating, size = 20 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5 items-center">
      {Array.from({ length: 5 }).map((_, i) => {
        const active = i < rating
        const color = ratingColors[rating] ?? ratingColors[3]
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 1L2 5V13C2 18.7 6.4 24 12 25.5C17.6 24 22 18.7 22 13V5L12 1Z"
              fill={active ? color.fill : '#1F2937'}
              stroke={active ? color.fill : '#374151'}
              strokeWidth="1"
            />
          </svg>
        )
      })}
    </div>
  )
}
