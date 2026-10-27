import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, Badge, Button, Icon, IconButton, PriorityDot } from '../../components/ui'
import { AiContainer } from '../../components/domain'
import { priorityLabelVi } from '../../lib/terms'
import { cn } from '../../lib/cn'
import type { ChatMessage } from '../../mocks/assistant'

type Of<K extends string> = Extract<ChatMessage, { kind: K }>

export function UserBubble({ text, time, initials }: { text: string; time: string; initials: string }) {
  return (
    <div className="ml-auto flex max-w-3xl items-start justify-end gap-3">
      <div className="rounded-2xl rounded-tr-sm bg-primary-container px-4 py-3 font-body-default text-body-default text-on-primary shadow-sm">
        <p>{text}</p>
        <div className="mt-1.5 text-right font-label-mono text-[10px] text-on-primary">{time} · Bạn</div>
      </div>
      <Avatar initials={initials} size={8} tone="muted" />
    </div>
  )
}

/** Shell shared by the 3 AI answer shapes: AI avatar + white bubble. */
export function AiBubble({ header, time, children }: { header: ReactNode; time: string; children: ReactNode }) {
  return (
    <div className="mr-auto flex max-w-4xl items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ai-container text-ai-accent">
        <Icon name="auto_awesome" size={18} />
      </div>
      <div className="min-w-0 flex-1 space-y-4 rounded-2xl rounded-tl-sm bg-surface p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">{header}</div>
          <span className="font-label-mono text-label-mono text-[11px] text-text-secondary">{time}</span>
        </div>
        {children}
      </div>
    </div>
  )
}

const citeIcon = { audio: { n: 'mic', c: 'text-recording-red' }, note: { n: 'description', c: 'text-brand' }, document: { n: 'description', c: 'text-text-secondary' } } as const

