import { Button } from '../ui'

export interface BulkActionsBarProps {
  selected: number
  total: number
  onDismissAll?: () => void
  onConfirmAll?: () => void
  lockedReason?: string
}

export function BulkActionsBar({ selected, total, onDismissAll, onConfirmAll, lockedReason }: BulkActionsBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-space-md gap-y-space-sm rounded-xl bg-surface p-space-md shadow-sm">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-brand" />
        <span className="whitespace-nowrap font-body-medium text-body-medium text-text-secondary">
          Đã chọn: <strong className="text-text-primary">{selected} / {total}</strong> việc
        </span>
      </div>
      <div className="flex items-center gap-space-sm">
        <Button variant="ghost" size="lg" className="px-3 hover:text-status-error-text" onClick={onDismissAll}>
          Bỏ qua tất cả
        </Button>
        <Button size="lg" icon="add_task" disabled={selected === 0} onClick={onConfirmAll} lockedReason={lockedReason} className="active:scale-95">
          Tạo tất cả đã chọn ({selected} task)
        </Button>
      </div>
    </div>
  )
}
