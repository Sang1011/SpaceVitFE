import type { ReactNode } from 'react'
import { Badge, Button, Icon, ProgressBar } from '../../components/ui'
import { cn } from '../../lib/cn'
import { activities, type RecentItem } from '../../mocks/overview'

export function SectionCard({ icon, iconTone = 'muted', title, subtitle, action, children, className }: {
  icon: string
  iconTone?: 'muted' | 'brand'
  title: string
  subtitle: string
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
            <p className="font-caption text-caption text-text-secondary">{subtitle}</p>
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

const iconTile = { success: 'bg-status-success/10 text-status-success', brand: 'bg-brand/10 text-brand' }

export function RecentRow({ item }: { item: RecentItem }) {
  if (item.kind === 'processing') {
    return (
      <div className="space-y-3 rounded-xl bg-surface-container-low p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 animate-pulse items-center justify-center rounded-lg bg-recording-red/10 text-recording-red">
              <Icon name="hearing" size={24} className="text-[22px]" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-card-title text-card-title text-text-primary">{item.title}</h3>
              <div className="mt-0.5 flex items-center gap-2 font-caption text-caption text-[12px] text-text-secondary">
                <span className="font-label-mono text-label-mono text-ai-accent">{item.jobId}</span>
                <span>·</span>
                <span>{item.eta}</span>
              </div>
            </div>
          </div>
          <Badge tone="ai" size="md" className="shrink-0 font-semibold">
            <span className="h-2 w-2 animate-ping rounded-full bg-ai-accent" />
            {item.stage}
          </Badge>
        </div>
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between font-label-mono text-label-mono text-[11px] text-text-secondary">
            <span>{item.detail}</span>
            <span className="font-semibold text-ai-accent">{item.percent}% hoàn tất</span>
          </div>
          <ProgressBar value={item.percent} />
          <div className="flex items-center justify-between pt-1 font-caption text-caption text-[11px]">
            <span className="text-text-secondary">{item.queue}</span>
            <a href="#" className="flex items-center gap-1 font-medium text-ai-accent hover:underline">
              Xem kết quả một phần <Icon name="open_in_new" size={13} />
            </a>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col justify-between gap-3 rounded-xl bg-surface-container-low p-3.5 md:flex-row md:items-center">
      <div className="flex min-w-0 items-start gap-3">
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', iconTile[item.iconTone])}>
          <Icon name={item.icon} size={24} className="text-[22px]" />
        </div>
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-card-title text-card-title text-text-primary">{item.title}</h3>
            <Badge tone="success" icon={item.icon === 'graphic_eq' ? 'check_circle' : 'done'} className="shrink-0 font-semibold">{item.badge}</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-caption text-caption text-[12px] text-text-secondary">
            {item.meta.map((m, i) => (
              <span key={m} className="flex items-center gap-3">
                {i > 0 && <span>·</span>}
                <span className={cn(i === 0 && item.icon === 'graphic_eq' && 'font-label-mono text-label-mono', i === item.metaStrong && 'font-medium text-text-primary', i === item.meta.length - 1 && item.icon === 'picture_as_pdf' && 'font-label-mono text-label-mono')}>{m}</span>
              </span>
            ))}
            {item.ai && (
              <>
                <span>·</span>
                <span className="flex items-center gap-0.5 text-ai-accent"><Icon name="auto_awesome" size={13} /> Có trích xuất AI</span>
              </>
            )}
          </div>
        </div>
      </div>
      <Button variant="outline" size="sm" icon={item.action.icon} className="shrink-0 self-end md:self-center">
        {item.action.label}
      </Button>
    </div>
  )
}

export function ActivityTimeline() {
  return (
    <SectionCard icon="history" title="Dòng hoạt động gần đây" subtitle="Nhật ký cộng tác trong không gian">
      <div className="relative space-y-4 pl-6 before:absolute before:bottom-2 before:left-2.5 before:top-2 before:w-0.5 before:bg-surface-variant">
        {activities.map((a) => (
          <div key={a.id} className="relative">
            <div className={cn('absolute -left-[19px] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-surface', a.dot)} />
            <div className="space-y-0.5">
              <p className="font-body-default text-body-default text-[13px] text-text-primary">
                <strong className={cn('font-semibold', a.ai ? 'text-ai-accent' : 'text-text-primary')}>{a.who}</strong> {a.text}{' '}
                {a.link && <span className="cursor-pointer text-brand hover:underline">{a.link}</span>}
                {a.strong && <span className="font-medium">{a.strong}</span>}
                {a.label && <span className="rounded bg-surface-variant px-1.5 py-0.5 text-[11px]">{a.label}</span>}
                {a.after && ` ${a.after}`}
              </p>
              <span className="block font-caption text-caption text-[11px] text-text-secondary">{a.time}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="pt-2">
        <button type="button" className="w-full rounded-xl bg-surface-container-low py-2 font-body-medium text-body-medium text-[12px] text-text-secondary transition-colors hover:bg-surface-variant hover:text-text-primary">
          Xem nhật ký kiểm toán đầy đủ
        </button>
      </div>
    </SectionCard>
  )
}
