import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { SuggestionPatch } from '../../components/domain'
import { Avatar, Banner, Button, Icon, useToast } from '../../components/ui'
import { useWorkspace } from '../../context/WorkspaceContext'
import { aiActions, diagram, mainNote, noteComments, noteSuggestions, notesList, presetRewrite, retryRewrite, type NoteBlock, type NoteComment } from '../../mocks/notes'
import type { RecGhost } from '../../mocks/recording'
import { cn } from '../../lib/cn'
import { useMediaQuery } from '../../lib/useMediaQuery'
import { FloatingAiMenu, RewriteDiff } from './AiTools'
import { EditorToolbar } from './EditorToolbar'
import { NotesPanel, type PanelTab } from './NotesPanel'
import { NotesSidebar } from './NotesSidebar'

const clock = () => new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })

interface Selection { blockId: string; text: string }
interface Diff { key: string; suggestion: string; tries: number }

/**
 * Ghi chú (Stitch W4). Vùng soạn thảo rộng tối đa 720px; cây thư mục và panel chi tiết thu gọn được.
 * Thay đổi do AI luôn qua bước xem trước (Chấp nhận / Từ chối / Thử lại). Việc AI đề xuất nằm ở panel phải
 * và thanh dính đáy. Demo: ?diff=1, ?role=viewer, ?ai=offline, ?panel=tasks|links|toc|comments|history.
 */
