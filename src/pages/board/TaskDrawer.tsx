import { useState } from 'react'
import { Drawer } from '../../components/layout'
import { Avatar, Badge, Button, Checkbox, Icon, IconButton } from '../../components/ui'
import { cn } from '../../lib/cn'
import type { TaskChecklistItem, TaskComment, TaskDetail } from '../../types/board'

export interface TaskDrawerProps {
  detail: TaskDetail
  /** Viewer: edit controls removed or locked. */
  readOnly?: boolean
  onClose: () => void
}

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
          <span className={state[i] ? 'text-text-secondary line-through' : 'text-text-primary'}>{it.text}</span>
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

export function TaskDrawer({ detail, readOnly, onClose }: TaskDrawerProps) {
  const lock = readOnly ? 'Bạn chỉ có quyền xem' : undefined
  const [comment, setComment] = useState('')
  const overdue = detail.due.overdue
  return (
    <Drawer
      header={
        <>
          <div className="flex items-center gap-2">
            <Button variant="tonal" shape="pill" size="sm" iconRight="expand_more" className="text-[13px]" lockedReason={lock}>
              <span className="h-2 w-2 rounded-full bg-brand" />
              <span className="font-semibold">{detail.statusLabel}</span>
            </Button>
            <span className="font-label-mono text-label-mono text-[11px] text-text-secondary">{detail.code}</span>
          </div>
          <div className="flex items-center gap-1 text-text-secondary">
            <IconButton icon="share" label="Chia sẻ liên kết" variant="soft" iconSize={20} />
            <IconButton icon="more_horiz" label="Thêm hành động" variant="soft" iconSize={20} />
            <div className="mx-1 h-4 w-px bg-border" />
            <IconButton icon="close" label="Đóng drawer" variant="soft" iconSize={20} className="hover:bg-error-container hover:text-error" onClick={onClose} />
          </div>
        </>
      }
      footer={
        readOnly ? (
          <div className="flex w-full flex-col items-center justify-between gap-space-sm sm:flex-row">
            <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-variant px-3 py-1.5 text-[12px] text-text-secondary">
              <Icon name="lock" size={16} />
              <span><strong>Chế độ chỉ xem</strong> — Liên hệ Quản trị viên để cấp quyền chỉnh sửa</span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button variant="outline" size="lg" onClick={onClose}>Đóng</Button>
              <Button size="lg" icon="lock" lockedReason={lock}>Lưu thay đổi</Button>
            </div>
          </div>
        ) : (
          <>
            <Button variant="ghost" icon="delete" className="text-error hover:bg-error-container hover:text-error">Xóa task</Button>
            <div className="flex items-center gap-space-sm">
              <Button variant="outline" size="lg" onClick={onClose}>Đóng</Button>
              <Button size="lg" icon="check">Lưu thay đổi</Button>
            </div>
          </>
        )
      }
    >
      <div className="space-y-1">
        <h2 className="font-display-title text-display-title text-[22px] leading-tight text-text-primary">{detail.title}</h2>
        <p className="font-caption text-caption text-text-secondary">{detail.createdNote}</p>
      </div>

      {detail.source && (
        <section className="relative flex flex-col gap-space-sm overflow-hidden rounded-[10px] border border-border bg-surface-variant p-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Icon name="verified" size={18} className="text-brand" />
              <h3 className="font-card-title text-card-title text-[14px] text-text-primary">Nguồn gốc tạo task</h3>
            </div>
            <Badge tone="ai" className="font-semibold">✦ Trích xuất tự động</Badge>
          </div>
          <a href="#" onClick={(e) => e.preventDefault()} className="group inline-flex w-fit items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-text-primary shadow-sm transition-colors hover:bg-surface-container">
            <Icon name="mic" size={18} className="text-recording-red transition-transform group-hover:scale-110" />
            <span className="font-body-medium text-body-medium text-[13px] font-semibold">{detail.source.title}</span>
            <span className="text-text-secondary">·</span>
            <span className="rounded bg-surface-variant px-1.5 py-0.5 font-label-mono text-label-mono text-[12px] font-bold text-brand">{detail.source.location}</span>
            <Icon name="open_in_new" size={16} className="text-text-secondary" />
          </a>
          <div className="mt-1 rounded-lg border-l-2 border-brand bg-surface/80 p-space-sm">
            <p className="font-body-default text-body-default text-[13px] italic leading-relaxed text-text-secondary">{detail.source.quote}</p>
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-space-md rounded-xl border border-border bg-surface p-space-md">
        <MetaItem label="Người phụ trách">
          <Avatar initials={detail.assignee.initials} tone={detail.assignee.tone} size={7} className="font-bold" />
          <span className="font-body-medium text-body-medium text-[13px] text-text-primary">{detail.assignee.name}</span>
        </MetaItem>
        <MetaItem label="Hạn chót">
          <span className={cn('flex items-center gap-1.5 font-medium', overdue ? 'text-status-error-text' : 'text-text-primary')}>
            <Icon name={overdue ? 'event_busy' : 'event'} size={16} />
            <span className="font-body-medium text-body-medium text-[13px]">{detail.due.label}</span>
          </span>
        </MetaItem>
        <MetaItem label="Độ ưu tiên">
          <span className="h-2.5 w-2.5 rounded-full bg-priority-high" />
          <span className="font-body-medium text-body-medium text-[13px] text-text-primary">{detail.priorityLabel}</span>
        </MetaItem>
        <MetaItem label="Nhãn phân loại">
          {detail.labels.map((l) => (
            <Badge key={l.text} tone={l.tone} className={l.tone === 'ai' ? 'font-semibold' : undefined}>{l.text}</Badge>
          ))}
        </MetaItem>
      </div>

      <section className="space-y-space-sm">
        <div className="flex items-center justify-between">
          <h4 className="font-card-title text-card-title text-[15px] text-text-primary">Mô tả công việc</h4>
          {readOnly ? (
            <span className="flex cursor-not-allowed items-center gap-1 font-caption text-caption text-[12px] text-text-secondary/70">
              <Icon name="lock" size={16} className="text-[14px]" />Chỉ xem
            </span>
          ) : (
            <button type="button" className="flex items-center gap-0.5 font-caption text-caption text-[12px] text-brand hover:underline">
              <Icon name="edit" size={16} className="text-[14px]" /> Chỉnh sửa
            </button>
          )}
        </div>
        <div className="space-y-2 font-body-default text-body-default text-[13px] text-text-primary">
          <p className="leading-relaxed text-text-secondary">{detail.description}</p>
          {detail.checklist.length > 0 && <Checklist items={detail.checklist} readOnly={readOnly} />}
        </div>
      </section>

      <section className="space-y-space-md border-t border-border pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-card-title text-card-title text-[15px] text-text-primary">Trao đổi &amp; Bình luận</h4>
            <Badge mono>{detail.comments.length}</Badge>
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
                placeholder="Viết bình luận hoặc gắn thẻ @thành viên..."
                className="w-full resize-none bg-transparent p-2.5 font-body-default text-body-default text-[13px] text-text-primary placeholder:text-text-secondary focus:outline-none"
              />
              <div className="flex items-center justify-between border-t border-border/40 bg-surface-variant/50 px-2.5 py-1.5">
                <div className="flex items-center gap-1 text-text-secondary">
                  <IconButton icon="attach_file" label="Đính kèm" iconSize={16} />
                  <IconButton icon="alternate_email" label="Nhắc thành viên" iconSize={16} />
                  <IconButton icon="auto_awesome" label="Trợ lý AI" iconSize={16} className="hover:text-ai-accent" />
                </div>
                <Button size="xs" onClick={() => setComment('')}>Gửi</Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </Drawer>
  )
}
