import type { Config } from 'tailwindcss'
import colorNames from './src/theme/color-names.json'

// Colors are RGB-channel CSS variables (see src/theme/tokens.css) so that
// opacity modifiers such as `bg-surface/90` keep working in light and dark.
const colors = Object.fromEntries(
  (colorNames as string[]).map((n) => [n, `rgb(var(--color-${n}) / <alpha-value>)`]),
)

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors,
      borderRadius: { DEFAULT: '0.25rem', lg: '0.5rem', xl: '0.75rem', full: '9999px' },
      spacing: {
        margin: '1.5rem',
        'space-lg': '1.5rem',
        gutter: '1rem',
        'space-sm': '0.5rem',
        'space-xs': '0.25rem',
        'margin-mobile': '1rem',
        'space-xl': '2rem',
        'space-md': '1rem',
        'gutter-dense': '0.75rem',
      },
      fontFamily: {
        'display-title-mobile': ['Be Vietnam Pro', 'system-ui', 'sans-serif'],
        'display-title': ['Be Vietnam Pro', 'system-ui', 'sans-serif'],
        'label-mono': ['JetBrains Mono', 'ui-monospace', 'monospace'],
        caption: ['Inter', 'system-ui', 'sans-serif'],
        'body-editor': ['Inter', 'system-ui', 'sans-serif'],
        'body-medium': ['Inter', 'system-ui', 'sans-serif'],
        'section-title': ['Be Vietnam Pro', 'system-ui', 'sans-serif'],
        'body-default': ['Inter', 'system-ui', 'sans-serif'],
        'card-title': ['Be Vietnam Pro', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-title-mobile': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'display-title': ['28px', { lineHeight: '36px', fontWeight: '700' }],
        'label-mono': ['12px', { lineHeight: '16px', fontWeight: '500' }],
        caption: ['12px', { lineHeight: '16px', fontWeight: '500' }],
        'body-editor': ['16px', { lineHeight: '26px', fontWeight: '400' }],
        'body-medium': ['14px', { lineHeight: '22px', fontWeight: '500' }],
        'section-title': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-default': ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'card-title': ['16px', { lineHeight: '24px', fontWeight: '600' }],
      },
      boxShadow: { xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
      keyframes: {
        'fade-in': { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'none' } },
      },
      animation: { 'fade-in': 'fade-in 150ms ease-out' },
    },
  },
  plugins: [],
}

export default config
