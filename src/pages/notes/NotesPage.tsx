import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Avatar, AvatarStack, Banner, Button, Icon } from '../../components/ui'
import { useWorkspace } from '../../context/WorkspaceContext'
import { aiActions, detectedActions, diagram, mainNote, notesList, presetRewrite, viewers, type NoteBlock } from '../../mocks/notes'
import { cn } from '../../lib/cn'
import { FloatingAiMenu, RewriteDiff } from './AiTools'
import { EditorToolbar } from './EditorToolbar'
import { NotesSidebar } from './NotesSidebar'
import { SidePanel } from './SidePanel'

const clock = () => new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })

interface Selection { blockId: string; text: string }
interface Diff { key: string; suggestion: string }

/**
 * Notes editor (Stitch W4): 3 panes (folders | editor | links), floating AI menu on a text selection,
 * AI rewrite diff (human decides: replace / insert below / cancel). Variants are state:
 * viewer (no edit, no AI menu), AI offline (AI menu locked). Demo: ?diff=1 opens the diff, ?role=viewer, ?ai=offline.
 */
export default function NotesPage() {
  const { canEdit, aiStatus, setRole, setAiStatus, user } = useWorkspace()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState('n1')
  const [title, setTitle] = useState(mainNote.title)
  const [blocks, setBlocks] = useState<NoteBlock[]>(mainNote.blocks)
  const [sel, setSel] = useState<Selection | null>(mainNote.initialSelection)
  const [diff, setDiff] = useState<Diff | null>(
    params.get('diff') === '1' ? { key: 'rewrite', suggestion: presetRewrite } : null,
  )
  const [savedAt, setSavedAt] = useState('14:35')
  const [bannerOpen, setBannerOpen] = useState(true)

  useEffect(() => {
    if (params.get('role') === 'viewer') setRole('viewer')
    if (params.get('ai') === 'offline') setAiStatus('offline')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (!canEdit) { setSel(null); setDiff(null) } }, [canEdit])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDiff(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const activeMeta = notesList.find((n) => n.id === activeId)!
  const isMain = activeId === 'n1'
  const touch = () => setSavedAt(clock())
  const aiLocked = !canEdit ? 'Bạn chỉ có quyền xem' : aiStatus === 'offline' ? 'Trợ lý AI đang tạm ngưng' : undefined
  const action = useMemo(() => aiActions.find((a) => a.key === diff?.key) ?? aiActions[0], [diff])

  const pick = (key: string) => {
    if (!sel) return
    const suggestion = sel.text === mainNote.initialSelection.text ? presetRewrite : `${sel.text} (bản ${aiActions.find((a) => a.key === key)?.label.toLowerCase()} mẫu, chưa kết nối AI thật)`
    setDiff({ key, suggestion })
  }
  const replace = () => {
    if (!sel || !diff) return
    setBlocks((bs) => bs.map((b) => (b.id === sel.blockId ? { ...b, text: b.text.replace(sel.text, diff.suggestion) } : b)))
    setSel(null); setDiff(null); touch()
  }
  const insertBelow = () => {
    if (!sel || !diff) return
    setBlocks((bs) => {
      const i = bs.findIndex((b) => b.id === sel.blockId)
      return [...bs.slice(0, i + 1), { id: `ins${Date.now()}`, kind: 'p', text: diff.suggestion }, ...bs.slice(i + 1)]
    })
    setDiff(null); touch()
  }

  // Real selections: highlight what the user selects inside a paragraph, then offer the AI menu.
  const onMouseUp = () => {
    if (!canEdit) return
    const s = window.getSelection()
    const text = s?.toString().trim()
    if (!s || !text || s.rangeCount === 0) return
    const el = (s.anchorNode instanceof Element ? s.anchorNode : s.anchorNode?.parentElement)?.closest('[data-block]') as HTMLElement | null
    const blockId = el?.dataset.block
    const block = blocks.find((b) => b.id === blockId)
    if (blockId && block && block.kind !== 'h2' && block.text.includes(text)) { setSel({ blockId, text }); setDiff(null) }
  }

  const renderText = (b: NoteBlock) => {
    if (!sel || sel.blockId !== b.id || !b.text.includes(sel.text)) return b.text
    const [a, z] = [b.text.indexOf(sel.text), b.text.indexOf(sel.text) + sel.text.length]
    return (
      <>
        {b.text.slice(0, a)}
        <span className="rounded bg-ai-accent/20 px-1 py-0.5 font-medium text-text-primary">{sel.text}</span>
        {canEdit && <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-ai-accent align-middle" />}
        {b.text.slice(z)}
      </>
    )
  }

  const stub = !isMain

  return (
    // Outer wrapper: index.css zeroes margin on main's first/last child, so the bleed margins live one level down.
    <div>
    <div className="-mx-8 -mb-8 -mt-24 flex h-screen w-auto overflow-hidden bg-background pt-16">
      <NotesSidebar activeId={activeId} onSelect={(id) => { setActiveId(id); setSel(null); setDiff(null) }} onCreate={touch} canEdit={canEdit} />

      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-background" onMouseUp={onMouseUp}>
        <EditorToolbar savedAt={savedAt} />
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-16 py-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded bg-ai-container px-2.5 py-1 font-caption text-caption text-[11px] font-semibold text-ai-accent"><span>✦</span> Ghi chú tổng hợp</span>
              <span className="font-caption text-caption text-[12px] text-text-secondary">·</span>
              <span className="font-caption text-caption text-[12px] text-text-secondary">Không gian: Dự án Alpha</span>
            </div>
            <h1
              contentEditable={canEdit}
              suppressContentEditableWarning
              onBlur={(e) => { const t = e.currentTarget.textContent?.trim(); if (t && t !== title) { setTitle(t); touch() } }}
              className="font-display-title text-display-title tracking-tight text-text-primary outline-none focus:ring-0"
            >
              {stub ? activeMeta.title : title}
            </h1>
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-2 font-caption text-caption text-[13px] text-text-secondary">
                <div className="flex items-center gap-1 font-medium text-text-primary"><Avatar initials={user.initials} size={5} tone="container" className="text-[10px] font-bold" /><span>{user.name}</span></div>
                <span>·</span>
                <span>Cập nhật {activeMeta.when}</span>
                <span>·</span>
                <div className="flex items-center gap-1 font-medium text-status-success"><span className="h-1.5 w-1.5 rounded-full bg-status-success" /><span>4 thành viên đang xem</span></div>
              </div>
              <AvatarStack members={viewers} max={3} size={6} />
            </div>
          </div>

          {stub ? (
            <p className="font-body-editor text-body-editor leading-relaxed text-text-secondary">Nội dung mẫu của ghi chú này chưa được dựng. Chọn "Biên bản họp kiến trúc hệ thống Q4" để xem trình soạn thảo đầy đủ.</p>
          ) : (
            <div className="space-y-6 font-body-editor text-body-editor leading-relaxed text-text-primary">
              {blocks.map((b) => {
                const isSel = sel?.blockId === b.id
                if (b.kind === 'h2') return <h2 key={b.id} data-block={b.id} className="-mb-4 font-section-title text-section-title text-text-primary">{b.text}</h2>
                return (
                  <div key={b.id} className={cn('relative', isSel && 'group my-4')}>
                    {isSel && canEdit && <FloatingAiMenu activeKey={diff?.key ?? 'rewrite'} onPick={pick} lockedReason={aiLocked && canEdit ? aiLocked : undefined} />}
                    <p data-block={b.id} className={cn(b.kind === 'pmuted' ? 'text-text-secondary' : 'text-text-primary', isSel && 'rounded-lg bg-secondary-fixed/30 p-3')}>{renderText(b)}</p>
                    {isSel && diff && <RewriteDiff original={sel!.text} suggestion={diff.suggestion} style={action.style} onCancel={() => setDiff(null)} onInsert={insertBelow} onReplace={replace} />}
                  </div>
                )
              })}

              <div className="space-y-3 rounded-xl bg-surface p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-card-title text-card-title text-[14px] text-text-primary">3. Mô hình luồng dữ liệu Pipeline</span>
                  <span className="font-label-mono text-label-mono text-[11px] text-text-secondary">Diagram: {diagram.file}</span>
                </div>
                <div className="space-y-1 rounded-lg bg-surface-variant p-3 font-label-mono text-label-mono text-[12px]">
                  {diagram.lines.map((l) => (
                    <p key={l.text} className={cn(l.tone === 'ai' && 'text-ai-accent', l.tone === 'muted' && 'pl-4 text-text-secondary', l.tone === 'brand' && 'text-brand')}>{l.text}</p>
                  ))}
                </div>
              </div>

              {bannerOpen && canEdit && (
                <div className="mt-8 flex items-center justify-between gap-4 rounded-xl bg-surface p-4 shadow-sm">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ai-container text-ai-accent"><Icon name="auto_awesome" size={24} /></div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-card-title text-card-title text-[14px] text-text-primary">✦ AI tìm thấy 2 việc cần làm từ ghi chú này</span>
                        <span className="rounded-full bg-ai-container px-2 py-0.5 font-caption text-caption text-[11px] font-semibold text-ai-accent">Gợi ý tự động</span>
                      </div>
                      <p className="mt-0.5 truncate font-body-default text-body-default text-[12.5px] text-text-secondary">{detectedActions}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button variant="ghost" size="md" onClick={() => setBannerOpen(false)}>Bỏ qua</Button>
                    <Button variant="ai-solid" size="md" icon="add_task" onClick={() => navigate('/bang-cong-viec')}>Xem &amp; tạo task</Button>
                  </div>
                </div>
              )}
              {!canEdit && <Banner tone="info" icon="lock" title="Bạn chỉ có quyền xem ghi chú này" description="Công cụ AI và chỉnh sửa đã bị khóa." />}
            </div>
          )}
        </div>
      </main>

      <SidePanel noteTitle={stub ? activeMeta.title : title} />
    </div>
    </div>
  )
}
