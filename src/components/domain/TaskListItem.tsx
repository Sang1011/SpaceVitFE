import { useId, useState } from 'react'
import { cn } from '../../lib/cn'
import { priorityLabelVi } from '../../lib/terms'
import { Avatar, Checkbox, Icon, PriorityChip, PriorityDot, type AvatarProps, type Priority } from '../ui'
import { DueBadge } from './DueBadge'
import { SourceChip, type SourceChipProps } from './SourceChip'

export interface TaskListItemProps {
  title: string
  priority: Priority
  source?: Pick<SourceChipProps, 'kind' | 'label' | 'location'>
  due?: { label: string; overdue?: boolean }
  assignee?: { name: string; initials: string; tone?: AvatarProps['tone'] }
  checked?: boolean
  onCheckedChange?: (v: boolean) => void
  disabled?: boolean
  /** compact: một dòng gồm tiêu đề, hạn, độ ưu tiên; nguồn và người làm hiện khi mở rộng. */
  density?: 'detailed' | 'compact'
  className?: string
}

/** Compact task row used in "Việc của tôi" lists (overview). The kanban TaskCard lives in the board page. */
export function TaskListItem({ title, priority, source, due, assignee, checked, onCheckedChange, disabled, density = 'detailed', className }: TaskListItemProps) {
  const [open, setOpen] = useState(false)
  const detailId = useId()
  if (density === 'compact') {
    const hasMore = Boolean(source || assignee)
    return (
      <div className={cn('rounded-xl bg-surface-container-low transition-colors hover:bg-surface-container', className)}>
        <div className="flex items-center gap-3 px-3.5 py-2.5">
          <Checkbox checked={checked} disabled={disabled} onChange={(e) => onCheckedChange?.(e.target.checked)} aria-label={`Hoàn thành: ${title}`} />
          <span className={cn('min-w-0 flex-1 truncate font-body-medium text-body-medium text-text-primary', checked && 'text-text-secondary line-through')}>{title}</span>
          {due && <DueBadge {...due} className="shrink-0" />}
          <PriorityChip level={priority} className="shrink-0" />
          {hasMore && (
            <button
              type="button"
              aria-expanded={open}
              aria-controls={detailId}
              aria-label={open ? 'Thu gọn chi tiết' : 'Xem nguồn và người làm'}
              onClick={() => setOpen((o) => !o)}
              className="shrink-0 rounded-md p-0.5 text-text-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Icon name={open ? 'expand_less' : 'expand_more'} size={20} />
            </button>
          )}
        </div>
        {open && (
          <div id={detailId} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/60 px-3.5 py-2 pl-[46px] font-caption text-caption text-text-secondary">
            {source && <SourceChip {...source} tone="raised" />}
            {assignee && (
              <span className="flex items-center gap-1.5">
                <Avatar initials={assignee.initials} size={6} tone={assignee.tone ?? 'solid'} />
                {assignee.name}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
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
