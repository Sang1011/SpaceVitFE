import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragOverEvent, type DragStartEvent } from '@dnd-kit/core'
import { EmptyState } from '../../components/domain'
import { FilterBar, PageHeader, useDock, type BoardView, type FilterChip } from '../../components/layout'
import { Banner, Button, ConfirmDialog, Icon, Skeleton, SkeletonGroup, useToast } from '../../components/ui'
import { useWorkspace } from '../../context/WorkspaceContext'
import { boardColumns, getTaskDetail, statusByColumn } from '../../mocks/board'
import type { BoardColumnData, BoardTask, ColumnKey } from '../../types/board'
import { BoardEmpty } from './BoardEmpty'
import { KanbanColumn } from './KanbanColumn'
import { TaskCard } from './TaskCard'
import { TaskPanel, type TaskPatch } from './TaskPanel'
import { TaskTable } from './TaskTable'

type BoardState = 'ready' | 'loading' | 'error'

/**
 * Trang Bảng công việc. Các biến thể là state, không phải màn riêng:
 * viewer (role), AI offline (aiStatus), tối (theme), rỗng / đang tải / lỗi.
 * Tham số demo: ?role=viewer, ?ai=offline, ?empty=1, ?state=loading|error, ?drag=1, ?dev=1 (hiện thanh demo).
 * Việc đang mở nằm trong URL (?task=t5) nên chia sẻ được liên kết.
 */
