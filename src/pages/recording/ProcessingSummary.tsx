import { useId, useState } from 'react'
import { ProcessingStepper, type OverallStatus } from '../../components/domain'
import { Icon } from '../../components/ui'
import { recordingMeta, stepsFor, type RecStatus } from '../../mocks/recording'

const overall: Record<RecStatus, OverallStatus> = { completed: 'completed', processing: 'processing', partial_ready: 'processing', partial_failed: 'partial_failed', failed: 'failed' }

/**
 * Tiến trình xử lý: khi đã xong chỉ còn một dòng, bung ra nếu cần xem; khi đang xử lý hoặc lỗi thì bung sẵn.
 * Mã tiến trình chỉ hiện trong phần bung.
 */
export function ProcessingSummary({ status, progress }: { status: RecStatus; progress: number }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const expanded = status !== 'completed' || open
  const summary: Record<RecStatus, string> = {
    completed: 'Hoàn tất',
    processing: `Đang chép lời ${Math.round(progress)}%`,
    partial_ready: 'Có kết quả một phần, đang xử lý tiếp',
    partial_failed: 'Lỗi một phần (85% hoàn thành)',
    failed: 'Không xử lý được',
  }
  if (!expanded) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-xl bg-surface px-space-md py-2 shadow-sm">
        <span className="flex items-center gap-2 font-body-medium text-body-medium text-text-primary">
          <Icon name="check_circle" size={18} className="text-status-success-text" />
          Đã xử lý xong · 12 đoạn âm thanh · 3 việc đề xuất
        </span>
        <button
          type="button"
          aria-expanded={false}
          aria-controls={id}
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-0.5 rounded font-caption text-caption text-text-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-brand"
        >
          Xem tiến trình
          <Icon name="expand_more" size={16} />
        </button>
      </div>
    )
  }
  return (
    <div id={id} className="space-y-1">
      <ProcessingStepper title="Tiến trình xử lý" status={overall[status]} summary={summary[status]} steps={stepsFor(status, progress)} />
      <div className="flex items-center justify-between px-1 font-caption text-caption text-text-secondary">
        <span>Mã tiến trình: <span className="font-label-mono text-label-mono">{recordingMeta.jobId}</span></span>
        {status === 'completed' && (
          <button type="button" aria-expanded onClick={() => setOpen(false)} className="inline-flex items-center gap-0.5 rounded outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-brand">
            Thu gọn
            <Icon name="expand_less" size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
