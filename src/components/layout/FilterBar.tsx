import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Checkbox, Icon, SearchInput } from '../ui'

export function FilterPill({ icon, children, onClick }: { icon: string; children: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-8 items-center gap-1.5 rounded-lg bg-surface-variant px-2.5 font-body-medium text-body-medium text-[13px] text-text-secondary transition-colors hover:bg-surface-container-high hover:text-text-primary"
    >
      <Icon name={icon} size={16} />
      <span>{children}</span>
      <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
    </button>
  )
}

export type BoardView = 'kanban' | 'table'

export interface FilterBarProps {
  searchPlaceholder?: string
  search?: string
  onSearchChange?: (v: string) => void
  filters?: { icon: string; label: string }[]
  mineOnly?: boolean
  onMineOnlyChange?: (v: boolean) => void
  view?: BoardView
  onViewChange?: (v: BoardView) => void
  className?: string
}

const views: { key: BoardView; icon: string; label: string }[] = [
  { key: 'kanban', icon: 'view_kanban', label: 'Dạng bảng Kanban' },
  { key: 'table', icon: 'table_rows', label: 'Dạng danh sách' },
]

export function FilterBar({
  searchPlaceholder = 'Lọc thẻ trong sprint...',
  search,
  onSearchChange,
  filters = [
    { icon: 'person', label: 'Phụ trách: Tất cả' },
    { icon: 'flag', label: 'Độ ưu tiên' },
    { icon: 'label', label: 'Nhãn' },
  ],
  mineOnly,
  onMineOnlyChange,
  view = 'kanban',
  onViewChange,
  className,
}: FilterBarProps) {
  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-space-md rounded-xl bg-surface p-space-sm shadow-sm', className)}>
      <div className="flex flex-wrap items-center gap-space-sm">
        <div className="w-64">
          <SearchInput compact placeholder={searchPlaceholder} value={search} onChange={(e) => onSearchChange?.(e.target.value)} />
        </div>
        {filters.map((f) => (
          <FilterPill key={f.label} icon={f.icon}>
            {f.label}
          </FilterPill>
        ))}
        <div className="mx-1 h-4 w-px bg-border" />
        <label className="flex cursor-pointer select-none items-center gap-2 rounded-lg px-2 py-1 hover:bg-surface-variant">
          <Checkbox checked={mineOnly} onChange={(e) => onMineOnlyChange?.(e.target.checked)} />
          <span className="font-body-medium text-body-medium text-[13px] text-text-primary">Việc của tôi</span>
        </label>
      </div>
      <div className="flex items-center gap-space-xs">
        <span className="font-caption text-caption text-text-secondary">Hiển thị:</span>
        {views.map((v) => (
          <button
            key={v.key}
            type="button"
            aria-label={v.label}
            aria-pressed={view === v.key}
            onClick={() => onViewChange?.(v.key)}
            className={cn('rounded-lg p-1.5', view === v.key ? 'bg-surface-container text-brand' : 'text-text-secondary hover:bg-surface-variant')}
          >
            <Icon name={v.icon} size={18} />
          </button>
        ))}
      </div>
    </div>
  )
}
