import { useEffect, useMemo, useRef, useState } from 'react'
import { Avatar, Badge, Button, Icon, Skeleton, SkeletonGroup } from '../../components/ui'
import { cn } from '../../lib/cn'
import { formatDuration } from '../../lib/format'
import { failedChunks, segmentAt, segments, type RecStatus, type Segment } from '../../mocks/recording'

function TimeButton({ sec, onClick }: { sec: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      aria-label={`Nhảy tới ${formatDuration(sec)}`}
      className="inline-flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 font-caption text-caption tabular-nums text-text-secondary outline-none transition-colors hover:bg-primary-container hover:text-on-primary focus-visible:ring-2 focus-visible:ring-brand"
    >
      <Icon name="play_circle" size={13} />
      {formatDuration(sec)}
    </button>
  )
}

/** Tên người nói bấm để đổi; đổi một lần là áp dụng cho mọi đoạn của người đó. */
function SpeakerName({ name, onRename, readOnly }: { name: string; onRename: (n: string) => void; readOnly?: boolean }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(name)
  const done = (save: boolean) => {
    setEditing(false)
    const v = draft.trim()
    if (save && v && v !== name) onRename(v)
    else setDraft(name)
  }
  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        aria-label="Tên người nói"
        onChange={(e) => setDraft(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        onBlur={() => done(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') done(true)
          if (e.key === 'Escape') {
            e.stopPropagation()
            done(false)
          }
        }}
        className="h-7 w-44 rounded-md border border-border-strong bg-surface px-2 font-card-title text-card-title text-[14px] text-text-primary outline-none focus:ring-2 focus:ring-brand"
      />
    )
  }
  return (
    <button
      type="button"
      disabled={readOnly}
      title={readOnly ? undefined : 'Bấm để đổi tên người nói'}
      onClick={(e) => {
        e.stopPropagation()
        setDraft(name)
        setEditing(true)
      }}
      className="group inline-flex items-center gap-1 rounded-md px-1 font-card-title text-card-title text-[14px] text-text-primary outline-none hover:bg-surface-container focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-default disabled:hover:bg-transparent"
    >
      {name}
      {!readOnly && <Icon name="edit" size={13} className="text-text-secondary opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100" />}
    </button>
  )
}

interface SegProps {
  seg: Segment
  speaker: string
  current: boolean
  readOnly?: boolean
  onSeek: (s: number) => void
  onRename: (n: string) => void
  onViewSuggestions: () => void
}

function SegmentCard({ seg, speaker, current, readOnly, onSeek, onRename, onViewSuggestions }: SegProps) {
  return (
    <article
      id={`seg-${seg.id}`}
      aria-current={current ? 'true' : undefined}
      onClick={() => onSeek(seg.start)}
      className={cn(
        'relative flex cursor-pointer flex-col gap-1.5 overflow-hidden rounded-xl p-space-md transition-colors',
        current ? 'bg-primary-fixed/30 shadow-sm' : 'bg-surface-variant/40 hover:bg-surface-variant',
      )}
    >
      {current && <div className="absolute inset-y-0 left-0 w-1.5 bg-primary-container" />}
      <div className={cn('flex flex-wrap items-center gap-space-sm', current && 'pl-2')}>
        <Avatar initials={seg.initials} size={7} tone={seg.tone} />
        <SpeakerName name={speaker} onRename={onRename} readOnly={readOnly} />
        {seg.role && <Badge>{seg.role}</Badge>}
        <TimeButton sec={seg.start} onClick={() => onSeek(seg.start)} />
        {current && (
          <Badge tone="primary-solid" pulse className="gap-1">
            Đang phát
          </Badge>
        )}
      </div>
      <p className={cn('pl-9 font-body-editor text-body-editor leading-relaxed text-text-primary', current && 'pl-11 font-medium')}>{seg.text}</p>
      {seg.extracted ? (
        <div className={cn('flex items-center gap-2 pl-9 pt-1', current && 'pl-11')}>
          <Badge tone="ai">Đã đề xuất {seg.extracted} việc</Badge>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onViewSuggestions()
            }}
            className="rounded font-caption text-caption text-brand outline-none hover:underline focus-visible:ring-2 focus-visible:ring-brand"
          >
            Xem việc đề xuất →
          </button>
        </div>
      ) : null}
    </article>
  )
}

