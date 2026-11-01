import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout'
import { Button, Icon, IconButton, ProgressBar, StatusChip } from '../../components/ui'
import { useWorkspace } from '../../context/WorkspaceContext'
import { cn } from '../../lib/cn'
import { docs as seedDocs, type DocItem, type DocKind } from '../../mocks/documents'
import { recStatuses, type RecStatus } from '../../mocks/recording'

const kindIcon: Record<DocKind, { name: string; cls: string }> = {
  pdf: { name: 'picture_as_pdf', cls: 'text-status-error-text' },
  docx: { name: 'description', cls: 'text-brand' },
  image: { name: 'image', cls: 'text-ai-accent' },
}

function meta(d: DocItem) {
  return (
    <>
      {d.pages} trang · {d.size} · {d.uploaded} · {d.by}
      {d.lowConfidence > 0 && <span className="font-medium text-status-warning-text"> · {d.lowConfidence} đoạn cần xem lại</span>}
    </>
  )
}

/** Thư viện tài liệu: tải lên, tìm, lọc theo trạng thái, xem dạng danh sách hoặc lưới. */
export default function DocumentsPage() {
  const { canEdit, setRole, user, lock } = useWorkspace()
  const [params] = useSearchParams()
  const [items, setItems] = useState<DocItem[]>(seedDocs)
  const [view, setView] = useState<'list' | 'grid'>('list')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<RecStatus | 'all'>('all')
  const [over, setOver] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const seq = useRef(0)
  const locked = lock('document.upload')

  useEffect(() => {
    if (params.get('role') === 'viewer') setRole('viewer')
  }, [params, setRole])

  useEffect(() => {
    if (!items.some((i) => i.status === 'processing')) return
    const t = setInterval(() => {
      setItems((list) =>
        list.map((i) => {
          if (i.status !== 'processing') return i
          const p = (i.progress ?? 0) + 10
          return p >= 100 ? { ...i, status: 'completed', progress: 100 } : { ...i, progress: p }
        }),
      )
    }, 1000)
    return () => clearInterval(t)
  }, [items])

  const add = (files: FileList | null) => {
    if (!canEdit || !files) return
    const added: DocItem[] = Array.from(files).map((f) => {
      seq.current += 1
      const kind: DocKind = /\.(png|jpe?g)$/i.test(f.name) ? 'image' : /\.docx?$/i.test(f.name) ? 'docx' : 'pdf'
      return { id: `up${seq.current}`, name: f.name.replace(/\.[^.]+$/, ''), kind, size: `${Math.max(1, Math.round(f.size / 1024))} KB`, pages: 1, uploaded: 'Vừa xong', by: user.name, status: 'processing', progress: 5, lowConfidence: 0 }
    })
    setItems((l) => [...added, ...l])
  }

  const shown = items.filter((d) => (status === 'all' || d.status === status) && d.name.toLowerCase().includes(q.trim().toLowerCase()))
  const filtered = q.trim() !== '' || status !== 'all'

  const statusEl = (d: DocItem) => (
    <>
      {d.status === 'processing' && <ProgressBar value={d.progress ?? 0} className="w-28" />}
      <StatusChip status={d.status} size="sm" />
    </>
  )

  return (
    <div className="space-y-space-lg">
      <PageHeader icon="folder" title="Tài liệu" />
      <div
        onDragOver={(e) => {
          if (!canEdit) return
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          add(e.dataTransfer.files)
        }}
        className={cn('flex flex-col items-center gap-2 rounded-xl border-2 border-dashed p-space-lg text-center transition-colors', over ? 'border-brand bg-brand/5' : 'border-border bg-surface')}
      >
        <Icon name="upload_file" size={28} className="text-text-secondary" />
        <p className="font-body-medium text-body-medium text-text-primary">{canEdit ? 'Kéo thả tệp vào đây hoặc chọn từ máy' : 'Chế độ chỉ xem: không thể tải lên'}</p>
        <p className="font-caption text-caption text-text-secondary">PDF, Word, ảnh scan. Tối đa 50 MB mỗi tệp.</p>
        <Button icon="upload" onClick={() => input.current?.click()} lockedReason={locked}>Chọn tệp</Button>
        <input ref={input} type="file" multiple accept=".pdf,.doc,.docx,image/*" className="sr-only" aria-label="Chọn tệp tài liệu" onChange={(e) => add(e.target.files)} />
      </div>

      <div className="flex flex-wrap items-center gap-space-sm">
        <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
          <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Tìm tài liệu" placeholder="Tìm tài liệu..." className="h-9 w-full rounded-lg bg-surface pl-9 pr-3 font-body-default text-body-default text-text-primary shadow-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand" />
        </div>
        <label>
          <span className="sr-only">Lọc theo trạng thái</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as RecStatus | 'all')} className="h-9 rounded-lg bg-surface px-2 font-body-medium text-body-medium text-text-primary shadow-sm outline-none focus:ring-2 focus:ring-brand">
            <option value="all">Mọi trạng thái</option>
            {recStatuses.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </label>
        <div role="group" aria-label="Kiểu xem" className="ml-auto flex gap-1 rounded-lg bg-surface p-1 shadow-sm">
          <IconButton icon="view_list" label="Xem dạng danh sách" variant={view === 'list' ? 'filled' : 'soft'} aria-pressed={view === 'list'} onClick={() => setView('list')} />
          <IconButton icon="grid_view" label="Xem dạng lưới" variant={view === 'grid' ? 'filled' : 'soft'} aria-pressed={view === 'grid'} onClick={() => setView('grid')} />
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="rounded-xl bg-surface p-space-lg text-center font-body-default text-body-default text-text-secondary shadow-sm">
          {filtered ? 'Không có tài liệu khớp bộ lọc.' : 'Chưa có tài liệu nào. Hãy tải một tệp lên.'}
        </p>
      ) : view === 'list' ? (
        <ul className="divide-y divide-border overflow-hidden rounded-xl bg-surface shadow-sm">
          {shown.map((d) => (
            <li key={d.id}>
              <Link to={`/tai-lieu/${d.id}`} className="flex flex-col gap-2 p-space-md outline-none transition-colors hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand sm:flex-row sm:items-center">
                <Icon name={kindIcon[d.kind].name} size={28} className={`shrink-0 ${kindIcon[d.kind].cls}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-card-title text-card-title text-text-primary">{d.name}</p>
                  <p className="font-caption text-caption text-text-secondary">{meta(d)}</p>
                </div>
                {statusEl(d)}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="grid grid-cols-1 gap-space-md sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((d) => (
            <li key={d.id}>
              <Link to={`/tai-lieu/${d.id}`} className="flex h-full flex-col gap-3 rounded-xl bg-surface p-space-md shadow-sm outline-none transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-brand">
                <div className="flex h-24 items-center justify-center rounded-lg bg-surface-variant">
                  <Icon name={kindIcon[d.kind].name} size={28} className={kindIcon[d.kind].cls} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-card-title text-card-title text-text-primary">{d.name}</p>
                  <p className="font-caption text-caption text-text-secondary">{meta(d)}</p>
                </div>
                <div className="flex items-center gap-2">{statusEl(d)}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
