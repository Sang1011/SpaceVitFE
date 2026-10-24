import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'
import { Icon, type IconSize } from './Icon'
import { Tooltip } from './Tooltip'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-body-medium text-body-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary-container text-on-primary hover:bg-primary shadow-sm',
        outline: 'border border-border text-text-primary hover:bg-surface-variant',
        ghost: 'text-text-secondary hover:bg-surface-variant hover:text-text-primary',
        subtle:
          'bg-surface-variant text-text-secondary hover:bg-surface-container-high hover:text-text-primary',
        ai: 'border border-ai-accent/20 bg-ai-container text-ai-accent hover:bg-secondary-fixed',
        'ai-solid': 'bg-ai-accent text-on-primary shadow-sm hover:bg-secondary',
        tonal: 'bg-primary-fixed text-brand hover:bg-primary-container hover:text-on-primary',
        destructive: 'bg-status-error text-on-primary shadow-sm hover:opacity-90 active:scale-95',
        'destructive-outline':
          'border border-status-error/30 text-status-error hover:bg-status-error/10',
      },
      size: {
        xs: 'h-7 px-3 text-[12px]',
        sm: 'h-8 px-3 text-[13px]',
        md: 'h-9 px-3.5 text-[13px]',
        lg: 'px-4 py-2 text-[13px]',
        icon: 'h-12 w-12 p-0 shadow-md active:scale-95',
      },
      shape: { rounded: 'rounded-lg', pill: 'rounded-full', circle: 'rounded-full' },
    },
    defaultVariants: { variant: 'primary', size: 'sm', shape: 'rounded' },
  },
)

const iconSizeFor: Record<string, IconSize> = { xs: 16, sm: 16, md: 16, lg: 16, icon: 24 }

export interface ButtonProps
  extends Omit<ComponentProps<'button'>, 'color'>,
    VariantProps<typeof buttonVariants> {
  icon?: string
  iconRight?: string
  iconFill?: boolean
  loading?: boolean
  /** When set the button is disabled and a tooltip explains why (e.g. viewer role). */
  lockedReason?: string
}

export function Button({
  variant,
  size,
  shape,
  icon,
  iconRight,
  iconFill,
  loading,
  lockedReason,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  const s = size ?? 'sm'
  const isDisabled = disabled || loading || !!lockedReason
  const iconSize = iconSizeFor[s] ?? 16
  const el = (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size, shape: shape ?? (s === 'icon' ? 'circle' : 'rounded') }), className)}
      {...props}
    >
      {loading ? (
        <Icon name="progress_activity" size={iconSize} className="animate-spin" />
      ) : lockedReason ? (
        <Icon name="lock" size={iconSize} />
      ) : icon ? (
        <Icon name={icon} size={iconSize} fill={iconFill} />
      ) : null}
      {children != null && <span>{children}</span>}
      {iconRight && <Icon name={iconRight} size={iconSize} />}
    </button>
  )
  return lockedReason ? <Tooltip content={lockedReason}>{el}</Tooltip> : el
}
