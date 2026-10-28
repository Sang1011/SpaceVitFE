import { cn } from '../../lib/cn'
import { Avatar, Badge, Icon, PriorityChip } from '../../components/ui'
import type { BoardLabel, BoardTask } from '../../types/board'

export type TaskCardVariant = 'normal' | 'selected' | 'dragged' | 'done' | 'locked'

function LabelChip({ label }: { label: BoardLabel }) {
  return (
    <Badge tone={label.tone} size="sm" className={label.tone === 'ai' ? 'font-semibold' : undefined}>
      {label.text}
    </Badge>
  )
}

export interface TaskCardProps {
  task: BoardTask
  variant?: TaskCardVariant
  /** Thu gọn khi panel chi tiết đang mở: chỉ giữ tiêu đề, độ ưu tiên, nguồn, hạn, người làm. */
  compact?: boolean
  /** Viewer + AI offline: the AI label becomes "AI Tạm ngưng". */
  aiPaused?: boolean
  onOpen?: () => void
  className?: string
}

const shell: Record<TaskCardVariant, string> = {
  normal: 'cursor-pointer bg-surface shadow-sm transition-shadow hover:shadow-md',
  selected: 'cursor-pointer bg-surface shadow-md ring-2 ring-brand transition-all',
  dragged: 'border border-brand/30 bg-surface',
  done: 'cursor-pointer bg-surface/80 shadow-sm transition-shadow hover:shadow-md',
  locked: 'relative border border-border bg-surface opacity-90 shadow-sm',
}

/** Kanban card. Presentational: dnd-kit wiring lives in KanbanColumn. */
export function TaskCard({ task, variant = 'normal', compact, aiPaused, onOpen, className }: TaskCardProps) {
  const done = variant === 'done'
  const isMic = task.source?.icon === 'mic'
  const card = (
    <article
      onClick={onOpen}
      className={cn('flex flex-col gap-2 rounded-xl p-space-sm', shell[variant], task.aiReview && 'border-l-4 border-ai-accent', className)}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={cn('line-clamp-2 font-card-title text-card-title text-[13px] leading-tight', done ? 'text-text-secondary' : 'text-text-primary')}>
          {task.title}
        </span>
        {done && <Icon name="check_circle" size={18} className="shrink-0 text-status-success-text" />}
      </div>

      {(!done && task.priority) || (!compact && task.labels.length > 0) || variant === 'locked' ? (
        <div className="flex flex-wrap items-center gap-1.5">
          {!done && task.priority && <PriorityChip level={task.priority} />}
          {!compact &&
            task.labels.map((l) =>
              aiPaused && l.tone === 'ai' ? (
                <span key={l.text} className="flex items-center gap-1 rounded-full bg-surface-variant px-2 py-0.5 font-caption text-caption text-[11px] font-medium text-text-secondary">
                  <Icon name="cloud_off" size={13} className="text-[12px] text-status-warning-text" />
                  AI Tạm ngưng
                </span>
              ) : (
                <LabelChip key={l.text} label={l} />
              ),
            )}
          {variant === 'locked' && (
            <span className="flex items-center gap-1 rounded bg-surface-variant px-1.5 py-0.5 font-caption text-caption text-[10px] text-text-secondary">
              <Icon name="lock" size={13} className="text-[11px]" />
              Khóa vị trí
            </span>
          )}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-2 border-t border-border/40 pt-1 font-caption text-caption text-text-secondary">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px]">
          {task.source ? (
            <span className="inline-flex min-w-0 items-center gap-1">
              <Icon name={task.source.icon} size={13} className={cn(isMic && 'text-recording-red')} />
              <span className="truncate">{isMic ? `Ghi âm ${task.source.text}` : task.source.text}</span>
            </span>
          ) : (
            task.doneLabel && <span>{task.doneLabel}</span>
          )}
          {task.due && (
            <span className={cn('inline-flex items-center gap-0.5', task.due.overdue && 'font-semibold text-status-warning-text')}>
              <Icon name={task.due.overdue ? 'event_busy' : 'event'} size={13} />
              {task.due.overdue ? 'Quá hạn' : 'Hạn'} {task.due.label}
            </span>
          )}
        </div>
        <Avatar initials={task.assignee.initials} tone={task.assignee.tone} size={6} className="font-bold" />
      </div>
    </article>
  )
  if (variant === 'dragged') {
    return <div className="pointer-events-none relative z-20 rotate-1 scale-[1.02] rounded-xl shadow-xl">{card}</div>
  }
  return card
}
