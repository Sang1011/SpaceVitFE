import { cn } from '../../lib/cn'
import { Avatar, Button, Checkbox, Icon, PriorityDot, type Priority } from '../ui'
import { priorityLabelVi } from '../../lib/terms'
import { SourceChip, type SourceChipProps } from './SourceChip'

export interface GhostTaskCardProps {
  title: string
  priority?: Priority
  assignee?: { name: string; initials: string }
  /** Due date label, e.g. "18/10/2024" or "Hạn chót: 15/10". */
  date?: string
  /** Extra line in the compact layout, e.g. "Người thực hiện: Lê Thu Hà". */
  note?: string
  source?: Pick<SourceChipProps, 'kind' | 'label' | 'location'>
  /** compact: overview widget. detailed: recording page with checkbox and metadata row. */
  density?: 'compact' | 'detailed'
  selected?: boolean
  onSelectedChange?: (v: boolean) => void
  onConfirm?: () => void
  onDismiss?: () => void
  /** Role without edit permission: actions are locked. */
  lockedReason?: string
  className?: string
}

const dashed = 'border-[1.5px] border-dashed border-ai-accent'

/**
 * AI-suggested task waiting for human confirmation (dashed violet outline).
 * It is NOT a stored task until onConfirm runs.
 */
export function GhostTaskCard({
  title, priority, assignee, date, note, source, density = 'compact', selected, onSelectedChange, onConfirm, onDismiss, lockedReason, className,
}: GhostTaskCardProps) {
  if (density === 'compact') {
    return (
      <div className={cn('space-y-3 rounded-xl bg-surface/90 p-3.5', dashed, className)}>
        <div className="flex items-start gap-2">
          <Icon name="lightbulb" size={18} className="mt-0.5 shrink-0 text-ai-accent" />
          <div className="min-w-0 flex-1">
            <p className="font-card-title text-card-title text-[14px] leading-snug text-text-primary">{title}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              {source && <SourceChip {...source} size="xs" />}
              {note && <span className="font-caption text-caption text-[11px] text-text-secondary">{note}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 pt-1">
          <Button variant="ghost" size="sm" className="bg-surface text-[12px]" onClick={onDismiss}>
            Bỏ qua
          </Button>
          <Button size="sm" icon="add_task" className="px-3.5 text-[12px]" onClick={onConfirm} lockedReason={lockedReason}>
            Tạo task
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden rounded-xl bg-surface p-space-md shadow-sm transition-all', dashed, !assignee && 'bg-surface/80 opacity-90 hover:opacity-100', className)}>
      <div className="flex items-start gap-space-sm">
        <Checkbox tone="ai" className="mt-1" checked={selected} onChange={(e) => onSelectedChange?.(e.target.checked)} aria-label={`Chọn: ${title}`} />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-card-title text-card-title leading-tight text-text-primary">{title}</h3>
            {priority && <PriorityDot level={priority} variant="badge" label={priorityLabelVi[priority] === 'Khẩn cấp' ? 'Urgent' : undefined} />}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-caption text-caption text-text-secondary">
            <div className="flex items-center gap-1.5">
              {assignee ? (
                <>
                  <Avatar initials={assignee.initials} size={5} tone="ai" />
                  <span className="text-text-primary">{assignee.name}</span>
                </>
              ) : (
                <span className="italic">Chưa gán</span>
              )}
            </div>
            {date && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Icon name="event" size={16} className="text-[14px]" />
                  <span>{date}</span>
                </div>
              </>
            )}
            {source && (
              <>
                <span>•</span>
                <SourceChip {...source} />
              </>
            )}
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button type="button" onClick={onDismiss} className="rounded-lg px-2.5 py-1 font-caption text-caption text-text-secondary transition-colors hover:bg-surface-variant">
              Bỏ qua
            </button>
            <Button size="xs" icon="check" className="h-auto px-3 py-1 font-caption text-caption" onClick={onConfirm} lockedReason={lockedReason}>
              Tạo task
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
