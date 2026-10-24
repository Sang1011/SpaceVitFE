import { cva } from 'class-variance-authority'
import { cn } from '../../lib/cn'
import { Icon } from '../ui'

export type SourceKind = 'audio' | 'note' | 'document'

const kindIcon: Record<SourceKind, { name: string; color: string }> = {
  audio: { name: 'mic', color: 'text-recording-red' },
  note: { name: 'edit_note', color: 'text-brand' },
  document: { name: 'description', color: 'text-text-secondary' },
}

const chip = cva('inline-flex items-center gap-1 rounded-full font-label-mono text-label-mono transition-colors', {
  variants: {
    tone: {
      muted: 'bg-surface-variant text-text-secondary',
      raised: 'bg-surface text-text-secondary shadow-xs',
    },
    size: { xs: 'px-2 py-0.5 text-[10px]', sm: 'px-2 py-0.5 text-[11px]' },
    interactive: { true: 'cursor-pointer hover:bg-surface-container-high', false: '' },
  },
  defaultVariants: { tone: 'muted', size: 'sm', interactive: false },
})

export interface SourceChipProps {
  kind: SourceKind
  /** Source title, e.g. "Họp sprint 12". Omit to show only the location. */
  label?: string
  /** Timestamp, page or section, e.g. "12:34", "tr.3", "Mục 4.2". */
  location?: string
  tone?: 'muted' | 'raised'
  size?: 'xs' | 'sm'
  onClick?: () => void
  className?: string
}

/** Citation to the origin of an AI-derived item (recording timestamp, note, document page). */
export function SourceChip({ kind, label, location, tone, size, onClick, className }: SourceChipProps) {
  const icon = kindIcon[kind]
  const body = (
    <>
      <Icon name={icon.name} size={13} className={icon.color} />
      {label && <span className="max-w-[140px] truncate">{label}</span>}
      {location && <span className={label ? 'text-text-secondary/70' : undefined}>{label ? `· ${location}` : location}</span>}
    </>
  )
  const cls = cn(chip({ tone, size, interactive: !!onClick }), className)
  return onClick ? (
    <button type="button" onClick={onClick} className={cls}>
      {body}
    </button>
  ) : (
    <span className={cls}>{body}</span>
  )
}
