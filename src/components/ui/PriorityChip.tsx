import { cn } from '../../lib/cn'
import { priorityLabelVi } from '../../lib/terms'
import { Icon } from './Icon'
import type { Priority } from './PriorityDot'

const tone: Record<Priority, string> = {
  urgent: 'bg-status-error/15 text-status-error-text',
  high: 'bg-status-warning/15 text-status-warning-text',
  medium: 'bg-brand/15 text-brand',
  low: 'bg-priority-low/15 text-text-secondary',
}
/** Hình cờ đặc cho Khẩn cấp/Cao, cờ viền cho Trung bình/Thấp: phân biệt được khi không có màu. */
const flagFill: Record<Priority, boolean> = { urgent: true, high: true, medium: false, low: false }

export interface PriorityChipProps {
  level: Priority
  /** Đổi chữ hiển thị (mặc định lấy từ thuật ngữ D1). */
  label?: string
  className?: string
}

/** Độ ưu tiên: icon cờ và chữ, không chỉ dựa vào chấm màu. */
export function PriorityChip({ level, label, className }: PriorityChipProps) {
  return (
    <span className={cn('inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-caption text-caption font-semibold', tone[level], className)}>
      <Icon name="flag" size={13} fill={flagFill[level]} />
      {label ?? priorityLabelVi[level]}
    </span>
  )
}
