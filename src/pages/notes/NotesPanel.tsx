import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { AiSuggestionCard, type SuggestionPatch } from '../../components/domain'
import { Avatar, Badge, Button, Checkbox, Icon, PriorityDot, SidePanel, Tabs } from '../../components/ui'
import type { RecGhost } from '../../mocks/recording'
import { noteVersions, sidePanel as d, type NoteBlock, type NoteComment } from '../../mocks/notes'

export type PanelTab = 'tasks' | 'links' | 'toc' | 'comments' | 'history'

function Block({ title, count, children }: { title: string; count?: ReactNode; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-caption text-caption text-[11px] uppercase tracking-wider text-text-secondary">{title}</p>
        {count}
      </div>
      {children}
    </div>
  )
}

export interface NotesPanelProps {
  open: boolean
  onClose: () => void
  tab: PanelTab
  onTab: (t: PanelTab) => void
  noteTitle: string
  blocks: NoteBlock[]
  onJumpBlock: (id: string) => void
  suggestions: RecGhost[]
  members: string[]
  onToggleSuggestion: (id: string, v: boolean) => void
  onToggleAll: (v: boolean) => void
  onChangeSuggestion: (id: string, p: SuggestionPatch) => void
  onConfirm: (ids: string[]) => void
  onDismiss: (ids: string[]) => void
  comments: NoteComment[]
  onComment: (text: string) => void
  onRestore: (id: string) => void
  readOnly: boolean
}

