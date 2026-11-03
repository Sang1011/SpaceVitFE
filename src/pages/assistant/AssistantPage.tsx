import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AssistantComposer } from '../../components/domain'
import { Banner, Button, ConfirmDialog, Icon, PriorityChip, SidePanel, useToast } from '../../components/ui'
import { Link } from 'react-router-dom'
import { useWorkspace } from '../../context/WorkspaceContext'
import { cn } from '../../lib/cn'
import { fallbackPrompts, initialConversations, type ChatMessage, type Conversation, type ReminderChannel, type TaskRow } from '../../mocks/assistant'
import { ActionProposal, DataAnswer, ErrorMessage, RagAnswer, ThinkingBubble, UserBubble } from './Messages'

const now = () => new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
const followUps = ['Tóm tắt thành 3 ý', 'Việc nào cần làm tiếp?', 'Nguồn nào quan trọng nhất?']

/**
 * Trợ lý AI toàn màn hình: danh sách hội thoại bên trái, hội thoại ở giữa, chi tiết việc ở panel phải.
 * Ba dạng trả lời: tổng hợp có nguồn, dữ liệu trực tiếp (bảng), đề xuất hành động cần xác nhận.
 * Demo: ?ai=offline, ?ai=quota (lần gửi đầu báo hết lượt Gemini), ?q=... (điền sẵn câu hỏi).
 */
