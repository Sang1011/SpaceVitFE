import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'
import { Icon } from './Icon'

const avatarVariants = cva('relative inline-flex shrink-0 items-center justify-center rounded-full', {
  variants: {
    size: {
      5: 'h-5 w-5 font-label-mono text-[10px]',
      6: 'h-6 w-6 font-caption text-[10px]',
      7: 'h-7 w-7 font-caption text-[11px]',
      8: 'h-8 w-8 font-caption text-[12px]',
      9: 'h-9 w-9 font-card-title text-card-title',
    },
    tone: {
      muted: 'bg-surface-variant text-text-secondary',
      'brand-muted': 'bg-surface-variant text-brand',
      neutral: 'bg-surface-container-high text-text-secondary',
      primary: 'bg-primary-fixed text-brand',
      ai: 'bg-secondary-fixed text-secondary',
      solid: 'bg-primary text-on-primary',
      container: 'bg-primary-container text-on-primary',
    },
    bordered: { true: 'border-2 border-surface', false: '' },
  },
  defaultVariants: { size: 7, tone: 'muted', bordered: false },
})

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  initials?: string
  /** Show a person icon instead of initials. */
  icon?: string
  presence?: boolean
  className?: string
}

export function Avatar({ initials, icon, presence, size, tone, bordered, className }: AvatarProps) {
  return (
    <span className={cn(avatarVariants({ size, tone, bordered }), className)}>
      {icon ? <Icon name={icon} size={18} /> : initials}
      {presence && (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-status-success ring-2 ring-surface" />
      )}
    </span>
  )
}

export interface AvatarStackProps {
  members: { initials: string; tone?: AvatarProps['tone'] }[]
  max?: number
  size?: AvatarProps['size']
  className?: string
}

export function AvatarStack({ members, max = 3, size = 7, className }: AvatarStackProps) {
  const shown = members.slice(0, max)
  const rest = members.length - shown.length
  return (
    <div className={cn('flex items-center -space-x-2', className)}>
      {shown.map((m, i) => (
        <Avatar key={i} initials={m.initials} tone={m.tone ?? (['neutral', 'ai', 'primary'] as const)[i % 3]} size={size} bordered />
      ))}
      {rest > 0 && <Avatar initials={`+${rest}`} tone="muted" size={size} bordered className="font-semibold" />}
    </div>
  )
}
