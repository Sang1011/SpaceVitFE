import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from '../ui'

export interface EmptyStateProps {
  illustration?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** Between description and actions (e.g. OnboardingChecklist). */
  children?: ReactNode
  actions?: ReactNode
  className?: string
}

export function EmptyState({ illustration, title, description, children, actions, className }: EmptyStateProps) {
  return (
    <div className={cn('flex min-h-[680px] w-full flex-col items-center justify-center rounded-2xl border border-border bg-surface px-space-md py-12 shadow-sm', className)}>
      {illustration && <div className="relative mb-6 flex items-center justify-center">{illustration}</div>}
      <div className="mx-auto mb-8 max-w-xl space-y-2 text-center">
        <h2 className="font-display-title text-display-title text-[22px] leading-tight text-text-primary">{title}</h2>
        {description && <p className="font-body-default text-body-default leading-relaxed text-text-secondary">{description}</p>}
      </div>
      {children}
      {actions && <div className="flex flex-wrap items-center justify-center gap-space-sm">{actions}</div>}
    </div>
  )
}

export interface ChecklistItem {
  label: string
  description?: string
  status: 'done' | 'current' | 'todo'
}

export function OnboardingChecklist({ title, items }: { title: string; items: ChecklistItem[] }) {
  const done = items.filter((i) => i.status === 'done').length
  const pct = Math.round((done / items.length) * 100)
  return (
    <div className="mb-8 w-full max-w-lg space-y-3 rounded-xl border border-border bg-surface-variant/50 p-space-md">
      <div className="flex items-center justify-between border-b border-border/60 pb-2">
        <span className="flex items-center gap-1.5 font-card-title text-card-title text-[13px] text-text-primary">
          <Icon name="checklist" size={18} className="text-brand" />
          {title} ({done}/{items.length} hoàn thành)
        </span>
        <span className="rounded bg-surface px-2 py-0.5 font-label-mono text-label-mono text-[11px] font-semibold text-text-secondary">{pct}%</span>
      </div>
      <ol className="space-y-2.5">
        {items.map((it) => (
          <li
            key={it.label}
            className={cn(
              'flex items-start gap-3 rounded-lg border p-2',
              it.status === 'done' && 'border-border/40 bg-surface/80',
              it.status === 'current' && 'border-border bg-surface shadow-sm',
              it.status === 'todo' && 'border-border/40 bg-surface/60',
            )}
          >
            {it.status === 'done' ? (
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-solid text-on-solid">
                <Icon name="check" size={13} className="text-[14px]" />
              </div>
            ) : it.status === 'current' ? (
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-brand bg-surface">
                <span className="h-2 w-2 rounded-full bg-brand" />
              </div>
            ) : (
              <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-border" />
            )}
            <div className="min-w-0 flex-1">
              <p className={cn('font-body-medium text-body-medium text-[13px]', it.status === 'done' ? 'text-text-secondary line-through' : it.status === 'current' ? 'font-semibold text-text-primary' : 'text-text-secondary')}>
                {it.label}
              </p>
              {it.status === 'done' ? (
                <span className="font-caption text-caption text-[11px] text-status-success-text">Đã hoàn thành</span>
              ) : (
                it.description && <p className="font-caption text-caption text-[11px] text-text-secondary">{it.description}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