export default function AssistantPage() {
  const { space, user, canEdit, aiStatus, setAiStatus, lock } = useWorkspace()
  const { toast } = useToast()
  const [params] = useSearchParams()
  const [convs, setConvs] = useState<Conversation[]>(initialConversations)
  const [activeId, setActiveId] = useState('cv1')
  const [draft, setDraft] = useState(params.get('q') ?? '')
  const [busy, setBusy] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [row, setRow] = useState<TaskRow | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const seq = useRef(0)
  const timer = useRef<number | undefined>(undefined)
  const quota = useRef(params.get('ai') === 'quota')
  const offline = aiStatus === 'offline'
  const locked = lock('assistant.act')

  useEffect(() => {
    if (params.get('ai') === 'offline') setAiStatus('offline')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const active = convs.find((c) => c.id === activeId) ?? convs[0]
  const messages = active.messages
  const patchActive = (fn: (m: ChatMessage[]) => ChatMessage[], title?: string) =>
    setConvs((cs) => cs.map((c) => (c.id === active.id ? { ...c, messages: fn(c.messages), title: title ?? c.title } : c)))
  const scroll = () => requestAnimationFrame(() => endRef.current?.scrollIntoView?.({ behavior: 'smooth' }))

  const ask = (text: string, addUser: boolean) => {
    const t = text.trim()
    if (!t || offline || busy) return
    seq.current += 1
    const id = `u${seq.current}`
    const title = active.messages.length === 0 ? t.slice(0, 48) : undefined
    if (addUser) patchActive((m) => [...m, { id, role: 'user', text: t, time: now() }], title)
    setBusy(true)
    scroll()
    timer.current = window.setTimeout(() => {
      setBusy(false)
      if (quota.current) {
        quota.current = false
        patchActive((m) => [...m, { id: id + 'e', role: 'ai', kind: 'error', time: now(), text: 'Trợ lý tạm thời hết lượt dùng (giới hạn của Gemini). Hãy thử lại sau ít phút.', retryText: t }])
      } else {
        patchActive((m) => [
          ...m,
          {
            id: id + 'a', role: 'ai', kind: 'rag', time: now(), lead: 'Đây là câu trả lời mẫu, chưa kết nối AI thật:',
            points: [{ bold: 'Câu hỏi đã được ghi nhận', rest: ' và sẽ được tìm trong phạm vi không gian hiện tại.', cites: [1] }],
            citations: [{ id: id + 'c', kind: 'note', label: 'Biên bản họp kiến trúc hệ thống Q4', location: 'Mục 2.3' }],
          },
        ])
      }
      scroll()
    }, 1200)
  }
  const send = (text: string) => {
    ask(text, true)
    setDraft('')
  }
  const stop = () => {
    window.clearTimeout(timer.current)
    setBusy(false)
    toast({ message: 'Đã dừng trả lời' })
  }
  const retry = (m: Extract<ChatMessage, { kind: 'error' }>) => {
    patchActive((ms) => ms.filter((x) => x.id !== m.id))
    ask(m.retryText, false)
  }

  const patchAction = (id: string, fn: (m: Extract<ChatMessage, { kind: 'action' }>) => Extract<ChatMessage, { kind: 'action' }>) =>
    patchActive((ms) => ms.map((m) => (m.id === id && m.role === 'ai' && m.kind === 'action' ? fn(m) : m)))
  const confirmAction = (id: string) => {
    patchAction(id, (m) => ({ ...m, state: 'confirmed' }))
    toast({ message: 'Đã tạo nhắc nhở', tone: 'success', action: { label: 'Hoàn tác', onClick: () => patchAction(id, (m) => ({ ...m, state: 'pending' })) } })
  }

  const newConversation = () => {
    seq.current += 1
    const id = `cv${seq.current}`
    setConvs((cs) => [{ id, title: 'Hội thoại mới', when: 'Vừa xong', messages: [] }, ...cs])
    setActiveId(id)
    setRow(null)
  }
  const clearHistory = () => {
    const before = messages
    patchActive(() => [])
    setConfirmClear(false)
    toast({ message: 'Đã xóa hội thoại', action: { label: 'Hoàn tác', onClick: () => setConvs((cs) => cs.map((c) => (c.id === active.id ? { ...c, messages: before } : c))) } })
  }

  const renderMessage = (m: ChatMessage) => {
    if (m.role === 'user') return <UserBubble text={m.text} time={m.time} initials={user.initials} />
    if (m.kind === 'rag') return <RagAnswer m={m} />
    if (m.kind === 'data') return <DataAnswer m={m} selectedId={row?.id} onOpenRow={setRow} />
    if (m.kind === 'error') return <ErrorMessage m={m} onRetry={() => retry(m)} locked={locked} />
    return (
      <ActionProposal
        m={m}
        canEdit={canEdit}
        onConfirm={() => confirmAction(m.id)}
        onCancel={() => patchAction(m.id, (x) => ({ ...x, state: 'cancelled' }))}
        onUndo={() => patchAction(m.id, (x) => ({ ...x, state: 'pending' }))}
        onChannel={(c: ReminderChannel) => patchAction(m.id, (x) => ({ ...x, proposal: { ...x.proposal, channel: c } }))}
      />
    )
  }

  return (
    <div className="-mb-4 flex items-start md:-mb-8 gap-space-lg">
      <aside aria-label="Hội thoại" className={cn('sticky top-[72px] hidden w-60 shrink-0 flex-col gap-space-sm', row ? '2xl:flex' : 'lg:flex')}>
        <Button icon="add_comment" onClick={newConversation} className="w-full">Hội thoại mới</Button>
        <ul className="space-y-1">
          {convs.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                aria-current={c.id === active.id ? 'true' : undefined}
                onClick={() => { setActiveId(c.id); setRow(null) }}
                className={cn('w-full rounded-lg px-3 py-2 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand', c.id === active.id ? 'bg-primary-fixed/40' : 'hover:bg-surface-variant')}
              >
                <span className="block truncate font-body-medium text-body-medium text-text-primary">{c.title}</span>
                <span className="font-caption text-caption text-text-secondary">{c.when}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="mx-auto flex min-w-0 max-w-4xl flex-1 flex-col gap-space-lg">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface p-space-md shadow-sm">
          <div className="min-w-0">
            <h1 className="flex items-center gap-2 font-section-title text-section-title tracking-tight text-text-primary">
              <Icon name="auto_awesome" size={24} className="text-ai-accent" />
              Trợ lý AI
            </h1>
            <p className="font-caption text-caption text-text-secondary">Chỉ tìm trong dữ liệu của không gian {space.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="lg:hidden">
              <span className="sr-only">Chọn hội thoại</span>
              <select value={active.id} onChange={(e) => { setActiveId(e.target.value); setRow(null) }} className="h-9 max-w-[10rem] rounded-lg border border-border-strong bg-surface-variant px-2 font-body-medium text-body-medium text-text-primary outline-none focus:ring-2 focus:ring-brand">
                {convs.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </label>
            <Button variant="subtle" size="md" icon="add_comment" onClick={newConversation} className="lg:hidden"><span className="sr-only sm:not-sr-only">Mới</span></Button>
            <Button variant="subtle" size="md" icon="delete_sweep" disabled={messages.length === 0} onClick={() => setConfirmClear(true)} className="hover:text-status-error-text">
              <span className="sr-only sm:not-sr-only">Xóa hội thoại</span>
            </Button>
          </div>
        </header>

        {offline && <Banner tone="warning" icon="cloud_off" title="Trợ lý AI đang tạm ngưng" description="Bạn vẫn đọc được lịch sử hội thoại. Ô nhập sẽ mở lại khi AI hoạt động." />}

        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="flex min-h-[240px] flex-col items-center justify-center gap-2 rounded-2xl bg-surface text-center shadow-sm">
              <Icon name="auto_awesome" size={28} className="text-ai-accent" />
              <p className="font-card-title text-card-title text-text-primary">Bắt đầu hội thoại mới</p>
              <p className="font-caption text-caption text-text-secondary">Hỏi về ghi chú, cuộc họp hoặc tài liệu trong {space.name}.</p>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id}>{renderMessage(m)}</div>
          ))}
          {busy && <ThinkingBubble />}
          <div ref={endRef} />
        </div>

        <AssistantComposer
          prompts={messages.length === 0 ? fallbackPrompts : followUps}
          value={draft}
          onChange={setDraft}
          onSubmit={send}
          busy={busy}
          onStop={stop}
          scopeNote={<>Câu hỏi và nội dung liên quan được gửi tới nhà cung cấp AI để xử lý. Chỉ dữ liệu trong <strong>{space.name}</strong> được dùng.</>}
        />
      </div>

      <SidePanel open={row !== null} onClose={() => setRow(null)} title="Chi tiết việc" className="dock:sticky dock:top-[72px] dock:h-[calc(100vh-88px)] dock:self-start" header={<h2 className="font-card-title text-card-title text-text-primary">Chi tiết việc</h2>}>
        {row && (
          <div className="space-y-space-md">
            <h3 className="font-section-title text-section-title text-text-primary">{row.title}</h3>
            <PriorityChip level={row.priority} />
            <dl className="space-y-2 font-body-default text-body-default">
              <div className="flex justify-between gap-2"><dt className="text-text-secondary">Người phụ trách</dt><dd className="text-text-primary">{row.assignee.name}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-text-secondary">Hạn</dt><dd className={cn(row.due.overdue ? 'font-semibold text-status-error-text' : 'text-text-primary')}>{row.due.label}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-text-secondary">Nguồn</dt><dd className="text-text-primary">{row.source.label}</dd></div>
            </dl>
            <Link to="/bang-cong-viec"><Button variant="subtle" icon="open_in_new" className="text-text-primary">Mở trong Bảng công việc</Button></Link>
          </div>
        )}
      </SidePanel>

      <ConfirmDialog
        open={confirmClear}
        tone="destructive"
        title="Xóa hội thoại này?"
        description="Toàn bộ tin nhắn trong hội thoại sẽ bị xóa. Bạn có thể hoàn tác ngay sau đó."
        confirmLabel="Xóa hội thoại"
        onConfirm={clearHistory}
        onCancel={() => setConfirmClear(false)}
      />
    </div>
  )
}
