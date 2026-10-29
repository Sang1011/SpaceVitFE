import { cn } from '../../lib/cn'
import { formatDate } from '../../lib/format'
import { priorityLabelVi } from '../../lib/terms'
import { Checkbox, Icon, type Priority } from '../ui'
import { SourceChip, type SourceChipProps } from './SourceChip'

export interface SuggestionPatch {
  priority?: Priority
  assignee?: string
  due?: string
}

export interface AiSuggestionCardProps {
  title: string
  priority: Priority
  /** Tên người phụ trách; rỗng nếu chưa gán. */
  assignee: string
  /** Hạn dạng yyyy-MM-dd; rỗng nếu chưa có. */
  due: string
  /** Người/hạn do AI suy ra từ lời thoại: hiện nhãn "AI đoán" cho tới khi người dùng sửa. */
  inferred?: { assignee?: boolean; due?: boolean }
  source?: Pick<SourceChipProps, 'kind' | 'label' | 'location'>
  onSourceClick?: () => void
  /** Danh sách người có thể gán. */
  members: string[]
  selected: boolean
  onSelectedChange: (v: boolean) => void
  onChange: (patch: SuggestionPatch) => void
  /** Viewer: không chọn, không sửa. */
  readOnly?: boolean
  className?: string
}

const prios: Priority[] = ['urgent', 'high', 'medium', 'low']
const field =
  'h-8 min-w-0 rounded-lg border border-border-strong bg-surface-variant px-2 font-body-medium text-body-medium text-[13px] text-text-primary outline-none focus:ring-2 focus:ring-brand disabled:cursor-not-allowed disabled:opacity-60'

function Hint({ show }: { show?: boolean }) {
  return show ? <span className="shrink-0 rounded bg-ai-container px-1.5 py-0.5 font-caption text-caption text-[11px] font-semibold text-ai-accent">AI đoán</span> : null
}

/**
 * Việc do AI đề xuất, chưa phải dữ liệu chính thức (viền nét đứt tím). Duyệt bằng ô tick và thanh hành động
 * của danh sách (D10); người, hạn, độ ưu tiên sửa ngay trên thẻ.
 */
export function AiSuggestionCard({ title, priority, assignee, due, inferred, source, onSourceClick, members, selected, onSelectedChange, onChange, readOnly, className }: AiSuggestionCardProps) {
  return (
    <div className={cn('rounded-xl border-[1.5px] border-dashed border-ai-accent bg-surface p-space-md shadow-sm', selected && 'bg-ai-container/40', className)}>
      <div className="flex items-start gap-space-sm">
        <Checkbox tone="ai" className="mt-1" checked={selected} disabled={readOnly} onChange={(e) => onSelectedChange(e.target.checked)} aria-label={`Chọn: ${title}`} />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-start gap-1.5">
            <Icon name="lightbulb" size={18} className="mt-0.5 shrink-0 text-ai-accent" />
            <h3 className="font-card-title text-card-title leading-tight text-text-primary">{title}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <select aria-label={`Độ ưu tiên: ${title}`} value={priority} disabled={readOnly} onChange={(e) => onChange({ priority: e.target.value as Priority })} className={field}>
              {prios.map((p) => (
                <option key={p} value={p}>{priorityLabelVi[p]}</option>
              ))}
            </select>
            <span className="flex items-center gap-1.5">
              <select aria-label={`Người phụ trách: ${title}`} value={assignee} disabled={readOnly} onChange={(e) => onChange({ assignee: e.target.value })} className={cn(field, 'max-w-[11rem]')}>
                <option value="">Chưa gán</option>
                {members.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <Hint show={inferred?.assignee} />
            </span>
            <span className="flex items-center gap-1.5">
              <input
                type="date"
                aria-label={`Hạn: ${title}`}
                value={due}
                disabled={readOnly}
                onChange={(e) => onChange({ due: e.target.value })}
                title={due ? formatDate(due) : 'Chưa có hạn'}
                className={field}
              />
              <Hint show={inferred?.due} />
            </span>
          </div>
          {source && <SourceChip {...source} onClick={onSourceClick} />}
        </div>
      </div>
    </div>
  )
}
