import { Button, Icon } from '../../components/ui'
import { cn } from '../../lib/cn'
import { aiActions } from '../../mocks/notes'

export function FloatingAiMenu({ activeKey, onPick, lockedReason }: { activeKey: string; onPick: (key: string) => void; lockedReason?: string }) {
  return (
    <div role="toolbar" aria-label="AI Nhanh" className="absolute bottom-full left-4 right-4 z-40 mb-2 flex animate-fade-in flex-wrap items-center gap-1 rounded-xl bg-surface/95 p-1.5 shadow-xl backdrop-blur-md">
      <div className="flex shrink-0 items-center gap-1 px-1.5 py-0.5 font-caption text-caption text-[11px] font-bold text-ai-accent"><span className="text-[14px]">✦</span><span>AI Nhanh:</span></div>
      {aiActions.map((a) => (
        <button
          key={a.key}
          type="button"
          disabled={!!lockedReason}
          title={lockedReason}
          onClick={() => onPick(a.key)}
          className={cn(
            'flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-1.5 font-body-medium text-body-medium text-[12px] transition-colors disabled:cursor-not-allowed disabled:opacity-50',
            a.key === activeKey ? 'bg-ai-container font-semibold text-ai-accent hover:bg-secondary-fixed' : 'text-text-primary hover:bg-surface-variant',
          )}
        >
          <span>✦</span> {a.label}
        </button>
      ))}
    </div>
  )
}

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length

export interface RewriteDiffProps {
  original: string
  suggestion: string
  style: string
  onCancel: () => void
  onInsert: () => void
  onReplace: () => void
}

export function RewriteDiff({ original, suggestion, style, onCancel, onInsert, onReplace }: RewriteDiffProps) {
  return (
    <div className="relative mt-3 overflow-hidden rounded-xl bg-ai-container p-5 pl-6 shadow-md">
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] bg-ai-accent" />
      <div className="mb-3.5 flex items-center justify-between pb-3.5">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ai-accent text-[12px] font-bold text-on-primary">✦</div>
          <div>
            <span className="font-card-title text-card-title text-[14px] text-text-primary">Gợi ý viết lại từ AI</span>
            <span className="ml-2 inline-block rounded-full bg-surface/80 px-2 py-0.5 font-caption text-caption text-[10px] font-semibold text-ai-accent">Phong cách: {style}</span>
          </div>
        </div>
        <span className="font-caption text-caption text-[11px] text-text-secondary">Nhấn Esc để đóng</span>
      </div>
      <div className="grid grid-cols-1 gap-4 text-[13.5px] leading-relaxed 2xl:grid-cols-2">
        <div className="space-y-1.5 rounded-lg bg-surface/70 p-3.5">
          <div className="flex items-center justify-between font-caption text-caption text-[11px] font-semibold text-status-error">
            <span className="flex items-center gap-1"><Icon name="remove_circle" size={16} className="text-[14px]" />BẢN GỐC HIỆN TẠI</span>
            <span className="font-label-mono text-[10px] text-text-secondary">{words(original)} từ</span>
          </div>
          <p className="text-text-secondary line-through opacity-90">{original}</p>
        </div>
        <div className="relative space-y-1.5 overflow-hidden rounded-lg bg-surface p-3.5 shadow-sm">
          <div className="pointer-events-none absolute right-0 top-0 h-12 w-12 rounded-bl-full bg-ai-accent/10" />
          <div className="flex items-center justify-between font-caption text-caption text-[11px] font-semibold text-ai-accent">
            <span className="flex items-center gap-1"><Icon name="add_circle" size={16} className="text-[14px]" />GỢI Ý CẢI TIẾN CHUYÊN NGHIỆP</span>
            <span className="font-label-mono text-[10px] font-bold text-ai-accent">{words(suggestion)} từ · Rõ ràng</span>
          </div>
          <p className="font-medium text-text-primary">{suggestion}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between pt-3">
        <div className="flex items-center gap-1.5 font-caption text-caption text-[11px] text-text-secondary"><Icon name="info" size={16} className="text-ai-accent" /><span>Tuân thủ nguyên tắc: Con người quyết định trước khi áp dụng.</span></div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="md" onClick={onCancel}>Hủy bỏ</Button>
          <Button variant="outline" size="md" className="bg-surface shadow-sm" onClick={onInsert}>Chèn bên dưới</Button>
          <Button size="md" icon="check" className="px-4 font-semibold" onClick={onReplace}>Thay thế bản gốc</Button>
        </div>
      </div>
    </div>
  )
}