export function RagAnswer({ m }: { m: Of<'rag'> }) {
  return (
    <AiBubble time={m.time} header={<><Badge tone="ai" size="md" bold className="gap-1"><span>✦</span> Trợ lý AI</Badge><span className="font-caption text-caption text-text-secondary">Tổng hợp từ tri thức nội bộ</span></>}>
      <AiContainer size="sm" className="pl-space-lg">
        <div className="space-y-3 font-body-default text-body-default text-text-primary">
          <p className="font-medium">{m.lead}</p>
          <ol className="list-inside list-decimal space-y-2 pl-1">
            {m.points.map((p) => (
              <li key={p.bold} className="leading-relaxed"><span className="font-medium">{p.bold}</span>{p.rest}</li>
            ))}
          </ol>
        </div>
      </AiContainer>
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between font-caption text-caption text-text-secondary">
          <span className="flex items-center gap-1 font-semibold text-text-primary"><Icon name="menu_book" size={16} className="text-ai-accent" /> Nguồn trích dẫn trực tiếp:</span>
          <button type="button" className="flex items-center gap-0.5 font-medium text-brand hover:underline"><span>Xem {m.citations.length} nguồn tham khảo</span><Icon name="expand_more" size={16} className="text-[14px]" /></button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {m.citations.map((c) => (
            <a key={c.id} href="#" className="group inline-flex items-center gap-1.5 rounded-full bg-surface-variant px-3 py-1.5 font-body-medium text-body-medium text-[13px] text-text-primary shadow-sm transition-colors hover:bg-brand/10 hover:text-brand">
              <Icon name={citeIcon[c.kind].n} size={16} className={citeIcon[c.kind].c} />
              <span className="font-medium">{c.label}</span>
              <span className="text-text-secondary">·</span>
              <span className="font-label-mono text-label-mono text-text-secondary group-hover:text-brand">{c.location}</span>
              <Icon name="open_in_new" size={16} className="text-[14px] text-text-secondary group-hover:text-brand" />
            </a>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1 font-caption text-caption text-text-secondary"><Icon name="verified" size={16} className="text-[15px] text-status-success-text" /><span>Đã đối chiếu {m.verified} tài liệu thực</span></div>
        <div className="flex items-center gap-1">
          <IconButton icon="content_copy" label="Sao chép câu trả lời" variant="soft" iconSize={18} />
          <IconButton icon="thumb_up" label="Đánh giá hữu ích" variant="soft" iconSize={18} className="hover:text-status-success-text" />
          <IconButton icon="thumb_down" label="Báo cáo câu trả lời chưa chính xác" variant="soft" iconSize={18} className="hover:text-status-error-text" />
        </div>
      </div>
    </AiBubble>
  )
}

const prioIcon = { urgent: { n: 'error', c: 'text-status-error-text' }, high: { n: 'warning', c: 'text-status-warning-text' }, medium: { n: 'info', c: 'text-brand' }, low: { n: 'info', c: 'text-text-secondary' } } as const
const prioChip = { urgent: 'bg-status-error/15 text-status-error-text font-bold', high: 'bg-surface-variant text-status-warning-text font-semibold', medium: 'bg-surface-variant text-brand font-semibold', low: 'bg-surface-variant text-text-secondary font-semibold' } as const

export function DataAnswer({ m, canEdit }: { m: Of<'data'>; canEdit: boolean }) {
  return (
    <AiBubble time={m.time} header={<><span className="inline-flex items-center gap-1.5 rounded-full bg-surface-variant px-3 py-1 font-caption text-caption font-semibold text-text-primary shadow-sm"><span className="h-2 w-2 animate-pulse rounded-full bg-status-success" />Dữ liệu trực tiếp từ hệ thống</span><span className="font-caption text-caption text-text-secondary">Truy vấn thời gian thực từ Bảng công việc</span></>}>
      <p className="font-body-default text-body-default text-text-secondary">Phát hiện <span className="font-semibold text-status-error-text">{m.intro.count} công việc</span> {m.intro.text}</p>
      <div className="overflow-x-auto rounded-xl bg-surface-variant/40 shadow-sm">
        <table className="w-full text-left font-body-default text-body-default">
          <thead>
            <tr className="bg-surface-variant font-caption text-caption uppercase tracking-wider text-text-secondary">
              {['Tên công việc', 'Người phụ trách', 'Hạn chót', 'Mức độ', 'Nguồn gốc'].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {m.rows.map((r) => (
              <tr key={r.id} className="bg-surface transition-colors hover:bg-surface-variant/70">
                <td className="px-4 py-3 font-medium text-text-primary">
                  <div className="flex items-center gap-2"><Icon name={prioIcon[r.priority].n} size={18} className={prioIcon[r.priority].c} /><span className={cn(r.priority === 'urgent' && 'font-semibold')}>{r.title}</span></div>
                </td>
                <td className="px-4 py-3"><div className="flex items-center gap-2"><Avatar initials={r.assignee.initials} size={6} tone={r.priority === 'urgent' ? 'brand-muted' : 'ai'} /><span className="font-body-medium text-body-medium text-text-primary">{r.assignee.name}</span></div></td>
                <td className="px-4 py-3"><span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-caption text-caption font-semibold', r.due.overdue ? 'bg-status-error/15 text-status-error-text' : 'bg-surface-variant text-status-warning-text')}><Icon name={r.due.icon} size={13} />{r.due.label}</span></td>
                <td className="px-4 py-3"><span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-caption text-caption', prioChip[r.priority])}><PriorityDot level={r.priority} size="sm" />{priorityLabelVi[r.priority] === 'Khẩn cấp' ? 'Urgent' : 'High'}</span></td>
                <td className="px-4 py-3"><a href="#" className="inline-flex items-center gap-1 rounded-full bg-surface-variant px-2.5 py-1 font-caption text-caption text-text-secondary transition-colors hover:text-brand"><Icon name={r.source.kind === 'audio' ? 'mic' : 'article'} size={16} className={cn('text-[14px]', r.source.kind === 'audio' && 'text-recording-red')} /><span>{r.source.label}</span></a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between pt-2 font-caption text-caption text-text-secondary">
        <span className="flex items-center gap-1"><Icon name="view_kanban" size={16} className="text-[15px] text-brand" /><span>{m.note}</span></span>
        <Link to="/bang-cong-viec"><Button variant="subtle" size="xs" icon="open_in_new" className="text-text-primary">Mở trong Bảng công việc</Button></Link>
      </div>
      {!canEdit && null}
    </AiBubble>
  )
}

export function ActionProposal({ m, canEdit, onConfirm, onCancel }: { m: Of<'action'>; canEdit: boolean; onConfirm: () => void; onCancel: () => void }) {
  const done = m.state !== 'pending'
  return (
    <AiBubble time={m.time} header={<Badge tone="ai" size="md" bold className="gap-1"><span>✦</span> Yêu cầu xác nhận hành động</Badge>}>
      <p className="font-body-default text-body-default text-text-secondary">{m.intro}</p>
      <div className="relative space-y-4 overflow-hidden rounded-xl bg-surface-variant/60 p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ai-container text-ai-accent"><Icon name="notification_add" size={20} /></div>
            <div>
              <h3 className="flex items-center gap-1.5 font-card-title text-card-title text-text-primary"><span className="text-ai-accent">✦</span> Đề xuất tạo nhắc nhở mới</h3>
              <p className="font-caption text-caption text-text-secondary">Hành động này sẽ xuất hiện trên Lịch &amp; Nhắc nhở của bạn</p>
            </div>
          </div>
          <span className={cn('rounded-md px-2 py-0.5 font-caption text-caption font-semibold', m.state === 'confirmed' ? 'bg-status-success/15 text-status-success-text' : m.state === 'cancelled' ? 'bg-surface-variant text-text-secondary' : 'bg-ai-container text-ai-accent')}>
            {m.state === 'confirmed' ? 'Đã tạo' : m.state === 'cancelled' ? 'Đã hủy' : 'Chờ xác nhận'}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 rounded-lg bg-surface p-4 shadow-sm md:grid-cols-3">
          <Field label="Nội dung nhắc nhở"><p className="font-body-medium text-body-medium font-semibold text-text-primary">{m.proposal.content}</p></Field>
          <Field label="Thời gian kích hoạt"><p className="flex items-center gap-1 font-body-medium text-body-medium font-semibold text-brand"><Icon name="event" size={16} />{m.proposal.when}</p></Field>
          <Field label="Không gian liên kết"><p className="flex items-center gap-1 font-body-medium text-body-medium text-text-primary"><Icon name="folder_supervised" size={16} className="text-text-secondary" />{m.proposal.space}</p></Field>
        </div>
        {!done && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <Button size="lg" icon="check_circle" className="h-10 font-semibold" onClick={onConfirm} lockedReason={canEdit ? undefined : 'Bạn chỉ có quyền xem'}>Xác nhận tạo nhắc nhở</Button>
              <Button variant="outline" size="lg" icon="edit" className="h-10 bg-surface shadow-sm">Chỉnh sửa thông tin</Button>
            </div>
            <Button variant="ghost" size="lg" icon="close" className="h-10 hover:bg-status-error/10 hover:text-status-error-text" onClick={onCancel}>Hủy đề xuất</Button>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1.5 pt-1 font-caption text-caption text-text-secondary"><Icon name="lock" size={16} className="text-[15px] text-ai-accent" /><span>Chỉ được áp dụng khi người dùng phê duyệt rõ ràng. AI không tự ý kích hoạt tác vụ.</span></div>
    </AiBubble>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="space-y-1"><span className="block font-caption text-caption uppercase tracking-wider text-text-secondary">{label}</span>{children}</div>
}
