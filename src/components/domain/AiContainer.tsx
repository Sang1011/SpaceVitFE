import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'
import { Icon } from '../ui'

const container = cva('relative overflow-hidden bg-ai-container', {
  variants: {
    size: {
      sm: 'rounded-xl p-space-md shadow-sm',
      md: 'rounded-xl p-5 shadow-md',
      lg: 'rounded-2xl p-space-lg shadow-sm',
    },
  },
  defaultVariants: { size: 'lg' },
})

export interface AiContainerProps extends VariantProps<typeof container> {
  /** Heading row: sparkle tile + title (+ badge on the right of the title). */
  title?: ReactNode
  badge?: ReactNode
  /** Small caption aligned to the right of the heading row. */
  hint?: ReactNode
  /** Hide the violet left bar. */
  noBar?: boolean
  children?: ReactNode
  className?: string
}

/**
 * Violet container that marks AI-generated content. The 3px left bar is drawn once here
 * (Stitch used 4 different implementations: inset shadow, border-left, accent div).
 */
export function AiContainer({ size, title, badge, hint, noBar, children, className }: AiContainerProps) {
  return (
    <div className={cn(container({ size }), className)}>
      {!noBar && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] bg-ai-accent" />}
      {title && (
        <div className="mb-3 flex flex-col justify-between gap-space-sm md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface text-ai-accent shadow-sm">
              <Icon name="auto_awesome" size={18} />
            </div>
            <span className="flex items-center gap-1.5 font-card-title text-card-title text-text-primary">{title}</span>
            {badge && (
              <span className="rounded-full bg-surface/80 px-2 py-0.5 font-label-mono text-label-mono text-[11px] font-medium text-ai-accent">
                {badge}
              </span>
            )}
          </div>
          {hint && <span className="font-caption text-caption text-[12px] text-text-secondary">{hint}</span>}
        </div>
      )}
      {children}
    </div>
  )
}
