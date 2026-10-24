import { cn } from '../../lib/cn'
import { Avatar, Checkbox, PriorityDot, type AvatarProps, type Priority } from '../ui'
import { DueBadge } from './DueBadge'
import { SourceChip, type SourceChipProps } from './SourceChip'

export const priorityLabelVi: Record<Priority, string> = {
  urgent: 'Khẩn cấp',
  high: 'Cao',
  medium: 'Trung bình',
  low: 'Thấp',
}

export interface TaskListItemProps {
  title: string
  priority: Priority
  source?: Pick<SourceChipProps, 'kind' | 'label' | 'location'>
  due?: { label: string; overdue?: boolean }
  assignee?: { name: string; initials: string; tone?: AvatarProps['tone'] }
  checked?: boolean
  onCheckedChange?: (v: boolean) => void
  disabled?: boolean
  className?: string
}

/** Compact task row used in "Việc của tôi" lists (overview). The kanban TaskCard lives in the board page. */
export function TaskListItem({ title, priority, source, due, assignee, checked, onCheckedChange, disabled, className }: TaskListItemProps) {
  return (
    <div className={cn('group flex items-start gap-3 rounded-xl bg-surface-container-low p-3.5 transition-colors hover:bg-surface-container', className)}>
      <Checkbox className="mt-1" checked={checked} disabled={disabled} onChange={(e) => onCheckedChange?.(e.target.checked)} aria-label={title} />
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              'truncate font-card-title text-card-title text-text-primary transition-colors group-hover:text-primary',
              checked && 'text-text-secondary line-through',
            )}
          >
            {title}
          </span>
          <PriorityDot level={priority} variant="badge" label={priorityLabelVi[priority]} className="font-semibold" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {source && <SourceChip {...source} tone="raised" />}
          {due && <DueBadge {...due} />}
          {assignee && (
            <div className="ml-auto flex items-center gap-1.5">
              <span className="font-caption text-caption text-[11px] text-text-secondary">{assignee.name}</span>
              <Avatar initials={assignee.initials} size={6} tone={assignee.tone ?? 'solid'} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
