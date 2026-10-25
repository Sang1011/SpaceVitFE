import { Badge, Icon } from '../../components/ui'
import { cn } from '../../lib/cn'
import { overviewStats } from '../../mocks/overview'

export function StatsBar({ pending }: { pending: number }) {
  return (
    <div className="flex items-center gap-2 self-start rounded-xl bg-surface p-1.5 shadow-sm md:self-auto">
      {overviewStats.map((s, i) => (
        <div key={s.label} className="flex items-center gap-2">
          {i > 0 && <div className="h-6 w-px bg-surface-variant" />}
          <div className="px-3 py-1 text-center">
            <span className={cn('block font-card-title text-card-title', s.tone === 'ai' ? 'text-ai-accent' : 'text-text-primary')}>
              {s.tone === 'ai' ? pending : s.value}
            </span>
            <span className="block font-caption text-caption text-[11px] text-text-secondary">{s.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export function OverviewHeader({ spaceName, roleLabel, pending }: { spaceName: string; roleLabel: string; pending: number }) {
  return (
    <div className="flex flex-col justify-between gap-space-md md:flex-row md:items-center">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-space-sm">
          <h1 className="font-display-title text-display-title tracking-tight text-text-primary">Tổng quan không gian: {spaceName}</h1>
          <Badge tone="primary" icon="shield_person" className="font-semibold">{roleLabel}</Badge>
          <Badge tone="success" dot>Đang hoạt động</Badge>
        </div>
        <p className="font-body-default text-body-default text-text-secondary">
          Không gian hợp tác và quản lý sản phẩm Q4 · Đồng bộ hóa tự động STT, OCR &amp; Nhiệm vụ
        </p>
      </div>
      <StatsBar pending={pending} />
    </div>
  )
}

export interface CaptureCardProps {
  icon: string
  tone: 'red' | 'brand' | 'green'
  title: string
  description: string
  tag: string
  tagTone: 'ai' | 'brand' | 'neutral'
  onClick?: () => void
  lockedReason?: string
}

const tile = {
  red: 'bg-recording-red/10 text-recording-red group-hover:bg-recording-red group-hover:text-surface',
  brand: 'bg-brand/10 text-brand group-hover:bg-brand group-hover:text-surface',
  green: 'bg-status-success/10 text-status-success-text group-hover:bg-status-success group-hover:text-surface',
}
const tagTones = {
  ai: 'bg-ai-container text-ai-accent font-semibold',
  brand: 'bg-surface-variant text-brand',
  neutral: 'bg-surface-variant text-text-secondary',
}

export function CaptureCard({ icon, tone, title, description, tag, tagTone, onClick, lockedReason }: CaptureCardProps) {
  const locked = Boolean(lockedReason)
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={locked}
      title={lockedReason}
      className="group relative flex items-start gap-space-md rounded-xl bg-surface p-space-md text-left shadow-sm transition-all duration-200 hover:bg-surface-container-low hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors', tile[tone])}>
        <Icon name={icon} size={28} className="text-[26px]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <h2 className="font-card-title text-card-title text-text-primary transition-colors group-hover:text-primary">{title}</h2>
          <Icon name="arrow_forward" size={18} className="text-text-secondary transition-transform group-hover:translate-x-0.5" />
        </div>
        <p className="mt-1 font-caption text-caption text-text-secondary">{description}</p>
        <span className={cn('mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-label-mono text-label-mono text-[11px]', tagTones[tagTone])}>{tag}</span>
      </div>
    </button>
  )
}
