import { cn } from '../../lib/cn'
import { Avatar, Badge, Icon, PriorityDot } from '../../components/ui'
import type { BoardLabel, BoardTask } from '../../types/board'

export type TaskCardVariant = 'normal' | 'selected' | 'dragged' | 'done' | 'locked'

const priorityTitle = { urgent: 'Độ ưu tiên: Khẩn cấp', high: 'Độ ưu tiên: Cao', medium: 'Độ ưu tiên: Trung bình', low: 'Độ ưu tiên: Thấp' } as const

function LabelChip({ label }: { label: BoardLabel }) {
  const tone = label.tone
  return (
    <Badge tone={tone} size="sm" className={tone === 'ai' ? 'font-semibold' : undefined}>
      {label.text}
    </Badge>
  )
}

export interface TaskCardProps {
  task: BoardTask
  variant?: TaskCardVariant
  /** Viewer + AI offline: the AI label becomes "AI Tạm ngưng". */
  aiPaused?: boolean
  onOpen?: () => void
  className?: string
}

const shell: Record<TaskCardVariant, string> = {
  normal: 'cursor-pointer bg-surface shadow-sm transition-shadow hover:shadow-md',
  selected: 'cursor-pointer bg-surface shadow-md ring-2 ring-brand transition-all',
  dragged: 'border border-brand/30 bg-surface',
  done: 'bg-surface/80 opacity-90 shadow-sm',
  locked: 'relative border border-border bg-surface opacity-90 shadow-sm',
}

/** Kanban card. Presentational: dnd-kit wiring lives in KanbanColumn. */
export function TaskCard({ task, variant = 'normal', aiPaused, onOpen, className }: TaskCardProps) {
  const done = variant === 'done'
  const card = (
    <article
      onClick={onOpen}
      className={cn('flex flex-col gap-2 rounded-xl p-space-sm', shell[variant], task.aiReview && 'border-l-4 border-ai-accent', className)}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={cn('line-clamp-2 font-card-title text-card-title text-[13px] leading-tight', done ? 'text-text-secondary line-through' : 'text-text-primary')}>
          {task.title}
        </span>
        {done ? (
          <Icon name="check_circle" size={18} className="shrink-0 text-status-success-text" />
        ) : (
          task.priority && <span title={priorityTitle[task.priority]} className="mt-1 shrink-0"><PriorityDot level={task.priority} /></span>
        )}
      </div>

      {(task.labels.length > 0 || variant === 'locked') && (
        <div className="flex flex-wrap items-center gap-1.5">
          {task.labels.map((l) =>
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
      )}

      <div className="flex items-center justify-between border-t border-border/40 pt-1 font-caption text-caption text-text-secondary">
        {task.source ? (
          <span
            className={cn(
              'inline-flex items-center gap-1 text-[11px]',
              !task.source.bare && 'rounded-full bg-surface-variant px-2 py-0.5 text-text-secondary',
            )}
          >
            <Icon name={task.source.icon} size={13} className={cn(task.source.iconBrand && 'text-brand')} />
            <span className={task.source.mono ? 'font-label-mono text-label-mono text-[10px]' : undefined}>{task.source.text}</span>
          </span>
        ) : (
          <span className="text-[11px]">{task.doneLabel}</span>
        )}
        <div className="flex items-center gap-2">
          {task.due && (
            <span className={cn('text-[11px]', task.due.overdue && 'flex items-center gap-0.5 font-medium text-status-error-text')}>
              {task.due.overdue && <Icon name="schedule" size={13} className="text-[12px]" />}
              {task.due.label}
            </span>
          )}
          <Avatar initials={task.assignee.initials} tone={task.assignee.tone} size={6} className="font-bold" />
        </div>
      </div>
    </article>
  )
  if (variant === 'dragged') {
    return <div className="relative z-20 rotate-1 scale-[1.02] rounded-xl shadow-xl pointer-events-none">{card}</div>
  }
  return card
}
