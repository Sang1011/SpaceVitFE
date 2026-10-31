import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout'
import { Badge, Button, Icon, IconButton, SidePanel, Tabs, useToast } from '../../components/ui'
import { useWorkspace } from '../../context/WorkspaceContext'
import { cn } from '../../lib/cn'
import { calEvents, TODAY, type CalEvent, type CalKind } from '../../mocks/calendar'

type View = 'month' | 'week' | 'list'
const views = [
  { key: 'month', label: 'Tháng' },
  { key: 'week', label: 'Tuần' },
  { key: 'list', label: 'Danh sách' },
]
const weekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

const toDate = (s: string) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d, 12)
}
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const addDays = (s: string, n: number) => {
  const d = toDate(s)
  d.setDate(d.getDate() + n)
  return iso(d)
}
const mondayOf = (s: string) => addDays(s, -((toDate(s).getDay() + 6) % 7))
const dm = (s: string) => `${s.slice(8)}/${s.slice(5, 7)}`

/** Mỗi loại có icon và kiểu riêng để không dựa vào màu: hạn của việc, nhắc nhở cá nhân, ngày giờ AI trích (nét đứt). */
const kindStyle: Record<CalKind, { icon: string; chip: string; label: string }> = {
  due: { icon: 'task_alt', chip: 'bg-brand/15 text-brand', label: 'Hạn của việc' },
  reminder: { icon: 'notifications', chip: 'bg-status-warning/15 text-status-warning-text', label: 'Nhắc nhở' },
  pending: { icon: 'lightbulb', chip: 'border border-dashed border-ai-accent bg-surface text-ai-accent', label: 'Chờ xác nhận' },
}

function Chip({ e, selected, onOpen }: { e: CalEvent; selected: boolean; onOpen: (id: string) => void }) {
  const k = kindStyle[e.kind]
  return (
    <button
      type="button"
      onClick={() => onOpen(e.id)}
      aria-label={`${k.label}: ${e.title}${e.time ? `, ${e.time}` : ''}`}
      className={cn('flex w-full items-center gap-1 truncate rounded-md px-1.5 py-0.5 text-left font-caption text-[11px] outline-none focus-visible:ring-2 focus-visible:ring-brand', k.chip, selected && 'ring-2 ring-brand', e.done && 'line-through opacity-60')}
    >
      <Icon name={k.icon} size={13} className="shrink-0" />
      <span className="truncate">{e.time && `${e.time} `}{e.title}</span>
    </button>
  )
}