export default function NotesPage() {
  const { canEdit, aiStatus, setRole, setAiStatus, user, members } = useWorkspace()
  const { toast } = useToast()
  const [params] = useSearchParams()
  const wide = useMediaQuery('(min-width: 1280px)')
  const [foldersOverride, setFoldersOverride] = useState<boolean | null>(null)
  const [panelTab, setPanelTab] = useState<PanelTab>('tasks')
  const [panelOpen, setPanelOpen] = useState(params.get('panel') !== null)
  const [activeId, setActiveId] = useState('n1')
  const [title, setTitle] = useState(mainNote.title)
  const [blocks, setBlocks] = useState<NoteBlock[]>(mainNote.blocks)
  const [sel, setSel] = useState<Selection | null>(canEdit ? mainNote.initialSelection : null)
  const [diff, setDiff] = useState<Diff | null>(params.get('diff') === '1' ? { key: 'rewrite', suggestion: presetRewrite, tries: 0 } : null)
  const [savedAt, setSavedAt] = useState('14:35')
  const [suggestions, setSuggestions] = useState<RecGhost[]>(noteSuggestions)
  const [comments, setComments] = useState<NoteComment[]>(noteComments)
  const scroller = useRef<HTMLElement>(null)

  useEffect(() => {
    if (params.get('role') === 'viewer') setRole('viewer')
    if (params.get('ai') === 'offline') setAiStatus('offline')
    const p = params.get('panel')
    if (p && ['tasks', 'links', 'toc', 'comments', 'history'].includes(p)) setPanelTab(p as PanelTab)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Viewer: bỏ vùng chọn và bản xem trước AI.
  const selection = canEdit ? sel : null
  const preview = canEdit ? diff : null

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !(e.target as HTMLElement | null)?.closest?.('[data-popover-panel], aside')) setDiff(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const foldersOpen = foldersOverride ?? (wide && !panelOpen)
  const activeMeta = notesList.find((n) => n.id === activeId)!
  const stub = activeId !== 'n1'
  const touch = () => setSavedAt(clock())
  const aiLocked = aiStatus === 'offline' ? 'Trợ lý AI đang tạm ngưng' : undefined
  const action = useMemo(() => aiActions.find((a) => a.key === preview?.key) ?? aiActions[0], [preview])
  const memberNames = members.map((m) => m.name)
  const pendingSuggestions = canEdit ? suggestions.length : 0

  const openPanel = (tab: PanelTab) => {
    setPanelTab(tab)
    setPanelOpen(true)
    if (!wide) return
    setFoldersOverride(false)
  }
  const togglePanel = () => {
    if (panelOpen) setPanelOpen(false)
    else openPanel(pendingSuggestions > 0 ? 'tasks' : 'links')
  }

  const suggestionFor = (key: string, tries: number) => {
    if (!selection) return ''
    if (selection.text === mainNote.initialSelection.text) return tries % 2 === 0 ? presetRewrite : retryRewrite
    return `${selection.text} (bản ${aiActions.find((a) => a.key === key)?.label.toLowerCase()} mẫu${tries ? ` ${tries + 1}` : ''}, chưa kết nối AI thật)`
  }
  const pick = (key: string) => {
    if (!selection) return
    if (key === 'tasks') {
      setSel(null)
      openPanel('tasks')
      return
    }
    setDiff({ key, suggestion: suggestionFor(key, 0), tries: 0 })
  }
  const retry = () => preview && setDiff({ ...preview, tries: preview.tries + 1, suggestion: suggestionFor(preview.key, preview.tries + 1) })
  const accept = () => {
    if (!selection || !preview) return
    setBlocks((bs) => bs.map((b) => (b.id === selection.blockId ? { ...b, text: b.text.replace(selection.text, preview.suggestion) } : b)))
    setSel(null)
    setDiff(null)
    touch()
    toast({ message: 'Đã thay bằng bản AI đề xuất' })
  }
  const insertBelow = () => {
    if (!selection || !preview) return
    setBlocks((bs) => {
      const i = bs.findIndex((b) => b.id === selection.blockId)
      return [...bs.slice(0, i + 1), { id: `ins${Date.now()}`, kind: 'p', text: preview.suggestion }, ...bs.slice(i + 1)]
    })
    setDiff(null)
    touch()
  }

  const onMouseUp = () => {
    if (!canEdit) return
    const s = window.getSelection()
    const text = s?.toString().trim()
    if (!s || !text || s.rangeCount === 0) return
    const el = (s.anchorNode instanceof Element ? s.anchorNode : s.anchorNode?.parentElement)?.closest('[data-block]') as HTMLElement | null
    const blockId = el?.dataset.block
    const block = blocks.find((b) => b.id === blockId)
    if (blockId && block && block.kind !== 'h2' && block.text.includes(text)) {
      setSel({ blockId, text })
      setDiff(null)
    }
  }

  const renderText = (b: NoteBlock) => {
    if (!selection || selection.blockId !== b.id || !b.text.includes(selection.text)) return b.text
    const a = b.text.indexOf(selection.text)
    return (
      <>
        {b.text.slice(0, a)}
        <span className="rounded bg-ai-accent/20 px-1 py-0.5 font-medium text-text-primary">{selection.text}</span>
        {b.text.slice(a + selection.text.length)}
      </>
    )
  }

  const removeSuggestions = (ids: string[], verb: string) => {
    const before = suggestions
    setSuggestions((g) => g.filter((x) => !ids.includes(x.id)))
    toast({
      message: `Đã ${verb} ${ids.length} việc đề xuất`,
      tone: 'success',
      action: { label: 'Hoàn tác', onClick: () => setSuggestions(before.map((b) => ({ ...b, checked: false }))) },
    })
  }
  const patchSuggestion = (id: string, p: SuggestionPatch) =>
    setSuggestions((g) =>
      g.map((x) => (x.id === id ? { ...x, ...p, inferred: { assignee: p.assignee !== undefined ? false : x.inferred.assignee, due: p.due !== undefined ? false : x.inferred.due } } : x)),
    )

  const jumpBlock = (id: string) => scroller.current?.querySelector(`[data-block="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    // Outer wrapper: index.css zeroes margin on main's first/last child, so the bleed margins live one level down.
    <div>
      <div className="-mx-8 -mb-8 -mt-24 flex h-screen w-auto overflow-hidden bg-background pt-16">
        {foldersOpen && <NotesSidebar activeId={activeId} onSelect={(id) => { setActiveId(id); setSel(null); setDiff(null) }} onCreate={touch} canEdit={canEdit} />}

        <main ref={scroller} className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-background" onMouseUp={onMouseUp}>
          <EditorToolbar
            savedAt={savedAt}
            foldersOpen={foldersOpen}
            onToggleFolders={() => setFoldersOverride(!foldersOpen)}
            panelOpen={panelOpen}
            onTogglePanel={togglePanel}
            panelBadge={pendingSuggestions}
          />
          <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-6 py-10 md:px-8">
            <div className="space-y-3">
              <p className="font-caption text-caption text-text-secondary">Không gian: Dự án Alpha</p>
              <h1
                contentEditable={canEdit}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const t = e.currentTarget.textContent?.trim()
                  if (t && t !== title) {
                    setTitle(t)
                    touch()
                  }
                }}
                className="font-display-title text-display-title tracking-tight text-text-primary outline-none focus:ring-0"
              >
                {stub ? activeMeta.title : title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 pb-4 font-caption text-caption text-[13px] text-text-secondary">
                <span className="flex items-center gap-1 font-medium text-text-primary"><Avatar initials={user.initials} size={5} tone="container" className="text-[10px] font-bold" />{user.name}</span>
                <span aria-hidden="true">·</span>
                <span>Cập nhật {activeMeta.when}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-status-success-text"><span className="h-1.5 w-1.5 rounded-full bg-status-success" />4 người đang xem</span>
              </div>
            </div>

            {stub ? (
              <p className="font-body-editor text-body-editor leading-relaxed text-text-secondary">Nội dung mẫu của ghi chú này chưa được dựng. Chọn "Biên bản họp kiến trúc hệ thống Q4" để xem trình soạn thảo đầy đủ.</p>
            ) : (
              <div className="space-y-6 font-body-editor text-body-editor leading-relaxed text-text-primary">
                {blocks.map((b) => {
                  const isSel = selection?.blockId === b.id
                  if (b.kind === 'h2') return <h2 key={b.id} data-block={b.id} className="-mb-4 font-section-title text-section-title text-text-primary">{b.text}</h2>
                  return (
                    <div key={b.id} className={cn('relative', isSel && 'pt-12')}>
                      {isSel && <FloatingAiMenu activeKey={preview?.key ?? 'rewrite'} onPick={pick} lockedReason={aiLocked} />}
                      <p data-block={b.id} className={cn(b.kind === 'pmuted' ? 'text-text-secondary' : 'text-text-primary', isSel && 'rounded-lg bg-secondary-fixed/30 p-3')}>{renderText(b)}</p>
                      {isSel && preview && <RewriteDiff original={selection!.text} suggestion={preview.suggestion} style={action.style} onReject={() => setDiff(null)} onRetry={retry} onInsert={insertBelow} onAccept={accept} />}
                    </div>
                  )
                })}

                <div className="space-y-3 rounded-xl bg-surface p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-card-title text-card-title text-[14px] text-text-primary">3. Mô hình luồng dữ liệu</span>
                    <span className="font-label-mono text-label-mono text-[11px] text-text-secondary">{diagram.file}</span>
                  </div>
                  <div className="space-y-1 overflow-x-auto rounded-lg bg-surface-variant p-3 font-label-mono text-label-mono text-[12px]">
                    {diagram.lines.map((l) => (
                      <p key={l.text} className={cn('whitespace-nowrap', l.tone === 'ai' && 'text-ai-accent', l.tone === 'muted' && 'pl-4 text-text-secondary', l.tone === 'brand' && 'text-brand')}>{l.text}</p>
                    ))}
                  </div>
                </div>

                {!canEdit && <Banner tone="info" icon="lock" title="Bạn chỉ có quyền xem ghi chú này" description="Công cụ AI và chỉnh sửa đã bị khóa." />}
              </div>
            )}
          </div>

          {pendingSuggestions > 0 && !stub && !preview && !(panelOpen && panelTab === 'tasks') && (
            <div className="sticky bottom-4 z-20 mx-auto mt-auto w-full max-w-[720px] px-6 pb-4 md:px-8">
              <div role="region" aria-label="Việc AI đề xuất" className="flex flex-wrap items-center justify-between gap-x-space-md gap-y-2 rounded-xl bg-surface p-space-md shadow-lg">
                <span className="flex items-center gap-2 font-body-medium text-body-medium text-text-primary">
                  <Icon name="lightbulb" size={20} className="text-ai-accent" />
                  AI đề xuất {pendingSuggestions} việc từ ghi chú này
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="md" onClick={() => removeSuggestions(suggestions.map((s) => s.id), 'bỏ qua')}>Bỏ qua</Button>
                  <Button size="md" onClick={() => openPanel('tasks')}>Xem và duyệt</Button>
                </div>
              </div>
            </div>
          )}
        </main>

        <NotesPanel
          open={panelOpen}
          onClose={() => setPanelOpen(false)}
          tab={panelTab}
          onTab={setPanelTab}
          noteTitle={stub ? activeMeta.title : title}
          blocks={blocks}
          onJumpBlock={jumpBlock}
          suggestions={suggestions}
          members={memberNames}
          onToggleSuggestion={(id, v) => setSuggestions((g) => g.map((x) => (x.id === id ? { ...x, checked: v } : x)))}
          onToggleAll={(v) => setSuggestions((g) => g.map((x) => ({ ...x, checked: v })))}
          onChangeSuggestion={patchSuggestion}
          onConfirm={(ids) => removeSuggestions(ids, 'tạo')}
          onDismiss={(ids) => removeSuggestions(ids, 'bỏ qua')}
          comments={comments}
          onComment={(text) => setComments((c) => [...c, { id: `c${c.length + 1}`, author: user.name, initials: user.initials, time: 'Vừa xong', text }])}
          onRestore={(id) => toast({ message: `Đã khôi phục phiên bản ${id} (mẫu)` })}
          readOnly={!canEdit}
        />
      </div>
    </div>
  )
}
