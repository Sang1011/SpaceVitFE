import { cn } from '../../lib/cn'
import { Icon } from '../ui'

export interface DueBadgeProps {
  label: string
  overdue?: boolean
  className?: string
}

export function DueBadge({ label, overdue, className }: DueBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-caption text-caption text-[12px]',
        overdue ? 'font-medium text-status-error' : 'text-text-secondary',
        className,
      )}
    >
      <Icon name={overdue ? 'event_busy' : 'schedule'} size={16} className="text-[14px]" />
      {label}
    </span>
  )
}
