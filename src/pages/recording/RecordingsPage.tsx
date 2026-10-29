import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button, Icon, ProgressBar, StatusChip } from '../../components/ui'
import { useWorkspace } from '../../context/WorkspaceContext'
import { recordingList, type RecordingListItem } from '../../mocks/recording'

/** Danh sách ghi âm và tải lên (giả lập). Viewer không tải lên được. */
export default function RecordingsPage() {
  const { canEdit, setRole } = useWorkspace()
  const [params] = useSearchParams()
  const [items, setItems] = useState<RecordingListItem[]>(recordingList)
  const [over, setOver] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (params.get('role') === 'viewer') setRole('viewer')
  }, [params, setRole])

  useEffect(() => {
    if (!items.some((i) => i.status === 'processing')) return
    const t = setInterval(() => {
      setItems((list) =>
        list.map((i) => {
          if (i.status !== 'processing') return i
          const p = (i.progress ?? 0) + 6
          return p >= 100 ? { ...i, status: 'completed', progress: 100 } : { ...i, progress: p }
        }),
      )
    }, 1000)
    return () => clearInterval(t)
  }, [items])

  const add = (files: FileList | null) => {
    const f = files?.[0]
    if (!f) return
    setItems((l) => [{ id: `up${l.length}`, title: f.name.replace(/\.[^.]+$/, ''), date: 'Vừa xong', duration: '--:--', status: 'processing', suggested: 0, progress: 5 }, ...l])
  }

  return (
    <div className="space-y-space-lg">
      <header className="flex flex-col justify-between gap-space-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="font-section-title text-section-title text-text-primary">Ghi âm</h1>
          <p className="font-body-default text-body-default text-text-secondary">Tải ghi âm lên để AI chép lời và đề xuất việc cần làm.</p>
        </div>
        <Button icon="upload" onClick={() => input.current?.click()} lockedReason={canEdit ? undefined : 'Bạn chỉ có quyền xem'}>Tải ghi âm lên</Button>
        <input ref={input} type="file" accept="audio/*" className="sr-only" aria-label="Chọn tệp ghi âm" onChange={(e) => add(e.target.files)} />
      </header>

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
          if (canEdit) add(e.dataTransfer.files)
        }}
        className={`flex flex-col items-center gap-1 rounded-xl border-2 border-dashed p-space-lg text-center transition-colors ${over ? 'border-brand bg-brand/5' : 'border-border bg-surface'}`}
      >
        <Icon name="mic" size={28} className="text-text-secondary" />
        <p className="font-body-medium text-body-medium text-text-primary">{canEdit ? 'Kéo thả tệp âm thanh vào đây' : 'Chế độ chỉ xem: không thể tải lên'}</p>
        <p className="font-caption text-caption text-text-secondary">MP3, WAV, M4A. Tối đa 500 MB.</p>
      </div>

      <ul className="divide-y divide-border overflow-hidden rounded-xl bg-surface shadow-sm">
        {items.map((r) => (
          <li key={r.id}>
            <Link to={`/ghi-am/${r.id === 'demo' ? 'demo' : r.id}?state=${r.status}`} className="flex flex-col gap-2 p-space-md outline-none transition-colors hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand sm:flex-row sm:items-center">
              <Icon name="graphic_eq" size={24} className="shrink-0 text-brand" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-card-title text-card-title text-text-primary">{r.title}</p>
                <p className="font-caption text-caption text-text-secondary">
                  {r.date} · {r.duration}
                  {r.suggested > 0 && ` · ${r.suggested} việc đề xuất`}
                </p>
              </div>
              {r.status === 'processing' && <ProgressBar value={r.progress ?? 0} className="w-32" />}
              <StatusChip status={r.status} size="sm" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
