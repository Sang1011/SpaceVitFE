import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Badge, Button, Icon, StatusChip, useToast } from '../../components/ui'
import { useWorkspace } from '../../context/WorkspaceContext'
import { cn } from '../../lib/cn'
import { docParas, docs, LOW_CONFIDENCE } from '../../mocks/documents'

/** Xem tài liệu chia đôi: bản gốc | văn bản đã trích xuất. Chọn đoạn ở bên nào thì đoạn tương ứng ở bên kia nổi lên (FR-DOC-07). */
export default function DocumentDetailPage() {
  const { id } = useParams()
  const { setRole, lock } = useWorkspace()
  const { toast } = useToast()
  const [params] = useSearchParams()
  const doc = docs.find((d) => d.id === id) ?? docs[0]
  const [activeId, setActiveId] = useState('p3')
  const [onlyLow, setOnlyLow] = useState(false)
  const [summary, setSummary] = useState<Record<string, string>>({})
  const textRef = useRef<HTMLDivElement>(null)
  const locked = lock('document.ai')

  useEffect(() => {
    if (params.get('role') === 'viewer') setRole('viewer')
  }, [params, setRole])
  useEffect(() => {
    textRef.current?.querySelector(`#para-${activeId}`)?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' })
  }, [activeId])

  const active = docParas.find((p) => p.id === activeId) ?? docParas[0]
  const lowCount = docParas.filter((p) => p.confidence < LOW_CONFIDENCE).length
  const shown = onlyLow ? docParas.filter((p) => p.confidence < LOW_CONFIDENCE) : docParas
  const pages = [...new Set(docParas.map((p) => p.page))]
  const goPage = (page: number) => {
    const first = docParas.find((p) => p.page === page)
    if (first) setActiveId(first.id)
  }

  const act = (kind: 'summary' | 'table' | 'note' | 'task') => {
    if (kind === 'summary') {
      setSummary((s) => ({ ...s, [active.id]: `${active.text.split('.').slice(0, 2).join('.').trim()}.` }))
    } else if (kind === 'table') {
      toast({ message: 'Không tìm thấy bảng trong đoạn này.' })
    } else if (kind === 'note') {
      toast({ message: 'Đã tạo ghi chú từ đoạn đã chọn', tone: 'success', action: { label: 'Hoàn tác', onClick: () => toast({ message: 'Đã hoàn tác' }) } })
    } else {
      toast({ message: 'Đã tạo việc từ đoạn đã chọn', tone: 'success', action: { label: 'Hoàn tác', onClick: () => toast({ message: 'Đã hoàn tác' }) } })
    }
  }

  return (
    <div className="space-y-space-md">
      <header className="flex flex-col justify-between gap-space-sm rounded-xl bg-surface p-space-md shadow-sm md:flex-row md:items-center">
        <div className="min-w-0 space-y-1">
          <Link to="/tai-lieu" className="inline-flex items-center gap-1 font-caption text-caption text-text-secondary hover:text-text-primary">
            <Icon name="arrow_back" size={16} />
            Tất cả tài liệu
          </Link>
          <h1 className="font-section-title text-section-title text-text-primary">{doc.name}</h1>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-caption text-caption text-text-secondary">
            {doc.pages} trang · {doc.size} · {doc.uploaded} <StatusChip status={doc.status} size="sm" />
          </p>
        </div>
        <div className="flex gap-space-sm">
          <Button variant="subtle" icon="download" className="text-text-primary">Tải về</Button>
          <Button variant="subtle" icon="share" className="text-text-primary">Chia sẻ</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-space-md lg:grid-cols-2">
        <section aria-label="Bản gốc" className="space-y-2 rounded-xl bg-surface p-space-md shadow-sm lg:sticky lg:top-[72px] lg:self-start">
          <div className="flex items-center justify-between">
            <h2 className="font-card-title text-card-title text-text-primary">Bản gốc</h2>
            <div className="flex items-center gap-1 font-caption text-caption text-text-secondary">
              <button type="button" aria-label="Trang trước" disabled={active.page === pages[0]} onClick={() => goPage(active.page - 1)} className="rounded p-0.5 outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-40"><Icon name="chevron_left" size={18} /></button>
              Trang {active.page} / {doc.pages}
              <button type="button" aria-label="Trang sau" disabled={active.page === pages[pages.length - 1]} onClick={() => goPage(active.page + 1)} className="rounded p-0.5 outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-40"><Icon name="chevron_right" size={18} /></button>
            </div>
          </div>
          <div className="space-y-2 rounded-lg bg-surface-variant p-space-md">
            {docParas.filter((p) => p.page === active.page).map((p) => (
              <button
                key={p.id}
                type="button"
                aria-label={`Đoạn ${p.id.slice(1)} trên bản gốc`}
                aria-pressed={p.id === activeId}
                onClick={() => setActiveId(p.id)}
                className={cn('block w-full space-y-1.5 rounded-md p-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand', p.id === activeId ? 'bg-ai-container ring-2 ring-ai-accent' : 'hover:bg-surface')}
              >
                {[100, 94, 78].map((w) => <span key={w} className="block h-2 rounded bg-text-secondary/30" style={{ width: `${w}%` }} />)}
              </button>
            ))}
          </div>
        </section>

        <section aria-label="Văn bản đã trích xuất" className="space-y-2 rounded-xl bg-surface p-space-md shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-card-title text-card-title text-text-primary">Văn bản đã trích xuất</h2>
            {lowCount > 0 && (
              <button type="button" aria-pressed={onlyLow} onClick={() => setOnlyLow(!onlyLow)} className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand">
                <Badge tone={onlyLow ? 'primary-solid' : 'warning'} size="sm">{onlyLow ? 'Hiện tất cả đoạn' : `${lowCount} đoạn cần xem lại`}</Badge>
              </button>
            )}
          </div>
          <div ref={textRef} className="space-y-2">
            {shown.map((p) => {
              const low = p.confidence < LOW_CONFIDENCE
              const sel = p.id === activeId
              return (
                <article key={p.id} id={`para-${p.id}`} onClick={() => setActiveId(p.id)} className={cn('relative cursor-pointer space-y-1 rounded-lg p-3 transition-colors', sel ? 'bg-ai-container ring-2 ring-ai-accent' : 'bg-surface-variant/40 hover:bg-surface-variant')}>
                  <p className="font-body-editor text-body-editor leading-relaxed text-text-primary">{p.text}</p>
                  <div className="flex items-center gap-2 font-caption text-caption text-text-secondary">
                    <span>Trang {p.page}</span>
                    {low && (
                      <span className="inline-flex items-center gap-1 font-semibold text-status-warning-text">
                        <Icon name="warning" size={13} />
                        Nhận dạng chưa chắc chắn, hãy đối chiếu bản gốc
                      </span>
                    )}
                  </div>
                  {summary[p.id] && (
                    <p className="rounded-md border border-dashed border-ai-accent bg-surface p-2 font-body-default text-body-default text-text-primary">
                      <span className="mr-1 font-semibold text-ai-accent">Gợi ý tóm tắt:</span>
                      {summary[p.id]}
                    </p>
                  )}
                  {sel && (
                    <div role="toolbar" aria-label="Hành động trên đoạn đã chọn" className="flex flex-wrap items-center gap-1 pt-1">
                      <Button size="xs" variant="subtle" icon="summarize" onClick={() => act('summary')} className="text-text-primary">Tóm tắt</Button>
                      <Button size="xs" variant="subtle" icon="table_chart" onClick={() => act('table')} className="text-text-primary">Trích bảng</Button>
                      <Button size="xs" variant="subtle" icon="note_add" onClick={() => act('note')} lockedReason={locked} className="text-text-primary">Tạo ghi chú</Button>
                      <Button size="xs" icon="add_task" onClick={() => act('task')} lockedReason={locked}>Tạo việc</Button>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
