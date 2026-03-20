import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        // KAVACH v2 light periwinkle theme
        k: {
          app:       '#EEF2FF',
          card:      '#FFFFFF',
          sidebar:   '#C7D2FE',
          hero:      '#A5B4FC',
          input:     '#F1F5F9',
          black:     '#0F172A',
          blue:      '#6366F1',
          indigo:    '#1E1B4B',
          amber:     '#F59E0B',
          success:   '#10B981',
          danger:    '#EF4444',
          muted:     '#64748B',
          border:    '#E2E8F0',
          kborder:   '#EDE9FE',
        },
        border:  'hsl(var(--border))',
        input:   'hsl(var(--input))',
        ring:    'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
      },
      fontFamily: {
        syne:        ['Syne', 'sans-serif'],
        dm:          ['DM Sans', 'sans-serif'],
        mono:        ['JetBrains Mono', 'monospace'],
        devanagari:  ['Noto Sans Devanagari', 'sans-serif'],
      },
      borderRadius: {
        lg:  'var(--radius)',
        xl:  '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        fadeUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% center' }, '100%': { backgroundPosition: '200% center' } },
        spin: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-up': 'fadeUp 0.4s ease-out',
        shimmer: 'shimmer 1.5s linear infinite',
        spin: 'spin 0.75s linear infinite',
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config
