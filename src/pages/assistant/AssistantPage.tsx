import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AssistantComposer } from '../../components/domain'
import { Badge, Banner, Button, Icon, IconButton } from '../../components/ui'
import { useWorkspace } from '../../context/WorkspaceContext'
import { assistantPrompts, initialMessages, type ChatMessage } from '../../mocks/assistant'
import { ActionProposal, DataAnswer, RagAnswer, UserBubble } from './Messages'

const now = () => new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })

/**
 * Assistant (Stitch W10). Three AI answer shapes: RAG with citations, live system data (table),
 * action proposal that needs explicit confirmation. Offline AI locks the composer (AssistantComposer).
 * Demo: ?ai=offline, ?q=... (prefills the composer, used by the overview quick-ask).
 */
export default function AssistantPage() {
  const { space, user, canEdit, aiStatus, setAiStatus } = useWorkspace()
  const [params] = useSearchParams()
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [draft, setDraft] = useState(params.get('q') ?? '')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (params.get('ai') === 'offline') setAiStatus('offline') }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const send = (text: string) => {
    const t = text.trim()
    if (!t || aiStatus === 'offline') return
    const id = String(Date.now())
    setMessages((m) => [...m, { id, role: 'user', text: t, time: now() }, {
      id: id + 'a', role: 'ai', kind: 'rag', time: now(), lead: 'Đây là câu trả lời mẫu (chưa kết nối AI thật):',
      points: [{ bold: 'Câu hỏi của bạn đã được ghi nhận', rest: ' và sẽ được truy xuất trong phạm vi Space hiện tại.' }], citations: [], verified: 0,
    }])
    setDraft('')
    requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }))
  }
  const setState = (id: string, state: 'confirmed' | 'cancelled') =>
    setMessages((ms) => ms.map((m) => (m.id === id && m.role === 'ai' && m.kind === 'action' ? { ...m, state } : m)))

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-space-lg -mb-8">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-surface p-space-md shadow-sm">
        <div className="flex min-w-0 items-center gap-space-md">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ai-container text-ai-accent"><Icon name="auto_awesome" size={24} /></div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-section-title text-section-title tracking-tight text-text-primary">Trợ lý thông minh</h1>
              <Badge tone="ai" size="md" dot pulse>Không gian độc lập</Badge>
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 truncate font-caption text-caption text-text-secondary">
              <Icon name="shield" size={16} className="text-[15px] text-brand" />
              <span className="font-medium text-text-primary">Phạm vi dữ liệu:</span>
              <span className="rounded-md bg-surface-variant px-2 py-0.5 font-label-mono text-label-mono font-semibold text-primary">Space {space.name}</span>
              <span className="text-text-secondary/60">· Truy xuất khép kín nội bộ</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="subtle" size="md" icon="add_comment" title="Bắt đầu hội thoại mới" onClick={() => setMessages([])}><span className="hidden sm:inline">Hội thoại mới</span></Button>
          <Button variant="subtle" size="md" icon="delete_sweep" title="Xóa lịch sử hội thoại" className="hover:bg-status-error/10 hover:text-status-error-text" onClick={() => setMessages([])}><span className="hidden sm:inline">Xóa lịch sử</span></Button>
          <IconButton variant="filled" icon="fullscreen" label="Mở toàn màn hình" />
        </div>
      </header>

      {aiStatus === 'offline' && (
        <Banner tone="warning" icon="cloud_off" title="Trợ lý AI đang tạm ngưng" description="Bạn vẫn đọc được lịch sử hội thoại. Ô nhập sẽ mở lại khi AI hoạt động." />
      )}

      <div className="space-y-6">
        {messages.length === 0 && (
          <div className="flex min-h-[240px] flex-col items-center justify-center gap-2 rounded-2xl bg-surface text-center shadow-sm">
            <Icon name="auto_awesome" size={28} className="text-ai-accent" />
            <p className="font-card-title text-card-title text-text-primary">Bắt đầu hội thoại mới</p>
            <p className="font-caption text-caption text-text-secondary">Hỏi về ghi chú, cuộc họp hoặc tài liệu trong Space {space.name}.</p>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className="space-y-3">
            {m.role === 'user' && <UserBubble text={m.text} time={m.time} initials={user.initials} />}
            {m.role === 'ai' && m.kind === 'rag' && <RagAnswer m={m} />}
            {m.role === 'ai' && m.kind === 'data' && <DataAnswer m={m} canEdit={canEdit} />}
            {m.role === 'ai' && m.kind === 'action' && <ActionProposal m={m} canEdit={canEdit} onConfirm={() => setState(m.id, 'confirmed')} onCancel={() => setState(m.id, 'cancelled')} />}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <AssistantComposer
        prompts={assistantPrompts}
        value={draft}
        onChange={setDraft}
        onSubmit={send}
        scopeNote={<>Trợ lý chỉ truy xuất dữ liệu trong <strong>Space {space.name}</strong>. Dữ liệu của bạn luôn được bảo vệ tuyệt đối.</>}
      />
    </div>
  )
}
