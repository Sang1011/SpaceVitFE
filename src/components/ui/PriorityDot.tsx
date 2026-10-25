import { cn } from '../../lib/cn'

export type Priority = 'urgent' | 'high' | 'medium' | 'low'

const dot: Record<Priority, string> = {
  urgent: 'bg-priority-urgent',
  high: 'bg-priority-high',
  medium: 'bg-priority-medium',
  low: 'bg-priority-low',
}
const badge: Record<Priority, string> = {
  urgent: 'bg-status-error/15 text-status-error-text',
  high: 'bg-status-warning/15 text-status-warning-text',
  medium: 'bg-brand/15 text-brand',
  low: 'bg-priority-low/15 text-text-secondary',
}
const label: Record<Priority, string> = { urgent: 'Urgent', high: 'High', medium: 'Medium', low: 'Low' }
const dotSize = { sm: 'h-1.5 w-1.5', md: 'h-2 w-2', lg: 'h-2.5 w-2.5' } as const

export interface PriorityDotProps {
  level: Priority
  variant?: 'dot' | 'badge'
  size?: keyof typeof dotSize
  /** Override the badge text. */
  label?: string
  className?: string
}

export function PriorityDot({ level, variant = 'dot', size = 'md', label: text, className }: PriorityDotProps) {
  if (variant === 'dot') {
    return <span role="img" aria-label={label[level]} className={cn('inline-block shrink-0 rounded-full', dotSize[size], dot[level], className)} />
  }
  return (
    <span className={cn('inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-caption text-caption', badge[level], className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', dot[level])} />
      {text ?? label[level]}
    </span>
  )
}
