import { cn } from '../../lib/cn'

const tones = { ai: 'bg-ai-accent', brand: 'bg-brand', success: 'bg-status-success', error: 'bg-status-error' } as const

export interface ProgressBarProps {
  /** 0-100 */
  value: number
  tone?: keyof typeof tones
  className?: string
}

export function ProgressBar({ value, tone = 'ai', className }: ProgressBarProps) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-surface', className)}
    >
      {/* width is the one truly dynamic value */}
      <div className={cn('h-full rounded-full transition-all duration-500', tones[tone])} style={{ width: `${v}%` }} />
    </div>
  )
}
