import { Badge, type BadgeProps } from './Badge'

export type JobStatus = 'completed' | 'processing' | 'partial_ready' | 'partial_failed' | 'failed'

const map: Record<JobStatus, { tone: NonNullable<BadgeProps['tone']>; label: string; pulse?: boolean }> = {
  completed: { tone: 'success', label: 'Hoàn tất' },
  processing: { tone: 'primary', label: 'Đang xử lý', pulse: true },
  partial_ready: { tone: 'warning', label: 'Có kết quả một phần' },
  partial_failed: { tone: 'error', label: 'Lỗi một phần' },
  failed: { tone: 'error', label: 'Lỗi' },
}

export interface StatusChipProps {
  status: JobStatus
  /** Overrides the default Vietnamese label. */
  label?: string
  size?: BadgeProps['size']
  mono?: boolean
  className?: string
}

export function StatusChip({ status, label, size = 'md', mono, className }: StatusChipProps) {
  const m = map[status]
  return (
    <Badge tone={m.tone} size={size} mono={mono} dot pulse={m.pulse} className={className}>
      {label ?? m.label}
    </Badge>
  )
}
