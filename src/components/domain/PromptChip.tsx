import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

const chip = cva('flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full font-body-medium text-body-medium text-[12px] transition-colors', {
  variants: {
    tone: {
      /** Assistant dock (W10) */
      default: 'bg-surface-variant px-3 py-1.5 text-text-primary shadow-sm hover:bg-ai-container hover:text-ai-accent',
      /** Inside an AiContainer (W3) */
      translucent: 'bg-surface/80 px-3 py-1 text-text-primary shadow-xs hover:bg-surface hover:text-ai-accent',
    },
  },
  defaultVariants: { tone: 'default' },
})

export interface PromptChipProps extends VariantProps<typeof chip> {
  children: ReactNode
  onPick?: () => void
  /** Prefix with the AI sparkle character. */
  sparkle?: boolean
  className?: string
}

export function PromptChip({ tone, children, onPick, sparkle, className }: PromptChipProps) {
  return (
    <button type="button" onClick={onPick} className={cn(chip({ tone }), className)}>
      {sparkle && <span aria-hidden="true">✦</span>}
      <span>{children}</span>
    </button>
  )
}
