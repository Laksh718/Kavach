import { useEffect, useRef, useState } from 'react'
import { cn } from '@/utils/cn'

interface RupeeCounterProps {
  value: number
  duration?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  prefix?: string
  suffix?: string
  className?: string
  showSign?: boolean
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
  xl: 'text-6xl',
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function RupeeCounter({
  value,
  duration = 1200,
  size = 'md',
  prefix = '₹',
  suffix = '',
  className,
  showSign = false,
}: RupeeCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const frameRef = useRef<number>(0)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    startTimeRef.current = null

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOut(progress)

      setDisplayValue(Math.round(easedProgress * value))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [value, duration])

  const formatted = new Intl.NumberFormat('en-IN').format(displayValue)
  const sign = showSign && value > 0 ? '+' : ''

  return (
    <span
      className={cn(
        'font-mono font-bold tabular-nums tracking-tight',
        sizeClasses[size],
        className
      )}
    >
      {sign}{prefix}{formatted}{suffix}
    </span>
  )
}
