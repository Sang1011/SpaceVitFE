import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, Button, Icon, IconButton, PriorityChip } from '../../components/ui'
import { cn } from '../../lib/cn'
import { reminderChannels, type ChatMessage, type ReminderChannel, type TaskRow } from '../../mocks/assistant'

type Of<K extends string> = Extract<ChatMessage, { kind: K }>

export function UserBubble({ text, time, initials }: { text: string; time: string; initials: string }) {
  return (
    <div className="ml-auto flex max-w-3xl items-start justify-end gap-3">
      <div className="rounded-2xl rounded-tr-sm bg-primary-container px-4 py-3 font-body-default text-body-default text-on-primary shadow-sm">
        <p>{text}</p>
        <div className="mt-1.5 text-right font-caption text-[11px] text-on-primary">{time}</div>
      </div>
      <Avatar initials={initials} size={8} tone="muted" />
    </div>
  )
}

/** Vỏ chung cho các câu trả lời của AI: nền trắng, không tô tím cả khối. */
export function AiBubble({ label, time, children }: { label: ReactNode; time: string; children: ReactNode }) {
  return (
    <div className="mr-auto flex max-w-4xl items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ai-container text-ai-accent">
        <Icon name="auto_awesome" size={18} />
      </div>
      <div className="min-w-0 flex-1 space-y-3 rounded-2xl rounded-tl-sm bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2 font-caption text-caption text-text-secondary">
          <span className="font-semibold text-text-primary">{label}</span>
          <span>{time}</span>
        </div>
        {children}
      </div>
    </div>
  )
}

/** Trợ lý đang trả lời. */
export function ThinkingBubble() {
  return (
    <div role="status" className="mr-auto flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ai-container text-ai-accent">
        <Icon name="auto_awesome" size={18} />
      </div>
      <span className="flex items-center gap-2 rounded-2xl bg-surface px-4 py-2.5 font-body-default text-body-default text-text-secondary shadow-sm">
        Đang tìm trong không gian của bạn
        <span aria-hidden="true" className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1.5 w-1.5 animate-pulse rounded-full bg-ai-accent" style={{ animationDelay: `${i * 200}ms` }} />
          ))}
        </span>
      </span>
    </div>
  )
}

const citeIcon = { audio: { n: 'mic', c: 'text-recording-red', to: '/ghi-am/demo' }, note: { n: 'description', c: 'text-brand', to: '/ghi-chu' }, document: { n: 'description', c: 'text-text-secondary', to: '/tai-lieu' } } as const

