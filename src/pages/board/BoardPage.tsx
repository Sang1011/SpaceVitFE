import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragOverEvent, type DragStartEvent } from '@dnd-kit/core'
import { FilterBar, PageHeader, type BoardView } from '../../components/layout'
import { Banner, Button, Icon } from '../../components/ui'
import { useWorkspace } from '../../context/WorkspaceContext'
import { boardColumns, getTaskDetail, selectedTaskId } from '../../mocks/board'
import type { BoardColumnData, BoardTask, ColumnKey } from '../../types/board'
import { BoardEmpty } from './BoardEmpty'
import { KanbanColumn } from './KanbanColumn'
import { TaskCard } from './TaskCard'
import { TaskDrawer } from './TaskDrawer'

/**
 * Board page (Stitch W8 + variants). Variants are state, not separate screens:
 * viewer (role), AI offline (aiStatus), dark (theme), empty (?empty=1).
 * Demo query params: ?role=viewer, ?ai=offline, ?empty=1, ?drag=1 (static lifted card), ?dev=1 (shows the demo bar).
 */
export default function BoardPage() {
  const { canEdit, role, setRole, aiStatus, setAiStatus } = useWorkspace()
  const [params] = useSearchParams()
  const [columns, setColumns] = useState<BoardColumnData[]>(boardColumns)
  const [selectedId, setSelectedId] = useState<string | null>(selectedTaskId)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overCol, setOverCol] = useState<ColumnKey | null>(null)
  const [search, setSearch] = useState('')
  const [mineOnly, setMineOnly] = useState(false)
  const [view, setView] = useState<BoardView>('kanban')
  const [bannerOpen, setBannerOpen] = useState(true)
  const [empty, setEmpty] = useState(params.get('empty') === '1')
  const demoDrag = params.get('drag') === '1'
  const showDev = import.meta.env.DEV || params.get('dev') === '1'

  useEffect(() => {
    if (params.get('role') === 'viewer') setRole('viewer')
    if (params.get('ai') === 'offline') setAiStatus('offline')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const aiOffline = aiStatus === 'offline'
  const lock = canEdit ? undefined : 'Bạn chỉ có quyền xem'

  const visibleColumns = useMemo(
    () =>
      columns.map((c) => ({
        ...c,
        tasks: c.tasks.filter(
          (t) => t.title.toLowerCase().includes(search.toLowerCase()) && (!mineOnly || t.assignee.initials === 'NA'),
        ),
      })),
    [columns, search, mineOnly],
  )
  const total = columns.reduce((n, c) => n + c.tasks.length + (c.hidden ?? 0), 0)
  const findTask = (id: string): { task: BoardTask; column: ColumnKey } | null => {
    for (const c of columns) {
      const task = c.tasks.find((t) => t.id === id)
      if (task) return { task, column: c.key }
    }
    return null
  }
  const activeTask = activeId ? findTask(activeId)?.task : null
  const selected = selectedId ? findTask(selectedId) : null

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id))
  const onDragOver = (e: DragOverEvent) => setOverCol((e.over?.id as ColumnKey | undefined) ?? null)
  const onDragEnd = (e: DragEndEvent) => {
    const id = String(e.active.id)
    const to = e.over?.id as ColumnKey | undefined
    setActiveId(null)
    setOverCol(null)
    if (!to) return
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
  }

  const meta = empty ? (
    <>0 công việc • Không gian mới tạo</>
  ) : (
    <>
      {total} công việc đang theo dõi
      {!canEdit && (
        <span className="ml-3 inline-flex items-center gap-1 rounded-full border border-border bg-surface-variant px-2.5 py-1 font-body-medium text-[12px] text-text-secondary shadow-sm">
          <Icon name="visibility" size={16} />
          <span className="font-semibold text-text-primary">Chỉ xem (Viewer)</span>
        </span>
      )}
    </>
  )

  return (
    <>
      {showDev && (
        <div className="flex flex-wrap gap-space-sm pb-space-md">
          <Button variant="subtle" size="xs" onClick={() => setRole(role === 'viewer' ? 'owner' : 'viewer')}>Demo: quyền ({role})</Button>
          <Button variant="subtle" size="xs" onClick={() => setAiStatus(aiOffline ? 'online' : 'offline')}>Demo: AI {aiStatus}</Button>
          <Button variant="subtle" size="xs" onClick={() => setEmpty(!empty)}>Demo: bảng trống</Button>
        </div>
      )}
      <PageHeader
        icon="view_kanban"
        title="Sprint 41 - Q4 Feature Delivery"
        chevron
        meta={{ text: meta, dot: empty ? 'muted' : 'success' }}
        actions={
          <>
            <Button variant="outline" size="md" className="bg-surface shadow-sm" icon="view_column" lockedReason={lock}>+ Thêm cột</Button>
            <Button size="md" icon="add_task" lockedReason={lock}>+ Tạo task mới</Button>
          </>
        }
      >
        <FilterBar search={search} onSearchChange={setSearch} mineOnly={mineOnly} onMineOnlyChange={setMineOnly} view={view} onViewChange={setView} />
        {aiOffline && bannerOpen && (
          <Banner
            tone="warning"
            icon="warning"
            title="Tính năng AI tạm thời không khả dụng do gián đoạn dịch vụ."
            description="Ghi chú, task và tài liệu vẫn hoạt động bình thường."
            badge="AI Offline"
            onDismiss={() => setBannerOpen(false)}
          />
        )}
      </PageHeader>

      {empty ? (
        <BoardEmpty />
      ) : (
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
          <div className="relative flex min-h-[780px] w-full items-start gap-space-md overflow-hidden">
            <div className="min-w-0 flex-1 overflow-x-auto pb-2">
              <div
                className={
                  selected
                    ? 'grid w-max grid-cols-[repeat(4,240px)] items-start gap-space-md pr-[536px]'
                    : 'grid grid-cols-1 items-start gap-space-md md:grid-cols-2 lg:grid-cols-4'
                }
              >
              {visibleColumns.map((c) => (
                <KanbanColumn
                  key={c.key}
                  column={c}
                  selectedId={selectedId}
                  canEdit={canEdit}
                  aiPaused={aiOffline}
                  showDrop={!!activeId && overCol === c.key && findTask(activeId)?.column !== c.key}
                  demoDragTaskId={demoDrag && c.key === 'doing' ? 't6' : null}
                  onOpenTask={setSelectedId}
                />
              ))}
              </div>
            </div>
            {selected && (
              <TaskDrawer
                detail={getTaskDetail(selected.task, selected.column)}
                readOnly={!canEdit}
                onClose={() => setSelectedId(null)}
              />
            )}
          </div>
          <DragOverlay>{activeTask ? <TaskCard task={activeTask} variant="dragged" /> : null}</DragOverlay>
        </DndContext>
      )}
    </>
  )
}