/** Panel chi tiết của ghi chú (D4): việc đề xuất, liên kết, mục lục, bình luận, lịch sử. */
export function NotesPanel(p: NotesPanelProps) {
  const navigate = useNavigate()
  const [draft, setDraft] = useState('')
  const selected = p.suggestions.filter((s) => s.checked)
  const items = [
    ...(p.suggestions.length > 0 && !p.readOnly ? [{ key: 'tasks', label: 'Việc', badge: String(p.suggestions.length) }] : []),
    { key: 'links', label: 'Liên kết' },
    { key: 'toc', label: 'Mục lục' },
    { key: 'comments', label: 'Bình luận', badge: String(p.comments.length) },
    { key: 'history', label: 'Lịch sử' },
  ]
  const tab = items.some((i) => i.key === p.tab) ? p.tab : 'links'

  return (
    <SidePanel
      open={p.open}
      onClose={p.onClose}
      title="Chi tiết ghi chú"
      defaultWidth={400}
      footer={
        <Button variant="outline" size="md" icon="auto_awesome" className="w-full justify-center text-ai-accent" onClick={() => navigate(`/tro-ly-ai?q=${encodeURIComponent(`Tóm tắt ghi chú "${p.noteTitle}"`)}`)}>
          Hỏi Trợ lý về ghi chú này
        </Button>
      }
    >
      <Tabs items={items} value={tab} onChange={(k) => p.onTab(k as PanelTab)} tone="brand" dense className="-mx-1" />

      {tab === 'tasks' && (
        <div className="space-y-space-md">
          <p className="font-caption text-caption text-text-secondary">AI đề xuất {p.suggestions.length} việc từ ghi chú này. Kiểm tra rồi tick những việc muốn tạo.</p>
          {p.suggestions.map((g) => (
            <AiSuggestionCard
              key={g.id}
              title={g.title}
              priority={g.priority}
              assignee={g.assignee}
              due={g.due}
              inferred={g.inferred}
              source={{ kind: 'note', location: g.sourceAt }}
              members={p.members}
              selected={g.checked}
              onSelectedChange={(v) => p.onToggleSuggestion(g.id, v)}
              onChange={(patch) => p.onChangeSuggestion(g.id, patch)}
            />
          ))}
          <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface p-space-sm shadow-lg">
            <Checkbox tone="ai" checked={selected.length === p.suggestions.length} onChange={(e) => p.onToggleAll(e.target.checked)} label={selected.length ? `Đã chọn ${selected.length} trên ${p.suggestions.length}` : 'Chọn tất cả'} />
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="md" disabled={!selected.length} onClick={() => p.onDismiss(selected.map((s) => s.id))}>Bỏ qua đã chọn</Button>
              <Button size="md" icon="add_task" disabled={!selected.length} onClick={() => p.onConfirm(selected.map((s) => s.id))}>Tạo {selected.length || ''} việc</Button>
            </div>
          </div>
        </div>
      )}

      {tab === 'links' && (
        <div className="space-y-space-lg">
          <Block title="Nguồn gốc ghi âm">
            <div className="group cursor-pointer rounded-xl bg-surface-variant p-3 transition-colors hover:bg-surface-container" onClick={() => navigate('/ghi-am/demo')}>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 font-caption text-caption text-[11px] font-medium text-text-primary"><Icon name="mic" size={13} className="text-recording-red" />{d.origin.chip}</span>
                <span className="font-caption text-caption text-[11px] tabular-nums text-text-secondary">{d.origin.time}</span>
              </div>
              <p className="mt-2 font-card-title text-card-title text-[13px] text-text-primary group-hover:text-brand">{d.origin.title}</p>
              <p className="mt-1 font-caption text-caption text-text-secondary">Đoạn trích {d.origin.cite.replace('Đoạn trích ', '')}</p>
            </div>
          </Block>
          <Block title="Tài liệu liên quan" count={<span className="font-caption text-caption text-text-secondary">{d.backlinks.length}</span>}>
            <div className="space-y-1.5">
              {d.backlinks.map((b) => (
                <div key={b.id} className="flex items-start gap-2 rounded-lg bg-surface-variant/70 p-2.5">
                  <Icon name="description" size={16} className="mt-0.5 text-text-secondary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-body-medium text-body-medium text-[13px] font-medium text-text-primary">{b.title}</p>
                    <p className="font-caption text-caption text-[11px] text-text-secondary">{b.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </Block>
          <Block title="Việc đã gắn" count={<Badge tone="primary" size="xs">1</Badge>}>
            <div className="space-y-1.5 rounded-lg bg-surface-variant/50 p-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 font-caption text-caption text-[11px] font-semibold text-status-warning-text"><PriorityDot level="high" size="sm" />Cao</span>
                <span className="font-label-mono text-label-mono text-[11px] text-text-secondary">{d.task.code}</span>
              </div>
              <p className="font-body-medium text-body-medium text-[13px] font-medium text-text-primary">{d.task.title}</p>
              <div className="flex items-center justify-between">
                <span className="font-caption text-caption text-[11px] text-text-secondary">{d.task.due}</span>
                <Avatar initials={d.task.assignee} size={5} tone="ai" />
              </div>
            </div>
          </Block>
          <Block title="Tệp đính kèm">
            {d.files.map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded-lg bg-surface-variant/40 p-2">
                <span className="flex min-w-0 items-center gap-2"><Icon name="attachment" size={16} className="text-text-secondary" /><span className="truncate font-body-default text-body-default text-[13px] text-text-primary">{f.name}</span></span>
                <span className="shrink-0 font-caption text-caption text-[11px] text-text-secondary">{f.size}</span>
              </div>
            ))}
          </Block>
        </div>
      )}

      {tab === 'toc' && (
        <nav aria-label="Mục lục">
          <ul className="space-y-1">
            {p.blocks.filter((b) => b.kind === 'h2').map((b) => (
              <li key={b.id}>
                <button type="button" onClick={() => p.onJumpBlock(b.id)} className="w-full rounded-lg px-2.5 py-2 text-left font-body-medium text-body-medium text-text-primary outline-none hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-brand">
                  {b.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {tab === 'comments' && (
        <div className="space-y-space-md">
          <ul className="space-y-space-md">
            {p.comments.map((c) => (
              <li key={c.id} className="flex gap-2">
                <Avatar initials={c.initials} size={7} tone="neutral" />
                <div className="min-w-0 flex-1 rounded-xl bg-surface-variant/60 p-2.5">
                  <p className="font-caption text-caption text-text-secondary"><span className="font-semibold text-text-primary">{c.author}</span> · {c.time}</p>
                  <p className="mt-0.5 font-body-default text-body-default text-text-primary">{c.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!draft.trim()) return
              p.onComment(draft.trim())
              setDraft('')
            }}
            className="flex gap-2"
          >
            <input
              value={draft}
              disabled={p.readOnly}
              onChange={(e) => setDraft(e.target.value)}
              aria-label="Viết bình luận"
              placeholder={p.readOnly ? 'Bạn chỉ có quyền xem' : 'Viết bình luận...'}
              className="h-9 min-w-0 flex-1 rounded-lg bg-surface-variant px-3 font-body-default text-body-default text-text-primary outline-none placeholder:text-text-secondary focus:ring-2 focus:ring-brand disabled:cursor-not-allowed"
            />
            <Button type="submit" size="md" disabled={p.readOnly || !draft.trim()}>Gửi</Button>
          </form>
        </div>
      )}

      {tab === 'history' && (
        <ol className="space-y-2">
          {noteVersions.map((v, i) => (
            <li key={v.id} className="flex items-start justify-between gap-2 rounded-xl bg-surface-variant/50 p-2.5">
              <div className="min-w-0">
                <p className="font-body-medium text-body-medium font-medium text-text-primary">{v.when}</p>
                <p className="font-caption text-caption text-text-secondary">{v.author} · {v.note}</p>
              </div>
              {i > 0 && !p.readOnly && <Button variant="outline" size="xs" onClick={() => p.onRestore(v.id)}>Khôi phục</Button>}
            </li>
          ))}
        </ol>
      )}
    </SidePanel>
  )
}
