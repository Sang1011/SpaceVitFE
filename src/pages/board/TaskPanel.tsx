import { useEffect, useRef, useState } from 'react'
import { Avatar, Badge, Button, Checkbox, Icon, IconButton, Popover, SidePanel, useToast } from '../../components/ui'
import type { Priority } from '../../components/ui'
import { cn } from '../../lib/cn'
import { priorityLabelVi } from '../../lib/terms'
import { statusByColumn } from '../../mocks/board'
import type { ColumnKey, TaskChecklistItem, TaskComment, TaskDetail } from '../../types/board'

export interface TaskPatch {
  title?: string
  description?: string
  priority?: Priority | undefined
}

export interface TaskPanelProps {
  detail: TaskDetail
  status: ColumnKey
  priority?: Priority
  /** Viewer: ô nhập bị khóa, không có xóa. */
  readOnly?: boolean
  /** Việc vừa tạo: đưa con trỏ vào ô tiêu đề. */
  focusTitle?: boolean
  onChange: (patch: TaskPatch) => void
  onMove: (to: ColumnKey) => void
  onDelete: () => void
  onOpenSource: () => void
  onClose: () => void
}

type SaveState = 'idle' | 'saving' | 'saved'

function MetaItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-caption text-caption text-[12px] text-text-secondary">{label}</span>
      <div className="mt-0.5 flex flex-wrap items-center gap-1.5">{children}</div>
    </div>
  )
}

function Checklist({ items, readOnly }: { items: TaskChecklistItem[]; readOnly?: boolean }) {
  const [state, setState] = useState(items.map((i) => i.done))
  return (
    <div className="space-y-2 rounded-xl bg-surface-variant/40 p-space-sm">
      {items.map((it, i) => (
        <div key={it.text} className="flex items-start gap-2">
          <Checkbox className="mt-1" checked={state[i]} disabled={readOnly} onChange={(e) => setState(state.map((v, j) => (j === i ? e.target.checked : v)))} aria-label={it.text} />
          <span className={state[i] ? 'text-text-secondary' : 'text-text-primary'}>{it.text}</span>
        </div>
      ))}
    </div>
  )
}

function Comment({ c }: { c: TaskComment }) {
  return (
    <div className="flex items-start gap-space-sm">
      <Avatar initials={c.author.initials} tone={c.author.tone} size={8} className="font-bold" />
      <div className="flex-1 space-y-1 rounded-xl bg-surface-variant p-space-sm text-[13px]">
        <div className="flex items-center justify-between">
          <span className="font-card-title text-card-title text-[12px] text-text-primary">{c.authorLabel}</span>
          <span className="font-caption text-caption text-[11px] text-text-secondary">{c.time}</span>
        </div>
        <p className="font-body-default text-body-default leading-normal text-text-primary">{c.text}</p>
      </div>
    </div>
  )
}

const prios: Priority[] = ['urgent', 'high', 'medium', 'low']
const statusKeys = Object.keys(statusByColumn) as ColumnKey[]

