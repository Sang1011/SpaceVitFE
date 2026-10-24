import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'
import { Icon } from './Icon'

export const badgeVariants = cva('inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full', {
  variants: {
    tone: {
      neutral: 'bg-surface-variant text-text-secondary',
      primary: 'bg-surface-container text-brand',
      'primary-solid': 'bg-primary-container text-on-primary',
      ai: 'bg-ai-container text-ai-accent',
      'ai-strong': 'bg-secondary-fixed text-ai-accent',
      success: 'bg-status-success/15 text-status-success',
      warning: 'bg-status-warning/15 text-status-warning',
      error: 'bg-status-error/15 text-status-error',
      'error-solid': 'bg-status-error text-on-primary',
    },
    size: {
      xs: 'px-1.5 py-0.5 text-[10px]',
      sm: 'px-2 py-0.5 text-[11px]',
      md: 'px-2.5 py-1 text-caption',
    },
    mono: { true: 'font-label-mono text-label-mono', false: 'font-caption text-caption' },
    shape: { pill: '', circle: 'h-5 w-5 justify-center p-0 font-bold' },
  },
  compoundVariants: [
    // font-* and text-caption/label-mono would override size; re-apply size last via cn() below.
  ],
  defaultVariants: { tone: 'neutral', size: 'sm', mono: false, shape: 'pill' },
})

const sizeText = { xs: 'text-[10px]', sm: 'text-[11px]', md: '' } as const

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  icon?: string
  dot?: boolean
  pulse?: boolean
  bold?: boolean
  className?: string
  children?: ReactNode
}

export function Badge({ tone, size, mono, shape, icon, dot, pulse, bold, className, children }: BadgeProps) {
  const s = size ?? 'sm'
  return (
    <span className={cn(badgeVariants({ tone, size, mono, shape }), sizeText[s], bold && 'font-bold', className)}>
      {dot && (
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          {pulse && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />}
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  )
}
