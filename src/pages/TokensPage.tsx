import colorNames from '../theme/color-names.json'
import { useTheme } from '../theme/ThemeProvider'

// Static class names so Tailwind's JIT can see them.
const fontSizes: [string, string][] = [
  ['display-title', 'font-display-title text-display-title'],
  ['display-title-mobile', 'font-display-title-mobile text-display-title-mobile'],
  ['section-title', 'font-section-title text-section-title'],
  ['card-title', 'font-card-title text-card-title'],
  ['body-editor', 'font-body-editor text-body-editor'],
  ['body-medium', 'font-body-medium text-body-medium'],
  ['body-default', 'font-body-default text-body-default'],
  ['caption', 'font-caption text-caption'],
  ['label-mono', 'font-label-mono text-label-mono'],
]
const spacing: [string, string][] = [
  ['space-xs (4px)', 'w-space-xs'],
  ['space-sm (8px)', 'w-space-sm'],
  ['gutter-dense (12px)', 'w-gutter-dense'],
  ['space-md (16px)', 'w-space-md'],
  ['space-lg (24px)', 'w-space-lg'],
  ['space-xl (32px)', 'w-space-xl'],
]

export default function TokensPage() {
  const { resolved, toggle } = useTheme()
  return (
    <div className="min-h-screen bg-background p-8 space-y-space-xl">
      <header className="flex items-center justify-between">
        <h1 className="font-display-title text-display-title text-text-primary">Design tokens</h1>
        <button
          type="button"
          onClick={toggle}
          className="h-8 px-3 rounded-lg border border-border text-text-primary hover:bg-surface-variant font-body-medium text-body-medium"
        >
          Theme: {resolved}
        </button>
      </header>

      <section className="space-y-space-md">
        <h2 className="font-section-title text-section-title text-text-primary">Colors ({colorNames.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-space-md">
          {(colorNames as string[]).map((n) => (
            <div key={n} className="bg-surface border border-border rounded-xl p-space-sm space-y-space-xs">
              <div className="h-12 rounded-lg border border-border" style={{ background: `rgb(var(--color-${n}))` }} />
              <div className="font-label-mono text-label-mono text-text-primary">{n}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-space-sm">
        <h2 className="font-section-title text-section-title text-text-primary">Typography</h2>
        {fontSizes.map(([name, cls]) => (
          <div key={name} className="flex items-baseline gap-space-md">
            <span className="w-44 shrink-0 font-label-mono text-label-mono text-text-secondary">{name}</span>
            <span className={`${cls} text-text-primary`}>Họp sprint planning tuần 41 — Ệ Ữ Ặ</span>
          </div>
        ))}
      </section>

      <section className="space-y-space-sm">
        <h2 className="font-section-title text-section-title text-text-primary">Spacing</h2>
        {spacing.map(([name, cls]) => (
          <div key={name} className="flex items-center gap-space-md">
            <span className="w-44 shrink-0 font-label-mono text-label-mono text-text-secondary">{name}</span>
            <div className={`h-3 bg-brand rounded ${cls}`} />
          </div>
        ))}
      </section>
    </div>
  )
}
