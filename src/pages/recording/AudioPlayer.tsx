import { useEffect, useMemo, useState } from 'react'
import { Icon } from '../../components/ui'
import { cn } from '../../lib/cn'
import { formatDuration } from '../../lib/format'
import { recordingMeta } from '../../mocks/recording'

const speeds = [0.75, 1, 1.25, 1.5]

/** Sóng âm giả lập, cố định giữa các lần render. */
function useBars(n: number) {
  return useMemo(() => Array.from({ length: n }, (_, i) => 6 + Math.round(Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.45)) * 20)), [n])
}

export interface AudioPlayerProps {
  position: number
  onPositionChange: (sec: number) => void
  /** Ảnh tĩnh cho demo: không tự chạy đồng hồ. */
  frozen?: boolean
}

/** Thanh phát một hàng, dính ngay dưới thanh trên khi cuộn trang. */
export function AudioPlayer({ position, onPositionChange, frozen }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(!frozen)
  const [speed, setSpeed] = useState(1)
  const total = recordingMeta.durationSec
  const bars = useBars(90)
  const playhead = Math.min(bars.length - 1, Math.floor((position / total) * bars.length))

  // Đồng hồ giả lập khi đang phát; sẽ thay bằng audio thật.
  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => onPositionChange(Math.min(total, position + speed)), 1000)
    return () => clearInterval(t)
  }, [playing, position, speed, total, onPositionChange])

  const skip = (d: number) => onPositionChange(Math.max(0, Math.min(total, position + d)))
  const iconBtn = 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-variant text-text-primary outline-none transition-transform hover:bg-surface-container-high focus-visible:ring-2 focus-visible:ring-brand active:scale-95'

  return (
    <section aria-label="Trình phát ghi âm" className="sticky top-[72px] z-30 flex items-center gap-space-sm rounded-xl bg-surface px-space-md py-2 shadow-md">
      <button type="button" title="Lùi 10 giây" aria-label="Lùi 10 giây" onClick={() => skip(-10)} className={iconBtn}>
        <Icon name="replay_10" size={20} />
      </button>
      <button
        type="button"
        title={playing ? 'Tạm dừng' : 'Phát'}
        aria-label={playing ? 'Tạm dừng' : 'Phát'}
        onClick={() => setPlaying(!playing)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary shadow-sm outline-none transition-transform hover:bg-primary focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:scale-95"
      >
        <Icon name={playing ? 'pause' : 'play_arrow'} size={24} fill />
      </button>
      <button type="button" title="Tua 10 giây" aria-label="Tua 10 giây" onClick={() => skip(10)} className={iconBtn}>
        <Icon name="forward_10" size={20} />
      </button>
      <span className="shrink-0 font-caption text-caption tabular-nums">
        <span className="font-semibold text-brand">{formatDuration(position)}</span>
        <span className="text-text-secondary"> / {recordingMeta.duration}</span>
      </span>
      <div
        role="slider"
        aria-label="Vị trí phát"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={Math.round(position)}
        aria-valuetext={formatDuration(position)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') skip(10)
          if (e.key === 'ArrowLeft') skip(-10)
        }}
        className="flex h-8 min-w-0 flex-1 cursor-pointer items-center justify-between gap-px overflow-hidden rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {bars.map((h, i) => (
          <button
            key={i}
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => onPositionChange((i / bars.length) * total)}
            style={{ height: h }}
            className={cn('w-[3px] shrink-0 rounded-full', i < playhead ? 'bg-brand' : i === playhead ? 'bg-recording-red' : 'bg-text-secondary/30')}
          />
        ))}
      </div>
      <label className="flex shrink-0 items-center">
        <span className="sr-only">Tốc độ phát</span>
        <select
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="h-8 rounded-lg bg-surface-variant px-2 font-caption text-caption text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          {speeds.map((s) => (
            <option key={s} value={s}>{s}x</option>
          ))}
        </select>
      </label>
    </section>
  )
}
