import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'
import { Badge } from './Badge'
import { Icon } from './Icon'
import { IconButton } from './IconButton'

const banner = cva('flex items-center justify-between gap-space-sm rounded-xl border px-space-md py-2.5', {
  variants: {
    tone: {
      info: 'border-border bg-surface-variant',
      warning: 'border-status-warning/30 bg-status-warning/10',
      error: 'border-status-error/20 bg-status-error/15 shadow-sm',
      ai: 'border-ai-accent/20 bg-ai-container',
    },
  },
  defaultVariants: { tone: 'info' },
})

const iconColor = {
  info: 'text-text-secondary',
  warning: 'text-status-warning',
  error: 'text-status-error',
  ai: 'text-ai-accent',
} as const
const titleColor = { info: 'text-text-primary', warning: 'text-text-primary', error: 'text-status-error', ai: 'text-text-primary' } as const
const badgeTone = { info: 'neutral', warning: 'warning', error: 'error-solid', ai: 'ai-strong' } as const

export interface BannerProps extends VariantProps<typeof banner> {
  icon?: string
  title: ReactNode
  description?: ReactNode
  badge?: string
  /** Square solid icon tile (used by the error banner). */
  solidIcon?: boolean
  actions?: ReactNode
  onDismiss?: () => void
  className?: string
}

export function Banner({ tone = 'info', icon, title, description, badge, solidIcon, actions, onDismiss, className }: BannerProps) {
  const t = tone ?? 'info'
  return (
    <div role={t === 'error' ? 'alert' : 'status'} className={cn(banner({ tone }), className)}>
      <div className="flex min-w-0 items-center gap-2.5">
        {icon &&
          (solidIcon ? (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-status-error text-on-primary">
              <Icon name={icon} size={20} />
            </div>
          ) : (
            <Icon name={icon} size={20} className={cn('shrink-0', iconColor[t])} />
          ))}
        <div className="min-w-0 space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn('font-card-title text-card-title text-[13px] leading-tight', titleColor[t])}>{title}</span>
            {badge && (
              <Badge tone={badgeTone[t]} size="xs" mono bold>
                {badge}
              </Badge>
            )}
          </div>
          {description && <p className="font-caption text-caption text-text-secondary">{description}</p>}
        </div>
      </div>
      {(actions || onDismiss) && (
        <div className="flex shrink-0 items-center gap-2">
          {actions}
          {onDismiss && <IconButton icon="close" label="Đóng thông báo" iconSize={16} onClick={onDismiss} />}
        </div>
      )}
    </div>
  )
}
