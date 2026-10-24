import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'
import { Icon, type IconSize } from './Icon'

const iconButtonVariants = cva('relative inline-flex items-center justify-center transition-colors', {
  variants: {
    variant: {
      plain: 'p-1 rounded text-text-secondary hover:text-text-primary',
      soft: 'p-1.5 rounded-lg text-text-secondary hover:bg-surface-variant hover:text-text-primary',
      filled:
        'h-9 w-9 rounded-lg bg-surface-variant text-text-secondary hover:bg-surface-container-high hover:text-text-primary',
    },
  },
  defaultVariants: { variant: 'plain' },
})

export interface IconButtonProps
  extends Omit<ComponentProps<'button'>, 'children'>,
    VariantProps<typeof iconButtonVariants> {
  icon: string
  /** Accessible name (required: there is no visible text). */
  label: string
  iconSize?: IconSize
  badgeDot?: boolean
}

export function IconButton({
  icon,
  label,
  iconSize = 20,
  badgeDot,
  variant,
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(iconButtonVariants({ variant }), className)}
      {...props}
    >
      <Icon name={icon} size={iconSize} />
      {badgeDot && (
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-recording-red" aria-hidden="true" />
      )}
    </button>
  )
}
