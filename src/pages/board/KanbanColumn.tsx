import { useDraggable, useDroppable } from '@dnd-kit/core'
import { cn } from '../../lib/cn'
import { Badge, Icon, IconButton } from '../../components/ui'
import type { BoardColumnData, BoardTask } from '../../types/board'
import { TaskCard, type TaskCardVariant } from './TaskCard'

export function DropZone({ enabled = true }: { enabled?: boolean }) {
  if (!enabled) {
    return (
      <div className="flex w-full select-none items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-surface-variant/40 px-2 py-3 text-text-secondary">
        <Icon name="lock" size={16} />
        <span className="font-caption text-caption text-[11px]">Kéo thả bị khóa ở chế độ Chỉ xem</span>
      </div>
    )
  }
  return (
    <div className="flex h-20 w-full items-center justify-center rounded-xl border-2 border-dashed border-brand/60 bg-brand/5">
      <span className="flex items-center gap-1 font-caption text-caption text-[12px] text-brand">
        <Icon name="south" size={16} />
        <span>Thả thẻ vào đây</span>
      </span>
    </div>
  )
}

const countTone = {
  neutral: { tone: 'neutral', className: 'bg-surface' },
  solid: { tone: 'primary-solid', className: '' },
  ai: { tone: 'ai', className: '' },
  success: { tone: 'success', className: 'bg-status-success/20' },
} as const

function DraggableCard({ task, variant, compact, draggable, aiPaused, onOpen }: { task: BoardTask; variant: TaskCardVariant; compact?: boolean; draggable: boolean; aiPaused?: boolean; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task.id, disabled: !draggable })
  return (
    <div
      ref={setNodeRef}
      id={`card-${task.id}`}
      {...attributes}
      {...listeners}
      tabIndex={0}
      role="button"
      aria-label={`${task.title}. Enter để mở${draggable ? ', Space để nhấc và kéo' : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          onOpen()
          return
        }
        listeners?.onKeyDown?.(e)
      }}
      className={cn('rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand', isDragging && 'opacity-40', !draggable && 'cursor-default')}
    >
      <TaskCard task={task} variant={variant} compact={compact} aiPaused={aiPaused} onOpen={onOpen} className={!draggable ? 'cursor-pointer' : undefined} />
    </div>
  )
}

export interface KanbanColumnProps {
  column: BoardColumnData
  selectedId?: string | null
  /** Viewer: no drag, no add card. */
  canEdit: boolean
  aiPaused?: boolean
  /** Panel chi tiết đang mở: thẻ thu gọn. */
  compact?: boolean
  /** A card is being dragged over this column. */
  showDrop?: boolean
  /** Static demo of the drag state (Stitch screenshot): shows a lifted card + drop zone. */
  demoDragTaskId?: string | null
  onOpenTask: (id: string) => void
  onAddCard?: () => void
  /** Có bộ lọc đang bật: cột rỗng hiện "Không có việc khớp" thay vì cột trống. */
  filtered?: boolean
}

export function KanbanColumn({ column, selectedId, canEdit, aiPaused, compact, showDrop, demoDragTaskId, onOpenTask, onAddCard, filtered }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.key, disabled: !canEdit })
  const total = column.tasks.length + (column.hidden ?? 0)
  const ct = countTone[column.tone]
  return (
    <section ref={setNodeRef} aria-label={column.title} className={cn('flex flex-col gap-space-sm rounded-xl bg-surface-variant/70 p-space-sm transition-shadow', isOver && canEdit && 'ring-2 ring-brand/40')}>
      <div className="flex items-center justify-between px-1 py-1">
        <div className="flex items-center gap-space-xs">
          <span className="font-card-title text-card-title text-[14px] text-text-primary">{column.title}</span>
          <Badge tone={ct.tone} bold className={ct.className}>{total}</Badge>
        </div>
        <IconButton icon="more_horiz" label={`Tùy chọn cột ${column.title}`} iconSize={18} className="p-0.5" />
      </div>

      <div className="flex flex-col gap-space-sm">
        {column.tasks.map((t) => {
          const isDemoDrag = demoDragTaskId === t.id
          if (isDemoDrag) {
            return (
              <div key={t.id} className="flex flex-col gap-space-sm">
                <TaskCard task={t} variant={canEdit ? 'dragged' : 'locked'} compact={compact} aiPaused={aiPaused} />
                <DropZone enabled={canEdit} />
              </div>
            )
          }
          const variant: TaskCardVariant = column.key === 'done' ? 'done' : t.id === selectedId ? 'selected' : 'normal'
          return column.key === 'done' ? (
            <div key={t.id} id={`card-${t.id}`} className={cn('rounded-xl', t.id === selectedId && 'ring-2 ring-brand')}>
              <TaskCard task={t} variant="done" compact={compact} onOpen={() => onOpenTask(t.id)} />
            </div>
          ) : (
            <DraggableCard key={t.id} task={t} variant={variant} compact={compact} draggable={canEdit} aiPaused={aiPaused && t.labels.some((l) => l.tone === 'ai')} onOpen={() => onOpenTask(t.id)} />
          )
        })}
        {showDrop && canEdit && <DropZone />}
        {column.tasks.length === 0 && !showDrop && (
          <p className="rounded-lg border border-dashed border-border px-2 py-4 text-center font-caption text-caption text-text-secondary">
            {filtered ? 'Không có việc khớp bộ lọc' : 'Chưa có việc nào'}
          </p>
        )}
      </div>

      {column.key === 'done' && column.hidden ? (
        <button type="button" className="flex w-full items-center justify-center gap-1 rounded-lg py-1.5 font-body-medium text-body-medium text-[12px] text-text-secondary hover:bg-surface/60 hover:text-text-primary">
          <Icon name="expand_more" size={16} />
          <span>Xem thêm {column.hidden} việc hoàn thành</span>
        </button>
      ) : canEdit ? (
        <button type="button" onClick={onAddCard} className="flex w-full items-center justify-center gap-1 rounded-lg py-2 font-body-medium text-body-medium text-[13px] text-text-secondary hover:bg-surface/60 hover:text-text-primary">
          <Icon name="add" size={16} />
          <span>Thêm thẻ</span>
        </button>
      ) : (
        <div title="Chế độ chỉ xem - Không thể thêm thẻ mới" className="flex w-full cursor-not-allowed select-none items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-surface/30 py-2 font-body-medium text-[12px] text-text-secondary/70">
          <Icon name="lock" size={16} />
          <span>Thêm thẻ (Chỉ xem)</span>
        </div>
      )}
    </section>
  )
}
