import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useWorkspace } from '../../context/WorkspaceContext'
import { cn } from '../../lib/cn'
import { Badge, Icon, IconButton, SidePanel } from '../ui'
import { PromptChip } from '../domain/PromptChip'
import { pageLabelFor } from './nav'
import type { AssistantChat } from './useAssistantChat'

const promptsByPage: Record<string, string[]> = {
  'Tổng quan': ['Việc nào đang quá hạn và ai phụ trách?', 'Có gì cần tôi duyệt hôm nay?'],
  'Ghi chú': ['Tóm tắt ghi chú này', 'Rút ra các việc cần làm'],
  'Ghi âm': ['Tóm tắt cuộc họp này', 'Liệt kê quyết định đã chốt'],
  'Bảng công việc': ['Việc nào chưa có người phụ trách?', 'Tóm tắt tiến độ sprint'],
  'Tài liệu': ['Tìm điều khoản bảo mật', 'Tóm tắt tài liệu mới nhất'],
}
const fallbackPrompts = ['Tóm tắt những gì mới trong không gian này']

/** Panel Trợ lý trượt bên phải (D3). Biết trang đang xem; hội thoại đầy đủ nằm ở trang Trợ lý AI. */
export function AssistantPanel({ open, onClose, chat }: { open: boolean; onClose: () => void; chat: AssistantChat }) {
  const { pathname } = useLocation()
  const { aiStatus, space } = useWorkspace()
  const context = pageLabelFor(pathname)
  const offline = aiStatus === 'offline'
  const { msgs, send: sendChat } = chat
  const [draft, setDraft] = useState('')
  const end = useRef<HTMLDivElement>(null)

  useEffect(() => {
    end.current?.scrollIntoView?.({ block: 'end' })
  }, [msgs])

  const send = (text: string) => {
    if (!text.trim() || offline) return
    sendChat(text)
    setDraft('')
  }

  const prompts = promptsByPage[context] ?? fallbackPrompts

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Trợ lý AI"
      className="dock:sticky dock:top-[72px] dock:h-[calc(100vh-88px)] dock:self-start"
      header={
        <div className="flex min-w-0 items-center gap-2">
          <Icon name="auto_awesome" size={20} className="shrink-0 text-ai-accent" />
          <h2 className="truncate font-card-title text-card-title text-text-primary">Trợ lý AI</h2>
          <Badge size="xs" tone="neutral" className="shrink-0">
            Đang xem: {context}
          </Badge>
        </div>
      }
      footer={
        <form
          className="flex w-full flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            send(draft)
          }}
        >
          <div className="flex items-end gap-2 rounded-xl bg-surface-variant p-2 focus-within:bg-surface focus-within:ring-2 focus-within:ring-brand">
            <textarea
              autoFocus
              rows={2}
              value={draft}
              disabled={offline}
              aria-label="Câu hỏi cho Trợ lý"
              placeholder={offline ? 'Trợ lý AI tạm thời không khả dụng' : `Hỏi về ${context.toLowerCase()}...`}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send(draft)
                }
              }}
              className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent font-body-default text-body-default text-text-primary outline-none placeholder:text-text-secondary disabled:cursor-not-allowed"
            />
            <IconButton icon="send" label="Gửi" variant="filled" disabled={offline || !draft.trim()} type="submit" className="disabled:cursor-not-allowed disabled:opacity-50" />
          </div>
        </form>
      }
    >
      {msgs.length === 0 ? (
        <div className="space-y-space-md">
          <p className="font-body-default text-body-default text-text-secondary">
            Hỏi về {context.toLowerCase()} trong không gian <strong className="text-text-primary">{space.name}</strong>. Câu trả lời của AI là gợi ý, bạn xác nhận trước khi thành dữ liệu chính thức.
          </p>
          <div className="flex flex-wrap gap-2">
            {prompts.map((p) => (
              <PromptChip key={p} onPick={() => send(p)}>
                {p}
              </PromptChip>
            ))}
          </div>
        </div>
      ) : (
        <ol className="space-y-space-sm" aria-live="polite">
          {msgs.map((m) => (
            <li key={m.id} className={cn('flex', m.from === 'user' && 'justify-end')}>
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl px-3 py-2 font-body-default text-body-default',
                  m.from === 'user' ? 'bg-primary-container text-on-primary' : 'bg-ai-container text-text-primary',
                )}
              >
                {m.from === 'ai' && <span className="mb-0.5 block font-caption text-caption font-semibold text-ai-accent">✦ Gợi ý</span>}
                {m.text}
              </div>
            </li>
          ))}
          <div ref={end} />
        </ol>
      )}
      <NavLink to="/tro-ly-ai" onClick={onClose} className="inline-flex items-center gap-1 font-body-medium text-body-medium text-[13px] text-brand hover:underline">
        <Icon name="history" size={16} />
        Xem lịch sử hội thoại
      </NavLink>
    </SidePanel>
  )
}