/** Lịch & Nhắc nhở: Tháng / Tuần / Danh sách, lọc Của tôi / Cả nhóm, Xong và Hoãn trên nhắc nhở. */
export default function CalendarPage() {
  const { canEdit, setRole } = useWorkspace()
  const { toast } = useToast()
  const [params] = useSearchParams()
  const [view, setView] = useState<View>('month')
  const [anchor, setAnchor] = useState(TODAY)
  const [scope, setScope] = useState<'me' | 'team'>('me')
  const [events, setEvents] = useState<CalEvent[]>(params.get('empty') === '1' ? [] : calEvents)
  const [selId, setSelId] = useState<string | null>(null)
  const locked = canEdit ? undefined : 'Bạn chỉ có quyền xem'

  useEffect(() => {
    if (params.get('role') === 'viewer') setRole('viewer')
  }, [params, setRole])

  const visible = useMemo(() => events.filter((e) => scope === 'team' || e.owner === 'me').sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)), [events, scope])
  const byDate = (d: string) => visible.filter((e) => e.date === d)
  const sel = events.find((e) => e.id === selId) ?? null

  const shift = (dir: -1 | 1) => {
    if (view === 'week') setAnchor(addDays(anchor, 7 * dir))
    else {
      const d = toDate(anchor)
      d.setDate(1)
      d.setMonth(d.getMonth() + dir)
      setAnchor(iso(d))
    }
  }
  const label = view === 'week' ? `${dm(mondayOf(anchor))} đến ${dm(addDays(mondayOf(anchor), 6))}` : `Tháng ${anchor.slice(5, 7)}/${anchor.slice(0, 4)}`

  const monthStart = mondayOf(`${anchor.slice(0, 7)}-01`)
  const first = toDate(`${anchor.slice(0, 7)}-01`)
  const monthLen = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  const weeksNeeded = Math.ceil((((first.getDay() + 6) % 7) + monthLen) / 7)
  const monthDays = Array.from({ length: weeksNeeded * 7 }, (_, i) => addDays(monthStart, i))
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(mondayOf(anchor), i))

  const patch = (id: string, p: Partial<CalEvent>) => setEvents((es) => es.map((e) => (e.id === id ? { ...e, ...p } : e)))
  const markDone = (e: CalEvent) => {
    patch(e.id, { done: true })
    toast({ message: 'Đã đánh dấu xong', tone: 'success', action: { label: 'Hoàn tác', onClick: () => patch(e.id, { done: false }) } })
  }
  const snooze = (e: CalEvent) => {
    const from = e.date
    patch(e.id, { date: addDays(e.date, 1) })
    toast({ message: `Đã hoãn sang ${dm(addDays(from, 1))}`, action: { label: 'Hoàn tác', onClick: () => patch(e.id, { date: from }) } })
  }
  const confirm = (e: CalEvent) => {
    patch(e.id, { kind: 'reminder' })
    toast({ message: 'Đã xác nhận và thêm vào lịch', tone: 'success', action: { label: 'Hoàn tác', onClick: () => patch(e.id, { kind: 'pending' }) } })
  }
  const dismiss = (e: CalEvent) => {
    const before = events
    setEvents((es) => es.filter((x) => x.id !== e.id))
    setSelId(null)
    toast({ message: 'Đã bỏ gợi ý', action: { label: 'Hoàn tác', onClick: () => setEvents(before) } })
  }

  const dayHeader = (d: string) => (
    <span className={cn('inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 font-caption text-caption', d === TODAY ? 'bg-primary-container font-semibold text-on-primary' : 'text-text-secondary')}>{Number(d.slice(8))}</span>
  )
  const renderDay = (d: string, max: number, dim?: boolean) => {
    const evs = byDate(d)
    return (
      <div key={d} className={cn('min-h-[104px] space-y-1 border-b border-r border-border/60 p-1.5', dim && 'bg-surface-variant/40')}>
        {dayHeader(d)}
        {evs.slice(0, max).map((e) => <Chip key={e.id} e={e} selected={e.id === selId} onOpen={setSelId} />)}
        {evs.length > max && <button type="button" onClick={() => { setView('list'); setAnchor(d) }} className="rounded px-1 font-caption text-[11px] text-text-secondary hover:text-text-primary">+{evs.length - max} nữa</button>}
      </div>
    )
  }

  const listDates = [...new Set(visible.map((e) => e.date))]

  return (
    <div className="flex items-start gap-space-lg">
      <div className="min-w-0 flex-1 space-y-space-md">
        <PageHeader icon="calendar_today" title="Lịch & Nhắc nhở" />
        <div className="flex flex-wrap items-center gap-space-sm">
          <Tabs items={views} value={view} onChange={(k) => setView(k as View)} tone="brand" className="w-full sm:w-72" />
          {view !== 'list' && (
            <div className="flex items-center gap-1">
              <IconButton icon="chevron_left" label="Trước" variant="soft" onClick={() => shift(-1)} />
              <span className="min-w-[8.5rem] text-center font-card-title text-card-title text-text-primary">{label}</span>
              <IconButton icon="chevron_right" label="Sau" variant="soft" onClick={() => shift(1)} />
              <Button variant="subtle" size="md" onClick={() => setAnchor(TODAY)} className="text-text-primary">Hôm nay</Button>
            </div>
          )}
          <div role="group" aria-label="Phạm vi" className="ml-auto flex gap-1 rounded-lg bg-surface p-1 shadow-sm">
            {(['me', 'team'] as const).map((s) => (
              <button key={s} type="button" aria-pressed={scope === s} onClick={() => setScope(s)} className={cn('rounded-md px-3 py-1 font-body-medium text-body-medium outline-none focus-visible:ring-2 focus-visible:ring-brand', scope === s ? 'bg-primary-fixed text-brand' : 'text-text-secondary hover:text-text-primary')}>
                {s === 'me' ? 'Của tôi' : 'Cả nhóm'}
              </button>
            ))}
          </div>
        </div>

        <ul aria-label="Chú giải" className="flex flex-wrap gap-x-4 gap-y-1 font-caption text-caption text-text-secondary">
          {(Object.keys(kindStyle) as CalKind[]).map((k) => (
            <li key={k} className="flex items-center gap-1"><span className={cn('inline-flex h-5 w-5 items-center justify-center rounded', kindStyle[k].chip)}><Icon name={kindStyle[k].icon} size={13} /></span>{kindStyle[k].label}</li>
          ))}
        </ul>

        {events.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center gap-2 rounded-xl bg-surface text-center shadow-sm">
            <Icon name="event_available" size={28} className="text-text-secondary" />
            <p className="font-card-title text-card-title text-text-primary">Chưa có sự kiện nào</p>
            <p className="max-w-sm font-caption text-caption text-text-secondary">Hạn của việc và nhắc nhở sẽ hiện ở đây. Bạn có thể nhờ Trợ lý AI tạo nhắc nhở bằng một câu.</p>
          </div>
        ) : view === 'month' ? (
          <div className="overflow-hidden rounded-xl bg-surface shadow-sm">
            <div className="grid grid-cols-7 border-b border-border/60 bg-surface-variant/60">
              {weekdays.map((w) => <div key={w} className="px-2 py-1.5 font-caption text-caption font-semibold text-text-secondary">{w}</div>)}
            </div>
            <div className="grid grid-cols-7 [&>div:nth-child(7n)]:border-r-0">
              {monthDays.map((d) => renderDay(d, 3, d.slice(0, 7) !== anchor.slice(0, 7)))}
            </div>
          </div>
        ) : view === 'week' ? (
          <div className="grid grid-cols-1 gap-space-sm md:grid-cols-7">
            {weekDays.map((d, i) => (
              <section key={d} aria-label={`${weekdays[i]} ${dm(d)}`} className="min-h-[160px] space-y-1.5 rounded-xl bg-surface p-2 shadow-sm">
                <h3 className="flex items-center gap-1 font-caption text-caption font-semibold text-text-secondary">{weekdays[i]} {dayHeader(d)}</h3>
                {byDate(d).map((e) => <Chip key={e.id} e={e} selected={e.id === selId} onOpen={setSelId} />)}
                {byDate(d).length === 0 && <p className="font-caption text-[11px] text-text-secondary/70">Trống</p>}
              </section>
            ))}
          </div>
        ) : (
          <div className="space-y-space-md">
            {listDates.length === 0 && <p className="rounded-xl bg-surface p-space-lg text-center font-body-default text-body-default text-text-secondary shadow-sm">Không có sự kiện trong phạm vi này.</p>}
            {listDates.map((d) => (
              <section key={d} aria-label={dm(d)} className="space-y-1.5">
                <h3 className="font-card-title text-card-title text-text-primary">{d === TODAY ? 'Hôm nay' : dm(d)} <span className="font-caption text-caption text-text-secondary">{d === TODAY ? dm(d) : ''}</span></h3>
                <ul className="divide-y divide-border overflow-hidden rounded-xl bg-surface shadow-sm">
                  {byDate(d).map((e) => (
                    <li key={e.id}>
                      <button type="button" onClick={() => setSelId(e.id)} className={cn('flex w-full items-center gap-3 px-space-md py-2.5 text-left outline-none hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand', e.id === selId && 'bg-primary-fixed/30')}>
                        <span className="w-12 shrink-0 font-caption text-caption tabular-nums text-text-secondary">{e.time || 'Cả ngày'}</span>
                        <span className={cn('inline-flex h-6 w-6 shrink-0 items-center justify-center rounded', kindStyle[e.kind].chip)}><Icon name={kindStyle[e.kind].icon} size={16} /></span>
                        <span className={cn('min-w-0 flex-1 truncate font-body-medium text-body-medium text-text-primary', e.done && 'line-through opacity-60')}>{e.title}</span>
                        {e.source?.kind === 'assistant' && <Badge tone="ai" size="sm">Trợ lý AI</Badge>}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>

      <SidePanel open={sel !== null} onClose={() => setSelId(null)} title="Chi tiết sự kiện" className="dock:sticky dock:top-[72px] dock:h-[calc(100vh-88px)] dock:self-start" header={<h2 className="font-card-title text-card-title text-text-primary">Chi tiết sự kiện</h2>}>
        {sel && (
          <div className="space-y-space-md">
            <div className="flex items-center gap-2">
              <span className={cn('inline-flex h-7 w-7 items-center justify-center rounded', kindStyle[sel.kind].chip)}><Icon name={kindStyle[sel.kind].icon} size={18} /></span>
              <span className="font-caption text-caption font-semibold text-text-secondary">{kindStyle[sel.kind].label}</span>
              {sel.source?.kind === 'assistant' && <Badge tone="ai" size="sm">Do Trợ lý AI tạo</Badge>}
            </div>
            <h3 className={cn('font-section-title text-section-title text-text-primary', sel.done && 'line-through opacity-60')}>{sel.title}</h3>
            <dl className="space-y-2 font-body-default text-body-default">
              <div className="flex justify-between gap-2"><dt className="text-text-secondary">Ngày</dt><dd className="text-text-primary">{dm(sel.date)}/{sel.date.slice(0, 4)}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-text-secondary">Giờ</dt><dd className="text-text-primary">{sel.time || 'Cả ngày'}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-text-secondary">Của</dt><dd className="text-text-primary">{sel.ownerName}</dd></div>
              {sel.source && <div className="flex justify-between gap-2"><dt className="text-text-secondary">Nguồn</dt><dd className="text-right text-text-primary">{sel.source.label}</dd></div>}
            </dl>
            {sel.kind === 'pending' ? (
              <>
                <p className="rounded-lg border border-dashed border-ai-accent p-2 font-caption text-caption text-text-secondary">AI đoán ngày giờ này từ nguồn trên. Chỉ thành sự kiện khi bạn xác nhận.</p>
                <div className="flex flex-wrap gap-2">
                  <Button icon="check_circle" onClick={() => confirm(sel)} lockedReason={locked}>Xác nhận</Button>
                  <Button variant="ghost" onClick={() => dismiss(sel)} lockedReason={locked} className="hover:text-status-error-text">Bỏ qua</Button>
                </div>
              </>
            ) : sel.kind === 'reminder' ? (
              <div className="flex flex-wrap gap-2">
                <Button icon="check" disabled={sel.done} onClick={() => markDone(sel)} lockedReason={locked}>Xong</Button>
                <Button variant="subtle" icon="snooze" onClick={() => snooze(sel)} lockedReason={locked} className="text-text-primary">Hoãn 1 ngày</Button>
              </div>
            ) : (
              <p className="font-caption text-caption text-text-secondary">Hạn của việc được đổi ở Bảng công việc.</p>
            )}
          </div>
        )}
      </SidePanel>
    </div>
  )
}
