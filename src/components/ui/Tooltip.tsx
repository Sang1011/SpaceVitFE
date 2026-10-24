import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface TooltipProps {
  content: ReactNode
  children: ReactNode
  side?: 'top' | 'bottom'
  className?: string
}

/** CSS-only tooltip: works on disabled buttons (hover is on the wrapper). */
export function Tooltip({ content, children, side = 'bottom', className }: TooltipProps) {
  return (
    <span className={cn('group/tip relative inline-flex', className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-text-primary px-2 py-1',
          'font-caption text-caption text-surface opacity-0 shadow-md transition-opacity',
          'group-hover/tip:opacity-100 group-focus-within/tip:opacity-100',
          side === 'bottom' ? 'top-full mt-1.5' : 'bottom-full mb-1.5',
        )}
      >
        {content}
      </span>
    </span>
  )
}
