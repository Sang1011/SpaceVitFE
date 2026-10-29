import { Button, Icon, Popover } from '../../components/ui'
import { cn } from '../../lib/cn'
import { AI_PRIMARY_COUNT, aiActions } from '../../mocks/notes'

/**
 * Thanh AI nổi trên đoạn đang chọn: 3 nút chính và "Thêm". Đặt trong chỗ trống phía trên đoạn,
 * không che chữ.
 */
export function FloatingAiMenu({ activeKey, onPick, lockedReason }: { activeKey: string; onPick: (key: string) => void; lockedReason?: string }) {
  const primary = aiActions.slice(0, AI_PRIMARY_COUNT)
  const more = aiActions.slice(AI_PRIMARY_COUNT)
  const btn = (active: boolean) =>
    cn(
      'flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-1.5 font-body-medium text-body-medium text-[13px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-50',
      active ? 'bg-ai-container font-semibold text-ai-accent' : 'text-text-primary hover:bg-surface-variant',
    )
  return (
    <div role="toolbar" aria-label="Công cụ AI" className="absolute left-0 top-0 z-40 flex animate-fade-in items-center gap-1 rounded-xl bg-surface p-1 shadow-lg">
      <Icon name="auto_awesome" size={16} className="mx-1.5 text-ai-accent" />
      {primary.map((a) => (
        <button key={a.key} type="button" disabled={!!lockedReason} title={lockedReason} onClick={() => onPick(a.key)} className={btn(a.key === activeKey)}>
          {a.label}
        </button>
      ))}
      <Popover
        label="Thêm công cụ AI"
        align="left"
        panelClassName="w-52"
        trigger={(t) => (
          <button type="button" {...t} disabled={!!lockedReason} title={lockedReason} className={btn(more.some((m) => m.key === activeKey))}>
            Thêm
            <Icon name="expand_more" size={16} />
          </button>
        )}
      >
        {more.map((a) => (
          <button key={a.key} type="button" data-popover-close onClick={() => onPick(a.key)} className="flex w-full items-center rounded-lg px-2.5 py-2 text-left font-body-medium text-body-medium text-[13px] text-text-primary hover:bg-surface-variant">
            {a.label}
          </button>
        ))}
      </Popover>
    </div>
  )
}

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length

export interface RewriteDiffProps {
  original: string
  suggestion: string
  style: string
  onReject: () => void
  onRetry: () => void
  onInsert: () => void
  onAccept: () => void
}

/** Xem trước thay đổi do AI (FR-NOTE-04): bản cũ và mới cạnh nhau, người dùng quyết định. */
export function RewriteDiff({ original, suggestion, style, onReject, onRetry, onInsert, onAccept }: RewriteDiffProps) {
  return (
    <section aria-label="Xem trước thay đổi của AI" className="relative mt-3 overflow-hidden rounded-xl bg-ai-container p-space-md pl-space-lg shadow-md">
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] bg-ai-accent" />
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Icon name="auto_awesome" size={18} className="text-ai-accent" />
        <span className="font-card-title text-card-title text-text-primary">AI đề xuất thay đổi</span>
        <span className="rounded-full bg-surface/80 px-2 py-0.5 font-caption text-caption text-[11px] font-semibold text-ai-accent">{style}</span>
      </div>
      <div className="grid grid-cols-1 gap-3 text-[14px] leading-relaxed">
        <div className="space-y-1 rounded-lg bg-surface/70 p-3">
          <div className="flex items-center justify-between font-caption text-caption text-[11px] font-semibold text-status-error-text">
            <span>Bản hiện tại</span>
            <span className="text-text-secondary">{words(original)} từ</span>
          </div>
          <p className="text-text-secondary line-through decoration-status-error/50">{original}</p>
        </div>
        <div className="space-y-1 rounded-lg bg-surface p-3 shadow-sm">
          <div className="flex items-center justify-between font-caption text-caption text-[11px] font-semibold text-ai-accent">
            <span>Bản AI đề xuất</span>
            <span>{words(suggestion)} từ</span>
          </div>
          <p className="font-medium text-text-primary">{suggestion}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <Button variant="ghost" size="md" icon="refresh" onClick={onRetry}>Thử lại</Button>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="md" onClick={onReject}>Từ chối</Button>
          <Button variant="outline" size="md" className="bg-surface" onClick={onInsert}>Chèn bên dưới</Button>
          <Button size="md" icon="check" onClick={onAccept}>Chấp nhận</Button>
        </div>
      </div>
    </section>
  )
}