export default function BoardPage() {
  const { canEdit, role, setRole, aiStatus, setAiStatus, user } = useWorkspace()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [columns, setColumns] = useState<BoardColumnData[]>(boardColumns)
  const [descriptions, setDescriptions] = useState<Record<string, string>>({})
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overCol, setOverCol] = useState<ColumnKey | null>(null)
  const [search, setSearch] = useState('')
  const [mineOnly, setMineOnly] = useState(false)
  const [highOnly, setHighOnly] = useState(false)
  const [overdueOnly, setOverdueOnly] = useState(false)
  const [view, setView] = useState<BoardView>('kanban')
  const [bannerOpen, setBannerOpen] = useState(true)
  const [empty, setEmpty] = useState(params.get('empty') === '1')
  const [boardState, setBoardState] = useState<BoardState>(params.get('state') === 'loading' ? 'loading' : params.get('state') === 'error' ? 'error' : 'ready')
  const [newTaskId, setNewTaskId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const counter = useRef(0)
  const demoDrag = params.get('drag') === '1'
  const showDev = import.meta.env.DEV || params.get('dev') === '1'
  const selectedId = params.get('task')

  useEffect(() => {
    if (params.get('role') === 'viewer') setRole('viewer')
    if (params.get('ai') === 'offline') setAiStatus('offline')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    // Space nhấc thẻ, mũi tên di chuyển, Space thả, Esc hủy. Enter dành cho mở thẻ.
    useSensor(KeyboardSensor, { keyboardCodes: { start: ['Space'], cancel: ['Escape'], end: ['Space'] } }),
  )
  const aiOffline = aiStatus === 'offline'
  const lock = canEdit ? undefined : 'Bạn chỉ có quyền xem'

  const filterCount = [mineOnly, highOnly, overdueOnly, search.trim() !== ''].filter(Boolean).length
  const visibleColumns = useMemo(
    () =>
      columns.map((c) => ({
        ...c,
        tasks: c.tasks.filter(
          (t) =>
            t.title.toLowerCase().includes(search.toLowerCase()) &&
            (!mineOnly || t.assignee.initials === user.initials) &&
            (!highOnly || t.priority === 'urgent' || t.priority === 'high') &&
            (!overdueOnly || t.due?.overdue),
        ),
      })),
    [columns, search, mineOnly, highOnly, overdueOnly, user.initials],
  )
  const total = columns.reduce((n, c) => n + c.tasks.length + (c.hidden ?? 0), 0)
  const shown = visibleColumns.reduce((n, c) => n + c.tasks.length, 0)
  const flatIds = useMemo(() => visibleColumns.flatMap((c) => c.tasks.map((t) => t.id)), [visibleColumns])

  const findTask = (id: string): { task: BoardTask; column: ColumnKey } | null => {
    for (const c of columns) {
      const task = c.tasks.find((t) => t.id === id)
      if (task) return { task, column: c.key }
    }
    return null
  }
  const activeTask = activeId ? findTask(activeId)?.task : null
  const selected = selectedId ? findTask(selectedId) : null

  const openTask = useCallback(
    (id: string) =>
      setParams((p) => {
        const n = new URLSearchParams(p)
        n.set('task', id)
        return n
      }),
    [setParams],
  )
  const closeTask = useCallback(
    () =>
      setParams((p) => {
        const n = new URLSearchParams(p)
        n.delete('task')
        return n
      }),
    [setParams],
  )

  // Sidebar thu icon khi panel gắn cạnh bảng đang mở.
  useDock(!!selected)

  // Giữ thẻ đang chọn trong tầm nhìn khi bảng co lại vì panel mở.
  useEffect(() => {
    if (!selectedId) return
    const raf = requestAnimationFrame(() => document.getElementById(`card-${selectedId}`)?.scrollIntoView({ block: 'nearest', inline: 'nearest' }))
    return () => cancelAnimationFrame(raf)
  }, [selectedId])

  // J / K chuyển việc kế tiếp / trước đó khi panel đang mở.
  useEffect(() => {
    if (!selectedId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return
      const k = e.key.toLowerCase()
      if (k !== 'j' && k !== 'k') return
      const i = flatIds.indexOf(selectedId)
      const next = flatIds[k === 'j' ? i + 1 : i - 1]
      if (next) {
        e.preventDefault()
        openTask(next)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [selectedId, flatIds, openTask])

  const moveTask = (id: string, to: ColumnKey) =>
    setColumns((cols) => {
      const from = cols.find((c) => c.tasks.some((t) => t.id === id))
      if (!from || from.key === to) return cols
      const task = from.tasks.find((t) => t.id === id)!
      return cols.map((c) => {
        if (c.key === from.key) return { ...c, tasks: c.tasks.filter((t) => t.id !== id) }
        if (c.key === to) return { ...c, tasks: [...c.tasks, task] }
        return c
      })
    })

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id))
  const onDragOver = (e: DragOverEvent) => setOverCol((e.over?.id as ColumnKey | undefined) ?? null)
  const onDragEnd = (e: DragEndEvent) => {
    const id = String(e.active.id)
    const to = e.over?.id as ColumnKey | undefined
    setActiveId(null)
    setOverCol(null)
    if (to) moveTask(id, to)
  }

  const addTask = (col: ColumnKey) => {
    counter.current += 1
    const id = `n${counter.current}`
    const task: BoardTask = { id, title: 'Việc mới', priority: 'medium', labels: [], assignee: { initials: user.initials, name: user.name, tone: 'container' } }
    setColumns((cols) => cols.map((c) => (c.key === col ? { ...c, tasks: [...c.tasks, task] } : c)))
    setNewTaskId(id)
    openTask(id)
  }

  const patchTask = (id: string, patch: TaskPatch) => {
    if (patch.description !== undefined) setDescriptions((d) => ({ ...d, [id]: patch.description! }))
    if ('title' in patch || 'priority' in patch) {
      setColumns((cols) =>
        cols.map((c) => ({
          ...c,
          tasks: c.tasks.map((t) => (t.id === id ? { ...t, ...('title' in patch ? { title: patch.title! } : {}), ...('priority' in patch ? { priority: patch.priority } : {}) } : t)),
        })),
      )
    }
  }

  const changeStatus = (id: string, to: ColumnKey) => {
    const from = findTask(id)?.column
    if (!from || from === to) return
    moveTask(id, to)
    toast({ message: `Đã chuyển sang "${statusByColumn[to]}"`, action: { label: 'Hoàn tác', onClick: () => moveTask(id, from) } })
  }

  const confirmDelete = () => {
    const found = deleteId ? findTask(deleteId) : null
    setDeleteId(null)
    if (!found) return
    const col = columns.find((c) => c.key === found.column)!
    const index = col.tasks.findIndex((t) => t.id === found.task.id)
    setColumns((cols) => cols.map((c) => (c.key === found.column ? { ...c, tasks: c.tasks.filter((t) => t.id !== found.task.id) } : c)))
    closeTask()
    toast({
      message: 'Đã xóa 1 việc',
      action: {
        label: 'Hoàn tác',
        onClick: () => setColumns((cols) => cols.map((c) => (c.key === found.column ? { ...c, tasks: [...c.tasks.slice(0, index), found.task, ...c.tasks.slice(index)] } : c))),
      },
    })
  }

  const chips: FilterChip[] = [
    { key: 'mine', icon: 'person', label: 'Việc của tôi', active: mineOnly, onToggle: () => setMineOnly((v) => !v) },
    { key: 'high', icon: 'flag', label: 'Khẩn cấp & Cao', active: highOnly, onToggle: () => setHighOnly((v) => !v) },
    { key: 'overdue', icon: 'event_busy', label: 'Quá hạn', active: overdueOnly, onToggle: () => setOverdueOnly((v) => !v) },
  ]
  const clearFilters = () => {
    setSearch('')
    setMineOnly(false)
    setHighOnly(false)
    setOverdueOnly(false)
  }

  const meta = empty ? (
    <>0 việc • Không gian mới tạo</>
  ) : (
    <>
      {filterCount > 0 ? `Đang hiện ${shown}/${total} việc` : `${total} việc đang theo dõi`}
      {!canEdit && (
        <span className="ml-3 inline-flex items-center gap-1 rounded-full border border-border bg-surface-variant px-2.5 py-1 font-body-medium text-[12px] text-text-secondary shadow-sm">
          <Icon name="visibility" size={16} />
          <span className="font-semibold text-text-primary">Chỉ xem</span>
        </span>
      )}
    </>
  )

  const detail = selected
    ? (() => {
        const base = getTaskDetail(selected.task, selected.column)
        return { ...base, title: selected.task.title, description: descriptions[selected.task.id] ?? base.description }
      })()
    : null

  return (
    <>
      {showDev && (
        <div className="flex flex-wrap gap-space-sm pb-space-md">
          <Button variant="subtle" size="xs" onClick={() => setRole(role === 'viewer' ? 'owner' : 'viewer')}>Demo: quyền ({role})</Button>
          <Button variant="subtle" size="xs" onClick={() => setAiStatus(aiOffline ? 'online' : 'offline')}>Demo: AI {aiStatus}</Button>
          <Button variant="subtle" size="xs" onClick={() => setEmpty(!empty)}>Demo: bảng trống</Button>
          <Button variant="subtle" size="xs" onClick={() => setBoardState(boardState === 'loading' ? 'ready' : 'loading')}>Demo: đang tải</Button>
          <Button variant="subtle" size="xs" onClick={() => setBoardState(boardState === 'error' ? 'ready' : 'error')}>Demo: lỗi</Button>
        </div>
      )}
      <PageHeader
        icon="view_kanban"
        title="Sprint 41 - Q4 Feature Delivery"
        chevron
        meta={{ text: meta, dot: empty ? 'muted' : 'success' }}
        actions={
          <Button size="md" icon="add_task" lockedReason={lock} onClick={() => addTask('todo')}>
            Tạo việc
          </Button>
        }
      >
        <FilterBar search={search} onSearchChange={setSearch} chips={chips} activeCount={filterCount} onClear={clearFilters} view={view} onViewChange={setView} />
        {aiOffline && bannerOpen && (
          <Banner
            tone="warning"
            icon="warning"
            title="Tính năng AI tạm thời không khả dụng do gián đoạn dịch vụ."
            description="Ghi chú, việc và tài liệu vẫn hoạt động bình thường."
            badge="AI Offline"
            onDismiss={() => setBannerOpen(false)}
          />
        )}
      </PageHeader>

      {boardState === 'loading' ? (
        <SkeletonGroup label="Đang tải bảng công việc" className="grid grid-cols-[repeat(4,minmax(240px,1fr))] gap-space-md overflow-x-auto">
          {[3, 4, 2, 3].map((n, i) => (
            <div key={i} className="space-y-space-sm rounded-xl bg-surface-variant/70 p-space-sm">
              <Skeleton className="h-5 w-1/2" />
              {Array.from({ length: n }).map((_, j) => (
                <Skeleton key={j} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ))}
        </SkeletonGroup>
      ) : boardState === 'error' ? (
        <EmptyState
          className="min-h-[320px]"
          illustration={<Icon name="cloud_off" size={28} className="text-[48px] text-status-error-text" />}
          title="Không tải được bảng công việc"
          description="Kết nối tới máy chủ bị gián đoạn. Dữ liệu của bạn không bị mất. Thử tải lại sau ít giây."
          actions={
            <Button icon="refresh" onClick={() => setBoardState('ready')}>
              Thử lại
            </Button>
          }
        />
      ) : empty ? (
        <BoardEmpty />
      ) : view === 'table' ? (
        <div className="flex items-start gap-space-md">
          <TaskTable columns={visibleColumns} selectedId={selectedId} onOpen={openTask} />
          {renderPanel()}
        </div>
      ) : (
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
          <div className="flex items-start gap-space-md">
            <div className="min-w-0 flex-1 overflow-x-auto pb-2">
              <div className="grid min-w-full grid-cols-[repeat(4,minmax(240px,1fr))] items-start gap-space-md">
                {visibleColumns.map((c) => (
                  <KanbanColumn
                    key={c.key}
                    column={c}
                    selectedId={selectedId}
                    canEdit={canEdit}
                    aiPaused={aiOffline}
                    compact={!!selected}
                    filtered={filterCount > 0}
                    showDrop={!!activeId && overCol === c.key && findTask(activeId)?.column !== c.key}
                    demoDragTaskId={demoDrag && c.key === 'doing' ? 't6' : null}
                    onOpenTask={openTask}
                    onAddCard={() => addTask(c.key)}
                  />
                ))}
              </div>
            </div>
            {renderPanel()}
          </div>
          <DragOverlay>{activeTask ? <TaskCard task={activeTask} variant="dragged" compact={!!selected} /> : null}</DragOverlay>
        </DndContext>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Xóa việc này?"
        description="Việc sẽ bị xóa khỏi bảng. Bạn có thể hoàn tác ngay sau khi xóa."
        confirmLabel="Xóa việc"
        tone="destructive"
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </>
  )

  function renderPanel() {
    if (!selected || !detail) return null
    return (
      <TaskPanel
        key={selected.task.id}
        detail={detail}
        status={selected.column}
        priority={selected.task.priority}
        readOnly={!canEdit}
        focusTitle={selected.task.id === newTaskId}
        onChange={(patch) => patchTask(selected.task.id, patch)}
        onMove={(to) => changeStatus(selected.task.id, to)}
        onDelete={() => setDeleteId(selected.task.id)}
        onOpenSource={() => navigate('/ghi-am/demo')}
        onClose={closeTask}
      />
    )
  }
}
