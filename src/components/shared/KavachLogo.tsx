import { ShieldIcon } from './ShieldIcon'
import { cn } from '@/utils/cn'

interface KavachLogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showTagline?: boolean
}

const sizeConfig = {
  sm: { shield: 24, text: 'text-xl', tagline: 'text-xs' },
  md: { shield: 36, text: 'text-2xl', tagline: 'text-xs' },
  lg: { shield: 48, text: 'text-3xl', tagline: 'text-sm' },
}

export function KavachLogo({ size = 'md', className, showTagline = false }: KavachLogoProps) {
  const config = sizeConfig[size]

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <ShieldIcon size={config.shield} glowing />
      <div>
        <div className={cn('font-display font-bold tracking-tight text-white leading-none', config.text)}>
          KAVACH
          <span className="text-kavach-blue ml-1 font-devanagari">कवच</span>
        </div>
        {showTagline && (
          <div className={cn('text-gray-400 font-body mt-0.5', config.tagline)}>
            Income Protection
          </div>
        )}
      </div>
    </div>
  )
}
