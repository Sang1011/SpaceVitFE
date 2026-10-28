import { useId, useState, type ReactNode } from 'react'
import { Button, Icon, ProgressBar, StatusChip } from '../../components/ui'
import { cn } from '../../lib/cn'
import { activities, type RecentItem } from '../../mocks/overview'

export function SectionCard({ icon, iconTone = 'muted', title, subtitle, action, children, className }: {
  icon: string
  iconTone?: 'muted' | 'brand'
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('space-y-space-md rounded-2xl bg-surface p-space-lg shadow-sm', className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-space-sm">
          <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', iconTone === 'brand' ? 'bg-brand/10 text-brand' : 'bg-surface-variant text-text-primary')}>
            <Icon name={icon} size={20} />
          </div>
          <div>
            <h2 className="font-section-title text-section-title text-text-primary">{title}</h2>
            {subtitle && <p className="font-caption text-caption text-text-secondary">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

const iconTile = { success: 'bg-status-success/10 text-status-success-text', brand: 'bg-brand/10 text-brand' }

/** Một mục trong "Đang xử lý": mục đang chạy hiện tiến độ, chi tiết kỹ thuật thu gọn; mục xong hiện một dòng tóm tắt. */
export function RecentRow({ item }: { item: RecentItem }) {
  const [open, setOpen] = useState(false)
  const detailId = useId()
  if (item.kind === 'processing') {
    return (
      <div className="space-y-2 rounded-xl bg-surface-container-low p-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <Icon name="hearing" size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-body-medium text-body-medium font-semibold text-text-primary">{item.title}</h3>
            <p className="truncate font-caption text-caption text-text-secondary">
              {item.stage} · {item.eta}
            </p>
          </div>
          <StatusChip status="processing" className="shrink-0" />
        </div>
        <div className="flex items-center gap-3">
          <ProgressBar value={item.percent} className="flex-1" />
          <span className="shrink-0 font-caption text-caption font-semibold text-text-secondary">{item.percent}%</span>
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={detailId}
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-0.5 rounded font-caption text-caption text-text-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Icon name={open ? 'expand_less' : 'expand_more'} size={16} />
          Chi tiết kỹ thuật
        </button>
        {open && (
          <dl id={detailId} className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 font-caption text-caption text-text-secondary">
            <dt>Mã tiến trình</dt>
            <dd className="font-label-mono text-label-mono">{item.jobId}</dd>
            <dt>Tiến độ</dt>
            <dd>{item.detail.replace('Tiến trình xử lý: ', '')}</dd>
            <dt>Hàng đợi</dt>
            <dd>{item.queue.replace('Hàng đợi: ', '')}</dd>
          </dl>
        )}
      </div>
    )
  }
  return (
    <div className="flex items-center gap-3 rounded-xl bg-surface-container-low p-3.5">
      <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', iconTile[item.iconTone])}>
        <Icon name={item.icon} size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-body-medium text-body-medium font-semibold text-text-primary">{item.title}</h3>
          <StatusChip status="completed" className="shrink-0" />
        </div>
        <p className="truncate font-caption text-caption text-text-secondary">
          {item.meta.join(' · ')}
          {item.ai ? ' · AI đã trích xuất việc' : ''}
        </p>
      </div>
      <Button variant="outline" size="sm" icon={item.action.icon} className="shrink-0">
        {item.action.label}
      </Button>
    </div>
  )
}

/** Hoạt động gần đây: nằm cuối trang và thu gọn mặc định để không tranh chỗ với việc cần làm. */
export function ActivityTimeline() {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <section className="rounded-2xl bg-surface p-space-lg shadow-sm">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <span className="flex items-center gap-space-sm">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-variant text-text-primary">
            <Icon name="history" size={20} />
          </span>
          <span className="font-section-title text-section-title text-text-primary">Hoạt động gần đây</span>
        </span>
        <Icon name={open ? 'expand_less' : 'expand_more'} size={24} className="text-text-secondary" />
      </button>
      {open && (
        <div id={id} className="mt-space-md">
          <div className="relative space-y-4 pl-6 before:absolute before:bottom-2 before:left-2.5 before:top-2 before:w-0.5 before:bg-surface-variant">
            {activities.map((a) => (
              <div key={a.id} className="relative">
                <div className={cn('absolute -left-[19px] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-surface', a.dot)} />
                <p className="font-body-default text-body-default text-[13px] text-text-primary">
                  <strong className="font-semibold text-text-primary">{a.who}</strong> {a.text}{' '}
                  {a.link && <span className="text-brand">{a.link}</span>}
                  {a.strong && <span className="font-medium">{a.strong}</span>}
                  {a.label && <span className="rounded bg-surface-variant px-1.5 py-0.5 text-[11px]">{a.label}</span>}
                  {a.after && ` ${a.after}`}
                </p>
                <span className="block font-caption text-caption text-text-secondary">{a.time.replace(/ · job_\w+/, '')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
