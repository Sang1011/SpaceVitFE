import { useEffect, useMemo, useState } from 'react'
import { Icon } from '../../components/ui'
import { cn } from '../../lib/cn'
import { fmt, recordingMeta } from '../../mocks/recording'

const speeds = ['0.75x', '1.0x', '1.25x', '1.5x']

/** Deterministic pseudo-waveform: same bars on every render. */
function useBars(n: number) {
  return useMemo(() => Array.from({ length: n }, (_, i) => 12 + Math.round(Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.45)) * 44)), [n])
}

export interface AudioPlayerProps {
  position: number
  onPositionChange: (sec: number) => void
}

export function AudioPlayer({ position, onPositionChange }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(true)
  const [speed, setSpeed] = useState('1.0x')
  const total = recordingMeta.durationSec
  const bars = useBars(70)
  const playhead = Math.min(bars.length - 1, Math.floor((position / total) * bars.length))

  // Demo clock: advances while "playing". Real audio will replace this.
  useEffect(() => {
    if (!playing) return
    const rate = parseFloat(speed)
    const t = setInterval(() => onPositionChange(Math.min(total, position + rate)), 1000)
    return () => clearInterval(t)
  }, [playing, position, speed, total, onPositionChange])

  const skip = (d: number) => onPositionChange(Math.max(0, Math.min(total, position + d)))

  return (
    <section className="flex flex-col gap-space-md rounded-xl bg-surface p-space-md shadow-sm lg:p-space-lg">
      <div className="flex flex-col justify-between gap-space-sm md:flex-row md:items-center">
        <div className="flex items-center gap-space-sm">
          <button type="button" title="Lùi lại 10 giây" aria-label="Lùi lại 10 giây" onClick={() => skip(-10)} className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-variant text-text-primary transition-transform hover:bg-surface-container-high active:scale-95">
            <Icon name="replay_10" size={20} />
          </button>
          <button type="button" title="Phát / Tạm dừng" aria-label={playing ? 'Tạm dừng' : 'Phát'} onClick={() => setPlaying(!playing)} className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-on-primary shadow-md transition-transform hover:bg-primary active:scale-95">
            <Icon name={playing ? 'pause' : 'play_arrow'} size={28} fill />
          </button>
          <button type="button" title="Tua tới 10 giây" aria-label="Tua tới 10 giây" onClick={() => skip(10)} className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-variant text-text-primary transition-transform hover:bg-surface-container-high active:scale-95">
            <Icon name="forward_10" size={20} />
          </button>
          <div className="mx-1 h-6 w-px bg-surface-variant" />
          <div className="flex items-baseline gap-1 font-label-mono text-label-mono">
            <span className="font-semibold text-brand">{fmt(position)}</span>
            <span className="text-text-secondary">/</span>
            <span className="text-text-secondary">{recordingMeta.duration}</span>
          </div>
        </div>
        <div className="flex items-center gap-space-md self-end md:self-auto">
          <div role="group" aria-label="Tốc độ phát" className="flex items-center rounded-lg bg-surface-variant p-1 text-text-secondary">
            {speeds.map((s) => (
              <button key={s} type="button" onClick={() => setSpeed(s)} aria-pressed={speed === s} className={cn('rounded px-2.5 py-1 font-caption text-caption', speed === s ? 'bg-surface font-semibold text-brand shadow-xs' : 'hover:text-text-primary')}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <Icon name="volume_up" size={20} />
            <div className="relative h-1.5 w-20 cursor-pointer rounded-full bg-surface-variant">
              <div className="absolute left-0 top-0 h-full w-3/4 rounded-full bg-brand" />
            </div>
          </div>
        </div>
      </div>

      <div
        role="slider"
        aria-label="Vị trí phát"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={Math.round(position)}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') skip(10); if (e.key === 'ArrowLeft') skip(-10) }}
        className="flex h-16 w-full cursor-pointer items-center justify-between gap-1 overflow-hidden rounded-lg bg-surface-variant/60 p-2.5"
      >
        {bars.map((h, i) => (
          <button
            key={i}
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => onPositionChange((i / bars.length) * total)}
            style={{ height: h }}
            className={cn('relative w-1 shrink-0 rounded-full', i < playhead ? 'bg-brand' : i === playhead ? 'bg-recording-red' : 'bg-text-secondary/30')}
          >
            {i === playhead && <span className="absolute -top-3 left-1/2 h-2 w-2 -translate-x-1/2 animate-ping rounded-full bg-recording-red" />}
          </button>
        ))}
      </div>
    </section>
  )
}
