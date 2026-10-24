import type { ComponentProps } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from './Icon'

const base =
  'w-full h-9 rounded-lg bg-surface-variant border border-border text-text-primary placeholder:text-text-secondary font-body-default text-body-default focus:outline-none focus:ring-2 focus:ring-brand focus:bg-surface'

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(base, 'px-3', className)} {...props} />
}

export interface SearchInputProps extends ComponentProps<'input'> {
  /** Keyboard hint on the right, e.g. "⌘K". */
  hint?: string
  /** Smaller variant used in filter bars (h-8, thin ring). */
  compact?: boolean
}

export function SearchInput({ hint, compact, className, ...props }: SearchInputProps) {
  return (
    <div className="relative flex items-center">
      <Icon
        name="search"
        size={compact ? 16 : 18}
        className={cn('absolute text-text-secondary', compact ? 'left-2.5' : 'left-3')}
      />
      <input
        type="text"
        className={cn(base, compact ? 'h-8 pl-8 pr-3 focus:ring-1 focus:bg-surface-variant' : 'pl-9', !compact && (hint ? 'pr-12' : 'pr-3'), className)}
        {...props}
      />
      {hint && (
        <span className="absolute right-2 rounded border border-border bg-surface px-1.5 py-0.5 font-label-mono text-label-mono text-[10px] text-text-secondary">
          {hint}
        </span>
      )}
    </div>
  )
}