export function FailedChunkRow({ range, label, onRetry, locked }: { range: string; label: string; onRetry: () => void; locked?: string }) {
  return (
    <div role="alert" className="flex flex-col justify-between gap-space-sm rounded-xl border border-status-error/20 bg-status-error/15 p-space-md sm:flex-row sm:items-center">
      <div className="flex items-start gap-space-sm">
        <Icon name="warning" size={20} className="mt-0.5 shrink-0 text-status-error-text sm:mt-0" />
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Badge tone="error-solid" bold>{range}</Badge>
            <span className="font-caption text-caption font-medium text-status-error-text">{label}</span>
          </div>
          <p className="font-caption text-caption text-text-secondary">Đoạn âm thanh này chưa được chép lời. Bấm Thử lại để nhận diện lại.</p>
        </div>
      </div>
      <Button variant="destructive" size="xs" icon="refresh" onClick={onRetry} lockedReason={locked} className="shrink-0 px-3 py-1.5">
        Thử lại
      </Button>
    </div>
  )
}

export interface TranscriptPanelProps {
  status: RecStatus
  position: number
  onSeek: (sec: number) => void
  /** Tăng mỗi lần có yêu cầu cuộn tới một đoạn (ví dụ bấm mốc ở tab Tóm tắt). */
  jump: { sec: number; n: number } | null
  speakers: Record<string, string>
  onRename: (initials: string, name: string) => void
  onRetry: (id: string) => void
  retryLocked?: string
  readOnly?: boolean
  onViewSuggestions: () => void
}

export function TranscriptPanel({ status, position, onSeek, jump, speakers, onRename, onRetry, retryLocked, readOnly, onViewSuggestions }: TranscriptPanelProps) {
  const [q, setQ] = useState('')
  const root = useRef<HTMLDivElement>(null)
  const currentId = useMemo(() => segmentAt(position).id, [position])
  const needle = q.trim().toLowerCase()
  // Có kết quả một phần: chỉ hiện các đoạn đã chép; đang xử lý hoặc lỗi hẳn: chưa có đoạn nào.
  const available = status === 'partial_ready' ? segments.slice(0, 2) : status === 'processing' || status === 'failed' ? [] : segments
  const nameOf = (s: Segment) => speakers[s.initials] ?? s.speaker
  const list = needle ? available.filter((s) => s.text.toLowerCase().includes(needle) || nameOf(s).toLowerCase().includes(needle)) : available
  const failed = status === 'partial_failed'

  useEffect(() => {
    if (!jump) return
    root.current?.querySelector(`#seg-${segmentAt(jump.sec).id}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [jump])

  return (
    <div ref={root} className="flex flex-col gap-space-md rounded-xl bg-surface p-space-lg shadow-sm">
      <div className="flex flex-col justify-between gap-space-sm sm:flex-row sm:items-center">
        <div>
          <h2 className="font-section-title text-section-title text-text-primary">Bản chép lời</h2>
          <p className="font-caption text-caption text-text-secondary">3 người nói · bấm mốc thời gian để nghe lại đoạn đó</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Tìm trong bản chép lời"
            placeholder="Tìm trong bản chép lời..."
            className="h-9 w-full rounded-lg bg-surface-variant pl-9 pr-3 font-body-default text-body-default text-text-primary placeholder:text-text-secondary transition-all focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>

      {(status === 'processing' || status === 'partial_ready') && (
        <SkeletonGroup label="Đang chép lời" className="space-y-space-sm">
          {status === 'processing' && <p className="font-body-default text-body-default text-text-secondary">Đang chép lời, kết quả sẽ hiện dần ở đây.</p>}
          {status === 'partial_ready' && <p className="font-caption text-caption text-text-secondary">Đang chép tiếp các đoạn còn lại.</p>}
          {status === 'processing' && (
            <>
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </>
          )}
        </SkeletonGroup>
      )}
      {status === 'failed' && (
        <p className="rounded-xl bg-surface-variant p-space-md text-center font-body-default text-body-default text-text-secondary">Chưa có bản chép lời vì xử lý không thành công.</p>
      )}

      <div className="space-y-space-md">
        {list.length === 0 && available.length > 0 && <p className="py-6 text-center font-body-default text-body-default text-text-secondary">Không có đoạn thoại khớp "{q}".</p>}
        {list.map((seg) => (
          <div key={seg.id} className="space-y-space-md">
            {failed && !needle && failedChunks.filter((c) => c.before === seg.id).map((c) => (
              <FailedChunkRow key={c.id} range={c.range} label={c.label} onRetry={() => onRetry(c.id)} locked={retryLocked} />
            ))}
            <SegmentCard
              seg={seg}
              speaker={nameOf(seg)}
              current={seg.id === currentId}
              readOnly={readOnly}
              onSeek={onSeek}
              onRename={(n) => onRename(seg.initials, n)}
              onViewSuggestions={onViewSuggestions}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
