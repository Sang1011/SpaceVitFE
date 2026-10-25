import { cn } from '../../lib/cn'
import { Badge, Icon } from '../ui'

/** final: last step when everything finished (solid green). paused: waiting for a retry. */
export type StepStatus = 'done' | 'active' | 'error' | 'pending' | 'paused' | 'final'
export type OverallStatus = 'completed' | 'processing' | 'partial_failed' | 'failed'

export interface StepperStep {
  key: string
  label: string
  /** Second line, e.g. "12 chunks", "100%". */
  detail?: string
  status: StepStatus
}

/** Default steps from the SRS processing states (Vietnamese labels as in the Stitch screens). */
export const defaultSteps: StepperStep[] = [
  { key: 'uploaded', label: 'Đã tải lên', status: 'pending' },
  { key: 'preprocessing', label: 'Đang chuẩn bị', status: 'pending' },
  { key: 'transcribing', label: 'STT bóc băng', status: 'pending' },
  { key: 'partial', label: 'Có kết quả 1 phần', status: 'pending' },
  { key: 'analyzing', label: 'Phân tích AI', status: 'pending' },
  { key: 'completed', label: 'Hoàn tất', status: 'pending' },
]

const tile: Record<StepStatus, { cls: string; icon: string; spin?: boolean }> = {
  done: { cls: 'bg-status-success/10 text-status-success-text', icon: 'check_circle' },
  active: { cls: 'bg-brand/10 text-brand', icon: 'progress_activity', spin: true },
  error: { cls: 'border border-status-error/20 bg-status-error/15 text-status-error-text', icon: 'error' },
  paused: { cls: 'bg-surface-variant text-text-secondary', icon: 'pause_circle' },
  final: { cls: 'bg-success-solid text-on-solid', icon: 'verified' },
  pending: { cls: 'bg-surface-variant text-text-secondary', icon: 'radio_button_unchecked' },
}

const summaryTone = { completed: 'success', processing: 'primary', partial_failed: 'error', failed: 'error' } as const

export interface ProcessingStepperProps {
  title?: string
  steps: StepperStep[]
  status: OverallStatus
  /** Chip text, e.g. "100% Hoàn thành" or "Lỗi một phần (85% hoàn thành)". */
  summary: string
  jobId?: string
  className?: string
}

export function ProcessingStepper({ title = 'Tiến trình xử lý âm thanh & AI', steps, status, summary, jobId, className }: ProcessingStepperProps) {
  return (
    <section className={cn('space-y-space-sm rounded-xl bg-surface p-space-md shadow-sm', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 text-text-secondary">
        <div className="flex items-center gap-2">
          <span className="font-card-title text-card-title text-text-primary">{title}</span>
          <Badge tone={summaryTone[status]} mono size="md" dot={status !== 'completed'} pulse={status === 'processing'} className="text-label-mono">
            {summary}
          </Badge>
        </div>
        {jobId && (
          <span className="font-label-mono text-label-mono text-text-secondary">
            Mã định danh: <span className="text-text-primary">{jobId}</span>
          </span>
        )}
      </div>
      <ol className={cn('grid grid-cols-2 gap-2 pt-1 sm:grid-cols-3', steps.length > 4 ? 'lg:grid-cols-6' : 'lg:grid-cols-4')}>
        {steps.map((s) => {
          const t = tile[s.status]
          return (
            <li key={s.key} aria-current={s.status === 'active' ? 'step' : undefined} className={cn('flex items-center gap-2 rounded-lg p-2', t.cls)}>
              <Icon name={t.icon} size={18} className={t.spin ? 'animate-spin' : undefined} />
              <div className="min-w-0">
                <p className={cn('truncate font-body-medium text-body-medium font-medium leading-none', s.status === 'final' ? 'font-semibold text-on-solid' : s.status === 'error' ? 'font-semibold' : 'text-text-primary')}>{s.label}</p>
                {s.detail && <span className="font-label-mono text-label-mono text-[10px] opacity-80">{s.detail}</span>}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
