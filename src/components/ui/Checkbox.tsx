import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface CheckboxProps extends Omit<ComponentProps<'input'>, 'type' | 'children'> {
  tone?: 'ai' | 'brand'
  label?: ReactNode
}

export function Checkbox({ tone = 'brand', label, className, disabled, ...props }: CheckboxProps) {
  const box = (
    <input
      type="checkbox"
      disabled={disabled}
      className={cn(
        'h-4 w-4 rounded',
        tone === 'ai' ? 'accent-ai-accent' : 'accent-brand',
        disabled ? 'cursor-not-allowed accent-text-secondary' : 'cursor-pointer',
        className,
      )}
      {...props}
    />
  )
  if (!label) return box
  return (
    <label className={cn('inline-flex items-center gap-2 font-body-default text-body-default text-text-primary', disabled && 'cursor-not-allowed opacity-70')}>
      {box}
      {label}
    </label>
  )
}