export function RagAnswer({ m }: { m: Of<'rag'> }) {
  return (
    <AiBubble label="Trợ lý AI" time={m.time}>
      <div className="space-y-2 font-body-default text-body-default text-text-primary">
        <p className="font-medium">{m.lead}</p>
        <ol className="list-inside list-decimal space-y-2 pl-1">
          {m.points.map((p) => (
            <li key={p.bold} className="leading-relaxed">
              <span className="font-medium">{p.bold}</span>
              {p.rest}
              {p.cites.map((n) => (
                <a key={n} href={`#${m.id}-src-${n}`} aria-label={`Nguồn ${n}`} className="ml-0.5 align-super font-caption text-[11px] font-semibold text-brand hover:underline">
                  [{n}]
                </a>
              ))}
            </li>
          ))}
        </ol>
      </div>
      {m.citations.length > 0 && (
        <div className="space-y-2 border-t border-border/50 pt-3">
          <p className="font-caption text-caption font-semibold text-text-primary">Dựa trên {m.citations.length} nguồn</p>
          <ul className="flex flex-wrap gap-2">
            {m.citations.map((c, i) => (
              <li key={c.id} id={`${m.id}-src-${i + 1}`}>
                <Link to={citeIcon[c.kind].to} className="inline-flex items-center gap-1.5 rounded-full bg-surface-variant px-3 py-1.5 font-body-medium text-body-medium text-[13px] text-text-primary outline-none transition-colors hover:bg-brand/10 hover:text-brand focus-visible:ring-2 focus-visible:ring-brand">
                  <span className="font-semibold text-brand">[{i + 1}]</span>
                  <Icon name={citeIcon[c.kind].n} size={16} className={citeIcon[c.kind].c} />
                  <span>{c.label}</span>
                  <span className="text-text-secondary">· {c.location}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex items-center justify-between pt-1">
        <span className="font-caption text-caption text-text-secondary">Do AI tổng hợp, hãy kiểm tra với nguồn trước khi dùng.</span>
        <div className="flex items-center gap-1">
          <IconButton icon="content_copy" label="Sao chép câu trả lời" variant="soft" iconSize={18} />
          <IconButton icon="thumb_up" label="Câu trả lời hữu ích" variant="soft" iconSize={18} className="hover:text-status-success-text" />
          <IconButton icon="thumb_down" label="Báo câu trả lời chưa chính xác" variant="soft" iconSize={18} className="hover:text-status-error-text" />
        </div>
      </div>
    </AiBubble>
  )
}

export function DataAnswer({ m, selectedId, onOpenRow }: { m: Of<'data'>; selectedId?: string | null; onOpenRow: (row: TaskRow) => void }) {
  return (
    <AiBubble label="Dữ liệu trực tiếp từ Bảng công việc" time={m.time}>
      <p className="font-body-default text-body-default text-text-secondary">
        Có <span className="font-semibold text-status-error-text">{m.intro.count} việc</span> {m.intro.text}
      </p>
      <div className="overflow-x-auto rounded-xl border border-border/60">
        <table className="w-full min-w-[760px] text-left font-body-default text-body-default">
          <thead>
            <tr className="bg-surface-variant font-caption text-caption text-text-secondary">
              {['Việc', 'Người phụ trách', 'Hạn', 'Ưu tiên', 'Nguồn'].map((h) => (
                <th key={h} scope="col" className={cn('whitespace-nowrap px-4 py-2.5 font-semibold', h === 'Việc' && 'w-[38%]')}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {m.rows.map((r) => (
              <tr key={r.id} onClick={() => onOpenRow(r)} className={cn('cursor-pointer border-t border-border/50 bg-surface transition-colors hover:bg-surface-variant/70', selectedId === r.id && 'bg-primary-fixed/30')}>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenRow(r)
                    }}
                    aria-label={`Xem chi tiết: ${r.title}`}
                    className="rounded text-left font-medium text-text-primary outline-none hover:text-brand focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    {r.title}
                  </button>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="flex items-center gap-2"><Avatar initials={r.assignee.initials} size={6} tone="brand-muted" />{r.assignee.name}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className={cn('inline-flex items-center gap-1', r.due.overdue ? 'font-semibold text-status-error-text' : 'text-text-primary')}>
                    <Icon name={r.due.icon} size={16} />
                    {r.due.label}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3"><PriorityChip level={r.priority} /></td>
                <td className="whitespace-nowrap px-4 py-3 text-text-secondary">
                  <span className="inline-flex items-center gap-1">
                    <Icon name={r.source.kind === 'audio' ? 'mic' : 'article'} size={16} className={cn(r.source.kind === 'audio' && 'text-recording-red')} />
                    {r.source.label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-caption text-caption text-text-secondary">
        <span>{m.note}. Bấm một dòng để xem chi tiết.</span>
        <Link to="/bang-cong-viec">
          <Button variant="subtle" size="xs" icon="open_in_new" className="text-text-primary">Mở Bảng công việc</Button>
        </Link>
      </div>
    </AiBubble>
  )
}

export interface ActionProposalProps {
  m: Of<'action'>
  canEdit: boolean
  onConfirm: () => void
  onCancel: () => void
  onUndo: () => void
  onChannel: (c: ReminderChannel) => void
}

export function ActionProposal({ m, canEdit, onConfirm, onCancel, onUndo, onChannel }: ActionProposalProps) {
  const pending = m.state === 'pending'
  return (
    <AiBubble label="AI đề xuất, cần bạn xác nhận" time={m.time}>
      <p className="font-body-default text-body-default text-text-secondary">{m.intro}</p>
      <div className={cn('space-y-3 rounded-xl p-4 transition-colors', pending ? 'border-[1.5px] border-dashed border-ai-accent bg-surface' : 'border border-border bg-surface-variant/50')}>
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 font-card-title text-card-title text-text-primary">
            <Icon name="notification_add" size={20} className="text-ai-accent" />
            Nhắc nhở mới
          </h3>
          <span className={cn('rounded-md px-2 py-0.5 font-caption text-caption font-semibold', m.state === 'confirmed' ? 'bg-status-success/15 text-status-success-text' : m.state === 'cancelled' ? 'bg-surface-variant text-text-secondary' : 'bg-ai-container text-ai-accent')}>
            {m.state === 'confirmed' ? 'Đã tạo' : m.state === 'cancelled' ? 'Đã hủy' : 'Chờ xác nhận'}
          </span>
        </div>
        <dl className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Nội dung"><p className="font-body-medium text-body-medium font-semibold text-text-primary">{m.proposal.content}</p></Field>
          <Field label="Thời gian"><p className="flex items-center gap-1 font-body-medium text-body-medium font-semibold text-brand"><Icon name="event" size={16} />{m.proposal.when}</p></Field>
          <Field label="Kênh nhắc">
            <select
              aria-label="Kênh nhắc"
              value={m.proposal.channel}
              disabled={!pending || !canEdit}
              onChange={(e) => onChannel(e.target.value as ReminderChannel)}
              className="h-9 rounded-lg border border-border-strong bg-surface-variant px-2 font-body-medium text-body-medium text-text-primary outline-none focus:ring-2 focus:ring-brand disabled:cursor-not-allowed disabled:opacity-70"
            >
              {reminderChannels.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </Field>
          <Field label="Không gian"><p className="flex items-center gap-1 font-body-medium text-body-medium text-text-primary"><Icon name="folder_supervised" size={16} className="text-text-secondary" />{m.proposal.space}</p></Field>
        </dl>
        {pending && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <Button size="lg" icon="check_circle" onClick={onConfirm} lockedReason={canEdit ? undefined : 'Bạn chỉ có quyền xem'}>Xác nhận tạo nhắc nhở</Button>
            <Button variant="ghost" size="lg" onClick={onCancel} className="hover:text-status-error-text">Hủy đề xuất</Button>
          </div>
        )}
        {m.state === 'confirmed' && (
          <div role="status" className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-status-success/10 px-3 py-2 font-body-medium text-body-medium text-status-success-text">
            <span className="flex items-center gap-1.5"><Icon name="check_circle" size={18} fill />Đã thêm vào Lịch &amp; Nhắc nhở</span>
            <span className="flex items-center gap-1">
              <Link to="/lich-nhac-nho"><Button variant="subtle" size="xs" icon="calendar_today" className="text-text-primary">Xem trong Lịch</Button></Link>
              <Button variant="ghost" size="xs" icon="undo" onClick={onUndo} lockedReason={canEdit ? undefined : 'Bạn chỉ có quyền xem'}>Hoàn tác</Button>
            </span>
          </div>
        )}
      </div>
      <p className="flex items-center gap-1.5 font-caption text-caption text-text-secondary"><Icon name="lock" size={16} />AI không tự tạo gì khi bạn chưa xác nhận.</p>
    </AiBubble>
  )
}

export function ErrorMessage({ m, onRetry, locked }: { m: Of<'error'>; onRetry: () => void; locked?: string }) {
  return (
    <div role="alert" className="mr-auto flex max-w-4xl items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-status-error/15 text-status-error-text"><Icon name="error" size={18} /></div>
      <div className="flex flex-1 flex-wrap items-center justify-between gap-3 rounded-2xl rounded-tl-sm border border-status-error/30 bg-status-error/10 p-4">
        <p className="font-body-default text-body-default text-text-primary">{m.text}</p>
        <Button variant="destructive-outline" size="md" icon="refresh" onClick={onRetry} lockedReason={locked}>Thử lại</Button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="space-y-1"><dt className="font-caption text-caption text-text-secondary">{label}</dt><dd>{children}</dd></div>
}
