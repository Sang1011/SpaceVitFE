import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface DrawerProps {
  open?: boolean
  header?: ReactNode
  footer?: ReactNode
  children: ReactNode
  /** Tailwind width class, 520px in the task drawer. */
  widthClass?: string
  className?: string
}

/**
 * Right-docked panel. The parent must be `relative` (the board canvas); the drawer sits
 * absolutely on the right edge like in the Stitch W8 screen.
 */
export function Drawer({ open = true, header, footer, children, widthClass = 'w-[520px]', className }: DrawerProps) {
  if (!open) return null
  return (
    <aside
      role="complementary"
      className={cn('absolute bottom-0 right-0 top-0 z-30 flex max-h-[840px] flex-col overflow-hidden rounded-2xl bg-surface shadow-xl', widthClass, className)}
    >
      {header && <div className="flex shrink-0 items-center justify-between gap-space-sm border-b border-border bg-surface p-space-md">{header}</div>}
      <div className="flex-1 space-y-space-lg overflow-y-auto p-space-lg">{children}</div>
      {footer && <div className="flex shrink-0 items-center justify-between gap-space-sm border-t border-border bg-surface p-space-md">{footer}</div>}
    </aside>
  )
}
