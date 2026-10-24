import { useMemo, useState } from 'react'
import { Avatar, Badge, Button, Icon } from '../../components/ui'
import { cn } from '../../lib/cn'
import { failedChunks, fmt, segments, type Segment } from '../../mocks/recording'

function TimeButton({ sec, onClick }: { sec: number; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 font-label-mono text-label-mono text-text-secondary transition-colors hover:bg-primary-container hover:text-on-primary">
      <Icon name="play_circle" size={16} className="text-[14px]" />
      00:{fmt(sec)}
    </button>
  )
}

function SegmentCard({ seg, current, onSeek, onViewGhost }: { seg: Segment; current: boolean; onSeek: (s: number) => void; onViewGhost: () => void }) {
  if (current) {
    return (
      <article className="relative flex flex-col gap-1.5 overflow-hidden rounded-xl bg-primary-fixed/20 p-space-md shadow-sm">
        <div className="absolute inset-y-0 left-0 w-1.5 bg-primary-container" />
        <div className="flex items-center justify-between pl-2">
          <div className="flex items-center gap-space-sm">
            <Avatar initials={seg.initials} size={7} tone={seg.tone} />
            <span className="font-card-title text-card-title text-text-primary">{seg.speaker}</span>
            <Badge tone="primary-solid" pulse className="gap-1">
              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-on-primary" />
              Đang phát
            </Badge>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-container px-2.5 py-0.5 font-label-mono text-label-mono text-on-primary">
            <Icon name="graphic_eq" size={16} className="text-[14px]" />
            00:{fmt(seg.start)}
          </span>
        </div>
        <p className="pl-11 font-body-editor text-body-editor font-medium leading-relaxed text-text-primary">{seg.text}</p>
        {seg.extracted && (
          <div className="flex items-center gap-2 pl-11 pt-1">
            <Badge tone="ai" className="gap-1"><span>✦</span> Đã trích xuất {seg.extracted} hành động</Badge>
            <button type="button" onClick={onViewGhost} className="font-caption text-caption text-brand hover:underline">Xem ghost task →</button>
          </div>
        )}
      </article>
    )
  }
  return (
    <article onClick={() => onSeek(seg.start)} className="flex cursor-pointer flex-col gap-1.5 rounded-xl bg-surface-variant/40 p-space-md transition-colors hover:bg-surface-variant">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <Avatar initials={seg.initials} size={7} tone={seg.tone} />
          <span className="font-card-title text-card-title text-text-primary">{seg.speaker}</span>
          {seg.role && <Badge>{seg.role}</Badge>}
        </div>
        <TimeButton sec={seg.start} onClick={() => onSeek(seg.start)} />
      </div>
      <p className="pl-9 font-body-editor text-body-editor leading-relaxed text-text-primary">{seg.text}</p>
    </article>
  )
}

export function FailedChunkRow({ range, label, onRetry, locked }: { range: string; label: string; onRetry: () => void; locked?: string }) {
  return (
    <div role="alert" className="flex flex-col justify-between gap-space-sm rounded-xl border border-status-error/20 bg-status-error/15 p-space-md sm:flex-row sm:items-center">
      <div className="flex items-start gap-space-sm">
        <Icon name="warning" size={20} className="mt-0.5 shrink-0 text-status-error sm:mt-0" />
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Badge tone="error-solid" mono bold>{range}</Badge>
            <span className="font-caption text-caption font-medium text-status-error">{label}</span>
          </div>
          <p className="font-caption text-caption text-text-secondary">[Phân đoạn âm thanh bị gián đoạn - Bấm để thử lại STT]</p>
        </div>
      </div>
      <Button variant="destructive" size="xs" icon="refresh" onClick={onRetry} lockedReason={locked} className="shrink-0 px-3 py-1.5 font-caption text-caption">
        Thử lại STT
      </Button>
    </div>
  )
}

export interface TranscriptPanelProps {
  position: number
  onSeek: (sec: number) => void
  failed: boolean
  onRetry: (id: string) => void
  retryLocked?: string
  onViewGhost: () => void
}

export function TranscriptPanel({ position, onSeek, failed, onRetry, retryLocked, onViewGhost }: TranscriptPanelProps) {
  const [q, setQ] = useState('')
  const currentId = useMemo(() => [...segments].reverse().find((s) => s.start <= position)?.id ?? segments[0].id, [position])
  const needle = q.trim().toLowerCase()
  const list = needle ? segments.filter((s) => s.text.toLowerCase().includes(needle) || s.speaker.toLowerCase().includes(needle)) : segments

  return (
    <div className="flex flex-col gap-space-md rounded-xl bg-surface p-space-lg shadow-sm">
      <div className="flex flex-col justify-between gap-space-sm bg-surface pb-space-sm sm:flex-row sm:items-center">
        <div>
          <h2 className="font-section-title text-section-title text-text-primary">Bản ghi lời thoại (Transcript)</h2>
          <p className="font-caption text-caption text-text-secondary">Nhận diện 3 người tham gia · Đồng bộ từng giây</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm kiếm lời thoại..."
            className="h-9 w-full rounded-lg bg-surface-variant pl-9 pr-8 font-body-default text-body-default text-text-primary placeholder:text-text-secondary transition-all focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <Icon name="tune" size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-text-secondary" />
        </div>
      </div>
      <div className="space-y-space-md">
        {list.length === 0 && <p className="py-6 text-center font-body-default text-body-default text-text-secondary">Không có đoạn thoại khớp "{q}".</p>}
        {list.map((seg) => (
          <div key={seg.id} className={cn('space-y-space-md')}>
            {failed && !needle && failedChunks.filter((c) => c.before === seg.id).map((c) => (
              <FailedChunkRow key={c.id} range={c.range} label={c.label} onRetry={() => onRetry(c.id)} locked={retryLocked} />
            ))}
            <SegmentCard seg={seg} current={seg.id === currentId} onSeek={onSeek} onViewGhost={onViewGhost} />
          </div>
        ))}
      </div>
    </div>
  )
}
