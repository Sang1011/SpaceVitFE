import { cn } from '../../lib/cn'
import { Badge } from './Badge'

export interface TabItem {
  key: string
  label: string
  badge?: string
}

export interface TabsProps {
  items: TabItem[]
  value: string
  onChange: (key: string) => void
  /** Colour of the active tab: AI (violet) or brand (indigo). */
  tone?: 'ai' | 'brand'
  /** Khoảng đệm hẹp, dùng trong panel hẹp. */
  dense?: boolean
  className?: string
}

export function Tabs({ items, value, onChange, tone = 'ai', dense, className }: TabsProps) {
  return (
    <nav role="tablist" className={cn(dense ? 'flex items-center overflow-x-auto rounded-xl bg-surface p-1 shadow-sm' : 'flex items-center gap-1 overflow-x-auto rounded-xl bg-surface p-1.5 shadow-sm', className)}>
      {items.map((it) => {
        const active = it.key === value
        return (
          <button
            key={it.key}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(it.key)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-lg py-2 text-center transition-colors', dense ? 'px-1.5' : 'px-2',
              active
                ? cn('font-card-title text-card-title shadow-xs', tone === 'ai' ? 'bg-ai-container text-ai-accent' : 'bg-primary-fixed text-brand')
                : 'font-body-medium text-body-medium text-text-secondary hover:bg-surface-variant hover:text-text-primary',
            )}
          >
            <span>{it.label}</span>
            {it.badge && (
              <Badge tone={tone === 'ai' ? 'ai-strong' : 'primary'} size="xs" mono bold>
                {it.badge}
              </Badge>
            )}
          </button>
        )
      })}
    </nav>
  )
}
