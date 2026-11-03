import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/layout'
import { Avatar, Button, Icon, Tabs } from '../../components/ui'
import { useActivity } from '../../context/activity-context'
import { useWorkspace } from '../../context/WorkspaceContext'
import type { ActivityGroup, ActivityKind } from '../../types/activity'

const kindIcon: Record<ActivityKind, string> = { task: 'task_alt', note: 'description', document: 'folder', recording: 'mic', member: 'group', space: 'folder_supervised' }
const groups: ActivityGroup[] = ['Hôm nay', 'Hôm qua', 'Trước đó']
type Filter = 'all' | ActivityKind

const tabs = [
  { key: 'all', label: 'Tất cả' },
  { key: 'task', label: 'Việc' },
  { key: 'note', label: 'Ghi chú' },
  { key: 'document', label: 'Tài liệu' },
  { key: 'recording', label: 'Ghi âm' },
  { key: 'member', label: 'Thành viên' },
]

/** FR-COL-04: lịch sử các thay đổi quan trọng trong Space. Mọi vai trò đều xem được. */
export default function ActivityPage() {
  const { activity } = useActivity()
  const { space } = useWorkspace()
  const [kind, setKind] = useState<Filter>('all')
  const [who, setWho] = useState('all')

  const people = useMemo(() => Array.from(new Set(activity.map((a) => a.actor))), [activity])
  const shown = activity.filter((a) => (kind === 'all' || a.kind === kind || (kind === 'member' && a.kind === 'space')) && (who === 'all' || a.actor === who))
  const filtered = kind !== 'all' || who !== 'all'

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader icon="history" title="Hoạt động" meta={{ text: `${activity.length} thay đổi trong ${space.name}` }} />

      <div className="mb-space-md flex flex-wrap items-center gap-space-sm">
        <Tabs tone="brand" dense className="w-full sm:w-auto" value={kind} onChange={(k) => setKind(k as Filter)} items={tabs} />
        <label className="flex items-center gap-2 font-body-default text-body-default text-text-secondary">
          <span>Người thực hiện</span>
          <select
            value={who}
            onChange={(e) => setWho(e.target.value)}
            className="h-9 rounded-lg border border-border-strong bg-surface-variant px-2 font-body-default text-body-default text-text-primary focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="all">Mọi người</option>
            {people.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>
      </div>

      {shown.length === 0 ? (
        <div className="flex flex-col items-center gap-space-sm rounded-2xl border border-border bg-surface px-space-md py-space-xl text-center shadow-sm">
          <Icon name="history_toggle_off" size={28} className="text-text-secondary" />
          <p className="font-body-medium text-body-medium text-text-primary">{filtered ? 'Không có hoạt động khớp bộ lọc' : 'Chưa có hoạt động nào'}</p>
          {filtered && (
            <Button size="sm" variant="outline" onClick={() => { setKind('all'); setWho('all') }}>
              Xóa bộ lọc
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-space-lg">
          {groups.map((g) => {
            const items = shown.filter((a) => a.group === g)
            if (items.length === 0) return null
            return (
              <section key={g} aria-labelledby={`g-${g}`}>
                <h2 id={`g-${g}`} className="mb-space-sm font-card-title text-card-title text-text-primary">{g}</h2>
                <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                  {items.map((a) => (
                    <li key={a.id} className="flex items-start gap-space-sm px-space-md py-space-sm">
                      <Avatar initials={a.initials} size={8} tone="neutral" />
                      <div className="min-w-0 flex-1">
                        <p className="font-body-default text-body-default text-text-primary">
                          <span className="font-body-medium text-body-medium">{a.actor}</span> {a.text}
                          {a.target && (
                            <>
                              {' '}
                              <Link to={a.target.href} className="font-body-medium text-body-medium text-brand underline-offset-2 hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                                {a.target.label}
                              </Link>
                            </>
                          )}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 font-caption text-caption text-text-secondary">
                          <Icon name={kindIcon[a.kind]} size={13} />
                          {a.time}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
