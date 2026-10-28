import { cn } from '../../lib/cn'
import { Icon, SearchInput } from '../ui'

export interface FilterChip {
  key: string
  icon: string
  label: string
  active: boolean
  onToggle: () => void
}

export type BoardView = 'kanban' | 'table'

export interface FilterBarProps {
  searchPlaceholder?: string
  search?: string
  onSearchChange?: (v: string) => void
  /** Bộ lọc dạng chip bật/tắt. */
  chips?: FilterChip[]
  /** Hiện "Xóa lọc (n)" khi n > 0. */
  activeCount?: number
  onClear?: () => void
  view?: BoardView
  onViewChange?: (v: BoardView) => void
  className?: string
}

const views: { key: BoardView; icon: string; label: string }[] = [
  { key: 'kanban', icon: 'view_kanban', label: 'Dạng bảng Kanban' },
  { key: 'table', icon: 'table_rows', label: 'Dạng danh sách' },
]

export function FilterBar({
  searchPlaceholder = 'Lọc việc trong sprint...',
  search,
  onSearchChange,
  chips = [],
  activeCount = 0,
  onClear,
  view = 'kanban',
  onViewChange,
  className,
}: FilterBarProps) {
  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-space-md rounded-xl bg-surface p-space-sm shadow-sm', className)}>
      <div className="flex flex-wrap items-center gap-space-sm">
        <div className="w-64">
          <SearchInput compact placeholder={searchPlaceholder} aria-label="Lọc việc" value={search} onChange={(e) => onSearchChange?.(e.target.value)} />
        </div>
        {chips.map((c) => (
          <button
            key={c.key}
            type="button"
            aria-pressed={c.active}
            onClick={c.onToggle}
            className={cn(
              'flex h-8 items-center gap-1.5 rounded-lg border px-2.5 font-body-medium text-body-medium text-[13px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand',
              c.active ? 'border-brand/40 bg-brand/15 text-brand' : 'border-transparent bg-surface-variant text-text-secondary hover:bg-surface-container-high hover:text-text-primary',
            )}
          >
            <Icon name={c.active ? 'check' : c.icon} size={16} />
            {c.label}
          </button>
        ))}
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg px-2 py-1 font-body-medium text-body-medium text-[13px] text-brand outline-none hover:underline focus-visible:ring-2 focus-visible:ring-brand"
          >
            Xóa lọc ({activeCount})
          </button>
        )}
      </div>
      <div role="group" aria-label="Kiểu hiển thị" className="flex items-center gap-space-xs">
        {views.map((v) => (
          <button
            key={v.key}
            type="button"
            aria-label={v.label}
            title={v.label}
            aria-pressed={view === v.key}
            onClick={() => onViewChange?.(v.key)}
            className={cn('rounded-lg p-1.5 outline-none focus-visible:ring-2 focus-visible:ring-brand', view === v.key ? 'bg-surface-container text-brand' : 'text-text-secondary hover:bg-surface-variant')}
          >
            <Icon name={v.icon} size={18} />
          </button>
        ))}
      </div>
    </div>
  )
}
