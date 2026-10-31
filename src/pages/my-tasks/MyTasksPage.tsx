import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout'
import { TaskListItem } from '../../components/domain'
import { Badge, Icon, Tabs, useToast } from '../../components/ui'
import { useWorkspace } from '../../context/WorkspaceContext'
import { allTasks, bucketMeta, isOpen, tasksFor, type DueBucket, type MyTaskTab, type TaskEntry } from '../../mocks/myTasks'

const tabs: { key: MyTaskTab; label: string }[] = [
  { key: 'assigned', label: 'Giao cho tôi' },
  { key: 'created', label: 'Tôi tạo' },
  { key: 'watching', label: 'Đang theo dõi' },
]
const empty: Record<MyTaskTab, string> = {
  assigned: 'Bạn chưa có việc nào được giao.',
  created: 'Bạn chưa tạo việc nào giao cho người khác.',
  watching: 'Bạn chưa theo dõi việc nào.',
}

/** Công việc của tôi: nhóm theo hạn, ba tab theo mối quan hệ (FR-TASK-07). */
export default function MyTasksPage() {
  const { canEdit, setRole } = useWorkspace()
  const { toast } = useToast()
  const [params] = useSearchParams()
  const [tab, setTab] = useState<MyTaskTab>('assigned')
  const [doneIds, setDoneIds] = useState<string[]>([])
  const [showDone, setShowDone] = useState(false)

  useEffect(() => {
    if (params.get('role') === 'viewer') setRole('viewer')
  }, [params, setRole])

  const bucketOf = (t: TaskEntry): DueBucket => (doneIds.includes(t.id) ? 'done' : t.bucket)
  const list = tasksFor(tab)
  const openCount = (k: MyTaskTab) => tasksFor(k).filter((t) => isOpen(t) && !doneIds.includes(t.id)).length
  const items = tabs.map((t) => ({ key: t.key, label: t.label, badge: String(openCount(t.key)) }))

  const setDone = (t: TaskEntry, v: boolean) => {
    setDoneIds((ids) => (v ? [...ids, t.id] : ids.filter((x) => x !== t.id)))
    if (v) toast({ message: `Đã hoàn thành "${t.title}"`, tone: 'success', action: { label: 'Hoàn tác', onClick: () => setDoneIds((ids) => ids.filter((x) => x !== t.id)) } })
  }

  const total = allTasks.length
  return (
    <div className="space-y-space-lg">
      <PageHeader icon="check_circle" title="Công việc của tôi" />
      <Tabs items={items} value={tab} onChange={(k) => setTab(k as MyTaskTab)} tone="brand" />
      {list.length === 0 && <p className="rounded-xl bg-surface p-space-lg text-center font-body-default text-body-default text-text-secondary shadow-sm">{empty[tab]}</p>}
      {bucketMeta.map((b) => {
        const rows = list.filter((t) => bucketOf(t) === b.key)
        if (rows.length === 0) return null
        const collapsible = b.key === 'done'
        const open = !collapsible || showDone
        return (
          <section key={b.key} aria-label={b.label} className="space-y-space-sm">
            <h2 className="flex items-center gap-2 font-card-title text-card-title text-text-primary">
              {collapsible ? (
                <button type="button" aria-expanded={open} onClick={() => setShowDone(!showDone)} className="inline-flex items-center gap-1 rounded outline-none focus-visible:ring-2 focus-visible:ring-brand">
                  <Icon name={open ? 'expand_more' : 'chevron_right'} size={20} />
                  {b.label}
                </button>
              ) : (
                <>
                  {b.key === 'overdue' && <Icon name="event_busy" size={18} className="text-status-warning-text" />}
                  {b.label}
                </>
              )}
              <Badge tone={b.key === 'overdue' ? 'warning' : 'neutral'} size="sm">{rows.length}</Badge>
            </h2>
            {open && (
              <div className="space-y-2">
                {rows.map((t) => (
                  <TaskListItem
                    key={t.id}
                    density="compact"
                    title={t.title}
                    priority={t.priority}
                    source={t.source}
                    due={t.dueLabel ? { label: t.dueLabel, overdue: b.key === 'overdue' } : undefined}
                    assignee={{ ...t.assignee, tone: 'container' }}
                    checked={bucketOf(t) === 'done'}
                    onCheckedChange={(v) => setDone(t, v)}
                    disabled={!canEdit}
                  />
                ))}
              </div>
            )}
          </section>
        )
      })}
      <p className="sr-only">Tổng {total} việc trong không gian</p>
    </div>
  )
}
