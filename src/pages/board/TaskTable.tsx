import { Avatar, Icon, PriorityChip } from '../../components/ui'
import { cn } from '../../lib/cn'
import { statusByColumn } from '../../mocks/board'
import type { BoardColumnData } from '../../types/board'

/** Chế độ danh sách: cùng dữ liệu với bảng Kanban, mỗi việc một dòng. */
export function TaskTable({ columns, selectedId, onOpen }: { columns: BoardColumnData[]; selectedId?: string | null; onOpen: (id: string) => void }) {
  const rows = columns.flatMap((c) => c.tasks.map((t) => ({ t, status: c.key })))
  if (rows.length === 0) {
    return <p className="rounded-xl border border-dashed border-border bg-surface p-space-lg text-center font-body-default text-body-default text-text-secondary">Không có việc khớp bộ lọc</p>
  }
  return (
    <div className="min-w-0 flex-1 overflow-x-auto rounded-xl bg-surface shadow-sm">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border font-caption text-caption text-text-secondary">
            <th scope="col" className="px-space-md py-2 font-semibold">Việc</th>
            <th scope="col" className="px-space-sm py-2 font-semibold">Trạng thái</th>
            <th scope="col" className="px-space-sm py-2 font-semibold">Độ ưu tiên</th>
            <th scope="col" className="px-space-sm py-2 font-semibold">Hạn</th>
            <th scope="col" className="px-space-sm py-2 font-semibold">Phụ trách</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ t, status }) => (
            <tr
              key={t.id}
              id={`card-${t.id}`}
              onClick={() => onOpen(t.id)}
              className={cn('cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-surface-variant', t.id === selectedId && 'bg-surface-container')}
            >
              <td className="px-space-md py-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpen(t.id)
                  }}
                  className="max-w-md truncate rounded text-left font-body-medium text-body-medium text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  {t.title}
                </button>
              </td>
              <td className="whitespace-nowrap px-space-sm py-2 font-caption text-caption text-text-secondary">{statusByColumn[status]}</td>
              <td className="px-space-sm py-2">{t.priority ? <PriorityChip level={t.priority} /> : <span className="font-caption text-caption text-text-secondary">Chưa đặt</span>}</td>
              <td className={cn('whitespace-nowrap px-space-sm py-2 font-caption text-caption', t.due?.overdue ? 'font-semibold text-status-warning-text' : 'text-text-secondary')}>
                {t.due ? (
                  <span className="inline-flex items-center gap-1">
                    <Icon name={t.due.overdue ? 'event_busy' : 'event'} size={13} />
                    {t.due.overdue ? 'Quá hạn ' : ''}
                    {t.due.label}
                  </span>
                ) : (
                  '—'
                )}
              </td>
              <td className="px-space-sm py-2">
                <span className="inline-flex items-center gap-1.5 font-caption text-caption text-text-secondary">
                  <Avatar initials={t.assignee.initials} tone={t.assignee.tone} size={6} className="font-bold" />
                  {t.assignee.name}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