/** Panel chi tiết việc, gắn cạnh bảng (D4). Tự động lưu (D5): không có nút Lưu. */
export function TaskPanel({ detail, status, priority, readOnly, focusTitle, onChange, onMove, onDelete, onOpenSource, onClose }: TaskPanelProps) {
  const { toast } = useToast()
  const [comment, setComment] = useState('')
  const [save, setSave] = useState<SaveState>('idle')
  const [files, setFiles] = useState(detail.attachments)
  const [showHistory, setShowHistory] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const fileInput = useRef<HTMLInputElement>(null)
  const overdue = detail.due.overdue

  useEffect(() => () => window.clearTimeout(timer.current), [])

  /** Giả lập lưu: hiện "Đang lưu..." rồi "Đã lưu" sau khi người dùng ngừng gõ. */
  const touch = () => {
    setSave('saving')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setSave('saved'), 700)
  }
  const edit = (patch: TaskPatch) => {
    onChange(patch)
    touch()
  }

  return (
    <SidePanel
      open
      onClose={onClose}
      title={`Chi tiết việc ${detail.code}`}
      className="dock:sticky dock:top-[72px] dock:h-[calc(100vh-88px)] dock:self-start"
      header={
        <div className="flex min-w-0 items-center gap-2">
          <Popover
            label="Đổi trạng thái"
            align="left"
            panelClassName="w-48"
            trigger={(p) => (
              <Button {...p} variant="tonal" shape="pill" size="sm" iconRight="expand_more" lockedReason={readOnly ? 'Bạn chỉ có quyền xem' : undefined}>
                <span className="font-semibold">{statusByColumn[status]}</span>
              </Button>
            )}
          >
            <ul>
              {statusKeys.map((k) => (
                <li key={k}>
                  <button
                    type="button"
                    data-popover-close
                    onClick={() => onMove(k)}
                    className={cn('flex w-full items-center justify-between rounded-lg px-2 py-2 text-left font-body-medium text-body-medium outline-none hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-brand', k === status ? 'font-semibold text-brand' : 'text-text-primary')}
                  >
                    {statusByColumn[k]}
                    {k === status && <Icon name="check" size={18} />}
                  </button>
                </li>
              ))}
            </ul>
          </Popover>
          <span className="shrink-0 font-label-mono text-label-mono text-[11px] text-text-secondary">{detail.code}</span>
          <span aria-live="polite" className="shrink-0 font-caption text-caption text-text-secondary">
            {save === 'saving' ? 'Đang lưu...' : save === 'saved' ? 'Đã lưu' : ''}
          </span>
          <div className="ml-auto flex shrink-0 items-center gap-0.5">
            <IconButton
              icon="link"
              label="Sao chép liên kết"
              variant="soft"
              onClick={() => {
                void navigator.clipboard?.writeText(window.location.href)
                toast({ message: 'Đã sao chép liên kết tới việc này', tone: 'success' })
              }}
            />
            <Popover
              label="Thêm hành động"
              panelClassName="w-48"
              trigger={(p) => <IconButton {...p} icon="more_horiz" label="Thêm hành động" variant="soft" />}
            >
              <button
                type="button"
                data-popover-close
                disabled={readOnly}
                onClick={onDelete}
                className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left font-body-medium text-body-medium text-status-error-text outline-none hover:bg-status-error/10 focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon name="delete" size={20} />
                Xóa việc
              </button>
            </Popover>
          </div>
        </div>
      }
    >
      {readOnly && (
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-variant px-3 py-1.5 text-[12px] text-text-secondary">
          <Icon name="lock" size={16} />
          <span><strong>Chế độ chỉ xem.</strong> Liên hệ quản trị viên để được cấp quyền chỉnh sửa.</span>
        </div>
      )}

      <div className="space-y-1">
        <textarea
          autoFocus={focusTitle}
          rows={1}
          value={detail.title}
          readOnly={readOnly}
          aria-label="Tiêu đề việc"
          onChange={(e) => edit({ title: e.target.value.replace(/\n/g, ' ') })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault()
          }}
          className="w-full resize-none rounded-lg bg-transparent px-1 py-0.5 font-display-title text-display-title text-[22px] leading-tight text-text-primary outline-none [field-sizing:content] hover:bg-surface-variant focus:bg-surface-variant focus:ring-2 focus:ring-brand"
        />
        <p className="px-1 font-caption text-caption text-text-secondary">{detail.createdNote}</p>
      </div>

      {detail.source && (
        <section className="flex flex-col gap-space-sm rounded-[10px] border border-border bg-surface-variant p-space-md" aria-label="Nguồn">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Icon name="verified" size={18} className="text-brand" />
              <h3 className="font-card-title text-card-title text-[14px] text-text-primary">Nguồn</h3>
            </div>
            <Badge tone="ai" className="font-semibold">Tạo từ AI</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex min-w-0 items-center gap-2 rounded-full bg-surface px-3 py-1.5 shadow-sm">
              <Icon name="mic" size={18} className="shrink-0 text-recording-red" />
              <span className="truncate font-body-medium text-body-medium text-[13px] font-semibold text-text-primary">{detail.source.title}</span>
              <span className="shrink-0 rounded bg-surface-variant px-1.5 py-0.5 font-caption text-caption text-[12px] font-semibold text-brand">{detail.source.location}</span>
            </span>
            <Button variant="outline" size="xs" iconRight="open_in_new" onClick={onOpenSource}>Mở đoạn gốc</Button>
          </div>
          <blockquote className="rounded-lg border-l-2 border-brand bg-surface/80 p-space-sm font-body-default text-body-default text-[13px] italic leading-relaxed text-text-secondary">{detail.source.quote}</blockquote>
        </section>
      )}

      <div className="grid grid-cols-2 gap-space-md rounded-xl border border-border bg-surface p-space-md">
        <MetaItem label="Người phụ trách">
          <Avatar initials={detail.assignee.initials} tone={detail.assignee.tone} size={7} className="font-bold" />
          <span className="font-body-medium text-body-medium text-[13px] text-text-primary">{detail.assignee.name}</span>
        </MetaItem>
        <MetaItem label="Hạn chót">
          <span className={cn('flex items-center gap-1.5 font-medium', overdue ? 'text-status-warning-text' : 'text-text-primary')}>
            <Icon name={overdue ? 'event_busy' : 'event'} size={16} />
            <span className="font-body-medium text-body-medium text-[13px]">{detail.due.label}</span>
          </span>
        </MetaItem>
        <MetaItem label="Độ ưu tiên">
          <select
            aria-label="Độ ưu tiên"
            value={priority ?? ''}
            disabled={readOnly}
            onChange={(e) => edit({ priority: (e.target.value || undefined) as Priority | undefined })}
            className="h-8 rounded-lg border border-border-strong bg-surface-variant px-2 font-body-medium text-body-medium text-[13px] text-text-primary outline-none focus:ring-2 focus:ring-brand disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">Chưa đặt</option>
            {prios.map((p) => (
              <option key={p} value={p}>{priorityLabelVi[p]}</option>
            ))}
          </select>
        </MetaItem>
        <MetaItem label="Nhãn phân loại">
          {detail.labels.length === 0 && <span className="font-caption text-caption text-text-secondary">Chưa có nhãn</span>}
          {detail.labels.map((l) => (
            <Badge key={l.text} tone={l.tone} className={l.tone === 'ai' ? 'font-semibold' : undefined}>{l.text}</Badge>
          ))}
        </MetaItem>
      </div>

      <section className="space-y-space-sm">
        <h4 className="font-card-title text-card-title text-[15px] text-text-primary">Mô tả</h4>
        <textarea
          rows={4}
          value={detail.description}
          readOnly={readOnly}
          aria-label="Mô tả việc"
          onChange={(e) => edit({ description: e.target.value })}
          className="w-full resize-y rounded-xl border border-border bg-surface p-2.5 font-body-default text-body-default text-[13px] leading-relaxed text-text-primary outline-none focus:ring-2 focus:ring-brand"
        />
        {detail.checklist.length > 0 && <Checklist items={detail.checklist} readOnly={readOnly} />}
      </section>

      <section className="space-y-space-sm border-t border-border pt-2">
        <div className="flex items-center justify-between">
          <h4 className="font-card-title text-card-title text-[15px] text-text-primary">Đính kèm ({files.length})</h4>
          <Button
            variant="outline"
            size="xs"
            icon="attach_file"
            lockedReason={readOnly ? 'Bạn chỉ có quyền xem' : undefined}
            onClick={() => fileInput.current?.click()}
          >
            Thêm tệp
          </Button>
          <input
            ref={fileInput}
            type="file"
            multiple
            hidden
            onChange={(e) => {
              const added = [...(e.target.files ?? [])].map((f) => ({ name: f.name, size: `${Math.max(1, Math.round(f.size / 1024))} KB` }))
              if (added.length) {
                setFiles((cur) => [...cur, ...added])
                touch()
              }
              e.target.value = ''
            }}
          />
        </div>
        {files.length === 0 ? (
          <p className="font-caption text-caption text-text-secondary">Chưa có tệp đính kèm.</p>
        ) : (
          <ul className="space-y-1">
            {files.map((f) => (
              <li key={f.name} className="flex items-center gap-2 rounded-lg bg-surface-variant px-2.5 py-1.5 font-body-default text-body-default text-[13px] text-text-primary">
                <Icon name="description" size={18} className="shrink-0 text-text-secondary" />
                <span className="min-w-0 flex-1 truncate">{f.name}</span>
                <span className="shrink-0 font-caption text-caption text-text-secondary">{f.size}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-space-md border-t border-border pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-card-title text-card-title text-[15px] text-text-primary">Trao đổi</h4>
            <Badge>{detail.comments.length}</Badge>
          </div>
          <span className="font-caption text-caption text-text-secondary">{detail.lastActivity}</span>
        </div>
        <div className="space-y-space-md">
          {detail.comments.map((c) => (
            <Comment key={c.time} c={c} />
          ))}
        </div>
        {!readOnly && (
          <div className="flex items-start gap-space-sm pt-2">
            <Avatar initials="NA" tone="container" size={8} className="font-bold" />
            <div className="relative flex-1 overflow-hidden rounded-xl border border-border bg-surface focus-within:ring-2 focus-within:ring-brand">
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                aria-label="Viết bình luận"
                placeholder="Viết bình luận hoặc gắn thẻ @thành viên..."
                className="w-full resize-none bg-transparent p-2.5 font-body-default text-body-default text-[13px] text-text-primary placeholder:text-text-secondary focus:outline-none"
              />
              <div className="flex items-center justify-end border-t border-border/40 bg-surface-variant/50 px-2.5 py-1.5">
                <Button size="xs" disabled={!comment.trim()} onClick={() => setComment('')}>Gửi</Button>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="border-t border-border pt-2">
        <button
          type="button"
          aria-expanded={showHistory}
          onClick={() => setShowHistory((o) => !o)}
          className="flex w-full items-center justify-between rounded-lg py-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <span className="font-card-title text-card-title text-[15px] text-text-primary">Lịch sử thay đổi ({detail.history.length})</span>
          <Icon name={showHistory ? 'expand_less' : 'expand_more'} size={20} className="text-text-secondary" />
        </button>
        {showHistory && (
          <ol className="mt-2 space-y-2">
            {detail.history.map((h, i) => (
              <li key={i} className="font-body-default text-body-default text-[13px] text-text-primary">
                <strong className="font-semibold">{h.who}</strong> {h.text}
                <span className="block font-caption text-caption text-text-secondary">{h.time}</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </SidePanel>
  )
}
